# ─── STAGE 1 : BUILD (Compilation avec Maven) ───
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
# On copie d'abord le pom.xml pour optimiser le cache Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B
# On copie le code source et on compile
COPY src ./src
RUN mvn clean package -DskipTests

# ─── STAGE 2 : RUN (Exécution légère) ───
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# On récupère LE fichier .jar généré à l'étape 1
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
# On lance l'application avec les limites de RAM
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]