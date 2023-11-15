
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/index');


module.exports = {

  data: new SlashCommandBuilder()
    .setName('create-user')
    .setDescription('Crear Usuario')
    .addStringOption(option =>
      option
        .setName('usuario')
        .setDescription('el usuario debe empezar con mayuscula')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('entre 8 y 16 caracteres y la primera letra debe ser mayuscula')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('ci')
        .setDescription('numero de cedula')
        .setRequired(true)),
  run: async (client, interaction) => {


    const user = interaction.options.getString('usuario');
    const password = interaction.options.getString('clave');
    const ci = Number(interaction.options.getString('ci'));

    const nombreeditar = /^[A-Z][a-z]+$/;
    const claveRegex = /^[A-Z][a-z0-9$#!&?_¡+@"'\{\[\}\]\\\-*/]{7,16}$/;

    const getUser = 'SELECT * FROM users WHERE ci_id = ?';
    const userGet = await db.prepare(getUser).get(ci);
    const getNameUser = 'SELECT * FROM users WHERE user = ?';
    const userNameGet = await db.prepare(getNameUser).get(user);
    const name = userNameGet === undefined;
    console.log(nombreeditar.test(user));
    console.log(claveRegex.test(password));
    if(nombreeditar.test(user) && claveRegex.test(password) && !isNaN(ci) && !userGet && name){
      console.log(ci);
      saveDB(user, password, ci);
      createEmbed(interaction);
    }else{
      console.log(ci);
      const embed = new EmbedBuilder()

        .setTitle('No se pudo')

        .setImage('https://s.yimg.com/ny/api/res/1.2/xb2ZtVlXT4J_d6oseiLBMw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTMyMA--/https://media.zenfs.com/es/levelup_525/517a720b016350fe4b838a47986cad31');

      interaction.reply({ embeds: [embed], content: `usuario: ${user} con el numero de cedula: ${ci} no pudo ser creado` });
      // interaction.reply(`su usuario: ${user} con el numero de cedula: ${ci} no pudo ser creado`);
    }


    //interaction.reply(`${user} y ${password} y ${ci}`);
  }

};

const saveDB = (name, pass, cedula) => {

  try{
    const statement = 'INSERT INTO users (user, password, ci_id) VALUES (?, ?, ?)';
    db.prepare(statement).run(name, pass, cedula);

  }catch(error){
    console.log(error);
  }

};

const createEmbed = (interaction) => {
  const embed = new EmbedBuilder()

    .setTitle('Felicidades usuario creado' )

    .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWIv8zgtKxuD8BuF0eYnsFGTlOoxHkenSotZLlbKkEDygsZ1I_rJ-mRgy56RkxVsFpJeU&usqp=CAU');

  interaction.reply({ embeds: [embed] });
};