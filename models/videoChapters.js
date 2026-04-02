import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Chapter sub-schema
const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 255
  },
  start_time: {
    type: Number,
    required: true,
    min: 0
  },
  end_time: {
    type: Number,
    required: false,
    min: 0
  },
  timestamp: {
    type: String,
    required: false,
    max: 10
  },
});

// Main VideoChapter schema - Stores auto-generated chapters for videos
const videoChapterSchema = new mongoose.Schema({
  // Application reference (required)
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
   
  // Unique identifier for the video within the app (optional)
  videoId: {
    type: String,
    required: false,
    max: 255,
    default: null
  },
   
  // Video source information
  videoUrl: {
    type: String,
    required: false,
    max: 2048
  },
  videoFileName: {
    type: String,
    required: false,
    max: 255
  },
   
  // Chapters array
  chapters: [chapterSchema],
   
  // Status - Client approval status
  isApproved: {
    type: Boolean,
    default: true
  },
   
  // Creator/Editor references
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   
  // Timestamps
  createdDate: {
    type: Date,
    default: Date.now
  },
  editedDate: {
    type: Date,
    required: false
  }
});

// Index for efficient queries
videoChapterSchema.index({ application: 1 });
videoChapterSchema.index({ application: 1, videoId: 1 });
videoChapterSchema.index({ application: 1, videoUrl: 1 });
videoChapterSchema.index({ createdDate: -1 });

// Pre-save middleware to set videoId if not provided
videoChapterSchema.pre('save', function(next) {
  this.editedDate = new Date();
  
  // Auto-generate videoId if not provided
  if (!this.videoId) {
    this.videoId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

export default mongoose.model('VideoChapter', videoChapterSchema);
