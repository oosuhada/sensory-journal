# BeerAir — 세계 맥주로 떠나는 세계 여행

BeerAir는 마신 맥주를 기록하며 세계 여러 지역을 여행하는 경험을 만드는 웹 애플리케이션입니다. 맥주 탐색, 개인 기록과 프로필을 다크 테마의 모바일 중심 UI로 제공합니다.

![BeerAir home](.github/assets/portfolio/beer-air-home.png)

## 주요 기능

- 맥주 목록과 상세 정보
- 검색 및 필터
- 마신 맥주 기록
- 개인 맥주 여행 기록
- 추천·좋아요 기반 탐색
- 프로필과 기록 관리

## 주요 라우트

```text
/
/beers
/beers/[id]
/search
/record/create/[beerId]
/records/my
/profile
```

## Stack

- Next.js / React
- TypeScript
- Emotion
- React Query
- Recoil
- Storybook

## 시작하기

```bash
yarn install
yarn tsc
yarn build
yarn start
```

외부 API와 운영 서비스 연동 정보는 환경변수로 별도 설정합니다.
