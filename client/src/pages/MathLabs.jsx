import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const MathLabs = () => {
  const location = useLocation();
  const isAdvancedPath = location.pathname.includes('advanced');
  const [activeTab, setActiveTab] = useState(isAdvancedPath ? 'ADVANCED' : 'PRIMARY');
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(location.pathname.includes('advanced') ? 'ADVANCED' : 'PRIMARY');
  }, [location.pathname]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.MATHLABS);
        setLabs(response.data.data || response.data);
      } catch (err) {
        // Fallback to static mock labs
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const filteredLabs = labs.filter((lab) => lab.level === activeTab);

  const mockLabs = {
    PRIMARY: [
      { id: '1', name: 'Fraction Kit', details: 'Interactive foam/plastic shapes showing parts of a whole.', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg' },
      { id: '2', name: 'Wooden Geoboard', details: 'Dual-sided geoboard with rubber bands for polygon analysis.', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg' },
      { id: '3', name: 'Decimal Abacus', details: '10-row wire frame model explaining place value system.', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg' },
    ],
    ADVANCED: [
      { id: '4', name: 'Pythagoras Theorem Model', details: 'Liquid or acrylic tile-based proof of a² + b² = c².', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg' },
      { id: '5', name: 'Clinometer', details: 'Accurate sights and plumb line to calculate heights & angles.', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg' },
      { id: '6', name: 'Algebraic Identities Kit', details: '3D blocks demonstrating (a + b)³ expansions visually.', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg' },
    ],
  };

  const displayLabs = filteredLabs.length > 0 ? filteredLabs : mockLabs[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-7xl mx-auto font-body"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-display font-bold text-primary mb-4">Mathematics Laboratory</h1>
        <p className="text-sm text-on-surface-variant">State-of-the-art interactive lab equipment to experience math hands-on.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-1.5 rounded flex space-x-1 border border-outline-variant/30">
          <button
            onClick={() => setActiveTab('PRIMARY')}
            className={`px-6 py-3 rounded text-xs font-mono font-bold uppercase transition-all duration-200 ${
              activeTab === 'PRIMARY'
                ? 'bg-white text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Primary (Grades 1-5)
          </button>
          <button
            onClick={() => setActiveTab('ADVANCED')}
            className={`px-6 py-3 rounded text-xs font-mono font-bold uppercase transition-all duration-200 ${
              activeTab === 'ADVANCED'
                ? 'bg-white text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Advanced (Grades 6-10)
          </button>
        </div>
      </div>

      <div className="mb-16 bg-slate-900 rounded-xl overflow-hidden shadow-xl aspect-video max-w-4xl mx-auto border border-outline-variant/30">
        <iframe
          className="w-full h-full"
          src={
            activeTab === 'PRIMARY'
              ? 'https://www.youtube.com/embed/dQw4w9WgXcQ'
              : 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
          title="Math Lab Demonstration"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-primary border-b pb-2">Lab Equipments</h2>
        {loading ? (
          <div className="text-center py-12 text-sm text-on-surface-variant font-mono">LOADING EQUIPMENT...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayLabs.map((lab) => (
              <div key={lab.id} className="bg-white rounded border border-outline-variant overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={lab.imageUrl || lab.images?.[0]?.url || 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample.jpg'}
                  alt={lab.name || lab.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-display font-bold text-primary mb-2">{lab.name || lab.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{lab.details || lab.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MathLabs;
