package com.lawmate.lawmate.Converter;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

//  ✅ PDF → 이미지 변환

public class PdfToImageConverter {

    public static List<File> convertAllPagesToImages(File pdfFile) throws Exception {
        List<File> imageFiles = new ArrayList<>();

        try (PDDocument document = PDDocument.load(pdfFile)) {
            PDFRenderer renderer = new PDFRenderer(document);

            for (int page = 0; page < document.getNumberOfPages(); page++) {
                BufferedImage image = renderer.renderImageWithDPI(page, 300);
                File imageFile = File.createTempFile("page_" + page + "_", ".png");
                ImageIO.write(image, "png", imageFile);
                imageFiles.add(imageFile);
            }
        }

        return imageFiles;
    }
}