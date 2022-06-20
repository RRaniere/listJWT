const mysql = require('mysql')

var pool = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: '123456',
    port : 3306,
    database: 'ecommerce',
    multipleStatements : true
})

exports.pool = pool