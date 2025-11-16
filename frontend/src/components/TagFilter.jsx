import { motion } from 'framer-motion';
import { Tag, X } from 'lucide-react';

const TagFilter = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-brand" />
          <h3 className="font-semibold text-lg">Filter by Tag</h3>
        </div>
        {selectedTag && (
          <button
            onClick={() => onSelectTag('')}
            className="text-xs text-muted-foreground hover:text-brand transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* All Notes */}
      <button
        onClick={() => onSelectTag('')}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
          !selectedTag
            ? 'bg-brand/20 text-brand font-medium'
            : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
        }`}
      >
        All Notes
      </button>

      {/* Tags List */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground px-4 py-2">
            No tags yet
          </p>
        ) : (
          tags.map((tag, index) => (
            <motion.button
              key={tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelectTag(tag)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center justify-between group ${
                selectedTag === tag
                  ? 'bg-brand/20 text-brand font-medium'
                  : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <span className="truncate">{tag}</span>
              </span>
              {selectedTag === tag && (
                <X
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag('');
                  }}
                />
              )}
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

export default TagFilter;
