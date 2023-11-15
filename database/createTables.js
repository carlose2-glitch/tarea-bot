const db = require('./index.js');

//console.log(db);
const createTables = async () => {
  try{



    /*db.prepare(`UPDATE admin
    SET saldo = ?
    WHERE user_admin = ?`).run('0', 'Yoernis');*/

    /* db.prepare(`
    CREATE TABLE IF NOT EXISTS accountuser (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      number TEXT NOT NULL,
      ci_id INT NOT NULL,
      FOREIGN KEY (ci_id) REFERENCES userlist(ci_id)
        )
    `).run();*/

    /*db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      admin_id INT NOT NULL,
      user_admin INT PRIMARY KEY,
      password TEXT NOT NULL,
      saldo TEXT)
    `).run();*/

    /*db.prepare(`CREATE TABLE IF NOT EXISTS users (
      user TEXT NOT NULL,
      password TEXT NOT NULL,
      ci_id INT PRIMARY KEY
    )`).run();*/

    /* db.prepare(` CREATE TABLE IF NOT EXISTS accountusers (
        account_id INTEGER PRIMARY KEY AUTOINCREMENT,
        ci_id INT NOT NULL,
        number text NOT NULL,
        bank TEXT NOT NULL,
        FOREIGN KEY (ci_id)
        REFERENCES users (ci_id)
            ON DELETE CASCADE
          )`).run();*/
    /* db.prepare(` CREATE TABLE IF NOT EXISTS transfersusa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            pagod text NOT NULL,
            tasa TEXT NOT NULL,
            fecha TEXT NOT NULL,
            referencia TEXT NOT NULL,
            montobs TEXT NOT NULL,
            estado TEXT)`).run();*/

    db.prepare(` CREATE TABLE IF NOT EXISTS transfersvene (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user TEXT NOT NULL,
              montobs text NOT NULL,
              fecha TEXT NOT NULL,
              referencia TEXT NOT NULL)`).run();



  }catch(error){
    console.log(error);
  }


};

/*const ci = 10814971;
const account = '01020000000000000000';
const bank = 'venezuela';
const name = 'Carls';
const createTables = async () => {

  try{
    //const statement = 'INSERT INTO accountusers (user) VALUES (?)';
    const statement = 'UPDATE accountusers SET user = ? WHERE admin_id = ?';
    await db.prepare(statement).run(name, 1234567);

  }catch(error){
    console.log(error);
  }

};*/
createTables();