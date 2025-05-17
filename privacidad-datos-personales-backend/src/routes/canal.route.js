import { Router } from 'express';
import {
    getCanales,
    getCanalById,
    createCanal,
    updateCanal,
    deleteCanal,
} from '../controllers/canal.controller.js';

const router = Router();

router.get('/', getCanales);
router.get('/:id', getCanalById);
router.post('/', createCanal);
router.put('/:id', updateCanal);
router.delete('/:id', deleteCanal);

export default router;
