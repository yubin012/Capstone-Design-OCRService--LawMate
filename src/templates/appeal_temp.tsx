const appealTemplate = ({
  수신_법원,
  사건_번호,
  채권자_성명,
  채권자_주소,
  채무자_성명,
  채무자_주소,
  송달_일자,
  이의_사유,
  작성_연도,
  작성_월,
  작성_일,
  신청인_성명,
}: {
  수신_법원: string;
  사건_번호: string;
  채권자_성명: string;
  채권자_주소: string;
  채무자_성명: string;
  채무자_주소: string;
  송달_일자: string;
  이의_사유: string;
  작성_연도: string;
  작성_월: string;
  작성_일: string;
  신청인_성명: string;
}) => `
  <h2 style="text-align: center;">지급명령에 대한 이의신청서</h2>
  <p><strong>수신 법원:</strong> ${수신_법원}</p>
  <p><strong>사건 번호:</strong> ${사건_번호}</p>
  <hr />
  <p><strong>채권자:</strong> ${채권자_성명}</p>
  <p><strong>주소:</strong> ${채권자_주소}</p>
  <br />
  <p><strong>채무자:</strong> ${채무자_성명}</p>
  <p><strong>주소:</strong> ${채무자_주소}</p>
  <br />
  <p><strong>송달일자:</strong> ${송달_일자}</p>
  <p><strong>이의 사유:</strong></p>
  <p>${이의_사유}</p>
  <br />
  <p style="text-align: right;">
    ${작성_연도}년 ${작성_월}월 ${작성_일}일<br />
    신청인: ${신청인_성명}
  </p>
`;

export default appealTemplate;
