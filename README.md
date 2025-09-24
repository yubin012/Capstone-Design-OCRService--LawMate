# LawMate 🧑‍⚖️📄
OCR 기반 법률 문서 분석 및 AI 상담 자동화 플랫폼

<img width="796" height="874" alt="image" src="https://github.com/user-attachments/assets/0703217f-e032-4faa-a02b-b14fa0fb0026" />

---

## 📌 프로젝트 개요
**LawMate**는 법률 지식이 부족한 개인·자영업자·소상공인 등 **법률 취약 계층**에게  
AI와 OCR을 통해 **쉽고 저렴하게 법률 문서를 작성·검토·상담**할 수 있는 서비스를 제공합니다.

- 🤖 자연어 기반 AI 상담
- 📝 문서 리스크 자동 진단 및 수정 가이드
- 📄 계약서/진정서 등 템플릿 자동 추천

---

## 🚩 문제 정의 & 차별점
- 일반인 계약서 작성 시 **불리한 조항 서명, 중요 항목 누락** 발생
- 현행 법률 서비스는 **변호사 연결/단순 템플릿 제공**에 그침
- **LawMate는 업로드 문서를 직접 분석(OCR)** 후  
  **위험요소 진단 + 개선안 제시 + 문서 자동 생성**까지 지원

---

## 🚀 주요 기능
- 📝 **문서 리스크 분석**: PDF/Word/스캔 이미지 업로드 → 조항별 유리/불리 판정  
- 🤖 **AI 상담 챗봇**: 자연어 입력 → GPT 기반 법률 조언 + 유사 판례 검색  
- 📄 **문서 자동 작성**: 계약서, 탄원서 등 템플릿 기반 초안 생성  
- 📁 **템플릿 추천**: 문서 유형별 맞춤 양식 제공  

---

## 🛠 기술 스택
- **Frontend**: React, TypeScript, TailwindCSS  
- **Backend**: Spring Boot (JWT 인증, REST API) + FastAPI  
- **OCR**: Google Vision API, Tesseract OCR  
- **AI 분석**: OpenAI GPT, KoBERT, KoAlpaca-PolyGlot, KoSBERT+FAISS  
- **DB/Infra**: MySQL, Docker, AWS EC2 & RDS  

---

## 📊 시스템 구조
### 아키텍처
- **법률 상담**: KoBERT 분류 → GPT 프롬프트 응답 → 템플릿 추천  
- **문서 분석**: OCR 추출 → KLUE-BERT 리스크 탐지 → 유사 판례 검색 → 가이드 제공  

### AI 모델
- **KLUE-BERT**: 조항 유리/불리 분류 (F1 0.98+)  
- **KoSBERT + FAISS**: 판례 임베딩 → 상위 k 유사 판례 검색  
- **KoAlpaca-PolyGlot + LoRA**: 리스크/수정 가이드 생성  

> 데이터셋/체크포인트는 `lawmate-ai/config.yaml` 또는 `.env`에서 관리  
> 최초 실행 시 **판례 인덱스 자동 캐싱** (초기 로딩 시간 소요)

---

## ✅ 테스트 결과
- Swagger & Postman 기반 API 테스트 완료
- 주요 기능(문서 OCR, 챗봇, PDF 출력) 시연 검증

<img width="940" height="517" alt="image" src="https://github.com/user-attachments/assets/f0e86489-d88d-4f33-b662-03153a2021ce" />

---

## 🔒 보안 & 개인정보
- 문서는 **일시 저장 후 처리 완료 시 익명화/삭제**  
- JWT 인증/인가 및 민감 데이터 암호화 저장  
- ⚠️ 본 서비스는 **법률 자문 대체 불가** (참고용)

---

## 🧯 트러블슈팅
- **OCR 인식 저조** → 300dpi 이상 스캔, 흑백 보정  
- **AI 서버 지연** → 로컬 Vision API 사용, 캐시 확인  
- **CORS 오류** → 백엔드 `CorsConfig`, 프론트 API URL 점검  
- **PDF 품질 저하** → `html2canvas` 옵션 조정  

---

## ⚠️ 주의사항
LawMate는 교육용 캡스톤디자인 프로젝트로,  
제공되는 결과는 **참고용**이며 최종 법적 책임은 사용자에게 있습니다.
