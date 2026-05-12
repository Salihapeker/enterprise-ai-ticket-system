package com.company.ticketservice.ai;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Objects;

@Component
public class AiClient {

    private static final Logger log = LoggerFactory.getLogger(AiClient.class);
    private static final String INSTANCE = "ai-service";

    private final RestClient restClient;

    public AiClient(@Value("${ai.baseUrl}") String baseUrl) {
        String safeBaseUrl = Objects.requireNonNull(baseUrl, "ai.baseUrl must be set");

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(2).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(5).toMillis());

        this.restClient = RestClient.builder()
                .baseUrl(safeBaseUrl)
                .requestFactory(factory)
                .build();
    }

    @CircuitBreaker(name = INSTANCE, fallbackMethod = "analyzeFallback")
    @Retry(name = INSTANCE)
    public AiAnalyzeResponse analyze(String text) {
        log.debug("Calling AI /analyze with text length={}", text == null ? 0 : text.length());
        AiAnalyzeResponse resp = restClient.post()
                .uri("/analyze")
                .body(new AiAnalyzeRequest(text))
                .retrieve()
                .body(AiAnalyzeResponse.class);
        if (resp == null) {
            throw new IllegalStateException("AI service returned empty body");
        }
        return resp;
    }

    @SuppressWarnings("unused")
    private AiAnalyzeResponse analyzeFallback(String text, Throwable t) {
        log.warn("AI service fallback triggered: {}", t.toString());
        AiAnalyzeResponse resp = new AiAnalyzeResponse();
        resp.setUrgencyScore(0.2);
        resp.setTag("NORMAL");
        return resp;
    }
}