const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

const PedidosController = require('../controllers/pedidos-controllers')

router.get('/', PedidosController.getPedidos )
router.post('/', PedidosController.postPedidos)
router.get('/:id_pedido', PedidosController.getUmPedido)
router.delete('/', PedidosController.deletePedido)


module.exports = router