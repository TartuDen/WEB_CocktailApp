import express from 'express';
import bodyParser from 'body-parser';

const port = 8080;
const app = express();
const baseUrl= "www.thecocktaildb.com/api/json/v1/1"
app.use(express.static("public"));

app.post("/search",async(req,res)=>{
    let response = await axios.get(baseUrl)
})

app.get("/",(req,res)=>{
    res.status(200).render("index.ejs");
})

app.listen(port,(err)=>{
    if(err) throw err;
    console.log("server is running on port "+port);
})
