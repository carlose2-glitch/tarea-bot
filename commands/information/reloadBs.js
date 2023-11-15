const { SlashCommandBuilder, EmbedBuilder }= require('discord.js');
const db = require('../../database/index');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('recargar-bs')
    .setDescription('Recargar saldo en la cuenta')
    .addStringOption(option =>
      option
        .setName('usuario')
        .setDescription('usuario del administrador')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('clave del administrador')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('monto')
        .setDescription('seleccione el monto, debe ser solo numeros enteros')
        .setRequired(true)),
  run: async (client, interaction) => {

    const user = await interaction.options.getString('usuario');
    const clave = await interaction.options.getString('clave');
    const monto = await Number(interaction.options.getString('monto'));
    //console.log(monto);

    const isNUmber = !isNaN(monto);
    const isInteger = Number.isInteger(monto);
    //console.log(isInteger);

    if(isNUmber && monto > 0){

      if(isInteger){
        verifiUser(user, clave, interaction, monto);

      }else{
        createEmbed('https://i.pinimg.com/564x/c9/4f/c9/c94fc91e0bc75bd03071d42c8cbe4068.jpg', interaction, 'Fallo', 'no debe tener decimales el monto');

      }



    }else{
      createEmbed('https://i.pinimg.com/564x/c9/4f/c9/c94fc91e0bc75bd03071d42c8cbe4068.jpg', interaction, 'Fallo', 'el monto seleccionado debe ser numero y debe ser mayor a 0');

    }
  }
};

//verificar usuario
const verifiUser = (user, clave, interaction, monto) => {

  const search = 'SELECT * FROM admin WHERE user_admin = ?';
  const extraUser = db.prepare(search).all(user);
  const verifiUserdb = extraUser[0] !== undefined;

  if(verifiUserdb){

    if(extraUser[0].password === clave){
      const montoDb = Number(extraUser[0].saldo);
      saveDb(monto, extraUser[0].user_admin, montoDb);
      //interaction.reply('sisass');
      createEmbed('https://i.pinimg.com/564x/c2/80/88/c2808862620e8271032c61c5748de4eb.jpg', interaction, 'felicidades', 'su recarga a sido exitosa');

    }else{
      createEmbed('https://i.pinimg.com/564x/c9/4f/c9/c94fc91e0bc75bd03071d42c8cbe4068.jpg', interaction, 'Fallo', 'la clave no existe');
    }

  }else{
    createEmbed('https://i.pinimg.com/564x/c9/4f/c9/c94fc91e0bc75bd03071d42c8cbe4068.jpg', interaction, 'Fallo', 'el administrador no existe');
  }


};

//guarda en la base de datos

const saveDb = (monto, admin, montoDb) => {

  const suma = String(monto + montoDb);
  console.log(montoDb);
  console.log(suma);
  const execute = `UPDATE admin
  SET saldo = ?
  WHERE user_admin = ?`;
  const fire = db.prepare(execute).run(suma, admin);
  console.log(fire);

};

//embed

const createEmbed = (link, interaction, title, descripcion) => {

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(descripcion)
    .setImage(link);

  interaction.reply({ embeds: [embed] });

};