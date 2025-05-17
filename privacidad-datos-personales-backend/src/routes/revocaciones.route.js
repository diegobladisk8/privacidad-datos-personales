import express from "express";
import {
    getAllRevocaciones,
    getRevocacionById,
    createRevocacion,
    updateRevocacion,
    deleteRevocacion,
} from "../controllers/revocaciones.controller.js";

const router = express.Router();

router.get("/", getAllRevocaciones);
router.get("/:id", getRevocacionById);
router.post("/", createRevocacion);
router.put("/:id", updateRevocacion);
router.delete("/:id", deleteRevocacion);

export default router;
