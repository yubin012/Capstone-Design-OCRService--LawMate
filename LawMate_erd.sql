CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,   -- 사용자 고유 ID
    name VARCHAR(255) NOT NULL,                -- 사용자 이름
    email VARCHAR(255) NOT NULL UNIQUE,        -- 사용자 이메일 (중복되지 않음)
    password VARCHAR(255) NOT NULL,            -- 사용자 비밀번호
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 계정 생성일
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 계정 수정일
);


-- 법률 문서 템플릿 테이블
CREATE TABLE Legal_Template (
    template_id INT AUTO_INCREMENT PRIMARY KEY,     -- 템플릿 고유 ID
    template_name VARCHAR(255) NOT NULL,            -- 템플릿 유형(이름름) (계약서, 고소장 등)
    template_json JSON                              -- 제공할 템플릿
);

-- 상담 기록 테이블
CREATE TABLE Consultation_Record (
    consultation_id INT AUTO_INCREMENT PRIMARY KEY,  -- 상담 기록 고유 ID
    user_id INT,                                     -- 사용자 ID (User 테이블과 관계)
    issue BIGINT,                                    -- NLP로 분류된 법률 이슈
    raw_description TEXT,                            -- 사용자가 처음 입력한 내용
    summary TEXT,                                    -- GPT 요약 결과
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 상담 기록 생성일
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 상담 기록 수정일
    FOREIGN KEY (user_id) REFERENCES User(user_id)   -- 사용자와의 외래 키 관계

);

-- 생성된 법률 문서 테이블
CREATE TABLE Legal_Document (
    document_id INT AUTO_INCREMENT PRIMARY KEY,    -- 문서 고유 ID
    user_id INT,                                   -- 사용자 ID (User 테이블과 관계)
    consultation_id BIGINT,                         -- 상담 기반일 경우만
    template_id INT,                                -- 어떤 템플릿을 기반으로 생성했는지
    title VARCHAR(255),                             -- 사용자 문서 제목
    source_type ENUM('user_uploaded', 'ai_generated') NOT NULL,
    content LONGTEXT,                               -- 문서 내용 (AI가 생성한 문서의 본문)
    file_path VARCHAR(285),                         -- PDF 등 파일 경로
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 문서 생성일
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 문서 수정일


    FOREIGN KEY (user_id) REFERENCES User(user_id),  -- 사용자와의 외래 키 관계
    FOREIGN KEY (consultation_id) REFERENCES Consultation_Record(id),
    FOREIGN KEY (template_id) REFERENCES Legal_Template(template_id)
);


-- 문서 리스크 분석 결과 테이블
CREATE TABLE Risk_Analysis (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,    -- 리스크 분석 고유 ID
    document_id INT,                               -- 법률 문서 ID (Legal Document 테이블과 관계)
    risk_level VARCHAR(50),                        -- 리스크 수준 (낮음, 중간, 높음)
    analysis_result TEXT,                          -- 리스크 분석 결과 (리스크 항목, 불리한 조항 등)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 리스크 분석 결과 생성일
    FOREIGN KEY (document_id) REFERENCES Legal_Document(document_id)  -- 법률 문서와의 외래 키 관계
);



