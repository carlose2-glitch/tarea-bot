const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('borrar-usuario')
    .setDescription('borrar el usuario')
    .addStringOption(option =>
      option
        .setName('administrador')
        .setDescription('administrador')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('clave administrador')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('username')
        .setDescription('nombre del usuario a borrar')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('ci-usuario')
        .setDescription('cedula del usuario')
        .setRequired(true)),
  run: async (client, interaction) => {

    const admin = await interaction.options.getString('administrador');
    const passwordAdmin = await interaction.options.getString('clave');
    const user = await interaction.options.getString('username');
    const ciUser = await interaction.options.getString('ci-usuario');

    //extraer de la base de datos
    const getDb = `SELECT * FROM admin
    WHERE user_admin = ?
    `;
    const getAdmin = await db.prepare(getDb).all(admin);
    //console.log(getAdmin);
    //console.log(getAdmin[0] !== undefined);
    if(getAdmin[0] !== undefined){
      //interaction.reply('hola');
      verificationPassword(getAdmin, passwordAdmin, interaction, user, ciUser);
    }else{
      interaction.reply('administrador ingreso es incorrecto');
    }

  }
};

const verificationPassword = (getAdmin, password, interaction, user, ci) => {

  const getPassword = getAdmin[0].password === password;
  if(getPassword){
    //interaction.reply('hola');
    verificationUser(interaction, user, ci);
  }else{
    interaction.reply('clave incorrecta');
  }

};

const verificationUser = async (interaction, user, ci) => {

  const getUser =  `SELECT * FROM users
  WHERE user = ?
  `;

  const userGet = await db.prepare(getUser).all(user);
  //console.log(userGet);
  const NumberCi = Number(ci);
  // interaction.reply('hola');
  if(userGet[0] !== undefined){

    if(userGet[0].ci_id === NumberCi){
      deleteDbUser(userGet);
      createEmbed('https://i.pinimg.com/564x/e8/f9/62/e8f96256ce311432eaa45b4251fb464f.jpg', interaction, `El usuario ${userGet[0].user} ha sido borrado`,'Borrado' );
    }else{
      interaction.reply('cedula incorrecta');
    }

  }else{
    interaction.reply('no se pudo borrar el usuario');
  }
};

const createEmbed = async (link, interaction, message, title) => {

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(message)
    .setImage(link);

  await interaction.reply({ embeds: [embed] });

};

const deleteDbUser = async (user) => {

  console.log(user[0].ci_id);
  const ci = user[0].ci_id;

  const deleteUser = 'DELETE from users where ci_id = ?';
  const deleTableUser = db.prepare(deleteUser).run(ci);
  console.log(deleTableUser);

  /*const deleteAccount = 'DELETE from accountusers where admin_id = ?';
  const deleteAccountRun = await db.prepare(deleteAccount).run(1234567);
  console.log(deleteAccountRun);*/
};