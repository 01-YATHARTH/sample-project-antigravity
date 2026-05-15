import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CandidateForm from '../components/CandidateForm';
import JobRequirementForm from '../components/JobRequirementForm';
import CandidateList from '../components/CandidateList';
import ShortlistResults from '../components/ShortlistResults';
import { getCandidates, matchCandidates, shortlistAI, toggleSaveCandidate } from '../services/api';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [shortlisted, setShortlisted] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch candidates. Ensure backend is running.');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleCandidateAdded = () => {
    fetchCandidates();
  };

  const handleMatch = async (jobData) => {
    setLoading(true);
    setError('');
    try {
      const results = await matchCandidates(jobData);
      setShortlisted(results);
      
      if (results.length > 0) {
        setAiLoading(true);
        try {
          const aiData = await shortlistAI({
            requiredSkills: jobData.requiredSkills,
            minExperience: jobData.minExperience,
            candidates: results.slice(0, 5)
          });
          setAiSuggestions(aiData);
        } catch (aiErr) {
          console.error('AI Error:', aiErr);
          setAiSuggestions([{ error: 'AI matching unavailable. Check API key.' }]);
        } finally {
          setAiLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to match candidates. DB might be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (id) => {
    try {
      await toggleSaveCandidate(id);
      fetchCandidates();
      if (shortlisted) {
        setShortlisted(shortlisted.map(c => 
          c._id === id ? { ...c, isSaved: !c.isSaved } : c
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      className="container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card badge-danger mb-4 text-center"
            style={{ display: 'block', padding: '1rem', border: '1px solid var(--danger)' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-2">
        <div className="flex-col gap-4" style={{ display: 'flex' }}>
          <JobRequirementForm onMatch={handleMatch} loading={loading} />
          <CandidateForm onCandidateAdded={handleCandidateAdded} />
        </div>
        
        <div className="flex-col gap-4" style={{ display: 'flex' }}>
          <AnimatePresence mode="wait">
            {shortlisted ? (
              <motion.div 
                key="shortlist"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <ShortlistResults 
                  results={shortlisted} 
                  aiSuggestions={aiSuggestions}
                  aiLoading={aiLoading}
                  onToggleSave={handleToggleSave}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <CandidateList 
                  candidates={candidates} 
                  onToggleSave={handleToggleSave} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
