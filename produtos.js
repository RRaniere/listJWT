const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

router.get('/', (req, res, next) => { 

    mysql.getConnection((error, conn) => { 
        if(error) { return res.status(500).send({error:error})}
        conn.query(
            'SELECT *FROM produtos', 
            (error, result, fields) => { 
                if(error) {return res.status(500).send ({error:error})}
                const response = { 
                    quantidade: result.length,
                    produtos: result.map(prod => { 
                        return { 
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: { 
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto

                            }
                        }
                    })

                }
                return res.status(200).send({response})
            }
        )
    })


});

router.post('/', (req,res,next) => { 
mysql.getConnection((error,conn) => { 
    if(error) { return res.status(500). send({error:error})}
    conn.query( 
        'INSERT INTO produtos (nome, preco) VALUES (?,?)',
        [req.body.nome, req.body.preco],
        (error,resultado,field) => { 
            conn.release()

            if(error) { 
                return res.status(500).send({ 
                    error:error,
                    response:null
                })
            }

            const response = { 
                mensagem: 'Produto inserido com sucesso',
                produtoCriado: { 
                    id_produto : resultado.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    request: { 
                        tipo: 'POST',
                        descricao: 'Insere um produto', 
                        url: 'http://localhost:3000/produtos/'
                    }
                }
            }

            res.status(201).send(response)
            
        }
    )
})

   
})

router.get('/:id_produto', (req,res,next) => { 

    mysql.getConnection((error, conn) => { 
        if(error) { return res.status(500).send({error:error})}
        conn.query(
            'SELECT *FROM produtos WHERE id_produto = ?', 
            [req.params.id_produto],
            (error, result, fields) => { 
                if(error) {return res.status(500).send ({error:error})}
                if (result.length == 0) { 
                    return res.status(404).send({ 
                        mensagem: 'Não foi encontrado produto com este ID'
                    })
                }
                const response = { 
                    produto: { 
                        id_produto : result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: { 
                            tipo: 'GET',
                            descricao: 'Retorna um produto especifico', 
                            url: 'http://localhost:3000/produtos/' + result[0].id_produto
                        }
                    }
                }


                return res.status(200).send({response})
            }
        )
    })




})

router.patch('/', (req,res,next) => { 
   
    mysql.getConnection((error,conn) => { 
        if(error) { return res.status(500). send({error:error})}
        conn.query( 
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error,resultado,field) => { 
                conn.release()
    
                if(error) { 
                    return res.status(500).send({ 
                        error:error,
                        response:null
                    })
                }

                const response = { 
                    mensagem: 'Produto atualizado com sucesso',
                    nome: req.body.nome,
                    preco: req.body.preco,
                    request: { 
                        tipo: 'PATCH',
                        descricao: 'Atualiza os detalhes de um produto específico',
                        url: 'http://localhost:3000/produtos/' + req.body.id_produto
                    }
                }
    
                res.status(202).send(response)
                
            }
        )
    })


})

router.delete('/', (req,res,next) => { 
    mysql.getConnection((error,conn) => { 
        if(error) { return res.status(500). send({error:error})}
        conn.query( 
            'DELETE FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error,resultado,field) => { 
                conn.release()
    
                if(error) { 
                    return res.status(500).send({ 
                        error:error,
                        response:null
                    })
                }

                const response = { 
                    mensagem: 'Produto removido com sucesso',
                    request : { 
                        tipo : 'DELETE',
                        descricao: 'Remove um produto escepcífico'
                        
                    }
                }
    
                return res.status(202).send(response)
                
            }
        )
    })
})


module.exports = router