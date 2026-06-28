import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { PlusCircle, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const kitSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((val) => Number(val), z.number().min(1, 'Price must be greater than 0')),
  classNumber: z.preprocess((val) => Number(val), z.number().min(1).max(12)),
  videoUrl: z.string().url('Must be a valid URL').or(z.literal('')),
});

const teamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  qualification: z.string().min(2, 'Qualification must be at least 2 characters'),
  role: z.enum(['TEAM', 'MENTOR', 'ADVISOR']),
  image: z.string().url('Must be a valid URL'),
});

const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['EVENT', 'WORKSHOP', 'OLYMPIAD']),
  date: z.string().min(1, 'Date is required'),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  schedule: z.string().or(z.literal('')),
  image: z.string().url('Must be a valid URL'),
});

const Post = () => {
  const { user } = useAuth();
  const [activeForm, setActiveForm] = useState('kit');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register: regKit, handleSubmit: handleKitSubmit, reset: resetKit, formState: { errors: kitErrors, isSubmitting: kitSubmitting } } = useForm({
    resolver: zodResolver(kitSchema),
  });

  const { register: regTeam, handleSubmit: handleTeamSubmit, reset: resetTeam, formState: { errors: teamErrors, isSubmitting: teamSubmitting } } = useForm({
    resolver: zodResolver(teamSchema),
  });

  const { register: regEvent, handleSubmit: handleEventSubmit, reset: resetEvent, formState: { errors: eventErrors, isSubmitting: eventSubmitting } } = useForm({
    resolver: zodResolver(eventSchema),
  });

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white border border-outline-variant rounded-xl text-center space-y-6">
        <Info className="w-16 h-16 text-primary mx-auto" />
        <h2 className="text-2xl font-display font-bold text-primary">Admin Access Required</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          You must be logged in as an Administrator to post content to the EduMEasy database.
        </p>
      </div>
    );
  }

  const onKitSubmit = async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const payload = {
        ...data,
        price: data.price * 100, // convert back to cents / standard units
      };
      await axiosInstance.post(API_ENDPOINTS.MATHKITS || '/api/mathkits', payload);
      setSuccessMsg('Math Kit created successfully!');
      resetKit();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create Math Kit');
    }
  };

  const onTeamSubmit = async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await axiosInstance.post('/api/team', data);
      setSuccessMsg('Team Member added successfully!');
      resetTeam();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add Team Member');
    }
  };

  const onEventSubmit = async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
      };
      await axiosInstance.post('/api/events', payload);
      setSuccessMsg('Event created successfully!');
      resetEvent();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create Event');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto my-16 p-8 bg-white border border-outline-variant rounded-xl font-body text-left"
    >
      <div className="flex justify-between items-center border-b border-outline-variant/30 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Content Publisher</h1>
          <p className="text-xs text-on-surface-variant">Post new models directly to the EduMEasy live site database.</p>
        </div>
        <div className="bg-slate-100 p-1 rounded flex gap-1 border border-outline-variant/20">
          <button
            onClick={() => { setActiveForm('kit'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase transition-all ${activeForm === 'kit' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Math Kit
          </button>
          <button
            onClick={() => { setActiveForm('team'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase transition-all ${activeForm === 'team' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Team
          </button>
          <button
            onClick={() => { setActiveForm('event'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase transition-all ${activeForm === 'event' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Event
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded mb-6 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      {activeForm === 'kit' && (
        <form onSubmit={handleKitSubmit(onKitSubmit)} className="space-y-6">
          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Kit Title *</label>
            <input type="text" {...regKit('title')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Algebra Kit Class 8" />
            {kitErrors.title && <p className="text-xs text-red-600 mt-1">{kitErrors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Description *</label>
            <textarea rows="4" {...regKit('description')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="Provide full details of the lab items inside this kit..."></textarea>
            {kitErrors.description && <p className="text-xs text-red-600 mt-1">{kitErrors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Price (INR) *</label>
              <input type="number" {...regKit('price')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. 1500" />
              {kitErrors.price && <p className="text-xs text-red-600 mt-1">{kitErrors.price.message}</p>}
            </div>

            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Class Number (1-12) *</label>
              <input type="number" {...regKit('classNumber')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. 8" />
              {kitErrors.classNumber && <p className="text-xs text-red-600 mt-1">{kitErrors.classNumber.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Demonstration Video URL</label>
            <input type="text" {...regKit('videoUrl')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. https://youtube.com/embed/..." />
            {kitErrors.videoUrl && <p className="text-xs text-red-600 mt-1">{kitErrors.videoUrl.message}</p>}
          </div>

          <button type="submit" disabled={kitSubmitting} className="w-full bg-primary text-white py-4 rounded font-mono font-bold uppercase hover:opacity-90 transition-all">
            {kitSubmitting ? 'PUBLISHING...' : 'PUBLISH MATH KIT'}
          </button>
        </form>
      )}

      {activeForm === 'team' && (
        <form onSubmit={handleTeamSubmit(onTeamSubmit)} className="space-y-6">
          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Member Name *</label>
            <input type="text" {...regTeam('name')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Dr. Ramesh Vyas" />
            {teamErrors.name && <p className="text-xs text-red-600 mt-1">{teamErrors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Qualifications *</label>
            <input type="text" {...regTeam('qualification')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Ph.D in Applied Math (IIT Roorkee)" />
            {teamErrors.qualification && <p className="text-xs text-red-600 mt-1">{teamErrors.qualification.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Role *</label>
              <select {...regTeam('role')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary">
                <option value="TEAM">Core Team</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADVISOR">Advisor</option>
              </select>
              {teamErrors.role && <p className="text-xs text-red-600 mt-1">{teamErrors.role.message}</p>}
            </div>

            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Profile Photo URL *</label>
              <input type="text" {...regTeam('image')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="https://res.cloudinary.com/..." />
              {teamErrors.image && <p className="text-xs text-red-600 mt-1">{teamErrors.image.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={teamSubmitting} className="w-full bg-primary text-white py-4 rounded font-mono font-bold uppercase hover:opacity-90 transition-all">
            {teamSubmitting ? 'PUBLISHING...' : 'PUBLISH TEAM MEMBER'}
          </button>
        </form>
      )}

      {activeForm === 'event' && (
        <form onSubmit={handleEventSubmit(onEventSubmit)} className="space-y-6">
          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Event Title *</label>
            <input type="text" {...regEvent('title')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. national Olympiad round" />
            {eventErrors.title && <p className="text-xs text-red-600 mt-1">{eventErrors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Event Description *</label>
            <textarea rows="3" {...regEvent('description')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="Describe workshop slots or syllabus..."></textarea>
            {eventErrors.description && <p className="text-xs text-red-600 mt-1">{eventErrors.description.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Type *</label>
              <select {...regEvent('type')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary">
                <option value="EVENT">General Event</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="OLYMPIAD">Olympiad</option>
              </select>
              {eventErrors.type && <p className="text-xs text-red-600 mt-1">{eventErrors.type.message}</p>}
            </div>

            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Date *</label>
              <input type="datetime-local" {...regEvent('date')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" />
              {eventErrors.date && <p className="text-xs text-red-600 mt-1">{eventErrors.date.message}</p>}
            </div>

            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Entry Price (INR)</label>
              <input type="number" {...regEvent('price')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="0 for free" />
              {eventErrors.price && <p className="text-xs text-red-600 mt-1">{eventErrors.price.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Schedule Time Label</label>
              <input type="text" {...regEvent('schedule')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="e.g. 10:00 AM - 01:00 PM" />
              {eventErrors.schedule && <p className="text-xs text-red-600 mt-1">{eventErrors.schedule.message}</p>}
            </div>

            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Banner Photo URL *</label>
              <input type="text" {...regEvent('image')} className="w-full bg-slate-50 border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-secondary" placeholder="https://res.cloudinary.com/..." />
              {eventErrors.image && <p className="text-xs text-red-600 mt-1">{eventErrors.image.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={eventSubmitting} className="w-full bg-primary text-white py-4 rounded font-mono font-bold uppercase hover:opacity-90 transition-all">
            {eventSubmitting ? 'PUBLISHING...' : 'PUBLISH EVENT'}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default Post;
