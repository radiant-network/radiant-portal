FROM --platform=linux/amd64 maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve
COPY src/ src/
RUN mvn package -q -DskipTests

FROM busybox
COPY --from=build /app/target/get-user-orgs.jar /get-user-orgs.jar
