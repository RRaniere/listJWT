const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const res = require('express/lib/response')

app.use(bodyParser.json())

app.get('/', (req, res) => { 
    res.json({ 
        message: "tudo na mo nice"
    })
})

app.post('/lista', (req, res) => { 
    if (req.body.user == 'ramon' && req.body.password == '123') { 
        res.json({
            message: "tudo na mo nice"
        } ) 
    } res.status(401).end()
} )


const server = http.createServer(app)
server.listen(3000, () => console.log('rodando na porta 3000'))