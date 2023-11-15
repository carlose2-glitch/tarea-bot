const discord = require('discord.js');
require('dotenv').config();
const client = new discord.Client({
  intents: [discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildMessages
  ],
  partials:[
    discord.Partials.GuildMembers,
    discord.Partials.GuildMessages
  ]
});

require('colors');

client.login(process.env.TOKEN);

let handlers = ['events', 'commands'];
handlers.forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
