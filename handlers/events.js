const fs = require('fs');
const eventosDIr = `${process.cwd()}/events`;

module.exports = client => {
  const eventos = fs.readdirSync(eventosDIr).filter(archivo => archivo.endsWith('.js'));
  for(const archivo of eventos){
    const evento = require(`${eventosDIr}/${archivo}`);
    client.on(evento.name, (...args) => evento.run(client, ...args));
    console.log(`✅ | Evento ${archivo.replace(/.js/,'')} cargado`.yellow);
  }
};