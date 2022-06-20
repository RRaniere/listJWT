const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

router.get('/', (req, res, next) => { 
    mysql.getConnection((error, conn) => { 
        if(error) { return res.status(500).send({error:error})}
        conn.query(
            'SELECT *FROM pedidos', 
            (error, result, fields) => { 
                if(error) {return res.status(500).send ({error:error})}
                const response = { 
                    quantidade: result.length,
                    pedidos: result.map(pedido => { 
                        return { 
                            id_pedido: pedido.id_produto,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            request: { 
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido especifico',
                                url: 'http://localhost:3000/produtos/' + pedido.id_pedido

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


mysql.getConnection((error, conn) => { 
    if (error) {return res.send(500).send({error:error})}
    conn.query('SELECT * FROM produtos WHERE id_produto = ?', [req.body.id_produto],
    (error, result, field) => { 
        if(error) {return res.status(500).send({error:error})}
        if (result.length == 0 ) { 
            return res.status(404).send({ 
                mensagem: 'Produto não encontrado'
            })
        }

        conn.query( 
            'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
            [req.body.id_produto, req.body.quantidade],
            (error,resultado,field) => { 
                conn.release()
    
                if(error) { 
                    return res.status(500).send({ 
                        error:error,
                        response:null
                    })
                }
    
                const response = { 
                    mensagem: 'Pedido criado com sucesso',
                    pedidoCriado: { 
                        id_pedido : resultado.id_pedido,
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: { 
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um pedido', 
                            url: 'http://localhost:3000/pedidos/'
                        }
                    }
                }
    
                res.status(201).send(response)
                
            }
        )
    })




    })
})


router.get('/:id_pedido', (req,res,next) => { 
    mysql.getConnection((error, conn) => { 
        if(error) { return res.status(500).send({error:error})}
        conn.query(
            'SELECT *FROM pedidos WHERE id_pedido = ?', 
            [req.params.id_pedido],
            (error, result, fields) => { 
                if(error) {return res.status(500).send ({error:error})}
                if (result.length == 0) { 
                    return res.status(404).send({ 
                        mensagem: 'Não foi encontrado pedido com este ID'
                    })
                }
                const response = { 
                    pedido: { 
                        id_pedido : result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: { 
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos', 
                            url: 'http://localhost:3000/pedidos/' 
                        }
                    }
                }


                return res.status(200).send({response})
            }
        )
    })


})


router.delete('/', (req,res,next) => { 
    mysql.getConnection((error,conn) => { 
        if(error) { return res.status(500). send({error:error})}
        conn.query( 
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [req.body.id_pedido],
            (error,resultado,field) => { 
                conn.release()
    
                if(error) { 
                    return res.status(500).send({ 
                        error:error,
                        response:null
                    })
                }

                const response = { 
                    mensagem: 'Pedido removido com sucesso',
                    request : { 
                        tipo : 'POST',
                        descricao: 'Insere um pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: { 
                            id_podutos: 'NUMBER',
                            quantidade: 'NUMBER'
                        }
                        
                    }
                }
    
                return res.status(202).send(response)
                
            }
        )
    })
})


module.exports = router