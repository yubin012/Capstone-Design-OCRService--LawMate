# 1단계: 빌드 환경
FROM gradle:jdk17-corretto-al2023 AS builder

# Gradle 캐시 최적화
ENV GRADLE_USER_HOME=/home/gradle/.gradle

WORKDIR /usr/app/

COPY . .

# 초기 의존성만 다운로드해서 캐시 생성 (실패해도 무시)
RUN ./gradlew dependencies --no-daemon || true

# 이후 전체 소스 복사
COPY . .

# 실제 빌드 (테스트 제외)
RUN chmod +x gradlew
RUN ./gradlew build --no-daemon -x test

# 2단계: 런타임 환경
FROM openjdk:17

ENV APP_HOME=/user/app/
WORKDIR $APP_HOME

# 빌드된 jar 복사 (JAR 파일명 명확히 기입)
COPY --from=builder /usr/app/build/libs/lawmate-0.0.1-SNAPSHOT.jar ./app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
