const db = require('./index');

const getUser = () => {

  try{

    const getUser = 'SELECT * FROM admin';

    const user = db.prepare(getUser).all();
    if(user[0]){

      console.log('verdadero');
    }else{
      console.log(user[0]);
      console.log('falso');
    }
    return user[0];


  }catch(error){
    console.log(error);
  }

};

console.log(getUser());