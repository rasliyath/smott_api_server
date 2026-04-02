import mongoose from 'mongoose';

// Video Metadata sub-schema
const metadataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    max: 500
  },
  status: {
    type: String,
    required: false,
    max: 255
  },
  description: {
    type: String,
    required: false,
    max: 5000
  },
  keywords: {
    type: [String],
    required: false
  },
  category: {
    type: String,
    required: false,
    max: 255
  },
  tags: {
    type: [String],
    required: false
  },
  embedding: {
    type: [Number],
    required: false
  }
}, { _id: false });

// Main VideoMetadata schema - Stores metadata for videos
const videoMetadataSchema = new mongoose.Schema({
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
   
  // Metadata - stored as array with one element
  metadata: {
    type: [metadataSchema],
    default: [{}]
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
videoMetadataSchema.index({ application: 1 });
videoMetadataSchema.index({ application: 1, videoId: 1 });
videoMetadataSchema.index({ application: 1, videoUrl: 1 });
videoMetadataSchema.index({ 'metadata.category': 1 });
videoMetadataSchema.index({ createdDate: -1 });

// Pre-save middleware
videoMetadataSchema.pre('save', function(next) {
  this.editedDate = new Date();
  
  // Auto-generate videoId if not provided
  if (!this.videoId) {
    this.videoId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

export default mongoose.model('VideoMetadata', videoMetadataSchema);
