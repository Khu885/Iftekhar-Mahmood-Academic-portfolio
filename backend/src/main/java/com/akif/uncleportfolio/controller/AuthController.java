package com.akif.uncleportfolio.controller;

import com.akif.uncleportfolio.config.AppProperties;
import com.akif.uncleportfolio.dto.ApiResponse;
import com.akif.uncleportfolio.dto.auth.LoginRequest;
import com.akif.uncleportfolio.dto.auth.UserPrincipalDto;
import com.akif.uncleportfolio.entity.AdminUser;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.AdminUserRepository;
import com.akif.uncleportfolio.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AppProperties appProperties;

    public AuthController(AuthenticationManager authenticationManager, AdminUserRepository adminUserRepository,
                         PasswordEncoder passwordEncoder, JwtService jwtService, AppProperties appProperties) {
        this.authenticationManager = authenticationManager;
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.appProperties = appProperties;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserPrincipalDto>> login(@Valid @RequestBody LoginRequest request,
                                                             HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            Optional<AdminUser> optionalUser = adminUserRepository.findByUsername(request.username());
            if (optionalUser.isEmpty()) {
                throw new ApiException("Invalid credentials");
            }
            AdminUser user = optionalUser.get();
            if (!user.isEnabled()) {
                throw new ApiException("Invalid credentials");
            }
            user.setLastLoginAt(OffsetDateTime.now());
            adminUserRepository.save(user);

            String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getRole());
            Cookie cookie = new Cookie("JWT_TOKEN", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(appProperties.getSecurity().isSecureCookie());
            cookie.setPath("/");
            cookie.setMaxAge((int) (jwtService.getExpirationMs() / 1000));
            cookie.setAttribute("SameSite", appProperties.getSecurity().getSameSite());
            response.addCookie(cookie);

            UserPrincipalDto principal = new UserPrincipalDto(user.getId(), user.getUsername(), user.getRole());
            return ResponseEntity.ok(ApiResponse.success(principal, "Login successful"));
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ApiException("Invalid credentials");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserPrincipalDto>> me(HttpServletRequest request) {
        String username = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : null;
        if (username == null) {
            throw new ApiException("Authentication required");
        }
        AdminUser user = adminUserRepository.findByUsername(username).orElseThrow(() -> new ApiException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(new UserPrincipalDto(user.getId(), user.getUsername(), user.getRole()), "Authenticated"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("JWT_TOKEN", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(appProperties.getSecurity().isSecureCookie());
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", appProperties.getSecurity().getSameSite());
        response.addCookie(cookie);
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }
}
