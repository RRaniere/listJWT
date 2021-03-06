const mysql = require('../mysql').pool

exports.getProdutos = (req, res, next) => { 

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
                            imagem_produto: prod.imagem_produto,
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
}


exports.postProdutos = (req,res,next) => { 
    console.log(req.file)
    mysql.getConnection((error,conn) => { 
        if(error) { return res.status(500). send({error:error})}
        conn.query( 
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [req.body.nome, req.body.preco, req.file.path],
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
                        imagem_produto: req.file.path,
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
}

exports.getUmProduto = (req,res,next) => { 

    mysql.getConnection((error, conn) => { 
        if(error) { return res.status(500).send({error:error})}
        conn.query(
            'SELECT *FROM produtos WHERE id_produto = ?', 
            [req.params.id_produto],
            (error, result, fields) => { 
                if(error) {return res.status(500).send ({error:error})}
                if (result.length == 0) { 
                    return res.status(404).send({ 
                        mensagem: 'N??o foi encontrado produto com este ID'
                    })
                }
                const response = { 
                    produto: { 
                        id_produto : result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
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
}

exports.patchProduto = (req,res,next) => { 
   
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
                        descricao: 'Atualiza os detalhes de um produto espec??fico',
                        url: 'http://localhost:3000/produtos/' + req.body.id_produto
                    }
                }
                res.status(202).send(response)        
            }
        )
    })
}

exports.deleteProdutos = (req,res,next) => { 
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
                        descricao: 'Remove um produto escepc??fico'
                        
                    }
                }
    
                return res.status(202).send(response)
                
            }
        )
    })
}