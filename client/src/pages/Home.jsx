import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-4xl mx-auto text-center"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to EduMEasy</h1>
      <p className="text-lg text-gray-600 mb-8">Empowering classrooms with dynamic, hands-on learning kits and laboratories.</p>
    </motion.div>
  );
};

export default Home;
