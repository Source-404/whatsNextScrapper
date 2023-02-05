const fs = require("fs");
const readline = require("readline");
const MongoClient = require("mongodb").MongoClient;

const fileStream = fs.createReadStream("cc.txt");

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

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
// const str = "The date is Feb 12, 2022.";

// for (const month of months) {
//   if (str.indexOf(month) !== -1) {
//     console.log(`Index of "${month}" in the string:`, str.indexOf(month));
//     break;
//   }
// }

let arr = [];

rl.on("line", (line) => {
  console.log(`${line}`);
  let words = line.split(" ");
  const monthIndex = words.findIndex((word) => months.includes(word));

  if (monthIndex >= 0) {
    console.log(`Index of month in the array: ${monthIndex}`);
  } else {
    console.log("Month not found in the array");
  }

  let code = words[0];
  let name = "";
  for (let i = 1; i < monthIndex - 1; i++) {
    name += words[i] + " ";
  }
  let date = words[monthIndex - 1];
  let month = months.indexOf(words[monthIndex]);
  let year = parseInt(words[monthIndex + 1].substr(0, 4));

  const [hours, minutes] = words[monthIndex + 2]
    .split(":")
    .map((val) => parseInt(val));

  const time = new Date(year, month, date, hours, minutes);

  const obj = {
    code,
    name,
    time,
  };

  arr = [...arr, obj];

  console.log(words);
  console.log(obj);
});

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

rl.on("close", () => {
  console.log("File reading completed.");

  //already in db

  //   pushToDb().then(() => {
  //     console.log("lol");
  //   });
});
