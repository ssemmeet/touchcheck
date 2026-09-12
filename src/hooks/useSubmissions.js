import { useState, useEffect, useMemo } from 'react';
import { DEFAULT_STUDENTS, DEFAULT_ASSIGNMENTS, SUBMISSION_STATUS } from '../data/defaultStudents';

const STORAGE_KEY = 'STUDENT_SUBMISSION_APP_V1';

export function useSubmissions() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [assignments, setAssignments] = useState(DEFAULT_ASSIGNMENTS);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(DEFAULT_ASSIGNMENTS[0].id);
  const [submissions, setSubmissions] = useState({
    [DEFAULT_ASSIGNMENTS[0].id]: {
      s1: SUBMISSION_STATUS.SUBMITTED,
      s2: SUBMISSION_STATUS.SUBMITTED,
      s3: SUBMISSION_STATUS.SUBMITTED,
      s7: SUBMISSION_STATUS.SUBMITTED,
      s8: SUBMISSION_STATUS.SUBMITTED,
      s13: SUBMISSION_STATUS.SUBMITTED,
      s14: SUBMISSION_STATUS.SUBMITTED,
      s19: SUBMISSION_STATUS.SUBMITTED,
      s20: SUBMISSION_STATUS.SUBMITTED,
    }
  });
  // 'TEACHER': 교탁에서 학생들을 내려다보는 시점 (1행이 교탁 바로 앞)
  // 'STUDENT': 칠판을 바라보는 시점 (1분단이 좌측 or 4분단이 우측)
  const [viewMode, setViewMode] = useState('TEACHER');

  // 'SEAT': 좌석 배치표 (행으로 1~6분단, 열로 1~4번)
  // 'NUMBER': 번호 순 (1열 남자, 2열 여자)
  const [displayMode, setDisplayMode] = useState('SEAT');

  // 로컬스토리지에서 초기 데이터 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.students && Array.isArray(parsed.students)) setStudents(parsed.students);
        if (parsed.assignments && Array.isArray(parsed.assignments)) setAssignments(parsed.assignments);
        if (parsed.currentAssignmentId) setCurrentAssignmentId(parsed.currentAssignmentId);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.viewMode) setViewMode(parsed.viewMode);
        if (parsed.displayMode) setDisplayMode(parsed.displayMode);
      }
    } catch (e) {
      console.error('LocalStorage 로드 실패, 기본값을 사용합니다.', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 상태 변경 시 로컬스토리지 자동 저장
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave = {
        students,
        assignments,
        currentAssignmentId,
        submissions,
        viewMode,
        displayMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('LocalStorage 저장 실패', e);
    }
  }, [students, assignments, currentAssignmentId, submissions, viewMode, displayMode, isLoaded]);

  // 현재 과제의 제출 맵
  const currentSubmissions = useMemo(() => {
    return submissions[currentAssignmentId] || {};
  }, [submissions, currentAssignmentId]);

  // 학생별 현재 상태 구하기
  const getStudentStatus = (studentId) => {
    return currentSubmissions[studentId] || SUBMISSION_STATUS.UNSUBMITTED;
  };

  // 단일 토글 (미제출 -> 제출 완료 -> 미제출)
  const toggleStatus = (studentId) => {
    const current = getStudentStatus(studentId);
    const next = current === SUBMISSION_STATUS.SUBMITTED
      ? SUBMISSION_STATUS.UNSUBMITTED
      : SUBMISSION_STATUS.SUBMITTED;

    setSubmissions(prev => ({
      ...prev,
      [currentAssignmentId]: {
        ...(prev[currentAssignmentId] || {}),
        [studentId]: next
      }
    }));
  };

  // 직접 상태 설정 (미실시/면제 등)
  const setStudentStatus = (studentId, status) => {
    setSubmissions(prev => ({
      ...prev,
      [currentAssignmentId]: {
        ...(prev[currentAssignmentId] || {}),
        [studentId]: status
      }
    }));
  };

  // 일괄 상태 설정 (전체 완료 or 전체 초기화)
  const batchSetStatus = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });

    setSubmissions(prev => ({
      ...prev,
      [currentAssignmentId]: updated
    }));
  };

  // 과제 추가
  const addAssignment = (title) => {
    const newId = 'asg-' + Date.now();
    const newAssignment = {
      id: newId,
      title: title.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAssignments(prev => [newAssignment, ...prev]);
    setCurrentAssignmentId(newId);
    setSubmissions(prev => ({
      ...prev,
      [newId]: {}
    }));
  };

  // 과제 삭제
  const deleteAssignment = (id) => {
    if (assignments.length <= 1) {
      alert('최소 1개의 과제는 유지되어야 합니다.');
      return;
    }
    setAssignments(prev => prev.filter(a => a.id !== id));
    if (currentAssignmentId === id) {
      const remaining = assignments.filter(a => a.id !== id);
      setCurrentAssignmentId(remaining[0].id);
    }
    setSubmissions(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // 학생 명단 저장
  const updateStudents = (newStudents) => {
    setStudents(newStudents);
  };

  // 기본 명단으로 초기화
  const resetToDefaultStudents = () => {
    setStudents(DEFAULT_STUDENTS);
  };

  // 통계 계산
  const stats = useMemo(() => {
    let submittedCount = 0;
    let unsubmittedCount = 0;
    let exemptedCount = 0;

    let maleTotal = 0;
    let maleSubmitted = 0;
    let femaleTotal = 0;
    let femaleSubmitted = 0;

    const unsubmittedList = [];
    const exemptedList = [];
    const submittedList = [];

    students.forEach(s => {
      const st = currentSubmissions[s.id] || SUBMISSION_STATUS.UNSUBMITTED;
      if (s.gender === '남') maleTotal++;
      else femaleTotal++;

      if (st === SUBMISSION_STATUS.SUBMITTED) {
        submittedCount++;
        submittedList.push(s);
        if (s.gender === '남') maleSubmitted++;
        else femaleSubmitted++;
      } else if (st === SUBMISSION_STATUS.EXEMPTED) {
        exemptedCount++;
        exemptedList.push(s);
      } else {
        unsubmittedCount++;
        unsubmittedList.push(s);
      }
    });

    const total = students.length;
    const rate = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

    return {
      total,
      submittedCount,
      unsubmittedCount,
      exemptedCount,
      rate,
      maleTotal,
      maleSubmitted,
      maleUnsubmitted: maleTotal - maleSubmitted,
      femaleTotal,
      femaleSubmitted,
      femaleUnsubmitted: femaleTotal - femaleSubmitted,
      unsubmittedList,
      exemptedList,
      submittedList,
    };
  }, [students, currentSubmissions]);

  const currentAssignment = useMemo(() => {
    return assignments.find(a => a.id === currentAssignmentId) || assignments[0];
  }, [assignments, currentAssignmentId]);

  return {
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
  };
}
