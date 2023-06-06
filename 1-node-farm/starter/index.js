const fs = require("fs");
const http = require("http");
const url = require("url");

const tempData = require("./dev-data/modules/tempData");
// const result = fs.readFileSync("./txt/input.txt","utf-8")

// console.log(result)

// const textIn = `hellooo: ${result} `
// fs.writeFileSync("./txt/output.txt",textIn)
//READ FROM FILE
// fs.readFile("./txt/start.txt","utf-8" ,(err,data)=>{
//    fs.readFile(`./txt/${data}.txt`, "utf-8",(err,data1)=>{
//     console.log(data1)
//    })
// })

////HTTP

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
// console.log(dataObj)

//creating a server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  ///OVERVIEW PAGE
  if (pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const result = dataObj.map((item) => tempData(tempCard, item)).join("");
    const output = tempOverview.replace("{%PRODUCTCARDS%}", result);
    res.end(output);
  }

  ////PRODUCT
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = tempData(tempProduct, product);
    res.end(output);
  }

  ///API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  /// ERROR
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Error</h1>");
  }
  // res.end("heyy u created ur first server")
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to ur server on 8000");
});
