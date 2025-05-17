// routes/bitacoraConfiguracionRoutes.js
import express from "express";
import {
    getAllBitacoras,
    getBitacoraById,
    createBitacora,
    updateBitacora,
    deleteBitacora,
} from "../controllers/bitacoraConfiguracion.controller.js";

const router = express.Router();

router.get("/", getAllBitacoras);
router.get("/:id", getBitacoraById);
router.post("/", createBitacora);
router.put("/:id", updateBitacora);
router.delete("/:id", deleteBitacora);

export default router;
