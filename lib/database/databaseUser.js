/**
 * Created by Dark Hells on 26.10.2014.
 */
/*--- MySQL Database----*/
var mysql = require('mysql');

var connection;

exports.createConnection = function () {
    connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '00291256',
        database: 'test'
    });
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            require('./databaseUser').createConnection();
        } else {
            throw err;
        }
    });
};

exports.add_user = function (user, eventAddUser) {
    insert_user(user);
    function insert_user(user) {
        connection.query('INSERT INTO users SET ?', user, finish);
    }

    function finish(err, result) {

      if(err) {
             eventAddUser.emit("error");
      }
        eventAddUser.emit('add');
    }
};

exports.login_user = function(user, eventLoginUser){
    var login = '"'+user.login+'"';
    var password = user.password;
    check_login(login);
    function check_login(login){
        connection.query('SELECT login FROM users WHERE login ='+login, select_password);
    }
    function select_password(err, result){
        if (err) {
            eventLoginUser.emit('error');
        }
        connection.query('SELECT password FROM users WHERE login ='+login, finish);
    }
    function finish(err, result){
        console.log(result);
        console.log(err);
        if ((err) || (result.length == 0)){
            eventLoginUser.emit('error');
            return;
        }
        if (password == result[0].password) {
            eventLoginUser.emit('ok');
        }else{
            eventLoginUser.emit('error');
        }
    }
}