import React from 'react';
import { Monitor } from 'lucide-react';
import { StudentSeatCard } from './StudentSeatCard';

export function SeatMatrix({ students, getStudentStatus, onToggle, onSetStatus, viewMode }) {
  // 행: 1~6분단 (row 1 ~ 6)
  // 열: 1~4번 (col 1 ~ 4)
  const rows = [1, 2, 3, 4, 5, 6];
  const cols = viewMode === 'TEACHER' ? [4, 3, 2, 1] : [1, 2, 3, 4];

  // 학생 찾기 (row: 분단 번호, col: 분단 내 번호)
  const getStudentAt = (bundun, seatNum) => {
    return students.find(s => s.row === bundun && s.col === seatNum);
  };

  return (
    <div className="seat-matrix-container">
      {/* 칠판 & 교탁 인디케이터 바 */}
      <div className="podium-banner">
        <div className="podium-line"></div>
        <div className="podium-badge">
          <Monitor size={15} />
          <span>칠판 및 교탁 (앞)</span>
        </div>
        <div className="podium-line"></div>
      </div>

      {/* 열 헤더 (1번, 2번, 3번, 4번) */}
      <div className="matrix-column-headers">
        <div className="row-label-placeholder"></div>
        {cols.map((colNum) => (
          <div key={`header-${colNum}`} className="column-header-cell">
            <span className="col-num-badge">{colNum}번 자리</span>
          </div>
        ))}
      </div>

      {/* 1~6분단(행) × 1~4번(열) 좌석 행렬 */}
      <div className="matrix-grid">
        {rows.map((bundunNum) => (
          <div key={`bundun-${bundunNum}`} className="matrix-row">
            <div className="row-bundun-label">
              <span className="bundun-title">{bundunNum}분단</span>
            </div>
            <div className="row-seats">
              {cols.map((colNum) => {
                const student = getStudentAt(bundunNum, colNum);
                if (!student) {
                  return (
                    <div key={`empty-${bundunNum}-${colNum}`} className="student-card empty-seat">
                      <span className="empty-text">빈 좌석</span>
                    </div>
                  );
                }
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
        ))}
      </div>

      {/* 뒤쪽 인디케이터 */}
      <div className="classroom-back-label">
        <span>교실 뒷문 / 사물함 (뒤)</span>
      </div>
    </div>
  );
}
