
import React, { useState, useEffect } from 'react';
import { generatePracticeTest } from '../services/geminiService';
import { PracticeTest, Question, SavedTestTemplate } from '../types';

interface CustomTestViewProps {
  onBack: () => void;
}

const STORAGE_KEY = 'aceprep_multi_saved_tests';

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

const CustomTestView: React.FC<CustomTestViewProps> = ({ onBack }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Chemistry']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Hydrocarbons']);
  const [examLevel, setExamLevel] = useState('JEE Main');
  const [count, setCount] = useState(15); 
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState<PracticeTest | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<SavedTestTemplate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved tests", e);
      }
    }
  }, []);

  const subjects = [
    { name: 'Physics', icon: '⚛️', color: 'indigo' },
    { name: 'Chemistry', icon: '🧪', color: 'emerald' },
    { name: 'Mathematics', icon: '📐', color: 'amber' },
    { name: 'Biology', icon: '🧬', color: 'rose' }
  ];

  const examLevels = ['JEE Main', 'JEE Advanced', 'NEET'];
  const countOptions = [15, 25, 30, 45, 50, 60, 75];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedSubjects.length === 0 || selectedTopics.length === 0) {
      alert("Please select at least one subject and pick topics.");
      return;
    }
    setLoading(true);
    try {
      const data = await generatePracticeTest(
        selectedSubjects.join(', '), 
        selectedTopics.join(', '), 
        count, 
        examLevel
      );
      setTest(data);
      setShowSolutions(false);
    } catch (error) {
      console.error(error);
      alert("Failed to generate test. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (name: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(name)) {
        const next = prev.filter(s => s !== name);
        setSelectedTopics(topics => topics.filter(t => next.some(s => CHAPTER_LIST[s]?.includes(t))));
        return next;
      }
      return [...prev, name];
    });
  };

  const addTopic = (name: string) => {
    if (name && !selectedTopics.includes(name)) {
      setSelectedTopics([...selectedTopics, name]);
    }
  };

  const removeTopic = (name: string) => {
    setSelectedTopics(selectedTopics.filter(t => t !== name));
  };

  const toggleAllInSubject = (subjectName: string) => {
    const chapters = CHAPTER_LIST[subjectName] || [];
    const allSelected = chapters.every(c => selectedTopics.includes(c));
    
    if (allSelected) {
      setSelectedTopics(prev => prev.filter(t => !chapters.includes(t)));
    } else {
      setSelectedTopics(prev => {
        const others = prev.filter(t => !chapters.includes(t));
        return [...others, ...chapters];
      });
    }
  };

  const handleSaveTemplate = () => {
    const newTemplate: SavedTestTemplate = {
      id: Date.now().toString(),
      subject: selectedSubjects.join(', '),
      topic: selectedTopics.join(', '),
      examLevel,
      count
    };
    
    const updated = [newTemplate, ...savedTemplates].slice(0, 10);
    setSavedTemplates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    alert("Test configuration saved successfully!");
  };

  const removeTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const applyTemplate = (t: SavedTestTemplate) => {
    setSelectedSubjects(t.subject.split(', '));
    setSelectedTopics(t.topic.split(', '));
    setExamLevel(t.examLevel);
    setCount(t.count);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">Generating Your Test</h3>
          <p className="text-slate-500">Curating {count} high-quality questions for {selectedSubjects.join(' & ')}...</p>
        </div>
      </div>
    );
  }

  if (test) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTest(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {test.topic.split(', ').map(t => (
                  <span key={t} className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>{test.subject}</span>
                <span>•</span>
                <span>{examLevel}</span>
                <span>•</span>
                <span>{test.questions.length} Qs</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleSaveTemplate}
              className="px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save Template
            </button>
            <button 
              onClick={() => setShowSolutions(!showSolutions)}
              className={`px-6 py-2 rounded-xl font-bold shadow-lg transition-all ${
                showSolutions 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {showSolutions ? 'Reviewing Solutions' : 'Submit & View Solutions'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {test.questions.map((q) => (
            <div key={q.id} className="bg-white rounded-[1.5rem] p-8 transition-all hover:bg-slate-50/50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${q.type === 'MCQ' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                    {q.type}
                  </span>
                </div>
                <p className="text-lg text-slate-800 leading-relaxed font-semibold">{q.questionText}</p>
              </div>

              {q.type === 'MCQ' && q.options && (
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center p-4 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer transition-all group bg-white shadow-sm">
                      <div className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center mr-3 text-xs text-slate-400 font-bold group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-slate-700 font-medium">{opt}</span>
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'NUMERICAL' && (
                <div className="mt-6 max-w-xs">
                  <input 
                    type="text" 
                    placeholder="Type numerical answer..." 
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono shadow-sm"
                  />
                </div>
              )}

              {showSolutions && (
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Correct Answer: {q.correctAnswer}</span>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expert Solution</h5>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{q.solution}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase tracking-tighter">Custom Practice</h2>
        <p className="text-lg text-slate-500">Refine your skills with targeted multi-subject sessions.</p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30 space-y-12">
        
        {savedTemplates.length > 0 && (
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Load Templates</label>
            <div className="flex flex-wrap gap-3">
              {savedTemplates.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedSubjects.join(', ') === t.subject && selectedTopics.join(', ') === t.topic && examLevel === t.examLevel && count === t.count
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                    : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">📚</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 leading-tight max-w-[150px] truncate">{t.topic}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{t.examLevel} • {t.count} Qs</span>
                  </div>
                  <button 
                    onClick={(e) => removeTemplate(e, t.id)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-100 hover:text-rose-600 rounded-md text-slate-400"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Select Subjects</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => toggleSubject(s.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${
                  selectedSubjects.includes(s.name)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-3xl mb-2">{s.icon}</span>
                <span className="font-bold text-sm">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedSubjects.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Choose Topics (Select from Dropdowns)</label>
            <div className="space-y-6">
              {selectedSubjects.map(subjectName => {
                const subjectInfo = subjects.find(s => s.name === subjectName);
                const availableChapters = CHAPTER_LIST[subjectName]?.filter(c => !selectedTopics.includes(c)) || [];
                const currentSelectedCount = CHAPTER_LIST[subjectName]?.filter(c => selectedTopics.includes(c)).length || 0;

                return (
                  <div key={subjectName} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-4 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{subjectInfo?.icon}</span>
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{subjectName}</h4>
                        <span className="text-[10px] bg-white border border-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                          {currentSelectedCount} selected
                        </span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => toggleAllInSubject(subjectName)}
                        className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                          CHAPTER_LIST[subjectName]?.every(c => selectedTopics.includes(c)) 
                          ? 'text-rose-500 hover:text-rose-700' 
                          : 'text-indigo-600 hover:text-indigo-800'
                        }`}
                      >
                        {CHAPTER_LIST[subjectName]?.every(c => selectedTopics.includes(c)) ? 'Clear All' : 'Select All'}
                      </button>
                    </div>

                    <div className="relative">
                      <select
                        onChange={(e) => addTopic(e.target.value)}
                        value=""
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 appearance-none pr-10 shadow-sm"
                      >
                        <option value="" disabled>Add a topic from {subjectName}...</option>
                        {availableChapters.map(chapter => (
                          <option key={chapter} value={chapter}>{chapter}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Chips for this subject */}
                    <div className="flex flex-wrap gap-2">
                      {CHAPTER_LIST[subjectName]?.filter(c => selectedTopics.includes(c)).map(topic => (
                        <span 
                          key={topic} 
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[11px] font-bold shadow-sm animate-in zoom-in-95"
                        >
                          {topic}
                          <button 
                            type="button"
                            onClick={() => removeTopic(topic)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Exam Target</label>
                <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                {examLevels.map((level) => (
                    <button
                    key={level}
                    type="button"
                    onClick={() => setExamLevel(level)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
                        examLevel === level 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    >
                    {level}
                    </button>
                ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4. Question Count</label>
                <div className="flex flex-wrap gap-2">
                    {countOptions.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => setCount(opt)}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all border ${
                        count === opt
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.05]'
                            : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                        {opt}
                    </button>
                    ))}
                </div>
            </div>
        </div>

        <button 
          type="submit"
          className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl shadow-2xl hover:bg-black transition-all hover:-translate-y-1 active:scale-[0.98]"
        >
          GENERATE CUSTOM TEST
        </button>
      </form>
    </div>
  );
};

export default CustomTestView;
