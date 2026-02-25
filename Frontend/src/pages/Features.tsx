import React from "react";

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white mt-16 font-raleway">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Features
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900">
            Everything you need for smooth meetings
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Chattique brings fast joins, stable calls, and collaboration tools
            that keep teams aligned.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">HD Video</h3>
            <p className="text-gray-600">
              Crisp video with adaptive quality so calls stay stable on any
              network.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Instant Join
            </h3>
            <p className="text-gray-600">
              One‑click meeting links that work on desktop and mobile.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Secure Rooms
            </h3>
            <p className="text-gray-600">
              Private sessions with waiting rooms and host controls.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Screen Share
            </h3>
            <p className="text-gray-600">
              Share screens, tabs, or apps with smooth frame rates.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Team Chat
            </h3>
            <p className="text-gray-600">
              Side‑channel chat keeps collaboration flowing during calls.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Call History
            </h3>
            <p className="text-gray-600">
              Quick access to past meetings and shared links.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">
                Built for speed and simplicity
              </h3>
              <p className="mt-2 text-gray-600">
                No clutter, no delays. Just meetings that work.
              </p>
            </div>
            <button className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-700">
              Start a Meeting
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
