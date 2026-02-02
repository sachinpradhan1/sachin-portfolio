import { useState, useEffect } from 'react';
import { Menu, X, Lock, Unlock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Admin password
const ADMIN_PASSWORD = '@Sachin889900';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check admin mode on mount
  useEffect(() => {
    const adminState = localStorage.getItem('portfolio_admin_mode') === 'true';
    setIsAdminMode(adminState);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      localStorage.setItem('portfolio_admin_mode', 'true');
      setShowPasswordDialog(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    localStorage.setItem('portfolio_admin_mode', 'false');
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Videos', id: 'videos' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'glass-effect py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group relative"
        >
          <span className="text-xl font-bold tracking-tight text-white font-['Montserrat']">
            SACHIN<span className="text-red-600">.</span>
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative text-sm text-gray-300 hover:text-white transition-colors duration-300 group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* CTA Button + Admin */}
        <div className="hidden md:flex items-center gap-3">
          {/* Admin Button */}
          {!isAdminMode ? (
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                >
                  <Lock size={14} className="mr-2" />
                  Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A1A] border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Admin Access</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Enter Password</label>
                    <Input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      placeholder="Enter admin password"
                      className="bg-black border-gray-700 text-white"
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                    )}
                  </div>
                  <Button
                    onClick={handlePasswordSubmit}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Unlock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-green-600 text-green-500 hover:text-white hover:bg-green-600"
            >
              <Unlock size={14} className="mr-2" />
              Admin On
            </Button>
          )}

          <button
            onClick={() => scrollToSection('contact')}
            className="relative overflow-hidden bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass-effect transition-all duration-300 ${isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
          }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-left text-gray-300 hover:text-white transition-colors py-2"
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Admin Button */}
          {!isAdminMode ? (
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogTrigger asChild>
                <button className="text-left text-gray-400 hover:text-white transition-colors py-2 flex items-center gap-2">
                  <Lock size={16} />
                  Admin Login
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A1A] border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Admin Access</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Enter Password</label>
                    <Input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      placeholder="Enter admin password"
                      className="bg-black border-gray-700 text-white"
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                    )}
                  </div>
                  <Button
                    onClick={handlePasswordSubmit}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Unlock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <button
              onClick={handleLogout}
              className="text-left text-green-500 hover:text-white transition-colors py-2 flex items-center gap-2"
            >
              <Unlock size={16} />
              Logout Admin
            </button>
          )}

          <button
            onClick={() => scrollToSection('contact')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold mt-2"
          >
            Hire Me
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
