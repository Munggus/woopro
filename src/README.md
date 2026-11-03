# 우프로 운동해 소스
- `page.src.html` + `g/*.js` + `g/game.css` → `python3 build.py` 로 한 파일(`page.html`)로 합쳐짐 → 배포용 `index.html`에 끼워 넣음
- `node tests/golden.js` : 공식 결과가 기준과 같은지 확인 (수치를 옮기거나 고친 뒤 실행)
- `node tests/balance.js` : 성장곡선 시뮬레이션 (실행할 때마다 가정표를 먼저 출력)

## 숫자표 (v87~)
게임 밸런스 숫자는 `g/data.js` 한 곳에 모여 있어요. 공식(`core2.js`)과 화면(`ui2.js`, `pet.js`, `combo.js`)과 시뮬레이터가 모두 이 표를 읽어요.
숫자를 고친 뒤: `node tests/golden.js` (바뀐 칸·바뀐 결과 확인) → 의도한 변화면 `node tests/golden.js save`.
