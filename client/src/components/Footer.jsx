import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-container text-slate-300 py-16 border-t border-primary/10 font-body text-left">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo/logoedumeasy-283x300.webp"
                alt="EduMEasy Logo"
                className="h-28 w-auto object-contain brightness-100 invert-0 bg-white/10 p-2.5 rounded-xl"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              World's first comprehensive Math Lab supplier for schools. Developed by IITians to transform mathematical thinking through structured activity and experimentation.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary hover:scale-110 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary hover:scale-110 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary hover:scale-110 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary hover:scale-110 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-display font-bold uppercase tracking-wider">Useful Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-all">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-all">About Us</Link>
              </li>
              <li>
                <Link to="/mathai" className="hover:text-white hover:underline transition-all">mathAI Olympiad</Link>
              </li>
              <li>
                <Link to="/clients" className="hover:text-white hover:underline transition-all">Our Clients</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-all">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-display font-bold uppercase tracking-wider">Our Solutions</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/mathlabs?tab=primary" className="hover:text-white hover:underline transition-all">Primary Math Lab</Link>
              </li>
              <li>
                <Link to="/mathlabs?tab=advanced" className="hover:text-white hover:underline transition-all">Advanced Math Lab</Link>
              </li>
              <li>
                <Link to="/mathkits" className="hover:text-white hover:underline transition-all">Student Activity Kits</Link>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">Classwise Manuals</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-display font-bold uppercase tracking-wider">Head Office</h4>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">IIT Jodhpur Campus, NH 62, Karwar, Jodhpur, Rajasthan 342037</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>+91-8824661216</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>contactus@edumeasy.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} EduMEasy. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
