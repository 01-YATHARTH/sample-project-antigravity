import React, { useState } from 'react';
import { addCandidate } from '../services/api';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateForm = ({ onCandidateAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const candidateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: Number(formData.experience)
      };
      await addCandidate(candidateData);
      setFormData({ name: '', email: '', skills: '', experience: '', bio: '' });
      onCandidateAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      className="card mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <UserPlus size={20} className="text-primary" />
        <h2>Add Candidate</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
          </div>
        </div>
        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="React, Node.js, MongoDB" />
        </div>
        <div className="form-group">
          <label>Experience (Years)</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" placeholder="2" />
        </div>
        <div className="form-group">
          <label>Bio / Projects</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Brief description of experience and projects..."></textarea>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="btn btn-primary w-full mt-4" 
          disabled={loading}
        >
          {loading ? <div className="loader"></div> : 'Add Candidate'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CandidateForm;
