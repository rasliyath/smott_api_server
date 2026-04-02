import mongoose from 'mongoose';

// Subtitle segment sub-schema
const subtitleSegmentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    max: 2000
  },
  start: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    description: "Start time - can be number or object with parsedValue"
  },
  end: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    description: "End time - can be number or object with parsedValue"
  }
});
// Main VideoSubtitle schema - Stores subtitles for videos
const videoSubtitleSchema = new mongoose.Schema({
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
   
  // Original video URL (the video before subtitle was added)
  originalVideoUrl: {
    type: String,
    required: false,
    max: 2048
  },
  originalVideoFileName: {
    type: String,
    required: false,
    max: 255
  },
   
  // Subtitled video URL
  videoUrl: {
    type: String,
    required: false,
    max: 2048
  },
   
  // Available languages
  languages: [{
    type: String,
    max: 10
  }],
   
  // SRT URLs for each language
  srtUrls: {
    type: Map,
    of: String,
    required: false
  },
   
  // All subtitle segments for each language
  languageSubtitles: {
    type: Map,
    of: [subtitleSegmentSchema],
    required: false
  },
   
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
videoSubtitleSchema.index({ application: 1 });
videoSubtitleSchema.index({ application: 1, videoId: 1 });
videoSubtitleSchema.index({ application: 1, originalVideoUrl: 1 });
videoSubtitleSchema.index({ application: 1, videoUrl: 1 });
videoSubtitleSchema.index({ languages: 1 });
videoSubtitleSchema.index({ status: 1 });
videoSubtitleSchema.index({ createdDate: -1 });

// Pre-save middleware
videoSubtitleSchema.pre('save', function(next) {
  this.editedDate = new Date();
  
  // Auto-generate videoId if not provided
  if (!this.videoId) {
    this.videoId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

export default mongoose.model('VideoSubtitle', videoSubtitleSchema);
