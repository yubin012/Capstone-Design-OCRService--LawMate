# LawMate 🧑‍⚖️📄
OCR 기반 법률 문서 분석 및 AI 기반 상담 자동화 플랫폼

<img width="796" height="874" alt="image" src="https://github.com/user-attachments/assets/0703217f-e032-4faa-a02b-b14fa0fb0026" />

**LawMate**는 사용자가 작성한 법률 문서를 업로드하면,  
OCR 기술을 활용해 문서 내용을 자동으로 분석하고  
잠재적인 법적 리스크를 AI가 진단 및 가이드해주는 **AI 법률 어시스턴트**입니다.  

---

## 🚀 주요 기능

- 📝 **문서 OCR 분석 기반 리스크 검토**  
  - PDF, Word, 스캔 이미지 문서 지원  
  - 조항별 유리/불리 및 위험 요인 자동 분석

- 🤖 **AI 기반 법률 상담 및 조언**  
  - 사용자가 입력한 법적 상황에 대한 GPT 기반 자동 조언 제공  
  - 유사 판례 검색 및 추천

- 📄 **법률 문서 자동 작성 지원**  
  - 템플릿 기반 문서 자동 완성  
  - 조항 추천 및 수정 가이드 포함

- 📁 **문서 유형별 템플릿 추천**  
  - 계약서, 진정서, 탄원서 등 다양한 법률 문서 템플릿 제공

---

## 🔍 LawMate만의 차별점

기존 법률 서비스는 단순 상담이나 템플릿 제공 중심인 반면,  
**LawMate는 업로드된 문서를 직접 분석(OCR)**하여  
법적 리스크를 사전에 **자동 진단 및 수정 가이드**까지 제공합니다.

---

## 🛠️ 기술 스택

- **Frontend**: React, TypeScript, TailwindCSS  
- **Backend**: Spring Boot, Java, REST API, JWT 인증  
- **OCR 엔진**: Tesseract OCR + 커스텀 Preprocessing (Google Vision API)
- **AI 분석**: OpenAI API 기반 NLP, KoBERT, KoAlpaca-PolyGlot  
- **Database**: MySQL  
- **Deployment**: Docker, AWS EC2, RDS

---

## 📊 시스템 구조

### ERD
<img width="940" height="488" alt="image" src="https://github.com/user-attachments/assets/868534f8-dc2d-4346-b031-d8fb997c9ac2" />

### 기능 흐름도
<img width="1163" height="1067" alt="image" src="https://github.com/user-attachments/assets/032dcfce-d30e-4d41-8ccd-7fbba80ef99d" />

---
## 테스트 결과
- Swagger/Postman API 테스트 완료
 <img width="940" height="951" alt="image" src="https://github.com/user-attachments/assets/c753693b-08e6-4d57-9854-80cce5c257db" />
 <img width="940" height="517" alt="image" src="https://github.com/user-attachments/assets/f0e86489-d88d-4f33-b662-03153a2021ce" />
---
## 📁 모노레포 구조
```lawmate/
├─ lawmate-front/ # React + TS 프론트엔드
├─ lawmate-back/ # Spring Boot 백엔드 (JWT, DB, 템플릿/문서 자동화)
├─ lawmate-ai/ # FastAPI AI 서버 (OCR/NLP/프롬프트/판례검색)
├─ deploy/ # docker-compose, Nginx, 샘플 env
└─ docs/ # ERD, 아키텍처, API 스펙, 스크린샷```

## 📦 설치 및 실행 방법

```bash
# 클론
git clone https://github.com/your-id/lawmate.git
cd lawmate

# 백엔드 실행
cd lawmate-back
./gradlew bootRun

# 프론트엔드 실행
cd ../lawmate-front
npm install
npm start
