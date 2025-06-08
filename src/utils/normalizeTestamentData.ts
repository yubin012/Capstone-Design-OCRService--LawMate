// utils/normalizeTestamentData

export function normalizeTestamentData(data: any) {
  return {
    유언자_성명: data.유언자,
    유언자_생년월일: data.생년월일,
    유언자_주소: data.주소,
    피인지자_성명: data.피인지자?.성명,
    피인지자_주민등록번호: data.피인지자?.주민등록번호,
    피인지자_주소: data.피인지자?.주소,
    상속인_성명: Array.isArray(data.상속인) ? data.상속인.join(', ') : data.상속인,
    상속_재산목록: Array.isArray(data.상속재산) ? data.상속재산.join(', ') : data.상속재산,
    집행자_성명: data.유언집행자?.성명,
    집행자_주민등록번호: data.유언집행자?.주민등록번호,
    집행자_주소: data.유언집행자?.주소,
    작성일: data.작성일,
  };
}
