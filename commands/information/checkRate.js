const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMonitor } = require('consulta-dolar-venezuela');
const db = require('../../database/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('consultar-tasa')
    .setDescription('lista de los usuarios suscritos')
    .addStringOption(option =>
      option
        .setName('usuario')
        .setDescription('ingresa el usuario')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('clave usuario')
        .setRequired(true)),
  run: async (client, interaction) => {
    const user = await interaction.options.getString('usuario');
    const password = await interaction.options.getString('clave');

    const getUser =`
    SELECT * FROM users
    WHERE user = ?
    `;
    const extractUser = await db.prepare(getUser).all(user);
    console.log(extractUser);
    if(extractUser[0] !== undefined){
      evalDates(interaction, extractUser, user, password);
    }else{
      createEmbed('https://s.yimg.com/ny/api/res/1.2/xb2ZtVlXT4J_d6oseiLBMw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTMyMA--/https://media.zenfs.com/es/levelup_525/517a720b016350fe4b838a47986cad31', interaction, 'usuario no esxiste', 'Que mal');
    }

  } };

const evalDates = async (interaction, datos, user, password) => {

  if(datos[0].user === user && datos[0].password === password){
    //await getMonitor('null').then($ => {console.log($['dolar-today']);});
    await getMonitor('null').then($ => {
      end(interaction, String($['dolar-today'].price - 2));
    });
    //await interaction.reply('hola');
  }else{
    createEmbed('https://s.yimg.com/ny/api/res/1.2/xb2ZtVlXT4J_d6oseiLBMw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTMyMA--/https://media.zenfs.com/es/levelup_525/517a720b016350fe4b838a47986cad31', interaction, 'clave incorrecta', 'Que mal');
  }

};

const createEmbed = async (link, interaction, message, title) => {

  const embed = new EmbedBuilder()

    .setTitle(title)
    .setDescription(message)
    .setImage(link);

  interaction.reply({ embeds: [embed] });
};

const end = (interaction, objeto) => {
  console.log(objeto);
  //interaction.reply(`Bs = ${objeto}`);
  createEmbed('https://i.pinimg.com/564x/74/f7/47/74f7475cd7d74a94687d29fbdcb2a5ae.jpg', interaction, `Bs ${objeto}`,'Valor');
};


//funcion que se llama asi misma
/*(async () => {

  rate = await axios.get(url3);
  console.log(rate);

})();*/