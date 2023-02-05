const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const PORT = 3000;

const app = express();

let url1 = "https://www.deccanchronicle.com/south/current-affairs/";
let url2 = "https://economictimes.indiatimes.com/topic/july-1";
let url = "https://codeforces.com/contests";

const articles = [];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loop = async () => {
  for (let i = 10; i <= 28; i++) {
    let url = url1 + i + "0722";
    console.log(url);
    scrape(url);
    await wait(5000);

    console.log(articles.length);
  }
  console.log(articles);
};
// loop();

scrape(url);
function scrape(url) {
  console.log("called");
  axios(url)
    .then((response) => {
      console.log("stage-1");
      const html = response.data;
      const $ = cheerio.load(html);
      //console.log(html);
      var flag = 0;
      $("tr").each((_, e) => {
        let row = $(e).text().replace(/(\s+)/g, " ");
        //console.log(`${row}`);
        // console.log(
        //   "\n x-------------------x---------------x-------------------------x----"
        // );
        let firstWord = row.split(" ")[1];
        console.log(firstWord);

        if (firstWord === "Name") {
          flag++;
          console.log("okay");
        }
        if (flag < 2)
          fs.writeFile("cf.txt", row + "\n", { flag: "a" }, (err) => {
            if (err) throw err;
            //console.log("The file was appended!");
          });
      });

      $("_data__container_1qngn_464", html).each(function () {
        console.log("stage-3");
        console.log($(this));
        const title = $(this).text();
        console.log(title);
        //const url = $(this).find("a").attr("href");
        //const title = $(this).find("h2").text();

        // articles.push({
        //   title,
        //   url,
        // });
      });
    })
    .catch((e) => {
      console.log("something went wrong: ", e.message);
    });
}

//checkingPuppet();

app.listen(PORT, () => console.log("Server runing on port ", PORT));
