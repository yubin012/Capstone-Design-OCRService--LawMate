const testamentTemplate = ({
  testatorName,
  testatorBirth,
  testatorAddress,
  heir1Name,
  heir1Id,
  heir1Address,
  recognizedName,
  recognizedId,
  recognizedAddress,
  inheritanceDetails,
  executorName,
  executorId,
  executorAddress,
  dateYear,
  dateMonth,
  dateDay,
}: {
  testatorName: string;
  testatorBirth: string;
  testatorAddress: string;
  heir1Name: string;
  heir1Id: string;
  heir1Address: string;
  recognizedName: string;
  recognizedId: string;
  recognizedAddress: string;
  inheritanceDetails: string;
  executorName: string;
  executorId: string;
  executorAddress: string;
  dateYear: string;
  dateMonth: string;
  dateDay: string;
}) => `
<h2 style="text-align: center;">유언장</h2><br/>

<p><strong>유언자</strong> ${testatorName}</p>
<p>생년월일 (${testatorBirth})</p>
<p>주소: ${testatorAddress}</p><br/>

<p><strong>상속자1</strong></p>
<p>성명: ${heir1Name}</p>
<p>주민등록번호: ${heir1Id}</p>
<p>주소: ${heir1Address}</p><br/>

<p><strong>유언사항</strong></p>
<p>나는 위 사람들에게 아래와 같이 유언한다.</p><br/>

<p>1. 유언자는 아래의 자를 인지한다.</p>
<p>가. 피인지자</p>
<ul>
  <li>성명: ${recognizedName}</li>
  <li>주민등록번호: ${recognizedId}</li>
  <li>주소: ${recognizedAddress}</li>
</ul>

<p>2. 유언자는 본인의 재산을 아래와 같이 분배한다.</p>
<p>가. 유언자의 ${heir1Name}의 상속지분은 다음과 같다.</p>
<p>${inheritanceDetails}</p>

<p>3. 가족 묘의 성묘나 제사 등은 상속인이 협력하여 진행한다.</p>
<p>4. 제사는 간소화할 것</p>

<p>5. 아래와 같은 사람을 유언집행자로 정하고, 상속 재산의 소유권 이전등기 등의 유언 집행을 하기로 한다.</p>
<ul>
  <li>성명: ${executorName}</li>
  <li>주민등록번호: ${executorId}</li>
  <li>주소: ${executorAddress}</li>
</ul><br/>

<p style="text-align: right;">${dateYear}년 ${dateMonth}월 ${dateDay}일</p><br/>
<p style="text-align: right;">유언자 : ${testatorName} (인)</p>
`;

export default testamentTemplate;
