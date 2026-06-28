import React from 'react';

const TeamCard = ({ member }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="w-full bg-slate-100">
        <img
          src={member.photoUrl || 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample.jpg'}
          alt={member.name}
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
        <p className="text-sm text-indigo-600 font-semibold mb-2">{member.role}</p>
        {member.bio && <p className="text-sm text-slate-600 line-clamp-3">{member.bio}</p>}
      </div>
    </div>
  );
};

export default TeamCard;
