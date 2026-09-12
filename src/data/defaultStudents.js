// 기본 24명 학생 데이터
// - 좌석 배치표: 행으로 1~6분단 (row: 1~6), 열로 1~4번 (col: 1~4)
// - 번호 순: 1열 남자(12명), 2열 여자(12명)
export const DEFAULT_STUDENTS = [
  // 1분단 (row 1)
  { id: 's1', number: 1, name: '김민준', gender: '남', row: 1, col: 1 },
  { id: 's2', number: 2, name: '이서윤', gender: '여', row: 1, col: 2 },
  { id: 's3', number: 3, name: '박도윤', gender: '남', row: 1, col: 3 },
  { id: 's4', number: 4, name: '최서현', gender: '여', row: 1, col: 4 },

  // 2분단 (row 2)
  { id: 's5', number: 5, name: '정시우', gender: '남', row: 2, col: 1 },
  { id: 's6', number: 6, name: '강하은', gender: '여', row: 2, col: 2 },
  { id: 's7', number: 7, name: '조하준', gender: '남', row: 2, col: 3 },
  { id: 's8', number: 8, name: '윤지아', gender: '여', row: 2, col: 4 },

  // 3분단 (row 3)
  { id: 's9', number: 9, name: '장지호', gender: '남', row: 3, col: 1 },
  { id: 's10', number: 10, name: '임수아', gender: '여', row: 3, col: 2 },
  { id: 's11', number: 11, name: '한선우', gender: '남', row: 3, col: 3 },
  { id: 's12', number: 12, name: '오서은', gender: '여', row: 3, col: 4 },

  // 4분단 (row 4)
  { id: 's13', number: 13, name: '권우진', gender: '남', row: 4, col: 1 },
  { id: 's14', number: 14, name: '송예린', gender: '여', row: 4, col: 2 },
  { id: 's15', number: 15, name: '황은우', gender: '남', row: 4, col: 3 },
  { id: 's16', number: 16, name: '안유주', gender: '여', row: 4, col: 4 },

  // 5분단 (row 5)
  { id: 's17', number: 17, name: '홍유준', gender: '남', row: 5, col: 1 },
  { id: 's18', number: 18, name: '배채원', gender: '여', row: 5, col: 2 },
  { id: 's19', number: 19, name: '신민재', gender: '남', row: 5, col: 3 },
  { id: 's20', number: 20, name: '백하린', gender: '여', row: 5, col: 4 },

  // 6분단 (row 6)
  { id: 's21', number: 21, name: '노준우', gender: '남', row: 6, col: 1 },
  { id: 's22', number: 22, name: '문채은', gender: '여', row: 6, col: 2 },
  { id: 's23', number: 23, name: '유승우', gender: '남', row: 6, col: 3 },
  { id: 's24', number: 24, name: '고다은', gender: '여', row: 6, col: 4 },
];

export const DEFAULT_ASSIGNMENTS = [
  { id: 'asg-1', title: '수학 익힘책 42~45쪽', createdAt: '2026-09-12' },
  { id: 'asg-2', title: '가정통신문 회신서 (현장체험학습)', createdAt: '2026-09-12' },
  { id: 'asg-3', title: '국어 독서록 & 일기장', createdAt: '2026-09-12' },
];

export const SUBMISSION_STATUS = {
  UNSUBMITTED: 'UNSUBMITTED', // 미제출
  SUBMITTED: 'SUBMITTED',     // 제출 완료
  EXEMPTED: 'EXEMPTED',       // 미실시 / 결석 / 면제
};
