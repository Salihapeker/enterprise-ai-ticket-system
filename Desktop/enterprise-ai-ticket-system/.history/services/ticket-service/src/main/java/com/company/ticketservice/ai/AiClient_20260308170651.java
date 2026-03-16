package com.company.ticketservice.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Objects;

@Component
public class AiClient {

    private final RestClient restClient;

    public AiClient(@Value("${ai.baseUrl}") String baseUrl) {
        String safeBaseUrl = Objects.requireNonNull(baseUrl, "ai.baseUrl must be set");
        this.restClient = RestClient.builder()
                .baseUrl(safeBaseUrl)
                .build();
    }

    public AiAnalyzeResponse analyze(String text) {
        return restClient.post()
                .uri("/analyze")
                .body(new AiAnalyzeRequest(text))
                .retrieve()
                .body(AiAnalyzeResponse.class);
    }
}