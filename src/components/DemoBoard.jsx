import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

function DemoBoard() {
  const initial = useMemo(
    () => [
      { id: 1, text: "Finish MERN Todo app UI", done: true },
      { id: 2, text: "Deploy backend to Render", done: false },
      { id: 3, text: "Deploy frontend to Vercel", done: false },
      { id: 4, text: "Update README + screenshots", done: false },
    ],
    []
  );

  const [items, setItems] = useState(initial);
  const [text, setText] = useState("");
  const [toast, setToast] = useState("");

  // toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1400);
    return () => clearTimeout(t);
  }, [toast]);

  const toggle = (id) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x))
    );
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setToast("Deleted ✅");
  };

  const add = () => {
    const value = text.trim();
    if (!value) return;

    const newItem = {
      id: Date.now(),
      text: value,
      done: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setText("");
    setToast("Added 🎉");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") add();
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white/90">Interactive preview</p>
        <span className="text-xs text-white/50">Try clicking</span>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-6 right-6 z-10 px-3 py-2 rounded-xl border border-white/10 bg-black/50 backdrop-blur text-xs text-white/80"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add */}
      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />

        <button
          onClick={add}
          className="px-4 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 transition text-sm font-medium active:scale-[0.98] cursor-pointer shadow-lg shadow-blue-600/20"
        >
          Add
        </button>
      </div>

      {/* List */}
      <LayoutGroup>
        <motion.div layout className="mt-5 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.98,
                  transition: { duration: 0.18 },
                }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-white/5 hover:border-white/20 transition"
              >
                {/* Toggle */}
                <button
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-3 text-left cursor-pointer"
                >
                  {/* Checkbox */}
                  <motion.div
                    className={`h-4 w-4 rounded-full border grid place-items-center transition ${
                      item.done
                        ? "bg-green-500/80 border-green-400/60"
                        : "border-white/30"
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence>
                      {item.done && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="h-1.5 w-1.5 bg-white rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Text */}
                  <motion.p
                    layout
                    className={`text-sm transition ${
                      item.done ? "text-white/40 line-through" : "text-white/85"
                    }`}
                  >
                    {item.text}
                  </motion.p>
                </button>

                {/* Delete */}
                <button
                  onClick={() => remove(item.id)}
                  className="text-xs text-white/50 hover:text-red-300 transition cursor-pointer px-2 py-1 rounded-lg hover:bg-red-500/10 active:scale-[0.98]"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Tip */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs text-white/60">
          Tip: This is a demo preview. Join in now to save your Todos.
        </p>
      </div>
    </div>
  );
}

export default DemoBoard;
