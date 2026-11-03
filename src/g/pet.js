/* ===== 동료(친구들) · 오라 연출 ===== */
var G_CPO=['gnd','sky','veh'];
var G_CPC={gnd:['지상','🐾'],sky:['하늘','🕊️'],veh:['탈것','🚗']};
var G_CPM={};G_CPL.forEach(function(p){G_CPM[p.id]=p;});
var G_CPA={atk:['공격력','%'],inc:['하트 수입','%'],spd:['공격 속도','%'],rub:['운동 루비','%'],bt:['보스 제한시간','초'],skip:['층 건너뛰기 확률','%'],mv:['이동 속도','%']};
var G_CPV={atk:[2,4,8,15],inc:[2,4,8,15],spd:[2,4,8,15],rub:[3,6,12,20],bt:[1,2,3,5],skip:[1,2,3,5],mv:[3,6,10,15]};
var G_CSM=[0,1,1.5,2,3,5];
var G_CPX=[[['cbt',0.3]],[['cbt',0.3],['ult',5]],[['cbt',0.3],['ult',5],['cbd',0.1]],[['cbt',0.3],['ult',5],['cbd',0.1],['cbn',1]]];
var G_CPXN={cbt:'콤보 유지시간',ult:'필살기 위력',cbd:'콤보당 데미지',cbn:'필살기 필요 타수'};
function gCpXTxt(p,st){var m=G_CSM[st]||1,r=function(v){v=Math.round(v*10)/10;return v%1?v.toFixed(1):v;};return (G_CPX[p.r]||[]).map(function(x){var k=x[0],v=k==='cbn'?x[1]:x[1]*m;return G_CPXN[k]+' '+(k==='cbn'?'−'+r(v)+'타':k==='cbt'?'+'+r(v)+'초':k==='cbd'?'+'+r(v)+'%p':'+'+r(v)+'%');}).join(' · ');}
function gCpXv(k,v){v=Math.round(v*10)/10;var t=v%1?v.toFixed(1):v;return k==='cbn'?'−'+t+'타':k==='cbt'?'+'+t+'초':k==='cbd'?'+'+t+'%p':'+'+t+'%';}
function gCpTable(p,st,mx){
  var rows=[['⭐ '+G_CPA[p.a][0],gCpFmt(p.a,gCpVal(null,p.id,st)),mx?'MAX':gCpFmt(p.a,gCpVal(null,p.id,st+1))]],m1=G_CSM[st]||1,m2=G_CSM[st+1]||m1;
  (G_CPX[p.r]||[]).forEach(function(x){var k=x[0];rows.push([G_CPXN[k],gCpXv(k,k==='cbn'?x[1]:x[1]*m1),mx?'MAX':gCpXv(k,k==='cbn'?x[1]:x[1]*m2)]);});
  return '<table class="gdt"><thead><tr><th>효과</th><th>지금</th><th>다음 별</th></tr></thead><tbody>'+rows.map(function(r,i){return '<tr'+(i?'':' class="mn"')+'><td>'+r[0]+'</td><td><b>'+r[1]+'</b></td><td class="nx">'+r[2]+'</td></tr>';}).join('')+'</tbody></table><div class="gdtn">등급이 높을수록 효과가 쌓여요: N 유지시간 → R +필살기 위력 → SR +콤보 데미지 → SSR +필요 타수</div>';
}
function gCpVal(g,id,st){var p=G_CPM[id];if(!p)return 0;st=st||(g.cstar&&g.cstar[id])||1;return G_CPV[p.a][p.r]*(G_CSM[st]||1);}
function gCpFmt(a,v){v=Math.round(v*10)/10;return '+'+(v%1?v.toFixed(1):v)+(G_CPA[a][1]==='초'?'초':'%');}
function gPetB(g){
  var o={atk:0,inc:0,spd:0,rub:0,bt:0,skip:0,mv:0,cbt:0,ult:0,cbd:0,cbn:0};if(!g.ceq||!g.cdex)return o;
  G_CPO.forEach(function(c){var id=g.ceq[c],p=id&&G_CPM[id];if(!p||!g.cdex[id])return;var v=gCpVal(g,id);o[p.a]+=(p.a==='bt'?v:v/100);var m=G_CSM[(g.cstar&&g.cstar[id])||1]||1;(G_CPX[p.r]||[]).forEach(function(x){var k=x[0],w=k==='cbn'?x[1]:x[1]*m;o[k]+=(k==='cbt'||k==='cbn')?w:w/100;});});
  return o;
}
function gCpImg(id){return (typeof CP_IMG!=='undefined'&&CP_IMG[id])||'';}
/* ---- 뽑기 ---- */
function gRollPet(g){
  var r=Math.random()*100,rar=r<2?3:r<12?2:r<45?1:0;
  g.cpity=(g.cpity||0)+1;g.cpity2=(g.cpity2||0)+1;
  if(g.cpity2>=50)rar=3;else if(g.cpity>=10&&rar<2)rar=2;
  if(rar>=2)g.cpity=0;if(rar>=3)g.cpity2=0;
  var ks=G_CPL.filter(function(p){return p.r===rar;}),p=ks[Math.floor(Math.random()*ks.length)],k=p.id,isNew=!g.cdex[k],hh=0;
  g.cdex[k]=(g.cdex[k]||0)+1;
  if(isNew){g.cstar[k]=1;g.cdup[k]=0;}
  else if((g.cstar[k]||1)<5){g.cdup[k]=(g.cdup[k]||0)+1;}
  else{hh=gKill(g,Math.max(1,g.best))*[20,40,80,200][rar];g.hearts+=hh;}
  return {k:k,rar:rar,nw:isNew,h:hh,kind:'p',name:p.n,img:gCpImg(k)};
}
function gGacPetCard(g){
  var pr=Math.max(1,10-(g.cpity||0)),ps=Math.max(1,50-(g.cpity2||0));
  return '<p class="hint">사랑이랑 같이 싸우는 <b>동료 친구들</b>을 뽑아! 지상·하늘·탈것에서 한 마리씩 데려갈 수 있고, 모두 각자 특별한 능력이 있어.</p>'+
   '<div class="gneed" style="grid-template-columns:1fr auto"><span>내 뽑기권</span><b style="font-size:16px">🎟️ '+g.tickets+'장</b></div>'+
   '<p class="hint" style="font-size:12px">확률: N 55% · R 33% · SR 10% · SSR 2%<br>SR 이상 확정까지 '+pr+'번 · SSR 확정까지 '+ps+'번<br>같은 친구가 또 나오면 도감에서 ⭐ 별 강화에 쓸 수 있어!</p>'+
   '<div style="display:flex;gap:8px"><button class="btn sm gevob" style="flex:1" data-act="gpull" data-t="p" data-k="1"'+(g.tickets>=1?'':' disabled')+'>1번 뽑기 (🎟️1)</button><button class="btn sm gevob" style="flex:1" data-act="gpull" data-t="p" data-k="10"'+(g.tickets>=10?'':' disabled')+'>10번 뽑기 (🎟️10)</button></div>';
}
/* ---- 동료 도감 ---- */
function gPetDexCard(g){
  var n=Object.keys(g.cdex).length,rdy=0;
  G_CPL.forEach(function(p){if(g.cdex[p.id]&&(g.cstar[p.id]||1)<5&&(g.cdup[p.id]||0)>=G_SN[g.cstar[p.id]||1])rdy++;});
  var h='<p class="hint"><b>동료 '+n+'/'+G_CPL.length+'</b>'+(rdy?' <span class="gstmp" style="border-color:#ffb300;color:#e08a00">강화 가능 '+rdy+'</span>':'')+'<br>지상 · 하늘 · 탈것에서 한 마리씩 장착할 수 있어. 능력은 장착해야 적용돼! (별 강화 ⭐ 2·4·8·16개)</p>';
  G_CPO.forEach(function(c){
    var eq=g.ceq&&g.ceq[c]&&G_CPM[g.ceq[c]]?G_CPM[g.ceq[c]].n:'없음';
    h+='<h3 class="gcph">'+G_CPC[c][1]+' '+G_CPC[c][0]+' <small>장착: '+eq+'</small></h3><div class="gdx">'+
     G_CPL.filter(function(p){return p.c===c;}).sort(function(a,b){return b.r-a.r;}).map(function(p){
       var id=p.id,cn=g.cdex[id]||0,st=g.cstar[id]||1,need=G_SN[st],dp=g.cdup[id]||0,ready=cn&&st<5&&dp>=need,on=g.ceq&&g.ceq[c]===id;
       return '<div class="gdxi'+(cn?'':' no')+(on?' eq':'')+(ready?' rdy':'')+'" style="--rc:'+G_RC[p.r]+'" data-act="gpdi" data-k="'+id+'">'+(cn?'<span class="gstars">'+gStarStr(st)+'</span>':'<span class="gstars"></span>')+'<img alt="" src="'+gCpImg(id)+'"><i>'+G_RN[p.r]+'</i>'+(on?'<em class="geq">장착</em>':'')+'<small>'+(cn?p.n:'???')+'</small>'+(cn?'<small class="gprog'+(ready?' ok':'')+'">'+(st>=5?'MAX':Math.min(dp,need)+'/'+need)+'</small>':'<small class="gprog">&nbsp;</small>')+'</div>';
     }).join('')+'</div>';
  });
  return h;
}
function gPetModal(id){
  var g=gGet(),old=document.getElementById('gdm');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var p=G_CPM[id];if(!p||!g.cdex[id])return;
  var st=g.cstar[id]||1,need=G_SN[st],dp=g.cdup[id]||0,mx=st>=5,ready=!mx&&dp>=need,eq=g.ceq&&g.ceq[p.c]===id;
  var cur=gCpVal(g,id,st),nxt=mx?cur:gCpVal(g,id,st+1);
  var el=document.createElement('div');el.className='gdm';el.id='gdm';
  el.innerHTML='<div class="gdmc" style="--rc:'+G_RC[p.r]+'"><div class="gdmst">'+gStarStr(st)+'</div><img alt="" src="'+gCpImg(id)+'"><div class="gdmn">'+p.n+' <span class="gdmr">'+G_RN[p.r]+'</span></div>'+
   '<div class="gdmi">'+G_CPC[p.c][1]+' '+G_CPC[p.c][0]+' 동료 · 보유 '+g.cdex[id]+'장 · 강화 재료 '+dp+'장</div>'+
   gCpTable(p,st,mx)+'<div class="gdtn" style="margin-top:0">능력은 장착해야 적용돼!'+(mx?' 🌟 최고 강화 달성!':'')+'</div>'+(mx?'':'<div class="gneed" style="grid-template-columns:1fr auto;width:100%">'+gBar(dp/need,'pk')+'<b>'+Math.min(dp,need)+' / '+need+'</b></div>')+
   '<div class="gdmbt">'+(mx?'':'<button class="btn sm gevob" data-act="gpup" data-k="'+id+'"'+(ready?'':' disabled')+'>'+(ready?'⭐ 별 '+(st+1)+'개로 강화할래?':'재료가 모자라 ('+Math.min(dp,need)+'/'+need+')')+'</button>')+
   '<button class="mini" data-act="gpeq" data-k="'+id+'">'+(eq?'장착 해제':'이 친구 데려가기')+'</button><button class="mini" data-act="gdxx">닫기</button></div></div>';
  el.addEventListener('click',function(e){if(e.target===el)gDexModalClose();});
  document.body.appendChild(el);
}
/* ---- 전투 화면 표시 ---- */
function gCrewHtml(g){
  var e=g.ceq||{},h='';
  G_CPO.forEach(function(c){if(e[c]&&g.cdex[e[c]]&&G_CPM[e[c]])h+='<img class="gcp '+c+'" alt="" src="'+gCpImg(e[c])+'">';});
  return h;
}
function gAuraHtml(g){
  if(!g.hero||!g.dex[g.hero])return '';
  var r=G_RAR[g.hero],n=[3,4,6,8][r],src=MAS[g.hero]||'',h='<div class="gaura r'+r+'" style="--rc:'+G_RC[r]+'"><i class="gag"></i>';
  if(r>=3)h+='<i class="gar"></i>';
  if(r>=1)h+='<i class="gar1"></i>';
  if(r>=2)h+='<i class="gar2"></i>';
  for(var i=0;i<n;i++){
    var ring=(r>=3&&i%2)?1:0,rad=(ring?100:76),dur=(7+i%3*1.2)*(ring?1.35:1),a0=Math.round(i/n*360);
    h+='<img class="gas" alt="" src="'+src+'" style="--a0:'+a0+'deg;--r:calc('+rad+'px*var(--k));--t:'+dur.toFixed(1)+'s;--s:'+(r>=3?38:r>=2?34:30)+'"'+(ring?' data-o="1"':'')+'>';
  }
  var sp=[0,0,2,4][r];for(var j=0;j<sp;j++)h+='<span class="gasp" style="--a0:'+Math.round(j/sp*360+20)+'deg;--d:'+(j*.5)+'s">✨</span>';
  return h+'</div>';
}
function gHeroKey(g){var e=g.ceq||{};return gFormLv(g)+'|'+(g.hero||'')+'|'+(e.gnd||'')+'|'+(e.sky||'')+'|'+(e.veh||'');}
function gHeroSrc(g){return SPR_F[gFormLv(g)]||'';}
function gFront(L){return SPR_F[Math.max(0,Math.min(10,L|0))]||'';}
function gHeroHtml(g){
  var e=g.ceq||{},ride=e.veh&&g.cdex[e.veh]&&G_CPM[e.veh];
  return '<div class="ghw" id="g-hw">'+gAuraHtml(g)+gCrewHtml(g)+'<div class="ghero gsp" id="g-hero" data-act="ghero" style="background-image:url('+(SPR_S[gFormLv(g)]||'')+')"></div></div>';
}
var gHK='';
function gHeroCheck(g){
  var k=gHeroKey(g);if(k===gHK)return;gHK=k;
  var w=$('g-hw');if(!w)return;
  var t=document.createElement('div');t.innerHTML=gHeroHtml(g);w.parentNode.replaceChild(t.firstChild,w);
}
