import { useState, useEffect, useCallback } from "react";

const NOTES_STORAGE_KEY = "mac_portfolio.widget_notes";

export const NotesWidget = () => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(NOTES_STORAGE_KEY) || "";
  });

  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(NOTES_STORAGE_KEY, content);
    }, 500);

    return () => clearTimeout(timer);
  }, [content]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Quick Notes</span>
        <span className="text-[10px] text-muted-foreground">
          {content.length} chars
        </span>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Type your notes here..."
        className="flex-1 w-full bg-transparent resize-none text-sm focus:outline-none placeholder:text-muted-foreground/50"
        style={{ scrollbarWidth: "thin" }}
      />
    </div>
  );
};

export default NotesWidget;
