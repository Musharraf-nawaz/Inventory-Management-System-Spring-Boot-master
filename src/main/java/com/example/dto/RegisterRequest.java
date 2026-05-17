package com.example.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RegisterRequest(
        @NotBlank @Size(max = 50) String username,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotBlank @Size(max = 45) String firstName,
        @NotBlank @Size(max = 45) String lastName,
        @NotBlank @Email @Size(max = 45) String email,
        @NotBlank @Size(max = 105) String address,
        @NotBlank BigDecimal contactNumber
) {
}
