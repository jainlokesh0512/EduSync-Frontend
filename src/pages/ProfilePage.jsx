import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/UserModels/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (!profile) {
    return <p className="p-6 text-gray-400">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-[#0f172a]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-[#1e293b] shadow-xl rounded-3xl p-8 border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          My Profile
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 text-gray-300"
        >
          <div className="border-b border-gray-800 pb-4">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Full Name</h3>
            <p className="text-lg text-white">{profile.fullName}</p>
          </div>
          
          <div className="border-b border-gray-800 pb-4">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Email</h3>
            <p className="text-lg text-white">{profile.email}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
