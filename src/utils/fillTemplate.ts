import appealTemplate from '@/templates/appeal_temp';
import complaintTemplate from '@/templates/complaint_temp';
import employmentTemplate from '@/templates/employment_temp';
import leaseTemplate from '@/templates/lease_temp';
import loanTemplate from '@/templates/loan_temp';
import proofTemplate from '@/templates/proof_temp';
import testamentTemplate from '@/templates/testament_temp';

// 더 유연한 타입 선언으로 변경
export const templateMap: Record<string, (variables: any) => string> = {
  CONTENT_PROOF: proofTemplate,
  DEFAMATION_REPORT: complaintTemplate,
  PAYMENT_OBJECTION: appealTemplate,
  LEASE_CONTRACT: leaseTemplate,
  WILL_DOCUMENT: testamentTemplate,
  EMPLOYMENT_CONTRACT: employmentTemplate,
  LOAN_AGREEMENT: loanTemplate,
};


// 백엔드에서 받아온 templateType과 변수들 기반으로 HTML 문자열 생성
export function fillTemplateFromResponse(data: {
  template: string;
  variables: Record<string, any>;
}): string | null {
  const templateKey = data.template.toUpperCase(); // ← 여기서 처리
  const variables = data.variables;
  const templateFn = templateMap[templateKey];

  if (!templateFn) {
    console.warn(`템플릿 키 '${templateKey}'에 해당하는 렌더 함수가 없습니다.`);
    return null;
  }

  let flatVars = variables;

  switch (templateKey) {
    case 'WILL_DOCUMENT':
      flatVars = {
        ...variables,
        피인지자_성명: variables.피인지자?.성명,
        피인지자_주민등록번호: variables.피인지자?.주민등록번호,
        피인지자_주소: variables.피인지자?.주소,
        유언집행자_성명: variables.유언집행자?.성명,
        유언집행자_주민등록번호: variables.유언집행자?.주민등록번호,
        유언집행자_주소: variables.유언집행자?.주소,
      };
      break;

    case 'EMPLOYMENT_CONTRACT':
      flatVars = {
        ...variables,
        사용자_상호: variables.사용자_상호 ?? variables.사용자?.상호,
        사용자_대표자: variables.사용자_대표자 ?? variables.사용자?.대표자,
        사용자_주소: variables.사용자_주소 ?? variables.사용자?.주소,
        사용자_전화번호: variables.사용자_전화번호 ?? variables.사용자?.전화번호,
        근로자_성명: variables.근로자_성명 ?? variables.근로자?.성명,
        근로자_주민번호: variables.근로자_주민번호 ?? variables.근로자?.주민등록번호,
        근로자_주소: variables.근로자_주소 ?? variables.근로자?.주소,
        근로자_전화번호: variables.근로자_전화번호 ?? variables.근로자?.전화번호,
      };
      break;
  }

  return templateFn(flatVars);
}
