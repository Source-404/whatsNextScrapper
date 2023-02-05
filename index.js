const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const puppeteer = require("puppeteer");

const PORT = 3000;

const app = express();

let url1 = "https://www.deccanchronicle.com/south/current-affairs/";
let url2 = "https://economictimes.indiatimes.com/topic/july-1";
let url = "https://www.codechef.com/contests";

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

// scrape(url);
function scrape(url) {
  console.log("called");
  axios(url)
    .then((response) => {
      console.log("stage-1");
      const html = response.data;
      const $ = cheerio.load(html);
      console.log(html);

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

const checkingPuppet = async () => {
  //initiate the browser
  const browser = await puppeteer.launch();

  //create a new in headless chrome
  const page = await browser.newPage();

  //width, height
  await page.setViewport({
    width: 1000,
    height: 750,
    deviceScaleFactor: 1,
  });

  //go to target website
  await page.goto(url, {
    //wait for content to load
    waitUntil: "networkidle0",
  });

  const text = await page.evaluate(() =>
    Array.from(
      //   document.querySelectorAll("._flex__container_1qngn_459"),
      document.querySelectorAll(".MuiTableRow-root"),
      (element) => element.innerHTML // or textContent
    )
  );

  //codechef
  //0 -> heading
  //1 -> ongoing contest
  //2-6 -> upcoming and so on...
  console.log(text[1]);

  await browser.close();
};

checkingPuppet();

app.listen(PORT, () => console.log("Server runing on port ", PORT));
