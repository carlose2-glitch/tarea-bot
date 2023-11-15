const { SlashCommandBuilder } = require('discord.js');
let date = new Date();
let number = 0;
//const { getMonitor } = require('consulta-dolar-venezuela');
const db = require('../../database/index');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('realizar-transferencia-ve')
    .setDescription('realizar transferencia')
    .addStringOption(option =>
      option
        .setName('usuario')
        .setDescription('ingresa el usuario')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('clave')
        .setDescription('clave usuario')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('monto')
        .setDescription('monto en dolares sin decimales')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('referencia')
        .setDescription('numero de cuenta')
        .setRequired(true)),
  run: async (client, interaction) => {

    const user = await interaction.options.getString('usuario');
    const password = await interaction.options.getString('clave');
    const monto = await interaction.options.getString('monto');
    const refer = await interaction.options.getString('referencia');

    const extract = 'SELECT * FROM users where user = ?';
    const getUser = db.prepare(extract).all(user);
    const exist = getUser[0] !== undefined;

    if(exist){

      verificationPass(getUser, password, monto, refer, interaction);

    }else{
      interaction.reply('el usuario no existe');
    }

  } };

const verificationPass = (getUser, password, monto, refer, interaction) => {

  console.log(getUser[0].password);

  if(getUser[0].password === password){
    verificationMont(interaction, monto, refer, getUser);

  }else{
    interaction.reply('la clave es incorrecta');
  }
};

const verificationMont = (interaction, monto, refer, getUser) => {

  //const extract = 'SELECT * FROM transfersusa where montobs = ? and referencia = ?';
  //const getData = db.prepare(extract).all(monto, refer);
  const getDataEstado = 'SELECT * FROM transfersusa where montobs = ? and referencia = ? and estado = ?';
  const get = db.prepare(getDataEstado).all(monto, refer, 'false');

  if(get[0] !== undefined){
    verificationAmountBs(monto, interaction, getUser, refer);

  }else{
    interaction.reply('monto no encontrado / referencia no encontrado o transacion ya realizda');
  }

};

const verificationAmountBs = (monto, interaction, getUser, refer) => {

  const extract = 'SELECT * FROM admin where saldo';
  const get = db.prepare(extract).all();
  const numberAdmin = Number(get[0].saldo);
  const numberUser = Number(monto);
  console.log(numberAdmin, numberUser);

  if(numberUser <= numberAdmin){
    updateEstado(refer);
    saveAmountAdmin(numberAdmin, numberUser);
    const referTransfer = saveHistorialTransfer(numberUser, getUser);
    interaction.reply(`Su transferencia fue realizada con exito, su numero de referncia es ${referTransfer}`);
  }else{
    interaction.reply('el monto en la cuenta del administrador no es suficiente');
  }

};

const saveAmountAdmin = (numberAdmin, numberUser) => {
  console.log(numberAdmin, numberUser);
  const resta = numberAdmin - numberUser;

  const extract = `UPDATE admin
  SET saldo = ?
  WHERE user_admin = ?`;

  const get = db.prepare(extract).run( String(resta), 'Yoernis');
  console.log(get);
};

const saveHistorialTransfer = (numberUser, getUser) => {

  const user = getUser[0].user;
  const monto = String(numberUser);
  const reference = aleatorio(100000,200000);
  const fecha = getFecha();

  //console.log(user, monto, reference, fecha);
  const extract = 'INSERT INTO transfersvene (user, montobs, fecha, referencia) VALUES (?, ?, ?, ?)';
  const save = db.prepare(extract).run(user, monto, fecha, reference);
  console.log(save);

  return reference;

};

const getFecha = () => {

  return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
};

const aleatorio = (min, max) => {

  number = String(Math.floor(Math.random() * (1 + max - min)+min));
  const extract = 'SELECT * FROM transfersvene where referencia = ?';
  let getRefe = db.prepare(extract).all(number);

  while(getRefe[0] !== undefined){

    number = String(Math.floor(Math.random() * (1 + max - min)+min));
    getRefe = db.prepare(extract).all(number);
  }

  return number;
};

const updateEstado = (referencia) => {

  const extract = `UPDATE transfersusa
 SET estado = ?
 WHERE referencia = ?`;

  const fire = db.prepare(extract).run( 'true' , referencia);
  console.log(fire);

};