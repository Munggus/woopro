# 우프로 운동해 소스
- `page.src.html` + `g/*.js` + `g/game.css` → `python3 build.py` 로 한 파일(`page.html`)로 합쳐짐 → 배포용 `index.html`에 끼워 넣음
- `node tests/golden.js` : 공식 결과가 기준과 같은지 확인 (수치를 옮기거나 고친 뒤 실행)
- `node tests/balance.js` : 성장곡선 시뮬레이션 (실행할 때마다 가정표를 먼저 출력)
