import Sequence from "../models/sequence.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { scheduleEmails } from "../utils/emailScheduler.js";

const startProcess = asyncHandler(async (req, res) => {
  const { nodes, edges } = req.body;
  try {
    const newSequence = new Sequence({ nodes, edges });
    await newSequence.save();

    await scheduleEmails();
    res.status(200).send("Sequence saved and emails scheduled");
  } catch (error) {
    res.status(500).send("Error saving sequence");
  }
});

export { startProcess };
