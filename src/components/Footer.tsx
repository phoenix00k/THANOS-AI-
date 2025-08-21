import { QrCode, Mail, Shield, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="glass-card border-t border-glass-border/50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-gradient">Thanos AI</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Harness the power of multiple AI models in one place. 
              Experience infinite possibilities with cutting-edge artificial intelligence.
            </p>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Support our mission:</p>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 glass-card rounded-lg flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Donation QR</p>
                  <p className="text-xs text-muted-foreground">
                    Voluntary support appreciated
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  AI Models
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Advanced Mode
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Image Generation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="w-3 h-3" />
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" />
                  Terms
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Shield className="w-3 h-3" />
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-glass-border/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 Thanos AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              Powered by multiple AI models
            </p>
            <div className="flex gap-1">
              {[
                "stones-power", "stones-space", "stones-reality", 
                "stones-soul", "stones-time", "stones-mind"
              ].map((stone, index) => (
                <div
                  key={stone}
                  className={`w-2 h-2 rounded-full bg-${stone} animate-pulse`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;