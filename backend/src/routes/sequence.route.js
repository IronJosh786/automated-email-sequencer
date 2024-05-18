import { Router } from "express";
import { startProcess } from "../controllers/sequence.controller.js";

const router = Router();

router.route("/start-process").post(startProcess);

export default router;
