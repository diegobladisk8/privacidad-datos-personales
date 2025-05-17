
import express from 'express';
import {
    getFlujos,
    createFlujo,
    updateFlujo,
    deleteFlujo,
} from '../controllers/flujo.controller.js';

const router = express.Router();

router.get('/', getFlujos);
router.post('/', createFlujo);
router.put('/:id', updateFlujo);
router.delete('/:id', deleteFlujo);

export default router;
