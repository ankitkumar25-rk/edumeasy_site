import React from 'react';
import { motion } from 'framer-motion';

const MathLabs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Math Labs</h1>
      <p className="text-gray-600">Explore our school math lab setups and interactive model systems.</p>
    </motion.div>
  );
};

export default MathLabs;
