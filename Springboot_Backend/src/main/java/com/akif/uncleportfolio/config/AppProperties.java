package com.akif.uncleportfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Admin admin = new Admin();
    private Security security = new Security();
    private Cors cors = new Cors();

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }
    public Security getSecurity() { return security; }
    public void setSecurity(Security security) { this.security = security; }
    public Cors getCors() { return cors; }
    public void setCors(Cors cors) { this.cors = cors; }

    public static class Admin {
        private String username;
        private String password;
        private String[] roles = {"ADMIN"};
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String[] getRoles() { return roles; }
        public void setRoles(String[] roles) { this.roles = roles; }
    }

    public static class Security {
        private boolean secureCookie;
        private String sameSite = "Lax";
        public boolean isSecureCookie() { return secureCookie; }
        public void setSecureCookie(boolean secureCookie) { this.secureCookie = secureCookie; }
        public String getSameSite() { return sameSite; }
        public void setSameSite(String sameSite) { this.sameSite = sameSite; }
    }

    public static class Cors {
        private String[] allowedOrigins = {"http://localhost:3000"};
        public String[] getAllowedOrigins() { return allowedOrigins; }
        public void setAllowedOrigins(String[] allowedOrigins) { this.allowedOrigins = allowedOrigins; }
    }
}
