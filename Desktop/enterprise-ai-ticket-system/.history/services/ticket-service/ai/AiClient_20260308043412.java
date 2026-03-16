package com.company.ticketservice.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AiClient {

    private final RestClient restClient;

    public AiClient(@Value("${ai.baseUrl}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
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