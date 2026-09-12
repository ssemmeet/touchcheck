import React, { useState } from 'react';
import { X, Check, RotateCcw, FileText, ListOrdered } from 'lucide-react';
import { DEFAULT_STUDENTS } from '../data/defaultStudents';

export function StudentEditModal({ isOpen, onClose, currentStudents, onSave, onResetDefault }) {
  const [activeTab, setActiveTab] = useState('TABLE'); // 'TABLE' | 'BATCH'
  const [students, setStudents] = useState(currentStudents);
  const [batchText, setBatchText] = useState('');

  if (!isOpen) return null;

  // 테이블에서 이름 변경
  const handleNameChange = (id, newName) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  // 성별 토글
  const handleGenderToggle = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, gender: s.gender === '남' ? '여' : '남' };
      }
      return s;
    }));
  };

  // 일괄 텍스트 파싱 적용
  // 형식: "1 김민준 남\n2 이서윤 여..." 또는 "김민준\n이서윤..."
  const handleApplyBatchText = () => {
    if (!batchText.trim()) {
      alert('붙여넣을 명단 텍스트를 입력해 주세요.');
      return;
    }

    const lines = batchText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const newStudentList = [...students];

    lines.slice(0, 24).forEach((line, index) => {
      // 공백 또는 탭으로 구분
      const tokens = line.split(/[\t\s]+/);
      let name = '';
      let gender = '남';

      if (tokens.length === 1) {
        name = tokens[0];
      } else if (tokens.length === 2) {
        // "1 김민준" or "김민준 남"
        if (/^\d+$/.test(tokens[0])) {
          name = tokens[1];
        } else {
          name = tokens[0];
          if (tokens[1] === '여' || tokens[1] === 'F' || tokens[1] === '여자') gender = '여';
        }
      } else if (tokens.length >= 3) {
        // "1 김민준 남"
        name = tokens[1];
        if (tokens[2] === '여' || tokens[2] === 'F' || tokens[2] === '여자') gender = '여';
      }

      if (newStudentList[index]) {
        newStudentList[index] = {
          ...newStudentList[index],
          name: name || newStudentList[index].name,
          gender: gender,
        };
      }
    });

    setStudents(newStudentList);
    setActiveTab('TABLE');
    alert(`${lines.length}명의 학생 정보가 테이블에 반영되었습니다. [저장하기]를 눌러 완료하세요.`);
  };

  const handleSave = () => {
    onSave(students);
    onClose();
  };

  const handleReset = () => {
    if (confirm('기본 예시 학생 명단(24명)으로 초기화하시겠습니까?')) {
      onResetDefault();
      setStudents(DEFAULT_STUDENTS);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">학생 명단 관리 (총 24명)</h3>
            <p className="modal-subtitle">좌석 행렬에 표시될 학생 이름과 성별을 설정합니다.</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* 편집 방식 탭 */}
        <div className="modal-tab-bar">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'TABLE' ? 'active' : ''}`}
            onClick={() => setActiveTab('TABLE')}
          >
            <ListOrdered size={15} />
            <span>표로 개별 수정</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'BATCH' ? 'active' : ''}`}
            onClick={() => setActiveTab('BATCH')}
          >
            <FileText size={15} />
            <span>텍스트 일괄 붙여넣기</span>
          </button>
        </div>

        <div className="modal-content-scroll">
          {activeTab === 'TABLE' ? (
            <div className="student-edit-table-wrap">
              <table className="student-edit-table">
                <thead>
                  <tr>
                    <th>좌석 배치</th>
                    <th>번호</th>
                    <th>이름</th>
                    <th>성별</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td className="text-muted text-sm">{s.col}분단 {s.row}열</td>
                      <td className="font-bold">{s.number}번</td>
                      <td>
                        <input
                          type="text"
                          className="table-input"
                          value={s.name}
                          onChange={(e) => handleNameChange(s.id, e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`gender-toggle-btn ${s.gender === '남' ? 'btn-male' : 'btn-female'}`}
                          onClick={() => handleGenderToggle(s.id)}
                          title="클릭하여 남/여 전환"
                        >
                          {s.gender} (전환)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="batch-edit-section">
              <p className="batch-hint">
                엑셀이나 나이스(NEIS), 한글 문서의 학생 명단을 복사하여 아래에 붙여넣으세요.
                <br />
                <strong>입력 예시:</strong>
                <br />
                <code>1 김민준 남</code> 또는 <code>김민준 남</code> 또는 <code>김민준</code> (한 줄에 1명씩 최대 24명)
              </p>
              <textarea
                className="batch-textarea"
                rows={12}
                placeholder="1 김민준 남&#10;2 이서윤 여&#10;3 박도윤 남&#10;..."
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
              />
              <button
                type="button"
                className="action-btn btn-secondary mt-2"
                onClick={handleApplyBatchText}
              >
                테이블에 일괄 반영하기
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="action-btn btn-danger-subtle"
            onClick={handleReset}
            title="기본 24명 데이터로 복원"
          >
            <RotateCcw size={14} />
            <span>기본 명단 복원</span>
          </button>
          <div className="modal-footer-right">
            <button type="button" className="action-btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="button" className="action-btn btn-primary" onClick={handleSave}>
              <Check size={16} />
              <span>저장하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
