/* ===== 제작: 요리사(요리) · 대장간(무기) · 재봉소(코스튬) ===== */
var G_CR=G_DATA.craft,G_CRI={},gCrK='cook';G_CR.items.forEach(function(it){G_CRI[it.id]=it;});
var G_CRKN={atk:'공격력',inc:'하트 수입',spd:'공격 속도',ult:'필살기 위력'};
var G_CRSL={w:'무기',hat:'모자',out:'옷'};
function gCrSlot(it){return it.f==='smith'?'w':it.slot;}
function gDay(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function gCx(g){g=g||gGet();if(!g.cr)g.cr={};if(!g.eq)g.eq={w:'',hat:'',out:''};if(!g.cq)g.cq={};if(!g.bf)g.bf={};if(!g.vu)g.vu={};if(!g.vx)g.vx={col:'',spk:0,asz:0,hsz:0};if(!g.cd)g.cd={};return g;}
function gCrLoad(o,d){
  d.cr={};d.eq={w:'',hat:'',out:''};d.cq={};d.bf={};d.vu={};d.vx={col:'',spk:0,asz:0,hsz:0};d.cd={};d.sp='';d.tf='';
  if(!o||typeof o!=='object')return;
  if(o.cr&&typeof o.cr==='object')Object.keys(o.cr).forEach(function(id){if(G_CRI[id]){var n=Math.min(9999,Math.max(0,Math.floor(gNum(o.cr[id],0))));if(n)d.cr[id]=n;}});
  if(o.eq&&typeof o.eq==='object')['w','hat','out'].forEach(function(s){var id=o.eq[s];if(id&&G_CRI[id]&&d.cr[id]>0&&gCrSlot(G_CRI[id])===s)d.eq[s]=id;});
  if(o.cq&&typeof o.cq==='object')Object.keys(o.cq).forEach(function(f){var q=o.cq[f];if(q&&G_CRI[q.id]&&G_CRI[q.id].f===f)d.cq[f]={id:q.id,end:gNum(q.end,0)};});
  if(o.bf&&typeof o.bf==='object')Object.keys(G_BFV).forEach(function(k){var t=gNum(o.bf[k],0);if(t>Date.now())d.bf[k]=Math.min(t,Date.now()+259200000);});
  if(o.vu&&typeof o.vu==='object')Object.keys(o.vu).forEach(function(id){if(G_CRI[id]&&G_CRI[id].ef&&G_CRI[id].ef.t==='vis')d.vu[id]=1;});
  if(o.cd&&typeof o.cd==='object')Object.keys(o.cd).forEach(function(id){if(G_CRI[id]&&G_CRI[id].f==='cook')d.cd[id]=1;});
  var x=o.vx||{};if(['sky','fire','rb','gold'].indexOf(x.col)>=0&&gCrVuHas(d,'col',x.col))d.vx.col=x.col;
  ['spk','asz','hsz'].forEach(function(k){if(x[k]&&gCrVuHas(d,k,1))d.vx[k]=1;});
  d.sp=typeof o.sp==='string'?o.sp.slice(0,12):'';d.tf=typeof o.tf==='string'?o.tf.slice(0,12):'';
}
function gCrVuHas(g,s,v){return G_CR.items.some(function(it){return it.ef&&it.ef.t==='vis'&&it.ef.s===s&&it.ef.v===v&&g.vu[it.id];});}
/* 요리 효과: 먹으면 일정 시간 켜지는 버프 (전투 능력치 아님) */
var G_BFV={},G_BFT={off:function(v){return '오프라인 수익 +'+Math.round(v*100)+'%';},drop:function(v){return '재료 드랍 확률 +'+Math.round(v*100)+'%';},cts:function(v){return '제작 시간 -'+Math.round(v*100)+'%';},harv:function(v){return '수확 때 추가 수확 확률 +'+Math.round(v*100)+'%p';},upg:function(v){return '건물 레벨업 시간 -'+Math.round(v*100)+'%';},dq:function(v){return '고품질 재료 확률 ×'+(1+v);},stk:function(v){return '연속 운동 유예 +'+v+'일';},cap:function(v){return '오프라인 보관 한도 +'+(v/3600)+'시간';}};
G_CR.items.forEach(function(it){if(it.ef&&it.ef.t==='buff')G_BFV[it.ef.k]=it.ef.v;});
function gBfOn(k,t){var g=gS;return !!(g&&g.bf&&g.bf[k]>(t||Date.now()));}
function gBfV(k,t){return gBfOn(k,t)?(G_BFV[k]||0):0;}
function gBfAdd(g,k,ms){var now=Date.now();g.bf[k]=Math.min(now+259200000,Math.max(now,g.bf[k]||0)+ms);}
function gCrDexDone(g){return Object.keys(g.cd).length>=G_CR.items.filter(function(i){return i.f==='cook';}).length;}
function gCrFav(){var d=gDay(),h=0,i,P=G_CR.items.filter(function(it){return it.ef&&it.ef.t==='buff';});for(i=0;i<d.length;i++)h=(h*31+d.charCodeAt(i))%9973;return P[h%P.length];}
/* 능력치 보너스: 먹은 요리(영구) + 장착한 무기. 공식(core2)이 (1+보너스)로 곱해요 */
function gWeapB(g,k){var w=g.eq&&g.eq.w&&G_CRI[g.eq.w];return (w&&w.fx&&w.fx[k])||0;}
function gGearB(g,k){return gWeapB(g,k);}
/* 재료 확인/사용: 사냥·농장 생산물은 품질별 창고, 작물은 밭 창고 */
function gCrHave(key,q){if(G_MTM[key])return gMt()[key][q-1]||0;return G_CRM[key]?(gFm().inv[key]||0):0;}
function gCrTake(key,q,n){if(G_MTM[key])gMt()[key][q-1]-=n;else gFm().inv[key]-=n;}
function gCrChip(m){var have=gCrHave(m[0],m[1]),mt=G_MTM[m[0]],e=mt?mt.e:G_CRM[m[0]].e,q=mt?m[1]:G_CRM[m[0]].rv;return '<span class="gmc '+(have>=m[2]?'ok':'no')+'">'+e+gStars(q)+' <b>'+have+'/'+m[2]+'</b></span>';}
function gCrFxTxt(it){
  if(it.f==='tailor')return G_CRSL[it.slot]+' · 보기 전용';
  if(it.f==='cook'){var e=it.ef;
    if(e.t==='buff')return G_BFT[e.k](e.v)+' ('+e.h+'시간)';
    if(e.t==='ext')return '켜져 있는 효과 전부 +'+e.h+'시간';
    if(e.t==='taste')return '오늘 세은이가 제일 좋아하는 요리를 알려줘요';
    if(e.t==='special')return '하루 1번 · 모든 효과를 '+e.h+'시간 동안 한꺼번에';
    return {col:'오라 색깔 바꾸기',spk:'별가루 이펙트',asz:'오라 크게',hsz:'세은이 크게'}[e.s]+' · 보기 전용 (한 번 먹으면 영구)';}
  var k=Object.keys(it.fx),t=k.map(function(x){return G_CRKN[x]+' +'+(Math.round(it.fx[x]*1000)/10)+'%';}).join(', ');
  return '장착하면 '+t;
}
function gCrSync(g){
  var msgs=[],now=Date.now();if(!g||!g.cq)return msgs;
  Object.keys(g.cq).forEach(function(f){var q=g.cq[f];if(q&&now>=q.end){var it=G_CRI[q.id];g.cr[q.id]=Math.min(9999,(g.cr[q.id]||0)+1);delete g.cq[f];msgs.push(it.e+' '+it.n+' 완성! 🎉');}});
  return msgs;
}
function gCrRow(g,it,fl,busy){
  var own=g.cr[it.id]||0,lock=it.lv>fl,okm=it.mat.every(function(m){return gCrHave(m[0],m[1])>=m[2];}),vis=it.f==='cook'&&it.ef.t==='vis',got=vis&&g.vu[it.id],can=!lock&&!busy&&okm&&!got,eqd=g.eq[gCrSlot(it)]===it.id;
  var act='',fav=it.f==='cook'&&g.tf===gDay()&&gCrFav().id===it.id;
  if(it.f==='cook'){
    if(got){var on=it.ef.s==='col'?g.vx.col===it.ef.v:!!g.vx[it.ef.s];act='<button class="mini'+(on?' on':'')+'" data-act="gcr" data-f="vt" data-id="'+it.id+'">'+(on?'✔ 켜짐':'켜기')+'</button>';}
    else if(own)act='<button class="mini" data-act="gcr" data-f="eat" data-id="'+it.id+'">🍽️ 먹기 ('+own+')</button>';
  }else if(own)act='<button class="mini'+(eqd?' on':'')+'" data-act="gcr" data-f="eq" data-id="'+it.id+'">'+(eqd?'✔ 착용 중':'착용')+'</button>';
  return '<div class="gcrr'+(lock?' lock':'')+'"><span class="gcre">'+it.e+'</span><div class="gcrt"><b>'+it.n+'</b>'+(fav?' <span class="gfav">💗 오늘 최애</span>':'')+(g.cd[it.id]?' <small style="display:inline">📖</small>':'')+' <small>'+it.d+'</small><small class="gcfx">'+gCrFxTxt(it)+'</small><div class="gmq">'+it.mat.map(gCrChip).join('')+'</div><small>⏱️ '+gVlDur(it.min*60000)+(own&&it.f!=='cook'?' · 보유 '+own:'')+'</small></div><div class="gcra">'
    +(lock?'<small>🔒 Lv.'+it.lv+'</small>':got?'<small>✅ 획득</small>':'<button class="mini rb" data-act="gcr" data-f="make" data-id="'+it.id+'"'+(can?'':' disabled')+'>만들기</button>')+act+'</div></div>';
}
function gCrBuffList(g){
  var now=Date.now(),a=Object.keys(g.bf).filter(function(k){return g.bf[k]>now;});
  if(!a.length)return '<p class="hint" style="font-size:12px">🍽️ 켜져 있는 요리 효과가 없어. 만들어서 먹여보자!</p>';
  return '<div class="gbfl">'+a.map(function(k){return '<span class="gbf">'+G_BFT[k](G_BFV[k])+' <b>'+gVlDur(g.bf[k]-now)+'</b></span>';}).join('')+'</div>';
}
function gCrCard(g){
  gCx(g);var B=G_VLM[gCrK],fl=gVlLv(gCrK),q=g.cq[gCrK],h='<button class="mini gvbk" data-act="gvil" data-f="map">🏡 마을로</button><div class="gvh"><h2>'+B.e+' '+B.n+' <small>Lv.'+fl+'</small></h2></div>'+gVlUpHtml(gCrK);
  if(q){var it=G_CRI[q.id];h+='<div class="gcq"><span class="gcre">'+it.e+'</span><div><b>'+it.n+' 만드는 중…</b><br><small>남은 시간 <b class="gcqt">'+gVlDur(q.end-Date.now())+'</b></small></div></div>';}
  else h+='<p class="hint">지금은 쉬는 중이야. 아래에서 만들 걸 골라봐!</p>';
  if(gCrK==='cook'){var nd=Object.keys(g.cd).length,tot=G_CR.items.filter(function(i){return i.f==='cook';}).length;h+=gCrBuffList(g)+'<p class="hint" style="font-size:12px">📖 맛 도감 '+nd+'/'+tot+(gCrDexDone(g)?' · 완성! 모든 효과 지속시간 +50% 🎉':' · 전부 먹어보면 모든 효과 지속시간 +50%')+'<br>💗 세은이가 좋아하는 요리를 먹이면 효과 시간이 2배! ('+(g.tf===gDay()?'오늘은 '+gCrFav().e+' '+gCrFav().n:'오늘 최애는 비밀 — 🥘 세은이 입맛 정식을 먹이면 알려줘')+')</p>';}
  else if(gCrK==='smith'){var w=G_CRI[g.eq.w];h+='<p class="hint" style="font-size:12px">⚔️ 착용한 무기: '+(w?w.e+' '+w.n+' ('+gCrFxTxt(w)+')':'없음')+'</p>';}
  else{var a=G_CRI[g.eq.hat],c=G_CRI[g.eq.out];h+='<p class="hint" style="font-size:12px">🧵 입고 있는 코스튬: 모자 '+(a?a.e+' '+a.n:'없음')+' · 옷 '+(c?c.e+' '+c.n:'없음')+' (모자 1개 + 옷 1개)</p>';}
  for(var lv=1;lv<=G_VL.maxLv;lv++){
    h+='<h3 class="gcph'+(lv>fl?' lk':'')+'">Lv.'+lv+(lv>fl?' 🔒':'')+'</h3>';
    G_CR.items.forEach(function(it){if(it.f===gCrK&&it.lv===lv)h+=gCrRow(g,it,fl,!!q);});
  }
  return h+'<p class="hint" style="font-size:12px">재료는 사냥(층마다 품질이 달라져)과 텃밭·농장에서 모아요. 높은 레벨 건물일수록 더 좋은 걸 만들어요.</p>';
}
function gCrMake(id){
  var g=gCx(),it=G_CRI[id];if(!it)return;var fl=gVlLv(it.f);
  if(it.lv>fl){toast('🔒 '+G_VLM[it.f].n+' Lv.'+it.lv+'이 필요해');return;}
  if(g.cq[it.f]){toast('지금 다른 걸 만드는 중이야');return;}
  if(!it.mat.every(function(m){return gCrHave(m[0],m[1])>=m[2];})){toast('재료가 모자라 🎒');return;}
  it.mat.forEach(function(m){gCrTake(m[0],m[1],m[2]);});
  var ms=Math.round(it.min*60000*(1-gBfV('cts')));g.cq[it.f]={id:id,end:Date.now()+ms};gSfx('buy');gSave();gRefresh();toast(it.e+' 만들기 시작! ('+gVlDur(ms)+')');
}
var G_FDL=['냠냠냠~ 맛있다아! 😋','우와~ 완전 최고야! 💖','배불러~ 기분 좋아! 🥰','또 먹고 싶다~ 히히 😆','쪽쪽~ 힘이 막 솟아나! 💪','세은이 행복해~ 🌈'];
function gFeedScene(g,it,line,sub){
  var old=document.getElementById('gfeed');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var el=document.createElement('div');el.id='gfeed';el.className='gfeed';
  var hs='';for(var i=0;i<7;i++)hs+='<i style="--x:'+(10+i*13)+'%;--d:'+(i*.18).toFixed(2)+'s">'+['💖','✨','💗','⭐'][i%4]+'</i>';
  el.innerHTML='<div class="gfc"><div class="gfb">'+line+'</div><div class="gfh"><img src="'+gFront(gFormLv(g))+'" alt=""><span class="gff">'+it.e+'</span></div><div class="gfs">'+sub+'</div>'+hs+'</div>';
  function cl(){if(el.parentNode)el.parentNode.removeChild(el);}
  el.addEventListener('click',cl);setTimeout(cl,3600);document.body.appendChild(el);
}
function gCrEat(id){
  var g=gCx(),it=G_CRI[id];if(!it||it.f!=='cook'||!(g.cr[id]>0))return;
  var e=it.ef,sub='',line=G_FDL[Math.floor(Math.random()*G_FDL.length)],today=gDay(),fav=gCrFav(),isFav=fav.id===id,m=(gCrDexDone(g)?1.5:1)*(isFav?2:1),i;
  if(e.t==='buff'){gBfAdd(g,e.k,e.h*3600000*m);sub=G_BFT[e.k](e.v)+' · '+gVlDur(e.h*3600000*m)+(isFav?' (최애라 2배!)':'');}
  else if(e.t==='ext'){var ks=Object.keys(g.bf).filter(function(k){return g.bf[k]>Date.now();});if(!ks.length){toast('켜져 있는 효과가 없어서 아직 못 먹어! 먼저 다른 요리부터 😋');return;}ks.forEach(function(k){g.bf[k]+=e.h*3600000;});sub='켜져 있는 효과 '+ks.length+'개가 +'+e.h+'시간!';}
  else if(e.t==='special'){if(g.sp===today){toast('오늘의 특식은 하루에 한 번만! 내일 또 먹자 🎂');return;}g.sp=today;Object.keys(G_BFV).forEach(function(k){gBfAdd(g,k,e.h*3600000*(gCrDexDone(g)?1.5:1));});sub='모든 요리 효과 '+e.h+'시간!';}
  else if(e.t==='taste'){g.tf=today;line='오늘은 '+fav.e+' '+fav.n+'가 제일 좋아! 😍';sub='💗 오늘 세은이 최애: '+fav.n;}
  else if(e.t==='vis'){g.vu[id]=1;if(e.s==='col')g.vx.col=e.v;else g.vx[e.s]=1;sub='✨ 영구 획득! '+gCrFxTxt(it).split(' · ')[0];}
  if(isFav&&e.t==='buff')line='어머 내 최애다!! 💗💗';
  var nw=!g.cd[id];if(nw){g.cd[id]=1;sub+=(sub?'<br>':'')+'📖 맛 도감 등록! ('+Object.keys(g.cd).length+'/18)';}
  g.cr[id]--;gSfx('coin');gSave();gRefresh();gFeedScene(g,it,line,sub);
}
function gCrVt(id){
  var g=gCx(),it=G_CRI[id];if(!it||!it.ef||it.ef.t!=='vis'||!g.vu[id])return;var e=it.ef;
  if(e.s==='col')g.vx.col=(g.vx.col===e.v)?'':e.v;else g.vx[e.s]=g.vx[e.s]?0:1;
  gSfx('tap');gSave();gRefresh();toast(it.e+' '+it.n+((e.s==='col'?g.vx.col===e.v:g.vx[e.s])?' 켰어!':' 껐어'));
}
function gCrEq(id){
  var g=gCx(),it=G_CRI[id];if(!it||it.f==='cook'||!(g.cr[id]>0))return;var s=gCrSlot(it);
  g.eq[s]=(g.eq[s]===id)?'':id;gSfx('tap');gSave();gRefresh();toast(g.eq[s]?it.e+' '+it.n+' 착용!':'해제했어');
}
function gcrDo(b){var f=b.dataset.f,id=b.dataset.id;if(f==='make')gCrMake(id);else if(f==='eat')gCrEat(id);else if(f==='vt')gCrVt(id);else if(f==='eq')gCrEq(id);}
/* 코스튬: 세은이에게 이모지로 보여줘요 (임시 그림) */
function gCosHtml(g){var e=g.eq||{},h='';if(e.out&&G_CRI[e.out])h+='<i class="gcos out">'+G_CRI[e.out].e+'</i>';if(e.hat&&G_CRI[e.hat])h+='<i class="gcos hat">'+G_CRI[e.hat].e+'</i>';return h;}
function gCrTick(){
  if(!gS||!gS.cq)return;
  var m=gCrSync(gS);
  if(m.length){gSave();m.forEach(function(x){toast(x);});if(nav.tab==='game'&&gSub==='craft')gRefresh();return;}
  if(nav.tab!=='game'||gSub!=='craft'||document.hidden)return;
  var q=gS.cq[gCrK],e=document.querySelector('.gcqt');if(q&&e){var s=gVlDur(q.end-Date.now());if(e.textContent!==s)e.textContent=s;}
}
setInterval(gCrTick,1000);

/* 세은이 주변 이펙트 (요리로 얻은 보기 전용 효과) */
function gFxHtml(g){
  var x=g.vx||{},c=x.col,h='';if(!c&&!x.spk)return '';
  var col={sky:'#5ec8ff',fire:'#ff7043',gold:'#ffd54a',rb:'#ff80ab'}[c]||'#fff';
  h='<div class="gvfx'+(c==='rb'?' rb':'')+(c==='fire'?' fire':'')+'" style="--vc:'+col+';--as:'+(x.asz?1.45:1)+'">';
  if(c)h+='<i class="vg"></i>';
  if(c==='fire')for(var i=0;i<5;i++)h+='<span class="vf" style="--a:'+(i*72)+'deg;--d:'+(i*.35)+'s">🔥</span>';
  if(x.spk)for(var j=0;j<6;j++)h+='<span class="vs" style="--a:'+(j*60+15)+'deg;--d:'+(j*.4)+'s">'+(j%2?'⭐':'✨')+'</span>';
  return h+'</div>';
}
