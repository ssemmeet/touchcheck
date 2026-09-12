import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  Users, 
  ArrowLeftRight, 
  RotateCcw, 
  CheckCheck,
  ChevronDown
} from 'lucide-react';

export function Header({
  assignments,
  currentAssignmentId,
  onSelectAssignment,
  onOpenNewAssignment,
  onDeleteAssignment,
  viewMode,
  onToggleViewMode,
  onOpenStudentEdit,
  onBatchSetStatus,
}) {
  const [showBatchMenu, setShowBatchMenu] = useState(false);

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* 앱 브랜딩 (AI스럽지 않고 단정한 학교 서식/교무 도구 느낌) */}
        <div className="brand-section">
          <div className="brand-icon">
            <ClipboardCheck size={24} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">학생 제출 확인 도우미</h1>
            <p className="brand-subtitle">4×6 좌석 배치 실시간 제출 체크</p>
          </div>
        </div>

        {/* 중앙: 과제 선택 툴바 */}
        <div className="assignment-toolbar">
          <div className="assignment-select-wrapper">
            <label htmlFor="assignment-select" className="assignment-label">
              확인 과제
            </label>
            <select
              id="assignment-select"
              className="assignment-select"
              value={currentAssignmentId}
              onChange={(e) => onSelectAssignment(e.target.value)}
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="action-btn btn-secondary"
            onClick={onOpenNewAssignment}
            title="새로운 과제나 준비물 체크 항목 추가"
          >
            <Plus size={16} />
            <span>새 과제 추가</span>
          </button>

          {assignments.length > 1 && (
            <button
              type="button"
              className="icon-btn btn-danger"
              onClick={() => onDeleteAssignment(currentAssignmentId)}
              title="현재 과제 삭제"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {/* 우측 도구 모음 */}
        <div className="header-actions">
          {/* 시점 전환 버튼 */}
          <button
            type="button"
            className="action-btn btn-toggle-view"
            onClick={onToggleViewMode}
            title={viewMode === 'TEACHER' ? '학생 시점(칠판 바라보는 기준)으로 전환' : '교탁 시점(앞에서 내려다보는 기준)으로 전환'}
          >
            <ArrowLeftRight size={15} />
            <span>
              {viewMode === 'TEACHER' ? '교탁 시점' : '학생 시점'}
            </span>
          </button>

          {/* 일괄 체크 드롭다운 */}
          <div className="dropdown-wrapper">
            <button
              type="button"
              className="action-btn btn-secondary"
              onClick={() => setShowBatchMenu(!showBatchMenu)}
              title="일괄 처리 메뉴"
            >
              <CheckCheck size={16} />
              <span>일괄 관리</span>
              <ChevronDown size={14} />
            </button>

            {showBatchMenu && (
              <div className="header-dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    if (confirm('현재 과제의 모든 학생을 [제출 완료]로 표시하시겠습니까?')) {
                      onBatchSetStatus('SUBMITTED');
                    }
                    setShowBatchMenu(false);
                  }}
                >
                  <CheckCheck size={14} className="text-emerald" /> 전원 제출 완료
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    if (confirm('현재 과제의 모든 학생을 [미제출] 상태로 초기화하시겠습니까?')) {
                      onBatchSetStatus('UNSUBMITTED');
                    }
                    setShowBatchMenu(false);
                  }}
                >
                  <RotateCcw size={14} className="text-muted" /> 제출 현황 초기화
                </button>
              </div>
            )}
          </div>

          {/* 학생 명단 편집 버튼 */}
          <button
            type="button"
            className="action-btn btn-primary"
            onClick={onOpenStudentEdit}
            title="학생 24명 이름 및 성별 편집"
          >
            <Users size={16} />
            <span>명단 편집</span>
          </button>
        </div>
      </div>
    </header>
  );
}
