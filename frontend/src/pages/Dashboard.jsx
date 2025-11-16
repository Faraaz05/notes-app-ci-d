import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  LogOut,
  User,
  FileText,
  Loader2,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';
import NoteCard from '../components/NoteCard';
import TagFilter from '../components/TagFilter';
import SearchBar from '../components/SearchBar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNotes, useTags } from '../hooks/useNotes.jsx';

const Dashboard = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notes, isLoading, error, deleteNote, refreshNotes } = useNotes(
    searchQuery,
    selectedTag
  );
  const { tags, refreshTags } = useTags();

  useEffect(() => {
    // Tags might change after deleting a note
    refreshTags();
  }, [notes]);

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    const result = await deleteNote(noteId);
    if (!result.success) {
      alert(result.error || 'Failed to delete note. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-light rounded-xl flex items-center justify-center glow">
                <FileText className="w-5 h-5 text-[#0f0f0f]" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Notes</h1>
                <p className="text-xs text-muted-foreground">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/notes/new')}
                size="default"
                className="hidden sm:flex"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Note
              </Button>
              <Button
                onClick={() => navigate('/notes/new')}
                size="icon"
                className="sm:hidden"
              >
                <Plus className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-secondary/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium hidden sm:inline">
                  {user?.name || 'User'}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="icon"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside
            className={`lg:block ${
              isSidebarOpen ? 'block' : 'hidden'
            } w-full lg:w-64 flex-shrink-0`}
          >
            <div className="sticky top-24 space-y-6">
              <TagFilter
                tags={tags}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                  <p className="text-muted-foreground">{error}</p>
                  <Button onClick={refreshNotes} variant="outline">
                    Try again
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !error && notes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center space-y-4 max-w-md">
                  <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-brand" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {searchQuery || selectedTag
                      ? 'No notes found'
                      : 'No notes yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedTag
                      ? 'Try adjusting your search or filters'
                      : 'Create your first note to get started'}
                  </p>
                  <Button onClick={() => navigate('/notes/new')}>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Note
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Notes Grid */}
            {!isLoading && !error && notes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {notes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={handleDeleteNote}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
