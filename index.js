import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const port = 8080;
const app = express();
const baseUrl = "https://www.thecocktaildb.com/api/json/v1/1";
const searchByLetter = "/search.php?f="
const searchByName = "/search.php?s=";
const searchByAlcohol = "/search.php?i="
const searchByID = "/lookup.php?i="
const randomSearch = "/random.php"
const searchByIngredient  = "/filter.php?i="
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
    let formReq = req.body["coctail"];
    let category = req.body["category"];
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

        } catch(error) {
            err = error
        }
        

    }
    res.status(200).redirect("/");
})

app.get("/", (req, res) => {
    res.status(200).render("index.ejs", { dataForClient, err });
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log("server is running on port " + port);
})
