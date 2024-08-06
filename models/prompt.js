import mongoose from "mongoose";

const PromptSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required."],
  },
  tag: {
    type: String,
    required: [true, "Tag is required."],
  },
});

const Prompt = mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);

export default Prompt;
