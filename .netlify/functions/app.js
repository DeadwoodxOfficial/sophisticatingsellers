const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();
const clientmodule = require("./client.js");

router.get("/",(req,res) =>{
  clientmodule.loginBot();
  res.json({'success':true});
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

app.use(`/.netlify/functions/app`, router);

module.exports = app;
module.exports.handler = serverless(app);