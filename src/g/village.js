/* ===== 마을 (12×12 지도 · 시설 건설/레벨업) ===== */
var G_VL=G_DATA.village,G_VLM={};G_VL.bld.forEach(function(b){G_VLM[b.k]=b;});
function gVlRng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function gVlFits(vl,x,y,gap){var N=G_VL.N,S=G_VL.size;if(x<0||y<0||x+S>N||y+S>N)return false;for(var k in vl.b){var o=vl.b[k];if(x<o.x+S+gap&&o.x<x+S+gap&&y<o.y+S+gap&&o.y<y+S+gap)return false;}return true;}
/* 빈 자리 중 아무 데나 (가능하면 건물 사이에 한 칸 띄워서) */
function gVlPlace(vl,k){var N=G_VL.N,S=G_VL.size;for(var gap=1;gap>=0;gap--){var c=[];for(var y=0;y+S<=N;y++)for(var x=0;x+S<=N;x++)if(gVlFits(vl,x,y,gap))c.push([x,y]);if(c.length){var p=c[Math.floor(Math.random()*c.length)];vl.b[k]={x:p[0],y:p[1],lv:1};return true;}}return false;}
function gVlLoad(o){
  var d={seed:Math.floor(Math.random()*2147483646)+1,b:{}};
  if(o&&typeof o==='object'){
    var sd=Math.floor(gNum(o.seed,0));if(sd>0)d.seed=sd;
    if(o.b&&typeof o.b==='object')G_VL.bld.forEach(function(B){var s=o.b[B.k];if(!s||typeof s!=='object')return;var x=Math.floor(gNum(s.x,-1)),y=Math.floor(gNum(s.y,-1));if(!gVlFits(d,x,y,0))return;d.b[B.k]={x:x,y:y,lv:Math.min(G_VL.maxLv,Math.max(1,Math.floor(gNum(s.lv,1))))};});
  }
  G_VL.bld.forEach(function(B){if(B.free&&!d.b[B.k])gVlPlace(d,B.k);});
  return d;
}
function gVl(){var g=gGet();if(!g.vl)g.vl=gVlLoad(null);return g.vl;}
function gVlUpCost(k,l){return Math.ceil(G_VLM[k].up*Math.pow(G_VL.upG,l-1));}
function gVlMapHtml(g){
  var vl=g.vl,N=G_VL.N,S=G_VL.size,occ={},k,o,dx,dy;
  for(k in vl.b){o=vl.b[k];for(dx=0;dx<S;dx++)for(dy=0;dy<S;dy++)occ[(o.x+dx)+','+(o.y+dy)]=1;}
  var rnd=gVlRng(vl.seed),D=G_VL.decor,h='<div class="gvm"><div class="gvmi">',pc=100/N;
  for(var y=0;y<N;y++)for(var x=0;x<N;x++){var r=rnd(),r2=rnd();if(!occ[x+','+y]&&r<G_VL.decorP)h+='<i class="gvd" style="left:'+(x*pc).toFixed(3)+'%;top:'+(y*pc).toFixed(3)+'%">'+D[Math.floor(r2*D.length)]+'</i>';}
  G_VL.bld.forEach(function(B){var q=vl.b[B.k];if(!q)return;h+='<button class="gvb" style="left:'+(q.x*pc).toFixed(3)+'%;top:'+(q.y*pc).toFixed(3)+'%" data-act="gvil" data-f="bld" data-k="'+B.k+'"><span class="gve">'+B.e+'</span><b>'+B.n+'</b>'+(B.free?'':'<small>Lv.'+q.lv+'</small>')+'</button>';});
  return h+'</div></div>';
}
function gVlCard(g){
  var vl=gVl(),h='<h2>🏡 우리 마을</h2>'+gVlMapHtml(g)+'<p class="hint" style="font-size:12px">건물을 누르면 안으로 들어가요!</p>',rows='';
  G_VL.bld.forEach(function(B){if(B.free||vl.b[B.k])return;
    rows+='<div class="gvc"><span class="gvce">'+B.e+'</span><div><b>'+B.n+'</b><small>'+B.d+'</small></div><button class="mini rb" data-act="gvil" data-f="build" data-k="'+B.k+'">'+gRuby(14)+' '+B.build+' 짓기</button></div>';});
  return h+(rows?'<h3 class="gcph">🏗️ 지을 수 있는 시설</h3>'+rows:'<p class="hint">모든 시설을 지었어! 🎉</p>');
}
function gVlGo(sub,t){gDexModalClose();if(t)gFmT=t;gSub=sub;gApplyMode(true);gRefresh();var m=$('main');if(m)m.scrollTop=0;}
function gVlModal(k){
  var g=gGet(),vl=gVl(),B=G_VLM[k],q=vl.b[k];if(!B||!q)return;
  var mx=q.lv>=G_VL.maxLv,cost=mx?0:gVlUpCost(k,q.lv);
  gFModal('<h3>'+B.e+' '+B.n+' <small>Lv.'+q.lv+'/'+G_VL.maxLv+'</small></h3><p class="hint">'+B.d+'</p><p class="hint" style="font-size:12px">🔒 여기서 만들 수 있는 것들은 곧 열릴 거야. 지금은 레벨을 올려둘 수 있어!</p>'
    +(mx?'<button class="btn sm" disabled>레벨 MAX</button>':'<button class="btn sm gevob gvub" data-act="gvil" data-f="up" data-k="'+k+'">'+gRuby(14)+'<span>'+gFmt(cost)+' · Lv.'+q.lv+' → Lv.'+(q.lv+1)+'</span></button>')
    +'<button class="mini" style="margin-top:8px" data-act="gvil" data-f="close">닫기</button>');
}
function gvDo(b){
  var f=b.dataset.f,k=b.dataset.k,g=gGet(),vl=gVl();
  if(f==='bld'){if(k==='farm')gVlGo('farm','a');else if(k==='plot')gVlGo('farm','f');else gVlModal(k);}
  else if(f==='map')gVlGo('vil');
  else if(f==='close')gDexModalClose();
  else if(f==='build'){var B=G_VLM[k];if(!B||vl.b[k]||B.free)return;if(g.rubies<B.build){toast('루비가 모자라 💎');return;}
    if(!gVlPlace(vl,k)){toast('마을에 빈 자리가 없어요');return;}
    g.rubies-=B.build;gSfx('buy');gSave();gRefresh();toast(B.e+' '+B.n+'을(를) 지었어!');}
  else if(f==='up'){var q=vl.b[k];if(!q||q.lv>=G_VL.maxLv)return;var c=gVlUpCost(k,q.lv);if(g.rubies<c){toast('루비가 모자라 💎');return;}
    g.rubies-=c;q.lv++;gSfx('buy');gSave();gRefresh();gVlModal(k);toast(G_VLM[k].e+' '+G_VLM[k].n+' Lv.'+q.lv+' 🎉');}
}
