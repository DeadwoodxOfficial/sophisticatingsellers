const express = require("express");
const app = express();
//const clientmodule = require("./client.js");

app.get("/",(req,res) =>{
  res.json({'success':true});
  //clientmodule.loginBot();
})

app.get("/check",(req, res) => {
  const query = req.query;
  const namegiven = query.name;
  let response = clientmodule.checkforplayer(namegiven).then((value) =>{
    res.json(value);
  });
});

app.get("/message", (req, res) => {
  const query = req.query;
  const idgiven = query.id;
  const title = query.title;
  const message = query.message;
  let response = clientmodule.messageplayer(message,idgiven,title).then((value) =>{
    res.json(value)
  })
});

app.get("/getservers", async (req,res) =>{
  const query = req.query;
  const idgiven = query.id;
  let response = clientmodule.getservers(idgiven).then((value) =>{
    res.json(value)
  })
})

app.get("/getroles", async (req,res) =>{
  try {
    const query = req.query;
    const idgiven = query.serverId;
    await client.guilds.fetch();
    const server = client.guilds.cache.get(idgiven);
    if (server) {
      try{
        const botMember = server.members.cache.get(client.user.id);
        const botHighestRolePosition = botMember.roles.highest.position;
        const rolesBelowBot = server.roles.cache.filter(role => role.position < botHighestRolePosition);
        if (rolesBelowBot !== null){
          res.json({'success':true,'roles':rolesBelowBot})
        }else{
          res.json({'success':false})
        }
      }catch(error){
        res.json({'success':false})
        console.log(error)
      }
    } else {
      res.json({'success':false});
    }
  } catch (error) {
    res.json({'success':false});
    res.status(500).send('An error occurred while processing the request.');
  }
})

app.get("/rankplayer",(req,res) =>{
  const query = req.query;
  const guild = client.guilds.cache.get(query.serverId);
  if (guild !== null){
    const member = guild.members.cache.find(member => member.user.username == query.username);
    if (member){
      const role = guild.roles.cache.get(query.roleId);
      if (role){
        member.roles.add(role);
        res.json({'success':true})
      }else{
        res.json({'success':false})
      }
    }else{
      res.json({'success':false})
    }
  }else{
    res.json({'success':false})
  }
})

app.listen(3000, () => {
  console.log("Sophisticated Sellers API is running!");
})
