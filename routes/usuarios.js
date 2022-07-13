const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UsuarioController = require('../controllers/usuarios-controllers')



router.post('/cadastro', UsuarioController.postUsuario  )
router.post('/login', UsuarioController.postLogin)


module.exports = router