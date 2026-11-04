/* ===== 텃밭 · 농장 ===== */
var G_CROP=[
 {k:'carrot',e:'🥕',n:'당근',t:2400,v:20,f:1,rv:1},
 {k:'straw',e:'🍓',n:'딸기',t:7200,v:60,f:2,rv:2},
 {k:'corn',e:'🌽',n:'옥수수',t:14400,v:150,f:4,rv:3},
 {k:'tomato',e:'🍅',n:'토마토',t:28800,v:400,f:6,rv:4},
 {k:'sun',e:'🌻',n:'해바라기',t:57600,v:1000,f:10,rv:5},
 {k:'melon',e:'🍉',n:'수박',t:115200,v:2500,f:14,rv:6}
];
var G_CRM={};G_CROP.forEach(function(c){G_CRM[c.k]=c;});
var G_PROD={gnd:{k:'milk',e:'🥛',n:'우유'},sky:{k:'egg',e:'🥚',n:'달걀'},veh:{k:'dust',e:'✨',n:'반짝가루'}};
var G_PRK=['milk','egg','dust'];
var G_PRM={milk:G_PROD.gnd,egg:G_PROD.sky,dust:G_PROD.veh};
var G_FPI=[120,90,66,45];           // 등급별 생산 간격(분)
var G_WSTEP=.15,G_WMAX=3,G_ANCAP=12;
function gFmDef(){var o={pl:[],water:5,inv:{},an:[],ns:3,np:4};for(var i=0;i<4;i++)o.pl.push({c:'',t:0,w:0});G_CROP.forEach(function(c){o.inv[c.k]=0;});G_PRK.forEach(function(k){o.inv[k]=0;});return o;}
function gFmLoad(o){
  var d=gFmDef();if(!o||typeof o!=='object')return d;
  d.np=Math.min(16,Math.max(4,Math.floor(gNum(o.np,4))));d.ns=Math.min(10,Math.max(3,Math.floor(gNum(o.ns,3))));
  d.water=Math.min(30,Math.max(0,Math.floor(gNum(o.water,5))));
  d.pl=[];for(var i=0;i<d.np;i++){var p=(o.pl&&o.pl[i])||{};d.pl.push({c:G_CRM[p.c]?p.c:'',t:G_CRM[p.c]?gNum(p.t,0):0,w:Math.min(G_WMAX,Math.max(0,Math.floor(gNum(p.w,0))))});}
  Object.keys(d.inv).forEach(function(k){d.inv[k]=Math.min(999999,Math.max(0,Math.floor(gNum(o.inv&&o.inv[k],0))));});
  d.an=[];if(Array.isArray(o.an))o.an.slice(0,d.ns).forEach(function(a){if(a&&G_CPM[a.id]&&!d.an.some(function(x){return x.id===a.id;}))d.an.push({id:a.id,fu:gNum(a.fu,0),lp:gNum(a.lp,Date.now()),n:Math.min(G_ANCAP,Math.max(0,Math.floor(gNum(a.n,0))))});});
  return d;
}
/* 예전 저장(품질 없는 우유·달걀·반짝가루)을 ★1 재료로 옮기기 */
function gPrMigrate(d){G_PRK.forEach(function(k){var n=d.fm.inv[k]||0;if(n>0){d.mt[k][0]=Math.min(999999,d.mt[k][0]+n);d.fm.inv[k]=0;}});}
function gFm(){var g=gGet();if(!g.fm)g.fm=gFmDef();return g.fm;}
/* ---- 계산 ---- */
function gWCut(c){return Math.max(G_WSTEP*c.t*1000,3600000);}
function gPlRemain(p,now){var c=G_CRM[p.c];if(!c)return 0;return Math.max(0,c.t*1000-p.w*gWCut(c)-(now-p.t));}
function gAnInt(g,a){var p=G_CPM[a.id];return G_FPI[p.r]*60000/(1+.2*((g.cstar[a.id]||1)-1));}
function gAnSync(g,a,now){
  var iv=gAnInt(g,a),upto=Math.min(now,a.fu);
  if(upto>a.lp){var k=Math.floor((upto-a.lp)/iv);if(k>0){a.n=Math.min(G_ANCAP,a.n+k);a.lp+=k*iv;}}
  if(a.n>=G_ANCAP||now>a.fu)a.lp=Math.max(a.lp,Math.min(now,a.fu>now?now:a.fu));
  if(a.fu<=now&&a.lp<a.fu)a.lp=a.fu;
}
function gFmSyncAll(g){var f=gFm(),now=Date.now();f.an.forEach(function(a){gAnSync(g,a,now);});}
function gHM(ms){var s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=s%60;return h?h+'시간 '+m+'분':m?m+'분 '+(r<10?'0':'')+r+'초':r+'초';}
function gFmBase(g){return gKill(g,Math.max(1,g.best));}
function gFmWater(n){var f=gFm();f.water=Math.min(30,f.water+n);}
/* ---- 화면 ---- */
var gFmT='f';
function gInvHtml(g){
  var f=gFm(),rows='';
  G_CROP.forEach(function(c){var n=f.inv[c.k]||0;if(n)rows+='<span class="gii">'+c.e+gStars(c.rv)+' <b>'+n+'</b></span>';});
  var mm=gMt();G_MT.types.forEach(function(t){if(t.h)return;mm[t.k].forEach(function(n,i){if(n>0)rows+='<span class="gii">'+t.e+gStars(i+1)+' <b>'+n+'</b></span>';});});
  return '<h3 class="gcph">🧺 창고</h3>'+(rows?'<div class="gih">'+rows+'</div><p class="hint" style="font-size:12px">작물은 농장 동물의 먹이로 줄 수 있어. 나머지는 요리나 제작 재료로 쓰일 거야!</p>':'<p class="hint">수확한 작물이랑 농장에서 얻은 물건이 여기에 모여.</p>');
}
function gFarmCard(g){
  gFmSyncAll(g);
  var tabs='<div class="gseg"><button class="gsg'+(gFmT==='f'?' on':'')+'" data-act="gtab" data-t="farm" data-k="f">🌱 텃밭</button><button class="gsg'+(gFmT==='a'?' on':'')+'" data-act="gtab" data-t="farm" data-k="a">🐄 농장</button></div>';
  return '<button class="mini gvbk" data-act="gvil" data-f="map">🏡 마을로</button>'+tabs+(gFmT==='a'?gPenCard(g):gPlotCard(g))+gInvHtml(g);
}
function gPlotCard(g){
  var f=gFm(),now=Date.now(),h='<div class="gfw"><span class="chip">💧 물 <b>'+f.water+'</b>/30</span><span class="chip">🌱 텃밭 Lv.'+gVlLv('plot')+'</span><small>운동을 끝낼 때마다 💧 +3!</small></div>';
  h+='<div class="gpls">';
  f.pl.forEach(function(p,i){
    var c=G_CRM[p.c];
    if(!c){h+='<button class="gpl emp" data-act="gf" data-f="seed" data-i="'+i+'"><span class="gpe">🟫</span><b>씨앗 심기</b></button>';return;}
    var rem=gPlRemain(p,now),tot=c.t*1000,ripe=rem<=0,stg=ripe?3:Math.min(2,Math.floor((1-rem/tot)*3));
    var em=ripe?c.e:(['🌱','🌿','🪴'][stg]);
    h+='<button class="gpl'+(ripe?' rip':'')+'" data-act="gf" data-f="'+(ripe?'harv':'water')+'" data-i="'+i+'"><span class="gpe">'+em+'</span><b>'+c.n+(ripe?' 다 익었어!':'')+'</b>'+(ripe?'<small>눌러서 수확 ✨</small>':'<small data-pt="'+i+'">'+gHM(rem)+' 남음 · 💧'+p.w+'/'+G_WMAX+'</small>')+(ripe?'':gBar(1-rem/tot,'pk'))+'</button>';
  });
  h+='</div>';
  if(f.np<16){var cost=10*(f.np-3);h+='<button class="mini rb" style="margin-top:8px" data-act="gf" data-f="bpl">'+gRuby(14)+' '+cost+' 밭 한 칸 넓히기 ('+f.np+'→'+(f.np+1)+')</button>';}
  return h+'<p class="hint" style="font-size:12px">익고 있는 밭을 누르면 💧 물을 줘서 15%(최소 1시간)만큼 빨리 키울 수 있어 (밭마다 3번까지).</p>';
}
function gPenCard(g){
  var f=gFm(),now=Date.now(),h='<div class="gpen" id="g-pen"><div class="gpen-sky"></div><div class="gpen-fence"></div>';
  f.an.forEach(function(a){
    var p=G_CPM[a.id],st=gFA[a.id]||(gFA[a.id]={x:14+Math.random()*70,y:44+Math.random()*40,wait:600+Math.random()*2500});
    var hung=now>a.fu;
    h+='<div class="gfa" id="gfa-'+a.id+'" data-act="gf" data-f="an" data-id="'+a.id+'" style="left:'+st.x.toFixed(1)+'%;top:'+st.y.toFixed(1)+'%;z-index:'+Math.round(st.y*10)+';--sc:'+(.78+.5*(st.y-40)/46).toFixed(2)+'"><img alt="" src="'+gCpImg(a.id)+'">'+(a.n>0?'<b class="gfb p">'+G_PROD[p.c].e+(a.n>1?'<i>'+a.n+'</i>':'')+'</b>':hung?'<b class="gfb h">🍽️</b>':'')+'</div>';
  });
  h+='</div>';
  if(!f.an.length)h+='<p class="hint" style="text-align:center">아직 마당이 텅 비었어! 내 동료 중에서 친구를 데려와 봐 🐾</p>';
  h+='<div class="gfw"><span class="chip">🐄 농장 Lv.'+gVlLv('farm')+' · 생산 '+gStars(gVlLv('farm'))+'</span></div><div class="gfw"><span class="chip">🐾 마당 <b>'+f.an.length+'</b>/'+f.ns+'칸</span><button class="mini" data-act="gf" data-f="addm"'+(f.an.length<f.ns?'':' disabled')+'>+ 동물 들이기</button>'+(f.ns<10?'<button class="mini rb" data-act="gf" data-f="bsl">'+gRuby(14)+' '+(30*(f.ns-2))+' 칸 늘리기</button>':'')+'</div>';
  var cl=f.an.reduce(function(s,a){return s+a.n;},0);
  if(cl)h+='<button class="btn sm gevob" data-act="gf" data-f="colall">🧺 생산물 모두 모으기 ('+cl+'개)</button>';
  return h+'<p class="hint" style="font-size:12px">동물을 누르면 먹이(🥕🍓…)를 줄 수 있어. 배부른 동안 우유🥛·달걀🥚·반짝가루✨를 만들어줘! 등급이 높고 ★이 많을수록 더 빨라.</p>';
}
/* ---- 배회 ---- */
var gFA={};
function gFarmTick(){
  if(nav.tab!=='game'||gSub!=='farm'||gFmT!=='a'||document.hidden)return;
  var pen=$('g-pen');if(!pen)return;
  var f=gFm(),now=Date.now();
  f.an.forEach(function(a){
    var el=$('gfa-'+a.id),st=gFA[a.id];if(!el||!st)return;
    st.wait-=500;if(st.wait>0)return;
    var tx,ty;
    if(Math.random()<.18){st.wait=2500+Math.random()*3500;el.classList.add('zz');setTimeout(function(){el.classList.remove('zz');},st.wait);return;}
    tx=8+Math.random()*80;ty=40+Math.random()*46;
    var dx=tx-st.x,dy=ty-st.y,dist=Math.sqrt(dx*dx+dy*dy*1.6),dur=Math.max(1.2,dist/9);
    el.style.transition='left '+dur+'s linear,top '+dur+'s linear';
    el.classList.toggle('fl',dx<0);el.classList.add('mv');
    el.style.left=tx.toFixed(1)+'%';el.style.top=ty.toFixed(1)+'%';el.style.zIndex=Math.round(ty*10);el.style.setProperty('--sc',(.78+.5*(ty-40)/46).toFixed(2));
    st.x=tx;st.y=ty;st.wait=dur*1000+1500+Math.random()*4500;
    setTimeout(function(){var e2=$('gfa-'+a.id);if(e2)e2.classList.remove('mv');},dur*1000);
  });
}
var gFSig='';
function gFarmSig(){
  var g=gGet(),f=gFm(),now=Date.now(),sig='';
  f.pl.forEach(function(p){sig+=p.c?(gPlRemain(p,now)<=0?'R':'g'):'e';});
  gFmSyncAll(g);f.an.forEach(function(a){sig+=(now>a.fu?'H':'F')+a.n;});
  return sig;
}
function gFarmWatch(){
  if(nav.tab!=='game'||gSub!=='farm'||document.hidden)return;
  var sig=gFarmSig(),f=gFm(),now=Date.now();
  if(gFSig&&sig!==gFSig){gFSig=sig;if(!$('gdm'))gRefresh();return;}
  gFSig=sig;
  f.pl.forEach(function(p,i){var e=document.querySelector('[data-pt="'+i+'"]');if(e&&p.c){e.textContent=gHM(gPlRemain(p,now))+' 남음 · 💧'+p.w+'/'+G_WMAX;}});
}
function gFarmAfter(){gFSig=(nav.tab==='game'&&gSub==='farm')?gFarmSig():'';}
setInterval(gFarmTick,500);setInterval(gFarmWatch,1000);
/* ---- 동작 ---- */
function gFModal(html){
  gDexModalClose();var el=document.createElement('div');el.className='gdm';el.id='gdm';
  el.innerHTML='<div class="gdmc" style="--rc:#7bc96f">'+html+'</div>';
  el.addEventListener('click',function(e){if(e.target===el)gDexModalClose();});document.body.appendChild(el);
}
var G_F={
 seed:function(b){
  var f=gFm(),i=+b.dataset.i,g=gGet(),base=gFmBase(g);
  var pl=gVlLv('plot');gFModal('<div class="gdmn">🌱 무엇을 심을까? <small>텃밭 Lv.'+pl+'</small></div><div class="gcr">'+G_CROP.map(function(c){var lk=c.rv>pl;return '<button class="gcrb'+(lk?' lock':'')+'" data-act="gf" data-f="plant" data-i="'+i+'" data-k="'+c.k+'"><span>'+c.e+'</span><b>'+c.n+' '+gStars(c.rv)+'</b>'+(lk?'<small>🔒 텃밭 Lv.'+c.rv+'</small>':'<small>'+gHM(c.t*1000)+'</small>')+'</button>';}).join('')+'</div><button class="mini" data-act="gdxx">닫기</button>');
 },
 plant:function(b){var f=gFm(),p=f.pl[+b.dataset.i];if(!p||p.c)return;var cc=G_CRM[b.dataset.k];if(!cc)return;if(cc.rv>gVlLv('plot')){toast('🔒 텃밭이 Lv.'+cc.rv+'이 되면 심을 수 있어!');return;}p.c=b.dataset.k;p.t=Date.now();p.w=0;gSfx('buy');gSave();gDexModalClose();gRefresh();},
 water:function(b){
  var f=gFm(),p=f.pl[+b.dataset.i];if(!p||!p.c)return;
  if(gPlRemain(p,Date.now())<=0){return G_F.harv(b);}
  if(p.w>=G_WMAX){toast('이 밭은 물을 충분히 줬어 💦');return;}
  if(f.water<=0){toast('물이 없어 💧 운동을 끝내면 받을 수 있어!');return;}
  f.water--;p.w++;gSfx('bub');gSave();gRefresh();toast('쑥쑥 자라는 중! 💧 (1시간 또는 15% 단축)');
 },
 harv:function(b){
  var f=gFm(),p=f.pl[+b.dataset.i];if(!p||!p.c||gPlRemain(p,Date.now())>0)return;
  var c=G_CRM[p.c],n=1+(Math.random()<.3+gBfV('harv')?1:0);f.inv[c.k]=(f.inv[c.k]||0)+n;p.c='';p.t=0;p.w=0;gSfx('coin');gSave();gRefresh();toast(c.e+' '+c.n+' '+n+'개 수확! 🎉');
 },
 bpl:function(b){var g=gGet(),f=gFm();if(f.np>=16)return;var cost=10*(f.np-3);if(g.rubies<cost){toast('루비가 모자라 💎');return;}g.rubies-=cost;f.np++;f.pl.push({c:'',t:0,w:0});gSfx('buy');gSave();gRefresh();toast('밭이 넓어졌어! 🌾');},
 bsl:function(b){var g=gGet(),f=gFm();if(f.ns>=10)return;var cost=30*(f.ns-2);if(g.rubies<cost){toast('루비가 모자라 💎');return;}g.rubies-=cost;f.ns++;gSfx('buy');gSave();gRefresh();toast('마당이 넓어졌어! 🐾');},
 addm:function(b){
  var g=gGet(),f=gFm(),have=G_CPL.filter(function(p){return g.cdex[p.id]&&!f.an.some(function(a){return a.id===p.id;});}).sort(function(a,b){return b.r-a.r;});
  if(!have.length){toast('데려올 동료가 없어! 뽑기에서 동료를 뽑아봐 🎟️');return;}
  gFModal('<div class="gdmn">🐾 누구를 들일까?</div><div class="gdx gdxs">'+have.map(function(p){return '<div class="gdxi" style="--rc:'+G_RC[p.r]+'" data-act="gf" data-f="addp" data-id="'+p.id+'"><img alt="" src="'+gCpImg(p.id)+'"><i>'+G_RN[p.r]+'</i><small>'+p.n+'</small></div>';}).join('')+'</div><button class="mini" data-act="gdxx">닫기</button>');
 },
 addp:function(b){
  var g=gGet(),f=gFm(),id=b.dataset.id;if(f.an.length>=f.ns||!g.cdex[id]||f.an.some(function(a){return a.id===id;}))return;
  f.an.push({id:id,fu:0,lp:Date.now(),n:0});gSfx('pull');gSave();gDexModalClose();gRefresh();toast(G_CPM[id].n+'가 농장에 놀러 왔어! 💗');
 },
 an:function(b){
  var g=gGet(),f=gFm(),id=b.dataset.id,a=null;f.an.forEach(function(x){if(x.id===id)a=x;});if(!a)return;
  var el=$('gfa-'+id);if(el){el.classList.remove('hop');void el.offsetWidth;el.classList.add('hop');}
  gSfx('tap');gHearts($('g-pen'),2);
  var now=Date.now();gAnSync(g,a,now);
  if(a.n>0&&now<=a.fu){/* 바로 모으기 */ }
  var p=G_CPM[id],fed=now<a.fu;
  var foods=G_CROP.filter(function(c){return (f.inv[c.k]||0)>0;});
  gFModal('<img class="gfm-i" alt="" src="'+gCpImg(id)+'"><div class="gdmn">'+p.n+' <span class="gdmr">'+G_RN[p.r]+'</span></div><div class="gdmi">'+(fed?'😋 배부른 중 · '+gHM(a.fu-now)+' 남음':'🍽️ 배가 고파 보여')+'<br>'+G_PROD[p.c].e+' '+G_PROD[p.c].n+' 모아둔 것: <b>'+a.n+'</b>개 (모으면 '+gStars(gVlLv('farm'))+') · '+Math.round(gAnInt(g,a)/60000)+'분마다 1개</div>'+
   (foods.length?'<div class="gcr">'+foods.map(function(c){return '<button class="gcrb" data-act="gf" data-f="feed" data-id="'+id+'" data-k="'+c.k+'"><span>'+c.e+'</span><b>'+c.n+' ×'+f.inv[c.k]+'</b><small>'+c.f+'시간 배부름</small></button>';}).join('')+'</div>':'<p class="hint">먹이로 줄 작물이 없어. 텃밭에서 수확해봐 🌱</p>')+
   '<div class="gdmbt">'+(a.n>0?'<button class="btn sm gevob" data-act="gf" data-f="col" data-id="'+id+'">'+G_PROD[p.c].e+' 모으기 ('+a.n+')</button>':'')+'<button class="mini" data-act="gf" data-f="out" data-id="'+id+'">농장에서 내보내기</button><button class="mini" data-act="gdxx">닫기</button></div>');
 },
 feed:function(b){
  var g=gGet(),f=gFm(),id=b.dataset.id,c=G_CRM[b.dataset.k],a=null;f.an.forEach(function(x){if(x.id===id)a=x;});
  if(!a||!c||(f.inv[c.k]||0)<=0)return;
  var now=Date.now();gAnSync(g,a,now);if(a.fu<now){a.fu=now;a.lp=now;}
  if(a.fu-now>12*3600000){toast('이미 배불러서 더 못 먹어 😋');return;}
  f.inv[c.k]--;a.fu+=c.f*3600000;gSfx('coin');gSave();gDexModalClose();gRefresh();toast(G_CPM[id].n+'가 '+c.n+'을(를) 냠냠! 😋');
 },
 col:function(b){
  var g=gGet(),f=gFm(),id=b.dataset.id,a=null;f.an.forEach(function(x){if(x.id===id)a=x;});if(!a||a.n<=0)return;
  var p=G_CPM[id],k=G_PROD[p.c].k,ql=gVlLv('farm');gMtGive(k,ql,a.n);var n=a.n;a.n=0;gSfx('coin');gSave();gDexModalClose();gRefresh();toast(G_PROD[p.c].e+' ★'+ql+' '+n+'개 모았어!');
 },
 colall:function(b){
  var g=gGet(),f=gFm(),tot=0,ql=gVlLv('farm');f.an.forEach(function(a){if(a.n>0){var k=G_PROD[G_CPM[a.id].c].k;gMtGive(k,ql,a.n);tot+=a.n;a.n=0;}});
  if(!tot)return;gSfx('coin');gSave();gRefresh();toast('🧺 생산물 '+tot+'개를 모았어!');
 },
 out:function(b){
  var f=gFm(),id=b.dataset.id,a=null;f.an.forEach(function(x){if(x.id===id)a=x;});if(!a)return;
  if(a.n>0){var k=G_PROD[G_CPM[id].c].k;gMtGive(k,gVlLv('farm'),a.n);}
  f.an=f.an.filter(function(x){return x.id!==id;});delete gFA[id];gSave();gDexModalClose();gRefresh();toast('농장에서 쉬러 갔어');
 }
};
function gfDo(b){var fn=G_F[b.dataset.f];if(fn)fn(b);}
