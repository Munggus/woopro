import re,subprocess
src=open('page.src.html',encoding='utf8').read()
poses=open('poses.js',encoding='utf8').read()
mas=open('mascot.js',encoding='utf8').read()
game=open('g/data.js',encoding='utf8').read()+open('g/core2.js',encoding='utf8').read()+open('g/mon.js',encoding='utf8').read()+open('g/mon2.js',encoding='utf8').read()+open('g/spr.js',encoding='utf8').read()+open('g/cpdata.js',encoding='utf8').read()+open('g/pet.js',encoding='utf8').read()+open('g/farm.js',encoding='utf8').read()+open('g/village.js',encoding='utf8').read()+open('g/ui2.js',encoding='utf8').read()+open('g/combo.js',encoding='utf8').read()+open('g/ssr.js',encoding='utf8').read()
page=src.replace('/*GAME_CSS*/',open('g/game.css',encoding='utf8').read()).replace('/*GAME_JS*/',game).replace('/*POSES_JS*/',poses).replace('/*MAS_JS*/',mas)
open('page.html','w',encoding='utf8').write(page)
js=re.search(r'<script>(.*)</script>',page,re.S).group(1)
open('check.js','w',encoding='utf8').write(js)
icon=open('icon.b64').read()
pre='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#D92F5E"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="우프로 운동해"><link rel="icon" href="data:image/png;base64,'+icon+'"><link rel="apple-touch-icon" href="data:image/png;base64,'+icon+'"><style>html,body{margin:0}</style></head><body>'
open('workout-timer.html','w',encoding='utf8').write(pre+page+'</body></html>')
import os
print(len(page),os.path.getsize('workout-timer.html'))
