import mongoose from "mongoose";

const sequenceSchema = new mongoose.Schema(
  {
    name: String,
    nodes: Array,
  },
  { timestamps: true }
);

const Sequence = mongoose.model("Sequence", sequenceSchema);
export default Sequence;
