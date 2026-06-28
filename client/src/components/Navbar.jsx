import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, FileDown, CreditCard, ChevronDown, Menu, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    {
      name: 'MATH LAB',
      path: '#',
      dropdown: [
        { name: 'PRIMARY CLASSES', path: '/equipment/primary' },
        { name: 'ADVANCED CLASSES', path: '/equipment/advanced' },
      ],
    },
    { name: 'MATH KIT', path: '/store' },
    { name: 'HAPPENING', path: '/happening' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '#') return false;
    return location.pathname === path;
  };

  const isDropdownActive = () => {
    return location.pathname.includes('/equipment/');
  };

  return (
    <header className="w-full relative z-50 font-body">
      {/* Top Bar */}
      <div className="bg-primary text-white text-[11px] font-medium py-2 px-6 sm:px-12 flex flex-wrap justify-between items-center gap-2 border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-secondary-container" />
            <span>+91-8824661216</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-secondary-container" />
            <span>contactus@edumeasy.com</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-1.5 hover:text-secondary-container transition-colors">
            <FileDown className="w-3.5 h-3.5 text-secondary-container" />
            <span>Download Brochure</span>
          </a>
          <Link to="/checkout" className="flex items-center gap-1.5 hover:text-secondary-container transition-colors">
            <CreditCard className="w-3.5 h-3.5 text-secondary-container" />
            <span>Payment</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <Link to="/" className="flex items-center py-2">
              <img
                src="/logo/logoedumeasy-283x300.webp"
                alt="EduMEasy Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {links.filter(link => link.path !== '/store').map((link) => {
                if (link.dropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        className={`px-3 py-2 rounded-lg font-display text-[13px] font-bold tracking-wider flex items-center gap-1.5 uppercase transition-all ${isDropdownActive()
                            ? 'text-primary'
                            : 'text-on-surface-variant hover:text-primary'
                          }`}
                      >
                        {link.name} <ChevronDown className="w-4 h-4" />
                      </motion.button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-primary/10 rounded-xl shadow-xl py-2 z-50"
                          >
                            {link.dropdown.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                onClick={() => setIsDropdownOpen(false)}
                                className={`block px-4 py-2.5 font-display text-[12px] font-bold text-left transition-colors uppercase ${isActive(sub.path)
                                    ? 'bg-primary/5 text-secondary'
                                    : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                                  }`}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <motion.div key={link.path} whileHover={{ y: -1 }}>
                    <Link
                      to={link.path}
                      className={`relative px-3 py-2 rounded-lg font-display text-[13px] font-bold tracking-wider uppercase transition-all duration-200 ${isActive(link.path)
                          ? 'text-primary'
                          : 'text-on-surface-variant hover:text-primary'
                        }`}
                    >
                      {link.name}
                      {isActive(link.path) && (
                        <motion.span
                          layoutId="activeNavLine"
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Divider and E-commerce/Auth links */}
              <div className="ml-12 pl-12 border-l border-outline-variant/30 flex items-center gap-6">
                <motion.div whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/store"
                    className={`relative p-2 rounded-xl text-on-surface-variant hover:text-primary transition-all duration-200 flex items-center justify-center ${isActive('/store') ? 'text-primary bg-primary/5' : ''
                      }`}
                    title="Store"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isActive('/store') && (
                      <motion.span
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-display text-[13px] font-bold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center justify-center"
                  >
                    LOGIN
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-on-surface-variant hover:text-primary focus:outline-none p-2 rounded hover:bg-slate-50"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-outline-variant/30 px-4 pt-2 pb-4 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
            {links.map((link) => {
              if (link.dropdown) {
                return (
                  <div key={link.name} className="space-y-1 py-1">
                    <div className="px-4 py-2 text-xs font-mono font-bold text-on-surface-variant uppercase">
                      {link.name}
                    </div>
                    {link.dropdown.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={() => setIsOpen(false)}
                        className={`block pl-8 pr-4 py-2 rounded font-display text-xs font-bold uppercase transition-all ${isActive(sub.path)
                            ? 'bg-slate-50 text-secondary'
                            : 'text-on-surface-variant hover:bg-slate-50 hover:text-primary'
                          }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded font-display text-xs font-bold uppercase transition-all ${isActive(link.path)
                      ? 'bg-slate-50 text-secondary'
                      : 'text-on-surface-variant hover:bg-slate-50 hover:text-primary'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-center px-4 py-3 bg-primary text-white rounded font-display text-xs font-bold uppercase hover:opacity-90 active:scale-95 transition-all"
            >
              LOGIN
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
