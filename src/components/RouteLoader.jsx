import { motion } from "framer-motion";

function RouteLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[999] grid place-items-center bg-[#070A12]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />
        </div>

        <p className="text-sm text-white/60 tracking-wide">
          Loading…
        </p>
      </div>
    </motion.div>
  );
}

export default RouteLoader;
