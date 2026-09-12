import React, { useState, useRef, useEffect } from 'react';
import { Check, MoreHorizontal, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SUBMISSION_STATUS } from '../data/defaultStudents';

export function StudentSeatCard({ student, status, onToggle, onSetStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const isSubmitted = status === SUBMISSION_STATUS.SUBMITTED;
  const isExempted = status === SUBMISSION_STATUS.EXEMPTED;
  const isUnsubmitted = status === SUBMISSION_STATUS.UNSUBMITTED;

  // 우클릭 시 미실시/상태 메뉴 열기
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuOpen(true);
  };

  return (
    <div
      className={`student-card ${isSubmitted ? 'is-submitted' : ''} ${isExempted ? 'is-exempted' : ''} ${isUnsubmitted ? 'is-unsubmitted' : ''}`}
      onClick={onToggle}
      onContextMenu={handleContextMenu}
      title={`${student.number}번 ${student.name} (${student.gender}) - 클릭 시 제출/취소 토글`}
    >
      <div className="card-top">
        <span className="student-num">{student.number}번</span>
        <div className="card-top-right">
          <span className={`gender-tag ${student.gender === '남' ? 'gender-male' : 'gender-female'}`}>
            {student.gender}
          </span>
          <div className="menu-container" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="card-more-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              title="상태 변경 옵션"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div className="card-dropdown-menu">
                <button
                  type="button"
                  className={`dropdown-item ${isSubmitted ? 'active' : ''}`}
                  onClick={() => {
                    onSetStatus(SUBMISSION_STATUS.SUBMITTED);
                    setMenuOpen(false);
                  }}
                >
                  <CheckCircle2 size={13} className="text-emerald" /> 제출 완료
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${isUnsubmitted ? 'active' : ''}`}
                  onClick={() => {
                    onSetStatus(SUBMISSION_STATUS.UNSUBMITTED);
                    setMenuOpen(false);
                  }}
                >
                  <RotateCcw size={13} className="text-muted" /> 미제출
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${isExempted ? 'active' : ''}`}
                  onClick={() => {
                    onSetStatus(SUBMISSION_STATUS.EXEMPTED);
                    setMenuOpen(false);
                  }}
                >
                  <AlertCircle size={13} className="text-amber" /> 미실시 (결석/면제)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-center">
        <span className="student-name">{student.name}</span>
      </div>

      <div className="card-bottom">
        {isSubmitted && (
          <span className="status-pill status-pill-submitted">
            <Check size={12} strokeWidth={3} /> 제출 완료
          </span>
        )}
        {isExempted && (
          <span className="status-pill status-pill-exempted">
            미실시
          </span>
        )}
        {isUnsubmitted && (
          <span className="status-pill status-pill-unsubmitted">
            미제출
          </span>
        )}
      </div>
    </div>
  );
}
