package com.akif.uncleportfolio.security;

import com.akif.uncleportfolio.entity.AdminUser;
import com.akif.uncleportfolio.repository.AdminUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFacade {
    private final AdminUserRepository adminUserRepository;

    public AuthenticationFacade(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public AdminUser getCurrentAdminUser() {
        Authentication authentication = getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user");
        }
        String username = authentication.getName();
        return adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user no longer exists"));
    }
}
