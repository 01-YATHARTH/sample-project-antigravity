import React, { useState } from 'react';
import { Users, Search, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateList = ({ candidates, onToggleSave }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-primary" />
          <h2>All Candidates</h2>
        </div>
        <div className="flex items-center gap-2" style={{ position: 'relative' }}>
          <Search size={16} className="text-secondary" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search name or skill..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px', width: '220px', borderRadius: '20px' }}
          />
        </div>
      </div>

      <div className="flex-col gap-4">
        {filteredCandidates.length === 0 ? (
          <p className="text-center text-secondary">No candidates found.</p>
        ) : (
          <AnimatePresence>
            {filteredCandidates.map((candidate, i) => (
              <motion.div 
                key={candidate._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card" 
                style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{candidate.name}</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleSave(candidate._id)}
                    className="btn btn-outline"
                    style={{ 
                      padding: '0.4rem', 
                      borderRadius: '50%',
                      borderColor: candidate.isSaved ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      background: candidate.isSaved ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                    }}
                  >
                    <Bookmark size={18} fill={candidate.isSaved ? 'var(--primary)' : 'none'} color={candidate.isSaved ? 'var(--primary)' : 'var(--text-secondary)'} />
                  </motion.button>
                </div>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{candidate.email}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {candidate.skills.map((skill, j) => (
                    <span key={j} className="badge badge-primary">{skill}</span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>Experience:</strong> {candidate.experience} years
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default CandidateList;
