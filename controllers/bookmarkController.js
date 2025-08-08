// server/controllers/bookmarkController.js
const Bookmark = require('../models/Bookmark');
const { summarizeUrl, fetchTitleAndFavicon, normalizeUrl } = require('../utils/summarize');

const createBookmark = async (req, res) => {
  try {
    const userId = req.user;
    const { url, title = '', markdownContent = '', tags = [] } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const normalized = normalizeUrl(url);

    // Compute next position (append at end)
    const count = await Bookmark.countDocuments({ user: userId });

    // Fetch minimal metadata
    const meta = await fetchTitleAndFavicon(normalized);
    const finalTitle = title?.trim() || meta.title || normalized;

    // Get readable page content and compress to a short summary (best-effort)
    const summary = await summarizeUrl(normalized);

    const doc = await Bookmark.create({
      user: userId,
      url: normalized,
      title: finalTitle,
      markdownContent,
      tags,
      position: count,
      favicon: meta.favicon || '',
      summary, // <-- persisted
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error('Create bookmark error:', err.message);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const userId = req.user;
    const docs = await Bookmark.find({ user: userId }).sort({ position: 1, createdAt: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const deleted = await Bookmark.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};

const updatePositions = async (req, res) => {
  try {
    const userId = req.user;
    const updates = Array.isArray(req.body) ? req.body : req.body?.updates;
    if (!Array.isArray(updates)) return res.status(400).json({ error: 'Array of updates required' });

    const bulk = updates.map(({ _id, position }) => ({
      updateOne: { filter: { _id, user: userId }, update: { $set: { position } } },
    }));
    if (bulk.length === 0) return res.json({ message: 'No changes' });

    await Bookmark.bulkWrite(bulk);
    res.json({ message: 'Reordered' });
  } catch (err) {
    console.error('Reorder error:', err.message);
    res.status(500).json({ error: 'Failed to reorder' });
  }
};

module.exports = { createBookmark, getBookmarks, deleteBookmark, updatePositions };
