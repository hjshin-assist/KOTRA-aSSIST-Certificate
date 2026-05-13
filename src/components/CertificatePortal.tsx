import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Lock, Search, CheckCircle2, User, Info } from 'lucide-react';
import { students, Student } from '../data/students';
import { Course } from '../data/courses';

interface CertificatePortalProps {
  course: Course;
}

export default function CertificatePortal({ course }: CertificatePortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [passwords, setPasswords] = useState<{ [key: number]: string }>({});
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  const filteredStudents = students.filter(s => 
    s.courseId === course.id && s.name.includes(searchTerm)
  );

  const courseStudentsCount = students.filter(s => s.courseId === course.id).length;

  const handlePasswordChange = (studentId: number, value: string) => {
    setPasswords(prev => ({ ...prev, [studentId]: value }));
    setErrors(prev => ({ ...prev, [studentId]: '' }));
  };

  const handleUnlock = (student: Student) => {
    const pwd = passwords[student.id];
    if (pwd === student.password) {
      setUnlockedIds(prev => new Set(prev).add(student.id));
      setErrors(prev => ({ ...prev, [student.id]: '' }));
    } else {
      setErrors(prev => ({ ...prev, [student.id]: '비밀번호가 틀렸습니다.' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col geometric-grid overflow-x-hidden">
      {/* Header */}
      <header className="bg-navy-brand h-20 flex items-center justify-between px-6 md:px-10 text-white shrink-0 shadow-lg relative z-20">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-navy-brand rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight leading-tight">{course.subtitle}</h1>
            <p className="text-[10px] opacity-80 uppercase tracking-widest hidden sm:block">{course.id.replace(/-/g, ' ')}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-sm md:text-lg font-medium leading-tight">{course.title} 수료증 발급</h2>
          <p className="text-[10px] opacity-70 hidden sm:block">Certificates Issuance Portal</p>
        </div>
      </header>

      {/* Subheader / Search */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm shrink-0 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-4 md:mb-0 w-full md:w-auto">
          <div className="w-1.5 h-8 gold-gradient shrink-0"></div>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            총 <span className="text-navy-brand font-bold">{courseStudentsCount}명</span>의 수료생 여러분, 축하드립니다. 성함 확인 후 비밀번호를 입력해 주세요.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="성함 검색..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-navy-brand/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="flex-1 p-6 md:p-10">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {filteredStudents.map((student, i) => {
            const isUnlocked = unlockedIds.has(student.id);
            const isSelected = selectedStudentId === student.id;
            const error = errors[student.id];

            return (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !isSelected && setSelectedStudentId(student.id)}
                className={`bg-white border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 group relative
                  ${isSelected ? 'ring-2 ring-navy-brand border-transparent shadow-xl' : 'border-slate-200 shadow-sm hover:border-navy-brand/30'}
                `}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-slate-300 tracking-tighter">0{(student.id).toString().padStart(2, '0')}</span>
                    {isUnlocked ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    ) : (
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider
                        ${isSelected ? 'bg-navy-brand/10 text-navy-brand' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {isSelected ? 'Active' : 'Locked'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg transition-colors ${isSelected ? 'bg-navy-brand text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <User size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {student.name}
                      <span className="block text-[11px] font-medium text-slate-400 mt-0.5">{course.subtitle} Training Participant</span>
                    </h3>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                      isSelected ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-4 border-t border-slate-100"
                        >
                          <div className="relative">
                            <input 
                              type="password" 
                              placeholder="핸드폰 번호 뒷자리 입력" 
                              className={`w-full text-sm px-4 py-2.5 border rounded-lg focus:outline-none transition-all
                                ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-navy-brand'}
                              `}
                              value={passwords[student.id] || ''}
                              onChange={(e) => handlePasswordChange(student.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUnlock(student)}
                              autoFocus
                            />
                            <Lock className="absolute right-3 top-3 text-slate-300" size={14} />
                          </div>
                          {error && <p className="text-[10px] text-red-500 font-bold px-1">{error}</p>}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlock(student);
                            }}
                            className="w-full bg-navy-brand text-white text-xs font-bold py-3 rounded-lg shadow-md hover:bg-navy-brand/90 transition-all uppercase tracking-widest"
                          >
                            인증 확인
                          </button>
                        </motion.div>
                      ) : (
                        <div key="locked" className="h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg">
                          <span className="text-[10px] text-slate-400 italic">핸드폰 번호 뒷자리 입력</span>
                        </div>
                      )
                    ) : (
                      <motion.div
                        key="unlocked"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pt-4 border-t border-slate-100 text-center"
                      >
                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                          <CheckCircle2 size={18} />
                          <span>본인 인증 완료</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <a 
                            href={encodeURI(student.certificateUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full gold-gradient text-white text-xs font-bold py-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest"
                          >
                            <Download size={18} />
                            <span>{student.name}님 수료증 확인 및 저장</span>
                          </a>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 italic">
                          버튼 클릭 시 새 창에서 수료증(PDF)이 열립니다.<br />
                          파일 확인 후 브라우저의 [저장] 아이콘을 이용해 주세요.
                        </p>
                      </motion.div>
                    )
                  }
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <Info className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium italic">검색 결과가 없습니다.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center text-[10px] border-t border-slate-800 shrink-0 gap-4 mt-auto">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
          <span>© 2026 KOTRA-aSSIST 글로벌 비즈니스</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-600 font-mono tracking-tighter uppercase">Secure Access Protocol v3.0</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
        </div>
      </footer>
    </div>
  );
}
