CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,   -- 사용자 고유 ID
    name VARCHAR(255) NOT NULL,                -- 사용자 이름
    email VARCHAR(255) NOT NULL UNIQUE,        -- 사용자 이메일 (중복되지 않음)
    password VARCHAR(255) NOT NULL,            -- 사용자 비밀번호
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 계정 생성일
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 계정 수정일
);

CREATE TABLE Consultation_Record (
    consultation_id INT AUTO_INCREMENT PRIMARY KEY,  -- 상담 기록 고유 ID
    user_id INT,                                     -- 사용자 ID (User 테이블과 관계)
    consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 상담 날짜
    issue_description TEXT,                          -- 사용자가 제공한 법적 문제 설명
    ai_response TEXT,                                -- AI가 제공한 법적 조언
    status VARCHAR(50),                              -- 상담 상태 (진행 중, 종료 등)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 상담 기록 생성일
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 상담 기록 수정일
    FOREIGN KEY (user_id) REFERENCES User(user_id)   -- 사용자와의 외래 키 관계
);

CREATE TABLE Legal_Document (
    document_id INT AUTO_INCREMENT PRIMARY KEY,    -- 문서 고유 ID
    user_id INT,                                   -- 사용자 ID (User 테이블과 관계)
    document_type VARCHAR(255),                     -- 문서 유형 (계약서, 고소장 등)
    content TEXT,                                   -- 문서 내용 (AI가 생성한 문서의 본문)
    status VARCHAR(50),                             -- 문서 작성 상태 (작성 중, 완료 등)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 문서 생성일
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 문서 수정일
    FOREIGN KEY (user_id) REFERENCES User(user_id)  -- 사용자와의 외래 키 관계
);

CREATE TABLE Legal_Template (
    template_id INT AUTO_INCREMENT PRIMARY KEY,    -- 템플릿 고유 ID
    template_name VARCHAR(255) NOT NULL,            -- 템플릿 이름
    template_type VARCHAR(255) NOT NULL,            -- 템플릿 유형 (계약서, 고소장 등)
    content TEXT NOT NULL,                          -- 템플릿 내용
    consultation_id INT,                            -- 상담 기록 ID (Consultation Record 테이블과 관계)
    FOREIGN KEY (consultation_id) REFERENCES Consultation_Record(consultation_id)  -- 상담 기록과의 외래 키 관계
);

CREATE TABLE Risk_Analysis (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,    -- 리스크 분석 고유 ID
    document_id INT,                               -- 법률 문서 ID (Legal Document 테이블과 관계)
    risk_level VARCHAR(50),                        -- 리스크 수준 (낮음, 중간, 높음)
    analysis_result TEXT,                          -- 리스크 분석 결과 (리스크 항목, 불리한 조항 등)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 리스크 분석 결과 생성일
    FOREIGN KEY (document_id) REFERENCES Legal_Document(document_id)  -- 법률 문서와의 외래 키 관계
);

CREATE TABLE Legal_Issue (
    legal_issue_id INT AUTO_INCREMENT PRIMARY KEY, -- 법적 문제 고유 ID
    issue_description TEXT NOT NULL                -- 법적 문제 설명
);

CREATE TABLE Precedent (
    precedent_id INT AUTO_INCREMENT PRIMARY KEY,   -- 판례 고유 ID
    legal_issue_id INT,                             -- 법적 문제와 연결
    related_cases TEXT,                             -- 관련된 법정 사건 목록
    summary TEXT NOT NULL,                          -- 판례 요약
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 판례 생성일
    FOREIGN KEY (legal_issue_id) REFERENCES Legal_Issue(legal_issue_id)  -- 법적 문제와 외래 키 관계
);

CREATE TABLE Mypage (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,    -- 마이페이지 고유 ID
    user_id INT,                                  -- 사용자 ID (User 테이블과 관계)
    consultation_history TEXT,                     -- 상담 기록 목록
    document_history TEXT,                         -- 문서 작성 내역
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 마이페이지 생성일
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마이페이지 수정일
    FOREIGN KEY (user_id) REFERENCES User(user_id) -- 사용자와의 외래 키 관계
);
