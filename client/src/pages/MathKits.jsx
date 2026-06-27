import React from 'react';
import { motion } from 'framer-motion';

const MathKits = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Math Kits</h1>
      <p className="text-gray-600">Discover hand-made math activity kits designed for active learning.</p>
    </motion.div>
  );
};

export default MathKits;
