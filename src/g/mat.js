/* ===== 재료 (사냥 드랍 · 품질 ★1~6) · 층 이동/고정 ===== */
var G_MT=G_DATA.mat,G_MTK=G_MT.types.map(function(t){return t.k;}),G_MTM={};G_MT.types.forEach(function(t){G_MTM[t.k]=t;});
var gDropQ=[],gMatAcc={},gFlSel=0;
function gMtZero(){var o={};G_MTK.forEach(function(k){o[k]=[0,0,0,0,0,0];});return o;}
function gMtLoad(o){var d=gMtZero();if(o&&typeof o==='object')G_MTK.forEach(function(k){if(Array.isArray(o[k]))for(var i=0;i<G_MT.maxQ;i++)d[k][i]=Math.min(999999,Math.max(0,Math.floor(gNum(o[k][i],0))));});return d;}
function gMt(){var g=gGet();if(!g.mt)g.mt=gMtZero();return g.mt;}
/* n층의 드랍 정보: q=기본 품질, pu=한 단계 높은 품질 확률, pd=일반 몬스터 드랍 확률 */
function gMtInfo(n){
  n=Math.max(1,Math.floor(n));var B=G_MT.block,q=Math.min(G_MT.maxQ,Math.floor((n-1)/B)+1),pos=(n-1)%B,h=Math.floor(B*G_MT.upFrom)-1,pu=0;
  if(q<G_MT.maxQ&&pos>=h)pu=G_MT.up.p0+(G_MT.up.p1-G_MT.up.p0)*Math.min(1,(pos-h)/(B-1-h));
  var pd=G_MT.drop.p0+(G_MT.drop.p1-G_MT.drop.p0)*Math.min(1,n/G_MT.drop.fl1);
  return {q:q,pu:pu,pd:pd};
}
function gMtAdd(k,q,c){var m=gMt();m[k][q-1]=Math.min(999999,m[k][q-1]+c);var key=k+'|'+q;gMatAcc[key]=(gMatAcc[key]||0)+c;gDropQ.push([k,q,c]);}
function gDrop1(g,n,boss){
  var I=gMtInfo(n),c=boss?G_MT.drop.boss:(Math.random()<I.pd?1:0);
  for(var i=0;i<c;i++){var k=G_MTK[Math.floor(Math.random()*G_MTK.length)],q=I.q;if(I.pu>0&&Math.random()<I.pu)q++;gMtAdd(k,q,1);}
}
function gMtRnd(k,q,v){var f=Math.floor(v),c=f+(Math.random()<v-f?1:0);if(c>0)gMtAdd(k,q,c);}
/* k마리를 한꺼번에 잡았을 때 (반복사냥·방치). 많으면 기댓값으로 계산 */
function gDropK(g,n,k){
  var boss=n%10===0,w=Math.floor(k),a=w+(Math.random()<k-w?1:0);if(a<=0)return;
  if(a>2000){var I=gMtInfo(n),tot=boss?a*G_MT.drop.boss:a*I.pd,per=tot/G_MTK.length;G_MTK.forEach(function(kk){gMtRnd(kk,I.q,per*(1-I.pu));if(I.pu>0)gMtRnd(kk,I.q+1,per*I.pu);});return;}
  for(var i=0;i<a;i++)gDrop1(g,n,boss);
}
function gStars(q){return q>=6?'<span class="gsx">★</span>':'<span class="gs">'+new Array(q+1).join('★')+'</span>';}
function gMtChips(arr){var h='';for(var i=0;i<arr.length;i++)if(arr[i]>0)h+='<span class="gmc">'+gStars(i+1)+' <b>'+arr[i]+'</b></span>';return h;}
function gMatOffHtml(dr){
  if(!dr)return '';var ks=Object.keys(dr);if(!ks.length)return '';var by={};
  ks.forEach(function(key){var p=key.split('|');by[p[0]]=by[p[0]]||[0,0,0,0,0,0];by[p[0]][+p[1]-1]+=dr[key];});
  var h='';G_MTK.forEach(function(k){if(by[k])h+='<div class="gmo"><span>'+G_MTM[k].e+'</span>'+gMtChips(by[k])+'</div>';});
  return '<div class="goffs" style="margin-top:8px"><b>🎒 모은 재료</b></div>'+h;
}
/* 몬스터를 잡을 때 떠오르는 재료 표시 */
function gDropFlush(){
  if(!gDropQ.length)return;var q=gDropQ.splice(0);var mon=$('g-mon');if(!mon||gSm)return;
  var r=mon.getBoundingClientRect(),agg={},n=0;
  q.forEach(function(d){var key=d[0]+d[1];if(!agg[key])agg[key]={k:d[0],q:d[1],c:0};agg[key].c+=d[2];});
  Object.keys(agg).slice(0,3).forEach(function(key,i){var a=agg[key],s=document.createElement('span');s.className='gdrp';
    s.innerHTML=G_MTM[a.k].e+' '+gStars(a.q)+(a.c>1?' ×'+a.c:'');
    s.style.left=(r.left+r.width*.5-30+i*8)+'px';s.style.top=(r.top+r.height*.1-i*16)+'px';document.body.appendChild(s);
    setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},1500);});
}
function gMatPanel(g){
  var m=gMt(),f=gFm(),h='<h3 class="gcph">🎒 재료 창고</h3>',any=false,I=gMtInfo(Math.max(1,g.best));
  G_MT.types.forEach(function(t){var c=gMtChips(m[t.k]);if(c)any=true;h+='<div class="gmr"><span class="gme">'+t.e+'</span><div><b>'+t.n+'</b> <small>'+t.u+' 재료</small><div class="gmq">'+(c||'<small>아직 없어</small>')+'</div></div></div>';});
  var fc='';G_CROP.forEach(function(c){var n=f.inv[c.k]||0;if(n)fc+='<span class="gmc">'+c.e+gStars(G_MT.farmQ[c.k]||1)+' <b>'+n+'</b></span>';});
  G_PRK.forEach(function(k){var n=f.inv[k]||0;if(n)fc+='<span class="gmc">'+G_PRM[k].e+gStars(G_MT.farmQ[k]||1)+' <b>'+n+'</b></span>';});
  h+='<div class="gmr"><span class="gme">🧺</span><div><b>텃밭·농장</b> <small>요리·재봉 재료</small><div class="gmq">'+(fc||'<small>아직 없어</small>')+'</div></div></div>';
  h+='<p class="hint" style="font-size:12px">사냥 재료는 층이 높을수록 좋은 품질이 나와요. 지금 최고층 '+g.best+'층: '+gStars(I.q)+(I.pu>0?' + 가끔 '+gStars(I.q+1)+' ('+(I.pu*100).toFixed(0)+'%)':'')+' · 몬스터 한 마리당 드랍 '+(I.pd*100).toFixed(0)+'% · 보스는 '+G_MT.drop.boss+'개 확정.<br>🧭 층을 옮기거나 한 층에 머물려면 전투 화면의 <b>층 이름</b>을 눌러봐!</p>';
  return h;
}
/* ---- 층 이동 / 고정 ---- */
function gFloorModal(){
  var g=gGet();if(!gFlSel)gFlSel=gShown(g);gFlSel=Math.min(Math.max(1,g.best),Math.max(1,gFlSel));
  var I=gMtInfo(gFlSel),bt=function(v){return '<button class="mini" data-act="gfl" data-f="d" data-v="'+v+'">'+(v>0?'+':'')+v+'</button>';};
  gFModal('<h3>🧭 층 이동</h3><p class="hint">지금 '+gShown(g)+'층 · 최고 '+g.best+'층'+(g.pin?' · 📌 '+g.pin+'층 고정 중':'')+'</p>'
   +'<div class="gflv"><b>'+gFlSel+'층</b><small>'+gStars(I.q)+(I.pu>0?' + 가끔 '+gStars(I.q+1):'')+' · 드랍 '+(I.pd*100).toFixed(0)+'%</small></div>'
   +'<div class="gflb">'+[-1000,-100,-10,-1].map(bt).join('')+'</div><div class="gflb">'+[1,10,100,1000].map(bt).join('')+'</div>'
   +'<div class="gflb"><button class="mini" data-act="gfl" data-f="cur">지금 층</button><button class="mini" data-act="gfl" data-f="best">최고층</button></div>'
   +'<button class="btn sm gevob" data-act="gfl" data-f="go">🚶 이 층으로 이동해서 계속 올라가기</button>'
   +'<button class="btn sm gevob" style="margin-top:6px" data-act="gfl" data-f="pin">📌 이 층에 고정해서 계속 사냥</button>'
   +(g.pin?'<button class="mini" style="margin-top:6px" data-act="gfl" data-f="unpin">🔓 고정 풀고 최고층으로</button>':'')
   +'<button class="mini" style="margin-top:6px" data-act="gfl" data-f="close">닫기</button>');
}
function gFloorApply(g){
  g.hp=g.farm?gHp(Math.max(1,g.stage-1)):gHp(g.stage);g.bt=0;g.dlyLeft=0;g.last=Date.now();gFarmS=0;gFarmN=0;
  if(typeof gGold!=='undefined'){gGold=null;if(typeof gGoldClear==='function')gGoldClear();}
  gSave();gPaintStage(g,true);gNoteKey='';gSetH('g-note',gNoteHtml(g));gSet('g-st',gStText(g));
}
function gflDo(b){
  var f=b.dataset.f,g=gGet(),v=gFlSel;
  if(f==='d'){gFlSel=v+(+b.dataset.v);gFloorModal();return;}
  if(f==='cur'){gFlSel=gShown(g);gFloorModal();return;}
  if(f==='best'){gFlSel=g.best;gFloorModal();return;}
  if(f==='close'){gDexModalClose();return;}
  if(f==='go'||f==='pin'){
    v=Math.min(Math.max(1,g.best),Math.max(1,v));gDexModalClose();
    if(f==='pin'){g.pin=v;g.farm=true;g.bossLock=true;g.stage=v+1;toast('📌 '+v+'층에 고정했어!');}
    else{g.pin=0;g.farm=false;g.bossLock=false;g.stage=v;g.fails=0;g.sk=0;toast('🧭 '+v+'층으로 이동!');}
    gFlSel=0;gFloorApply(g);return;
  }
  if(f==='unpin'){gDexModalClose();g.pin=0;g.farm=false;g.bossLock=false;g.stage=Math.max(1,g.best);g.fails=0;g.sk=0;gFlSel=0;toast('🔓 고정을 풀었어. 최고층으로 돌아가!');gFloorApply(g);}
}
