
import React, { useState } from 'react';
import { generateFormulaCards } from '../services/geminiService';
import { FormulaCard } from '../types';

interface FormulaCardsViewProps {
  onBack: () => void;
}

const CHAPTER_LIST: Record<string, string[]> = {
  'Physics': [
    'Units and Measurements', 'Kinematics', 'Laws of Motion', 'Work, Energy and Power',
    'Rotational Mechanics', 'Gravitation', 'Thermodynamics', 'Oscillations and Waves',
    'Electrostatics', 'Current Electricity', 'Magnetic Effects of Current', 'Optics',
    'Dual Nature of Matter', 'Atoms and Nuclei', 'Electronic Devices'
  ],
  'Chemistry': [
    'Some Basic Concepts', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding',
    'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Hydrogen',
    's-Block Elements', 'p-Block Elements', 'Organic Chemistry Basics', 'Hydrocarbons',
    'Environmental Chemistry', 'Solid State', 'Solutions', 'Electrochemistry',
    'Chemical Kinetics', 'Surface Chemistry', 'Coordination Compounds', 'Haloalkanes',
    'Alcohols and Phenols', 'Aldehydes and Ketones', 'Amines', 'Biomolecules', 'Polymers'
  ],
  'Mathematics': [
    'Sets and Functions', 'Trigonometric Functions', 'Complex Numbers', 'Quadratic Equations',
    'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series',
    'Straight Lines', 'Conic Sections', 'Limits and Derivatives', 'Mathematical Reasoning',
    'Matrices and Determinants', 'Continuity and Differentiability', 'Integrals',
    'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry', 'Probability'
  ],
  'Biology': [
    'Diversity in Living World', 'Structural Organization', 'Cell Structure and Function',
    'Plant Physiology', 'Human Physiology', 'Reproduction', 'Genetics and Evolution',
    'Biology and Human Welfare', 'Biotechnology', 'Ecology and Environment'
  ]
};

const FormulaCardsView: React.FC<FormulaCardsViewProps> = ({ onBack }) => {
  const [topic, setTopic] = useState('');
  const [exam, setExam] = useState('JEE Main');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<FormulaCard | null>(null);

  const handleGenerate = async (e?: React.FormEvent, manualTopic?: string) => {
    if (e) e.preventDefault();
    const targetTopic = manualTopic || topic;
    if (!targetTopic) return;
    
    setLoading(true);
    try {
      const data = await generateFormulaCards(targetTopic, exam);
      setCard(data);
    } catch (error) {
      console.error(error);
      alert("Error generating cards.");
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapter: string) => {
    setTopic(chapter);
    handleGenerate(undefined, chapter);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-16 h-16 border-b-4 border-purple-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">Creating Revision Summary</h3>
          <p className="text-slate-500">Distilling formulas and concepts for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Formula Cards</h2>
        <p className="text-lg text-slate-500">Master every chapter with high-yield revision summaries.</p>
      </div>

      {!card ? (
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Or search for a specific topic..." 
                  className="w-full p-5 pl-14 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-semibold"
                />
                <svg className="w-6 h-6 text-slate-300 absolute left-5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select 
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold text-slate-700"
              >
                <option>JEE Main</option>
                <option>JEE Advanced</option>
                <option>NEET</option>
              </select>
              <button 
                onClick={() => handleGenerate()}
                disabled={!topic}
                className="px-10 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-200 disabled:opacity-50"
              >
                Summarize
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-2">
                {Object.keys(CHAPTER_LIST).map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`pb-3 px-2 text-sm font-black transition-all relative ${
                      selectedSubject === sub ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {sub}
                    {selectedSubject === sub && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {CHAPTER_LIST[selectedSubject].map(chapter => (
                  <button
                    key={chapter}
                    onClick={() => handleChapterClick(chapter)}
                    className="p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                  >
                    <span className="text-xs font-bold text-slate-700 leading-tight group-hover:text-purple-700">{chapter}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCard(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900">{card.title}</h2>
                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-600">
                  <span>{selectedSubject}</span>
                  <span>•</span>
                  <span>{exam} Pattern</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <CardSection 
              title="Formulas & Equations" 
              items={card.formulas} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
              color="indigo"
            />
            <CardSection 
              title="Essential Concepts" 
              items={card.concepts} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              color="purple"
            />
            {card.reactions && card.reactions.length > 0 && (
              <div className="md:col-span-2">
                <CardSection 
                  title="Important Reactions" 
                  items={card.reactions} 
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 000 2.828l1.168 1.168a2 2 0 002.828 0l1.168-1.168a2 2 0 00.547-1.022l.477-2.387a6 6 0 00-.517-3.86l-.309-.618a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00-.547-1.022l-1.168-1.168a2 2 0 00-2.828 0l-1.168 1.168a2 2 0 000 2.828l1.168 1.168z" /></svg>}
                  color="pink"
                />
              </div>
            )}
            <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-purple-600/30"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-600 rounded-2xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-widest text-purple-400">Master Tip / Shortcut</h4>
                </div>
                <p className="text-2xl font-medium leading-relaxed italic text-slate-100">"{card.proTip}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CardSection: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => {
  const bgClasses: Record<string, string> = {
    indigo: 'bg-white border-slate-100',
    purple: 'bg-white border-slate-100',
    pink: 'bg-white border-slate-100'
  };
  const textClasses: Record<string, string> = {
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    pink: 'text-rose-600'
  };

  return (
    <div className={`rounded-[2.5rem] p-8 border ${bgClasses[color] || 'bg-white border-slate-100'} h-full shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-2xl bg-slate-50 ${textClasses[color] || 'text-slate-700'}`}>
          {icon}
        </div>
        <h4 className={`text-xl font-black ${textClasses[color] || 'text-slate-900'} uppercase tracking-tighter`}>{title}</h4>
      </div>
      <ul className="space-y-5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${textClasses[color].replace('text-', 'bg-') || 'bg-slate-300'}`}></span>
            <span className="text-slate-700 leading-relaxed font-semibold text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormulaCardsView;
