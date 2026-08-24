// SOOP Chat SDK -> SKY-DAY 업보목록 연결 예제
// SOOP Developers에서 발급받은 Chat SDK 연결 코드 뒤에 붙여 사용하세요.
// 공식 문서: https://developers.sooplive.com/?sub=documentation&szWork=chat_sdk

function connectSoopViewerBridge(chatSdk) {
  chatSdk.handleMessageReceived((action, message) => {
    if (action === "IN") {
      (message.userList || []).forEach(user => {
        window.SKY_DAY_SOOP_INGEST_VIEWER?.(user);
      });
      return;
    }

    if (action === "MESSAGE" || action === "USERSTATUS_CHANGED") {
      window.SKY_DAY_SOOP_INGEST_VIEWER?.(message);
    }
  });
}
