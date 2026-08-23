# SKY-DAY Render + PostgreSQL 배포본

## 기능
- 프로필 / 일정표 / 공지사항 / 의상목록 / 업보목록 5개 페이지 유지
- 기존 디자인과 페이지별 기능 유지
- 관리자 수정 데이터를 PostgreSQL에 공용 저장
- 일정표 수정 → 일정표와 프로필 첫 화면 주간일정표가 같은 데이터를 사용
- 공지사항 수정 → 공지사항 페이지와 프로필 첫 화면 공지가 같은 데이터를 사용
- 의상목록/업보목록 수정도 모든 방문자에게 공용 반영
- 공통 관리자 비밀번호: 

## Render 배포
1. 이 ZIP의 압축을 푼 뒤 GitHub 저장소에 업로드
2. Render에서 Web Service 생성 후 해당 GitHub 저장소 연결
3. Build Command: npm install
4. Start Command: npm start
5. PostgreSQL 데이터베이스를 만들고 DATABASE_URL 환경변수 설정
6. ADMIN_PASSWORD 환경변수를 soopgodsky221010>< 로 설정
7. 배포

## 중요
이 버전은 기존 정적 페이지의 localStorage 저장 방식을 유지하면서,
기존 데이터 저장 동작을 PostgreSQL에도 자동 저장하도록 연결한 버전입니다.
첫 공용 저장 전에는 각 브라우저에 있던 기존 localStorage 데이터가 자동으로
DB에 올라가지 않습니다. 관리자모드에서 해당 목록/일정을 한 번 저장하면
그 데이터가 공용 DB에 저장됩니다.
