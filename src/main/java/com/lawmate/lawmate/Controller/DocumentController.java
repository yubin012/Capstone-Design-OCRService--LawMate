package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.DTO.*;
import com.lawmate.lawmate.Domain.GptInfo;
import com.lawmate.lawmate.Repository.GptInfoRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Comparator;
import java.util.List;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/document")
public class DocumentController {

    private final GptInfoRepository gptInfoRepository;

    /**
     * GPT가 생성한 JSON 문서를 조회 (문서 자동 완성 용도)
     */
    @GetMapping("/json/{consultationId}")
    @Operation(summary = "자동 생성된 JSON 문서 조회", description = "문서 편집용 HTML에 바인딩하기 위해 GPT가 생성한 JSON 문서를 반환합니다.")
    public ResponseEntity<String> getDocumentJson(@PathVariable Long consultationId) {

        List<GptInfo> gptInfos = gptInfoRepository.findAllByConsultation_Id(consultationId);

        if (gptInfos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // createdAt 기준으로 최신 GptInfo 선택
        GptInfo latest = gptInfos.stream()
                .max(Comparator.comparing(GptInfo::getCreatedAt))
                .orElseThrow(() -> new IllegalStateException("GPT 정보 정렬 오류"));

        return ResponseEntity.ok(latest.getDocument_summary());
    }

    /**
     * 사용자가 편집 완료 후 PDF 파일 업로드 (문서 저장)
     */
    @PostMapping("/pdf/{consultationId}")
    @Operation(summary = "수정된 문서를 PDF로 저장", description = "사용자가 편집한 문서를 PDF로 변환한 뒤 업로드하면 저장합니다.")
    public ResponseEntity<String> uploadDocumentPdf(
            @PathVariable Long consultationId,
            @RequestParam("file") MultipartFile pdfFile) {

        // TODO: 파일 저장 경로 설정 및 실제 저장 (예: S3, 로컬, DB 등)
        try {
            byte[] fileBytes = pdfFile.getBytes();
            String filename = pdfFile.getOriginalFilename();

            // 예: DB 저장, 파일 시스템 저장, 로그 출력 등
            System.out.println("PDF 저장됨: " + filename + " (크기: " + fileBytes.length + " 바이트)");

            return ResponseEntity.ok("PDF 업로드 성공");

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("PDF 저장 실패: " + e.getMessage());
        }
    }
}
