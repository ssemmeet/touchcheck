import React, { useState } from 'react';
import { Copy, Check, Users, AlertCircle, Clock, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function UnsubmittedSidebar({ assignment, stats, onToggleStatus }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'MALE' | 'FEMALE' | 'EXEMPTED'
  const [copied, setCopied] = useState(false);

  // 필터링된 미제출자 목록
  const filteredList = React.useMemo(() => {
    if (filter === 'EXEMPTED') {
      return stats.exemptedList;
    }
    let list = stats.unsubmittedList;
    if (filter === 'MALE') {
      list = list.filter(s => s.gender === '남');
    } else if (filter === 'FEMALE') {
      list = list.filter(s => s.gender === '여');
    }
    return list;
  }, [stats, filter]);

  // 클립보드에 미제출 명단 복사
  const handleCopyText = () => {
    const unsubmitted = stats.unsubmittedList;
    const exempted = stats.exemptedList;

    let text = `📋 [${assignment.title}] 제출 확인 현황\n`;
    text += `• 현황: 전체 ${stats.total}명 중 ${stats.submittedCount}명 완료 (${stats.rate}%)\n\n`;

    if (unsubmitted.length === 0) {
      text += `✅ 모든 학생이 제출을 완료했습니다!\n`;
    } else {
      text += `🚨 미제출 학생 (${unsubmitted.length}명):\n`;
      unsubmitted.forEach((s) => {
        text += `- ${s.number}번 ${s.name} (${s.gender})\n`;
      });
    }

    if (exempted.length > 0) {
      text += `\n⚠️ 미실시/면제 학생 (${exempted.length}명):\n`;
      exempted.forEach((s) => {
        text += `- ${s.number}번 ${s.name} (${s.gender})\n`;
      });
    }

    const now = new Date();
    const timeStr = `${now.getHours()}시 ${String(now.getMinutes()).padStart(2, '0')}분`;
    text += `\n(확인 시각: ${timeStr})`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(err => {
      console.error('클립보드 복사 실패', err);
    });
  };

  // 100% 완료 시 축하 효과
  React.useEffect(() => {
    if (stats.total > 0 && stats.submittedCount === stats.total) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [stats.submittedCount, stats.total]);

  return (
    <aside className="unsubmitted-sidebar">
      {/* 사이드바 상단 요약 헤더 */}
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <div className="sidebar-title-wrap">
            <h3 className="sidebar-title">실시간 확인 명단</h3>
            <span className="assignment-badge" title={assignment.title}>{assignment.title}</span>
          </div>
          <button
            type="button"
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyText}
            title="알림장/메신저용 명단 텍스트 복사"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>명단 복사</span>
              </>
            )}
          </button>
        </div>

        {/* 진행률 게이지 바 */}
        <div className="progress-section">
          <div className="progress-text-row">
            <span className="progress-label">제출 진행률</span>
            <span className="progress-ratio">
              <strong>{stats.submittedCount}</strong> / {stats.total}명 ({stats.rate}%)
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${stats.rate === 100 ? 'complete' : ''}`}
              style={{ width: `${stats.rate}%` }}
            />
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            전체 미제출 ({stats.unsubmittedCount})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'MALE' ? 'active' : ''}`}
            onClick={() => setFilter('MALE')}
          >
            남학생 ({stats.maleUnsubmitted})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'FEMALE' ? 'active' : ''}`}
            onClick={() => setFilter('FEMALE')}
          >
            여학생 ({stats.femaleUnsubmitted})
          </button>
          {stats.exemptedCount > 0 && (
            <button
              type="button"
              className={`filter-tab tab-exempted ${filter === 'EXEMPTED' ? 'active' : ''}`}
              onClick={() => setFilter('EXEMPTED')}
            >
              미실시 ({stats.exemptedCount})
            </button>
          )}
        </div>
      </div>

      {/* 명단 리스트 */}
      <div className="sidebar-body">
        {stats.rate === 100 && filter !== 'EXEMPTED' ? (
          <div className="all-complete-banner">
            <CheckCircle size={32} className="complete-icon" />
            <p className="complete-title">모든 학생 제출 완료!</p>
            <span className="complete-desc">24명 전원이 과제를 정상 제출했습니다.</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="empty-list-notice">
            <span>해당 조건의 학생이 없습니다.</span>
          </div>
        ) : (
          <ul className="unsubmitted-list">
            {filteredList.map((student) => (
              <li
                key={student.id}
                className="unsubmitted-item"
                onClick={() => onToggleStatus(student.id)}
                title="클릭 시 즉시 제출 완료 처리"
              >
                <div className="item-left">
                  <span className="item-number">{student.number}번</span>
                  <span className="item-name">{student.name}</span>
                  <span className={`gender-tag tag-sm ${student.gender === '남' ? 'gender-male' : 'gender-female'}`}>
                    {student.gender}
                  </span>
                  <span className="item-seat-pos">
                    ({student.col}분단 {student.row}열)
                  </span>
                </div>
                <button
                  type="button"
                  className="quick-submit-btn"
                  title="제출 완료로 변경"
                >
                  제출 완료
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 하단 가이드 풋터 */}
      <div className="sidebar-footer">
        <span className="footer-tip">
          💡 목록의 학생을 클릭하면 즉시 제출 완료로 변경됩니다.
        </span>
      </div>
    </aside>
  );
}
