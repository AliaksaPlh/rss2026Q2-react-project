import { Link } from 'react-router-dom';

const AboutMePage = () => {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-2xl shadow-black/30 backdrop-blur-md">
        <div className="relative px-6 py-10 sm:px-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_35%)]"
            aria-hidden
          />

          <div className="relative z-10 grid gap-8 md:grid-cols-[14rem_1fr] md:items-center">
            <div className="flex justify-center md:justify-start">
              <img
                src="/aboutMe/photo.jpg"
                alt="Aliksandra"
                className="h-52 w-52 rounded-3xl border border-slate-700 object-cover shadow-xl shadow-black/40"
              />
            </div>

            <div className="text-center md:text-left">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                About Me
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Alexandra
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Hello, my name is Alexandra. I am a junior frontend developer
                focused on React, TypeScript, UI development, and building clean
                user experiences.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href="https://github.com/AliaksaPlh"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  GitHub
                </a>

                <a
                  href="/aboutMe/Alex_Palkhouskaya_FD_CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                >
                  Open CV
                </a>

                <a
                  href="/aboutMe/Alex_Palkhouskaya_FD_CV.pdf"
                  download
                  className="rounded-xl border border-amber-400/60 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/10"
                >
                  Download CV
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid gap-4 border-t border-slate-800/80 px-6 py-6 sm:px-10 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Course
            </h2>
            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
              className="mt-2 block font-semibold text-amber-300 hover:text-amber-200"
            >
              RS School React Course
            </a>
          </div>

          <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Contact
            </h2>
            <p className="mt-2 font-semibold text-slate-100">Discord</p>
            <p className="text-amber-300">aliaksaplh</p>
          </div>

          <div className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Stack
            </h2>
            <p className="mt-2 text-slate-200">
              React, TypeScript, Tailwind CSS
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/movies"
          className="rounded-xl border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
        >
          Back to movies
        </Link>
      </div>
    </section>
  );
};

export default AboutMePage;
