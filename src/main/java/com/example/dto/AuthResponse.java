package com.example.dto;

import java.util.List;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        List<String> roles
) {
    public AuthResponse(String token, String username, List<String> roles) {
        this(token, "Bearer", username, roles);
    }
}
