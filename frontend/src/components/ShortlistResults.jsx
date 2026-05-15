import React from 'react';
import { Award, BrainCircuit, Bookmark, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const ShortlistResults = ({ results, aiSuggestions, aiLoading, onToggleSave }) => {
  const chartData = results.slice(0, 5).map(c => ({
    name: c.name,
    score: Math.round(c.matchScore * 100),
    level: c.matchLevel
  }));

  const getColor = (level) => {
    if (level === 'High') return 'var(--success)';
    if (level === 'Medium') return 'var(--warning)';
    return 'var(--danger)';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(20,20,25,0.9)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
          <p style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>{payload[0].payload.name}</p>
          <p style={{ color: getColor(payload[0].payload.level), margin: 0 }}>Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Award size={28} className="text-success" style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }} />
        <h2>Top Candidates</h2>
      </div>

      {results.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8" style={{ height: '220px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <h3 className="mb-4 text-secondary text-center" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Match Score Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="flex-col gap-4">
        {results.length === 0 ? (
          <p className="text-center text-secondary">No candidates match the criteria.</p>
        ) : (
          results.map((candidate, i) => {
            let aiFeedback = null;
            if (aiSuggestions && Array.isArray(aiSuggestions)) {
              aiFeedback = aiSuggestions.find(s => s.candidateName === candidate.name);
            }

            return (
              <motion.div 
                key={candidate._id} 
                className="card" 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {candidate.name}
                    <span className={`badge badge-${candidate.matchLevel === 'High' ? 'success' : candidate.matchLevel === 'Medium' ? 'warning' : 'danger'}`}>
                      {candidate.matchLevel}
                    </span>
                  </h3>
                  <div className="flex items-center gap-4">
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '800', color: getColor(candidate.matchLevel), textShadow: `0 0 15px ${getColor(candidate.matchLevel)}` }}>
                        {Math.round(candidate.matchScore * 100)}%
                      </span>
                    </div>
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
                </div>

                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Matched <strong>{candidate.matchedSkillsCount}</strong> skills • <strong>{candidate.experience}</strong> years exp.
                </p>

                {aiLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-3 mt-4" 
                    style={{ padding: '1rem', background: 'linear-gradient(90deg, rgba(99,102,241,0.1), transparent)', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}
                  >
                    <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px', borderColor: 'rgba(99,102,241,0.3)', borderTopColor: 'var(--primary)' }}></div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>AI deep analyzing profile...</span>
                  </motion.div>
                ) : aiFeedback ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4" 
                    style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.15)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit size={18} className="text-primary" style={{ filter: 'drop-shadow(0 0 5px rgba(99,102,241,0.5))' }} />
                      <span style={{ fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.02em' }}>AI Rank #{aiFeedback.rank}</span>
                    </div>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>{aiFeedback.explanation}</p>
                    
                    {aiFeedback.interviewQuestions && aiFeedback.interviewQuestions.length > 0 && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                         <div className="flex items-center gap-2 mb-2">
                            <HelpCircle size={16} className="text-warning" />
                            <span style={{ fontWeight: '600', color: 'var(--warning)', fontSize: '0.9rem' }}>Suggested Interview Questions:</span>
                         </div>
                         <ul style={{ listStyleType: 'none', padding: 0, margin: 0, gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                           {aiFeedback.interviewQuestions.map((q, qIndex) => (
                             <li key={qIndex} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', borderLeft: '2px solid var(--warning)' }}>
                               {q}
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                  </motion.div>
                ) : aiSuggestions && aiSuggestions[0]?.error ? (
                  <div className="mt-4" style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', borderLeft: '3px solid var(--danger)' }}>
                     <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--danger)' }}>{aiSuggestions[0].error}</p>
                  </div>
                ) : null}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default ShortlistResults;
