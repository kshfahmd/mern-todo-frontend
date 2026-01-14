import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal";
import DemoBoard from "../components/DemoBoard";

const LINKS = {
  linkedin: "https://www.linkedin.com/in/kshfahmd/",
  x: "https://x.com/kshfmrz",
  githubFrontend: "https://github.com/kshfahmd/mern-todo-frontend",
  githubBackend: "https://github.com/kshfahmd/mern-todo-backend",
  email: "mailto:kashifahmed2604@gmail.com",
};

// --- Icons (inline SVG) ---
const IconLinkedIn = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.49v6.25zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 2H21l-6.6 7.55L22 22h-6.3l-4.9-6.7L5 22H3l7.1-8.13L2 2h6.45l4.44 6.1L18.9 2zm-2.2 18h1.75L7.25 3.9H5.4L16.7 20z" />
  </svg>
);

const IconGitHub = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.45-1.1-1.45-.9-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.89 1.52 2.34 1.08 2.91.82.09-.65.35-1.08.63-1.33-2.21-.25-4.54-1.1-4.54-4.9 0-1.08.39-1.96 1.03-2.65-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.4.1 2.65.64.7 1.03 1.57 1.03 2.65 0 3.8-2.33 4.64-4.55 4.89.36.31.68.92.68 1.86v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z" />
  </svg>
);

const IconMail = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
  </svg>
);

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="h-11 w-11 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition grid place-items-center active:scale-[0.98]"
    >
      {children}
    </a>
  );
}

function Landing() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#070A12] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-40 -right-28 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Sticky Navbar */}
      <nav className="relative">
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#070A12]/70 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 grid place-items-center group-hover:bg-white/15 transition">
                <span className="text-sm font-bold">T</span>
              </div>
              <h1 className="text-lg font-semibold tracking-tight">
                Todo<span className="text-blue-400">Pro</span>
              </h1>
            </Link>

            {/* Section links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-white/65">
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
              <a href="#recruiters" className="hover:text-white transition">
                Recruiter
              </a>
              <a href="#contact" className="hover:text-white transition">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition active:scale-[0.98]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-14 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
            Simple personal task manager
          </div>

          <h2 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            Stay on track.
            <span className="text-white/75"> Finish what matters.</span>
          </h2>

          <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-xl">
            TodoPro helps you keep your tasks organized in one place. Add what you need
            to do, mark it done, and keep moving — without clutter. Your tasks stay
            private inside your own account.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="group px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/30 active:scale-[0.98] text-center"
            >
              Create free account
              <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition font-semibold active:scale-[0.98] text-center"
            >
              Open dashboard
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/50">
            No ads. No spam. Your tasks stay private.
          </p>

          <p className="mt-3 text-xs text-white/45">
            Built by Kashif Ahmed — a small project I’m proud of.
          </p>
        </motion.div>

        <Reveal delay={0.1}>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-blue-600/10 via-white/0 to-cyan-400/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-300/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <p className="text-xs text-white/60">Interactive preview</p>
              </div>

              <DemoBoard />
            </div>

            <p className="mt-4 text-xs text-white/40">
              Preview is interactive — you can use it right here.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-6xl mx-auto px-6 pb-16">
        <Reveal>
          <h3 className="text-2xl font-semibold tracking-tight">What you can do</h3>
          <p className="text-white/65 mt-2 max-w-2xl">
            It’s intentionally simple — fast task capture, clear list, and a satisfying “done”.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Add tasks quickly",
              desc: "Capture tasks the moment they come. No friction.",
            },
            {
              title: "Mark tasks done",
              desc: "Toggle a task to keep your list clean and motivating.",
            },
            {
              title: "Keep it private",
              desc: "Your tasks belong only to your account — no one else sees them.",
            },
          ].map((f, idx) => (
            <Reveal key={f.title} delay={0.05 * idx}>
              <div className="rounded-3xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <h4 className="font-semibold text-lg">{f.title}</h4>
                <p className="text-white/70 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recruiter section */}
      <section id="recruiters" className="relative max-w-6xl mx-auto px-6 pb-20">
        <Reveal>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Recruiter corner
            </p>
            <h3 className="text-2xl font-semibold tracking-tight mt-1">
              Stack + project links
            </h3>
            <p className="text-white/65 mt-2 max-w-2xl">
              If you’re reviewing this as part of my portfolio, here are the technical details
              and repositories.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "React + Router",
                "Tailwind CSS",
                "Node + Express",
                "MongoDB Atlas",
                "JWT Auth",
                "bcrypt",
                "Zod validation",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href={LINKS.githubFrontend}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 hover:bg-white/5 transition"
              >
                <p className="text-sm font-medium">Frontend Repo</p>
                <p className="text-xs text-white/60 mt-1">{LINKS.githubFrontend}</p>
              </a>

              <a
                href={LINKS.githubBackend}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 hover:bg-white/5 transition"
              >
                <p className="text-sm font-medium">Backend Repo</p>
                <p className="text-xs text-white/60 mt-1">{LINKS.githubBackend}</p>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Back to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-2xl border border-white/15 bg-white/10 hover:bg-white/15 transition grid place-items-center shadow-lg shadow-black/40 active:scale-[0.98]"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* Footer */}
      <footer id="contact" className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-white/60 text-sm">Made by Kashif Ahmed — always learning, always building. Thanks for checking it out 👋</p>
            <p className="text-white/40 text-xs mt-2">
              If you’d like to connect or discuss opportunities, I’m available.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SocialIcon href={LINKS.linkedin} label="LinkedIn">
              <IconLinkedIn className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon href={LINKS.x} label="X">
              <IconX className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon href={LINKS.githubFrontend} label="GitHub">
              <IconGitHub className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon href={LINKS.email} label="Email">
              <IconMail className="h-5 w-5" />
            </SocialIcon>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
