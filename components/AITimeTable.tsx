
import React, { useState } from 'react';
import { generateAITimeTable } from '../services/geminiService';
import { TimeTable } from '../types';

interface AITimeTableViewProps {
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

const AITimeTableView: React.FC<AITimeTableViewProps> = ({ onBack }) => {
  const [hours, setHours] = useState(8);
  const [exam, setExam] = useState('JEE Main');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Physics']);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [weakTopics, setWeakTopics] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeTable, setTimeTable] = useState<TimeTable | null>(null);

  const hourOptions = [4, 6, 8, 10, 12, 14, 16];
  const subjectList = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert("Please select at least one focus subject.");
      return;
    }
    setLoading(true);
    try {
      const combinedWeakAreas = [
        ...selectedChapters,
        ...(weakTopics ? [weakTopics] : [])
      ].join(', ');
      
      const data = await generateAITimeTable(hours, exam, combinedWeakAreas, selectedSubjects.join(', '));
      setTimeTable(data);
    } catch (error) {
      console.error(error);
      alert("Error generating time table.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  const handleAddChapter = (chapter: string) => {
    if (chapter && !selectedChapters.includes(chapter)) {
      setSelectedChapters([...selectedChapters, chapter]);
    }
  };

  const handleRemoveChapter = (chapter: string) => {
    setSelectedChapters(selectedChapters.filter(c => c !== chapter));
  };

  const getSlotColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'theory': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'practice': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'revision': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'break': return 'bg-slate-50 text-slate-500 border-slate-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">Calculating Peak Performance Slots</h3>
          <p className="text-slate-500">Optimizing your schedule for maximum retention...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">AI Study Planner</h2>
        <p className="text-lg text-slate-500">A data-driven schedule to keep you ahead of the competition.</p>
      </div>

      {!timeTable ? (
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30 space-y-10">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Target Exam</label>
                <select 
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                >
                  <option>JEE Main</option>
                  <option>JEE Advanced</option>
                  <option>NEET</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Focus Subjects (Select Multi)</label>
                <div className="grid grid-cols-2 gap-2">
                  {subjectList.map(sub => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`p-3 rounded-xl border-2 font-black text-xs transition-all ${
                        selectedSubjects.includes(sub) 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Select Priority Chapters (Optional)</label>
              <div className="relative">
                <select 
                  onChange={(e) => handleAddChapter(e.target.value)}
                  value=""
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all appearance-none pr-10"
                >
                  <option value="" disabled>Choose chapters from selected subjects...</option>
                  {selectedSubjects.map(sub => (
                    <optgroup key={sub} label={sub}>
                      {CHAPTER_LIST[sub].map(chapter => (
                        <option key={chapter} value={chapter}>{chapter}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {selectedChapters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 p-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  {selectedChapters.map(chapter => (
                    <span 
                      key={chapter} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold animate-in zoom-in-95 duration-200"
                    >
                      {chapter}
                      <button 
                        type="button"
                        onClick={() => handleRemoveChapter(chapter)}
                        className="hover:text-emerald-900 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4. Daily Capacity (Hours)</label>
              <div className="flex flex-wrap gap-2">
                {hourOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHours(opt)}
                    className={`flex-1 min-w-[60px] py-4 px-2 rounded-xl font-black text-sm transition-all border ${
                      hours === opt
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                        : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {opt}h
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5. Additional Notes / Specific Challenges</label>
              <textarea 
                value={weakTopics}
                onChange={(e) => setWeakTopics(e.target.value)}
                placeholder="Mention any specific sub-topics or concepts you find difficult..."
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800 h-32 resize-none transition-all"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl shadow-2xl hover:bg-emerald-700 transition-all hover:-translate-y-1 active:scale-[0.98]"
            >
              GENERATE STUDY PLAN
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTimeTable(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900">{timeTable.title}</h2>
                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                  <span>{exam} Prep</span>
                  <span>•</span>
                  <span>{hours}h Goal</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all"
            >
              Print Plan
            </button>
          </div>

          <p className="text-slate-600 font-medium italic leading-relaxed text-center px-4">"{timeTable.description}"</p>

          <div className="grid gap-4">
            {timeTable.schedule.map((slot, idx) => (
              <div key={idx} className={`flex items-stretch gap-4 p-5 rounded-3xl border ${getSlotColor(slot.type)} transition-all hover:scale-[1.01]`}>
                <div className="w-24 flex-shrink-0 flex items-center justify-center font-black text-sm border-r border-current/10 mr-2">
                  {slot.time}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-tighter opacity-70">{slot.subject}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-current/20 uppercase tracking-widest">
                      {slot.type}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold leading-tight">{slot.activity}</h4>
                  <p className="text-xs font-medium opacity-80">{slot.topic}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-black uppercase tracking-widest text-emerald-400">Efficiency Boosters</h4>
              </div>
              <ul className="grid md:grid-cols-2 gap-4">
                {timeTable.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-sm font-medium text-slate-300">
                    <span className="text-emerald-500 font-black">#</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITimeTableView;
