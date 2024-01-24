import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Each task must be linked to a user"],
    },
    title: {
      type: String,
      required: [true, "Please task tilr"],
    },
    description: {
      type: String,
    },
    completed: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true },
    projectId: { type: String },
    estimate: { type: Number },
    sortOrder: { type: Number },
    event: { type: Object },
    activatedAt: { type: Number },
    completedAt: { type: Number },
    parentTaskId: { type: String },
    tags: { type: [String] },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Phonebook || mongoose.model("Task", TaskSchema);
