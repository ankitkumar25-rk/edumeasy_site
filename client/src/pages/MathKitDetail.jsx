import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const MathKitDetail = () => {
  const { id } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Math Kit Details</h1>
      <p className="text-gray-600">Viewing kit with ID: <span className="font-mono text-indigo-600">{id}</span></p>
    </motion.div>
  );
};

export default MathKitDetail;
