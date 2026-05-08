# STAGE 1: The Builder
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Only copy the pom first to cache dependencies (Speed Hack!)
COPY pom.xml .
RUN mvn dependency:go-offline
# Now copy code and build
COPY src ./src
RUN mvn clean package -DskipTests

# STAGE 2: The Runner
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]