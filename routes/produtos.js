const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const multer = require('multer')
const login = require('../middleware/login')

const ProdutosController = require('../controllers/produtos-controllers')


const storage = multer.diskStorage({
    destination: function (req,file,cb) { 
        cb(null, './uploads/')
    },

    filename: function(req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
})

const fileFilter = (req,file, cb) => { 
    if (file.mimetype === 'image.jpeg' || file.mimetype === 'image/png') { 
        cb(null,true)
    } else {
        cb(null,false)
    }
}

const upload = multer({
     storage: storage,
     limits: {
         fileSize: 1024 * 1024 * 5
      }, 
      fileFilter: fileFilter
    })

router.get('/', ProdutosController.getProdutos);
router.post('/', login, upload.single('produto_imagem'), ProdutosController.postProdutos)
router.get('/:id_produto', ProdutosController.getUmProduto)
router.patch('/', ProdutosController.patchProduto)
router.delete('/', ProdutosController.deleteProdutos )


module.exports = router