import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';
import TeamCard from '../components/TeamCard.jsx';

const Team = () => {
  const [groupedMembers, setGroupedMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.TEAM);
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          const groups = data.reduce((acc, curr) => {
            const t = curr.type || 'Other';
            if (!acc[t]) acc[t] = [];
            acc[t].push(curr);
            return acc;
          }, {});
          setGroupedMembers(groups);
        } else {
          setGroupedMembers(data);
        }
      } catch (err) {
        setError('Failed to load team members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Our Team</h1>
        <p className="text-lg text-slate-600">The visionaries, educators, and makers behind EduMEasy.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">{error}</div>
      ) : Object.keys(groupedMembers).length === 0 ? (
        <div className="text-center text-slate-500 py-12">No team members found.</div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedMembers).map(([type, members]) => (
            <div key={type} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 capitalize">{type}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {members.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Team;
