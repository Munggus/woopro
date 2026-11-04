/* ===== 제작: 요리사(요리) · 대장간(무기) · 재봉소(코스튬) ===== */
var G_CR=G_DATA.craft,G_CRI={},gCrK='cook';G_CR.items.forEach(function(it){G_CRI[it.id]=it;});
var G_CRKN={atk:'공격력',inc:'하트 수입',spd:'공격 속도',ult:'필살기 위력'};
var G_CRSL={w:'무기',hat:'모자',out:'옷'};
function gCrSlot(it){return it.f==='smith'?'w':it.slot;}
function gCx(g){g=g||gGet();if(!g.cr)g.cr={};if(!g.eq)g.eq={w:'',hat:'',out:''};if(!g.fd)g.fd={atk:0,inc:0,spd:0};if(!g.cq)g.cq={};return g;}
function gCrLoad(o,d){
  d.cr={};d.eq={w:'',hat:'',out:''};d.fd={atk:0,inc:0,spd:0};d.cq={};
  if(!o||typeof o!=='object')return;
  if(o.cr&&typeof o.cr==='object')Object.keys(o.cr).forEach(function(id){if(G_CRI[id]){var n=Math.min(9999,Math.max(0,Math.floor(gNum(o.cr[id],0))));if(n)d.cr[id]=n;}});
  if(o.eq&&typeof o.eq==='object')['w','hat','out'].forEach(function(s){var id=o.eq[s];if(id&&G_CRI[id]&&d.cr[id]>0&&gCrSlot(G_CRI[id])===s)d.eq[s]=id;});
  ['atk','inc','spd'].forEach(function(k){d.fd[k]=Math.min(G_CR.cap[k],Math.max(0,gNum(o.fd&&o.fd[k],0)));});
  if(o.cq&&typeof o.cq==='object')Object.keys(o.cq).forEach(function(f){var q=o.cq[f];if(q&&G_CRI[q.id]&&G_CRI[q.id].f===f)d.cq[f]={id:q.id,end:gNum(q.end,0)};});
}
/* 능력치 보너스: 먹은 요리(영구) + 장착한 무기. 공식(core2)이 (1+보너스)로 곱해요 */
function gFoodB(g,k){return (g.fd&&g.fd[k])||0;}
function gWeapB(g,k){var w=g.eq&&g.eq.w&&G_CRI[g.eq.w];return (w&&w.fx&&w.fx[k])||0;}
function gGearB(g,k){return gFoodB(g,k)+gWeapB(g,k);}
/* 재료 확인/사용: 사냥·농장 생산물은 품질별 창고, 작물은 밭 창고 */
function gCrHave(key,q){if(G_MTM[key])return gMt()[key][q-1]||0;return G_CRM[key]?(gFm().inv[key]||0):0;}
function gCrTake(key,q,n){if(G_MTM[key])gMt()[key][q-1]-=n;else gFm().inv[key]-=n;}
function gCrChip(m){var have=gCrHave(m[0],m[1]),mt=G_MTM[m[0]],e=mt?mt.e:G_CRM[m[0]].e,q=mt?m[1]:G_CRM[m[0]].rv;return '<span class="gmc '+(have>=m[2]?'ok':'no')+'">'+e+gStars(q)+' <b>'+have+'/'+m[2]+'</b></span>';}
function gCrFxTxt(it){
  if(it.f==='tailor')return G_CRSL[it.slot]+' · 보기 전용';
  var k=Object.keys(it.fx),t=k.map(function(x){return G_CRKN[x]+' +'+(Math.round(it.fx[x]*1000)/10)+'%';}).join(', ');
  return (it.f==='cook'?'먹으면 영구로 ':'장착하면 ')+t;
}
function gCrSync(g){
  var msgs=[],now=Date.now();if(!g||!g.cq)return msgs;
  Object.keys(g.cq).forEach(function(f){var q=g.cq[f];if(q&&now>=q.end){var it=G_CRI[q.id];g.cr[q.id]=Math.min(9999,(g.cr[q.id]||0)+1);delete g.cq[f];msgs.push(it.e+' '+it.n+' 완성! 🎉');}});
  return msgs;
}
function gCrRow(g,it,fl,busy){
  var own=g.cr[it.id]||0,lock=it.lv>fl,okm=it.mat.every(function(m){return gCrHave(m[0],m[1])>=m[2];}),can=!lock&&!busy&&okm,eqd=g.eq[gCrSlot(it)]===it.id;
  var act='';
  if(own){
    if(it.f==='cook'){var k=Object.keys(it.fx)[0];act='<button class="mini" data-act="gcr" data-f="eat" data-id="'+it.id+'"'+(g.fd[k]>=G_CR.cap[k]-1e-9?' disabled':'')+'>🍽️ 먹기 ('+own+')</button>';}
    else act='<button class="mini'+(eqd?' on':'')+'" data-act="gcr" data-f="eq" data-id="'+it.id+'">'+(eqd?'✔ 착용 중':'착용')+'</button>';
  }
  return '<div class="gcrr'+(lock?' lock':'')+'"><span class="gcre">'+it.e+'</span><div class="gcrt"><b>'+it.n+'</b> <small>'+it.d+'</small><small class="gcfx">'+gCrFxTxt(it)+'</small><div class="gmq">'+it.mat.map(gCrChip).join('')+'</div><small>⏱️ '+gVlDur(it.min*60000)+(own&&it.f!=='cook'?' · 보유 '+own:'')+'</small></div><div class="gcra">'
    +(lock?'<small>🔒 Lv.'+it.lv+'</small>':'<button class="mini rb" data-act="gcr" data-f="make" data-id="'+it.id+'"'+(can?'':' disabled')+'>만들기</button>')+act+'</div></div>';
}
function gCrCard(g){
  gCx(g);var B=G_VLM[gCrK],fl=gVlLv(gCrK),q=g.cq[gCrK],h='<button class="mini gvbk" data-act="gvil" data-f="map">🏡 마을로</button><div class="gvh"><h2>'+B.e+' '+B.n+' <small>Lv.'+fl+'</small></h2></div>';
  if(q){var it=G_CRI[q.id];h+='<div class="gcq"><span class="gcre">'+it.e+'</span><div><b>'+it.n+' 만드는 중…</b><br><small>남은 시간 <b class="gcqt">'+gVlDur(q.end-Date.now())+'</b></small></div></div>';}
  else h+='<p class="hint">지금은 쉬는 중이야. 아래에서 만들 걸 골라봐!</p>';
  if(gCrK==='cook')h+='<p class="hint" style="font-size:12px">🍽️ 먹은 요리로 올린 능력: '+['atk','inc','spd'].map(function(k){return G_CRKN[k]+' +'+(Math.round(g.fd[k]*1000)/10)+'% (최대 '+(G_CR.cap[k]*100)+'%)';}).join(' · ')+'</p>';
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
  g.cq[it.f]={id:id,end:Date.now()+it.min*60000};gSfx('buy');gSave();gRefresh();toast(it.e+' 만들기 시작! ('+gVlDur(it.min*60000)+')');
}
function gCrEat(id){
  var g=gCx(),it=G_CRI[id];if(!it||it.f!=='cook'||!(g.cr[id]>0))return;
  var k=Object.keys(it.fx)[0],cap=G_CR.cap[k];if(g.fd[k]>=cap-1e-9){toast('이 능력은 더 못 올려! 😋');return;}
  var add=Math.min(it.fx[k],cap-g.fd[k]);g.cr[id]--;g.fd[k]+=add;gSfx('coin');gSave();gRefresh();toast(it.e+' 냠냠! '+G_CRKN[k]+' +'+(Math.round(add*1000)/10)+'%');
}
function gCrEq(id){
  var g=gCx(),it=G_CRI[id];if(!it||it.f==='cook'||!(g.cr[id]>0))return;var s=gCrSlot(it);
  g.eq[s]=(g.eq[s]===id)?'':id;gSfx('tap');gSave();gRefresh();toast(g.eq[s]?it.e+' '+it.n+' 착용!':'해제했어');
}
function gcrDo(b){var f=b.dataset.f,id=b.dataset.id;if(f==='make')gCrMake(id);else if(f==='eat')gCrEat(id);else if(f==='eq')gCrEq(id);}
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
