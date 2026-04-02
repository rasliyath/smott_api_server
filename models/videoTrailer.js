
import mongoose from 'mongoose';
const videoTrailerSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true,
    maxlength: 2048,
    trim: true
  },
  
  isApproved: {
  type: Boolean,
  default: true
  },
  video_title: {
    type: String,
    required: false,      // make true if you want mandatory
    maxlength: 255,
    trim: true
  }
}, {
  timestamps: true   // auto adds createdAt & updatedAt
});
export default mongoose.model('VideoTrailer', videoTrailerSchema);