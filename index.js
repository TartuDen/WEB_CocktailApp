import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const port = 8080;
const app = express();
const baseUrl = "https://www.thecocktaildb.com/api/json/v1/1";
const searchByLetter = "/search.php?f="
const searchByID = "/lookup.php?i="
const randomSearch = "/random.php"
let ingredients = {};
let dataForClient = null;
let err = null;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function getRandom() {
    try {
        dataForClient = await axios.get(baseUrl + randomSearch)
        dataForClient = dataForClient.data
    } catch {
        console.error("Faild to get random data")
    }
}
getRandom();


app.post("/search", async (req, res) => {
    err = null;
    let formReq = req.body["cocktail"];
    let category = req.body["category"];
    ingredients = {};
    if (formReq.length === 1 && typeof formReq === 'string') {
        try {
            let response = await axios.get(baseUrl + searchByLetter + formReq)
            dataForClient = (response.data)
            if (dataForClient.drinks === null) {
                // Throw an error to redirect to the catch block
                throw new Error('No data available');
            }

        } catch (error) {
            // Handle the error
            console.error(error);
            err = error

        }
    } else if (!isNaN(parseInt(formReq))) { // Check if formReq can be parsed into a number
        try {
            const response = await axios.get(baseUrl + searchByID + formReq);
            dataForClient = response.data;
            // Check if dataForClient is null
            if (dataForClient.drinks === null) {
                // Throw an error to redirect to the catch block
                throw new Error('Wrong id...');
            } else {
                for (let i = 1; i < 11; i++) {
                    let ingName = (dataForClient.drinks[0]["strIngredient" + i]);
                    if (ingName !== null) {
                        try {
                            let ingDescription = await axios.get(baseUrl + "/search.php?i=" + ingName)
                            // console.log("ingDescription");
                            // console.log(baseUrl + "/search.php?i=" + ingName);
                            // console.log(ingDescription.data);
                            
                            ingredients[ingName] = ingDescription.data["ingredients"]
                        } catch{
                            console.error("couldn't get ingredient");
                        }
                    }
                }
            }
        } catch (error) {
            // Handle the error
            console.error(error);
            err = error

        }
    } else {


        try {
            dataForClient = await axios.get(baseUrl + category + formReq)
            dataForClient = dataForClient.data
            if (dataForClient.drinks === null || dataForClient.ingredients === null || dataForClient.length === 0) {
                // Throw an error to redirect to the catch block
                throw new Error('Wrong input...');
            }
        } catch (error) {
            err = error
        }

    }
    res.status(200).redirect("/");
})

app.get("/", (req, res) => {
    res.status(200).render("index.ejs", { dataForClient, err, ingredients });
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log("server is running on port " + port);
})
