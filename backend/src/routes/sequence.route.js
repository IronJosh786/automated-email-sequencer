import { Router } from "express";
import {
  getSequence,
  addSequence,
  updateSequence,
  deleteSequence,
} from "../controllers/sequence.controller.js";

const router = Router();

router.route("/get-sequence").get(getSequence);
router.route("/add-sequence").post(addSequence);
router.route("/update-sequence/:id").put(updateSequence);
router.route("/delete-sequence/:id").delete(deleteSequence);

export default router;
