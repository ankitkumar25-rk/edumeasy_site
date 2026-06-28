import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MathAI from './pages/MathAI.jsx';
import About from './pages/About.jsx';
import MathLabs from './pages/MathLabs.jsx';
import Clients from './pages/Clients.jsx';
import Post from './pages/Post.jsx';
import Contact from './pages/Contact.jsx';
import MathKits from './pages/MathKits.jsx';
import MathKitDetail from './pages/MathKitDetail.jsx';
import Login from './pages/Login.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Dither from './components/Dither.jsx';
import Events from './pages/Events.jsx';
import Gallery from './pages/Gallery.jsx';

const AnimatedAppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-body relative overflow-hidden">
      <Dither className="fixed inset-0 z-50 pointer-events-none opacity-40" />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/mathai" element={<MathAI />} />
            <Route path="/about" element={<About />} />
            <Route path="/equipment/primary" element={<MathLabs />} />
            <Route path="/equipment/advanced" element={<MathLabs />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/post" element={<Post />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/store" element={<MathKits />} />
            <Route path="/store/:id" element={<MathKitDetail />} />
            <Route path="/happening" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
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
