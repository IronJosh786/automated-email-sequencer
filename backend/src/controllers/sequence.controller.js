import Sequence from "../models/sequence.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getSequence = asyncHandler(async (req, res) => {
  const sequences = await Sequence.find();
  res.json(sequences);
});

const addSequence = asyncHandler(async (req, res) => {
  const newSequence = new Sequence(req.body);
  await newSequence.save();
  res.json(newSequence);
});

const updateSequence = asyncHandler(async (req, res) => {
  const updatedSequence = await Sequence.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedSequence);
});

const deleteSequence = asyncHandler(async (req, res) => {
  await Sequence.findByIdAndRemove(req.params.id);
  res.json({ message: "Sequence deleted" });
});

export { getSequence, addSequence, updateSequence, deleteSequence };
