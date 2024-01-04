const discord = require("discord.js");
const {ButtonBuilder, ButtonStyle,SlashCommandBuilder} = discord;
require('dotenv').config();
const client = new discord.Client({ intents: [
  discord.GatewayIntentBits.Guilds,
  discord.GatewayIntentBits.GuildMessages,
  discord.GatewayIntentBits.GuildMembers,
  discord.GatewayIntentBits.MessageContent
]});
const token = process.env.apikey + process.env.apikey2;
let botconfig = false;
let ticketdict = {};
let ticketcount = 0;
let lastchattedchannel = null;
let map1 = {};

let membersinfo = {};
let guildsinfo = {};

const button = new ButtonBuilder()
    .setLabel('Close Ticket')
    .setCustomId('CloseTicket')
    .setStyle(ButtonStyle.Danger)

const row = new discord.ActionRowBuilder()
    .addComponents(button);

let botlogchannel = null;

async function loginBot(){
  if (botconfig === false){
    await client.login(token);
    botconfig = true;
  }
}

async function messageplayer(message,idofuser,title){
  return new Promise((resolve,reject) =>{
    const embed = {
      title: title || 'Success!',
      description: message,
      color: 0xfcba03
    };
    if (lastchattedchannel !== null) {
      client.users.fetch(idofuser).then(member =>{
        if (member) {
          member.send({ embeds: [embed] })
            .then(() => {
              resolve({'success': true});
            })
            .catch((error) => {
              resolve({'success': false})
            });
        } else {
          resolve({'success': false});
        }
      });
    } else {
      resolve({'success': false});
      console.log("e")
    }
  })
}

async function checkforplayer(namegiven){
  return new Promise((resolve, reject) => {
    if (lastchattedchannel !== null && namegiven !== null) {
      const member = membersinfo.find(
        (member) => member.displayName.toLowerCase() === namegiven.toLowerCase()
      );
      if (member) {
        if (member.premiumSince !== null){
          const tabletoreturn = {
            'found': true,
            "booster": true,
            "DUsername": member.user.username,
            "DUserId": member.user.id
          };
          resolve(tabletoreturn);
        } else {
          resolve({ 'found': true,'booster': false,'DUsername': member.user.username,"DUserId":member.user.id});
        }
      } else {
        resolve({ 'found': false });
      }
    } else {
      resolve({'found':false});
    }
  });
}

async function getservers(id){
  return new Promise((resolve, reject) => {
    if (lastchattedchannel !== null) {
      let list = [];
      const guilds = guildsinfo.filter(guild => guild.ownerId === id)
      if (guilds) {
        guilds.forEach(server =>{
          const tabletoreturn = {
            'name': server.name,
            'id': server.id,
            'count': server.memberCount
          };
          list.push(tabletoreturn)
        })
        resolve({'found':true,'data':list})
      } else {
        resolve({ 'found': false });
      }
    } else {
      resolve({'found':false});
    }
  });
}

module.exports = {
  loginBot,
  checkforplayer,
  messageplayer,
  getservers
};

client.once('ready',() =>{
  const guild = client.guilds.cache.get('1173937413454839838');
  guildsinfo = client.guilds.cache;
  if (guild){
    let serverCount = client.guilds.cache.size;
    let status = `Watching over ${serverCount} servers`;
    client.user.setActivity(status)
    client.user.setStatus('dnd');
    const channel = guild.channels.cache.get("1174661140937187418");
    if (channel){
      channel.send("Bot is online.");
      botlogchannel = channel;
      lastchattedchannel = channel;
      guild.members.fetch().then((members) => {
        membersinfo = members;
      }).catch((error) => {
        console.error("Error fetching members:", error);
      });
    }
    const commands = [
      {
        name: 'ticket',
        description: 'Creates a new support ticket.',
        options: [
        {
          name: 'reason',
          description: 'Reason for opening the ticket',
          type: 3,
          required: false
        },
      ]},
      {
        name: 'invite',
        description: 'Invites the bot to your server.'
      },
    ];
    const commandData = commands.map((command) => ({
      name: command.name,
      description: command.description,
      options: command.options || [],
    }));
    guild.commands.set(commandData);
    console.log("Sophisicated Sellers Bot is running!")
  }
})

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton(button)){
      if (interaction.customId === "CloseTicket"){
        const roleId = '1178205885055647866';
        const roleId2 = "1174576504865304676";
        //button.setDisabled(true);
        const member = interaction.member;
        if (member.roles.cache.has(roleId) || member.roles.cache.has(roleId2)){
            const channel = interaction.channel;
            if (channel.type === discord.ChannelType.GuildText) {
                try {
                  interaction.reply("Ticket closed! Thank you for your patience and effort.");
                  let channelfound = ticketdict[channel.name];
                  map1[channelfound] = null;
                  setTimeout(() => {
                    channel.delete();
                  },5000);
                  if (map1[channel.topic] !== null){
                    map1[channel.topic] = null;
                    botlogchannel.send(channel.name + " has been closed by " + interaction.user.username + ".")
                  }
                  return
                }catch(error){
                  channel.send("Unable to close ticket, please delete it manually.");
                  console.error('Error deleting channel:', error);
                }
            }
      }
    }
  }else if(interaction.isCommand()){
      if (interaction.channel.id === "1178189674615939104") {
        const commandName = interaction.commandName;
        const userid = interaction.user.id.toString();
        if (commandName === "ticket") {
          if (map1[userid] !== null){
            const lastTicketTime = map1[userid];
            const currentTime = Date.now();
            const cooldownTime = 2 * 60 * 60 * 1000;

            if (currentTime - lastTicketTime < cooldownTime) {
              interaction.reply('You have recently created a ticket. Please wait before creating another.');
              return;
            }else{
              map1[userid] = null;
            }
          }
          const guild = interaction.guild;
          const ticketname = "ticket #" + String(ticketcount);
          const ticketChannel = await guild.channels.create({
            name: ticketname,
            type: discord.ChannelType.GuildText,
            parent: '1178208046514716732',
            permissionOverwrites: [
               {
                 id: "1173937413454839838",
                 deny: [discord.PermissionsBitField.Flags.ViewChannel],
              },
              {
                 id: userid,
                 allow: [discord.PermissionsBitField.Flags.ViewChannel],
              },
              {
                 id: "1178205885055647866",
                 allow: [discord.PermissionsBitField.Flags.ViewChannel],
              },
              {
                 id: "1174576504865304676",
                 allow: [discord.PermissionsBitField.Flags.ViewChannel],
              },
            ]
          });
          ticketdict[ticketname] = userid;
          const idofticketchannel = ticketChannel.id;
          ticketChannel.setTopic(userid.toString())
          const channelMention = `<#${idofticketchannel}>`;
          const currentDate = new Date().toUTCString();
          const reasongiven = interaction.options.reason || "No reason given";
          await interaction.reply({
              content: `Ticket created! Go to: ${channelMention}`
          });
          await ticketChannel.send({
              content: "``Ticket Created``\n\n**Raised by:** <@" + userid + ">\n**Reason:** " + reasongiven + "\n**Created timestamp:** " + currentDate + "\n\n\n**Please wait for our moderators to read the ticket logs and respond to you as soon as possible.**\n<@&1179293825873748008>",
              components: [row],
          });
          map1[userid.toString()] = Date.now();
          ticketcount += 1
        }else if(commandName === "invite"){
          interaction.reply({
            content: "Add me to your server with this URL.\n https://discord.com/api/oauth2/authorize?client_id=1173937655873032253&permissions=2483234816&scope=bot"
          })
        }
      }
  }
  }catch(error) {
    console.error('Error:', error);
    interaction.channel.send('There was an error processing your request.');
  }
});

setInterval(() => {
  let serverCount = client.guilds.cache.size;
  let status = `Watching over ${serverCount} servers`;
  client.user.setActivity(status)
  client.user.setStatus('dnd');
  guild.members.fetch().then((members) => {
    membersinfo = members;
  }).catch((error) => {
    console.error("Error fetching members:", error);
  });

  guildsinfo = client.guilds.cache;
}, 600000);

client.login(token)