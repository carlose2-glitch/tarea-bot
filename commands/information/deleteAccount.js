const { SlashCommandBuilder, EmbedBuilder }= require('discord.js');
const db = require('../../database/index');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('borrar-cuenta')
    .setDescription('borrar una cuenta de un usuario')
    .addStringOption(option =>
      option
        .setName('usuario')
        .setDescription('nombre de usuario')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('clave del usuario')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('banco')
        .setDescription('seleccione el banco a borrar')
        .setRequired(true)),
  run: async (client, interaction) => {

    const user = await interaction.options.getString('usuario');
    const clave = await interaction.options.getString('clave');
    const bank = await interaction.options.getString('banco');

    const extractDb = 'SELECT * FROM users where user = ?';
    const getUser = db.prepare(extractDb).all(user);
    //console.log(getUser[0]);
    console.log(getUser[0]);

    const existUser = getUser[0] !== undefined;
    //console.log(existUser);
    if(existUser){

      verificationPass(interaction, clave, bank, getUser);

    }else{
      createEmbed('https://i.pinimg.com/564x/ef/bd/35/efbd358fd8a0da0152e44f72b1635b4f.jpg', interaction, 'el usuario no existe', 'Fallo');

    }

    //interaction.reply(`${user} y ${clave} y ${bank}`);
  } };

const verificationPass = (interaction, clave, bank, getUser) => {

  const getPass = getUser[0].password === clave;
  if(getPass){
    verificationBank(interaction, bank, getUser);

  }else{
    createEmbed('https://i.pinimg.com/564x/ef/bd/35/efbd358fd8a0da0152e44f72b1635b4f.jpg', interaction, 'la clave es incorrecta', 'Fallo');
  }

};

const verificationBank = (interaction, bank, getUser) => {
  const extractBank = 'SELECT * FROM accountusers where ci_id = ?';
  const getCiBank = db.prepare(extractBank).all(getUser[0].ci_id);
  const existBank = getCiBank[0] !== undefined;

  console.log(existBank);
  if(existBank){
    if(getCiBank[0].bank.toLowerCase() === bank.toLowerCase()){
      deleteBank(bank, getUser);
      createEmbed('https://i.pinimg.com/564x/f4/b4/01/f4b401b34ebca2e8639de3f48aa123cb.jpg', interaction, 'Cuenta borrada', 'exelente');
    }else{
      createEmbed('https://i.pinimg.com/564x/bf/a3/c2/bfa3c209eb78c5123255adacd9c8b0e5.jpg', interaction, 'el banco no existe', 'Fallo');
    }

  }else{
    createEmbed('https://i.pinimg.com/564x/bf/a3/c2/bfa3c209eb78c5123255adacd9c8b0e5.jpg', interaction, 'el usuario no posee cuenta bancaria', 'Fallo');
  }
  //interaction.reply('siasss');
};

const deleteBank = (bank, getUser) => {

  const extract = 'DELETE FROM accountusers WHERE ci_id = ? and bank = ? ';
  const deletee = db.prepare(extract).run(getUser[0].ci_id, bank.toLowerCase());
  console.log(deletee);

};

const createEmbed = (link, interaction, message, title) => {

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(message)
    .setImage(link);

  interaction.reply({ embeds: [embed] });
};