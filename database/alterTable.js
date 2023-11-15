const db = require('./index.js');


const alter = () => {



  const alter = `ALTER TABLE accountusers
  ADD user TEXT`;

  db.prepare(alter).run();

};

alter();