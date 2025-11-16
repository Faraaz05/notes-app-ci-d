import { motion } from 'framer-motion';
import { Calendar, Tag, Trash2, Edit, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getContentPreview = (html) => {
    // Strip HTML tags and get first 150 characters
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link to={`/notes/${note.id}`}>
        <div className="h-full p-6 rounded-xl glass hover:bg-secondary/50 border border-white/10 hover:border-brand/30 transition-all cursor-pointer relative overflow-hidden">
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Content */}
          <div className="relative z-10 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold line-clamp-2 pr-8 group-hover:text-brand transition-colors">
                {note.title}
              </h3>
              
              {/* More Menu Button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-8 z-20 w-48 p-2 rounded-lg glass border border-white/10 shadow-xl">
                      <Link
                        to={`/notes/${note.id}`}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                        onClick={() => setShowMenu(false)}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit note</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMenu(false);
                          onDelete(note.id);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete note</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content Preview */}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {getContentPreview(note.content)}
            </p>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-brand/10 text-brand text-xs font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-muted-foreground text-xs font-medium">
                    +{note.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(note.updatedAt)}</span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-brand font-medium">
                  View note →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NoteCard;
