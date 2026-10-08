package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.config.AppProperties;
import com.akif.uncleportfolio.entity.AdminUser;
import com.akif.uncleportfolio.repository.AdminUserRepository;
import java.time.OffsetDateTime;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminSeedService {
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties appProperties;

    public AdminSeedService(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder, AppProperties appProperties) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.appProperties = appProperties;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedAdmin() {
        String username = appProperties.getAdmin().getUsername();
        String password = appProperties.getAdmin().getPassword();
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return;
        }
        AdminUser user = adminUserRepository.findByUsername(username).orElseGet(AdminUser::new);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole("ADMIN");
        user.setEnabled(true);
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(OffsetDateTime.now());
        }
        user.setUpdatedAt(OffsetDateTime.now());
        adminUserRepository.save(user);
    }
}
