import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Save,
  Trash2,
  ArrowLeft,
  Loader2,
  Tag as TagIcon,
  X,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { notesAPI } from '../lib/api';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load note if editing
    if (isEditMode) {
      loadNote();
    }
  }, [id, navigate]);

  const loadNote = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await notesAPI.getNote(id);
      const note = response.data;
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    } catch (error) {
      setError('Failed to load note. Please try again.');
      console.error('Failed to load note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const noteData = {
        title: title.trim(),
        content,
        tags,
      };

      if (isEditMode) {
        await notesAPI.updateNote(id, noteData);
      } else {
        await notesAPI.createNote(noteData);
      }

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save note. Please try again.');
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await notesAPI.deleteNote(id);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to delete note. Please try again.');
      console.error('Failed to delete note:', error);
      setIsDeleting(false);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();

    if (!tag) return;

    if (tags.includes(tag)) {
      alert('Tag already exists');
      return;
    }

    if (tags.length >= 10) {
      alert('Maximum 10 tags allowed');
      return;
    }

    setTags([...tags, tag]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'blockquote',
    'code-block',
    'link',
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="default"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center space-x-3">
              {isEditMode && (
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              )}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold h-14"
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-lg flex items-center space-x-2">
              <TagIcon className="w-5 h-5 text-brand" />
              <span>Tags</span>
            </Label>

            {/* Tag List */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand/20 text-brand border border-brand/30"
                  >
                    <span className="text-sm font-medium">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-brand/30 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            <form onSubmit={handleAddTag} className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                disabled={tags.length >= 10}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={tags.length >= 10}
              >
                Add Tag
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              {tags.length}/10 tags
            </p>
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label className="text-lg">Content</Label>
            <div className="editor-wrapper rounded-xl overflow-hidden border border-white/10">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Start writing your note..."
                className="editor-quill"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Quill Styles */}
      <style>{`
        .editor-quill .ql-toolbar {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
        }

        .editor-quill .ql-toolbar .ql-stroke {
          stroke: #a1a1aa;
        }

        .editor-quill .ql-toolbar .ql-fill {
          fill: #a1a1aa;
        }

        .editor-quill .ql-toolbar .ql-picker-label {
          color: #a1a1aa;
        }

        .editor-quill .ql-toolbar button:hover .ql-stroke,
        .editor-quill .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3ecf8e;
        }

        .editor-quill .ql-toolbar button:hover .ql-fill,
        .editor-quill .ql-toolbar button.ql-active .ql-fill {
          fill: #3ecf8e;
        }

        .editor-quill .ql-container {
          background: rgba(255, 255, 255, 0.03);
          border: none;
          min-height: 400px;
          font-size: 16px;
          font-family: 'Inter', sans-serif;
        }

        .editor-quill .ql-editor {
          color: #f4f4f5;
          padding: 24px;
          line-height: 1.6;
        }

        .editor-quill .ql-editor.ql-blank::before {
          color: #71717a;
          font-style: normal;
        }

        .editor-quill .ql-editor h1 {
          font-size: 2em;
          font-weight: 700;
          margin-bottom: 0.5em;
        }

        .editor-quill .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-bottom: 0.5em;
        }

        .editor-quill .ql-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-bottom: 0.5em;
        }

        .editor-quill .ql-editor blockquote {
          border-left: 4px solid #3ecf8e;
          padding-left: 16px;
          margin: 16px 0;
          color: #a1a1aa;
        }

        .editor-quill .ql-editor code {
          background: rgba(62, 207, 142, 0.1);
          color: #3ecf8e;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .editor-quill .ql-editor pre {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
        }

        .editor-quill .ql-editor a {
          color: #3ecf8e;
          text-decoration: underline;
        }

        .editor-quill .ql-editor ul,
        .editor-quill .ql-editor ol {
          padding-left: 24px;
        }
      `}</style>
    </div>
  );
};

export default Editor;
