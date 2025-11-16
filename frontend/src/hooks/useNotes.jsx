import { useState, useEffect } from 'react';
import { notesAPI } from '../lib/api';

export const useNotes = (searchQuery = '', tagFilter = '') => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, tagFilter]);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesAPI.getNotes(searchQuery, tagFilter);
      setNotes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
      console.error('Failed to fetch notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await notesAPI.createNote(noteData);
      setNotes((prev) => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create note',
      };
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.updateNote(id, noteData);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? response.data : note))
      );
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update note',
      };
    }
  };

  const deleteNote = async (id) => {
    try {
      await notesAPI.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to delete note',
      };
    }
  };

  const refreshNotes = () => {
    fetchNotes();
  };

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes,
  };
};

export const useNote = (id) => {
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesAPI.getNote(id);
      setNote(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch note');
      console.error('Failed to fetch note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { note, isLoading, error, refreshNote: fetchNote };
};

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesAPI.getTags();
      setTags(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tags');
      console.error('Failed to fetch tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { tags, isLoading, error, refreshTags: fetchTags };
};
