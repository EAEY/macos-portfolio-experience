import { useState, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";

interface Reminder {
  id: string;
  text: string;
  completed: boolean;
}

const REMINDERS_STORAGE_KEY = "mac_portfolio.widget_reminders";

export const RemindersWidget = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newReminder, setNewReminder] = useState("");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!newReminder.trim()) return;
    
    setReminders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: newReminder.trim(),
        completed: false,
      },
    ]);
    setNewReminder("");
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addReminder();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Add new reminder */}
      <div className="flex gap-1 mb-2">
        <input
          type="text"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add reminder..."
          className="flex-1 bg-foreground/5 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          onClick={addReminder}
          className="p-1 rounded hover:bg-foreground/10 transition-colors"
          aria-label="Add reminder"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Reminders list */}
      <div className="flex-1 overflow-auto space-y-1" style={{ scrollbarWidth: "thin" }}>
        {reminders.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No reminders yet
          </p>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-foreground/5 group"
            >
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  reminder.completed
                    ? "bg-primary border-primary"
                    : "border-foreground/30 hover:border-foreground/50"
                }`}
              >
                {reminder.completed && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
              </button>
              <span
                className={`flex-1 text-xs truncate ${
                  reminder.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {reminder.text}
              </span>
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-foreground/10 transition-all"
                aria-label="Delete reminder"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-foreground/10 text-[10px] text-muted-foreground text-center">
        {reminders.filter((r) => !r.completed).length} remaining
      </div>
    </div>
  );
};

export default RemindersWidget;
