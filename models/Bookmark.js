const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    title: { type: String, default: '' },
    summary: { type: String, default: '' },          // <-- persisted summary
    markdownContent: { type: String, default: '' },
    tags: { type: [String], default: [] },
    position: { type: Number, default: 0 },          // keeps drag-and-drop order
    favicon: { type: String, default: '' },          // optional (kept for your earlier need)
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Avoid model overwrite in dev
module.exports = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);
