const Database = require('better-sqlite3');

const db = new Database('bot.db');

//console.log('hola');
console.log(db.prepare);

module.exports = db;

