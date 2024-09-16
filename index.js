import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config';

const app = express();
const port = 3000;

// Setup for requests, key will be made for user to insert, default values used for now
const key = process.env.API_KEY;
const url = "https://api.openweathermap.org/data/2.5";
let latitude = "-25.731340";
let longitude = "28.218370";
let unit = "metric";
let name = "Pretoria";
let error = "";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Load home page using my api key, can ask for users?
app.get("/", (req, res) => {
    res.render("index.ejs", {error: error});
});

// Search for location using users api key and axios, make default page blank
app.post("/search", async (req, res) => {
    try {
        if(req.body.search_type == "coordinates") {
            if(req.body.latitude != '' && req.body.longitude != '') {
                latitude = req.body.latitude;
                longitude = req.body.longitude;
                const response = await axios.get(url + "/weather?", {
                    params: {
                        lat: latitude,
                        lon: longitude,
                        appid: key,
                        units: unit,
                    },
                });
                const data = response.data;
                res.render("index.ejs", {weather: data});
            } else {
                error = "Please enter both latitude and longitude values.";
                res.redirect("/");
            }
        } else {
            if(req.body.search_box != '') {
                name = req.body.search_box;
                const response = await axios.get(url + "/weather?", {
                    params: {
                        q: name,
                        appid: key,
                        units: unit,
                    },
                });
                const data = response.data;
                res.render("index.ejs", {weather: data});
            } else {
                error = "No city found! Please enter the locations name correctly.";
                res.redirect("/");
            }
        }
    } catch(err) {
        console.error("Failed to connect: ", err.message);
        res.render("index.ejs", {error: err.message});
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
