
const API_END_POINT =
"https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/";

export async function request(nodeId) {
    try {
      const data = await fetch(`${API_END_POINT}${nodeId ? nodeId : ""}`);
  
      if (!data.ok) {
        alert("서버에서 데이터를 받아오는데 오류가 있습니다.");
        throw new Error(`서버의 상태가 이상함!`);
      }
  
      return await data.json();
    } catch (e) {
      alert("이상한오류!!");
      throw new Error(`request오류! ${e}`);
    }
  }
  