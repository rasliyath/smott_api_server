import mongoose from 'mongoose';
const Item = new mongoose.Schema({
    
    lang_Title:
    {
      type: String,
      require: false,
    },
    lang_code: {
      type: String,
      require: false,
    },
    lang_default: {
      type: Boolean,
      require: false,
    }
  });
  const userSchema = new mongoose.Schema({
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    languages:[Item],
  
    date: {
      type: Date,
      default: Date.now,
    },
  });
  export default mongoose.model("Language", userSchema);
  