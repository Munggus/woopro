/* ===== 괴물 도감 ===== */
function mE(cx,cy,sp,r,a){r=r||8;var pr=r*.5,o='<circle cx="'+(cx-sp)+'" cy="'+cy+'" r="'+r+'" fill="#fff"/><circle cx="'+(cx+sp)+'" cy="'+cy+'" r="'+r+'" fill="#fff"/><circle cx="'+(cx-sp+2)+'" cy="'+(cy+2)+'" r="'+pr+'" fill="#35252a"/><circle cx="'+(cx+sp-2)+'" cy="'+(cy+2)+'" r="'+pr+'" fill="#35252a"/>';
  if(a!==0)o+='<path d="M'+(cx-sp-r-2)+' '+(cy-r-2)+'L'+(cx-sp+r)+' '+(cy-r+5)+'M'+(cx+sp+r+2)+' '+(cy-r-2)+'L'+(cx+sp-r)+' '+(cy-r+5)+'" stroke="#35252a" stroke-width="3.2" stroke-linecap="round"/>';return o;}
function mM(cx,cy,w,k){return k?'<path d="M'+(cx-w)+' '+cy+'h'+2*w+'q0 '+w+' -'+w+' '+w+'q-'+w+' 0 -'+w+' -'+w+'z" fill="#5a1f2a"/><path d="M'+(cx-w+3)+' '+cy+'l4 6l4 -6M'+(cx+w-11)+' '+cy+'l4 6l4 -6" fill="#fff" stroke="#fff" stroke-width="1.5"/>':'<path d="M'+(cx-w)+' '+(cy+4)+'q'+w+' -10 '+2*w+' 0" fill="none" stroke="#35252a" stroke-width="3.4" stroke-linecap="round"/>';}
function mP(d,f,s,w){return '<path d="'+d+'" fill="'+f+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'" stroke-linejoin="round"':'')+'/>';}
function mC(x,y,r,f,s){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"'+(s?' stroke="'+s+'" stroke-width="3"':'')+'/>';}
function mR(x,y,w,h,r,f,s){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+f+'"'+(s?' stroke="'+s+'" stroke-width="3"':'')+'/>';}
var G_MON=[
 [['충치괴물',function(){return mP('M22 40Q22 14 50 18Q78 14 78 40Q78 60 70 76Q66 92 58 80Q54 66 50 66Q46 66 42 80Q34 92 30 76Q22 60 22 40Z','#fff','#c8d0dc')+'<ellipse cx="66" cy="32" rx="9" ry="8" fill="#5b4630"/>'+mE(46,46,12,8)+mM(46,62,9,1);}],
  ['세균괴물',function(){var s='';for(var i=0;i<9;i++){var a=i*Math.PI*2/9;s+=mC(50+Math.cos(a)*35,56+Math.sin(a)*35,6,'#6fb83a');}return s+mC(50,56,31,'#8fd14f','#6fb83a')+mE(50,52,13,8)+mM(50,68,9);}],
  ['설탕덩어리',function(){return mR(20,26,60,58,12,'#fff','#c5d2ea')+'<path d="M30 36l5 5M70 38l-5 5" stroke="#dce6f7" stroke-width="3"/>'+mE(50,52,13,8)+mM(50,70,9,1);}],
  ['사탕괴물',function(){return mP('M24 56L6 42V70Z','#ffb3cc')+mP('M76 56L94 42V70Z','#ffb3cc')+mC(50,56,27,'#ff7aa8','#e0558a')+'<path d="M50 56m-4 0a4 4 0 1 1 8 0a8 8 0 1 1 -16 0a12 12 0 1 1 24 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>'+mE(50,52,11,7)+mM(50,68,8);}]],
 [['당근괴물',function(){return '<path d="M44 28L36 8M50 28V4M56 28L64 8" stroke="#4fb04f" stroke-width="6" stroke-linecap="round"/>'+mP('M50 94C30 72 26 42 40 28H60C74 42 70 72 50 94Z','#ff9a3c','#d9791c')+'<path d="M38 50h8M56 64h8M42 74h7" stroke="#d9791c" stroke-width="3" stroke-linecap="round"/>'+mE(50,52,11,7)+mM(50,70,7);}],
  ['브로콜리괴물',function(){return mR(38,60,24,32,8,'#a5d86f','#7fb34a')+mC(30,46,17,'#3f9e4a','#2f7e3a')+mC(50,34,19,'#4aa84f','#2f7e3a')+mC(70,46,17,'#3f9e4a','#2f7e3a')+mE(50,68,8,6)+mM(50,82,6);}],
  ['가지괴물',function(){return mP('M30 34C18 62 30 90 54 90C78 90 82 62 66 40C62 32 40 24 30 34Z','#7d4fc4','#5d36a0')+mP('M28 32Q46 20 68 38Q56 40 50 48Q40 36 28 32Z','#3f9e4a','#2f7e3a')+mE(52,62,11,7)+mM(52,78,8,1);}],
  ['피망괴물',function(){return mR(46,16,8,16,3,'#3f8a35')+mP('M24 54C24 30 40 28 50 36C60 28 76 30 76 54C76 78 62 90 50 90C38 90 24 78 24 54Z','#5dbb4a','#3f8a35')+mE(50,56,13,8)+mM(50,74,9);}],
  ['양파괴물',function(){return mP('M50 12Q56 30 76 48C86 74 68 92 50 92C32 92 14 74 24 48Q44 30 50 12Z','#f2d6a8','#d7b07a')+'<path d="M50 24Q40 52 38 90M50 24Q60 52 62 90" fill="none" stroke="#e6c48c" stroke-width="2.5"/>'+mE(50,62,12,8)+mM(50,78,8);}]],
 [['박쥐괴물',function(){return mP('M36 50Q8 28 4 64Q18 54 26 68Q32 58 38 70Z','#2e2147')+mP('M64 50Q92 28 96 64Q82 54 74 68Q68 58 62 70Z','#2e2147')+mP('M38 34L34 14L48 28ZM62 34L66 14L52 28Z','#3b2a5a')+'<ellipse cx="50" cy="56" rx="17" ry="22" fill="#4b3578"/>'+mE(50,50,8,6)+mM(50,68,6,1);}],
  ['유령괴물',function(){return mP('M24 90V44C24 24 36 16 50 16C64 16 76 24 76 44V90L66 82L58 90L50 82L42 90L34 82Z','#eef0ff','#b9bfe8')+mE(50,44,12,8)+mM(50,64,8,1);}],
  ['그림자괴물',function(){return mP('M16 82C8 50 28 22 50 22C72 22 92 50 84 82C70 92 30 92 16 82Z','#2a2540')+'<ellipse cx="36" cy="52" rx="8" ry="10" fill="#ffe14d"/><ellipse cx="64" cy="52" rx="8" ry="10" fill="#ffe14d"/><circle cx="38" cy="54" r="3.5" fill="#2a2540"/><circle cx="62" cy="54" r="3.5" fill="#2a2540"/><path d="M36 72q14 10 28 0" fill="none" stroke="#ff6b8a" stroke-width="3.5" stroke-linecap="round"/>';}],
  ['달괴물',function(){return mC(50,52,34,'#ffe27a','#e0b62f')+mC(32,36,6,'#f2cc55')+mC(70,64,7,'#f2cc55')+mC(62,32,4,'#f2cc55')+mE(50,50,13,8)+mM(50,70,9);}],
  ['부엉이괴물',function(){return mP('M24 82C16 52 22 30 34 28L28 12L42 22Q50 18 58 22L72 12L66 28C78 30 84 52 76 82Q50 94 24 82Z','#8a6a4a','#6a4e32')+'<ellipse cx="50" cy="70" rx="17" ry="15" fill="#e0cba6"/>'+mE(50,44,15,11)+'<path d="M46 56h8l-4 6z" fill="#ff9a3c"/>';}],
  ['먹구름괴물',function(){return mC(30,58,18,'#6c6f8a')+mC(52,46,22,'#7a7d98')+mC(72,58,17,'#6c6f8a')+mR(28,60,46,18,9,'#6c6f8a')+mP('M52 74l-8 14l9 -3l-3 12l12 -18l-9 3z','#ffe14d')+mE(50,48,12,7);}]],
 [['쿠키괴물',function(){return mC(50,54,34,'#e0a85e','#b97c34')+'<ellipse cx="30" cy="38" rx="5" ry="4" fill="#5a3418"/><ellipse cx="70" cy="42" rx="5" ry="4" fill="#5a3418"/><ellipse cx="62" cy="76" rx="5" ry="4" fill="#5a3418"/><ellipse cx="34" cy="72" rx="4" ry="3" fill="#5a3418"/>'+mE(50,50,12,8)+mM(50,68,9,1);}],
  ['도넛괴물',function(){return '<path fill-rule="evenodd" d="M50 18a34 34 0 1 0 .1 0zM50 40a10 10 0 1 1 -.1 0z" fill="#f2c07a" stroke="#d99a4c" stroke-width="3"/><path fill-rule="evenodd" d="M50 22a30 30 0 1 0 .1 0zM50 40a10 10 0 1 1 -.1 0z" fill="#ff8fb8"/><path d="M30 34l5 4M66 30l-4 6M72 56l-6 1" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'+mE(50,66,12,7)+mM(50,80,7);}],
  ['아이스크림괴물',function(){return mP('M30 52L70 52L50 94Z','#e8b36b','#c58c3f')+mC(50,38,27,'#ff9cc2','#e06c9c')+mP('M24 46q-2 14 8 10','#ff9cc2')+mE(50,38,12,8)+mM(50,54,7);}],
  ['푸딩괴물',function(){return mP('M22 88L30 40Q50 30 70 40L78 88Z','#ffd45c','#e0b02a')+mP('M30 40Q50 26 70 40Q66 56 58 46Q50 60 42 46Q34 56 30 40Z','#9a5a1c')+mE(50,68,12,8)+mM(50,82,8);}],
  ['과자봉지괴물',function(){return mP('M22 22l6 -6l6 6l6 -6l6 6l6 -6l6 6l6 -6l6 6V88H22Z','#ff7043','#d9501f')+'<path d="M50 34l4 8l9 1l-7 6l2 9l-8 -5l-8 5l2 -9l-7 -6l9 -1z" fill="#ffd54f"/>'+mE(50,68,12,7)+mM(50,82,7,1);}]],
 [['쿠션괴물',function(){return mR(18,28,64,58,18,'#9ad0f5','#6aa8d8')+mC(50,56,3,'#6aa8d8')+'<text x="68" y="24" font-size="14" font-weight="800" fill="#7a6aa8">zZ</text>'+mE(50,54,13,8)+mM(50,74,9);}],
  ['이불괴물',function(){return mR(12,42,76,44,22,'#ffb3c9','#e07a9a')+'<path d="M26 44q6 10 0 40M74 44q-6 10 0 40" stroke="#ffd0de" stroke-width="5" fill="none"/>'+mE(50,60,12,8)+mM(50,76,8,1);}],
  ['리모컨괴물',function(){return mR(32,8,36,84,10,'#3a3f4a','#22262e')+mC(42,60,4,'#ff5b5b')+mC(58,60,4,'#5bd6ff')+mC(50,72,4,'#ffd84a')+mC(42,82,4,'#7bdc6a')+mC(58,82,4,'#c78cff')+mE(50,28,9,7)+mM(50,46,7);}],
  ['소파괴물',function(){return mR(16,28,68,38,14,'#b4846a','#8a5f48')+mR(8,54,84,30,12,'#c79678','#8a5f48')+mR(8,48,16,36,8,'#a8785e')+mR(76,48,16,36,8,'#a8785e')+mE(50,48,13,8)+mM(50,68,9);}],
  ['베개괴물',function(){return mP('M14 34Q50 22 86 34Q94 58 86 82Q50 94 14 82Q6 58 14 34Z','#fff','#c3cddd')+'<text x="66" y="30" font-size="13" font-weight="800" fill="#8a94b8">z</text>'+mE(50,56,13,8)+mM(50,76,8);}]],
 [['눈사람괴물',function(){return mC(50,72,22,'#fff','#c4dbef')+mC(50,36,19,'#fff','#c4dbef')+'<path d="M50 38l16 4l-16 3z" fill="#ff9a3c"/>'+mE(50,32,8,5)+'<path d="M34 20h32M38 20V10h24v10" stroke="#35252a" stroke-width="5" fill="#35252a"/>'+mC(50,66,3,'#35252a')+mC(50,78,3,'#35252a');}],
  ['고드름괴물',function(){return mP('M22 14H78L50 94Z','#bfe8ff','#86c6ea')+'<path d="M36 22L50 70" stroke="#e8f8ff" stroke-width="4" stroke-linecap="round"/>'+mE(50,36,13,8)+mM(50,56,8,1);}],
  ['펭귄괴물',function(){return '<ellipse cx="50" cy="56" rx="28" ry="36" fill="#34495e"/><ellipse cx="50" cy="64" rx="18" ry="26" fill="#f2f6fa"/>'+mP('M44 50h12l-6 8z','#ff9a3c')+mE(50,40,12,8)+mP('M22 56L10 72L28 68Z','#34495e')+mP('M78 56L90 72L72 68Z','#34495e');}],
  ['눈송이괴물',function(){var s='';for(var i=0;i<6;i++){var a=i*Math.PI/3;s+='<path d="M50 52L'+(50+Math.cos(a)*44)+' '+(52+Math.sin(a)*44)+'" stroke="#a8d8f5" stroke-width="5" stroke-linecap="round"/>'+mC(50+Math.cos(a)*44,52+Math.sin(a)*44,4,'#a8d8f5');}return s+mC(50,52,24,'#e8f6ff','#a8d8f5')+mE(50,50,10,7)+mM(50,64,7);}],
  ['장갑괴물',function(){return mC(24,56,10,'#e0505a')+mP('M26 90V50Q26 24 44 24H56Q74 24 74 50V90Z','#e0505a','#b8343e')+mR(24,80,52,12,4,'#fff','#d5d9e0')+mE(50,50,12,8)+mM(50,66,8);}]],
 [['불꽃괴물',function(){return mP('M50 8C58 28 78 36 78 62C78 82 64 92 50 92C36 92 22 82 22 62C22 46 34 40 38 26C44 34 46 22 50 8Z','#ff7a2e','#e0561a')+mP('M50 44C56 56 64 60 64 72C64 82 58 86 50 86C42 86 36 82 36 72C36 62 46 58 50 44Z','#ffd23e')+mE(50,68,9,6)+mM(50,80,5);}],
  ['용암슬라임',function(){return mP('M14 84C8 54 26 26 50 26C74 26 92 54 86 84Q50 94 14 84Z','#ff5a3c','#c93a1e')+mC(34,48,5,'#ffb347')+mC(66,60,6,'#ffb347')+mP('M24 84q2 10 6 0M66 84q2 10 6 0','#ff5a3c')+mE(50,54,13,8)+mM(50,72,9,1);}],
  ['바위골렘',function(){return mP('M20 86L12 50L34 20L68 20L88 50L80 86Z','#8b8f9c','#5e6270')+'<path d="M40 22L46 44L36 60M70 50L60 62L66 84" stroke="#ff8a3c" stroke-width="3" fill="none" stroke-linecap="round"/>'+mE(50,50,13,8)+mM(50,70,9);}],
  ['화산괴물',function(){return mC(44,18,9,'#b8aeb0')+mC(58,10,7,'#cfc6c8')+mP('M12 92L38 38H62L88 92Z','#7a4b3a','#58332a')+mP('M38 38Q50 24 62 38Q50 44 38 38Z','#ff7a2e')+mE(50,64,12,8)+mM(50,80,8);}]],
 [['외계인괴물',function(){return '<path d="M42 16L36 2M58 16L64 2" stroke="#5fc04e" stroke-width="3"/>'+mC(36,2,4,'#ff7a9c')+mC(64,2,4,'#ff7a9c')+mP('M20 50C20 24 36 14 50 14C64 14 80 24 80 50C80 74 64 92 50 92C36 92 20 74 20 50Z','#7ddc6a','#55b448')+'<ellipse cx="36" cy="52" rx="10" ry="14" fill="#20303a"/><ellipse cx="64" cy="52" rx="10" ry="14" fill="#20303a"/><circle cx="33" cy="47" r="3" fill="#fff"/><circle cx="61" cy="47" r="3" fill="#fff"/>'+mM(50,78,8);}],
  ['UFO괴물',function(){return '<ellipse cx="50" cy="44" rx="24" ry="22" fill="#c9eeff" opacity=".85" stroke="#8fc9ea" stroke-width="3"/>'+mE(50,44,10,7)+'<ellipse cx="50" cy="64" rx="40" ry="14" fill="#aab4c8" stroke="#7d8aa3" stroke-width="3"/>'+mC(26,66,4,'#ffe14d')+mC(50,70,4,'#ffe14d')+mC(74,66,4,'#ffe14d');}],
  ['별괴물',function(){return mP('M50 8l12 26l28 4l-20 20l5 28l-25 -14l-25 14l5 -28l-20 -20l28 -4z','#ffd84a','#e0a800')+mE(50,50,10,7)+mM(50,66,7);}],
  ['혜성괴물',function(){return mP('M4 40L40 34V70L8 62Z','#e6d6ff')+mC(62,52,26,'#c9a8ff','#9a78e0')+mE(62,50,10,7)+mM(62,66,7,1);}],
  ['행성괴물',function(){return mC(50,52,28,'#ff9ac2','#e06c9c')+'<ellipse cx="50" cy="58" rx="46" ry="11" fill="none" stroke="#ffe0a0" stroke-width="5"/>'+mE(50,48,11,8)+mM(50,64,7);}]],
 [['로봇괴물',function(){return '<path d="M50 20V8" stroke="#7d8aa3" stroke-width="3"/>'+mC(50,7,4,'#ff5b5b')+mR(24,20,52,44,8,'#9fb4c9','#6f879e')+mR(32,66,36,24,6,'#8aa0b6','#6f879e')+mC(30,36,2.5,'#6f879e')+mC(70,36,2.5,'#6f879e')+mE(50,40,12,8)+mM(50,56,9,1);}],
  ['블록괴물',function(){return mR(22,32,12,12,3,'#e84a4a')+mR(44,32,12,12,3,'#e84a4a')+mR(66,32,12,12,3,'#e84a4a')+mR(14,42,72,46,6,'#ff5b5b','#c93a3a')+mE(50,62,13,8)+mM(50,80,8);}],
  ['곰인형괴물',function(){return mC(24,30,12,'#a4724a')+mC(76,30,12,'#a4724a')+mC(50,56,32,'#b9835a','#8a5f3a')+'<ellipse cx="50" cy="68" rx="15" ry="11" fill="#f1d3b0"/>'+mC(50,64,4,'#35252a')+mE(50,48,12,7)+mM(50,76,6,1);}],
  ['장난감차괴물',function(){return mR(12,48,76,32,12,'#3fa7e8','#2679b3')+mR(28,28,44,26,10,'#5bbcf2','#2679b3')+mC(30,84,9,'#35252a')+mC(70,84,9,'#35252a')+mC(30,84,3,'#ccc')+mC(70,84,3,'#ccc')+mE(50,42,11,7)+mM(50,64,8,1);}],
  ['고무오리괴물',function(){return '<ellipse cx="46" cy="72" rx="32" ry="20" fill="#ffd84a" stroke="#e0b21f" stroke-width="3"/>'+mC(58,38,22,'#ffd84a','#e0b21f')+mP('M74 40l16 4l-16 6z','#ff9a3c')+mE(58,34,7,6);}]],
 [['아기용괴물',function(){return mP('M28 36L22 18L38 28ZM72 36L78 18L62 28Z','#e8d36a')+mP('M18 64Q2 52 8 78Q16 70 24 76Z','#5fa84e')+mP('M82 64Q98 52 92 78Q84 70 76 76Z','#5fa84e')+'<ellipse cx="50" cy="60" rx="30" ry="28" fill="#7cc46a" stroke="#5aa04a" stroke-width="3"/><ellipse cx="50" cy="72" rx="17" ry="14" fill="#c8ec9a"/>'+mE(50,50,13,8)+mM(50,66,7,1);}],
  ['해골괴물',function(){return mP('M24 52C24 28 36 14 50 14C64 14 76 28 76 52C76 62 70 66 66 68V84H34V68C30 66 24 62 24 52Z','#f2f2ea','#c9c9bd')+'<ellipse cx="38" cy="50" rx="9" ry="10" fill="#2a2a33"/><ellipse cx="62" cy="50" rx="9" ry="10" fill="#2a2a33"/><circle cx="38" cy="52" r="3" fill="#ff5b5b"/><circle cx="62" cy="52" r="3" fill="#ff5b5b"/><path d="M50 60l-4 8h8z" fill="#2a2a33"/><path d="M40 72v12M50 72v12M60 72v12" stroke="#c9c9bd" stroke-width="2.5"/>';}],
  ['마법사괴물',function(){return mP('M20 46L50 4L80 46Z','#5a3a8a','#3f2766')+mR(16,42,68,9,4,'#7a52b4')+mC(50,66,26,'#b6d88a','#8ab85a')+mE(50,62,11,7)+mM(50,78,8,1);}],
  ['투구괴물',function(){return mP('M44 18Q56 2 78 14Q66 18 62 30','#e84a4a')+mP('M24 54C24 30 38 18 50 18C62 18 76 30 76 54V84H24Z','#aeb7c6','#7d8798')+mR(28,44,44,14,5,'#2a2a33')+'<circle cx="40" cy="51" r="3.5" fill="#ffe14d"/><circle cx="60" cy="51" r="3.5" fill="#ffe14d"/><path d="M34 72h32" stroke="#7d8798" stroke-width="3"/>';}],
  ['어둠의 두건',function(){return mP('M14 90C14 40 30 12 50 12C70 12 86 40 86 90Z','#3a2650','#241636')+'<ellipse cx="50" cy="52" rx="24" ry="24" fill="#150c20"/><ellipse cx="40" cy="52" rx="6" ry="8" fill="#ff5bd6"/><ellipse cx="60" cy="52" rx="6" ry="8" fill="#ff5bd6"/>'+mM(50,70,7);}]]
];
var G_REG=[
 {n:'장난감이 깨어난 방',sky:['#ffe9c7','#fff6e6'],gr:['#e8b98a','#d4a070']},
 {n:'뽀글뽀글 욕실',sky:['#d4f1ff','#f0fbff'],gr:['#cfeaf5','#b4dcec']},
 {n:'와글와글 주방',sky:['#fff2c9','#fffbe8'],gr:['#f2d3a0','#e3bd80']},
 {n:'소란스러운 거실',sky:['#ffe0e6','#fff3f5'],gr:['#d9b8e8','#c4a0d8']},
 {n:'우당탕탕 놀이터',sky:['#bfeaff','#eefaff'],gr:['#f2d08a','#e0b865']},
 {n:'통통 튀는 마트',sky:['#e3f6d6','#f6fff0'],gr:['#cfe8f5','#b5d8ec']},
 {n:'반짝반짝 소풍 공원',sky:['#c6efff','#f2fff5'],gr:['#9ad37e','#7fbf63']},
 {n:'장난감 가게 대소동',sky:['#ffe3f1','#fff3fa'],gr:['#ffc4a0','#ffab80']},
 {n:'두근두근 놀이공원',sky:['#c9d6ff','#f3f0ff'],gr:['#ffb0cf','#ff94bd']},
 {n:'특별한 생일파티',sky:['#ffe8f4','#fffbe0'],gr:['#ffd166','#ffc03a']}
];
var G_LOOP=['','반짝 ','황금 ','무지개 ','전설의 '];
function gLoopN(n){return Math.min(G_LOOP.length-1,Math.floor((n-1)/1000));}
function gRegIdx(n){return Math.floor((n-1)/100)%G_REG.length;}
function gMonHasImg(n){var r=gRegIdx(n);return !!(MON_I[r]&&MON_N[r]);}
function gMonImgIdx(n){var p=(n-1)%100;if(p===99)return 10;return Math.floor(p/10);}
function gMonIdx(n){var L=G_MON.length,r=gRegIdx(n)%L,M=G_MON[r].length;return n%10===0?((n/10-1)%M+M)%M:(n*3+Math.floor(n/10))%M;}
function gMonName(n){
  var lp=G_LOOP[gLoopN(n)];
  if(gMonHasImg(n)){var r=gRegIdx(n),i=gMonImgIdx(n);return lp+(n%10===0&&n%100!==0?'대장 ':'')+MON_N[r][i];}
  var L=G_MON.length,m=G_MON[gRegIdx(n)%L][gMonIdx(n)];return lp+(n%10===0?'대왕 ':'')+m[0];
}
var gPreC={};
function gPre(u){if(!u||gPreC[u])return;gPreC[u]=1;try{var i=new Image();i.decoding='async';i.src=u;}catch(e){}}
function gMonImg(n){return gMonHasImg(n)?MON_I[gRegIdx(n)][gMonImgIdx(n)]:'';}
function gPreNext(g){
  try{
    var sh=gShown(g);[0,1,2,10,11,99,100].forEach(function(d){gPre(gMonImg(sh+d));});
    var e=g.ceq||{};['gnd','sky','veh'].forEach(function(c){if(e[c])gPre(gCpImg(e[c]));});
    gPre(SPR_S[gFormLv(g)]);gPre(SPR_F[gFormLv(g)]);if(g.evo<10){gPre(SPR_S[g.evo+1]);gPre(SPR_F[g.evo+1]);}
  }catch(x){}
}
function gMonCls(n,boss){return boss?(' big'+(n%100===0?' king':'')):'';}
function gMonSvg(n){
  var lp=gLoopN(n),hue=lp?' style="--hue:hue-rotate('+[0,40,90,200,300][lp]+'deg) saturate('+(1+lp*.15)+')"':'';
  if(gMonHasImg(n)){return '<div class="gsh"></div><img class="gmi" alt="" src="'+MON_I[gRegIdx(n)][gMonImgIdx(n)]+'"'+hue+'>';}
  var L=G_MON.length,m=G_MON[gRegIdx(n)%L][gMonIdx(n)],boss=n%10===0;
  var crown=boss?'<path d="M30 12L36 -4L46 8L50 -6L54 8L64 -4L70 12Z" transform="translate(0,6)" fill="#ffd166" stroke="#d9a400" stroke-width="2.5" stroke-linejoin="round"/>':'';
  return '<svg viewBox="-4 -8 108 108" aria-hidden="true"'+hue+'><ellipse cx="50" cy="94" rx="34" ry="5" fill="rgba(0,0,0,.18)"/>'+m[1]()+crown+'</svg>';
}
