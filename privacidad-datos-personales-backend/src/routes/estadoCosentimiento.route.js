
import express from 'express';
import {
    getEstadosConsentimiento,
    createEstadoConsentimiento,
    updateEstadoConsentimiento,
    deleteEstadoConsentimiento
} from '../controllers/estadoCosentimiento.controller.js';

const router = express.Router();

router.get('/', getEstadosConsentimiento);
router.post('/', createEstadoConsentimiento);
router.put('/:id', updateEstadoConsentimiento);
router.delete('/:id', deleteEstadoConsentimiento);

export default router;
