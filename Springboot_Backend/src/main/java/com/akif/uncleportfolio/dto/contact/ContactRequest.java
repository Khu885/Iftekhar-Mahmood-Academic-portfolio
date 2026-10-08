package com.akif.uncleportfolio.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "Name is required") @Size(max = 200) String name,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email") @Size(max = 300) String email,
        @NotBlank(message = "Message is required") String message
) {}
