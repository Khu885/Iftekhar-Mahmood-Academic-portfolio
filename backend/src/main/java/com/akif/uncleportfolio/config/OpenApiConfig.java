package com.akif.uncleportfolio.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI portfolioOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Uncle Portfolio API")
                        .description("Public and admin APIs for portfolio content, file management, and CV administration.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Portfolio Administrator")
                                .email("admin@example.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
