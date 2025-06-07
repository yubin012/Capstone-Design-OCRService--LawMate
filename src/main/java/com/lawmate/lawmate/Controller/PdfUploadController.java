package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.Converter.PdfToImageConverter;
import com.lawmate.lawmate.Service.VisionOcrService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/pdf")
public class PdfUploadController {

    @PostMapping("/ocr")
    public ResponseEntity<String> handlePdfUpload(@RequestParam("file") MultipartFile file) {
        try {
            File tempPdf = File.createTempFile("uploaded_", ".pdf");
            file.transferTo(tempPdf);

            // 1. PDF → 이미지 변환
            List<File> imageFiles = PdfToImageConverter.convertAllPagesToImages(tempPdf);

            // 2. 이미지 OCR 실행
            VisionOcrService ocrService = new VisionOcrService();
            String result = ocrService.extractTextFromImages(imageFiles);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("OCR 실패: " + e.getMessage());
        }
    }
}
