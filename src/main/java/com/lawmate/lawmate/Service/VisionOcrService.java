package com.lawmate.lawmate.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.List;

@Service
public class VisionOcrService {

    private final ImageAnnotatorClient visionClient;

    public VisionOcrService() throws Exception {
        InputStream stream = getClass().getClassLoader().getResourceAsStream("gcp/vision-key.json");
        GoogleCredentials credentials = GoogleCredentials.fromStream(stream)
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();

        this.visionClient = ImageAnnotatorClient.create(settings);
    }

    public String extractTextFromImages(List<File> imageFiles) throws Exception {
        StringBuilder resultText = new StringBuilder();

        for (int i = 0; i < imageFiles.size(); i++) {
            File imageFile = imageFiles.get(i);
            ByteString imgBytes = ByteString.copyFrom(Files.readAllBytes(imageFile.toPath()));

            Image image = Image.newBuilder().setContent(imgBytes).build();
            Feature feature = Feature.newBuilder().setType(Feature.Type.DOCUMENT_TEXT_DETECTION).build();

            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(image)
                    .build();

            AnnotateImageResponse response = visionClient.batchAnnotateImages(List.of(request)).getResponses(0);

            if (response.hasError()) {
                throw new RuntimeException("Vision API 오류: " + response.getError().getMessage());
            }

            resultText.append("📄 Page ").append(i + 1).append(":\n");
            resultText.append(response.getFullTextAnnotation().getText()).append("\n\n");
        }

        return resultText.toString();
    }
}
