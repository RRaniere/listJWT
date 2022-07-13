const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.postUsuario =  (req,res,next) => { 
    mysql.getConnection((err,conn) => {
        if (err) {return res.status(500).send({error: error})}
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, result) => { 
            if (error) {return res.status(500).send({error:error})}
            if (result.length > 0) {
                res.status(409).send({mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.senha, 10, (errbcypt, hash) => { 
                    if (errbcypt) {return res.status(500).send({error: errbcypt})}
                    conn.query('INSERT INTO usuarios (email, senha) VALUES (?,?)', 
                    [req.body.email, hash],
                    (error, results) => {
                        conn.release()
                        if (error) {return res.status(500).send({error: error})}
                        
                        response = {
                        mensagem : 'Usuário crido com sucesso',
                        usuarioCriado: { 
                            id_usuario: results.insertId,
                            email : req.body.email
                        }
                    }
                        return res.status(201).send({ response })
                    })
                })
            }
        })  
    })
}

exports.postLogin = (req,res,next) => { 
    mysql.getConnection((error, conn) => { 
        const query = 'SELECT * FROM usuarios WHERE email =?';
        conn.query(query,[req.body.email], (error, results,fiels) => { 
            conn.release()
            if (error) {return res.status(500).send({ error: error})}
            if (results.length < 1) { 
                return res.status(401).send({ mensagem: 'Falha na autenticação'})
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => { 
                if (err) { 
                    return res.status(404).send({mensagem: 'Falha na autenticação'})
                }
                if( result) { 
                    let token = jwt.sign({ 
                        id_usuario: results[0].id_usuario,
                        email:results[0].email
                    },'segredo', {expiresIn: "1h"})

                    return res.status(200).send({
                        
                        mensagem: 'Autenticado com sucesso',
                        token: token

                    })

                }
                return res.status(404).send({mensagem: 'Falha na autenticação'})
            })
        })
    })
}