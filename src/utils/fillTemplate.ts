// utils/fillTemplate.ts
import loanTemplate from '@/templates/loan_temp';
import leaseTemplate from '@/templates/lease_temp';
import employmentTemplate from '@/templates/employment_temp';
import appealTemplate from '@/templates/appeal_temp';
import complaintTemplate from '@/templates/complaint_temp';
import proofTemplate from '@/templates/proof_temp';
import testamentTemplate from '@/templates/testament_temp';

// 템플릿 이름과 해당 함수 매핑
export const templateMap: Record<string, (variables: Record<string, string>) => string> = {
  loan_temp: loanTemplate,
  lease_temp: leaseTemplate,
  employment_temp: employmentTemplate,
  appeal_temp: appealTemplate,
  complaint_temp: complaintTemplate,
  proof_temp: proofTemplate,
  testament_temp: testamentTemplate,
};

// 백엔드 구조에 맞게 템플릿 키와 변수 객체를 기반으로 렌더링
export function fillTemplateFromResponse(data: {
  template: string;
  variables: Record<string, string>;
}): string | null {
  const { template, variables } = data;
  const templateFn = templateMap[template];
  if (!templateFn) {
    console.warn(`템플릿 키 '${template}'에 해당하는 템플릿 함수가 없습니다.`);
    return null;
  }

  try {
    return templateFn(variables);
  } catch (error) {
    console.error(`템플릿 '${template}' 렌더링 중 오류 발생`, error);
    return null;
  }
}
