import { Link } from "react-router-dom";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left side branding */}
          <div className="hidden lg:block">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 grid place-items-center group-hover:bg-white/15 transition">
                <span className="text-white font-bold">T</span>
              </div>
              <h1 className="text-xl font-semibold text-white">
                Todo<span className="text-blue-400">Pro</span>
              </h1>
            </Link>

            <h2 className="mt-8 text-4xl font-semibold text-white leading-tight">
              A clean way to manage tasks — <span className="text-white/70">without chaos.</span>
            </h2>

            <p className="mt-4 text-white/70 text-lg max-w-md leading-relaxed">
              Keep your tasks organized, stay consistent, and make progress every day.
              Simple UI. Private lists. Fast experience.
            </p>

            <div className="mt-8 space-y-3 text-white/75">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Personal task list (per user)
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Fast add / toggle / delete
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Secure login with JWT
              </div>
            </div>

            <p className="mt-10 text-sm text-white/40">
              Made by Kashif Ahmed — always learning, always building.
            </p>
          </div>

          {/* Right card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 p-7">
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
              <p className="text-white/60 mt-1">{subtitle}</p>

              <div className="mt-6">{children}</div>

              <p className="mt-6 text-xs text-white/40">
                By continuing, you agree to use this project for demo purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
