# DB 게이트웨이 MCP 서버

## 프로젝트 설명

**DB 게이트웨이 MCP 서버**는 다양한 데이터베이스 시스템과 상호작용할 수 있도록 통합 인터페이스를 제공하는 다목적 백엔드 서비스입니다. 데이터베이스별 작업을 추상화하고 모델 컨텍스트 프로토콜(MCP)을 통해 호출 가능한 도구로 제공하므로, AI 에이전트나 다른 서비스가 이러한 기능을 쉽게 통합하여 활용할 수 있습니다.

## 주요 기능

*   **다중 데이터베이스 지원**: MySQL, MongoDB, Redis에 연결합니다.
*   **동적 연결 구성**: 환경 변수를 기반으로 데이터베이스 연결 정보를 동적으로 설정합니다.
*   **통합된 도구 제공**: CRUD 및 스키마 관리 등 데이터베이스 작업을 표준화된 MCP 도구로 노출합니다.
*   **확장 가능한 아키텍처**: 관심사 분리를 지켜 설계했기 때문에 새로운 데이터베이스 유형을 추가하거나 기존 기능을 확장하기 쉽습니다.

## 시작하기

### 사전 요구 사항

*   Node.js (v18 이상 권장)
*   npm (Node Package Manager)
*   Docker (데이터베이스 인스턴스 실행용 — 선택 사항이지만 권장)

### 설치

1.  리포지토리를 클론합니다:
    ```bash
    git clone <repository_url>
    cd db-gateway
    ```
2.  의존성을 설치합니다:
    ```bash
    npm install
    ```
3.  데이터베이스를 설정합니다(Docker Compose 사용을 권장합니다):
    ```bash
    # 예시: MySQL, MongoDB, Redis 컨테이너 실행
    docker-compose up -d
    ```
    프로젝트에서 사용하는 샘플 Docker Compose 파일은 [`sijunkim/resources`](https://github.com/sijunkim/resources) 리포지토리에 모여 있습니다. 데이터베이스별로 독립된 Compose 파일을 제공하므로 필요한 서비스만 선택적으로 실행할 수 있습니다(예: `docker-compose -f mysql/docker-compose.yml up -d`). 이미 로컬 데이터베이스 인스턴스를 운영 중이거나 Docker를 사용할 수 없다면 리소스 리포지토리를 클론하지 말고 `.env` 파일에서 해당 인스턴스 정보를 직접 지정하세요.

## 환경 변수

서버 동작은 환경 변수로 구성합니다. 프로젝트 루트에 `.env` 파일을 만들고 다음 내용을 참고해 채워 넣으세요.

```env
# 연결할 데이터베이스 목록(쉼표로 구분, 예: "mysql,mongodb,redis")
DBS=mysql,mongodb,redis

# MySQL 연결 정보
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_DATABASE=naver_news

# MongoDB 연결 정보
# 인증이 포함된 URI 예시입니다. db-gateway를 Docker로 실행한다면 호스트를 조정하세요.
MONGODB_URI=mongodb://admin:password@localhost:27017/test

# Redis 연결 정보
# db-gateway를 Docker로 실행한다면 호스트를 조정하세요.
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=sijunkim
```

*   **Docker 환경 주의 사항**: `db-gateway` 서버를 Docker 컨테이너 안에서 실행하고 데이터베이스와 같은 네트워크(`docker-compose.yml`에 정의된 `local-network` 등)를 공유한다면, 데이터베이스 서비스 이름을 호스트로 사용해야 합니다(예: `DB_HOST=mysql`, `REDIS_HOST=redis`, `MONGODB_URI=mongodb://admin:password@mongodb:27017/test`).

## 서버 실행

DB 게이트웨이 MCP 서버를 실행하려면 다음을 수행하세요.

```bash
npm start
```

## MCP 서버 연결 예시

이 서버는 MCP 클라이언트(예: Gemini 에이전트)와 외부 MCP 서버로 통합할 수 있습니다. 아래 구성 예시는 민감한 정보를 환경 변수로 주입하는 방법을 보여줍니다.

```json
{
  "theme": "Atom One",
  "selectedAuthType": "oauth-personal",
  "mcpServers": {
    "dbGateway": {
      "command": "npx",
      "args": [
        "-y",
        "ts-node",
        "/Users/kimsijun/Source/db-gateway/src/index.ts"
      ],
      "env": {
        "DBS": "mysql,redis",
        "DB_HOST": "${DB_HOST}",
        "DB_PORT": "${DB_PORT}",
        "DB_USER": "${DB_USER}",
        "DB_PASSWORD": "${DB_PASSWORD}",
        "DB_DATABASE": "${DB_DATABASE}",
        "REDIS_HOST": "${REDIS_HOST}",
        "REDIS_PORT": "${REDIS_PORT}",
        "REDIS_PASSWORD": "${REDIS_PASSWORD}",
        "MONGODB_URI": "${MONGODB_URI}"
      }
    }
  }
}
```
*   **설명**: `env` 블록의 `"${DB_HOST}"`와 같은 값은 MCP 서버를 실행할 때 시스템 환경 변수 또는 `.env` 파일 값으로 치환되는 플레이스홀더입니다. 덕분에 민감한 자격 증명이 구성 파일에 직접 노출되지 않습니다.
