import * as noteService from '../services/noteService.js';

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content',
      });
    }

    // Create note
    const note = await noteService.createNote(req.user.id, {
      title,
      content,
      tags,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/notes
 * @desc    Get all notes for logged-in user
 * @access  Private
 */
export const getNotes = async (req, res) => {
  try {
    const { search = '', tag = '' } = req.query;

    const notes = await noteService.getUserNotes(req.user.id, search, tag);

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID
 * @access  Private
 */
export const getNote = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note
 * @access  Private
 */
export const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = await noteService.updateNote(req.params.id, req.user.id, {
      title,
      content,
      tags,
    });

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 * @access  Private
 */
export const deleteNote = async (req, res) => {
  try {
    const result = await noteService.deleteNote(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/notes/tags/all
 * @desc    Get all unique tags for logged-in user
 * @access  Private
 */
export const getTags = async (req, res) => {
  try {
    const tags = await noteService.getUserTags(req.user.id);

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
