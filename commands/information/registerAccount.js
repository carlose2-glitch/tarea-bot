const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/index');

const banks = [
  {
    name:'venezuela',
    inicial: '0102'
  },
  {
    name:'banesco',
    inicial:'0134'
  },
  {
    name:'mercantil',
    inicial:'0105'
  },
  {
    name:'bancaribe',
    inicial:'0114'
  }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registar-cuenta')
    .setDescription('registar cuenta de usuario creado')
    .addStringOption(option =>
      option
        .setName('ci')
        .setDescription('cedula del usuario creado')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('nro-cuenta')
        .setDescription('numero de cuenta del usuario creado')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('bank')
        .setDescription('nombre del banco')
        .setRequired(true)),
  run: async (client, interaction) => {

    const ci = await Number(interaction.options.getString('ci'));
    const account = await interaction.options.getString('nro-cuenta');
    const bank = await interaction.options.getString('bank');

    //verificar si el usuario existe
    const getUser = 'SELECT * FROM users WHERE ci_id = ?';
    const userGet = await db.prepare(getUser).get(ci);
    console.log(userGet);
    const userExist = userGet !== undefined;


    //verifica si la cedula del usuario existe en la base de datos
    if(userExist){
      verificationNameBank(interaction, account, bank, ci);
    }else{
      createEmbed('https://i.pinimg.com/564x/19/2f/c7/192fc7e532c10425289b49d7d8b5c1cc.jpg', interaction, 'el usuario no existe', 'Que mal');
    }
  }
};

//verifica que el nombre del banco no este en la base de datos y que este en el objeto banks
const verificationNameBank = async (interaction, account , bank, ci) => {

  const findBankName = await banks.filter(banco => banco.name === bank.toLowerCase());//busca si el nombre del banco esta en el objeto

  const getBankNameUsers =`
  SELECT * FROM accountusers
  WHERE ci_id = ?
  `;
  const extractData = await db.prepare(getBankNameUsers).all(ci);

  if(extractData.length === 0){
    console.log('no existe datos');
    verificationBank(interaction, account, bank, ci);
  }else{
    console.log('existe un dato');
    const vericarBankName = await extractData.filter(banco => banco.name === bank.toLowerCase());
    console.log(vericarBankName[0]);
    const exist = vericarBankName[0] === undefined;
    console.log(exist);
    if(exist && findBankName[0] !== undefined){
      verificationBank(interaction, account, bank, ci);
    }else{
      createEmbed('https://i.pinimg.com/564x/19/2f/c7/192fc7e532c10425289b49d7d8b5c1cc.jpg', interaction, 'el usuario ya tiene una cuenta con este banco o no esta bien escrito el nombre del banco', 'Que mal');
    }
  }



};
//verifica que el numero de cuenta contenga 20 digitos, verifica que las iniciales del numero de cuenta se encuentren disponibles en el objeto banks
//que los 20 digitos sean numeros, y que no se encuentre en la base de datos
const verificationBank = async (interaction, account, bank, ci) => {

  const getBankNumber =`
  SELECT * FROM accountusers
  WHERE number = ?
  `;
  const extractNumberBank = await db.prepare(getBankNumber).all(account);

  console.log(extractNumberBank);
  console.log(extractNumberBank[0] === undefined);
  const verificationNumber = extractNumberBank[0] === undefined;

  const accountArray = account.split('');//lo convierte en un arreglo el numero de cuenta
  const compareNumber = accountArray.slice(0, 4).join('');//extrae los primeros 4 caracteres del arreglo
  const findBankNumber = await banks.filter(banco => banco.inicial === compareNumber);//compara si los primeros 4 numeros coinciden
  const vericationNumberAccount = Number(account); //convierte a numero
  const verificationNumberlength = account.length === 20;// pregunta si el numero de cuenta ingresado tiene 20 digitos
  //console.log(vericationNumberAccount);
  if(verificationNumberlength && findBankNumber[0] !== undefined && !isNaN(vericationNumberAccount) && verificationNumber){
    compareBankNaNu(interaction, account, bank, findBankNumber,ci);
  }else{
    createEmbed('https://i.pinimg.com/564x/19/2f/c7/192fc7e532c10425289b49d7d8b5c1cc.jpg', interaction, 'el numero de cuenta ingresado incorrecto o no corresponde al banco', 'Que mal');

  }


};
//compara el numero de cuenta con el nombre del banco
const compareBankNaNu = async (interaction, account, bank, firstFourNumbers, ci) => {

  const compareNameBankNumber = banks.filter(banco => banco.name === bank.toLowerCase());

  if(firstFourNumbers[0] === compareNameBankNumber[0]){
    saveAccount(ci, account, bank);
    createEmbed('https://i.pinimg.com/564x/c3/c3/06/c3c30627a8c5d88c04654ad5b7ea359c.jpg', interaction, 'su cuenta pudo ser registrada', 'felicidades');

  }else{
    createEmbed('https://i.pinimg.com/564x/19/2f/c7/192fc7e532c10425289b49d7d8b5c1cc.jpg', interaction, 'su cuenta no pudo ser registrada', 'Que mal');
  }


};
//se encarga de guardar en la base de datos el numero de cuenta del usuario
const saveAccount = async (ci, account, bank) => {
  try{
    const statement = 'INSERT INTO accountusers (ci_id, number, bank) VALUES (?, ?, ?)';
    await db.prepare(statement).run(ci, account, bank.toLowerCase());

  }catch(error){
    console.log(error);
  }
};

const createEmbed = (link, interaction, message,title) => {
  const embed = new EmbedBuilder()

    .setTitle(title)

    .setImage(link);

  interaction.reply({ embeds: [embed], content: `${message}` });
};