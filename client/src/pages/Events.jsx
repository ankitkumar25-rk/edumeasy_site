import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Compass, Cpu, Sparkles, BookOpen } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.EVENTS);
        setEvents(response.data.data || response.data);
      } catch (err) {
        // Fallback to static mock events
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const mockEvents = [
    { id: '1', title: 'National Mathematics Olympiad', date: '2026-08-15', location: 'New Delhi (Hybrid)', description: 'Solve complex geometric proofs and logical riddles to win scholarships.' },
    { id: '2', title: 'Interactive Geometry Workshop', date: '2026-09-02', location: 'Mumbai', description: 'Hands-on laboratory training showing practical demonstrations of Theorems.' },
  ];

  const activeEvents = events.length > 0 ? events : mockEvents;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-7xl mx-auto space-y-20"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">What's Happening</h1>
        <p className="text-lg text-slate-600">Register for state olympiads, training camps, and preview our upcoming AI learning integrations.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
          <Calendar className="text-indigo-600 w-6 h-6" /> Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeEvents.map((evt) => (
            <div key={evt.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                  {new Date(evt.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </span>
                <span className="text-xs text-slate-500 font-medium">{evt.location}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{evt.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{evt.description}</p>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/10 transition-colors">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Teacher & Student Camps
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              School Teacher Training Workshops
            </h2>
            <p className="text-slate-600">
              We guide educators through practical mathematics methods. Our trained mentors visit campuses to demonstrate concrete model-based lesson plans that engage visual learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Certified Training</h4>
                  <p className="text-xs text-slate-500">Government approved syllabus certificates.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Resource Kits</h4>
                  <p className="text-xs text-slate-500">Detailed instruction guides and manuals.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg"
              alt="Workshop demonstration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Sparkles className="w-5 h-5 animate-pulse" /> Introducing EduMEasy AI
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Hyper-Personalized Math Learning Assistants
            </h2>
            <p className="text-slate-300">
              Our upcoming MathAI system analyzes student errors on activity sheets to generate personalized, step-by-step 3D geometry roadmaps. Teachers get complete analytics on individual learning decay curves.
            </p>
            <div className="pt-2">
              <span className="px-4 py-2 bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold rounded-lg text-xs">
                Private Beta Launch — Q3 2026
              </span>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="text-indigo-400 w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm text-slate-100">Adaptive Reasoning Core</h4>
                <p className="text-xs text-slate-400">Understands visual layouts and equation steps.</p>
              </div>
            </div>
            <div className="border-t border-slate-700/50 my-4"></div>
            <div className="text-xs font-mono text-slate-400 bg-slate-950/40 p-4 rounded-xl">
              <span className="text-green-400">// MathAI System Status</span><br />
              &gt; Analyzing geometry proof response...<br />
              &gt; Error detected in Line 3: Alternate Interior Angles.<br />
              &gt; Generating customized Geoboard exercise link...
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Events;
