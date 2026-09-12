import React from 'react';
import { ArrowLeftRight, Eye, Monitor } from 'lucide-react';
import { StudentSeatCard } from './StudentSeatCard';

export function SeatMatrix({ students, getStudentStatus, onToggle, onSetStatus, viewMode, setViewMode }) {
  // 행렬 구성: 6행 (1~6), 4열 (1~4)
  // viewMode에 따른 정렬:
  // - 'TEACHER': 교탁에서 바라봄 (앞자리가 위쪽, 교탁 기준 좌우)
  // - 'STUDENT': 칠판을 바라봄 (학생 기준 1분단이 왼쪽)
  
  const rows = [1, 2, 3, 4, 5, 6];
  const cols = viewMode === 'TEACHER' ? [4, 3, 2, 1] : [1, 2, 3, 4];

  // 학생 찾기 (row, col)
  const getStudentAt = (r, c) => {
    return students.find(s => s.row === r && s.col === c);
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

      {/* 분단 헤더 */}
      <div className="matrix-column-headers">
        {cols.map((colNum) => (
          <div key={`header-${colNum}`} className="column-header-cell">
            <span className="buntan-badge">{colNum}분단</span>
          </div>
        ))}
      </div>

      {/* 4*6 좌석 행렬 */}
      <div className="matrix-grid">
        {rows.map((rowNum) => (
          <div key={`row-${rowNum}`} className="matrix-row">
            <div className="row-label">{rowNum}열</div>
            <div className="row-seats">
              {cols.map((colNum) => {
                const student = getStudentAt(rowNum, colNum);
                if (!student) {
                  return (
                    <div key={`empty-${rowNum}-${colNum}`} className="student-card empty-seat">
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

      {/* 뒤쪽 (교실 뒤) 인디케이터 */}
      <div className="classroom-back-label">
        <span>교실 뒷문 / 사물함 (뒤)</span>
      </div>
    </div>
  );
}
