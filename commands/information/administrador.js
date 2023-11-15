
const Discord = require('discord.js');
const db = require('../../database/index');
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('administrador')
    .setDescription('sirve para entrar en los datos del administrador')
    .addStringOption(option =>
      option
        .setName('usuario')
        .setDescription('usuario del administrador')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('clave del administrador')
        .setRequired(true)
    ),

  run: async (client, interaction) => {

    const user = await interaction.options.getString('usuario');
    const getAdmin =`
    SELECT * FROM admin
    WHERE user_admin = ?
    `;
    const extractAdmin = await db.prepare(getAdmin).all(user);
    console.log(extractAdmin);

    const password = await interaction.options.getString('clave');
    const getPassword =`
    SELECT * FROM admin
    WHERE password = ?
    `;
    const extractPassword = await db.prepare(getPassword).all(password);

    if (extractAdmin[0] !== undefined && extractPassword[0] !== undefined){

      createButtons(interaction);

    }else{
      interaction.reply('el usuario y clave no son correctos');
    }
    //interaction.reply(`${user} y ${password} y ${interaction.user.id}`);

  }
};

const createButtons = (interaction) => {


  const buttons = ['historial de transferencias', 'Mostrar saldo'];
  let saveButtons = [];
  for(const i of buttons){
    saveButtons += [i] ;
  }
  console.log(saveButtons);

  const btn = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setLabel('historial de transferencias')
        .setEmoji('📖')
        .setStyle('Primary')
        .setCustomId('btn'),
      new Discord.ButtonBuilder()
        .setLabel('Mostrar saldo')
        .setEmoji('💰')
        .setStyle('Success')
        .setCustomId('sald'),
      new Discord.ButtonBuilder()
        .setLabel('Usuarios')
        .setEmoji('📒')
        .setStyle('Success')
        .setCustomId('users'));
  interaction.reply({ components:[btn] });
  console.log(btn);
};
// const Discord = require('discord.js');
// const axios = require('axios');
// const jimp = require('jimp');
// let countriesData = '';
// module.exports = {
//   data: new Discord.SlashCommandBuilder()
//     .setName('buscar-pais')
//     .setDescription('sirve para ver la latencia del bot')
//     .addStringOption(option =>
//       option
//         .setName('pais')
//         .setDescription('Pais a buscar')
//         .setRequired(true)
//     ),
//   run: async (client, interaction) => {
//     const country = interaction.options.getString('pais');
//     //console.log(country);
//     const getCountryData = countriesData.data.filter(data => data.name.common.toLowerCase().startsWith(country.toLowerCase()));
//     const extractNameCountry = getCountryData[0].name.common;
//     const extractFlags = getCountryData[0].flags.png;
//     const extractCapital = getCountryData[0].capital[0];
//     const population = (parseInt(getCountryData[0].population)).toLocaleString();
//     const region = getCountryData[0].region;

//     //console.log(getCountryData[0].name.common);
//     //console.log(extractFlags);
//     //console.log(extractCapital);
//     //console.log(population);
//     //console.log(region);
//     let color;
//     jimp.read(extractFlags)
//       .then((image) => {
//         console.log('color',image.getPixelColor(1, 5));
//         console.log(jimp.intToRGBA(image.getPixelColor(1, 5)));
//         color = jimp.intToRGBA(image.getPixelColor(1, 5));
//         console.log(color.r);
//         // Do stuff with the image.
//       })
//       .catch((err) => {
//         console.log(err);
//         // Handle an exception.
//       });

//     const extractApiWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${extractNameCountry}&lang=es&appid=d999f09c012f5587df3dd7c5a845b45d&units=metric`);
//     // console.log(extractApiWeather.data.main.temp);

//     const exampleEmbed = new Discord.EmbedBuilder()
//       .setColor([color.r,color.g,color.b,color.a])
//       .setTitle(extractNameCountry)
//       .setURL('https://discord.js.org/')
//       .addFields(
//         { name: 'Capital', value: extractCapital },
//         { name: '\u200B', value: '\u200B' },
//         { name: 'Poblacion', value: population, inline: true },
//         { name: 'Region', value: region, inline: true },
//       )
//       .addFields({ name: 'clima', value: `${extractApiWeather.data.main.temp}°C`, inline: true })
//       .setImage(extractFlags);

//     interaction.reply({ embeds: [exampleEmbed] });



//     //const embed = createEmbed( { extractNameCountry, extractFlags, extractCapital, population, region } );
//     //const embed = createEmbed({ country: extractNameCountry, extractFlags, extractCapital, population, region });
//     //console.log(embed);

//   }
// };

// /*const createEmbed = ( { name , flag, capital, population, region } ) => {
//   const exampleEmbed = new Discord.EmbedBuilder()
//     .setColor(0x0099FF)
//     .setURL(`${name}`)
//     .setDescription('muestra informacion del pais')
//     .setThumbnail('clima')
//     .addFields(
//       { name: 'Capital', value: `${capital}`, inline:true },
//       { name: 'Poblacion', value: `${population}`, inline: true },
//       { name: 'Region', value: `${region}`, inline: true },
//     )
//     .setImage(flag);
//   return exampleEmbed;
// };*/

// (async() =>
// {
//   countriesData = await axios.get('https://restcountries.com/v3.1/all');
// })();






