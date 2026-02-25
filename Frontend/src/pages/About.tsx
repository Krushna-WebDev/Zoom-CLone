import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white mt-16 font-raleway">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              About Chattique
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Human‑first video conversations for teams, classrooms, and
              communities.
            </h1>
            <p className="mt-5 text-gray-600 text-lg leading-relaxed">
              Chattique is a Zoom‑inspired collaboration platform focused on
              clarity, speed, and simplicity. We built it to help people host
              reliable meetings, collaborate in real‑time, and stay connected
              across devices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                HD Meetings
              </span>
              <span className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                Secure Sessions
              </span>
              <span className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                Fast Join Links
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-3xl bg-orange-100"></div>
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-3xl bg-orange-200"></div>
            <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why we exist
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Meetings should feel effortless. We remove friction with clean
                UI, stable connections, and just the right tools so teams can
                focus on the conversation instead of the software.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Uptime Focused
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    Reliable calls, even on slow networks.
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Privacy First
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    Data protected with secure sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Mission</h4>
            <p className="text-gray-600">
              Make online meetings feel as natural and productive as in‑person
              conversations.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Vision</h4>
            <p className="text-gray-600">
              Create a simple, trusted space for meaningful collaboration.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Values</h4>
            <p className="text-gray-600">
              Speed, reliability, and thoughtful design.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold">Built for your flow</h3>
              <p className="mt-2 text-orange-100">
                Start meetings quickly, share securely, and keep conversations
                moving.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-orange-600 shadow-sm hover:shadow">
                Get Started
              </button>
              <button className="rounded-xl border border-white/60 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
