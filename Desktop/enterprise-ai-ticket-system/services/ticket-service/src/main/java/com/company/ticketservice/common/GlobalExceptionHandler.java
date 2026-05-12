package com.company.ticketservice.common;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

import java.time.Instant;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                     HttpServletRequest req) {
        List<ApiError.FieldViolation> violations = ex.getBindingResult().getFieldErrors().stream()
                .map(this::toViolation)
                .toList();

        ApiError body = new ApiError(
                "about:blank",
                "Validation failed",
                HttpStatus.BAD_REQUEST.value(),
                "One or more fields are invalid",
                req.getRequestURI(),
                MDC.get(CorrelationIdFilter.MDC_KEY),
                Instant.now(),
                violations,
                null
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<ApiError> handleUpstream(ResourceAccessException ex,
                                                   HttpServletRequest req) {
        log.warn("Upstream unreachable: {}", ex.getMessage());
        ApiError body = ApiError.of(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "Upstream service unavailable",
                "AI service could not be reached",
                req.getRequestURI(),
                MDC.get(CorrelationIdFilter.MDC_KEY)
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException ex,
                                                     HttpServletRequest req) {
        ApiError body = ApiError.of(
                HttpStatus.BAD_REQUEST.value(),
                "Bad request",
                ex.getMessage(),
                req.getRequestURI(),
                MDC.get(CorrelationIdFilter.MDC_KEY)
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception", ex);
        ApiError body = ApiError.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal server error",
                "An unexpected error occurred",
                req.getRequestURI(),
                MDC.get(CorrelationIdFilter.MDC_KEY)
        );
        return ResponseEntity.internalServerError().body(body);
    }

    private ApiError.FieldViolation toViolation(FieldError fe) {
        return new ApiError.FieldViolation(fe.getField(), fe.getDefaultMessage());
    }
}