import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const port = 8080;
const app = express();
const baseUrl = "https://www.thecocktaildb.com/api/json/v1/1";
const searchByLetter = "/search.php?f="
let data = null;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/search", async (req, res) => {
    let formReq = req.body["coctail"];
    if (formReq.length === 1 && typeof formReq === 'string') {
        try {
            console.log(baseUrl+searchByLetter+formReq)
            let response = await axios.get(baseUrl+searchByLetter+formReq)
            data = (response.data)

        }catch{
            console.error("Faild to get data")
        }
    }

    res.status(200).redirect("/");
})

app.get("/", (req, res) => {
    res.status(200).render("index.ejs", { data });
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log("server is running on port " + port);
})
