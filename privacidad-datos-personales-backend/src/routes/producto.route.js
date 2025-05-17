
import express from 'express';
import {
    getProductos,
    createProducto,
    updateProducto,
    deleteProducto,
} from '../controllers/producto.controller.js';

const router = express.Router();

router.get('/', getProductos);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;
