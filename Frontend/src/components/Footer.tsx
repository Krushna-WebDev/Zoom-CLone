import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const socialLinks = [
    {
      icon: Twitter,
      href: "https://x.com/krushnabuilds",
      label: "X",
    },
    {
      icon: Github,
      href: "https://github.com/Krushna-WebDev",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/krushna-web-dev-2b347b353/",
      label: "LinkedIn",
    },
  ];

  const footerLinks = [
    { label: "Features", to: "/features" },
    { label: "About", to: "/about" },
    { label: "Bug Report", to: "/bug-report" },
    { label: "History", to: "/history" },
    { label: "Settings", to: "/settings" },
  ];

  return (
    <footer className="border-t border-gray-100 bg-white py-16 font-raleway">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2 lg:pr-8">
            <Link to="/" className="group mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
                <img
                  className="h-8 w-8 object-contain"
                  src="logo.png"
                  alt="Chattique Logo"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase">
                Chattique
              </span>
            </Link>
            <p className="mb-8 max-w-sm leading-relaxed text-gray-500">
              Seamless video calling and chat for teams and individuals. Connect
              from anywhere, anytime.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-gray-900">Explore</h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center font-medium text-gray-500 transition-colors hover:text-orange-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
          <p className="text-sm font-medium text-gray-500">
            Copyright {new Date().getFullYear()} Chattique. All rights reserved by {" "}
            <span className="font-bold text-gray-900">KrushnaWebdev</span>
          </p>
          <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
            Made with <span className="animate-pulse text-red-500">heart</span> for seamless communication
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
