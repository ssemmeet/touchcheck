import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

const QUICK_TAGS = [
  '수학 익힘책',
  '국어 독서록',
  '일기장 검사',
  '가정통신문 회신서',
  '미술 준비물',
  '수행평가 보고서',
  '학습지 프린트',
  '방과후 신청서',
];

export function NewAssignmentModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('과제 또는 점검 항목 제목을 입력해 주세요.');
      return;
    }
    onAdd(title);
    setTitle('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">새 점검 과제 추가</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="assignment-title-input" className="form-label">
              과제 또는 점검 항목명
            </label>
            <input
              id="assignment-title-input"
              type="text"
              className="form-input"
              placeholder="예: 수학 익힘책 50~53쪽, 일기장"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="quick-tags-section">
            <span className="quick-tags-label">자주 쓰는 학급 과제 빠른 선택:</span>
            <div className="quick-tags-list">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="quick-tag-chip"
                  onClick={() => setTitle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="action-btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="action-btn btn-primary">
              <Check size={16} />
              <span>추가하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
