export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-black transform rotate-45"></div>
              </div>
              <span className="text-2xl font-bold text-white">Nandi</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your always-on growth engine. Supercharge your store with AI-powered optimization.
            </p>
          </div>

          {/* Links */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Get in touch</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2025 Nandi. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              <a href="/wip" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/wip" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}