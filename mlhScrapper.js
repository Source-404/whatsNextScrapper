const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;

const PORT = 3000;

const app = express();

const url = "https://mlh.io/seasons/2023/events";
const articles = [];
let count = 0;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let arr = [];

const printArr = () => {
  console.log(arr);
};

const pushToDb = async () => {
  const uri = "mongodb url here";
  const client = new MongoClient(uri);
  try {
    const database = client.db("test");
    const collection = database.collection("events");
    console.log("stg-1");
    const result = await collection.insertMany(arr);
    console.log("stg-2");
  } catch (e) {
    console.log("what now: ", e);
  }
};

scrape(url);

function scrape(url) {
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".inner", html).each(function () {
        const title = $(this).text();
        count++;

        //const url = $(this).find("a").attr("href");
        //const title = $(this).find("h2").text();

        if (count < 15) {
          //let row = $(title).text().replace(/(\s+)/g, " ");
          let row = title.split("\n");
          row = row.map((str) => str.trim());
          row = row.filter((str) => str.length > 0 && str != "DIVERSITY");
          //console.log(row);

          const dateString = row[1];
          const month = months.indexOf(dateString.split(" ")[0]);
          const day = parseInt(dateString.split(" ")[1].replace("th", ""));

          const newDate = new Date(Date.now());
          newDate.setMonth(month);
          newDate.setDate(day);

          const obj = {
            name: row[0],
            time: newDate,
            location: row[2] + " " + row[3],
          };

          //   console.log(obj);
          arr = [...arr, obj];

          //   let line = "";
          //   for (let i = 0; i < row.length; i++) {
          //     line += row[i];
          //   }

          //   fs.writeFile("mlh.txt", line + "\n", { flag: "a" }, (err) => {
          //     if (err) throw err;
          //     // console.log("The file was appended!");
          //   });
        }
      });

      printArr();
      pushToDb().then(() => {
        console.log("lol");
      });
    })
    .catch((e) => {
      console.log("something went wrong: ", e);
    });

  console.log(articles);
}

app.listen(PORT, () => console.log("Server runing on port ", PORT));
