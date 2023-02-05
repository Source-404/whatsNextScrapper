const fs = require("fs");
const readline = require("readline");
const MongoClient = require("mongodb").MongoClient;

const fileStream = fs.createReadStream("cf.txt");

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

let arr = [];

rl.on("line", (line) => {
  console.log(`${line}`);
  let words = line.split(" ");

  const dateFormat = /^[A-Z][a-z]{2}\/\d{2}\/\d{4}$/;

  let monthIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].match(dateFormat)) {
      console.log(i);
      monthIndex = i;
      break;
    }
  }

  let name = "";
  for (let i = 1; i < monthIndex; i++) {
    name += words[i] + " ";
  }
  let date = parseInt(words[monthIndex][4] + words[monthIndex][4]);
  let month = months.indexOf(
    words[monthIndex][0] + words[monthIndex][1] + words[monthIndex][2]
  );
  let year = parseInt(
    words[monthIndex][7] +
      words[monthIndex][8] +
      words[monthIndex][9] +
      words[monthIndex][10]
  );

  const [hours, minutes] = words[monthIndex + 1]
    .split(":")
    .map((val) => parseInt(val));

  const time = new Date(year, month, date, hours, minutes);

  const obj = {
    name,
    time,
  };

  arr = [...arr, obj];

  //console.log(words);
  //console.log(obj);
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
  console.log(arr);

  //already in db;

  pushToDb().then(() => {
    console.log("lol");
  });
});
