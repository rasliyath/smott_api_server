import mongoose from 'mongoose';

const qoeEventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    index: true,
    required: true
  },
  applicationId: {
    type: String,
    index: true,
    default: null
  },
  userId: {
    type: String,
    default: 'anonymous'
  },
  videoId: {
    type: String,
    required: true,
    index: true
  },

  // Only store critical event types
  eventType: {
    type: String,
    required: true
  },

  // Event-specific data
  eventData: {
    // For buffering
    duration: Number,  // buffering duration in seconds
    quality: String,

    // For quality change
    fromQuality: String,
    toQuality: String,

    // For errors
    errorCode: String,
    errorMessage: String,

    // For crashes
    message: String,
    source: String,
    lineno: Number,
    colno: Number,
    stack: String,
    userAgent: String,

    // Position in video
    videoTime: Number
  },

  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Timezone information
  timezone: {
    type: String,
    default: null
  }
});

export default mongoose.model('QoEEvent', qoeEventSchema);