import express from 'express';
import {
    getClavesProducto,
    createClaveProducto,
    updateClaveProducto,
    deleteClaveProducto
} from '../controllers/claveProducto.controller.js';

const router = express.Router();

router.get('/', getClavesProducto);
router.post('/', createClaveProducto);
router.put('/:id', updateClaveProducto);
router.delete('/:id', deleteClaveProducto);

export default router;
