import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const JobRequirementForm = ({ onMatch, loading }) => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      minExperience: Number(formData.minExperience)
    };
    onMatch(jobData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      className="card mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Briefcase size={20} className="text-warning" />
        <h2>Job Requirements</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Required Skills (comma separated)</label>
          <input 
            type="text" 
            name="requiredSkills" 
            value={formData.requiredSkills} 
            onChange={handleChange} 
            required 
            placeholder="React, Node.js" 
          />
        </div>
        <div className="form-group">
          <label>Minimum Experience (Years)</label>
          <input 
            type="number" 
            name="minExperience" 
            value={formData.minExperience} 
            onChange={handleChange} 
            required 
            min="0"
            placeholder="1"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="btn btn-warning w-full mt-4" 
          disabled={loading}
        >
          {loading ? <div className="loader"></div> : 'Find Matches'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default JobRequirementForm;
