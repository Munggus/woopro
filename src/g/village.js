/* ===== 마을 (12×12 지도 · 시설 건설/레벨업/배치) ===== */
var G_VL=G_DATA.village,G_VLM={},G_VDC={},gVlEdit=false,gVlSel='',gVlDec='',gVlT='m';G_VL.bld.forEach(function(b){G_VLM[b.k]=b;});G_VL.deco.forEach(function(d){G_VDC[d.k]=d;});
var G_VDCAT=[['path','🛤️ 길'],['tree','🌳 나무·꽃'],['fence','🪵 울타리'],['orn','⛲ 장식물']];
function gVlRng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
/* (x,y)에 2×2 건물을 놓을 수 있나? gap=건물 사이 띄울 칸, ex=옮기는 중인 건물(자기 자신은 무시) */
function gVlFits(vl,x,y,gap,ex){var N=G_VL.N,S=G_VL.size;if(x<0||y<0||x+S>N||y+S>N)return false;for(var k in vl.b){if(k===ex)continue;var o=vl.b[k];if(o.x<0)continue;if(x<o.x+S+gap&&o.x<x+S+gap&&y<o.y+S+gap&&o.y<y+S+gap)return false;}return true;}
function gVlPlace(vl,k){var N=G_VL.N,S=G_VL.size;for(var gap=1;gap>=0;gap--){var c=[];for(var y=0;y+S<=N;y++)for(var x=0;x+S<=N;x++)if(gVlFits(vl,x,y,gap))c.push([x,y]);if(c.length){var p=c[Math.floor(Math.random()*c.length)];vl.b[k]={x:p[0],y:p[1],lv:1,ut:0};return true;}}return false;}
/* 이 칸에 (놓은) 건물이 있나? */
function gVlOcc(vl,x,y){var S=G_VL.size;for(var k in vl.b){var o=vl.b[k];if(o.x>=0&&x>=o.x&&x<o.x+S&&y>=o.y&&y<o.y+S)return true;}return false;}
/* 건물을 (x,y)에 확정: 자리 아래 꾸미기는 치워져요 */
function gVlClaim(vl,k,x,y){var S=G_VL.size,q=vl.b[k];q.x=x;q.y=y;delete q.np;for(var dx=0;dx<S;dx++)for(var dy=0;dy<S;dy++)delete vl.d[(x+dx)+','+(y+dy)];}
function gVlLoad(o){
  var d={seed:Math.floor(Math.random()*2147483646)+1,b:{},d:{}};
  if(o&&typeof o==='object'){
    var sd=Math.floor(gNum(o.seed,0));if(sd>0)d.seed=sd;
    if(o.b&&typeof o.b==='object')G_VL.bld.forEach(function(B){var s=o.b[B.k];if(!s||typeof s!=='object')return;var x=Math.floor(gNum(s.x,-1)),y=Math.floor(gNum(s.y,-1)),np=!!s.np&&!B.free;if(np){x=-1;y=-1;}else if(!gVlFits(d,x,y,0))return;var lv=Math.min(G_VL.maxLv,Math.max(1,Math.floor(gNum(s.lv,1))));d.b[B.k]={x:x,y:y,lv:lv,ut:lv>=G_VL.maxLv?0:Math.max(0,gNum(s.ut,0))};if(np)d.b[B.k].np=1;});
    if(o.d&&typeof o.d==='object')Object.keys(o.d).forEach(function(c){var m=/^(\d+),(\d+)$/.exec(c);if(!m||!G_VDC[o.d[c]])return;var x=+m[1],y=+m[2];if(x>=G_VL.N||y>=G_VL.N||gVlOcc(d,x,y))return;d.d[c]=o.d[c];});
  }
  G_VL.bld.forEach(function(B){if(B.free&&!d.b[B.k])gVlPlace(d,B.k);});
  return d;
}
function gVl(){var g=gGet();if(!g.vl)g.vl=gVlLoad(null);if(!g.vl.d)g.vl.d={};return g.vl;}
function gVlLv(k){var vl=gVl(),q=vl.b[k];return q?q.lv:1;}
function gVlEff(k,lv){var mx=G_VL.maxLv;
  if(k==='plot'){var ok=G_CROP.filter(function(c){return c.rv<=lv;}).map(function(c){return c.e;}).join(' '),nx=G_CROP.filter(function(c){return c.rv===lv+1;})[0];return '심을 수 있는 작물: '+ok+(nx&&lv<mx?'<br>다음 레벨: '+nx.e+' '+nx.n+' '+gStars(nx.rv):'');}
  if(k==='cook'||k==='smith'||k==='tailor'){var nm={cook:'요리',smith:'무기',tailor:'코스튬'}[k];return '만들 수 있는 '+nm+': Lv.1~'+lv+(lv<mx?' → 다음 레벨 Lv.'+(lv+1)+' '+nm+' 3종':'');}
  if(k==='farm')return '동물들이 만드는 생산물 품질: '+gStars(lv)+(lv<mx?' → 다음 레벨 '+gStars(lv+1):'');
  return '';}
function gVlUpCost(k,l){return Math.ceil(G_VLM[k].up*Math.pow(G_VL.upG,l-1));}
/* 레벨업 걸리는 시간: Lv1→2는 upMin분, 마지막(5→6)은 upMax분, 그 사이는 곱셈으로 점점 늘어남 */
function gVlUpMs(l){return Math.round(Math.round(G_VL.upMin*Math.pow(G_VL.upMax/G_VL.upMin,(l-1)/(G_VL.maxLv-2)))*60000*(1-(typeof gBfV==='function'?gBfV('upg'):0)));}
function gVlDur(ms){var s=Math.max(0,Math.ceil(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),r=s%60;return d?d+'일 '+h+'시간':h?h+'시간 '+m+'분':m?m+'분 '+r+'초':r+'초';}
function gVlSync(g){var vl=g.vl,now=Date.now(),msgs=[];if(!vl)return msgs;G_VL.bld.forEach(function(B){var q=vl.b[B.k];if(q&&q.ut&&now>=q.ut){q.lv=Math.min(G_VL.maxLv,q.lv+1);q.ut=0;msgs.push(B.e+' '+B.n+' Lv.'+q.lv+' 완성! 🎉');}});return msgs;}
var gVlDrag=null,gVlNoClick=0;
function gVlMapHtml(g){
  var vl=g.vl,N=G_VL.N,S=G_VL.size,occ={},k,o,dx,dy,now=Date.now();
  for(k in vl.b){o=vl.b[k];if(o.x<0)continue;for(dx=0;dx<S;dx++)for(dy=0;dy<S;dy++)occ[(o.x+dx)+','+(o.y+dy)]=1;}
  var rnd=gVlRng(vl.seed),D=G_VL.decor,h='<div class="gvm"><div class="gvmi'+(gVlEdit?' ed':'')+(gVlDec?' dc':'')+'">',pc=100/N,pos=function(x,y){return 'left:'+(x*pc).toFixed(3)+'%;top:'+(y*pc).toFixed(3)+'%';};
  for(var y=0;y<N;y++)for(var x=0;x<N;x++){var r=rnd(),r2=rnd(),c=x+','+y;
    if(vl.d[c]){var d=G_VDC[vl.d[c]];h+=d.bg?'<i class="gvd gvtile" style="'+pos(x,y)+';background:'+d.bg+'"></i>':'<i class="gvd" style="'+pos(x,y)+'">'+d.e+'</i>';}
    else if(!occ[c]&&r<G_VL.decorP)h+='<i class="gvd" style="'+pos(x,y)+'">'+D[Math.floor(r2*D.length)]+'</i>';}
  if(gVlEdit&&gVlSel&&vl.b[gVlSel]){for(var cy=0;cy+S<=N;cy++)for(var cx=0;cx+S<=N;cx++)if(gVlFits(vl,cx,cy,0,gVlSel))h+='<button class="gvcell" style="'+pos(cx,cy)+'" data-act="gvil" data-f="put" data-x="'+cx+'" data-y="'+cy+'" aria-label="여기에 놓기"></button>';}
  if(gVlDec){for(var y2=0;y2<N;y2++)for(var x2=0;x2<N;x2++){var c2=x2+','+y2;if(occ[c2])continue;if(gVlDec==='erase'&&!vl.d[c2])continue;h+='<button class="gvcell" style="'+pos(x2,y2)+'" data-act="gvil" data-f="dput" data-x="'+x2+'" data-y="'+y2+'" aria-label="여기에"></button>';}}
  G_VL.bld.forEach(function(B){var q=vl.b[B.k];if(!q||q.x<0)return;
    var lab=(q.ut?'<small class="gvt" data-k="'+B.k+'">⏳ '+gVlDur(q.ut-now)+'</small>':'<small>Lv.'+q.lv+'</small>');
    h+='<button class="gvb'+(gVlSel===B.k?' sel':'')+'" style="'+pos(q.x,q.y)+'" data-act="gvil" data-f="bld" data-k="'+B.k+'"><span class="gve">'+B.e+'</span><b>'+B.n+'</b>'+lab+'</button>';});
  return h+'</div></div>';
}
function gVlTabs(){return '<div class="gseg g2"><button class="gsg'+(gVlT==='m'?' on':'')+'" data-act="gvil" data-f="tab" data-k="m">🏡 마을</button><button class="gsg'+(gVlT==='r'?' on':'')+'" data-act="gvil" data-f="tab" data-k="r">🎒 재료</button></div>';}
function gVlCard(g){
  var vl=gVl();gVlSync(g);var h=gVlTabs();
  if(gVlT==='r')return h+gMatPanel(g);
  var busy=gVlEdit||gVlDec;
  h+='<div class="gvh"><h2>🏡 우리 마을</h2><div class="gvbt">'+(gVlDec?'':'<button class="mini" data-act="gvil" data-f="bmenu">🏗️ 건축</button>')+(gVlDec?'':'<button class="mini'+(gVlEdit?' on':'')+'" data-act="gvil" data-f="edit">'+(gVlEdit?'✅ 완료':'🛠️ 배치')+'</button>')+'</div></div>';
  if(gVlDec){var dd=G_VDC[gVlDec];h+='<div class="gvdb"><span>'+(gVlDec==='erase'?'🧹 지우기':(dd.bg?'<i class="gvsw" style="background:'+dd.bg+'"></i>':dd.e)+' '+dd.n+' '+gRuby(12)+dd.cost)+'</span><div class="gvbt"><button class="mini'+(gVlDec==='erase'?' on':'')+'" data-act="gvil" data-f="derase">🧹</button><button class="mini" data-act="gvil" data-f="bmenu">🏗️</button><button class="mini rb" data-act="gvil" data-f="ddone">✅ 완료</button></div></div>';}
  var un=G_VL.bld.filter(function(B){return vl.b[B.k]&&vl.b[B.k].x<0;});
  if(un.length)h+='<div class="gvun"><b>📦 아직 안 놓은 건물</b>'+un.map(function(B){return '<button class="mini'+(gVlSel===B.k?' on':'')+'" data-act="gvil" data-f="pick" data-k="'+B.k+'">'+B.e+' '+B.n+'</button>';}).join('')+'<small>눌러서 마을에 놓아봐!</small></div>';
  h+=gVlMapHtml(g)+'<p class="hint" style="font-size:12px">'+(gVlDec?(gVlDec==='erase'?'치우고 싶은 칸을 눌러! (환불은 없어)':'놓고 싶은 칸을 눌러봐! 한 칸 놓을 때마다 💎가 들어가. 길은 쭉쭉 눌러서 이어봐.'):gVlEdit?(gVlSel?'<b>'+G_VLM[gVlSel].n+'</b>을(를) 놓을 자리(밝은 칸)를 눌러! 칸이 건물의 왼쪽 위가 돼.':'건물을 <b>꾹 끌어서</b> 옮겨봐! 놓을 자리가 초록색으로 보여.'):'건물을 누르면 바로 안으로 들어가요!')+'</p>';
  return h;
}
/* 건축 화면: 재료 건물 / 제작 건물 / 꾸미기 */
function gBldCard(g){
  var vl=gVl(),h='<button class="mini gvbk" data-act="gvil" data-f="map">🏡 마을로</button><div class="gvh"><h2>🏗️ 건축</h2><b>'+gRuby(14)+' '+gFmt(g.rubies)+'</b></div>';
  function row(B){var q=vl.b[B.k];var st=q?(q.x<0?'<small>📦 놓는 중</small>':'<small>✅ 지었어</small>'):(B.free?'<small>기본 건물</small>':'<button class="mini rb" data-act="gvil" data-f="build" data-k="'+B.k+'"'+(g.rubies<B.build?' disabled':'')+'>'+gRuby(14)+' '+B.build+' 짓기</button>');
    return '<div class="gvc"><span class="gvce">'+B.e+'</span><div><b>'+B.n+'</b><small>'+B.d+'</small></div>'+st+'</div>';}
  h+='<h3 class="gcph">🌾 재료 건물</h3>'+G_VL.bld.filter(function(B){return B.k==='farm'||B.k==='plot';}).map(row).join('');
  h+='<h3 class="gcph">🔨 제작 건물</h3>'+G_VL.bld.filter(function(B){return B.k!=='farm'&&B.k!=='plot';}).map(row).join('');
  h+='<h3 class="gcph">🎨 꾸미기</h3><p class="hint" style="font-size:12px">누르면 마을 화면으로 돌아가서 칸을 눌러 놓을 수 있어요. 한 칸 놓을 때마다 💎가 들어가.</p>';
  G_VDCAT.forEach(function(c){h+='<h4 class="gvdh">'+c[1]+'</h4><div class="gvpal">'+G_VL.deco.filter(function(d){return d.c===c[0];}).map(function(d){return '<button class="gvdi" data-act="gvil" data-f="dstart" data-k="'+d.k+'"><span class="gvdp">'+(d.bg?'<i class="gvsw" style="background:'+d.bg+'"></i>':d.e)+'</span><b>'+d.n+'</b><small>'+gRuby(11)+d.cost+'</small></button>';}).join('')+'</div>';});
  return h;
}
/* 건물 안에서 하는 강화 (농장·텃밭·제작소·집 공통) */
function gVlUpHtml(k){
  var vl=gVl(),q=vl.b[k];if(!q)return '';var mx=q.lv>=G_VL.maxLv,body;
  if(mx)body='<button class="btn sm" disabled>레벨 MAX</button>';
  else if(q.ut)body='<p class="hint">⏳ Lv.'+q.lv+' → Lv.'+(q.lv+1)+' 레벨업 중!<br>남은 시간 <b id="gvmt">'+gVlDur(q.ut-Date.now())+'</b></p>';
  else body='<button class="btn sm gevob gvub" data-act="gvil" data-f="up" data-k="'+k+'">'+gRuby(14)+'<span>'+gFmt(gVlUpCost(k,q.lv))+' · Lv.'+q.lv+' → Lv.'+(q.lv+1)+'</span></button><p class="hint" style="font-size:12px">⏱️ 걸리는 시간 '+gVlDur(gVlUpMs(q.lv))+'</p>';
  var ef=gVlEff(k,q.lv);
  return '<div class="gvup"><div class="gvuh"><b>🏗️ 건물 강화</b><small>Lv.'+q.lv+'/'+G_VL.maxLv+'</small></div>'+(ef?'<p class="hint" style="font-size:13px">'+ef+'</p>':'')+body+'</div>';
}
function gHouseCard(g){var B=G_VLM.house;return '<button class="mini gvbk" data-act="gvil" data-f="map">🏡 마을로</button><div class="gvh"><h2>'+B.e+' '+B.n+' <small>Lv.'+gVlLv('house')+'</small></h2></div>'+gVlUpHtml('house')+'<p class="hint">집 안 꾸미기랑 쉬는 방은 곧 열릴 거야! 🛋️</p>';}
function gVlCurB(){return gSub==='farm'?(gFmT==='a'?'farm':'plot'):gSub==='craft'?gCrK:gSub==='house'?'house':'';}
var gVlLast='';
function gVlGo(sub,t){gDexModalClose();gVlEdit=false;gVlSel='';gVlDec='';if(t)gFmT=t;gSub=sub;gApplyMode(true);gRefresh();var m=$('main');if(m)m.scrollTop=0;}
function gVlEnter(k){if(k==='farm')gVlGo('farm','a');else if(k==='plot')gVlGo('farm','f');else if(k==='house')gVlGo('house');else{gCrK=k;gVlGo('craft');}}
function gvDo(b){
  var f=b.dataset.f,k=b.dataset.k,g=gGet(),vl=gVl();
  if(f==='bld'){
    if(Date.now()<gVlNoClick)return;
    if(gVlEdit){gVlSel=(gVlSel===k)?'':k;gRefresh();return;}
    if(gVlDec)return;
    gVlEnter(k);}
  else if(f==='edit'){gVlEdit=!gVlEdit;gVlSel='';gVlDec='';gRefresh();}
  else if(f==='tab'){gVlT=k;gRefresh();}
  else if(f==='bmenu')gVlGo('bld');
  else if(f==='pick'){gVlEdit=true;gVlDec='';gVlSel=(gVlSel===k)?'':k;gRefresh();}
  else if(f==='put'){var q=vl.b[gVlSel];if(!q)return;var x=+b.dataset.x,y=+b.dataset.y;if(!gVlFits(vl,x,y,0,gVlSel)){toast('거기엔 놓을 수 없어');return;}
    var nm=G_VLM[gVlSel],was=q.x<0;gVlClaim(vl,gVlSel,x,y);gVlSel='';if(was)gVlEdit=false;gSfx('buy');gSave();gRefresh();toast(nm.e+' '+nm.n+(was?'을(를) 놓았어!':' 자리를 옮겼어!'));}
  else if(f==='map')gVlGo('vil');
  else if(f==='close')gDexModalClose();
  else if(f==='build'){var B=G_VLM[k];if(!B||vl.b[k]||B.free)return;if(g.rubies<B.build){toast('루비가 모자라 💎');return;}
    g.rubies-=B.build;vl.b[k]={x:-1,y:-1,lv:1,ut:0,np:1};gSfx('buy');gSave();gVlGo('vil');gVlT='m';gVlEdit=true;gVlSel=k;gRefresh();toast(B.e+' '+B.n+'을(를) 지었어! 놓을 자리를 골라줘');}
  else if(f==='dstart'){gVlGo('vil');gVlT='m';gVlDec=k;gRefresh();}
  else if(f==='derase'){gVlDec=(gVlDec==='erase')?(gVlLast||'p1'):'erase';gRefresh();}
  else if(f==='ddone'){gVlDec='';gRefresh();}
  else if(f==='dput'){var x2=+b.dataset.x,y2=+b.dataset.y,c=x2+','+y2;if(gVlOcc(vl,x2,y2))return;
    if(gVlDec==='erase'){delete vl.d[c];gSfx('tap');gSave();gRefresh();return;}
    var dd=G_VDC[gVlDec];if(!dd||vl.d[c]===gVlDec)return;if(g.rubies<dd.cost){toast('루비가 모자라 💎');return;}
    g.rubies-=dd.cost;vl.d[c]=gVlDec;gVlLast=gVlDec;gSfx('buy');gSave();gRefresh();}
  else if(f==='up'){var u=vl.b[k];if(!u||u.ut||u.lv>=G_VL.maxLv)return;var c3=gVlUpCost(k,u.lv);if(g.rubies<c3){toast('루비가 모자라 💎');return;}
    var ms=gVlUpMs(u.lv);g.rubies-=c3;u.ut=Date.now()+ms;gSfx('buy');gSave();gRefresh();toast('⏳ 레벨업 시작! '+gVlDur(ms)+' 걸려요');}
}
/* 1초마다: 레벨업 완료 확인 + 남은 시간 글자 갱신 (마을 화면이 열려 있을 때만 화면을 건드려요) */
function gVlTick(){
  if(!gS||!gS.vl)return;
  var msgs=gVlSync(gS);
  if(msgs.length){gSave();msgs.forEach(function(m){toast(m);});if(nav.tab==='game'&&(gSub==='vil'||gSub==='farm'||gSub==='craft'||gSub==='house'))gRefresh();return;}
  if(nav.tab!=='game'||document.hidden)return;
  if(gSub!=='vil'){gVlEdit=false;gVlSel='';gVlDec='';}
  var now=Date.now(),t=document.querySelectorAll('.gvt');for(var i=0;i<t.length;i++){var q=gS.vl.b[t[i].dataset.k];if(q&&q.ut){var s='⏳ '+gVlDur(q.ut-now);if(t[i].textContent!==s)t[i].textContent=s;}}
  var m=document.getElementById('gvmt'),ck=gVlCurB();if(m&&ck&&gS.vl.b[ck]&&gS.vl.b[ck].ut)m.textContent=gVlDur(gS.vl.b[ck].ut-now);
}
setInterval(gVlTick,1000);

/* ---- 끌어서 옮기기: 손가락을 따라 건물이 움직이고, 놓일 자리를 초록(가능)/빨강(불가능)으로 미리 보여줘요 ---- */
function gVlCellAt(px,py,off,rect){var N=G_VL.N,S=G_VL.size,cw=rect.width/N;return [Math.max(0,Math.min(N-S,Math.round((px-off.x-rect.left)/cw))),Math.max(0,Math.min(N-S,Math.round((py-off.y-rect.top)/cw)))];}
document.addEventListener('pointerdown',function(e){
  if(!gVlEdit||(e.button!=null&&e.button>0))return;var b=e.target.closest?e.target.closest('.gvb'):null;if(!b)return;
  var br=b.getBoundingClientRect();
  gVlDrag={k:b.dataset.k,el:b,map:b.parentNode,sx:e.clientX,sy:e.clientY,off:{x:e.clientX-br.left,y:e.clientY-br.top},moved:false,id:e.pointerId,ghost:null,cell:null,ok:false};
},true);
window.addEventListener('pointermove',function(e){
  var d=gVlDrag;if(!d||e.pointerId!==d.id)return;
  if(!d.moved){if(Math.abs(e.clientX-d.sx)+Math.abs(e.clientY-d.sy)<8)return;
    d.moved=true;d.el.classList.add('drag');var gh=document.createElement('i');gh.className='gvghost ok';gh.innerHTML='<span>'+G_VLM[d.k].e+'</span>';d.map.appendChild(gh);d.ghost=gh;}
  e.preventDefault();
  var rect=d.map.getBoundingClientRect(),pc=100/G_VL.N;
  d.el.style.left=((e.clientX-d.off.x-rect.left)/rect.width*100).toFixed(2)+'%';d.el.style.top=((e.clientY-d.off.y-rect.top)/rect.height*100).toFixed(2)+'%';
  var c=gVlCellAt(e.clientX,e.clientY,d.off,rect);d.cell=c;d.ok=gVlFits(gVl(),c[0],c[1],0,d.k);
  d.ghost.style.left=(c[0]*pc).toFixed(3)+'%';d.ghost.style.top=(c[1]*pc).toFixed(3)+'%';d.ghost.className='gvghost '+(d.ok?'ok':'no');
},{passive:false});
function gVlDragEnd(e,cancel){
  var d=gVlDrag;if(!d||(e&&e.pointerId!==d.id))return;gVlDrag=null;if(!d.moved)return;
  gVlNoClick=Date.now()+400;if(d.ghost&&d.ghost.parentNode)d.ghost.parentNode.removeChild(d.ghost);
  var q=gVl().b[d.k];
  if(!cancel&&d.ok&&q){gVlClaim(gVl(),d.k,d.cell[0],d.cell[1]);gVlSel='';gSfx('buy');gSave();gRefresh();toast(G_VLM[d.k].e+' '+G_VLM[d.k].n+' 자리를 옮겼어!');}
  else{gRefresh();if(!cancel)toast('거기엔 놓을 수 없어');}
}
window.addEventListener('pointerup',function(e){gVlDragEnd(e,false);});
window.addEventListener('pointercancel',function(e){gVlDragEnd(e,true);});
