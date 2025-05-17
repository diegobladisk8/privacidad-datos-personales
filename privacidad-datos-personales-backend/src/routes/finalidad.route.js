import express from 'express';
import {
    getFinalidades,
    createFinalidad,
    updateFinalidad,
    deleteFinalidad
} from '../controllers/finalidad.controller.js';

const router = express.Router();

router.get('/', getFinalidades);
router.post('/', createFinalidad);
router.put('/:id', updateFinalidad);
router.delete('/:id', deleteFinalidad);

export default router;
