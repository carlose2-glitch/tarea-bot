const db = require('./index');


const deletee = () => {
  const deleteeee = 'DELETE from transfersvene where referencia = ?';
  /*const deleteeee = `ALTER TABLE accountusers
  DROP COLUMN user`;*/

  db.prepare(deleteeee).run('133144');


};

deletee();


/*const delete2 = () => {



  const deleteeee = 'DROP TABLE transfersusa';
  const deleteeee = `ALTER TABLE accountuser
  DROP FOREIGN KEY ci_id`;

  db.prepare(deleteeee).run();

};*/

//delete2();