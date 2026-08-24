# SKY-DAY 업보목록 × SOOP 시청자 연동

이 버전은 업보목록에 SOOP 시청자를 `userId` 기준으로 연결할 수 있도록 준비되어 있습니다.

## 현재 동작
- PostgreSQL key: `skySoopViewers`
- SOOP 시청자 `userId`, `userNickname`, `userStatus`, 최근 확인 시각을 저장
- 관리자모드의 업보 추가/수정에서 저장된 SOOP 시청자를 검색·선택
- 선택하면 업보의 닉네임과 SOOP User ID가 자동 입력
- 업보 상세에서 `https://www.sooplive.com/station/{userId}` 프로필 이동 버튼 표시
- 같은 닉네임이어도 `userId`가 같으면 같은 시청자로 연결

## 실시간 SOOP Chat SDK 연결
SOOP 공식 Chat SDK는 스트리머 본인 방송의 채팅에 연결할 수 있으며, `handleMessageReceived`로 `IN`, `MESSAGE`, `USERSTATUS_CHANGED` 등을 받을 수 있습니다. 참여자 데이터에는 `userId`, `userNickname`, `userStatus`가 포함됩니다.

공식 문서: https://developers.sooplive.com/?sub=documentation&szWork=chat_sdk

승인된 Chat SDK를 연결한 코드에서 다음처럼 이 페이지의 브리지 함수를 호출하면 됩니다.

```js
chatSdk.handleMessageReceived((action, message) => {
  if (action === 'IN') {
    (message.userList || []).forEach(user => {
      window.SKY_DAY_SOOP_INGEST_VIEWER(user);
    });
  }

  if (action === 'MESSAGE' || action === 'USERSTATUS_CHANGED') {
    window.SKY_DAY_SOOP_INGEST_VIEWER(message);
  }
});
```

이렇게 받은 시청자는 PostgreSQL의 `skySoopViewers`에 저장되고 업보 관리자에서 선택할 수 있습니다.

> SOOP Developers의 개발자 등록과 제휴 신청, API KEY 발급이 먼저 필요합니다. Client ID/Secret과 OAuth 연결은 SOOP에서 발급받은 값으로 구성해야 합니다. 이 프로젝트에는 비밀키를 하드코딩하지 않았습니다.
