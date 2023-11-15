const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/index');
//const { getMonitor }  = require('consulta-dolar-venezuela');
const axios = require('axios');
let calculo = 0;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('realizar-calculo')
    .setDescription('saber cuantos dolares necesita para enviar los bolivares')
    .addStringOption(option =>
      option
        .setName('usuario')
        .setDescription('nombre usuario')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('clave usuario')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('monto')
        .setDescription('monto entero $ sin decimales')
        .setRequired(true)),
  run: async (client, interaction) => {

    const user = await interaction.options.getString('usuario');
    const pass = await interaction.options.getString('clave');
    const mont = Number(interaction.options.getString('monto'));
    const decimal = Number.isInteger(mont);

    //interaction.reply('hola');

    if(!isNaN(mont) && decimal){
      verificarUserPass(user, pass, interaction, mont);

    }else{

      interaction.reply('debe ser numero entero');
    }

  } };

const verificarUserPass = async (user, pass, interaction, mont) => {

  const extract = 'SELECT * FROM users WHERE user = ?';

  const extractUser = db.prepare(extract).all(user);
  const existUser = extractUser[0] !== undefined;

  if(existUser){

    if(extractUser[0].password === pass){

      consulMont(mont, interaction);

    }else{
      interaction.reply('clave incorrecta');
    }


  }else{
    interaction.reply('el usuario no existe');
  }

};

const consulMont = async (mont, interaction) => {


  const api = await axios.get('https://exchange.vcoud.com/coins/latest');
  //console.log(api);
  const extractBolivar = api.data.filter(banco => banco.symbol === 'VDT');

  end(interaction, extractBolivar[0].price -2, mont);


  //numero = Number(tasa);
  //console.log(getMonitor);

  //calculo = Math.ceil(mont / numero);
  //createEmbed('https://i.pinimg.com/564x/8c/0f/aa/8c0faa4df5a9b42f11bac6a435d02c74.jpg', interaction, `Se necesitan $${calculo} para realizar la operacion`, 'Dolares');
  //interaction.reply(`${calculo}`);
};

const createEmbed = async (link, interaction, message, title) => {

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(message)
    .setImage(link);

  await interaction.reply({ embeds: [embed] });

};

const end = (interaction, price, mont) => {

  console.log(price);
  calculo = String(Math.floor(mont * price));
  //interaction.reply(`el monto en bolivares seria de ${calculo}`);
  createEmbed('https://i.pinimg.com/564x/8c/0f/aa/8c0faa4df5a9b42f11bac6a435d02c74.jpg', interaction, `Son Bs ${calculo}`, 'Bolivares');

};