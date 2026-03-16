package com.company.ticketservice.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AiAnalyzeResponse {

    @JsonProperty("urgency_score")
    private double urgencyScore;

    private String tag;

    public AiAnalyzeResponse() {}

    public AiAnalyzeResponse(double urgencyScore, String tag) {
        this.urgencyScore = urgencyScore;
        this.tag = tag;
    }

    public double getUrgencyScore() {
        return urgencyScore;
    }

    public String getTag() {
        return tag;
    }

    public void setUrgencyScore(double urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}