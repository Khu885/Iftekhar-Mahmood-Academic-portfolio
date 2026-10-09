# Multi-stage build for Spring Boot application on Render
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the application skipping unit tests
RUN mvn clean package -DskipTests -B && \
    cp target/uncle-portfolio-backend-*.jar app.jar && \
    rm -f app.jar.original 2>/dev/null || true

# Production Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the generated JAR from build stage
COPY --from=build /app/app.jar app.jar

# Render automatically assigns and injects the PORT environment variable
ENV PORT=8080
EXPOSE ${PORT}

# Optimize JVM for containers and bind to Render's dynamic PORT
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -jar app.jar"]
