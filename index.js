import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let riddleQuestion = "";
let riddleAnswer = "";

async function fetchRiddle(res) {
    try {
        const response = await axios.get("https://riddles-api.vercel.app/random");
        riddleQuestion = response.data.riddle;
        riddleAnswer = response.data.answer;
        res.render("index.ejs", { content: riddleQuestion, result: "" });
        console.log(riddleAnswer);
    } catch (error) {
        res.render("index.ejs", { content: error.message, result: "" });
    }
}

app.get("/", (req, res) => {
    fetchRiddle(res);
});

app.post("/", (req, res) => {
    const answer = req.body.answer;
    if (req.body.submit) {
        if (answer === riddleAnswer) {
            res.render("index.ejs", { content: riddleQuestion, result: `You are right! The answer is ${riddleAnswer}` });
        } else {
            res.render("index.ejs", { content: riddleQuestion, result: "Wrong Answer, Try again" });
        }
    } else if (req.body.check) {
        res.render("index.ejs", { content: riddleQuestion, result: riddleAnswer });
    } else if (req.body.reset) {
        fetchRiddle(res);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
