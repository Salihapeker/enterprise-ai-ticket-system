package com.company.ticketservice.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        String type,
        String title,
        int status,
        String detail,
        String instance,
        String correlationId,
        Instant timestamp,
        List<FieldViolation> violations,
        Map<String, Object> extra
) {
    public record FieldViolation(String field, String message) {}

    public static ApiError of(int status, String title, String detail, String instance, String corrId) {
        return new ApiError(
                "about:blank",
                title,
                status,
                detail,
                instance,
                corrId,
                Instant.now(),
                null,
                null
        );
    }
}