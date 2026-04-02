import mongoose from 'mongoose';

// Thumbnail sub-schema
const thumbnailSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    max: 2048
  },
  timestamp: {
    type: Number,
    required: false,
    min: 0,
    description: "Video timestamp in seconds for this thumbnail"
  }
});

// Main VideoThumbnail schema - Stores thumbnails for videos
const videoThumbnailSchema = new mongoose.Schema({
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
   
  // Thumbnails array
  thumbnails: [thumbnailSchema],
   
  // Status - Client approval status
  isApproved: {
    type: Boolean,
    default: true
  },
   
  // Creator/Editor references
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
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
videoThumbnailSchema.index({ application: 1 });
videoThumbnailSchema.index({ application: 1, videoId: 1 });
videoThumbnailSchema.index({ application: 1, videoUrl: 1 });
videoThumbnailSchema.index({ createdDate: -1 });

// Pre-save middleware
videoThumbnailSchema.pre('save', function(next) {
  this.editedDate = new Date();
  
  // Auto-generate videoId if not provided
  if (!this.videoId) {
    this.videoId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Set default thumbnail if not set and thumbnails exist
  if (this.thumbnails && this.thumbnails.length > 0 && !this.defaultThumbnail) {
    this.defaultThumbnail = this.thumbnails[0].url;
  }
  
  next();
});

export default mongoose.model('VideoThumbnail', videoThumbnailSchema);
