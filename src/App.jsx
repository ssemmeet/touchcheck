import React, { useState } from 'react';
import { useSubmissions } from './hooks/useSubmissions';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { SeatMatrix } from './components/SeatMatrix';
import { UnsubmittedSidebar } from './components/UnsubmittedSidebar';
import { NewAssignmentModal } from './components/NewAssignmentModal';
import { StudentEditModal } from './components/StudentEditModal';
import './App.css';

export function App() {
  const {
    students,
    assignments,
    currentAssignment,
    currentAssignmentId,
    setCurrentAssignmentId,
    viewMode,
    setViewMode,
    toggleStatus,
    setStudentStatus,
    batchSetStatus,
    addAssignment,
    deleteAssignment,
    updateStudents,
    resetToDefaultStudents,
    getStudentStatus,
    stats,
  } = useSubmissions();

  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [isStudentEditOpen, setIsStudentEditOpen] = useState(false);

  const handleToggleViewMode = () => {
    setViewMode((prev) => (prev === 'TEACHER' ? 'STUDENT' : 'TEACHER'));
  };

  return (
    <div className="app-layout">
      {/* 1. 상단 네비게이션 및 컨트롤 헤더 */}
      <Header
        assignments={assignments}
        currentAssignmentId={currentAssignmentId}
        onSelectAssignment={setCurrentAssignmentId}
        onOpenNewAssignment={() => setIsNewAssignmentOpen(true)}
        onDeleteAssignment={deleteAssignment}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        onOpenStudentEdit={() => setIsStudentEditOpen(true)}
        onBatchSetStatus={batchSetStatus}
      />

      <main className="app-main-content">
        {/* 2. 대시보드 통계 카드 바 */}
        <div className="content-container">
          <StatsBar stats={stats} />

          {/* 3. 2열 워크스페이스: 좌측 4*6 좌석 행렬 + 우측 실시간 미제출 명단 */}
          <div className="workspace-grid">
            <section className="workspace-matrix-section">
              <div className="matrix-card">
                <div className="matrix-header-bar">
                  <div>
                    <h2 className="matrix-title">학급 좌석 배치도 (4분단 × 6열)</h2>
                    <p className="matrix-subtitle">
                      학생 카드를 클릭하여 <strong>[제출 완료]</strong> 상태를 즉시 토글하세요.
                    </p>
                  </div>
                  <div className="matrix-status-legend">
                    <span className="legend-item">
                      <span className="legend-dot dot-submitted"></span> 제출 완료
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot dot-unsubmitted"></span> 미제출
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot dot-exempted"></span> 미실시
                    </span>
                  </div>
                </div>

                <SeatMatrix
                  students={students}
                  getStudentStatus={getStudentStatus}
                  onToggle={toggleStatus}
                  onSetStatus={setStudentStatus}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </div>
            </section>

            {/* 우측 실시간 미제출자 명단 패널 */}
            <section className="workspace-sidebar-section">
              <UnsubmittedSidebar
                assignment={currentAssignment}
                stats={stats}
                onToggleStatus={toggleStatus}
              />
            </section>
          </div>
        </div>
      </main>

      {/* 모달 창들 */}
      <NewAssignmentModal
        isOpen={isNewAssignmentOpen}
        onClose={() => setIsNewAssignmentOpen(false)}
        onAdd={addAssignment}
      />

      <StudentEditModal
        isOpen={isStudentEditOpen}
        onClose={() => setIsStudentEditOpen(false)}
        currentStudents={students}
        onSave={updateStudents}
        onResetDefault={resetToDefaultStudents}
      />
    </div>
  );
}

export default App;
