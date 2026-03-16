package com.company.ticketservice.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiAnalyzeResponse(
        @JsonProperty("urgency_score") double urgencyScore,
        String tag
) {}