const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

app.use(`/.netlify/functions/app`, router);
const clientmodule = require("./client.js");

router.get("/",(req,res) =>{
  res.json({'success':true});
  clientmodule.loginBot();
})

router.get("/check",(req, res) => {
  const query = req.query;
  const namegiven = query.name;
  let response = clientmodule.checkforplayer(namegiven).then((value) =>{
    res.json(value);
  });
});

router.get("/message", (req, res) => {
  const query = req.query;
  const idgiven = query.id;
  const title = query.title;
  const message = query.message;
  let response = clientmodule.messageplayer(message,idgiven,title).then((value) =>{
    res.json(value)
  })
});

router.get("/getservers", async (req,res) =>{
  const query = req.query;
  const idgiven = query.id;
  let response = clientmodule.getservers(idgiven).then((value) =>{
    res.json(value)
  })
})

app.listen(3000, () => {
  console.log("Sophisticated Sellers API is running!");
})

module.exports = app;
module.exports.handler = serverless(app);