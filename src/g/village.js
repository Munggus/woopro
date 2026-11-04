/* ===== 마을 (12×12 지도 · 시설 건설/레벨업/배치) ===== */
var G_VL=G_DATA.village,G_VLM={},gVlEdit=false,gVlSel='',gVlModalK='';G_VL.bld.forEach(function(b){G_VLM[b.k]=b;});
function gVlRng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
/* (x,y)에 2×2 건물을 놓을 수 있나? gap=건물 사이 띄울 칸, ex=옮기는 중인 건물(자기 자신은 무시) */
function gVlFits(vl,x,y,gap,ex){var N=G_VL.N,S=G_VL.size;if(x<0||y<0||x+S>N||y+S>N)return false;for(var k in vl.b){if(k===ex)continue;var o=vl.b[k];if(x<o.x+S+gap&&o.x<x+S+gap&&y<o.y+S+gap&&o.y<y+S+gap)return false;}return true;}
function gVlPlace(vl,k){var N=G_VL.N,S=G_VL.size;for(var gap=1;gap>=0;gap--){var c=[];for(var y=0;y+S<=N;y++)for(var x=0;x+S<=N;x++)if(gVlFits(vl,x,y,gap))c.push([x,y]);if(c.length){var p=c[Math.floor(Math.random()*c.length)];vl.b[k]={x:p[0],y:p[1],lv:1,ut:0};return true;}}return false;}
function gVlLoad(o){
  var d={seed:Math.floor(Math.random()*2147483646)+1,b:{}};
  if(o&&typeof o==='object'){
    var sd=Math.floor(gNum(o.seed,0));if(sd>0)d.seed=sd;
    if(o.b&&typeof o.b==='object')G_VL.bld.forEach(function(B){var s=o.b[B.k];if(!s||typeof s!=='object')return;var x=Math.floor(gNum(s.x,-1)),y=Math.floor(gNum(s.y,-1));if(!gVlFits(d,x,y,0))return;var lv=Math.min(G_VL.maxLv,Math.max(1,Math.floor(gNum(s.lv,1))));d.b[B.k]={x:x,y:y,lv:lv,ut:lv>=G_VL.maxLv?0:Math.max(0,gNum(s.ut,0))};});
  }
  G_VL.bld.forEach(function(B){if(B.free&&!d.b[B.k])gVlPlace(d,B.k);});
  return d;
}
function gVl(){var g=gGet();if(!g.vl)g.vl=gVlLoad(null);return g.vl;}
function gVlLv(k){var vl=gVl(),q=vl.b[k];return q?q.lv:1;}
function gVlEff(k,lv){var mx=G_VL.maxLv;
  if(k==='plot'){var ok=G_CROP.filter(function(c){return c.rv<=lv;}).map(function(c){return c.e;}).join(' '),nx=G_CROP.filter(function(c){return c.rv===lv+1;})[0];return '심을 수 있는 작물: '+ok+(nx&&lv<mx?'<br>다음 레벨: '+nx.e+' '+nx.n+' '+gStars(nx.rv):'');}
  if(k==='farm')return '동물들이 만드는 생산물 품질: '+gStars(lv)+(lv<mx?' → 다음 레벨 '+gStars(lv+1):'');
  return '';}
function gVlUpCost(k,l){return Math.ceil(G_VLM[k].up*Math.pow(G_VL.upG,l-1));}
/* 레벨업 걸리는 시간: Lv1→2는 upMin분, 마지막(5→6)은 upMax분, 그 사이는 곱셈으로 점점 늘어남 */
function gVlUpMs(l){return Math.round(G_VL.upMin*Math.pow(G_VL.upMax/G_VL.upMin,(l-1)/(G_VL.maxLv-2)))*60000;}
function gVlDur(ms){var s=Math.max(0,Math.ceil(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),r=s%60;return d?d+'일 '+h+'시간':h?h+'시간 '+m+'분':m?m+'분 '+r+'초':r+'초';}
function gVlSync(g){var vl=g.vl,now=Date.now(),msgs=[];if(!vl)return msgs;G_VL.bld.forEach(function(B){var q=vl.b[B.k];if(q&&q.ut&&now>=q.ut){q.lv=Math.min(G_VL.maxLv,q.lv+1);q.ut=0;msgs.push(B.e+' '+B.n+' Lv.'+q.lv+' 완성! 🎉');}});return msgs;}
var gVlDrag=null,gVlNoClick=0;
function gVlMapHtml(g){
  var vl=g.vl,N=G_VL.N,S=G_VL.size,occ={},k,o,dx,dy,now=Date.now();
  for(k in vl.b){o=vl.b[k];for(dx=0;dx<S;dx++)for(dy=0;dy<S;dy++)occ[(o.x+dx)+','+(o.y+dy)]=1;}
  var rnd=gVlRng(vl.seed),D=G_VL.decor,h='<div class="gvm"><div class="gvmi'+(gVlEdit?' ed':'')+'">',pc=100/N;
  for(var y=0;y<N;y++)for(var x=0;x<N;x++){var r=rnd(),r2=rnd();if(!occ[x+','+y]&&r<G_VL.decorP)h+='<i class="gvd" style="left:'+(x*pc).toFixed(3)+'%;top:'+(y*pc).toFixed(3)+'%">'+D[Math.floor(r2*D.length)]+'</i>';}
  if(gVlEdit&&gVlSel&&vl.b[gVlSel]){for(var cy=0;cy+S<=N;cy++)for(var cx=0;cx+S<=N;cx++)if(gVlFits(vl,cx,cy,0,gVlSel))h+='<button class="gvcell" style="left:'+(cx*pc).toFixed(3)+'%;top:'+(cy*pc).toFixed(3)+'%" data-act="gvil" data-f="put" data-x="'+cx+'" data-y="'+cy+'" aria-label="여기에 놓기"></button>';}
  G_VL.bld.forEach(function(B){var q=vl.b[B.k];if(!q)return;
    var lab=(q.ut?'<small class="gvt" data-k="'+B.k+'">⏳ '+gVlDur(q.ut-now)+'</small>':'<small>Lv.'+q.lv+'</small>');
    h+='<button class="gvb'+(gVlSel===B.k?' sel':'')+'" style="left:'+(q.x*pc).toFixed(3)+'%;top:'+(q.y*pc).toFixed(3)+'%" data-act="gvil" data-f="bld" data-k="'+B.k+'"><span class="gve">'+B.e+'</span><b>'+B.n+'</b>'+lab+'</button>';});
  return h+'</div></div>';
}
function gVlCard(g){
  var vl=gVl();gVlSync(g);
  var h='<div class="gvh"><h2>🏡 우리 마을</h2><button class="mini'+(gVlEdit?' on':'')+'" data-act="gvil" data-f="edit">'+(gVlEdit?'✅ 완료':'🛠️ 배치 바꾸기')+'</button></div>'+gVlMapHtml(g)
   +'<p class="hint" style="font-size:12px">'+(gVlEdit?(gVlSel?'<b>'+G_VLM[gVlSel].n+'</b>을(를) 놓을 자리(밝은 칸)를 눌러! 칸이 건물의 왼쪽 위가 돼.':'건물을 <b>꾹 끌어서</b> 옮겨봐! 놓을 자리가 초록색으로 보여.'):'건물을 누르면 안으로 들어가요!')+'</p>',rows='';
  G_VL.bld.forEach(function(B){if(B.free||vl.b[B.k])return;
    rows+='<div class="gvc"><span class="gvce">'+B.e+'</span><div><b>'+B.n+'</b><small>'+B.d+'</small></div><button class="mini rb" data-act="gvil" data-f="build" data-k="'+B.k+'">'+gRuby(14)+' '+B.build+' 짓기</button></div>';});
  return h+(rows?'<h3 class="gcph">🏗️ 지을 수 있는 시설</h3>'+rows:'<p class="hint">모든 시설을 지었어! 🎉</p>')+gMatPanel(g);
}
function gVlGo(sub,t){gDexModalClose();gVlEdit=false;gVlSel='';if(t)gFmT=t;gSub=sub;gApplyMode(true);gRefresh();var m=$('main');if(m)m.scrollTop=0;}
function gVlModal(k){
  var g=gGet(),vl=gVl(),B=G_VLM[k],q=vl.b[k];if(!B||!q)return;gVlModalK=k;gVlSync(g);
  var mx=q.lv>=G_VL.maxLv,cost=mx?0:gVlUpCost(k,q.lv),ms=mx?0:gVlUpMs(q.lv),body;
  if(mx)body='<button class="btn sm" disabled>레벨 MAX</button>';
  else if(q.ut)body='<p class="hint">⏳ Lv.'+q.lv+' → Lv.'+(q.lv+1)+' 레벨업 중!<br>남은 시간 <b id="gvmt">'+gVlDur(q.ut-Date.now())+'</b></p>';
  else body='<button class="btn sm gevob gvub" data-act="gvil" data-f="up" data-k="'+k+'">'+gRuby(14)+'<span>'+gFmt(cost)+' · Lv.'+q.lv+' → Lv.'+(q.lv+1)+'</span></button><p class="hint" style="font-size:12px">⏱️ 걸리는 시간 '+gVlDur(ms)+'</p>';
  var enter=(k==='farm'||k==='plot'),eff=gVlEff(k,q.lv);
  gFModal('<h3>'+B.e+' '+B.n+' <small>Lv.'+q.lv+'/'+G_VL.maxLv+'</small></h3><p class="hint">'+B.d+'</p>'+(enter?'<p class="hint" style="font-size:13px">'+eff+'</p><button class="btn sm gevob" style="margin-bottom:8px" data-act="gvil" data-f="enter" data-k="'+k+'">🚪 들어가기</button>':'<p class="hint" style="font-size:12px">🔒 여기서 만들 수 있는 것들은 곧 열릴 거야. 지금은 레벨을 올려둘 수 있어!</p>')+body+'<button class="mini" style="margin-top:8px" data-act="gvil" data-f="close">닫기</button>');
}
function gvDo(b){
  var f=b.dataset.f,k=b.dataset.k,g=gGet(),vl=gVl();
  if(f==='bld'){
    if(Date.now()<gVlNoClick)return;
    if(gVlEdit){gVlSel=(gVlSel===k)?'':k;gRefresh();return;}
    gVlModal(k);}
  else if(f==='enter'){gVlGo('farm',k==='farm'?'a':'f');}
  else if(f==='edit'){gVlEdit=!gVlEdit;gVlSel='';gRefresh();}
  else if(f==='put'){var q=vl.b[gVlSel];if(!q)return;var x=+b.dataset.x,y=+b.dataset.y;if(!gVlFits(vl,x,y,0,gVlSel)){toast('거기엔 놓을 수 없어');return;}
    q.x=x;q.y=y;var nm=G_VLM[gVlSel];gVlSel='';gSfx('buy');gSave();gRefresh();toast(nm.e+' '+nm.n+' 자리를 옮겼어!');}
  else if(f==='map')gVlGo('vil');
  else if(f==='close')gDexModalClose();
  else if(f==='build'){var B=G_VLM[k];if(!B||vl.b[k]||B.free)return;if(g.rubies<B.build){toast('루비가 모자라 💎');return;}
    if(!gVlPlace(vl,k)){toast('마을에 빈 자리가 없어요');return;}
    g.rubies-=B.build;gSfx('buy');gSave();gRefresh();toast(B.e+' '+B.n+'을(를) 지었어!');}
  else if(f==='up'){var u=vl.b[k];if(!u||u.ut||u.lv>=G_VL.maxLv)return;var c=gVlUpCost(k,u.lv);if(g.rubies<c){toast('루비가 모자라 💎');return;}
    var ms=gVlUpMs(u.lv);g.rubies-=c;u.ut=Date.now()+ms;gSfx('buy');gSave();gRefresh();gVlModal(k);toast('⏳ 레벨업 시작! '+gVlDur(ms)+' 걸려요');}
}
/* 1초마다: 레벨업 완료 확인 + 남은 시간 글자 갱신 (마을 화면이 열려 있을 때만 화면을 건드려요) */
function gVlTick(){
  if(!gS||!gS.vl)return;
  var msgs=gVlSync(gS);
  if(msgs.length){gSave();msgs.forEach(function(m){toast(m);});if(nav.tab==='game'&&gSub==='vil')gRefresh();var md=document.getElementById('gdm');if(md)gDexModalClose();return;}
  if(nav.tab!=='game'||document.hidden)return;
  if(gSub!=='vil'){gVlEdit=false;gVlSel='';return;}
  var now=Date.now(),t=document.querySelectorAll('.gvt');for(var i=0;i<t.length;i++){var q=gS.vl.b[t[i].dataset.k];if(q&&q.ut){var s='⏳ '+gVlDur(q.ut-now);if(t[i].textContent!==s)t[i].textContent=s;}}
  var m=document.getElementById('gvmt');if(m&&gVlModalK&&gS.vl.b[gVlModalK]&&gS.vl.b[gVlModalK].ut)m.textContent=gVlDur(gS.vl.b[gVlModalK].ut-now);
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
  if(!cancel&&d.ok&&q){q.x=d.cell[0];q.y=d.cell[1];gVlSel='';gSfx('buy');gSave();gRefresh();toast(G_VLM[d.k].e+' '+G_VLM[d.k].n+' 자리를 옮겼어!');}
  else{gRefresh();if(!cancel)toast('거기엔 놓을 수 없어');}
}
window.addEventListener('pointerup',function(e){gVlDragEnd(e,false);});
window.addEventListener('pointercancel',function(e){gVlDragEnd(e,true);});
