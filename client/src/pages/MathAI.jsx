import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, BookOpen, Clock, AlertCircle } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const MathAI = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.EVENTS);
        const allEvents = response.data.data || response.data;
        const olympiads = allEvents.filter((ev) => ev.type === 'OLYMPIAD');
        setEvents(olympiads);
      } catch (err) {
        // Fallback to static mock events if API fails or database is empty
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const mockOlympiads = [
    {
      id: '1',
      title: 'mathAI National Round 2026',
      description: 'The ultimate competition testing logic, pattern recognition, and mathematical coding.',
      date: '2026-11-15T09:00:00.000Z',
      price: 250,
      schedule: '09:00 AM - 12:00 PM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1uZ7AJtlcOfa7hLOABsTa8anMSH9H4gO_4rDtHINjWrml58II0SltgAxey47aDg3MH6IwG92_RH0z_3zLl5izPymPmAEBDLtz86iZSeL9wQnD7BmbqowX_N9II3MXMQWeyZ3kUm4P4c7cqtFHzSBwQP_Y2XtILLcgq3JF53_KpLSgb9h_eue1OF6l-GejbNyE6ykMarvoVrrVkn--RjgnqJnJLPVFEtdr4-YRLoSHUPGFvngJCNBhiwf22p4uDpXoxx3TE650T5E',
    },
  ];

  const displayOlympiads = events.length > 0 ? events : mockOlympiads;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background min-h-screen text-on-background font-body"
    >
      <section className="bg-primary text-on-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 math-grid-bg"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            National Level Olympiad
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">mathAI | 2026</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Bridge the gap between standard mathematics and intelligent automation. Compete nationally, showcase your skills, and win exciting prizes.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        <div className="border border-outline-variant p-8 bg-white rounded space-y-4">
          <Award className="text-secondary w-10 h-10" />
          <h3 className="text-xl font-display font-bold text-primary">₹5,00,000 Prizes</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Scholarships, research grants, and high-performance computing hardware awarded to national rankers.
          </p>
        </div>
        <div className="border border-outline-variant p-8 bg-white rounded space-y-4">
          <BookOpen className="text-secondary w-10 h-10" />
          <h3 className="text-xl font-display font-bold text-primary">Curriculum Blueprint</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Aligned with CBSE/ICSE standards but integrated with structural logic, algebra, and algorithmic optimization.
          </p>
        </div>
        <div className="border border-outline-variant p-8 bg-white rounded space-y-4">
          <Clock className="text-secondary w-10 h-10" />
          <h3 className="text-xl font-display font-bold text-primary">Flexible Slots</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Both online and laboratory-based test slots available across 500+ examination centers nationwide.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-primary mb-12 text-center">Active Registrations & Timetable</h2>

          {loading ? (
            <div className="text-center text-sm font-mono text-on-surface-variant py-12">LOADING TIMETABLE...</div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {displayOlympiads.map((ol) => (
                <div key={ol.id} className="border border-outline-variant rounded-xl overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-all bg-background">
                  <img
                    className="w-full md:w-64 h-48 object-cover"
                    src={ol.image || 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'}
                    alt={ol.title}
                  />
                  <div className="p-8 flex flex-col justify-between flex-grow text-left">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-xl font-display font-bold text-primary">{ol.title}</h3>
                        <span className="text-xs font-mono font-bold bg-secondary/10 text-secondary px-3 py-1 rounded">
                          ₹{ol.price} Entry
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-6">{ol.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-on-surface-variant border-t border-outline-variant/40 pt-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>{new Date(ol.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{ol.schedule || '09:00 AM - 12:00 PM'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default MathAI;
