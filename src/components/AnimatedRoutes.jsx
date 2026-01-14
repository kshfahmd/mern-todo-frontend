import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import RouteLoader from "./RouteLoader";

// Smooth page transition (fast)
const variants = {
  initial: { opacity: 0, scale: 0.99 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.995 },
};

function Page({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const [routing, setRouting] = useState(false);

  // Show loader briefly on route change
  useEffect(() => {
    setRouting(true);
    const t = setTimeout(() => setRouting(false), 260);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#070A12]">
      <AnimatePresence mode="sync" initial={false}>
        {routing && <RouteLoader />}
      </AnimatePresence>

      <AnimatePresence mode="sync" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Page>
                <Landing />
              </Page>
            }
          />

          <Route
            path="/login"
            element={
              <Page>
                <Login />
              </Page>
            }
          />

          <Route
            path="/register"
            element={
              <Page>
                <Register />
              </Page>
            }
          />

          <Route
            path="/dashboard"
            element={
              localStorage.getItem("token") ? (
                <Page>
                  <Dashboard />
                </Page>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default AnimatedRoutes;
