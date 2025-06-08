package com.lawmate.lawmate.Template;

import java.util.List;

public enum TemplateType {
    CONTENT_PROOF("내용증명", List.of(
            "발신인_성명", "발신인_주소", "발신인_전화번호",
            "수신인_성명", "수신인_주소", "수신인_전화번호",
            "제목", "금액", "대여일자", "미지급금액",
            "변제기한", "예금주", "은행명", "계좌번호", "작성일")),

    DEFAMATION_REPORT("고소장(명예훼손)", List.of(
            "고소인_성명", "피고소인_성명", "사건_내용", "피해_정도", "고소_이유", "작성일")),

    PAYMENT_OBJECTION("지급명령 이의신청서", List.of(
            "신청인_성명", "피신청인_성명", "사건번호", "이의_사유", "신청_날짜", "작성일")),

    LEASE_CONTRACT("부동산 임대차 계약서", List.of(
            "임대인_성명", "임차인_성명",
            "토지_지목", "토지_면적",
            "건물_구조용도", "건물_면적",
            "임대부분_면적",
            "보증금", "계약금", "중도금1", "중도금2", "잔금", "차임",
            "임대차계좌_은행", "임대차계좌_계좌번호",
            "인도일자", "계약만료일자",
            "수리필요여부", "특약사항",
            "작성일")),

    WILL_DOCUMENT("유언장", List.of(
            "유언자_성명", "유언자_생년월일", "유언자_주소",
            "피인지자_성명", "피인지자_주민등록번호", "피인지자_주소",
            "상속인_성명", "상속_재산목록",
            "집행자_성명", "집행자_주민등록번호", "집행자_주소",
            "작성일")),

    EMPLOYMENT_CONTRACT("근로계약서", List.of(
            "사용자_상호", "사용자_대표자", "사용자_주소", "사용자_전화번호",
            "근로자_성명", "근로자_주민등록번호", "근로자_주소", "근로자_전화번호",
            "계약시작일", "계약종료일",
            "근무장소", "근무시작시간", "근무종료시간", "휴게시간", "근무요일", "유급휴일",
            "임금", "지급일", "지급은행", "지급계좌번호",
            "4대보험_가입여부",
            "작성일")),
    LOAN_AGREEMENT("금전차용증", List.of("채권자_성명", "채권자_주민등록번호", "채권자_주소", "채권자_전화번호", "채무자_성명", "채무자_주민등록번호", "채무자_주소",
            "채무자_전화번호", "차용일자", "차용금액", "변제기한", "이자율", "작성일"));

    private final String templateName;
    private final List<String> requiredFields;

    TemplateType(String templateName, List<String> requiredFields) {
        this.templateName = templateName;
        this.requiredFields = requiredFields;
    }

    // 실제 사용자와 DB에서 사용하는 템플릿 이름
    public String getTemplateName() {
        return templateName;
    }

    // 해당 템플릿이 요구하는 정보 목록
    public List<String> getRequiredFields() {
        return requiredFields;
    }

    // 템플릿 이름을 기반으로 enum을 반환하는 메서드 (DB-코드 연결 고리 역할)
    public static TemplateType fromName(String name) {
        for (TemplateType type : values()) {
            if (type.templateName.equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown template name: " + name);
    }
}
