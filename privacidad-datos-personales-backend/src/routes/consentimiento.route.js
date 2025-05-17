// routes/consentimientoRoutes.js
import express from "express";
import {
    getAllConsentimientos,
    getConsentimientoById,
    createConsentimiento,
    updateConsentimiento,
    deleteConsentimiento,
} from "../controllers/consentimiento.controller.js";

const router = express.Router();

router.get("/", getAllConsentimientos);
router.get("/:id", getConsentimientoById);
router.post("", createConsentimiento);
router.put("/:id", updateConsentimiento);
router.delete("/:id", deleteConsentimiento);

export default router;
