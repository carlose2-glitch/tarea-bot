
const db = require('../database/index');
const { AsciiTable3 , AlignmentEnum } = require('ascii-table3');
const { codeBlock } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  run:async(client, interaction) => {
    const comando = client.comandos.get(interaction.commandName);
    const nombre = interaction.customId;
    if (nombre === 'users'){

      const extractUsers = 'SELECT * FROM users';
      const getUsers = db.prepare(extractUsers).all();
      console.log(getUsers);

      const formatUsers = getUsers.map( data => {
        return [data.user, data.password, data.ci_id];
      });

      console.log(formatUsers);

      const table = new AsciiTable3('USUARIOS')
        .setStyle('compact')
        .setHeading('Usuario', 'Password', 'Cedula')
        .setAlign(3, AlignmentEnum.CENTER)
        .addRowMatrix(formatUsers);



      await interaction.reply(codeBlock(table.toString()));
      //interaction.reply('usuarios');
    }else if (nombre === 'btn'){

      interaction.reply('en proceso');

    }else if(nombre === 'sald'){

      const extratSald = 'SELECT * FROM admin where user_admin = ?';
      const getSald = db.prepare(extratSald).all('Yoernis');

      //console.log(getSald);
      interaction.reply(`Su saldo es de ${getSald[0].saldo} Bolivares`);

    }else if(comando){

      comando.run(client, interaction);

    }else{
      console.log('pss');
      interaction.reply({ content: '❌ el comando no existe o esta desactualizado' });
    }
  }
};