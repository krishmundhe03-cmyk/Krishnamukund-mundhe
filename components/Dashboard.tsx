
import React from 'react';
import { AppView, AnalyticsData } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView) => void;
  onStartPYQ?: (exam: string, year: string) => void;
}

const MOCK_ANALYTICS: AnalyticsData = {
  accuracyTrend: [
    { date: '12 May', value: 45 },
    { date: '14 May', value: 52 },
    { date: '15 May', value: 48 },
    { date: '18 May', value: 65 },
    { date: '20 May', value: 60 },
    { date: '22 May', value: 72 },
    { date: '25 May', value: 68 },
  ],
  subjectMastery: [
    { subject: 'Physics', value: 65, color: 'bg-blue-500' },
    { subject: 'Chemistry', value: 82, color: 'bg-emerald-500' },
    { subject: 'Mathematics', value: 58, color: 'bg-amber-500' },
    { subject: 'Biology', value: 75, color: 'bg-rose-500' },
  ],
  weakAreas: [
    { topic: 'Rotational Mechanics', subject: 'Physics', score: 32 },
    { topic: 'Ionic Equilibrium', subject: 'Chemistry', score: 45 },
    { topic: 'Integration', subject: 'Mathematics', score: 38 },
  ]
};

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, onStartPYQ }) => {
  const pyqExams = [
    { name: 'JEE Main', years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'], color: 'indigo' },
    { name: 'JEE Advanced', years: ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014'], color: 'rose' },
    { name: 'NEET', years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'], color: 'emerald' },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 max-w-3xl mx-auto py-8">
        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
          Master Your Exams with <span className="text-indigo-600">AI-Powered</span> Learning
        </h2>
        <p className="text-lg text-slate-600">
          AcePrep provides tailored practice tests, quick revision cards, and AI-driven study schedules specifically for JEE and NEET aspirants.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Custom Practice Tests"
          description="Generate NTA-standard tests for any subject and topic. Mixed MCQ and numerical types with detailed solutions."
          icon={<div className="bg-blue-100 p-3 rounded-xl"><svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>}
          onClick={() => onViewChange(AppView.CUSTOM_TEST)}
          accent="blue"
        />
        <FeatureCard 
          title="Topic Revision Cards"
          description="Instant flashcards for key formulas, important reactions, and core concepts. Perfect for quick last-minute revisions."
          icon={<div className="bg-purple-100 p-3 rounded-xl"><svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>}
          onClick={() => onViewChange(AppView.FORMULA_CARDS)}
          accent="purple"
        />
        <FeatureCard 
          title="AI Time Table"
          description="Build a high-productivity study schedule. Balance theory, practice, and breaks tailored to your target exam and weak areas."
          icon={<div className="bg-emerald-100 p-3 rounded-xl"><svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
          onClick={() => onViewChange(AppView.AI_TIME_TABLE)}
          accent="emerald"
        />
      </div>

      <section className="space-y-8 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Solve Previous Year Questions</h3>
            <p className="text-slate-500 font-medium">Test yourself with real exam questions from the last 15 years.</p>
          </div>
          <button 
            onClick={() => onViewChange(AppView.PYQ_BROWSER)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all"
          >
            Browse Full Archive
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pyqExams.map((exam) => (
            <div key={exam.name} className="flex flex-col p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className={`text-xl font-black ${exam.color === 'indigo' ? 'text-indigo-600' : exam.color === 'rose' ? 'text-rose-600' : 'text-emerald-600'}`}>{exam.name}</h4>
                <div className={`p-2 rounded-xl bg-white shadow-sm text-slate-400`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {exam.years.map((year) => (
                  <button
                    key={year}
                    onClick={() => onStartPYQ?.(exam.name, year)}
                    className="flex items-center justify-center p-2.5 bg-white rounded-xl border border-slate-100 hover:border-indigo-300 hover:shadow-sm transition-all group"
                  >
                    <span className="font-bold text-slate-600 text-[11px]">{year}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Performance Analytics</h3>
            <p className="text-slate-500">Insights driven by your recent activity</p>
          </div>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Download Report</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Accuracy Trend (Last 7 Sessions)</h4>
            <div className="h-64 w-full relative group">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                {[0, 50, 100, 150, 200].map((y, i) => (
                  <line key={i} x1="0" y1={y} x2="700" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                
                <path
                  d={`M ${MOCK_ANALYTICS.accuracyTrend.map((t, i) => `${(i / 6) * 700},${200 - (t.value * 2)}`).join(' L ')}`}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-1000"
                />
                
                {MOCK_ANALYTICS.accuracyTrend.map((t, i) => (
                  <g key={i} className="group/point">
                    <circle
                      cx={(i / 6) * 700}
                      cy={200 - (t.value * 2)}
                      r="6"
                      fill="#4f46e5"
                      className="transition-transform group-hover/point:scale-150 cursor-pointer"
                    />
                    <text
                      x={(i / 6) * 700}
                      y={200 - (t.value * 2) - 15}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-500 font-bold opacity-0 group-hover/point:opacity-100 transition-opacity"
                    >
                      {t.value}%
                    </text>
                  </g>
                ))}
              </svg>
              <div className="flex justify-between mt-4">
                {MOCK_ANALYTICS.accuracyTrend.map((t, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-400 uppercase">{t.date}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Subject Mastery</h4>
            <div className="space-y-6">
              {MOCK_ANALYTICS.subjectMastery.map((s) => (
                <div key={s.subject} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{s.subject}</span>
                    <span className="text-xs font-bold text-slate-500">{s.value}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${s.color} transition-all duration-700 ease-out`} 
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
             <div className="md:w-1/3 space-y-2">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900">Priority Areas</h4>
                <p className="text-slate-500 text-sm">Targeting these topics can boost your score by up to 15% in your next mock test.</p>
             </div>
             
             <div className="flex-1 grid md:grid-cols-3 gap-4 w-full">
                {MOCK_ANALYTICS.weakAreas.map((area) => (
                  <div key={area.topic} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{area.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold">Needs Prep</span>
                    </div>
                    <h5 className="font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">{area.topic}</h5>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${area.score}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{area.score}%</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">Your Study Progress</h3>
            <p className="text-slate-600 italic">"The harder you work for something, the greater you'll feel when you achieve it."</p>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[65%] rounded-full shadow-sm"></div>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Overall Mastery: 65%</span>
              <span>Next Milestone: 70%</span>
            </div>
          </div>
          <div className="hidden md:block w-px h-32 bg-slate-200"></div>
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Tests Taken" value="12" />
            <StatBox label="Cards Reviewed" value="156" />
            <StatBox label="PYQs Solved" value="48" />
            <StatBox label="Accuracy" value="72%" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; accent: string }> = ({ title, description, icon, onClick, accent }) => {
  const borderColors: Record<string, string> = {
    blue: 'hover:border-blue-400',
    purple: 'hover:border-purple-400',
    emerald: 'hover:border-emerald-400'
  };

  return (
    <button 
      onClick={onClick}
      className={`bg-white p-8 rounded-3xl border border-slate-200 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${borderColors[accent] || 'hover:border-indigo-400'}`}
    >
      <div className="mb-6">{icon}</div>
      <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </button>
  );
};

const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-center p-3">
    <div className="text-2xl font-bold text-indigo-600">{value}</div>
    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
  </div>
);

export default Dashboard;
