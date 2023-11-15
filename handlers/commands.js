const Discord = require('discord.js');
const fs = require('fs');
const comandosDir = `${process.cwd()}/commands`;
require('dotenv').config();

module.exports = async client => {
  let arrayComandos = [];
  let comandosCargados = 0;

  client.comandos = new Discord.Collection();

  fs.readdirSync(comandosDir).forEach(async dir => {
    const comandos = fs.readdirSync(`${comandosDir}/${dir}`).filter(archivo => archivo.endsWith('.js'));
    for (const archivo of comandos){
      const comando =  require(`${comandosDir}/${dir}/${archivo}`);
      client.comandos.set(comando.data.name, comando);
      arrayComandos.push(comando.data.toJSON());
      console.log(`✅ | Comando ${archivo.replace(/.js/, '')} Cargado`.yellow);
      comandosCargados++;
    }
    await new Discord.REST().setToken(process.env.TOKEN).put(
      Discord.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
        body: arrayComandos
      }
    );
    return console.log(`✅ | se han cargado ${comandosCargados} comandos`.blue);
  });

};