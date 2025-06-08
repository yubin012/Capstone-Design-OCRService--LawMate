import appealTemplate from '@/templates/appeal_temp';
import complaintTemplate from '@/templates/complaint_temp';
import employmentTemplate from '@/templates/employment_temp';
import leaseTemplate from '@/templates/lease_temp';
import loanTemplate from '@/templates/loan_temp';
import proofTemplate from '@/templates/proof_temp';
import testamentTemplate from '@/templates/testament_temp';

export const templateMap: Record<string, (variables: Record<string, string>) => string> = {
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
  variables: Record<string, string>;
}): string | null {
  const { template, variables } = data;
  const templateFn = templateMap[template];
  if (!templateFn) {
    console.warn(`템플릿 키 '${template}'에 해당하는 렌더 함수가 없습니다.`);
    return null;
  }
  return templateFn(variables);
}
