import React from 'react';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-md mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Login</h1>
      <p className="text-gray-600">Access your administrative dashboard.</p>
    </motion.div>
  );
};

export default Login;
