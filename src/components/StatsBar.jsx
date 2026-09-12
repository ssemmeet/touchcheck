import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Users, Sparkles } from 'lucide-react';

export function StatsBar({ stats }) {
  return (
    <div className="stats-bar-grid">
      {/* 전체 제출률 카드 */}
      <div className="stat-card stat-card-main">
        <div className="stat-icon-wrapper icon-emerald">
          <CheckCircle2 size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">전체 제출 완료</span>
          <div className="stat-value-group">
            <span className="stat-value">{stats.submittedCount}</span>
            <span className="stat-total">/ {stats.total}명</span>
            <span className="stat-badge badge-rate">{stats.rate}%</span>
          </div>
        </div>
      </div>

      {/* 남학생 현황 카드 */}
      <div className="stat-card">
        <div className="stat-icon-wrapper icon-blue">
          <span className="gender-symbol">남</span>
        </div>
        <div className="stat-content">
          <span className="stat-label">남학생 제출</span>
          <div className="stat-value-group">
            <span className="stat-value">{stats.maleSubmitted}</span>
            <span className="stat-total">/ {stats.maleTotal}명</span>
            <span className="stat-subtext">
              ({stats.maleUnsubmitted}명 미제출)
            </span>
          </div>
        </div>
      </div>

      {/* 여학생 현황 카드 */}
      <div className="stat-card">
        <div className="stat-icon-wrapper icon-rose">
          <span className="gender-symbol">여</span>
        </div>
        <div className="stat-content">
          <span className="stat-label">여학생 제출</span>
          <div className="stat-value-group">
            <span className="stat-value">{stats.femaleSubmitted}</span>
            <span className="stat-total">/ {stats.femaleTotal}명</span>
            <span className="stat-subtext">
              ({stats.femaleUnsubmitted}명 미제출)
            </span>
          </div>
        </div>
      </div>

      {/* 미제출 대기 카드 */}
      <div className="stat-card stat-card-alert">
        <div className="stat-icon-wrapper icon-amber">
          <Clock size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">미제출 인원</span>
          <div className="stat-value-group">
            <span className={`stat-value ${stats.unsubmittedCount > 0 ? 'text-amber-dark' : 'text-emerald'}`}>
              {stats.unsubmittedCount}
            </span>
            <span className="stat-total">명 남음</span>
          </div>
        </div>
      </div>

      {/* 미실시/면제 카드 (있는 경우) */}
      {stats.exemptedCount > 0 && (
        <div className="stat-card stat-card-exempted">
          <div className="stat-icon-wrapper icon-neutral">
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">미실시 / 면제</span>
            <div className="stat-value-group">
              <span className="stat-value">{stats.exemptedCount}</span>
              <span className="stat-total">명</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
