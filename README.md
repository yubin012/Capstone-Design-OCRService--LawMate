# LawMate 🧑‍⚖️📄

**LawMate**는 사용자가 직접 작성한 법률 문서를 업로드하면,  
OCR 기술을 활용해 문서 내용을 자동으로 분석하고  
잠재적인 법적 리스크를 AI가 진단 및 가이드해주는 **AI 법률 어시스턴트**입니다.

## 🚀 주요 기능

- 📝 **문서 OCR 분석 기반 리스크 검토**
- 🤖 **AI 기반 법률 상담 및 조언**
- 📄 **법률 문서 자동 작성 지원**
- 📁 **문서 유형에 따른 템플릿 추천**

## 🔍 LawMate만의 차별점

기존 법률 서비스들은 상담 및 템플릿 제공에 초점이 맞춰져 있는 반면,  
**LawMate는 업로드된 문서를 OCR로 직접 분석**하고,  
법적 리스크를 사전에 **자동 진단 및 수정 가이드**까지 제공합니다.

## 🛠️ 기술 스택

- **Frontend**: React, TypeScript
- **Backend**: Spring Boot, Java
- **OCR 엔진**: Tesseract OCR + 커스텀 Preprocessing
- **AI 분석**: OpenAI API 기반 NLP 분석
- **Deployment**: Docker, Nginx, AWS EC2

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

🧪 향후 계획
사용자 문서 히스토리 관리 기능

리스크 분석 정확도 고도화 (LLM 튜닝)

PDF 및 스캔 이미지 대응 OCR 정밀도 향상

👩‍💻 개발자
윤유빈 (Yubin Park) – Backend & AI Engineer

문의: 

