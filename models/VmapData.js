import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  fileName: String,
  vmapXml: String,
  xmlLink: String,
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  editedDate: {
    type: Date,
    required: false,
  },
});

export default mongoose.model("VmapData", userSchema);
