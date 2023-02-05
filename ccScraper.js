const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const PORT = 3000;

const app = express();

let url = "https://www.codechef.com/contests";

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
      document.querySelectorAll(".jss61"),
      (element) => element.textContent // or textContent
    )
  );

  //console.log(text);

  var line = "";
  for (var i = 1; i <= text.length; i++) {
    //console.log(text[i]);
    //console.log(text[i + 1]);
    var obj = { Key: text[i], value: text[i + 1] };

    line = line + obj.value + " ";
    console.log("->", obj);
    if (obj.Key === " " && line != null) {
      console.log("here");
      fs.writeFile("cc.txt", line + "\n", { flag: "a" }, (err) => {
        if (err) throw err;
        //console.log("The file was appended!");
      });
      line = "";
    }
    i += 2;
  }

  //   text.forEach((element) => {
  //     console.log(
  //       "\nx-------------------x------------------------------------------x\n"
  //     );
  //     console.log(element);
  //     console.log(
  //       "\nx-------------------x------------------------------------------x\n"
  //     );
  //   });

  await browser.close();
};

checkingPuppet();

app.listen(PORT, () => console.log("Server runing on port ", PORT));
