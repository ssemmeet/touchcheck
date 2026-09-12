import React, { useState } from 'react';
import { useSubmissions } from './hooks/useSubmissions';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { SeatMatrix } from './components/SeatMatrix';
import { NumberOrderView } from './components/NumberOrderView';
import { UnsubmittedSidebar } from './components/UnsubmittedSidebar';
import { NewAssignmentModal } from './components/NewAssignmentModal';
import { StudentEditModal } from './components/StudentEditModal';
import { LayoutGrid, ListOrdered } from 'lucide-react';
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
    displayMode,
    setDisplayMode,
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
        displayMode={displayMode}
      />

      <main className="app-main-content">
        {/* 2. 대시보드 통계 카드 바 */}
        <div className="content-container">
          <StatsBar stats={stats} />

          {/* 3. 2열 워크스페이스: 좌측 학생 뷰(좌석배치/번호순) + 우측 실시간 미제출 명단 */}
          <div className="workspace-grid">
            <section className="workspace-matrix-section">
              <div className="matrix-card">
                {/* 뷰 전환 탭: [좌석 배치표 (1~6분단)] vs [번호 순 정렬 (1열 남 / 2열 여)] */}
                <div className="view-mode-selector-bar">
                  <div className="view-mode-tabs">
                    <button
                      type="button"
                      className={`view-mode-tab-btn ${displayMode === 'SEAT' ? 'active' : ''}`}
                      onClick={() => setDisplayMode('SEAT')}
                    >
                      <LayoutGrid size={16} />
                      <span>좌석 배치표 (행: 1~6분단 · 열: 1~4번)</span>
                    </button>
                    <button
                      type="button"
                      className={`view-mode-tab-btn ${displayMode === 'NUMBER' ? 'active' : ''}`}
                      onClick={() => setDisplayMode('NUMBER')}
                    >
                      <ListOrdered size={16} />
                      <span>번호 순 (1열 남자 · 2열 여자)</span>
                    </button>
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

                {/* 안내 문구 */}
                <div className="view-mode-description">
                  {displayMode === 'SEAT' ? (
                    <p className="matrix-subtitle">
                      행은 <strong>1분단~6분단</strong>, 열은 <strong>1번~4번 자리</strong>입니다. 학생 카드를 클릭하여 <strong>[제출 완료]</strong> 상태를 즉시 토글하세요.
                    </p>
                  ) : (
                    <p className="matrix-subtitle">
                      출석 번호 순으로 정렬되어 있습니다. <strong>1열은 남학생</strong>, <strong>2열은 여학생</strong> 명단입니다.
                    </p>
                  )}
                </div>

                {/* 4. 조건부 렌더링: 좌석 배치표 vs 번호 순 정렬 */}
                {displayMode === 'SEAT' ? (
                  <SeatMatrix
                    students={students}
                    getStudentStatus={getStudentStatus}
                    onToggle={toggleStatus}
                    onSetStatus={setStudentStatus}
                    viewMode={viewMode}
                  />
                ) : (
                  <NumberOrderView
                    students={students}
                    getStudentStatus={getStudentStatus}
                    onToggle={toggleStatus}
                    onSetStatus={setStudentStatus}
                  />
                )}
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
