
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PracticeTest, Question, PYQSolution, LeaderboardEntry } from '../types';
import { solvePYQ } from '../services/geminiService';

interface PYQBrowserViewProps {
  initialExam?: string;
  initialYear?: string;
  onBack: () => void;
}

const CHAPTER_LIST: Record<string, string[]> = {
  'Physics': ['Kinematics', 'Laws of Motion', 'Work & Energy', 'Rotational Mechanics', 'Gravitation', 'Thermodynamics', 'Electrostatics', 'Optics'],
  'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Hydrocarbons', 'Solutions', 'Electrochemistry', 'Coordination Compounds'],
  'Mathematics': ['Quadratic Equations', 'Matrices', 'Calculus', 'Vectors', '3D Geometry', 'Probability', 'Trigonometry', 'Sequences'],
  'Biology': ['Cell Biology', 'Genetics', 'Plant Physiology', 'Human Physiology', 'Ecology', 'Biotechnology', 'Reproduction']
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { name: "Aditya S.", score: 384, subject: "Physics", rank: 1 },
  { name: "Priya M.", score: 372, subject: "Mathematics", rank: 2 },
  { name: "Rahul K.", score: 365, subject: "Chemistry", rank: 3 },
  { name: "Sneha V.", score: 350, subject: "Biology", rank: 4 },
  { name: "Ishaan T.", score: 342, subject: "Physics", rank: 5 },
];

const PYQBrowserView: React.FC<PYQBrowserViewProps> = ({ initialExam = 'JEE Main', initialYear = '2024', onBack }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'manual'>('browse');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [exam, setExam] = useState(initialExam);
  const [year, setYear] = useState(initialYear);
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState<(PracticeTest & { questions: (Question & { difficultyLevel?: string })[] }) | null>(null);
  
  // Scoring State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Manual Solver State
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualSolution, setManualSolution] = useState<PYQSolution | null>(null);

  const fetchTopicPYQs = async (topic: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a realistic 10-question MCQ test of Previous Year Questions (PYQs) for ${exam} targeting the topic: "${topic}" in ${selectedSubject}.
      Requirements:
      - Authenticity: Questions must mirror official ${exam} format and difficulty.
      - Variety: Mix of easy, medium, and hard levels.
      - Detailed Solutions: Provide step-by-step logic for each.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.NUMBER },
                    type: { type: Type.STRING },
                    questionText: { type: Type.STRING },
                    difficultyLevel: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    solution: { type: Type.STRING }
                  },
                  required: ["id", "type", "questionText", "options", "correctAnswer", "solution"]
                }
              }
            },
            required: ["subject", "topic", "questions"]
          }
        }
      });

      setTest(JSON.parse(response.text || '{}'));
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch topics. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    if (!test) return;
    let total = 0;
    test.questions.forEach(q => {
      const userAns = userAnswers[q.id];
      if (userAns) {
        if (userAns === q.correctAnswer) {
          total += 4;
        } else {
          total -= 1;
        }
      }
    });
    setScore(total);
    setShowResults(true);
    
    // Save personal best to local storage
    const pb = localStorage.getItem('aceprep_pb') || '0';
    if (total > parseInt(pb)) {
      localStorage.setItem('aceprep_pb', total.toString());
    }
  };

  const handleManualSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuestion) return;
    setLoading(true);
    try {
      const data = await solvePYQ(manualQuestion, exam, year, selectedSubject || 'Physics');
      setManualSolution(data);
    } catch (error) {
      console.error(error);
      alert("Error solving question.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900">Scanning Topic Archives</h3>
          <p className="text-slate-500 font-medium">Fetching authentic PYQs for {selectedSubject}...</p>
        </div>
      </div>
    );
  }

  if (test) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setTest(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{test.topic}</h2>
              <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                <span>{selectedSubject}</span>
                <span>•</span>
                <span>{exam} Archive</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Score</div>
              <div className={`text-3xl font-black ${score >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {showResults ? score : '??'} <span className="text-sm text-slate-400">/ 40</span>
              </div>
            </div>
            {!showResults ? (
              <button 
                onClick={calculateScore}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all"
              >
                SUBMIT TEST
              </button>
            ) : (
              <button 
                onClick={() => setTest(null)}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl"
              >
                BACK TO TOPICS
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {test.questions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              
              return (
                <div key={q.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 tracking-widest">
                      Question {idx + 1}
                    </span>
                    {showResults && (
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'bg-emerald-50 text-emerald-600' : userAns ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                        {isCorrect ? '+4 Marks' : userAns ? '-1 Mark' : '0 Marks (Skipped)'}
                      </span>
                    )}
                  </div>

                  <p className="text-xl text-slate-800 leading-relaxed font-bold mb-8">{q.questionText}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {q.options?.map((opt, i) => {
                      const optLabel = String.fromCharCode(65 + i);
                      const isSelected = userAns === optLabel;
                      const isOptionCorrect = q.correctAnswer === optLabel;
                      
                      let appearance = "bg-slate-50 border-slate-100 text-slate-700";
                      if (showResults) {
                        if (isOptionCorrect) appearance = "bg-emerald-50 border-emerald-500 text-emerald-700";
                        else if (isSelected && !isCorrect) appearance = "bg-rose-50 border-rose-500 text-rose-700";
                      } else if (isSelected) {
                        appearance = "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md";
                      }

                      return (
                        <button
                          key={i}
                          disabled={showResults}
                          onClick={() => handleAnswer(q.id, optLabel)}
                          className={`flex items-center p-5 border-2 rounded-2xl text-left transition-all group ${appearance}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-xs font-black transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                            {optLabel}
                          </div>
                          <span className="font-bold">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="mt-10 p-8 bg-slate-900 rounded-[2rem] text-white animate-in slide-in-from-top-4 duration-300">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Official Derivation</h5>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">{q.solution}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl sticky top-24">
              <h4 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Real-time Leaderboard</h4>
              <div className="space-y-4">
                {MOCK_LEADERBOARD.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs ${entry.rank === 1 ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-400'}`}>
                        {entry.rank}
                      </span>
                      <div>
                        <div className="text-sm font-black text-slate-900">{entry.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{entry.subject}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black text-indigo-600">{entry.score}</div>
                  </div>
                ))}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-600 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-xs">U</div>
                      <div className="text-sm font-black">Your Best</div>
                    </div>
                    <div className="text-sm font-black">{localStorage.getItem('aceprep_pb') || '0'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">PYQ MASTERY</h2>
          <p className="text-lg text-slate-500 font-medium">Browse by subject and chapter for precision practice.</p>
        </div>
        <div className="inline-flex p-1.5 bg-slate-100 rounded-[2rem] border border-slate-200">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'browse' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            CHAPTER-WISE
          </button>
          <button 
            onClick={() => setActiveTab('manual')}
            className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'manual' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            PASTE & SOLVE
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <div className="space-y-12">
          {/* Subject Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(CHAPTER_LIST).map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${
                  selectedSubject === sub 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg' 
                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-4xl">
                  {sub === 'Physics' ? '⚛️' : sub === 'Chemistry' ? '🧪' : sub === 'Mathematics' ? '📐' : '🧬'}
                </span>
                <span className="font-black uppercase tracking-widest text-xs">{sub}</span>
              </button>
            ))}
          </div>

          {/* Chapters Column */}
          {selectedSubject && (
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{selectedSubject} Chapters</h3>
                <div className="flex gap-2">
                  {['JEE Main', 'NEET'].map(ex => (
                    <button 
                      key={ex} 
                      onClick={() => setExam(ex)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${exam === ex ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CHAPTER_LIST[selectedSubject].map(topic => (
                  <button
                    key={topic}
                    onClick={() => fetchTopicPYQs(topic)}
                    className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600">{topic}</span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleManualSolve} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8 animate-in fade-in slide-in-from-top-2">
           <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Target</label>
                <select value={exam} onChange={e => setExam(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none">
                  <option>JEE Main</option>
                  <option>NEET</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year Context</label>
                <input type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Subject</label>
                <select value={selectedSubject || 'Physics'} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none">
                  {Object.keys(CHAPTER_LIST).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <textarea 
              value={manualQuestion}
              onChange={e => setManualQuestion(e.target.value)}
              placeholder="Paste the PYQ text here for an instant AI-powered solution and expert tip..."
              className="w-full h-48 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-bold text-slate-800"
            ></textarea>
            {manualSolution && (
              <div className="space-y-6 animate-in slide-in-from-top-4">
                 <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-xl">
                    <h4 className="text-xl font-black uppercase tracking-widest text-indigo-300 mb-4">Underlying Concept</h4>
                    <p className="text-lg leading-relaxed font-bold">{manualSolution.underlyingConcept}</p>
                 </div>
                 <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 font-mono text-sm leading-relaxed whitespace-pre-wrap">{manualSolution.mathematicalDerivation}</div>
                 <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 flex items-center gap-6">
                    <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg">⚡</div>
                    <p className="text-emerald-800 font-black">PRO-TIP: "{manualSolution.proTip}"</p>
                 </div>
              </div>
            )}
            <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-black transition-all uppercase tracking-widest">
              Solve via AI
            </button>
        </form>
      )}
    </div>
  );
};

export default PYQBrowserView;
