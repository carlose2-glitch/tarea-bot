const { SlashCommandBuilder } = require('discord.js');
let date = new Date();
let number = 0;
//const { getMonitor } = require('consulta-dolar-venezuela');
const axios = require('axios');
const db = require('../../database/index');

//https://exchange.vcoud.com/coins/latest


const bankUs = [
  {
    banco: 'citybank',
    inicio: '0456',
    cantidad: 9
  }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('realizar-transferencia-usa')
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
        .setName('nro-cuenta')
        .setDescription('numero de cuenta')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('name-bank')
        .setDescription('nombre del banco')
        .setRequired(true)),
  run: async (client, interaction) => {

    const user = await interaction.options.getString('usuario');
    const password = await interaction.options.getString('clave');
    const account = await interaction.options.getString('nro-cuenta');
    const bank = await interaction.options.getString('name-bank');
    const monto = await interaction.options.getString('monto');

    //interaction.reply(`${user} y ${password} y ${account} y ${bank}`);

    const extractUser = 'SELECT * FROM users WHERE user = ?';
    const get = db.prepare(extractUser).all(user);
    const exist = get[0] !==undefined;

    if (exist){
      verifiData(get, interaction, password, account, bank, monto, user);

    }else{
      interaction.reply('no existe');
    }
  }
};

const verifiData = (get, interaction, password, account, bank, monto, user) => {

  if(get[0].password === password){
    compareBank(account, bank, interaction, monto, user);
  }else{
    interaction.reply('clave incorrecta');
  }

};

const compareBank = (account, bank, interaction, monto, user) => {

  const findBank = bankUs.filter(name => name.banco === bank.toLowerCase());
  const exist = findBank[0] !== undefined;

  if(exist){
    verifiNumberBank(account, monto, interaction, user);
  }else{
    interaction.reply('el banco no disponible');
  }
};

const verifiNumberBank = (account, monto, interaction, user) => {

  const ifNumber = Number(account);
  const verifiNum = !isNaN(ifNumber);
  const separe = account.split('');
  const digit = separe.length === bankUs[0].cantidad;
  // console.log(separe.length);
  //console.log(bankUs[0].cantidad);
  //console.log(separe);
  //console.log(digit);

  if(digit && verifiNum){

    const compareNumber = separe.slice(0, 4).join('');
    const existFour = bankUs[0].inicio === compareNumber;

    if(existFour){

      verifyMont(interaction, monto, user);

    }else{
      interaction.reply('el numero del banco no corresponde con el nombre');
    }


  }else{
    interaction.reply('de ser numero y tener nueve digitos');

  }
};

const verifyMont = async (interaction, monto, user) => {

  const extractDb = 'SELECT * FROM admin';
  const getDb = db.prepare(extractDb).all();

  const montDb = Number(getDb[0].saldo);


  const api = await axios.get('https://exchange.vcoud.com/coins/latest');

  const extractBolivar = api.data.filter(banco => banco.symbol === 'VDT');
  //console.log(extractBolivar[0].price);
  end(interaction, extractBolivar[0].price - 2, monto, montDb, user);

  /*await getMonitor('null').then($ => {
    console.log($['dolar-today'].price - 2);
    end(interaction, $['dolar-today'].price - 2, monto, montDb);
  });*/

};

const end = async (interaction, tasa, monto, saldo, user) => {

  const cuenta = Math.floor(tasa* monto);

  if(cuenta <= saldo){
    savedb(interaction, cuenta, monto, tasa, user);
  }else{
    interaction.reply('no hay saldo suficiente');
  }

  //console.log(saldo);
  //console.log(cuenta);
  //interaction.reply('hola');

};

const savedb = async (interaction, cuentab, montod, tasa, user) => {

  // console.log(date.getDate());//dia
  //console.log(date.getMonth()+1);//mes
  // console.log(date.getFullYear());//año

  const fecha = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  const reference = aleatorio(100000,200000);
  savedbt(interaction, cuentab, montod, tasa, user, fecha, reference);

  await interaction.reply(`su transferencia se hizo correactamente su numero de referncia es ${reference} y su monto es de ${cuentab} por favor al momento de realizar la transferencia venezuela debe ingresar la referencia y el monto correctamente`);
};

const aleatorio = (min, max) => {

  number = String(Math.floor(Math.random() * (1 + max - min)+min));
  const extract = 'SELECT * FROM transfersusa where referencia = ?';
  let getRefe = db.prepare(extract).all(number);

  while(getRefe[0] !== undefined){

    number = String(Math.floor(Math.random() * (1 + max - min)+min));
    getRefe = db.prepare(extract).all(number);
  }

  return number;
};

const savedbt = (interaction, cuentab, montod, tasa, user, fecha, reference) => {

  const extract = 'INSERT INTO transfersusa (user, pagod, tasa, fecha, referencia, montobs, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';

  const save = db.prepare(extract).run(user, montod, String(tasa), fecha, reference, String(cuentab), 'false');
  console.log(save);

  // console.log(String(cuentab), montod, String(tasa), user, fecha, reference, 'false');


};