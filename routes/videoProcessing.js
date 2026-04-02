import express from 'express';
import mongoose from "mongoose";
import VideoChapter from '../models/videoChapters.js';
import VideoSubtitle from '../models/videoSubtitles.js';
import VideoThumbnail from '../models/videoThumbnails.js';
import VideoMetadata from '../models/videoMetadata.js';
import VideoTrailer from '../models/videoTrailer.js';
import { verify } from './verifyToken.js';
import createError from "http-errors";

const router = express.Router();

// ==================== VIDEO CHAPTERS API ====================
 
router.post('/chapters/save', verify, async (req, res, next) => {
  try {
    const { appid, id, videoId, videoUrl, videoFileName, chapters } = req.body;
 
    if (!appid) throw createError(400, "appid is required");
    if (!chapters || !Array.isArray(chapters))
      throw createError(400, "Chapters array is required");
 
    let videoChapter;
 
    if (id) {
      videoChapter = await VideoChapter.findById(id);
    } else if (videoId) {
      videoChapter = await VideoChapter.findOne({
        application: appid,
        videoId
      }).sort({ createdDate: -1 });
    } else if (videoUrl) {
      videoChapter = await VideoChapter.findOne({
        application: appid,
        videoUrl
      }).sort({ createdDate: -1 });
    }
 
    if (videoChapter) {
      if (videoUrl !== undefined) videoChapter.videoUrl = videoUrl;
      if (videoFileName !== undefined) videoChapter.videoFileName = videoFileName;
      if (videoId !== undefined) videoChapter.videoId = videoId;
      videoChapter.chapters = chapters;
      videoChapter.editedBy = req.user._id;
      await videoChapter.save();
    } else {
      videoChapter = new VideoChapter({
        application: appid,
        videoId: videoId || null,
        videoUrl: videoUrl || '',
        videoFileName: videoFileName || '',
        chapters,
        createdBy: req.user._id,
        editedBy: req.user._id
      });
      await videoChapter.save();
    }
 
    res.json(videoChapter);
 
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});
 
 
router.get('/chapters/:appid', verify, async (req, res, next) => {
  try {
    const { appid } = req.params;
    if (!appid) throw createError(400, "appid is required");
 
    const videoChapters = await VideoChapter.find({ application: appid })
      .select('chapters _id application videoUrl videoFileName videoId createdDate')
      .sort({ createdDate: -1 });
 
    if (!videoChapters || videoChapters.length === 0)
      return res.json({ data: [] });
 
    const response = videoChapters.map(vp => ({
      _id: vp._id,
      videoId: vp.videoId || vp._id,
      videoUrl: vp.videoUrl,
      videoFileName: vp.videoFileName,
      chapters: vp.chapters,
      createdDate: vp.createdDate
    }));
 
    res.json({ data: response });
 
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});
 // DELETE /chapters/:appid/:id - Delete a video chapter
router.delete('/chapters/:appid/:id', verify, async (req, res, next) => {
  try {
    const { appid, id } = req.params;

    if (!appid) throw createError(400, "appid is required");
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createError(400, "Invalid chapter id format");

    const deleted = await VideoChapter.findOneAndDelete({ _id: id, application: appid });

    if (!deleted)
      throw createError(404, "Chapter not found");

    res.json({ success: true, message: "Chapter deleted successfully" });

  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});

// ==================== VIDEO SUBTITLES API ====================
 
router.post('/subtitles/save', verify, async (req, res, next) => {
  try {
    const {
      appid, id, videoId,
      originalVideoUrl, originalVideoFileName,
      videoUrl,
      languages, srtUrls, srt_urls, languageSubtitles,
    } = req.body;
 
    if (!appid) throw createError(400, "appid is required");
    if (!videoUrl && !languageSubtitles)
      throw createError(400, "videoUrl or languageSubtitles is required");
 
    const finalSrtUrls = srtUrls || srt_urls || {};
 
    let videoSubtitle;
 
    if (id) {
      videoSubtitle = await VideoSubtitle.findById(id);
    } else if (videoId) {
      videoSubtitle = await VideoSubtitle.findOne({
        application: appid,
        videoId
      }).sort({ createdDate: -1 });
    } else if (originalVideoUrl) {
      videoSubtitle = await VideoSubtitle.findOne({
        application: appid,
        originalVideoUrl
      }).sort({ createdDate: -1 });
    }
 
    if (videoSubtitle) {
      if (originalVideoUrl !== undefined) videoSubtitle.originalVideoUrl = originalVideoUrl;
      if (originalVideoFileName !== undefined) videoSubtitle.originalVideoFileName = originalVideoFileName;
      if (videoId !== undefined) videoSubtitle.videoId = videoId;
      if (videoUrl !== undefined) videoSubtitle.videoUrl = videoUrl;
      if (languages !== undefined) videoSubtitle.languages = languages;
      if (finalSrtUrls) videoSubtitle.srtUrls = finalSrtUrls;
      if (languageSubtitles !== undefined) videoSubtitle.languageSubtitles = languageSubtitles;
 
      videoSubtitle.editedBy = req.user._id;
      await videoSubtitle.save();
    } else {
      videoSubtitle = new VideoSubtitle({
        application: appid,
        videoId: videoId || null,
        originalVideoUrl: originalVideoUrl || '',
        originalVideoFileName: originalVideoFileName || '',
        videoUrl: videoUrl || '',
        languages: languages || [],
        srtUrls: finalSrtUrls,
        languageSubtitles: languageSubtitles || {},
        createdBy: req.user._id,
        editedBy: req.user._id
      });
      await videoSubtitle.save();
    }
 
    res.json(videoSubtitle);
 
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});
 
 
router.get('/subtitles/:appid', verify, async (req, res, next) => {
  try {
    const { appid } = req.params;
    if (!appid) throw createError(400, "appid is required");
 
    const videoSubtitles = await VideoSubtitle.find({ application: appid })
      .select('videoUrl originalVideoUrl languages srtUrls status progress _id application videoId createdDate languageSubtitles')
      .sort({ createdDate: -1 });
 
    if (!videoSubtitles || videoSubtitles.length === 0)
      return res.json({ data: [] });
 
    res.json({ data: videoSubtitles });
 
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});

// DELETE /subtitles/:appid/:id - Delete a video subtitle
router.delete('/subtitles/:appid/:id', verify, async (req, res, next) => {
  try {
    const { appid, id } = req.params;

    if (!appid) throw createError(400, "appid is required");
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createError(400, "Invalid subtitle id format");

    const deleted = await VideoSubtitle.findOneAndDelete({ _id: id, application: appid });

    if (!deleted)
      throw createError(404, "Subtitle not found");

    res.json({ success: true, message: "Subtitle deleted successfully" });

  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});



 
 
// ==================== VIDEO TRAILER API ====================
 
router.post('/trailer/save', verify, async (req, res, next) => {
  try {
    const { appid, url, video_title } = req.body;
 
    if (!appid) throw createError(400, "appid is required");
    if (!mongoose.Types.ObjectId.isValid(appid))
      throw createError(400, "Invalid appid format");
    if (!url) throw createError(400, "url is required");
 
    // Create a new trailer for the appid with isApproved default true
    const trailer = await VideoTrailer.create({
      application: appid,
      url,
      video_title: video_title || null,
      isApproved: true
    });
 
    res.json({ success: true, data: trailer });
 
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});
 
 
router.get('/trailer/:appid', verify, async (req, res, next) => {
  try {
    const { appid } = req.params;
 
    // Find trailers for the specific application ID
    const trailers = await VideoTrailer
      .find({ application: appid })
      .sort({ createdAt: -1 });
 
    // Always return success, even if empty
    res.json({
      success: true,
      data: {
        application_id: appid,
        trailers: trailers || []
      }
    });
 
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});
 
 
router.delete('/trailer/:application_id/:trailer_id', verify, async (req, res, next) => {
  try {
    const { application_id, trailer_id } = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(application_id))
      throw createError(400, "Invalid application_id format");
 
    if (!mongoose.Types.ObjectId.isValid(trailer_id))
      throw createError(400, "Invalid trailer_id format");
 
    const deleted = await VideoTrailer.findOneAndDelete({
      _id: trailer_id,
      application: application_id
    });
 
    if (!deleted)
      throw createError(404, "Trailer not found under this application");
 
    res.json({
      success: true,
      message: "Trailer deleted successfully",
      deleted_id: trailer_id,
      application_id: application_id
    });
 
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});


// ==================== VIDEO THUMBNAILS API ====================

/**
 * POST /thumbnails/save - Save thumbnails for a video
 * Payload from your API:
 * {
 *   "appid": "...",
 *   "videoUrl": "...",
 *   "thumbnails": [{ "timestamp": 131, "url": "/media/..." }],
 *   "status": "completed",
 *   "progress": 100
 * }
 */
router.post('/thumbnails/save', verify, async (req, res, next) => {
  try {
    const { appid, id, videoId, videoUrl, videoFileName, thumbnails, defaultThumbnail, status, progress, message, createdAt } = req.body;
    
    if (!appid) {
      throw createError(400, "appid is required");
    }
    
    if (!thumbnails || !Array.isArray(thumbnails)) {
      throw createError(400, "Thumbnails array is required");
    }
    
    let videoThumbnail;
    
    if (id) {
      videoThumbnail = await VideoThumbnail.findById(id);
    } else if (videoId) {
      videoThumbnail = await VideoThumbnail.findOne({ application: appid, videoId: videoId }).sort({ createdDate: -1 });
    } else if (videoUrl) {
      videoThumbnail = await VideoThumbnail.findOne({ application: appid, videoUrl: videoUrl }).sort({ createdDate: -1 });
    }
    
    // Set default thumbnail if not set
    let defaultThumbUrl = defaultThumbnail;
    if (!defaultThumbUrl && thumbnails && thumbnails.length > 0) {
      defaultThumbUrl = thumbnails[0].url;
    }
    
    if (videoThumbnail) {
      if (videoUrl !== undefined) videoThumbnail.videoUrl = videoUrl;
      if (videoFileName !== undefined) videoThumbnail.videoFileName = videoFileName;
      if (videoId !== undefined) videoThumbnail.videoId = videoId;
      if (thumbnails !== undefined) videoThumbnail.thumbnails = thumbnails;
      if (defaultThumbnail !== undefined) videoThumbnail.defaultThumbnail = defaultThumbnail;
      if (status !== undefined) videoThumbnail.status = status;
      if (progress !== undefined) videoThumbnail.progress = progress;
      if (message !== undefined) videoThumbnail.message = message;
      videoThumbnail.editedBy = req.user ? req.user._id : null;
      await videoThumbnail.save();
    } else {
      videoThumbnail = new VideoThumbnail({
        application: appid,
        videoId: videoId || null,
        videoUrl: videoUrl || '',
        videoFileName: videoFileName || '',
        thumbnails: thumbnails,
        defaultThumbnail: defaultThumbUrl,
        status: status || 'completed',
        progress: progress || 100,
        message: message || '',
        createdBy: req.user ? req.user._id : null,
        editedBy: req.user ? req.user._id : null,
        createdDate: createdAt || Date.now()
      });
      await videoThumbnail.save();
    }
    
    res.json(videoThumbnail);
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});

// GET /thumbnails/:appid - Get all video thumbnails for an app
router.get('/thumbnails/:appid', verify, async (req, res, next) => {
  try {
    const { appid } = req.params;
    
    if (!appid) {
      throw createError(400, "appid is required");
    }
    
    const videoThumbnails = await VideoThumbnail.find({ application: appid })
      .select('thumbnails defaultThumbnail status progress _id application videoUrl videoFileName videoId createdDate')
      .sort({ createdDate: -1 });
    
    if (!videoThumbnails || videoThumbnails.length === 0) {
      return res.json({ data: [] });
    }
    
    res.json({ data: videoThumbnails });
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});
// DELETE /thumbnails/:appid/:id - Delete a video thumbnail
router.delete('/thumbnails/:appid/:id', verify, async (req, res, next) => {
  try {
    const { appid, id } = req.params;

    if (!appid) throw createError(400, "appid is required");
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createError(400, "Invalid thumbnail id format");

    const deleted = await VideoThumbnail.findOneAndDelete({ _id: id, application: appid });

    if (!deleted)
      throw createError(404, "Thumbnail not found");

    res.json({ success: true, message: "Thumbnail deleted successfully" });

  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});



// ==================== VIDEO METADATA API ====================

/**
 * POST /metadata/save - Save metadata for a video
 * Payload from your API:
 * {
 *   "appid": "...",
 *   "videoUrl": "...",
 *   "title": "...",
 *   "description": "...",
 *   "tags": [...],
 *   "category": "...",
 *   "status": "completed"
 * }
 */
router.post('/metadata/save', verify, async (req, res, next) => {
  try {
    const { appid, id, videoId, videoUrl, videoFileName, title, description, tags, category, status, progress, message, metadata, embedding } = req.body;
    
    if (!appid) {
      throw createError(400, "appid is required");
    }
    
    // Build metadata object - support both formats:
    // 1. Individual fields: { title, description, tags, category, status }
    // 2. metadata array: { metadata: [{ title, description, tags, category, status }] }
    // 3. metadata object: { metadata: { title, description, tags, category, status } }
    let metadataObj = {};
    
    if (metadata) {
      // Handle metadata as array or object - always convert to single object
      const metaData = Array.isArray(metadata) ? metadata[0] : metadata;
      if (metaData && typeof metaData === 'object') {
        if (metaData.title !== undefined) metadataObj.title = metaData.title;
        if (metaData.description !== undefined) metadataObj.description = metaData.description;
        if (metaData.tags !== undefined) metadataObj.tags = Array.isArray(metaData.tags) ? metaData.tags : [];
        if (metaData.category !== undefined) metadataObj.category = metaData.category;
        if (metaData.status !== undefined) metadataObj.status = metaData.status;
        if (metaData.embedding !== undefined) metadataObj.embedding = Array.isArray(metaData.embedding) ? metaData.embedding : [];
      }
    } else {
      // Handle individual fields
      if (title !== undefined && title !== null && title !== '') metadataObj.title = title;
      if (description !== undefined && description !== null && description !== '') metadataObj.description = description;
      if (tags !== undefined && tags !== null) metadataObj.tags = Array.isArray(tags) ? tags : [];
      if (category !== undefined && category !== null && category !== '') metadataObj.category = category;
      if (status !== undefined && status !== null && status !== '') metadataObj.status = status;
      if (embedding !== undefined && embedding !== null) metadataObj.embedding = Array.isArray(embedding) ? embedding : [];
    }
    
    // Save metadata as array with one element
    const metadataArray = [metadataObj];
    
    if (Object.keys(metadataObj).length === 0 && !videoUrl) {
      throw createError(400, "At least one metadata field (title, description, tags, category, status) or videoUrl is required");
    }
    
    let videoMetadata;
    
    if (id) {
      videoMetadata = await VideoMetadata.findById(id);
    } else if (videoId) {
      videoMetadata = await VideoMetadata.findOne({ application: appid, videoId: videoId }).sort({ createdDate: -1 });
    } else if (videoUrl) {
      videoMetadata = await VideoMetadata.findOne({ application: appid, videoUrl: videoUrl }).sort({ createdDate: -1 });
    }
    
    // Use metadata status for top-level status if available
    const finalStatus = metadataObj.status || status || 'completed';
    
    if (videoMetadata) {
      if (videoUrl !== undefined) videoMetadata.videoUrl = videoUrl;
      if (videoFileName !== undefined) videoMetadata.videoFileName = videoFileName;
      if (videoId !== undefined) videoMetadata.videoId = videoId;
      if (Object.keys(metadataObj).length > 0) {
        // Update the first element of the metadata array
        if (videoMetadata.metadata && videoMetadata.metadata.length > 0) {
          videoMetadata.metadata[0] = { ...videoMetadata.metadata[0].toObject(), ...metadataObj };
        } else {
          videoMetadata.metadata = metadataArray;
        }
      }
      if (status !== undefined) videoMetadata.status = status;
      if (progress !== undefined) videoMetadata.progress = progress;
      if (message !== undefined) videoMetadata.message = message;
      videoMetadata.editedBy = req.user._id;
      await videoMetadata.save();
    } else {
      videoMetadata = new VideoMetadata({
        application: appid,
        videoId: videoId || null,
        videoUrl: videoUrl || '',
        videoFileName: videoFileName || '',
        metadata: metadataArray,
        status: finalStatus,
        progress: progress || 100,
        message: message || '',
        createdBy: req.user._id,
        editedBy: req.user._id
      });
      await videoMetadata.save();
    }
    
    res.json(videoMetadata);
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});

// GET /metadata/:appid - Get all video metadata for an app
router.get('/metadata/:appid', verify, async (req, res, next) => {
  try {
    const { appid } = req.params;
    
    if (!appid) {
      throw createError(400, "appid is required");
    }
    
    const videoMetadatas = await VideoMetadata.find({ application: appid })
      .select('metadata status progress _id application videoUrl videoFileName videoId createdDate')
      .sort({ createdDate: -1 });
    
    if (!videoMetadatas || videoMetadatas.length === 0) {
      return res.json({ data: [] });
    }
    
    // Transform to include metadata fields at top level if they exist
    const response = videoMetadatas.map(vm => {
      const obj = {
        _id: vm._id,
        application: vm.application,
        videoId: vm.videoId,
        videoUrl: vm.videoUrl,
        videoFileName: vm.videoFileName,
        status: vm.status,
        progress: vm.progress,
        createdDate: vm.createdDate,
        editedDate: vm.editedDate,
        isApproved: vm.isApproved
      };
      
      // Handle metadata as array
      if (vm.metadata && vm.metadata.length > 0) {
        const meta = vm.metadata[0];
        if (meta.title) obj.title = meta.title;
        if (meta.description) obj.description = meta.description;
        if (meta.tags && meta.tags.length > 0) obj.tags = meta.tags;
        if (meta.category) obj.category = meta.category;
        if (meta.status) obj.status = meta.status;
        if (meta.embedding && meta.embedding.length > 0) obj.embedding = meta.embedding;
      }
      return obj;
    });
    
    res.json({ data: response });
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});
// DELETE /metadata/:appid/:id - Delete a video metadata
router.delete('/metadata/:appid/:id', verify, async (req, res, next) => {
  try {
    const { appid, id } = req.params;

    if (!appid) throw createError(400, "appid is required");
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createError(400, "Invalid metadata id format");

    const deleted = await VideoMetadata.findOneAndDelete({ _id: id, application: appid });

    if (!deleted)
      throw createError(404, "Metadata not found");

    res.json({ success: true, message: "Metadata deleted successfully" });

  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
});



export default router;
 