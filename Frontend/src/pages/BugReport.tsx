import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

const BugReport = () => {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [email, setEmail] = useState("");
  const [browser, setBrowser] = useState("");
  const [device, setDevice] = useState("desktop");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const userAgent = useMemo(() => navigator.userAgent, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !steps.trim() || !actual.trim()) {
      toast.error("Please fill required fields.");
      return;
    }
    const res = await axios.post(
      "http://localhost:5000/api/v1/bug-report/create",
      {
        title,
        steps,
        expected,
        actual,
        email,
        browser,
        device,
      },
    );
    console.log(res.data);
   
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16 p-4 font-raleway sm:p-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        <div className="text-center mb-8">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Report
          </span>
          <h1 className="mt-4 mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Bug Report
          </h1>
          <p className="text-gray-500">
            Help us fix issues faster by sharing clear details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
              placeholder="Short summary of the issue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
              Steps to Reproduce *
            </label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full p-3 h-28 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
              placeholder="1. Go to...\n2. Click...\n3. Observe..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Expected
              </label>
              <textarea
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                className="w-full p-3 h-24 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                placeholder="What you expected to happen"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Actual *
              </label>
              <textarea
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                className="w-full p-3 h-24 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                placeholder="What actually happened"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Device
              </label>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Browser
              </label>
              <input
                value={browser}
                onChange={(e) => setBrowser(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                placeholder="Chrome / Edge / Safari"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
              Your Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
              Screenshot (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
          >
            Submit Bug Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default BugReport;
