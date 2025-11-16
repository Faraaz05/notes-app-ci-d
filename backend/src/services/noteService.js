import Note from '../models/Note.js';

/**
 * Create a new note
 */
export const createNote = async (userId, noteData) => {
  const { title, content, tags = [] } = noteData;

  const note = await Note.create({
    title,
    content,
    tags,
    user: userId,
  });

  return {
    id: note._id,
    title: note.title,
    content: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};

/**
 * Get all notes for a user with optional search and tag filter
 */
export const getUserNotes = async (userId, searchQuery = '', tagFilter = '') => {
  let query = { user: userId };

  // Search by title or tags
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { tags: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  // Filter by specific tag
  if (tagFilter) {
    query.tags = { $in: [tagFilter] };
  }

  const notes = await Note.find(query)
    .sort({ updatedAt: -1 })
    .select('title content tags createdAt updatedAt');

  return notes.map((note) => ({
    id: note._id,
    title: note.title,
    content: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }));
};

/**
 * Get a single note by ID
 */
export const getNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });

  if (!note) {
    throw new Error('Note not found');
  }

  return {
    id: note._id,
    title: note.title,
    content: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};

/**
 * Update a note
 */
export const updateNote = async (noteId, userId, updateData) => {
  const note = await Note.findOne({ _id: noteId, user: userId });

  if (!note) {
    throw new Error('Note not found');
  }

  // Update fields
  if (updateData.title !== undefined) note.title = updateData.title;
  if (updateData.content !== undefined) note.content = updateData.content;
  if (updateData.tags !== undefined) note.tags = updateData.tags;

  await note.save();

  return {
    id: note._id,
    title: note.title,
    content: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};

/**
 * Delete a note
 */
export const deleteNote = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });

  if (!note) {
    throw new Error('Note not found');
  }

  await note.deleteOne();

  return { id: noteId };
};

/**
 * Get all unique tags for a user
 */
export const getUserTags = async (userId) => {
  const tags = await Note.distinct('tags', { user: userId });
  return tags.sort();
};
