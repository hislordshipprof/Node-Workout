const fs = require("fs");
const http = require("http").createServer();
const superagent = require("superagent");
// server.on("request", (req, res) => {

//creating and making the readFile a promise
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.watchFile(file, data, (err) => {
      if (err) reject(err);
      resolve("uploaded");
    });
  });
};
///Calling the await method
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((err, res) => {
//     if (err) console.log(err);
//     return writeFilePro("info.txt", res.body.message);
//   })
//   .then(() => "well done")
//   .catch((err) => {
//     console.log(err);
//   });

const getData = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log("1:data", data);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log("2: res", res.body.message);
    await writeFilePro("info.txt", res.body.message);
    console.log("well done lad");
  } catch (error) {
    console.log("ERROR");
  }
  return "Hello";
};

(async () => {
  try {
    const x = await getData();
    console.log(x);
  } catch (error) {
    console.log("my error");
  }
})();
