import React, { useMemo } from 'react';
import { StudentSeatCard } from './StudentSeatCard';
import { CheckCircle2, Users } from 'lucide-react';
import { SUBMISSION_STATUS } from '../data/defaultStudents';

export function NumberOrderView({ students, getStudentStatus, onToggle, onSetStatus }) {
  // 남학생 목록 (번호 순 정렬)
  const maleStudents = useMemo(() => {
    return students
      .filter(s => s.gender === '남')
      .sort((a, b) => a.number - b.number);
  }, [students]);

  // 여학생 목록 (번호 순 정렬)
  const femaleStudents = useMemo(() => {
    return students
      .filter(s => s.gender === '여')
      .sort((a, b) => a.number - b.number);
  }, [students]);

  // 남학생 제출 완료 수
  const maleSubmittedCount = useMemo(() => {
    return maleStudents.filter(s => getStudentStatus(s.id) === SUBMISSION_STATUS.SUBMITTED).length;
  }, [maleStudents, getStudentStatus]);

  // 여학생 제출 완료 수
  const femaleSubmittedCount = useMemo(() => {
    return femaleStudents.filter(s => getStudentStatus(s.id) === SUBMISSION_STATUS.SUBMITTED).length;
  }, [femaleStudents, getStudentStatus]);

  return (
    <div className="number-order-container">
      <div className="number-columns-grid">
        {/* 1열: 남학생 (1번, 3번, 5번...) */}
        <div className="number-column male-column">
          <div className="column-header-banner banner-male">
            <div className="banner-left">
              <span className="gender-badge-large badge-male">남</span>
              <div className="banner-text">
                <h3 className="column-title">1열 · 남학생 목록</h3>
                <span className="column-desc">출석 번호 순 정렬</span>
              </div>
            </div>
            <div className="banner-stat">
              <span className="stat-count">
                <strong>{maleSubmittedCount}</strong> / {maleStudents.length}명
              </span>
              <span className="stat-rate">
                {maleStudents.length > 0 ? Math.round((maleSubmittedCount / maleStudents.length) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="student-cards-column">
            {maleStudents.map((student) => {
              const status = getStudentStatus(student.id);
              return (
                <StudentSeatCard
                  key={student.id}
                  student={student}
                  status={status}
                  onToggle={() => onToggle(student.id)}
                  onSetStatus={(newStatus) => onSetStatus(student.id, newStatus)}
                />
              );
            })}
          </div>
        </div>

        {/* 2열: 여학생 (2번, 4번, 6번...) */}
        <div className="number-column female-column">
          <div className="column-header-banner banner-female">
            <div className="banner-left">
              <span className="gender-badge-large badge-female">여</span>
              <div className="banner-text">
                <h3 className="column-title">2열 · 여학생 목록</h3>
                <span className="column-desc">출석 번호 순 정렬</span>
              </div>
            </div>
            <div className="banner-stat">
              <span className="stat-count">
                <strong>{femaleSubmittedCount}</strong> / {femaleStudents.length}명
              </span>
              <span className="stat-rate">
                {femaleStudents.length > 0 ? Math.round((femaleSubmittedCount / femaleStudents.length) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="student-cards-column">
            {femaleStudents.map((student) => {
              const status = getStudentStatus(student.id);
              return (
                <StudentSeatCard
                  key={student.id}
                  student={student}
                  status={status}
                  onToggle={() => onToggle(student.id)}
                  onSetStatus={(newStatus) => onSetStatus(student.id, newStatus)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
