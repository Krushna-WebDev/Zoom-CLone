const Footer = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <img
                  className="w-10 h-10"
                  src="logo.png"
                  alt="Chattique Logo"
                />
              </div>
              <span className="text-xl font-bold font-raleway uppercase">Chattique</span>
            </a>
            <p className="text-muted-foreground text-sm mb-6">
              Seamless video calling and chat for teams and individuals. Connect
              from anywhere.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                {/* <Twitter className="w-5 h-5" /> */}
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                {/* <Github className="w-5 h-5" /> */}
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                {/* <Linkedin className="w-5 h-5" /> */}
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Enterprise
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 Chattique. All rights reserved.KrushnaWebdev
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ for seamless communication
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
