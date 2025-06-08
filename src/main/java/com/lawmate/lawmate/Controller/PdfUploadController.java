package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.Converter.PdfToImageConverter;
import com.lawmate.lawmate.Service.VisionOcrService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pdf")
public class PdfUploadController {

    @Operation(summary = "PDF 파일 업로드 후 OCR 처리 및 FastAPI 연동", description = """
            1. 클라이언트가 PDF 파일을 업로드합니다.\n
            2. 서버는 PDF를 이미지로 변환하고, 각 페이지에 대해 OCR을 수행합니다.\n
            3. 추출된 전체 텍스트를 FastAPI 서버로 전송하여 분석을 수행합니다.\n
            4. FastAPI의 응답 결과를 클라이언트에게 반환합니다.
            """)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 OCR 처리 및 FastAPI 결과 반환"),
            @ApiResponse(responseCode = "500", description = "파일 처리 또는 OCR 과정 중 오류 발생")
    })
    @PostMapping(value = "/ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> handlePdfUpload(
            @Parameter(description = "분석할 PDF 파일", required = true) @RequestParam("file") MultipartFile file) {
        try {
            // 1. 임시 PDF 저장
            File tempPdf = File.createTempFile("uploaded_", ".pdf");
            file.transferTo(tempPdf);

            // 2. PDF → 이미지 변환
            List<File> imageFiles = PdfToImageConverter.convertAllPagesToImages(tempPdf);

            // 3. 이미지 OCR 실행
            VisionOcrService ocrService = new VisionOcrService();
            String extractedText = ocrService.extractTextFromImages(imageFiles);

            // 4. FastAPI 서버에 POST 요청
            String fastapiUrl = "http://localhost:8000/predict";
            WebClient client = WebClient.create();

            String fastapiResponse = client.post()
                    .uri(fastapiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("text", extractedText))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // 5. 결과 반환
            return ResponseEntity.ok(fastapiResponse);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("OCR 실패: " + e.getMessage());
        }
    }
}
