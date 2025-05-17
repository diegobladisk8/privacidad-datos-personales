import express from 'express';
import {
    getConfiguraciones,
    createConfiguracion,
    updateConfiguracion,
    deleteConfiguracion
} from '../controllers/configuracion.controller.js';

const router = express.Router();

router.get('/', getConfiguraciones);
router.post('', createConfiguracion);
router.put('/:id', updateConfiguracion);
router.delete('/:id', deleteConfiguracion);

export default router;
