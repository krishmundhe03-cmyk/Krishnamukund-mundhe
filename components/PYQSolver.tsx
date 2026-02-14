
import React, { useState } from 'react';
import { solvePYQ } from '../services/geminiService';
import { PYQSolution } from '../types';

interface PYQSolverViewProps {
  onBack: () => void;
}

const PYQSolverView: React.FC<PYQSolverViewProps> = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [exam, setExam] = useState('JEE Main');
  const [subject, setSubject] = useState('Physics');
  const [year, setYear] = useState('2023');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<PYQSolution | null>(null);

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    try {
      const data = await solvePYQ(question, exam, year, subject);
      setSolution(data);
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
        <div className="w-16 h-16 border-l-4 border-amber-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">Analyzing Question</h3>
          <p className="text-slate-500">Retrieving standard solutions and expert tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">PYQ Solver</h2>
        <p className="text-slate-500">Get deep conceptual clarity on past exam questions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <form onSubmit={handleSolve} className="p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Exam</label>
              <select 
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option>JEE Main</option>
                <option>JEE Advanced</option>
                <option>NEET</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Biology</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Year</label>
              <input 
                type="text" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year (e.g. 2024)" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Question Text</label>
            <textarea 
              value={question}
              onChange={(setQuestionText => setQuestion(setQuestionText.target.value))}
              placeholder="Paste the PYQ text here..."
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none resize-none font-medium text-slate-800"
              required
            ></textarea>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
          >
            Solve & Explain
          </button>
        </form>
      </div>

      {solution && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700 pb-12">
          <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-800 rounded-lg">
                <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h4 className="text-xl font-bold text-indigo-100 uppercase tracking-widest">Underlying Concept</h4>
            </div>
            <p className="text-lg leading-relaxed text-indigo-50">{solution.underlyingConcept}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900">Mathematical Derivation</h4>
            </div>
            <div className="text-slate-700 leading-relaxed font-mono text-sm whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100 overflow-x-auto">
              {solution.mathematicalDerivation}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-xl font-bold text-emerald-900">Pro-Tip for Fast Solving</h4>
            </div>
            <p className="text-emerald-800 font-medium leading-relaxed bg-white/50 p-4 rounded-xl border border-emerald-100 italic">
              "{solution.proTip}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PYQSolverView;
