import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-white border-t border-gray-100 font-raleway">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Adjusted Grid: Brand takes 2 columns, links take 1 each */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 pr-8">
            <a href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
                <img
                  className="w-8 h-8 object-contain"
                  src="logo.png"
                  alt="Chattique Logo"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase">
                Chattique
              </span>
            </a>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-sm">
              Seamless video calling and chat for teams and individuals. Connect from anywhere, anytime.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections (Mapped for cleaner code, but you can hardcode them) */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Security", "Enterprise"],
            },
            {
              title: "Resources",
              links: ["Documentation", "API Reference", "Blog", "Support"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Privacy Policy", "Terms of Service"],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-gray-900 mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-orange-600 font-medium transition-colors inline-flex items-center group"
                    >
                      {link}
                      {/* Subtle arrow on hover */}
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} Chattique. All rights reserved by <span className="text-gray-900 font-bold">KrushnaWebdev</span>
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for seamless communication
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;