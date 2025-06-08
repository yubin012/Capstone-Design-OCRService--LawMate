export function normalizeLoanData(data: any) {
  return {
    채권자_성명: data.채권자,
    채무자_성명: data.채무자,
    차용_일자: data.차용일자,
    차용_금액: data.차용금액,
    변제_기한: data.변제기한,
    이자율: data.이자율,
    채권자_주민번호: data.채권자_주민번호,
    채권자_주소: data.채권자_주소,
    채권자_전화: data.채권자_전화,
    채무자_주민등록번호: data.채무자_주민등록번호,
    채무자_주소: data.채무자_주소,
    채무자_전화: data.채무자_전화,
  };
}