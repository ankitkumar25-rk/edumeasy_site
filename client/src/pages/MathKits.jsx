import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';
import KitCard from '../components/KitCard.jsx';

const MathKits = () => {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.MATHKITS);
        setKits(response.data.data || response.data);
      } catch (err) {
        // Fallback to static mock kits
      } finally {
        setLoading(false);
      }
    };
    fetchKits();
  }, []);

  const classTabs = ['ALL', '6', '7', '8', '9', '10'];

  const mockKits = [
    { id: 'kit_1', name: 'Fraction Kit 2D', price: 799, classLevel: '6', description: 'Explore fractional pieces, segment divisions, and percentages live.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg'] },
    { id: 'kit_2', name: 'Decimal Place Value Board', price: 950, classLevel: '6', description: 'Visual placement tool mapping fractions to decimal points.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg'] },
    { id: 'kit_3', name: 'Integer Operations Slider', price: 499, classLevel: '7', description: 'Interactive slider rule for add/subtract operations on negative numbers.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg'] },
    { id: 'kit_4', name: 'Properties of Parallel Lines Kit', price: 1100, classLevel: '8', description: 'Board with moving indicators to test corresponding and alternate angles.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg'] },
    { id: 'kit_5', name: '3D Polyhedron Construction Set', price: 1599, classLevel: '9', description: 'Plastic connectors and rods to construct vertices, edges, and faces of 3D shapes.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg'] },
    { id: 'kit_6', name: 'Trigonometry Ratio Board', price: 1999, classLevel: '10', description: 'Rotatable wheel demonstrating sine, cosine, tangent values across unit circle quadrants.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg'] },
  ];

  const activeKits = kits.length > 0 ? kits : mockKits;

  const filteredKits = selectedClass === 'ALL'
    ? activeKits
    : activeKits.filter((kit) => String(kit.classLevel || kit.class) === selectedClass);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Math Activity Kits</h1>
        <p className="text-lg text-slate-600">Handmade learning kits containing curriculum-aligned experimental tasks.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-1.5 rounded-xl flex space-x-1 overflow-x-auto max-w-full">
          {classTabs.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                selectedClass === cls
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cls === 'ALL' ? 'All Classes' : `Class ${cls}`}
            </button>
          ))}
        </div>
      </div>

      {filteredKits.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No activity kits available for this class.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredKits.map((kit) => (
            <KitCard key={kit.id} kit={kit} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MathKits;
