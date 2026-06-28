import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage(null);
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-md mx-auto my-12"
    >
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Login</h1>
          <p className="text-sm text-slate-500">Sign in to manage team and event updates.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{errorMessage}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${
                  errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2`}
                placeholder="admin@edumeasy.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${
                  errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
