import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Team from './pages/Team.jsx';
import Gallery from './pages/Gallery.jsx';
import MathLabs from './pages/MathLabs.jsx';
import MathKits from './pages/MathKits.jsx';
import MathKitDetail from './pages/MathKitDetail.jsx';
import Events from './pages/Events.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';

const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-extrabold text-indigo-600">EduMEasy</Link>
          </div>
          <div className="ml-10 flex items-baseline space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/team" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Team</Link>
            <Link to="/gallery" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Gallery</Link>
            <Link to="/mathlabs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Math Labs</Link>
            <Link to="/mathkits" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Math Kits</Link>
            <Link to="/events" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Events</Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AnimatedAppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/mathlabs" element={<MathLabs />} />
            <Route path="/mathkits" element={<MathKits />} />
            <Route path="/mathkits/:id" element={<MathKitDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedAppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
