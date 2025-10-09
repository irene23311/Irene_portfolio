/* eslint-disable react/prop-types */
function Header() {
  try {
    const navigateToSection = (page) => {
      if (page === 'home') {
        window.location.href = 'index.html';
      } else {
        window.location.href = `${page}.html`;
      }
    };

    return (
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
              <div className="icon-portfolio text-lg text-white"></div>
            </div>
            <span className="font-bold text-xl">Portfolio</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => navigateToSection('home')}
              className="text-[var(--text-primary)] hover:text-[var(--primary-color)] transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigateToSection('about')}
              className="text-[var(--text-primary)] hover:text-[var(--primary-color)] transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => navigateToSection('contact')}
              className="text-[var(--text-primary)] hover:text-[var(--primary-color)] transition-colors"
            >
              Contact
            </button>
          </nav>

          <div className="md:hidden">
            <div className="icon-menu text-xl text-[var(--text-primary)]"></div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
/* eslint-disable react/prop-types */
export default function Header() {
  return (
    <div className="site-header">
      <a href="/">Portfolio</a>
      <nav style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  );
}