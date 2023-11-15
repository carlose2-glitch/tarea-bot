const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crear-administrador')
    .setDescription('administrador')
    .addStringOption(option =>
      option
        .setName('admin')
        .setDescription('nombre del administrador')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('clave-admin')
        .setDescription('contener entre 8 y 15 caracteres, 1 letra mayuscula, 1 numero y 1 caracter especial')
        .setRequired(true)
    ),
  run: async (client, interaction) => {

    const adminuser = await interaction.options.getString('admin');
    const passwordAdmin = await interaction.options.getString('clave-admin');


    const claveRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#-_$@!%&*?])(?!\s)[a-zA-Z\d#-_$@!%&*?]{8,16}/;

    const verification = verificationpassword(claveRegex, passwordAdmin);

    const getUser = 'SELECT * FROM admin';

    const user = await db.prepare(getUser).all();
    console.log(!user[0]);

    if(verification === true && !user[0]){

      saveDB(adminuser, passwordAdmin, interaction.user.id);

      createEmbed(interaction);


    }else{
      interaction.reply(`la contraseña ${passwordAdmin} no cumple con los requisitos para el administrador o el administrador ya tiene un usuario y clave creada`);
    }


  }
};
//verificacion de la contraseña
const verificationpassword = (regex, password) => {
  if(regex.test(password)){
    console.log('esta bien');
    return true;
  }else{
    console.log('esta mal');
    return false;
  }
};
//guardar en la base de datos el usuario
const saveDB = async (nombre, password, user_id) => {

  try{
    const statement = 'INSERT INTO admin (admin_id, user_admin, password) VALUES (?, ?, ?)';
    db.prepare(statement).run(user_id, nombre, password);


  }catch(error){
    console.log(error);
  }

};
//crear embed
const createEmbed = (interaction) => {
  const embed = new EmbedBuilder()

    .setTitle('Felicidades administrador creado' )

    .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWIv8zgtKxuD8BuF0eYnsFGTlOoxHkenSotZLlbKkEDygsZ1I_rJ-mRgy56RkxVsFpJeU&usqp=CAU');

  interaction.reply({ embeds: [embed] });
};