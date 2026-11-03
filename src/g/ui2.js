/* ===== 사랑이 키우기 v2 UI ===== */
var GKEY='wt.game2',G_CAP=28800;
var G_NAMES=['아기','꼬물','호기심','짜잔','씽씽','병아리 요정','멋쟁이','브이 스타','파티 퀸','마법사','전설의 사랑이'];

var G_TKAMT={5:5,6:15,7:40,8:100,9:250,10:500};
var G_BWC={pushup:.64,squat:.7,lunge:.6,pullup:1,crunch:.3,legraise:.3,bridge:.4,calf:.8,deadbug:.1};
var G_DX={hi:['안녕',0],what:['응?',0],hehe:['헤헤',0],sleepy:['졸려',0],cry:['엉엉',0],wow:['우와',0],blank:['멍',0],shy:['수줍',0],mad:['발끈',0],huff:['씩씩',0],yum:['냠냠',0],q_sleep:['쿨쿨',0],q_nyam:['맛있다',0],r_zzz:['꿀잠',0],r_there:['저기!',0],r_here:['여기!',0],
 thumb:['최고!',1],roar:['으르렁',1],sparkle:['반짝',1],love:['사랑해',1],good:['좋아',1],p_hello2:['안녕하세요',1],p_meal:['밥 먹자',1],p_excited:['신나!',1],q_haha:['하하하',1],q_roll:['데굴데굴',1],r_hehe:['히히',1],r_aat:['아앗!',1],p_yum2:['쩝쩝',1],r_mung:['멍때리기',1],
 p_tada:['짜잔!',2],p_give:['줄게',2],p_pool:['물놀이',2],q_jjan:['짜잔 포즈',2],q_bike:['씽씽',2],q_back:['뒤돌아',2],q_v:['브이',2],
 p_bless:['복 많이 받아',3],p_bday:['생일 파티',3],q_bok:['복주머니',3],r_hall:['할로윈',3]};
var G_SM=G_DATA.dex.sm,G_SN=G_DATA.dex.sn,G_RAR={},G_RB=G_DATA.dex.rb,G_RN=['N','R','SR','SSR'],G_RC=['#9aa3ad','#4aa3ff','#b06cff','#ffb300'];
var G_RTOT=[0,0,0,0],G_SETB=G_DATA.dex.setb;
Object.keys(G_DX).forEach(function(k){G_RAR[k]=G_DX[k][1];G_RTOT[G_DX[k][1]]++;});
var G_ZI='<svg class="zin" viewBox="0 0 24 24" width="18" height="18"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><svg class="zout" viewBox="0 0 24 24" width="18" height="18"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',gLastSub='',gSub='',gChT=0,gS=null,gIv=0,gOff=null,gSaveT=0,gSm=false,gTipK=0,gLastShown=0,gNoteKey='',gHfxT=0,gCycle=-1;
function gNum(v,d){v=+v;return isFinite(v)?v:d;}
function gDayKey(ts){var d=new Date(ts);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function gMidnight(){var d=new Date();d.setHours(0,0,0,0);return d.getTime();}
function gDef(){var t=Date.now();return {ver:2,start:gMidnight(),last:t,hearts:0,rubies:0,tickets:1,stage:1,hp:0,kills:0,best:1,farm:false,hold:false,sk:0,dlyLeft:0,bt:0,fails:0,evo:0,credit:0,day:{d:'',t:0,w:0,c:0},lv:{atk:0,inc:0,spd:0},rl:{atk:0,heart:0,mv:0,sk:0,cbt:0,cbn:0},rp:{atk:0,inc:0,spd:0,sk:0,st:0,cbd:0,mv:0,bt:0,tk:0,rub:0,rpg:0},rpt:0,rebirths:0,ru:{atk:0,inc:0,spd:0,sk:0,st:0,ult:0},rbp:0,rbn:0,ch:0,gift1:1,st:{kg:0,sec:0,n:0,rub:0,tsec:0,days:0},done:{},tk:[],tkMade:{},dex:{},star:{},dup:{},stk:{n:0,ld:0,sh:0},snd:1,pity:0,pity2:0,pulls:0,hero:'',cdex:{},cstar:{},cdup:{},ceq:{gnd:'',sky:'',veh:''},cpity:0,cpity2:0,gd:'',rc:{fl:0,kg:0,hr:0,rb:0,wk:0},mxe:0,form:-1,bossLock:false,rbEvo:0,ach:{},fm:null,md:{}};}
function gLoad(){
  var d=gDef(),o=null;try{o=JSON.parse(localStorage.getItem(GKEY)||'null');}catch(e){}
  if(!o||typeof o!=='object')return d;
  ['start','last','hearts','rubies','tickets','hp','kills','rpt','rebirths','fails','sk','dlyLeft','bt','credit','rbp','rbn','ch'].forEach(function(k){d[k]=Math.max(0,gNum(o[k],d[k]));});
  d.stage=Math.max(1,Math.floor(gNum(o.stage,1)));d.best=Math.max(d.stage,Math.floor(gNum(o.best,1)));
  if(!o.gift1)d.tickets+=1;d.gift1=1;
  d.evo=Math.min(10,Math.max(0,Math.floor(gNum(o.evo,0))));d.farm=!!o.farm;d.hold=false;d.bossLock=!!o.bossLock||d.farm;
  if(o.day&&typeof o.day==='object'){d.day={d:String(o.day.d||''),t:Math.max(0,gNum(o.day.t,0)),w:Math.max(0,gNum(o.day.w,0)),c:Math.max(0,Math.min(2,gNum(o.day.c,0)))};}
  ['atk','inc','spd'].forEach(function(k){d.lv[k]=Math.min(2000,Math.max(0,Math.floor(gNum(o.lv&&o.lv[k],0))));});
  ['atk','heart','mv'].forEach(function(k){d.rl[k]=Math.min(500,Math.max(0,Math.floor(gNum(o.rl&&o.rl[k],0))));});
  [['sk',20],['cbt',20],['cbn',9]].forEach(function(x){d.rl[x[0]]=Math.min(x[1],Math.max(0,Math.floor(gNum(o.rl&&o.rl[x[0]],0))));});
  G_RBU.forEach(function(u){d.ru[u[0]]=Math.min(u[6]||500,Math.max(0,Math.floor(gNum(o.ru&&o.ru[u[0]],0))));});
  G_RPU.forEach(function(u){d.rp[u[0]]=Math.min(u[6]||500,Math.max(0,Math.floor(gNum(o.rp&&o.rp[u[0]],0))));});
  ['kg','sec','n','rub','tsec','days'].forEach(function(k){d.st[k]=Math.max(0,gNum(o.st&&o.st[k],0));});
  if(o.done&&typeof o.done==='object')Object.keys(o.done).slice(-500).forEach(function(k){d.done[k]=1;});
  if(o.tkMade&&typeof o.tkMade==='object')Object.keys(o.tkMade).forEach(function(k){if(G_TKAMT[k])d.tkMade[k]=1;});
  if(o.dex&&typeof o.dex==='object')Object.keys(o.dex).forEach(function(k){if(G_RAR.hasOwnProperty(k))d.dex[k]=Math.min(9999,Math.max(1,Math.floor(gNum(o.dex[k],1))));});
  d.star={};d.dup={};
  Object.keys(d.dex).forEach(function(k){d.star[k]=Math.min(5,Math.max(1,Math.floor(gNum(o.star&&o.star[k],1))));d.dup[k]=(o.dup&&typeof o.dup==='object')?Math.min(99999,Math.max(0,Math.floor(gNum(o.dup[k],0)))):Math.max(0,d.dex[k]-1);});
  if(o.stk&&typeof o.stk==='object'){d.stk={n:Math.min(99999,Math.max(0,Math.floor(gNum(o.stk.n,0)))),ld:Math.max(0,gNum(o.stk.ld,0)),sh:gNum(o.stk.sh,0)>0?1:0};}
  d.snd=o.snd===0?0:1;
  d.hero=(typeof o.hero==='string'&&d.dex[o.hero])?o.hero:'';
  var OLDC={bear:'g00',bunny:'g06',fox:'g08',lion:'g19',chick:'s01',bfly:'s04',owl:'s03',rbird:'s00',car:'v03',bus:'v01',train:'v13',rocket:'v00'};
  if(o.cdex&&typeof o.cdex==='object'){Object.keys(OLDC).forEach(function(ok){if(o.cdex[ok]){var nk=OLDC[ok];o.cdex[nk]=(o.cdex[nk]||0)+o.cdex[ok];o.cstar=o.cstar||{};o.cdup=o.cdup||{};o.cstar[nk]=Math.max(o.cstar[nk]||1,(o.cstar[ok]||1));o.cdup[nk]=(o.cdup[nk]||0)+(o.cdup[ok]||0);if(o.ceq){Object.keys(o.ceq).forEach(function(c){if(o.ceq[c]===ok)o.ceq[c]=nk;});}delete o.cdex[ok];}});}
  if(o.cdex&&typeof o.cdex==='object')Object.keys(o.cdex).forEach(function(k){if(G_CPM[k]){d.cdex[k]=Math.min(9999,Math.max(1,Math.floor(gNum(o.cdex[k],1))));d.cstar[k]=Math.min(5,Math.max(1,Math.floor(gNum(o.cstar&&o.cstar[k],1))));d.cdup[k]=Math.min(99999,Math.max(0,Math.floor(gNum(o.cdup&&o.cdup[k],0))));}});
  G_CPO.forEach(function(c){var k=o.ceq&&o.ceq[c];d.ceq[c]=(typeof k==='string'&&d.cdex[k]&&G_CPM[k].c===c)?k:'';});
  d.cpity=Math.max(0,Math.floor(gNum(o.cpity,0)));d.cpity2=Math.max(0,Math.floor(gNum(o.cpity2,0)));d.gd=typeof o.gd==='string'?o.gd.slice(0,12):'';
  ['fl','kg','hr','rb','wk'].forEach(function(k){d.rc[k]=Math.min(99999,Math.max(0,Math.floor(gNum(o.rc&&o.rc[k],0))));});
  d.mxe=Math.min(10,Math.max(0,Math.floor(gNum(o.mxe,0))));d.form=Math.min(10,Math.max(-1,Math.floor(gNum(o.form,-1))));
  d.rbEvo=Math.min(10,Math.max(0,Math.floor(gNum(o.rbEvo,0))));
  d.fm=gFmLoad(o.fm);d.vl=gVlLoad(o.vl);
  d.md={};if(o.md&&typeof o.md==='object')Object.keys(o.md).forEach(function(k){if(/^[0-9]_[0-9]$/.test(k))d.md[k]=Math.min(5,Math.max(1,Math.floor(gNum(o.md[k],1))));});
  gMdBackfill(d);
  if(o.ach&&typeof o.ach==='object')Object.keys(o.ach).forEach(function(k){if(/^[a-z]+\d+$/.test(k))d.ach[k]=1;});
  ['pity','pity2','pulls'].forEach(function(k){d[k]=Math.max(0,Math.floor(gNum(o[k],0)));});
  if(Array.isArray(o.tk))d.tk=o.tk.slice(0,12).map(function(t){return t&&G_TKAMT[t.lvl]?{lvl:+t.lvl,amt:G_TKAMT[t.lvl],ts:gNum(t.ts,0),used:gNum(t.used,0),no:String(t.no||'').slice(0,20)}:null;}).filter(Boolean);
  return d;
}
function gGet(){if(!gS){gS=gLoad();gSave();}return gS;}
function gSave(){try{if(gS)localStorage.setItem(GKEY,JSON.stringify(gS));}catch(e){}}
function gFmt(v){
  v=+v||0;if(v<1000)return v<10&&v%1?(Math.floor(v*10)/10)+'':Math.floor(v)+'';
  if(v>=1e21){var e=Math.floor(Math.log10(v));return (v/Math.pow(10,e)).toFixed(2)+'e'+e;}
  var U=['K','M','B','T','Qa','Qi'],i=-1;while(v>=1000&&i<U.length-1){v/=1000;i++;}
  return (v<10?Math.floor(v*100)/100:v<100?Math.floor(v*10)/10:Math.floor(v))+U[i];
}
function gRuby(sz){sz=sz||16;return '<svg class="gruby" width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z" fill="#E0245E"/><path d="M6 3l-4 6h20l-4-6z" fill="#FF6B93"/><path d="M2 9l10 12L8 9zM22 9L12 21l4-12z" fill="#B3123F" opacity=".55"/><path d="M8 9l4 12 4-12z" fill="#FF4D7E" opacity=".9"/></svg>';}
/* ---- 레벨/크레딧 ---- */
function gNeed(L,g){g=g||gGet();var r=Math.min(10,g.rbEvo||0),n=Math.pow(2,L)-1;if(!r||L<=0)return n;if(L<=r)return n/2;var nr=Math.pow(2,r)-1;return nr/2+(n-nr);}
function gLvOf(c,g){var L=0;while(L<10&&c>=gNeed(L+1,g)-1e-9)L++;return L;}
function gF(x){return x<=1?x:1+0.3*(x-1);}
function gScore(t,w){return Math.min(2,(gF(t/900)+gF(w/2700))/2);}
function gBodyKg(){try{var b=S.body.filter(function(x){return x.kg>0;});return b.length?b[0].kg:60;}catch(e){return 60;}}
function gEffKg(it){
  var kg=0,bw=gBodyKg(),id=String(it.id||'').replace(/^b-/,''),co=G_BWC.hasOwnProperty(id)?G_BWC[id]:.5;
  (it.sets||[]).forEach(function(s){var w=s.kg>0?s.kg:bw*co;kg+=w*(s.reps||0);});return kg;
}
function gDayView(g){return g.day.d===gDayKey(Date.now())?g.day:{d:'',t:0,w:0,c:0};}
function gCatch(){
  var g=gGet(),now=Date.now(),dt=(now-g.last)/1000;
  if(!(dt>0)){g.last=now;return;}
  var raw=dt;dt=Math.min(dt,G_CAP);var r=gAdvance(g,dt);g.last=now;
  if(raw>=60)gOff={sec:raw,h:r.h,s:r.s,cap:raw>G_CAP};
  gSave();
}
function gMkTk(g,L){
  var ts=Date.now();g.tkMade[L]=1;
  g.tk.push({lvl:L,amt:G_TKAMT[L],ts:ts,used:0,no:'WP-'+('0'+L).slice(-2)+'-'+ts.toString(36).slice(-5).toUpperCase()});
}
function gReward(entry,prN){
  var g=gGet();if(!entry||g.done[entry.id])return null;
  if(entry.ts<g.start)return null;
  g.done[entry.id]=1;
  var kg=0,sec=0,sets=0;
  (entry.items||[]).forEach(function(i){sets+=i.sets.length;if(i.type==='weight')kg+=gEffKg(i);else i.sets.forEach(function(s){sec+=s.sec||0;});});
  var RR=G_DATA.rubyRew,rub=Math.min(RR.max,Math.max(RR.min,Math.round(RR.base+sets*RR.perSet+kg/RR.perKg+sec/RR.perSec+(prN||0)*RR.perPr)));rub=Math.max(1,Math.round(rub*(1+RR.rp*(g.rp.rub||0))*(1+RR.evo*g.evo)*(1+gPb(g,'rub'))));
  var tk=2+(g.rp.tk||0);
  var k=gDayKey(entry.ts);if(g.day.d!==k){g.day={d:k,t:0,w:0,c:0};g.st.days++;}
  g.day.t+=sec;g.day.w+=kg;
  var stk=gStreak(g,entry.ts);
  var nc=gScore(g.day.t,g.day.w),dc=Math.max(0,nc-g.day.c);g.day.c=nc;g.credit+=dc;
  var newTk=[],ready=gEvoReady(g);
  g.st.kg+=kg;g.st.sec+=sec;g.st.n+=1;g.st.rub+=rub;g.st.tsec+=entry.seconds||0;
  g.rubies+=rub;g.tickets+=tk;
  var fm=gFm(),wb=Math.min(3,30-fm.water);fm.water+=wb;
  gSave();
  return {water:wb,stk:stk,rub:rub,tk:tk,lvUp:null,ready:ready,newTk:newTk,score:nc};
}
/* ---- 화면 조각 ---- */
function gShown(g){return g.farm?Math.max(1,g.stage-1):g.stage;}
function gHeroCls(e){var c='ghw';for(var i=1;i<=e;i++)c+=' l'+i;return c;}
function gRainHtml(on){var s='';for(var i=0;i<7;i++)s+='<span style="left:'+(6+i*14)+'%;animation-delay:'+(i*.37)+'s;animation-duration:'+(2.2+(i%3)*.5)+'s">⭐</span>';return '<div class="grain'+(on?' on':'')+'" id="g-rain">'+s+'</div>';}
function gArenaStyle(n){var r=G_REG[gRegIdx(n)];return 'background:linear-gradient('+r.sky[0]+' 0%,'+r.sky[1]+' 62%,'+r.gr[0]+' 62%,'+r.gr[1]+' 100%)';}
function gStText(g){var n=g.stage,sh=gShown(g);return g.farm?('🔁 '+sh+'층 반복 · 보스 '+n+'층 대기'):(G_REG[gRegIdx(n)].n+' · '+n+'층'+(n%10===0?' · BOSS':''));}
function gNoteHtml(g){
  if(g.stage%10!==0)return '';
  if(g.farm)return '<span>보스한테 졌어… 아래 층에서 힘을 모으는 중이야 💪<br>준비됐다 싶으면 다시 도전해봐!</span><button class="mini bossb" data-act="gboss">⚔️ 보스 도전!</button>';
  return '<span>⚔️ 보스전! 제한시간 안에 쓰러뜨려야 해</span>';
}
var gFarmS=0,gFarmN=0;
function gQuant(f,H,g){var a=gAtk(g),n=H/a;if(!(n>0)||n>300)return f;f=1-Math.floor((1-f)*n+1e-6)/n;return f<0?0:f;}
function gFrac(g,now){
  var sh=gShown(g),H=gHp(sh),f;
  if(g.farm){var cyc=Math.max(.3,gHp(sh)/gDps(g)+gDly(g));
    if(!gFarmS)gFarmS=now;var pr=(now-gFarmS)/1000/cyc;
    if(pr>=1){gFarmN++;pr=pr%1;gFarmS=now-pr*cyc*1000;}
    f=1-pr;}
  else{gFarmS=0;f=g.hp/H;}
  return gQuant(f,H,g);
}
function gChips(g){return '<div class="gres"><span class="chip" id="g-hearts" data-act="gchip" data-k="h">💗 '+gFmt(g.hearts)+'</span><span class="chip" id="g-pps" data-act="gchip" data-k="d">⚔️ '+gFmt(gDps(g))+'/초</span><span class="chip rb" id="g-rub" data-act="gchip" data-k="r">'+gRuby(15)+' '+gFmt(g.rubies)+'</span><span class="chip" id="g-tk" data-act="gchip" data-k="t">🎟️ '+g.tickets+'</span></div><div class="gchtip" id="g-chtip" hidden></div>';}
function gArena(g){
  var n=g.stage,sh=gShown(g),boss=sh%10===0&&!g.farm,r=G_REG[gRegIdx(sh)];
  gMdSee(g,sh);gLastShown=sh;gNoteKey='';gHK=gHeroKey(g);setTimeout(function(){gPreNext(g);},400);
  return '<div class="garena'+(boss?' boss':'')+(r.d?' dk':'')+(gSm?' sm':'')+'" id="g-arena" style="'+gArenaStyle(sh)+'">'+gChips(g)+
   '<div class="glv" id="g-lv">Lv.'+g.evo+' '+G_NAMES[g.evo]+' 사랑이</div><div class="gst" id="g-st">'+gStText(g)+'</div>'+
   '<div class="gfield" id="g-field">'+gRainHtml(g.evo>=10)+'<div id="g-evw">'+gEvoBtnHtml(g)+'</div><div id="g-buffw">'+gBuffHtml(g)+'</div><button class="gsnd" id="g-snd" data-act="gsnd" aria-label="효과음">'+(g.snd?'🔊':'🔇')+'</button><div class="gbub" id="g-bub" hidden></div>'+gCbHtml()+'<button class="gzoom" id="g-zoom" data-act="gzoom" aria-label="전투 화면 전환">'+G_ZI+'</button>'+gHeroHtml(g)+'<div class="gmon'+gMonCls(sh,boss)+'" id="g-mon">'+gMonSvg(sh)+'</div></div>'+
   '<div class="gbt" id="g-bt"'+(boss?'':' hidden')+'><i id="g-bti" style="width:100%"></i></div>'+
   '<div class="ghp"><i id="g-hp" style="width:'+Math.max(0,Math.min(100,gFrac(g,Date.now())*100))+'%"></i></div>'+
   '<div class="gmn" id="g-mn">'+gMonName(sh)+'</div><div class="gnote" id="g-note">'+gNoteHtml(g)+'</div></div>';
}
function gBar(p,cls){return '<span class="gbar '+(cls||'')+'"><i style="width:'+Math.round(Math.max(0,Math.min(1,p))*100)+'%"></i></span>';}
function gEvoCard(g){
  var dv=gDayView(g),L=g.evo,h='<h2>성장 · Lv.'+L+'</h2><div class="gevo"><img class="mas gfr" alt="" src="'+gFront(L)+'" style="height:70px;image-rendering:pixelated"><div class="xt"><b>'+G_NAMES[L]+' 사랑이</b><small>공격·수입 ×'+G_EVOM(L).toFixed(2)+' · 루비 +'+L*10+'%</small></div></div>';
  if(L>=10)return h+'<p class="hint">최종 단계야! 진화해서 더 강해질 수 있어 🌟</p>';
  var a=g.credit-gNeed(L,g),b=gNeed(L+1,g)-gNeed(L,g);
  if(gEvoReady(g))h+='<button class="btn sm gevob" data-act="gevo">✨ 성장하기! (Lv.'+(L+1)+')</button>';
  h+='<p class="hint">다음 <b>Lv.'+(L+1)+' '+G_NAMES[L+1]+'</b> (공격·수입 ×'+G_EVOM(L+1).toFixed(2)+' · 루비 +'+(L+1)*10+'%)까지 운동 점수 '+Math.max(0,a).toFixed(1)+' / '+b+'</p>'+gBar(a/b,'pk');
  return h+(g.rbEvo?'<p class="hint">🌸 진화 보너스: Lv.'+g.rbEvo+'까지는 필요한 점수가 절반이야!</p>':'')+'<p class="hint">운동 점수는 하루 최대 2점! 시간 운동 15분 + 2.7톤을 채우면 1점이고, 넘치면 30%만큼 더 쳐줘.</p>';
}
function gTodayCard(g){
  var dv=gDayView(g);
  return '<h2>오늘 운동량</h2>'+
   '<div class="gneed"><span>⏱ 시간 운동</span>'+gBar(dv.t/900)+'<b>'+Math.floor(dv.t/60)+' / 15분</b></div>'+
   '<div class="gneed"><span>🏋️ 중량</span>'+gBar(dv.w/2700)+'<b>'+(dv.w/1000).toFixed(2)+' / 2.7t</b></div>'+
   '<div class="gneed"><span>⭐ 오늘 점수</span>'+gBar(dv.c/2,'pk')+'<b>'+dv.c.toFixed(2)+' / 2</b></div>';
}
function gPct(x){x=Math.round(x*10)/10;return (x%1?x.toFixed(1):x)+'%';}
function gUpRows(g){
  var U=[['atk','💪','힘 키우기','공격력 +7%',(Math.pow(GP.AM,g.lv.atk)-1)*100],['inc','🧸','장난감 모으기','하트 수입 +10%',GP.IM*g.lv.inc*100],['spd','👟','운동화 신기','공격 속도 +2.4%',(Math.min(GP.SCAP,1+GP.SS*g.lv.spd)-1)*100]];
  return U.map(function(u){var c=gCost(u[0],g.lv[u[0]]);return '<li class="grow"><span class="gic">'+u[1]+'</span><span class="xt"><b>'+u[2]+' <em>Lv.'+g.lv[u[0]]+'</em></b><small>'+u[3]+'</small><small class="gtot">지금까지 총 +'+gPct(u[4])+'</small></span><button class="mini pri" data-act="gbuy" data-k="'+u[0]+'" id="gb-'+u[0]+'"'+(g.hearts>=c?'':' disabled')+'>💗 '+gFmt(c)+'</button></li>';}).join('');
}
function gRUpRows(g){
  var R=function(x){x=Math.round(x*10)/10;return x;};
  return [['atk','루비 특훈','공격력 +15%','+'+gPct(GP.RAT*g.rl.atk*100),0],['heart','루비 간식','하트 수입 +15%','+'+gPct(GP.RHT*g.rl.heart*100),0],['mv','루비 달리기','이동 시간 −3%','−'+gPct((1-Math.pow(0.97,g.rl.mv))*100),0],['sk','루비 점프','층 건너뛰기 확률 +1.5% (최대 30%)','+'+gPct(1.5*g.rl.sk),20],['cbt','루비 집중','콤보 유지시간 +0.1초 (최대 +2초)','+'+R(0.1*g.rl.cbt)+'초',20],['cbn','루비 연타','필살기 필요 타수 3레벨마다 −1 (최대 −3타)','−'+Math.floor(g.rl.cbn/3)+'타',9]].map(function(u){var l=g.rl[u[0]],c=gRCost(l),fl=u[4]&&l>=u[4];return '<li class="grow"><span class="gic">'+gRuby(26)+'</span><span class="xt"><b>'+u[1]+' <em>Lv.'+l+(u[4]?'/'+u[4]:'')+'</em></b><small>'+u[2]+' (환생·진화해도 유지)</small><small class="gtot">지금까지 총 '+u[3]+'</small></span><button class="mini rb" data-act="grbuy" data-k="'+u[0]+'" id="gr-'+u[0]+'"'+(!fl&&g.rubies>=c?'':' disabled')+'>'+(fl?'MAX':gRuby(14)+' '+gFmt(c))+'</button></li>';}).join('');
}
function gRPTot(k,l){
  if(k==='atk'||k==='inc')return '+'+gPct(40*l);if(k==='spd')return '+'+gPct(5*l);if(k==='rub'||k==='rpg')return '+'+gPct(10*l);if(k==='sk')return '+'+gPct(Math.min(60,3*l));if(k==='st')return '+'+(10*l)+'층';if(k==='cbd')return '+'+(Math.round(l)/10)+'%p';
  if(k==='mv')return '−'+gPct((1-Math.pow(G_DATA.dly.rp,l))*100);if(k==='bt')return '+'+l+'초';return '+'+l+'장';
}
function gRPRows(g){
  return G_RPU.map(function(u){var l=g.rp[u[0]],mx=u[6],c=gRPCost(u,l),full=mx&&l>=mx;
    return '<li class="grow"><span class="gic">'+(u[1]==='RUBY'?gRuby(26):u[1])+'</span><span class="xt"><b>'+u[2]+' <em>Lv.'+l+(mx?'/'+mx:'')+'</em></b><small>'+u[3]+'</small><small class="gtot">지금까지 총 '+gRPTot(u[0],l)+'</small></span><button class="mini rp" data-act="grpbuy" data-k="'+u[0]+'" id="gp-'+u[0]+'"'+(!full&&g.rpt>=c?'':' disabled')+'>'+(full?'MAX':'🌸 '+gFmt(c))+'</button></li>';}).join('');
}
function gRBTot(k,l){if(k==='atk'||k==='inc')return '+'+gPct(12*l);if(k==='spd')return '+'+gPct(3*l);if(k==='sk')return '+'+gPct(2*l);if(k==='ult')return '+'+gPct(8*l);return '+'+(4*l)+'층';}
function gRBRows(g){
  return G_RBU.map(function(u){var l=g.ru[u[0]],mx=u[6],c=gRBCost(u,l),full=mx&&l>=mx;
    return '<li class="grow"><span class="gic">'+u[1]+'</span><span class="xt"><b>'+u[2]+' <em>Lv.'+l+(mx?'/'+mx:'')+'</em></b><small>'+u[3]+'</small><small class="gtot">지금까지 총 '+gRBTot(u[0],l)+'</small></span><button class="mini rp" data-act="grbbuy" data-k="'+u[0]+'" id="gq-'+u[0]+'"'+(!full&&g.rbp>=c?'':' disabled')+'>'+(full?'MAX':'🔁 '+gFmt(c))+'</button></li>';}).join('');
}
function gRbCard(g){
  var gain=gRBGain(g),ok=g.stage>=1000;
  return '<h2>환생 <span class="chip" id="g-rbp" style="font-size:13px">🔁 '+gFmt(g.rbp)+'</span></h2>'+
   '<p class="hint">1000층부터 환생할 수 있어. 올라간 층이 높을수록 환생 포인트(🔁)를 더 받아!<br>환생하면 <b>층·하트·하트 강화</b>가 처음으로 돌아가. 성장 Lv, 환생 포인트와 환생 강화, 루비, 성장 포인트는 그대로야. (진화하면 환생 포인트와 환생 강화는 처음으로 돌아가.)</p>'+
   '<button class="btn sm gevob" data-act="grb2" id="g-rb2"'+(ok?'':' disabled')+'>'+(!ok?'1000층부터 가능해':(armed==='grb2'?'정말 환생할까? 한 번 더 눌러!':'🔁 환생하기 (+'+gain+' 포인트)'))+'</button>'+
   '<ul class="list" id="g-rbs">'+gRBRows(g)+'</ul>';
}
function gRebirthCard(g){
  var gain=gRPGain(g),ok=g.evo>=3&&g.best>=1000;
  return '<h2>진화 <span class="chip" id="g-rpt" style="font-size:13px">🌸 '+gFmt(g.rpt)+'</span></h2>'+
   '<p class="hint">성장 Lv.3 이상이고 1000층을 넘어본 적이 있으면 진화할 수 있어. 모은 하트가 많고 성장 레벨이 높을수록 성장 포인트(🌸)를 더 받아!<br>진화하면 <b>성장 레벨·층·하트·하트 강화·환생 포인트와 환생 강화</b>가 처음으로 돌아가. 성장 포인트와 성장 강화, 루비·루비 강화, 보상권 기록, 통계는 그대로야.</p>'+
   '<button class="btn sm gevob" data-act="grebirth" id="g-reb"'+(ok?'':' disabled')+'>'+(!ok?(g.evo<3?'성장 Lv.3부터 가능해':'1000층을 넘어야 가능해'):(armed==='greb'?'정말 진화할까? 한 번 더 눌러!':'🌸 진화하기 (+'+gain+' 포인트)'))+'</button>'+
   '<ul class="list" id="g-rps">'+gRPRows(g)+'</ul>';
}
function gTkTipText(L){return 'Lv.'+L+'까지 키우면 받는 '+G_TKAMT[L]+'만원 보상권이야. 평생 딱 한 번만 받을 수 있고, 진화해서 다시 Lv.'+L+'이 돼도 또 나오진 않아. 받으면 \'보내기\'로 청구권 그림을 카톡에 보내서 청구하고, 돈을 받았으면 \'사용 완료\'를 두 번 눌러 표시해줘!';}
function gTkCard(g){
  var h='<h2>🎁 보상권</h2><ul class="list">';
  [5,6,7,8,9,10].forEach(function(L){
    var t=null;g.tk.forEach(function(x){if(x.lvl===L)t=x;});
    var ic,sub,btn='';
    if(!t){ic='🔒';sub='Lv.'+L+' 달성하면 받아';}
    else if(t.used){ic='✅';var d=new Date(t.used);sub='<span class="gstmp u">사용 완료</span> '+(d.getMonth()+1)+'/'+d.getDate();btn='<span class="gtkb"><button class="mini" data-act="gtku" data-k="'+L+'">📤 보내기</button></span>';}
    else{ic='🎁';sub='<span class="gstmp">사용 가능</span> 눌러서 설명 보기';btn='<span class="gtkb"><button class="mini pri" data-act="gtku" data-k="'+L+'">📤 보내기</button><button class="mini" data-act="gtkused" data-k="'+L+'">'+(armed==='tk'+L?'정말? 한 번 더!':'사용 완료')+'</button></span>';}
    h+='<li class="grow gtk" data-act="gtip" data-k="'+L+'"><span class="gic">'+ic+'</span><span class="xt"><b>Lv.'+L+' · '+G_TKAMT[L]+'만원</b><small>'+sub+'</small></span>'+btn+'</li>';
    if(gTipK===L)h+='<li class="gtip">'+gTkTipText(L)+'</li>';
  });
  return h+'</ul>';
}
var gStT='w';
function gSpP(x){x=Math.round(x*1000)/10;return (x>=0?'+':'')+x+'%';}
function gSpN(v){v=+v||0;return v<100?(Math.round(v*100)/100)+'':gFmt(v);}
function gPetSrc(g,k){
  var out=[];if(!g.ceq||!g.cdex)return out;
  G_CPO.forEach(function(c){var id=g.ceq[c],p=id&&G_CPM[id];if(!p||!g.cdex[id])return;var v=0;
    if(p.a===k){v=gCpVal(g,id);v=(k==='bt')?v:v/100;}
    var m=G_CSM[(g.cstar&&g.cstar[id])||1]||1;
    (G_CPX[p.r]||[]).forEach(function(x){if(x[0]===k){var w=k==='cbn'?x[1]:x[1]*m;v+=(k==='cbt'||k==='cbn')?w:w/100;}});
    if(v)out.push([G_CPC[c][0]+' 동료 ('+p.n+')',v]);});
  return out;
}
function gSpecs(g){
  var rl=g.rl||{},rp=g.rp||{},L=g.lv,stk=gStkB(g),dex=gDexB(g),pets=function(k,f){return gPetSrc(g,k).map(function(x){return [x[0],f(x[1])];});},pp=function(x){return gSpP(x);};
  var S=[];
  var mulRows=function(base,rows,pk,bl){return [[bl||'기본',base]].concat(rows.filter(function(r){return r[1]!==0;}).map(function(r){return [r[0],gSpP(r[1])];})).concat(pets(pk,pp));};
  S.push({ic:'⚔️',n:'공격력',v:gSpN(gAtk(g)),rows:mulRows(gFmt(GP.A0*Math.pow(GP.AM,L.atk)),[
    ['🌱 성장 단계 (Lv.'+g.evo+')',G_EVOM(g.evo)-1],['📖 오라 도감',dex],['🔥 연속 운동 버프',stk],
    ['💎 루비 강화',GP.RAT*(rl.atk||0)],['🔁 환생 강화',GP.RU*gRu(g,'atk')],['🌸 성장 강화',GP.SG*(rp.atk||0)]],'atk','기본 (3 + 💗 하트 강화 Lv.'+L.atk+')'),note:'하트 강화가 기본 공격력을 키우고, 나머지는 그 위에 곱해져요'});
  S.push({ic:'⚡',n:'공격 속도',v:gSpN(gSpd(g))+'/초',rows:mulRows('1',[
    ['💗 하트 강화 (Lv.'+L.spd+')',Math.min(GP.SCAP,1+GP.SS*L.spd)-1],['💎 루비 강화',0],['🔁 환생 강화',G_DATA.spd.ru*gRu(g,'spd')],['🌸 성장 강화',G_DATA.spd.rp*(rp.spd||0)]],'spd'),note:'하트 강화로는 최대 ×'+GP.SCAP+'까지, 나머지는 곱해져요'});
  S.push({ic:'🗡️',n:'초당 공격력',v:gFmt(gDps(g)),rows:[['공격력',gSpN(gAtk(g))],['× 공격 속도',gSpN(gSpd(g))+'/초']],note:'공격력 × 공격 속도'});
  S.push({ic:'💗',n:'하트 수입',v:'×'+gSpN(gInc(g)),rows:mulRows('×1',[
    ['💗 하트 강화 (Lv.'+L.inc+')',GP.IM*L.inc],['🌱 성장 단계 (Lv.'+g.evo+')',G_EVOM(g.evo)-1],['📖 오라 도감',dex],['🔥 연속 운동 버프',stk],
    ['💎 루비 강화',GP.RHT*(rl.heart||0)],['🔁 환생 강화',GP.RU*gRu(g,'inc')],['🌸 성장 강화',GP.SG*(rp.inc||0)]],'inc'),note:'모두 곱해져요'});
  S.push({ic:'🪜',n:'층 건너뛰기',v:gSpP(gSkipP(g)),rows:[['기본','+0%'],['💎 루비 강화',gSpP(G_DATA.skip.rl*(rl.sk||0))],['🔁 환생 강화',gSpP(G_DATA.skip.ru*gRu(g,'sk'))],['🌸 성장 강화',gSpP(G_DATA.skip.rp*(rp.sk||0))]].concat(pets('skip',pp)),note:'더해지고 최대 80%'});
  S.push({ic:'🚀',n:'시작 층',v:gStartStage(g)+'층',rows:[['기본','1층'],['🔁 환생 강화','+'+G_DATA.start.ru*gRu(g,'st')+'층'],['🌸 성장 강화','+'+G_DATA.start.rp*(rp.st||0)+'층']],note:'환생·진화 뒤 이 층에서 시작해요'});
  S.push({ic:'⏱️',n:'보스 제한시간',v:gBossT(g)+'초',rows:[['기본',GP.BOSS_T+'초'],['🌸 성장 강화','+'+Math.min(G_DATA.bt.max,rp.bt||0)+'초']].concat(pets('bt',function(v){return '+'+v+'초';})),note:''});
  S.push({ic:'🏃',n:'이동 대기시간',v:(Math.round(gDly(g)*100)/100)+'초',rows:[['기본',GP.DLY+'초'],['🌸 성장 강화 (이동 속도)','×'+Math.pow(G_DATA.dly.rp,rp.mv||0).toFixed(2)],['💎 루비 강화','×'+Math.pow(G_DATA.dly.rl,rl.mv||0).toFixed(2)]].concat(pets('mv',function(v){return '÷'+(1+v).toFixed(2);})),note:'짧을수록 좋아요'});
  S.push({ic:'💎',n:'운동 루비 보상',v:'×'+gSpN((1+0.1*(rp.rub||0))*(1+0.1*g.evo)*(1+gPb(g,'rub'))),rows:[['기본','×1'],['🌸 성장 강화 (루비 획득량)',gSpP(0.1*(rp.rub||0))],['🌱 성장 단계 (Lv.'+g.evo+')',gSpP(0.1*g.evo)]].concat(pets('rub',pp)),note:'모두 곱해져요'});
  S.push({ic:'🔥',n:'콤보 파워',v:'콤보당 '+gSpP(gCbPer(g)),rows:[['기본','+3%'],['🌸 성장 강화 (콤보 파워)',gSpP(G_DATA.combo.perRp*(rp.cbd||0))]].concat(pets('cbd',pp)),note:'콤보 1개당 추가 데미지 (100콤보면 ×100)'});
  S.push({ic:'⏳',n:'콤보 유지시간',v:(Math.round(gCbKeep(g)*10)/10)+'초',rows:[['기본','3초'],['💎 루비 강화','+'+(Math.round(0.1*(rl.cbt||0)*10)/10)+'초']].concat(pets('cbt',function(v){return '+'+(Math.round(v*10)/10)+'초';})),note:'마지막 공격 뒤 이 시간이 지나면 콤보가 끊겨요'});
  S.push({ic:'🎯',n:'필살기 필요 타수',v:gCbT(g)+'타',rows:[['기본','10타'],['💎 루비 강화','−'+Math.floor((rl.cbn||0)/3)+'타']].concat(pets('cbn',function(v){return '−'+Math.floor(v+1e-9)+'타';})),note:'하트빔 기준 · 별똥별 ×2 · 무지개 ×3 (최소 6타)'});
  S.push({ic:'💥',n:'필살기 위력',v:'×'+gSpN(gUlt(g)),rows:[['기본','×1'],['🔁 환생 강화',gSpP(G_DATA.ult.ru*gRu(g,'ult'))]].concat(pets('ult',pp)),note:'곱해져요'});
  return S;
}
function gSpecHtml(g){
  var S=gSpecs(g);
  return '<p class="hint" style="margin:2px 0 8px">스펙을 누르면 무엇으로 얼마나 올랐는지 볼 수 있어요. 동료는 장착한 친구만 계산돼요.</p>'+S.map(function(s){
    return '<details class="gspc"><summary><span class="gsi">'+s.ic+'</span><span class="gsn">'+s.n+'</span><b>'+s.v+'</b><i></i></summary><div class="gsb"><table class="gst">'+s.rows.map(function(r){return '<tr><td>'+r[0]+'</td><td><b>'+r[1]+'</b></td></tr>';}).join('')+'</table>'+(s.note?'<div class="gdtn" style="text-align:left">'+s.note+'</div>':'')+'</div></details>';
  }).join('');
}
function gStatCard(g){
  var seg=gSeg('stat',gStT,[['w','🏋️ 운동'],['c','⚔️ 전투력']]);
  if(gStT==='c')return '<h2>통계</h2>'+seg+gSpecHtml(g);
  var st=g.st,d=new Date(g.start);
  var c=[[fmtLong(st.tsec),'총 운동 시간'],[fmtLong(st.sec),'시간 운동 합계'],[Math.floor(st.kg).toLocaleString('en-US')+'kg','누적 중량'],[Math.floor(st.n)+'회','운동 횟수'],[Math.floor(st.days)+'일','운동한 날'],[gFmt(st.rub),'받은 루비'],[g.rebirths+'회','진화'],[g.rbn+'회','환생'],[g.best+'층','최고 기록']];
  return '<h2>통계 <small style="font-weight:400;font-size:12px;color:var(--ink2)">'+(d.getMonth()+1)+'월 '+d.getDate()+'일부터</small></h2>'+seg+'<div class="gstat">'+c.map(function(x){return '<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>';}).join('')+'</div>';
}
var gUpT='h',gGrT='s';
function gRdy(g){return {e:g.evo>=3&&g.best>=1000,b:g.stage>=1000};}
function gGlow(g){var r=gRdy(g);[['.gm[data-k=grow]',r.e],['.gm[data-k=up]',r.b],['.gsg[data-t=grow][data-k=e]',r.e],['.gsg[data-t=up][data-k=b]',r.b]].forEach(function(x){var el=document.querySelector(x[0]);if(el)el.classList.toggle('rdy',!!x[1]);});}
function gSeg(t,cur,arr){return '<div class="gseg g'+arr.length+'">'+arr.map(function(a){return '<button class="gsg'+(cur===a[0]?' on':'')+(a[2]?' rdy':'')+'" data-act="gtab" data-t="'+t+'" data-k="'+a[0]+'">'+a[1]+'</button>';}).join('')+'</div>';}
var G_MENU=[['grow','🌱','성장'],['up','💪','강화'],['tk','🎁','보상'],['gac','🎟️','뽑기'],['dex','📖','도감'],['vil','🏡','마을'],['stat','📊','통계']];
function gMenuOn(k){return gSub===k||(k==='vil'&&gSub==='farm');}
function gMenuHtml(){var gg=gGet(),rd=gAchReady(gg)>0,rr=gRdy(gg);return '<nav class="gmenu">'+G_MENU.map(function(m){return '<button class="gm'+(gMenuOn(m[0])?' on':'')+((m[0]==='grow'&&rr.e)||(m[0]==='up'&&rr.b)?' rdy':'')+'" data-act="gmenu" data-k="'+m[0]+'"><span>'+m[1]+'</span>'+m[2]+(m[0]==='tk'&&rd?'<i class="gdot"></i>':'')+'</button>';}).join('')+'</nav>';}
function gDexBonus(g){return gDexB(g)*100;}
function gDexN(g){return Object.keys(g.dex).length;}
function gGacCard(g){
  var tabs='<div class="gseg"><button class="gsg'+(gGacT==='a'?' on':'')+'" data-act="gtab" data-t="gac" data-k="a">✨ 오라 뽑기</button><button class="gsg'+(gGacT==='p'?' on':'')+'" data-act="gtab" data-t="gac" data-k="p">🐾 동료 뽑기</button></div>';
  return tabs+(gGacT==='p'?gGacPetCard(g)+gShopHtml(g):gGacAuraCard(g)+gShopHtml(g));
}
var gGacT='a',gDxT='a';
function gMaxEvo(g){return Math.max(g.evo,g.rbEvo||0,g.mxe||0);}
function gFormLv(g){var f=g.form;return (f>=0&&f<=gMaxEvo(g))?f:g.evo;}
function gShopHtml(g){
  return '<h2 style="margin-top:16px">🛒 루비 상점</h2><ul class="list"><li class="grow"><span class="gic">🎟️</span><span class="xt"><b>뽑기권 1장</b><small>오라·동료 뽑기에 모두 쓸 수 있어</small></span><button class="mini rb" data-act="gbtk"'+(g.rubies>=5?'':' disabled')+'>'+gRuby(14)+' 5</button></li><li class="grow"><span class="gic">🛡️</span><span class="xt"><b>연속 방지권</b><small>'+(g.stk.sh?'이미 1장 가지고 있어 (최대 1장)':'운동 하루 빠져도 연속 유지')+'</small></span><button class="mini rb" data-act="gbsh"'+(g.rubies>=100&&!g.stk.sh?'':' disabled')+'>'+(armed==='gsh'?'정말? 한 번 더!':gRuby(14)+' 100')+'</button></li></ul>';
}
function gGacAuraCard(g){
  var pr=Math.max(1,G_DATA.pet.gacha.pity1-(g.pity||0)),ps=Math.max(1,G_DATA.pet.gacha.pity2-(g.pity2||0));
  return '<h2>🎟️ 뽑기</h2><p class="hint">운동을 끝낼 때마다 뽑기권을 받아. 사랑이 오라를 뽑아서 도감을 채우면 공격력이랑 하트 수입이 영구로 올라가!</p>'+
   '<div class="gneed" style="grid-template-columns:1fr auto"><span>내 뽑기권</span><b style="font-size:16px">🎟️ '+g.tickets+'장</b></div>'+
   '<p class="hint" style="font-size:12px">확률: N 55% · R 33% · SR 10% · SSR 2%<br>SR 이상 확정까지 '+pr+'번 · SSR 확정까지 '+ps+'번<br>이미 가진 오라가 또 나오면 도감에서 ⭐ 별 강화에 쓸 수 있어!</p>'+
   '<div style="display:flex;gap:8px"><button class="btn sm gevob" style="flex:1" data-act="gpull" data-t="a" data-k="1"'+(g.tickets>=1?'':' disabled')+'>1번 뽑기 (🎟️1)</button><button class="btn sm gevob" style="flex:1" data-act="gpull" data-t="a" data-k="10"'+(g.tickets>=10?'':' disabled')+'>10번 뽑기 (🎟️10)</button></div>';
}
function gStarStr(n,big){var h='';for(var i=1;i<=5;i++)h+='<span class="'+(i<=n?'on':'off')+'">★</span>';return h;}
function gMonoB(g,k){return (G_RB[G_RAR[k]]||0)*(G_SM[g.star[k]||1]||1);}
function gDexCard(g){
  var tabs='<div class="gseg g4"><button class="gsg'+(gDxT==='f'?' on':'')+'" data-act="gtab" data-t="dex" data-k="f">🎀 모습</button><button class="gsg'+(gDxT==='a'?' on':'')+'" data-act="gtab" data-t="dex" data-k="a">✨ 오라</button><button class="gsg'+(gDxT==='p'?' on':'')+'" data-act="gtab" data-t="dex" data-k="p">🐾 동료</button><button class="gsg'+(gDxT==='m'?' on':'')+'" data-act="gtab" data-t="dex" data-k="m">👾 몬스터</button></div>';
  if(gDxT==='f')return tabs+gFormDexCard(g);
  if(gDxT==='p')return tabs+gPetDexCard(g);
  if(gDxT==='m')return tabs+gMonDexCard(g);
  return tabs+gDexAuraCard(g);
}
/* ---- 몬스터 도감 ---- */
var G_LPB=['','✨','🌟','🌈','👑'];
function gMdSee(g,n){
  if(!gMonHasImg(n))return false;if(!g.md)g.md={};
  var k=gRegIdx(n)+'_'+gMonImgIdx(n),v=gLoopN(n)+1;
  if((g.md[k]||0)<v){g.md[k]=v;return true;}return false;
}
function gMdBackfill(g){
  if(!g.md)g.md={};var b=g.best||1;
  for(var t=0;t<10;t++)for(var i=0;i<10;i++){
    var st=i<9?t*100+i*10+1:t*100+100;
    if(b>=st){var v=Math.min(5,1+Math.floor((b-st)/1000));if((g.md[t+'_'+i]||0)<v)g.md[t+'_'+i]=v;}
  }
}
function gMonDexCard(g){
  var tot=0,h='',md=g.md||{};
  for(var t=0;t<10;t++){
    var its=[];for(var i=0;i<10;i++)if(md[t+'_'+i])its.push(i);
    if(!its.length)continue;tot+=its.length;
    h+='<h3 class="gcph">'+G_REG[t].n+' <small>'+its.length+'/10</small></h3><div class="gdx">'+its.map(function(i){
      var lv=md[t+'_'+i];
      return '<div class="gdxi" style="--rc:'+(i===9?'#ffb300':'#ff8fb8')+'" data-act="gmdi" data-k="'+t+'_'+i+'">'+(lv>1?'<b>'+G_LPB[lv-1]+'</b>':'')+'<img alt="" src="'+MON_I[t][i]+'"><i>'+(i===9?'왕':'')+'</i><small>'+MON_N[t][i]+'</small></div>';
    }).join('')+'</div>';
  }
  return '<p class="hint"><b>만난 몬스터 '+tot+'/100</b><br>만난 몬스터만 도감에 남아. 더 높은 층으로 올라가면 새 친구들을 만날 수 있어! (누르면 자세히 볼 수 있어)</p>'+(h||'<div class="gsoon"><div class="gsoon-i">👾</div><b>아직 만난 몬스터가 없어</b></div>');
}
function gMonModal(k){
  var p=k.split('_'),t=+p[0],i=+p[1],g=gGet(),lv=(g.md||{})[k];if(!lv||!MON_I[t])return;
  gDexModalClose();
  var fl=i<9?(t*100+i*10+1)+'~'+(t*100+i*10+10)+'층 (보스: '+(t*100+i*10+10)+'층)':(t*100+91)+'~'+(t*100+99)+'층에 가끔 · '+(t*100+100)+'층 대왕';
  var el=document.createElement('div');el.className='gdm';el.id='gdm';
  el.innerHTML='<div class="gdmc" style="--rc:'+(i===9?'#ffb300':'#ff8fb8')+'"><img style="height:150px" alt="" src="'+MON_I[t][i]+'"><div class="gdmn">'+MON_N[t][i]+'</div><div class="gdmi">'+G_REG[t].n+'<br>'+fl+'<br>만난 최고 모습: '+(lv>1?G_LPB[lv-1]+' '+G_LOOP[lv-1].trim():'기본')+'</div><div class="gdmbt"><button class="mini" data-act="gdxx">닫기</button></div></div>';
  el.addEventListener('click',function(e){if(e.target===el)gDexModalClose();});document.body.appendChild(el);
}
function gFormDexCard(g){
  var mx=gMaxEvo(g),cur=gFormLv(g),n=mx+1;
  var h='<p class="hint"><b>사랑이 모습 '+n+'/11</b><br>성장하면서 얻은 모습을 언제든 골라서 입을 수 있어. 누르면 앞·옆·공격 모션도 볼 수 있어! (지금 모습: <b>Lv.'+cur+' '+G_NAMES[cur]+'</b>'+(g.form>=0&&g.form<=mx?' · 직접 고름':' · 성장 모습 따라가는 중')+')</p><div class="gdx">';
  for(var L=0;L<=10;L++){
    var ok=L<=mx,on=ok&&g.form===L,grow=g.evo===L;
    h+='<div class="gdxi'+(ok?'':' no')+(on?' eq':'')+'" style="--rc:#ff8fb8" data-act="gfmi" data-k="'+L+'"><span class="gstars">Lv.'+L+'</span>'+(ok?'<img alt="" class="gfr" src="'+gFront(L)+'">':'<img alt="" class="gfr" src="'+gFront(L)+'" style="filter:brightness(0)">')+'<i>'+(grow?'지금':ok?'획득':'🔒')+'</i>'+(on?'<em class="geq">착용</em>':'')+'<small>'+(ok?G_NAMES[L]:'???')+'</small></div>';
  }
  return h+'</div>';
}
function gFormModal(L){
  var g=gGet(),old=document.getElementById('gdm');if(old&&old.parentNode)old.parentNode.removeChild(old);
  if(L>gMaxEvo(g))return;
  var on=g.form===L,el=document.createElement('div');el.className='gdm';el.id='gdm';
  var sh=SPR_S[L]||'';
  el.innerHTML='<div class="gdmc" style="--rc:#ff8fb8"><div class="gdmn">Lv.'+L+' '+G_NAMES[L]+' 사랑이</div><div class="gfvw"><div class="gfvc"><img class="gfr" alt="" src="'+gFront(L)+'"><small>앞모습</small></div><div class="gfvc"><div class="gfv st" style="background-image:url('+sh+')"></div><small>옆모습</small></div><div class="gfvc"><div class="gfv" style="background-image:url('+sh+')"></div><small>공격 모션</small></div></div>'+
   '<div class="gdmi">'+(g.evo===L?'지금 성장 단계 모습이야':'성장하면서 얻은 모습이야')+(on?' · 착용 중':'')+'</div>'+
   '<div class="gdmbt"><button class="btn sm gevob" data-act="gfeq" data-k="'+L+'">'+(on?'착용 해제 (성장 모습으로)':'이 모습으로 바꾸기')+'</button><button class="mini" data-act="gdxx">닫기</button></div></div>';
  el.addEventListener('click',function(e){if(e.target===el)gDexModalClose();});
  document.body.appendChild(el);
}
function gDexAuraCard(g){
  var ks=Object.keys(G_DX).filter(function(k){return MAS[k];}).sort(function(a,b){return G_RAR[b]-G_RAR[a]||(g.star[b]||0)-(g.star[a]||0);});
  var n=gDexN(g),b=gDexBonus(g),c=[0,0,0,0];ks.forEach(function(k){if(g.dex[k])c[G_RAR[k]]++;});
  var sets=[0,1,2,3].map(function(r){var ok=c[r]>=G_RTOT[r];return '<span class="gset'+(ok?' ok':'')+'" style="--rc:'+G_RC[r]+'">'+G_RN[r]+' '+c[r]+'/'+G_RTOT[r]+(ok?' ✔':' · 완성 +'+G_SETB[r]+'%')+'</span>';}).join('');
  var rdy=0;ks.forEach(function(k){if(g.dex[k]&&(g.star[k]||1)<5&&(g.dup[k]||0)>=G_SN[g.star[k]||1])rdy++;});
  return '<h2>📖 도감 '+n+'/'+ks.length+(rdy?' <span class="gstmp" style="border-color:#ffb300;color:#e08a00">강화 가능 '+rdy+'</span>':'')+'</h2><p class="hint">모은 오라 보너스: 공격력 +'+gPct(b)+' · 하트 수입 +'+gPct(b)+' (환생·진화해도 유지)<br><small>기본 N +0.5% · R +1% · SR +2% · SSR +4% · ⭐ 별이 오를 때마다 ×2 (4성→5성은 ×10)</small></p><div class="gsets">'+sets+'</div><p class="hint" style="font-size:12px">중복으로 얻으면 ⭐ 강화에 써! 2·4·8·16개씩 모으면 별이 하나씩 올라가. 오라를 누르면 자세히 볼 수 있어.</p>'+
   '<div class="gdx">'+ks.map(function(k){var cn=g.dex[k]||0,r=G_RAR[k],st=g.star[k]||1,need=G_SN[st],dp=g.dup[k]||0,ready=cn&&st<5&&dp>=need;
     return '<div class="gdxi'+(cn?'':' no')+(g.hero===k?' eq':'')+(ready?' rdy':'')+'" style="--rc:'+G_RC[r]+'" data-act="gdexi" data-k="'+k+'">'+(cn?'<span class="gstars">'+gStarStr(st)+'</span>':'<span class="gstars"></span>')+'<img alt="" src="'+MAS[k]+'"><i>'+G_RN[r]+'</i>'+(g.hero===k?'<em class="geq">장착</em>':'')+'<small>'+(cn?G_DX[k][0]:'???')+'</small>'+(cn?'<small class="gprog'+(ready?' ok':'')+'">'+(st>=5?'MAX':Math.min(dp,need)+'/'+need)+'</small>':'<small class="gprog">&nbsp;</small>')+'</div>';}).join('')+'</div>';
}
function gDexModal(k){
  var g=gGet(),old=document.getElementById('gdm');if(old&&old.parentNode)old.parentNode.removeChild(old);
  if(!g.dex[k])return;
  var r=G_RAR[k],st=g.star[k]||1,need=G_SN[st],dp=g.dup[k]||0,mx=st>=5,ready=!mx&&dp>=need;
  var cur=gMonoB(g,k),nxt=mx?cur:(G_RB[r]*(G_SM[st+1])),eq=g.hero===k;
  var el=document.createElement('div');el.className='gdm';el.id='gdm';
  el.innerHTML='<div class="gdmc" style="--rc:'+G_RC[r]+'"><div class="gdmst">'+gStarStr(st)+'</div><img alt="" src="'+MAS[k]+'"><div class="gdmn">'+G_DX[k][0]+' <span class="gdmr">'+G_RN[r]+'</span></div>'+
   '<div class="gdmi">보유 '+g.dex[k]+'장 · 강화 재료 '+dp+'장</div>'+
   '<table class="gdt"><thead><tr><th>효과</th><th>지금</th><th>다음 별</th></tr></thead><tbody>'+[['⚔️ 공격력'],['💗 하트 수입']].map(function(r,i){return '<tr class="mn"><td>'+r[0]+'</td><td><b>+'+gPct(cur)+'</b></td><td class="nx">'+(mx?'MAX':'+'+gPct(nxt)+(st===4?' (×10!)':' (×2)'))+'</td></tr>';}).join('')+'</tbody></table><div class="gdtn">'+(mx?'🌟 최고 강화 달성! ':'')+'오라는 하나만 장착할 수 있어요.</div>'+
   (mx?'':'<div class="gneed" style="grid-template-columns:1fr auto;width:100%">'+gBar(dp/need,'pk')+'<b>'+Math.min(dp,need)+' / '+need+'</b></div>')+
   '<div class="gdmbt">'+(mx?'':'<button class="btn sm gevob" data-act="gdxup" data-k="'+k+'"'+(ready?'':' disabled')+'>'+(ready?'⭐ 별 '+(st+1)+'개로 강화할래?':'재료가 모자라 ('+Math.min(dp,need)+'/'+need+')')+'</button>')+
   '<button class="mini" data-act="gdxeq" data-k="'+k+'">'+(eq?'장착 해제':'오라로 장착')+'</button><button class="mini" data-act="gdxx">닫기</button></div></div>';
  el.addEventListener('click',function(e){if(e.target===el)gDexModalClose();});
  document.body.appendChild(el);
}
function gDexModalClose(){var e=document.getElementById('gdm');if(e&&e.parentNode)e.parentNode.removeChild(e);}
function gStarFx(k,n,done,o){
  o=o||{};
  gSfx('star');
  var g=gGet(),old=document.getElementById('gsfx');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var el=document.createElement('div');el.className='gsfx';el.id='gsfx';
  var sp='';for(var i=0;i<16;i++){var a=i/16*Math.PI*2,d=90+Math.random()*80;sp+='<span style="--dx:'+Math.round(Math.cos(a)*d)+'px;--dy:'+Math.round(Math.sin(a)*d)+'px;animation-delay:'+(.35+Math.random()*.15)+'s">'+(i%2?'✨':'⭐')+'</span>';}
  var st='';for(var j=1;j<=5;j++)st+='<span class="'+(j<=n?'on':'off')+(j===n?' nw':'')+'" style="animation-delay:'+(.25+j*.12)+'s">★</span>';
  el.innerHTML='<div class="gsfx-flash"></div><div class="gsfx-rays"></div><div class="gsfx-sp">'+sp+'</div><div class="gsfx-in"><img class="gsfx-img" src="'+(o.src||MAS[k])+'" alt=""><div class="gsfx-st">'+st+'</div><div class="gsfx-t">별 '+n+'개 강화!</div><div class="gsfx-b">'+(o.txt||('보너스 +'+gPct(G_RB[G_RAR[k]]*G_SM[n-1])+' → <b>+'+gPct(G_RB[G_RAR[k]]*G_SM[n])+'</b>'))+'</div><div class="gsfx-h">화면을 눌러서 계속</div></div>';
  document.body.appendChild(el);
  try{navigator.vibrate&&navigator.vibrate([50,30,90]);}catch(e){}
  var fin=false;function end(){if(fin)return;fin=true;clearTimeout(tm);el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},300);done&&done();}
  var tm=setTimeout(end,3200);el.addEventListener('click',end);
}
var G_ACH=[
 {t:'🏔️ 층 돌파',cur:function(g){return g.best;},fmt:function(v){return Math.floor(v)+'층';},p:'f',l:[[100,10],[200,10],[300,10],[400,10],[500,10],[600,10],[700,10],[800,10],[900,10],[1000,10]],nm:function(n){return n+'층 도달';}},
 {t:'🌸 진화',cur:function(g){return g.rebirths;},fmt:function(v){return Math.floor(v)+'번';},p:'r',l:[[1,10],[3,10],[5,10],[7,10],[9,10],[11,10]],nm:function(n){return n+'번 진화';}},
 {t:'⏱ 총 운동 시간',cur:function(g){return g.st.tsec/3600;},fmt:function(v){return (Math.floor(v*10)/10)+'시간';},p:'t',l:[[1,2],[5,3],[10,5],[30,10],[50,15],[100,20]],nm:function(n){return '총 '+n+'시간 운동';}},
 {t:'🏋️ 총 운동 무게',cur:function(g){return g.st.kg/1000;},fmt:function(v){return (Math.floor(v*10)/10)+'톤';},p:'w',l:[[10,2],[50,3],[100,5],[250,10],[500,15],[1000,20]],nm:function(n){return '총 '+n+'톤 들기';}},
 {t:'🔥 운동 횟수',cur:function(g){return g.st.n;},fmt:function(v){return Math.floor(v)+'회';},p:'c',l:[[1,1],[10,3],[30,5],[50,8],[100,12],[200,20]],nm:function(n){return '운동 '+n+'번 하기';}}
];
function gAchReady(g){var n=gRepReady(g);G_ACH.forEach(function(G){var c=G.cur(g);G.l.forEach(function(x){if(c>=x[0]&&!g.ach[G.p+x[0]])n++;});});return n;}
var gRw='ach';
var G_REP=[
 {k:'fl',n:'🏔️ 100층 올라갈 때마다',u:100,cur:function(g){return g.best;},fmt:function(v){return Math.floor(v)+'층';}},
 {k:'kg',n:'🏋️ 10톤 들 때마다',u:10,cur:function(g){return g.st.kg/1000;},fmt:function(v){return (Math.floor(v*10)/10)+'톤';}},
 {k:'hr',n:'⏱ 1시간 운동할 때마다',u:1,cur:function(g){return g.st.tsec/3600;},fmt:function(v){return (Math.floor(v*10)/10)+'시간';}},
 {k:'rb',n:'🌸 진화 1번마다',u:1,cur:function(g){return g.rebirths;},fmt:function(v){return Math.floor(v)+'번';}},
 {k:'wk',n:'🔥 운동 3번 할 때마다',u:3,cur:function(g){return g.st.n;},fmt:function(v){return Math.floor(v)+'회';}}
];
var G_REPR=5;
function gRepAvail(g,R){return Math.max(0,Math.floor(R.cur(g)/R.u+1e-9)-(g.rc[R.k]||0));}
function gRepReady(g){var n=0;G_REP.forEach(function(R){n+=gRepAvail(g,R);});return n;}
function gRepCard(g){
  var tot=gRepReady(g),h='<p class="hint">조건을 채울 때마다 루비 '+gRuby(14)+' '+G_REPR+'개씩! 쌓아뒀다가 한꺼번에 받아도 돼. 끝없이 계속 받을 수 있어 ♾️</p>';
  h+='<ul class="list">'+G_REP.map(function(R){
    var cur=R.cur(g),av=gRepAvail(g,R),into=cur-Math.floor(cur/R.u+1e-9)*R.u;
    return '<li class="grow"><span class="xt"><b>'+R.n+'</b><small>누적 '+R.fmt(cur)+' · 지금까지 '+(g.rc[R.k]||0)+'번 받음</small>'+gBar(av>0?1:into/R.u,'pk')+'</span><button class="mini rb" data-act="grep" data-k="'+R.k+'"'+(av>0?'':' disabled')+'>'+(av>0?gRuby(14)+' '+av*G_REPR+' 받기':'진행 중')+'</button></li>';
  }).join('')+'</ul>';
  if(tot>0)h+='<button class="btn sm gevob" data-act="grep" data-k="all">💎 한꺼번에 받기 ('+gRuby(14)+' '+tot*G_REPR+')</button>';
  return h;
}
function gAchCard(g){
  var h='';
  G_ACH.forEach(function(G){
    var c=G.cur(g),done=0;G.l.forEach(function(x){if(g.ach[G.p+x[0]])done++;});
    h+='<h2>'+G.t+' <small style="font-weight:400">'+done+'/'+G.l.length+'</small></h2><ul class="list">';
    G.l.forEach(function(x){var id=G.p+x[0],cl=g.ach[id],ok=c>=x[0];
      h+='<li class="grow"><span class="gic">'+(cl?'✅':ok?'🏆':'🔒')+'</span><span class="xt"><b>'+G.nm(x[0])+' <em>🎟️ +'+x[1]+'장</em></b>'+(cl?'':gBar(c/x[0],'pk')+'<small>'+G.fmt(Math.min(c,x[0]))+' / '+G.fmt(x[0])+'</small>')+'</span>'+(cl?'<span class="gstmp u">받음</span>':'<button class="mini pri" data-act="gach" data-k="'+id+'"'+(ok?'':' disabled')+'>'+(ok?'받기':'진행 중')+'</button>')+'</li>';});
    h+='</ul>';
  });
  return h;
}
function gRwCard(g){
  var rd=gRepReady(g);
  var seg='<div class="gseg g3"><button class="gsg'+(gRw==='ach'?' on':'')+'" data-act="grw" data-k="ach">🏆 업적</button><button class="gsg'+(gRw==='rep'?' on':'')+'" data-act="grw" data-k="rep">🔁 반복'+(rd?' <span style="color:#ff3b5c;font-size:11px">●</span>':'')+'</button><button class="gsg'+(gRw==='cash'?' on':'')+'" data-act="grw" data-k="cash">💰 현금</button></div>';
  return seg+(gRw==='ach'?gAchCard(g):gRw==='rep'?gRepCard(g):gTkCard(g));
}
function gDot(){var g=gGet(),b=document.querySelector('.gm[data-k=tk]');if(!b)return;var has=gAchReady(g)>0,d=b.querySelector('.gdot');if(has&&!d){var i=document.createElement('i');i.className='gdot';b.appendChild(i);}else if(!has&&d)d.parentNode.removeChild(d);}
function gSecHtml(g){
  if(gSub==='up'){var rr=gRdy(g),sg=gSeg('up',gUpT,[['h','💗 하트'],['r','💎 루비'],['b','🔁 환생',rr.b]]);
    if(gUpT==='r')return '<section class="card">'+sg+'<h2>루비로 강화</h2><ul class="list" id="g-rups">'+gRUpRows(g)+'</ul><p class="hint">루비는 운동을 끝내면 받아요. 많이 하고 무겁게 들수록 더 많이!</p></section>';
    if(gUpT==='b')return '<section class="card" id="g-rb">'+sg+gRbCard(g)+'</section>';
    return '<section class="card">'+sg+'<h2>하트로 강화</h2><ul class="list" id="g-ups">'+gUpRows(g)+'</ul></section>';}
  if(gSub==='tk')return '<section class="card" id="g-tkc">'+gRwCard(g)+'</section>';
  if(gSub==='gac')return '<section class="card" id="g-gac">'+gGacCard(g)+'</section>';
  if(gSub==='dex')return '<section class="card" id="g-dex">'+gDexCard(g)+'</section>';
  if(gSub==='farm')return '<section class="card" id="g-farm">'+gFarmCard(g)+'</section>';
  if(gSub==='vil')return '<section class="card" id="g-vil">'+gVlCard(g)+'</section>';
  if(gSub==='stat')return '<section class="card" id="g-stat">'+gStatCard(g)+'</section>';
  if(gSub==='grow'){var r2=gRdy(g),sg2=gSeg('grow',gGrT,[['s','🌱 현재 상태'],['e','🌸 진화',r2.e]]);
    if(gGrT==='e')return '<section class="card" id="g-rebirth">'+sg2+gRebirthCard(g)+'</section>';
    return '<section class="card" id="g-evo">'+sg2+gEvoCard(g)+'</section><section class="card" id="g-today">'+gTodayCard(g)+'</section>';}
  return '';
}
function rGame(){
  gSm=gSub!=='';
  var g=gGet();gCatch();if(!(g.hp>0))g.hp=g.farm?gHp(Math.max(1,g.stage-1)):gHp(g.stage);
  var off='';
  var gk=gDayKey(Date.now());if(g.gd!==gk){g.gd=gk;g.tickets+=2;gSave();setTimeout(function(){gSfx('coin');toast('🎁 오늘의 첫 접속 선물! 뽑기권 +2장');},700);}
  return '<header class="top brand ghead">'+mas('love',67)+'<div class="bt"><h1>사랑이 키우기</h1><small>운동하면 루비랑 성장이 쑥쑥!</small></div></header>'+off+'<div class="gtop">'+gArena(g)+gMenuHtml()+'</div><div class="gsec" id="g-sec">'+gSecHtml(g)+'</div>';
}
function gRefresh(){
  var g=gGet(),s=$('g-sec');
  if(!s||nav.tab!=='game'){render();return;}
  s.innerHTML=gSecHtml(g);
  var ms=document.querySelectorAll('.gm');for(var i=0;i<ms.length;i++)ms[i].classList.toggle('on',gMenuOn(ms[i].dataset.k));
  gSet('g-hearts','💗 '+gFmt(g.hearts));gSet('g-pps','⚔️ '+gFmt(gDps(g))+'/초');gSet('g-tk','🎟️ '+g.tickets);
  gSetH('g-rub',gRuby(15)+' '+gFmt(g.rubies));
  gHeroCheck(g);
  gDot();gGlow(g);
  if(typeof gFarmAfter==='function')gFarmAfter();
}
/* ---- 틱 ---- */
function gSet(id,t){var e=$(id);if(e&&e.textContent!==t)e.textContent=t;}
function gSetH(id,t){var e=$(id);if(e&&e.innerHTML!==t)e.innerHTML=t;}
function gPaintStage(g,pop){
  var sh=gShown(g),boss=sh%10===0&&!g.farm,ar=$('g-arena'),mon=$('g-mon');if(!ar||!mon)return;
  gMdSee(g,sh);var r=G_REG[gRegIdx(sh)];
  ar.className='garena'+(boss?' boss':'')+(r.d?' dk':'')+(gSm?' sm':'');ar.style.cssText=gArenaStyle(sh);
  mon.className='gmon'+(pop?' pop':'')+gMonCls(sh,boss);mon.innerHTML=gMonSvg(sh);
  gSet('g-mn',gMonName(sh));gLastShown=sh;gPreNext(g);
}
function gTick(){
  if(nav.tab!=='game'||document.hidden)return;
  var g=gGet(),now=Date.now(),dt=(now-g.last)/1000;
  if(dt>8){if(typeof gGold!=='undefined')gGold=null;render();return;}
  if(dt<=0)return;
  var pf=g.farm,pst=g.stage,pfail=g.fails,psh=gShown(g);
  var ggp=(typeof gGoldPre==='function')&&gGoldPre(g,dt,now);
  if(!ggp)gAdvance(g,dt);g.last=now;
  if(typeof gGoldPost==='function')gGoldPost(g,pst,pf,now);
  var sh=gShown(g),hp=$('g-hp');if(!hp)return;
  if(g.fails!==pfail){toast('보스한테 졌어… 아래 층에서 힘을 모을게! 💪');gSfx('fail');gBubble('farm');}
  else if(g.stage>pst){if(pst%10===0&&!pf){gSfx('clear');gBubble('clear');if(typeof gBossClear==='function')gBossClear(pst);}else if(g.stage%10===0){gSfx('boss');gBubble('boss');if(typeof gBossWarn==='function')gBossWarn(g.stage);}else gSfx('kill');}
  if(sh!==gLastShown||g.farm!==pf){gPaintStage(g,!(!g.farm&&g.dlyLeft>0));if(now-gHfxT>500){gHfxT=now;gHearts($('g-arena'),3);}}
  gWalk(g);gCbTick(g,now,g.fails!==pfail);
  gSet('g-st',gStText(g));
  var frac=gFrac(g,now);
  if(g.farm){var ci=gFarmN;if(ci!==gCycle){gCycle=ci;var m=$('g-mon');if(m&&gCycle>0){m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop');}}}
  hp.style.width=Math.max(0,Math.min(100,frac*100))+'%';
  if(typeof gGoldUi==='function'&&gGoldUi(g,now))hp.style.width=Math.max(0,Math.min(100,gQuant(gGold.hp/gGold.max,gGold.max,g)*100))+'%';
  var bt=$('g-bt');
  if(bt&&typeof gGold!=='undefined'&&gGold){}else if(bt){var isb=sh%10===0&&!g.farm;if(bt.hidden===isb)bt.hidden=!isb;if(isb){var T=gBossT(g);$('g-bti').style.width=Math.max(0,(T-(g.bt||0))/T*100)+'%';}}
  gBubTick(g,now);
  var nk=g.stage+'|'+g.farm+'|'+g.hold;
  if(nk!==gNoteKey){gNoteKey=nk;gSetH('g-note',gNoteHtml(g));if(gSub==='')gFit(false);}
  gSet('g-hearts','💗 '+gFmt(g.hearts));gSet('g-pps','⚔️ '+gFmt(gDps(g))+'/초');
  ['atk','inc','spd'].forEach(function(k){var b=$('gb-'+k);if(b)b.disabled=!(g.hearts>=gCost(k,g.lv[k]));});
  if(!gTick.c)gTick.c=0;if(++gTick.c%4===0){gDmg(g);if(gTick.c%20===0)gDot();gGlow(g);if(gTick.c%8===0)gSetH('g-buffw',gBuffHtml(g));gSetH('g-evw',gEvoBtnHtml(g));var rr=$('g-reb');if(rr&&g.evo>=3&&g.best>=1000&&armed!=='greb'){var t='🌸 진화하기 (+'+gRPGain(g)+' 포인트)';if(rr.textContent!==t)rr.textContent=t;}var r2=$('g-rb2');if(r2&&g.stage>=1000&&armed!=='grb2'){var t2='🔁 환생하기 (+'+gRBGain(g)+' 포인트)';if(r2.textContent!==t2)r2.textContent=t2;}}
  if(now-gSaveT>5000){gSaveT=now;gSave();}
}
function gWalk(g){
  var f=$('g-field');if(!f)return;
  var wk=!g.farm&&g.dlyLeft>0;
  if(wk&&!f.classList.contains('gwk')){var d=gDly(g);f.style.setProperty('--wd',d+'s');f.style.setProperty('--wdl',(-Math.max(0,d-g.dlyLeft))+'s');f.classList.add('gwk');}
  else if(!wk&&f.classList.contains('gwk'))f.classList.remove('gwk');
}
function gDmg(g){
  var f=$('g-field');if(!f)return;
  var ad0=Math.max(.45,1/gSpd(g))+'s',h0=$('g-hw');if(h0)h0.style.setProperty('--ad',ad0);var m0=$('g-mon');if(m0)m0.style.setProperty('--ad',ad0);
  if(f.classList.contains('gwk'))return;
  var s=document.createElement('span');s.className='gdmg';s.textContent='-'+gFmt(gDps(g));
  s.style.left=(52+Math.random()*30)+'%';f.appendChild(s);setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},800);
  var ad=Math.max(.45,1/gSpd(g))+'s',h=$('g-hw');if(h)h.style.setProperty('--ad',ad);var m=$('g-mon');if(m)m.style.setProperty('--ad',ad);
}
function gHearts(host,n){
  if(!host)return;var r=host.getBoundingClientRect();
  for(var j=0;j<n;j++){var s=document.createElement('span');s.className='hfx';s.textContent='\u{1F497}';
    s.style.left=(r.left+r.width*(.45+Math.random()*.4))+'px';s.style.top=(r.top+r.height*.5)+'px';
    s.style.setProperty('--dx',((Math.random()-.5)*60)+'px');s.style.setProperty('--dy',(-40-Math.random()*40)+'px');
    document.body.appendChild(s);setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},1000);}
}
function gFit(noAnim){
  var v=$('view'),f=$('g-field'),h=document.querySelector('.ghead'),gt=document.querySelector('.gtop'),m=$('main');
  if(!v||!f||!h||!gt||!m||nav.tab!=='game')return;
  v.style.setProperty('--gh',h.offsetHeight+'px');
  if(gSub!==''){f.style.height='';return;}
  var cs=getComputedStyle(v),hs=getComputedStyle(h);
  var top=parseFloat(cs.paddingTop)+parseFloat(hs.marginTop)+h.offsetHeight+(parseFloat(cs.rowGap)||14);
  var non=gt.offsetHeight-f.offsetHeight,full=m.clientHeight-top-parseFloat(cs.paddingBottom)-non;
  full=Math.max(260,Math.round(full));
  if(noAnim)f.style.transition='none';
  f.style.height=full+'px';
  if(noAnim){void f.offsetHeight;f.style.transition='';}
}
function gApplyMode(anim){
  gSm=gSub!=='';
  var a=$('g-arena');if(a)a.classList.toggle('sm',gSm);
  var v=$('view');if(v)v.classList.toggle('gfull',nav.tab==='game'&&gSub==='');
  if(nav.tab==='game')requestAnimationFrame(function(){gFit(!anim);});
}
window.addEventListener('resize',function(){if(nav.tab==='game')gFit(true);});
/* ---- 연속 운동 버프 ---- */
function gDN(ts){var d=new Date(ts);return Math.round(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);}
function gStreak(g,ts){
  var s=g.stk,dn=gDN(ts),ln=s.ld?gDN(s.ld):-1e9;
  if(s.ld&&dn<=ln)return null;
  var gap=dn-ln,used=false,got=false;
  if(!s.ld)s.n=1;else if(gap===1)s.n++;else if(gap===2&&s.sh){s.sh=0;s.n++;used=true;}else s.n=1;
  s.ld=ts;if(s.n%30===0&&!s.sh){s.sh=1;got=true;}
  return {n:s.n,used:used,got:got};
}
function gBuffOn(g){return gStkB(g)>0;}
function gBuffHtml(g){
  var s=g.stk;
  if(gBuffOn(g))return '<button class="gbuff" data-act="gbuff"><b>🔥 연속 '+s.n+'일</b><small>공격·수입 +'+gPct(s.n*5)+(s.sh?' · 🛡️':'')+'</small></button>';
  return '<button class="gbuff off" data-act="gbuff"><b>🔥 버프 없음</b><small>운동하면 켜져요</small></button>';
}
function gBuffLeft(g){var ms=gStkExp(g.stk)-Date.now();return Math.max(0,ms);}
function gHms(ms){var t=Math.floor(ms/1000),h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return h+'시간 '+('0'+m).slice(-2)+'분 '+('0'+s).slice(-2)+'초';}
var gBuffIv=0;
function gBuffClose(){clearInterval(gBuffIv);gBuffIv=0;var e=document.getElementById('gbm');if(e&&e.parentNode)e.parentNode.removeChild(e);}
function gBuffModal(){
  gBuffClose();var g=gGet(),s=g.stk,on=gBuffOn(g),today=s.ld&&gDN(s.ld)===gDN(Date.now());
  var toNext=30-(s.n%30||30);if(s.n%30===0&&s.n>0)toNext=30;
  var el=document.createElement('div');el.className='gdm gbm';el.id='gbm';
  var body;
  if(!s.n)body='<div class="gdmb">아직 연속 기록이 없어.<br>운동을 기록하면 <b>🔥 연속 버프</b>가 켜져!</div>';
  else body='<div class="gdmn">🔥 연속 '+s.n+'일째</div><div class="gdmb">'+(on?'지금 <b>공격력·하트 수입 +'+gPct(s.n*5)+'</b> 적용 중!':'버프가 꺼졌어 😢 운동하면 다시 1일부터 시작해')+'</div>'+(on?'<div class="gbleft">남은 시간<br><b id="gbt">'+gHms(gBuffLeft(g))+'</b></div><div class="gdmi">'+(today?'오늘 운동 완료 ✅ 내일도 하면 '+(s.n+1)+'일째 (+'+gPct((s.n+1)*5)+')':'⚠️ 오늘 운동하면 연속이 이어져! 안 하면 시간이 끝나고 꺼져')+'</div>':'');
  el.innerHTML='<div class="gdmc" style="--rc:#ff7a3c"><div class="gdmst" style="color:#ff7a3c">🔥</div>'+body+
   '<div class="gbinfo"><div>📈 하루 연속할 때마다 <b>+5%</b>씩 쌓여요</div><div>🛡️ 한 달(30일) 연속하면 <b>방지권 1장</b> · 하루 빠져도 연속 유지 (최대 1장)</div><div>'+(s.sh?'🛡️ 방지권 <b>1장</b> 보유 중':'🛡️ 방지권 없음 · 다음까지 '+toNext+'일')+'</div></div>'+
   '<div class="gdmbt">'+(s.sh?'':'<button class="mini rb" data-act="gbsh"'+(g.rubies>=100?'':' disabled')+'>'+(armed==='gsh'?'정말? 한 번 더!':'🛡️ 방지권 사기 ('+gRuby(13)+' 100)')+'</button>')+'<button class="mini" data-act="gbx">닫기</button></div></div>';
  el.addEventListener('click',function(e){if(e.target===el)gBuffClose();});
  document.body.appendChild(el);
  if(on)gBuffIv=setInterval(function(){var t=document.getElementById('gbt');if(!t){gBuffClose();return;}t.textContent=gHms(gBuffLeft(gGet()));},1000);
}
/* ---- 말풍선 ---- */
var G_BUB={
 idle:['오늘도 화이팅! 💪','같이 놀자아~','나 잘하고 있지?','쑥쑥 크는 중이야 🌱','사랑해요 💗','우와~ 하트다!','운동하면 나 힘세져!','헤헤 😊','오늘도 반짝반짝 ✨','냠냠 간식 먹고 싶다~','최고 최고! 👍','같이 있어서 좋아 🥰'],
 tap:['꺄르르 😆','간지러워~','쪽 💋','안아줘요~ 🤗','히히 사랑해!','또 눌러줘 💗','까꿍! 👶','나 여기 있어요~'],
 boss:['으으 크다… 그래도 할 수 있어!','보스다! 긴장돼 😳','나 지금 용기 100%!'],
 clear:['해냈다! 짝짝짝 👏','내가 이겼다~ 야호!','나 멋있었지? 😎'],
 farm:['다음엔 꼭 이길 거야!','힘 더 모아서 다시!','괜찮아~ 또 하면 돼 💪'],
 night:['zZ… 졸려…','이제 코~ 자야지 🌙','별님도 반짝~ ⭐'],
 morn:['좋은 아침! ☀️','잘 잤어요? 🥱'],
 skip:['오늘 운동 아직이야? 🥺','같이 운동하자아~','운동하면 나 더 커져!']
};
var gBubNext=0,gBubHide=0,gBubTm=0;
function gBubble(kind,force){
  var b=$('g-bub'),f=$('g-field'),h=$('g-hero');if(!b||!f||!h||nav.tab!=='game')return;
  var now=Date.now();if(!force&&kind!=='tap'&&now<gBubHide)return;
  var g=gGet(),p=G_BUB[kind]||G_BUB.idle,t=p[Math.floor(Math.random()*p.length)];
  b.textContent=t;b.hidden=false;b.classList.remove('in');void b.offsetWidth;
  var fr=f.getBoundingClientRect(),hr=h.getBoundingClientRect();
  b.style.bottom=Math.max(0,fr.bottom-hr.top+2)+'px';
  var l=hr.left-fr.left+hr.width*.25;l=Math.max(4,Math.min(fr.width-b.offsetWidth-4,l));b.style.left=l+'px';
  b.classList.add('in');gBubHide=now+3300;clearTimeout(gBubTm);gBubTm=setTimeout(function(){var e=$('g-bub');if(e)e.hidden=true;},3300);
  gBubNext=now+(14+Math.random()*12)*1000;if(kind==='idle'||kind==='tap')gSfx('bub');
}
function gBubTick(g,now){
  if(now<gBubNext)return;
  if(!gBubNext){gBubNext=now+4000;return;}
  var h=new Date().getHours(),k='idle',r=Math.random();
  if(g.stage%10===0&&!g.farm&&r<.5)k='boss';
  else if(h>=22||h<5){if(r<.6)k='night';}
  else if(h>=6&&h<10){if(r<.3)k='morn';}
  if(k==='idle'&&g.stk.n&&!(g.stk.ld&&gDN(g.stk.ld)===gDN(now))&&r<.4)k='skip';
  gBubble(k);
}
/* ---- 효과음 (WebAudio로 직접 만든 소리) ---- */
var gAC=null,gSfxT={};
function gAudio(){try{if(!gAC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;gAC=new C();}if(gAC.state==='suspended')gAC.resume();return gAC;}catch(e){return null;}}
document.addEventListener('pointerdown',function(){if(gS&&gS.snd)gAudio();},{passive:true});
function gTn(f,t,d,ty,v,f2){
  var a=gAC,o=a.createOscillator(),gn=a.createGain(),t0=a.currentTime+t;
  o.type=ty||'sine';o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+d);
  gn.gain.setValueAtTime(0.0001,t0);gn.gain.exponentialRampToValueAtTime(v||.15,t0+.01);gn.gain.exponentialRampToValueAtTime(0.0001,t0+d);
  o.connect(gn);gn.connect(a.destination);o.start(t0);o.stop(t0+d+.05);
}
var G_SFX={
 tap:function(){gTn(660,0,.09,'sine',.12,990);},
 bub:function(){gTn(880,0,.07,'sine',.06,1320);},
 kill:function(){gTn(520,0,.07,'triangle',.07,780);},
 buy:function(){gTn(784,0,.08,'square',.05);gTn(1175,.06,.1,'square',.05);},
 coin:function(){[988,1319,1568,1976].forEach(function(f,i){gTn(f,i*.09,.16,'triangle',.12);});},
 boss:function(){gTn(150,0,.3,'sawtooth',.1,90);gTn(110,.15,.35,'sawtooth',.1,70);},
 clear:function(){[523,659,784,1047].forEach(function(f,i){gTn(f,i*.1,.22,'square',.07);});gTn(1047,.4,.5,'triangle',.1);},
 fail:function(){gTn(400,0,.2,'triangle',.12,300);gTn(300,.18,.35,'triangle',.12,180);},
 pull:function(){for(var i=0;i<6;i++)gTn(900+i*220,i*.07,.14,'sine',.1);},
 star:function(){[523,659,784,1047,1319].forEach(function(f,i){gTn(f,i*.09,.3,'triangle',.12);});gTn(2093,.5,.6,'sine',.08);},
 ssr:function(){[523,659,784,1047,1319,1568].forEach(function(f,i){gTn(f,i*.12,.5,'triangle',.12);gTn(f/2,i*.12,.5,'sine',.08);});gTn(2093,.8,1.2,'sine',.1);},
 evo:function(){[523,659,784,1047,1319].forEach(function(f,i){gTn(f,i*.1,.35,'triangle',.12);});gTn(1568,.55,.7,'sine',.09);},
 reb:function(){[392,523,659,784,1047].forEach(function(f,i){gTn(f,i*.14,.45,'sine',.12);});}
};
function gSfx(n){
  try{
    if(!gS||!gS.snd||!G_SFX[n])return;
    var now=Date.now(),th={kill:200,buy:60,tap:80,bub:500,hit:35,gauge:150,cbm:150}[n]||0;if(th&&now-(gSfxT[n]||0)<th)return;gSfxT[n]=now;
    if(!gAudio()||gAC.state!=='running')return;G_SFX[n]();
  }catch(e){}
}
function gOffShow(){
  if(!gOff||document.getElementById('goffp'))return;
  var o=gOff,el=document.createElement('div');el.className='goffp';el.id='goffp';
  var t=(o.sec>=3600?Math.floor(o.sec/3600)+'시간 ':'')+Math.floor(o.sec%3600/60)+'분';
  el.innerHTML='<div class="goffc"><img alt="" src="'+(MAS.q_sleep||MAS.r_zzz||'')+'"><div class="goffh">자리를 비운 동안 🌙</div><div class="goffs">'+t+' 동안 사랑이가 열심히 싸웠어!</div><div class="gofft"><div><b>💗 +'+gFmt(o.h)+'</b><small>모은 하트</small></div><div><b>🪜 +'+o.s+'층</b><small>올라간 층</small></div></div>'+(o.cap?'<div class="goffs" style="font-size:12px;opacity:.7">최대 8시간까지만 쌓여요</div>':'')+'<button class="btn sm gevob" data-act="gokoff">확인</button></div>';
  document.body.appendChild(el);
}
function gSync(){
  gApplyMode(false);
  if(nav.tab==='game'&&gOff)gOffShow();
  if(nav.tab==='game'){if(!gIv){gIv=setInterval(gTick,250);}}
  else if(gIv){clearInterval(gIv);gIv=0;gSave();}
}
document.addEventListener('visibilitychange',function(){
  if(document.hidden){gSave();}
  else if(nav.tab==='game'){render();}
});
/* ---- 축하 화면 ---- */
function gCelebrate(r){
  if(!r||!r.rub)return;
  var old=document.getElementById('gcel');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var el=document.createElement('div');el.className='gcel';el.id='gcel';
  var fall='';for(var i=0;i<16;i++)fall+='<span style="left:'+(Math.random()*96)+'%;width:'+(16+Math.random()*16)+'px;height:'+(16+Math.random()*16)+'px;animation-duration:'+(2+Math.random()*1.6)+'s;animation-delay:'+(Math.random()*1.2)+'s">'+gRuby(32)+'</span>';
  var sp='';for(var j=0;j<14;j++){var a=j/14*Math.PI*2,d=110+Math.random()*90;sp+='<span style="--dx:'+Math.round(Math.cos(a)*d)+'px;--dy:'+Math.round(Math.sin(a)*d)+'px;animation-delay:'+(.25+Math.random()*.2)+'s">'+(j%2?'✨':'💗')+'</span>';}
  var ban='';
  if(r.ready)ban+='<div class="gcb">🌱 성장할 수 있어! 키우기 화면에서 눌러줘</div>';
  r.newTk.forEach(function(L){ban+='<div class="gcb t">🎁 '+G_TKAMT[L]+'만원 보상권 도착!</div>';});
  if(r.stk){ban+='<div class="gcb" style="background:linear-gradient(135deg,#ff9a3c,#ff5e62)">🔥 연속 '+r.stk.n+'일째! 공격력·하트 수입 +'+gPct(r.stk.n*5)+'</div>';if(r.stk.used)ban+='<div class="gcb t">🛡️ 방지권으로 연속 기록을 지켰어!</div>';if(r.stk.got)ban+='<div class="gcb t">🛡️ 한 달 연속! 방지권 1장 획득</div>';}
  gSfx('coin');
  el.innerHTML='<div class="gcfall">'+fall+'</div><div class="gcin"><div class="gcray"></div><div class="gcsp">'+sp+'</div><div class="gcbig">'+gRuby(150)+'</div><div class="gcn" id="gcn">+0</div><div class="gcs">루비를 받았어!  ·  🎟️ 뽑기권 +'+r.tk+(r.water?'  ·  💧 물 +'+r.water:'')+'</div>'+ban+'</div>';
  document.body.appendChild(el);
  try{navigator.vibrate&&navigator.vibrate([60,40,60,40,160]);}catch(e){}
  var n=r.rub,t0=Date.now();
  var iv=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/900),c=$('gcn');if(!c){clearInterval(iv);return;}c.textContent='+'+Math.max(1,Math.round(n*p));if(p>=1)clearInterval(iv);},40);
  var life=(r.ready||r.newTk.length||(r.stk&&(r.stk.used||r.stk.got)))?5200:3600;
  var closed=false;function close(){if(closed)return;closed=true;clearInterval(iv);clearTimeout(tm);el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);if(r.ready)gSfx('bub');},320);}
  var tm=setTimeout(close,life);
  el.addEventListener('click',close);
}
/* ---- 청구권 이미지 ---- */
function gTkImage(t,cb){
  var W=720,H=980,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  var gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#ff8fb8');gr.addColorStop(.5,'#ffd1e0');gr.addColorStop(1,'#fff3d6');
  x.fillStyle=gr;rr(x,0,0,W,H,48);x.fill();
  x.fillStyle='#fffdfa';rr(x,36,36,W-72,H-72,36);x.fill();
  x.strokeStyle='#ff8fb8';x.lineWidth=4;x.setLineDash([14,12]);rr(x,52,52,W-104,H-104,28);x.stroke();x.setLineDash([]);
  x.textAlign='center';x.fillStyle='#d92f5e';x.font='800 34px sans-serif';x.fillText('우프로 운동해 · 사랑이 키우기',W/2,120);
  x.fillStyle='#8a5a6a';x.font='700 56px sans-serif';x.fillText('보상 청구권',W/2,200);
  var d=new Date(t.ts),ds=d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate();
  var img=new Image();
  function fin(){
    x.fillStyle='#d92f5e';x.font='900 66px sans-serif';x.fillText(t.amt+'만원',W/2,650);
    x.fillStyle='#8a5a6a';x.font='700 36px sans-serif';x.fillText('Lv.'+t.lvl+' '+G_NAMES[t.lvl]+' 사랑이 달성!',W/2,712);
    x.font='600 28px sans-serif';x.fillStyle='#a07a88';x.fillText('발행일 '+ds,W/2,790);x.fillText('No. '+t.no,W/2,834);
    if(t.used){var u=new Date(t.used);x.save();x.translate(W/2,470);x.rotate(-.2);x.strokeStyle='#e0245e';x.lineWidth=8;x.fillStyle='rgba(255,255,255,.7)';rr(x,-170,-52,340,104,18);x.fill();x.stroke();x.fillStyle='#e0245e';x.font='900 64px sans-serif';x.fillText('사용 완료',0,22);x.restore();x.fillStyle='#e0245e';x.font='700 26px sans-serif';x.fillText('사용일 '+u.getFullYear()+'.'+(u.getMonth()+1)+'.'+u.getDate(),W/2,900);}
    else{x.fillStyle='#2e9d6b';x.font='800 34px sans-serif';x.fillText('✔ 사용 가능',W/2,900);}
    c.toBlob(function(b){cb(b);},'image/png');
  }
  img.onload=function(){var s=360,r=img.width/img.height,w=r>1?s:s*r,h=r>1?s/r:s;x.drawImage(img,W/2-w/2,250+(s-h)/2,w,h);fin();};
  img.onerror=fin;img.src=gFront(t.lvl);
}
function gTkShare(t){
  gTkImage(t,function(blob){
    if(!blob){toast('그림을 못 만들었어');return;}
    var name='사랑이_보상권_Lv'+t.lvl+'.png',f=null;
    try{f=new File([blob],name,{type:'image/png'});}catch(e){}
    if(f&&navigator.canShare&&navigator.canShare({files:[f]})){
      navigator.share({files:[f],title:'사랑이 보상 청구권'}).catch(function(e){if(e&&e.name!=='AbortError')gTkDl(blob,name);});
    }else gTkDl(blob,name);
  });
}
function gTkDl(blob,name){var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);if(a.parentNode)a.parentNode.removeChild(a);},1500);toast('그림으로 저장했어. 카톡에 보내줘!');}
/* ---- 뽑기 ---- */
function gRollOne(g){
  var Q=G_DATA.pet.gacha,r=Math.random()*100,rar=r<Q.ssr?3:r<Q.sr?2:r<Q.r?1:0;
  g.pity=(g.pity||0)+1;g.pity2=(g.pity2||0)+1;
  if(g.pity2>=Q.pity2)rar=3;else if(g.pity>=Q.pity1&&rar<2)rar=2;
  if(rar>=2)g.pity=0;if(rar>=3)g.pity2=0;
  var ks=Object.keys(G_DX).filter(function(k){return G_RAR[k]===rar&&MAS[k];});
  var k=ks[Math.floor(Math.random()*ks.length)],isNew=!g.dex[k],hh=0;
  g.dex[k]=(g.dex[k]||0)+1;
  if(isNew){g.star[k]=1;g.dup[k]=0;}
  else if((g.star[k]||1)<5){g.dup[k]=(g.dup[k]||0)+1;}
  else{hh=gKill(g,Math.max(1,g.best))*G_DATA.pet.dupH[rar];g.hearts+=hh;}
  return {k:k,rar:rar,nw:isNew,h:hh,kind:'a',name:G_DX[k][0],img:MAS[k]};
}
function gGachaShow(res){
  gSfx('pull');
  var old=document.getElementById('gcel');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var el=document.createElement('div');el.className='gcel';el.id='gcel';
  var tot=0,nn=0,best=res[0];res.forEach(function(r){tot+=r.h;if(r.nw)nn++;if(r.rar>best.rar)best=r;});
  var top='<div class="gpt" style="--rc:'+G_RC[best.rar]+'"><div class="gpr">'+G_RN[best.rar]+'</div><div class="gpn">'+best.name+'</div></div>';
  var body;
  if(res.length===1){var r=res[0];body=top+'<div class="gcray"></div><img class="gpimg" style="--rc:'+G_RC[r.rar]+'" src="'+r.img+'" alt=""><div class="gcs">'+(r.nw?(r.kind==='p'?'✨ 새로운 동료! ✨':'✨ 새로운 오라! ✨'):(r.h?'이미 최고 강화라 💗 +'+gFmt(r.h)+' 로 바뀌었어':'중복! ⭐ 별 강화 재료 +1'))+'</div>';}
  else{body=top+'<div class="gcs" style="margin:-2px 0 4px">10번 중 최고 등급이야!</div><div class="ggrid">'+res.map(function(r,i){return '<div class="gcard" style="--rc:'+G_RC[r.rar]+';animation-delay:'+(i*.08)+'s"><img src="'+r.img+'" alt=""><i>'+G_RN[r.rar]+'</i>'+(r.nw?'<b class="gnew">NEW</b>':'<b class="gnew" style="background:#2e9d6b">+1</b>')+'<small>'+r.name+'</small></div>';}).join('')+'</div><div class="gcs" style="margin-top:10px">새로 얻은 '+(res[0].kind==='p'?'동료':'오라')+' '+nn+'개'+(tot?' · 중복은 💗 +'+gFmt(tot):'')+'</div>';}
  el.innerHTML='<div class="gcin" style="width:100%">'+body+'<div class="gcs gphint" style="font-size:13px">화면을 눌러서 닫기</div></div>';
  document.body.appendChild(el);
  try{navigator.vibrate&&navigator.vibrate([40,30,80]);}catch(e){}
  if(best.rar>=2){for(var j=0;j<10;j++)setTimeout(function(){gHearts(el,2);},j*120);}
  var ok=false,hint=el.querySelector('.gphint');
  setTimeout(function(){ok=true;if(hint)hint.classList.add('on');},1000);
  el.addEventListener('click',function(){if(!ok)return;el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},320);});
}
/* ---- 진화 연출 ---- */
function gEvoReady(g){return g.evo<10&&gLvOf(g.credit,g)>g.evo;}
function gEvoBtnHtml(g){return gEvoReady(g)?'<button class="gevb" data-act="gevo">✨ 성장하기!<small>Lv.'+(g.evo+1)+' '+G_NAMES[g.evo+1]+' 사랑이</small></button>':'';}
function gEvoFx(from,to){
  var nm=G_NAMES[to]+' 사랑이',mul=G_EVOM(to).toFixed(2),big=(to===5||to===10);
  var sub='💪 공격력 ×'+mul+' · 💗 수입 ×'+mul+' · 💎 루비 +'+to*10+'%';
  var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(reduce){toast('성장! Lv.'+to+' '+nm);return;}
  if(big){gSsrShow('',nm,function(){toast(sub);},{src:gFront(to),t:'Lv.'+to,sub:'성장! 공격·수입 ×'+mul+' · 루비 +'+to*10+'%'});return;}
  gSfx('evo');
  var old=document.getElementById('evx');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var el=document.createElement('div');el.className='rbx evo';el.id='evx';
  var pt='',P=['⭐','✨','💗','🎀'];
  for(var i=0;i<24;i++){var a=Math.random()*Math.PI*2,d=24+Math.random()*30,vm=Math.min(window.innerWidth,window.innerHeight)/100;
    pt+='<span style="--dx:'+Math.round(Math.cos(a)*d*vm*1.1)+'px;--dy:'+Math.round(Math.sin(a)*d*vm*1.1-8*vm)+'px;--rt:'+Math.round(Math.random()*300-150)+'deg;animation-delay:'+(Math.random()*.3)+'s;font-size:'+(16+Math.random()*16)+'px">'+P[i%P.length]+'</span>';}
  el.innerHTML='<div class="rbx-bg"></div><div class="rbx-rays"></div><div class="rbx-ring"></div><img class="rbx-old" src="'+gFront(from)+'" alt=""><div class="rbx-flash"></div><img class="rbx-new" src="'+gFront(to)+'" alt=""><div class="rbx-pet">'+pt+'</div><div class="rbx-t">성장!</div><div class="rbx-g">Lv.'+to+' '+nm+'<br><small style="font-size:.55em">'+sub+'</small></div><div class="rbx-h">화면을 눌러서 계속</div>';
  document.body.appendChild(el);
  var T=[],fin=false;
  function end(){if(fin)return;fin=true;T.forEach(clearTimeout);el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},420);}
  T.push(setTimeout(function(){el.classList.add('go');try{navigator.vibrate&&navigator.vibrate([60,40,120]);}catch(e){}},1500));
  T.push(setTimeout(end,4800));
  el.addEventListener('click',end);
}
function gRebirthFx(fromSrc,gain){
  gSfx('reb');
  var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(reduce){toast('진화했어! 성장 포인트 +'+gain+' 🌸');return;}
  var old=document.getElementById('rbx');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var el=document.createElement('div');el.className='rbx';el.id='rbx';
  var pt='',P=['🌸','✨','💗','🌷'];
  for(var i=0;i<26;i++){var a=Math.random()*Math.PI*2,d=24+Math.random()*30,vm=Math.min(window.innerWidth,window.innerHeight)/100;
    pt+='<span style="--dx:'+Math.round(Math.cos(a)*d*vm*1.1)+'px;--dy:'+Math.round(Math.sin(a)*d*vm*1.1-8*vm)+'px;--rt:'+Math.round(Math.random()*300-150)+'deg;animation-delay:'+(Math.random()*.3)+'s;font-size:'+(16+Math.random()*16)+'px">'+P[i%P.length]+'</span>';}
  el.innerHTML='<div class="rbx-bg"></div><div class="rbx-rays"></div><div class="rbx-ring"></div><img class="rbx-old" src="'+fromSrc+'" alt=""><div class="rbx-flash"></div><img class="rbx-new" src="'+gFront(0)+'" alt=""><div class="rbx-pet">'+pt+'</div><div class="rbx-t">진화!</div><div class="rbx-g">🌸 성장 포인트 +'+gain+'</div><div class="rbx-h">화면을 눌러서 계속</div>';
  document.body.appendChild(el);
  var T=[],fin=false;
  function end(){if(fin)return;fin=true;T.forEach(clearTimeout);el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},420);}
  T.push(setTimeout(function(){el.classList.add('go');try{navigator.vibrate&&navigator.vibrate([60,40,120]);}catch(e){}},1750));
  T.push(setTimeout(end,5200));
  el.addEventListener('click',end);
}
/* ---- 꾹 눌러서 연속 강화 ---- */
var G_HOLD={bt:null,iv:null,act:'',k:''};
var G_HACT={gbuy:'buy',grbuy:'rbuy',grpbuy:'rpbuy',grbbuy:'rbbuy'};
function gHoldStop(){clearTimeout(G_HOLD.bt);clearTimeout(G_HOLD.iv);G_HOLD.bt=G_HOLD.iv=null;}
function gHoldStep(first){
  var b=document.querySelector('[data-act="'+G_HOLD.act+'"][data-k="'+G_HOLD.k+'"]');
  if(!b||b.disabled){gHoldStop();return false;}
  G_A[G_HACT[G_HOLD.act]](b);return true;
}
function gHoldLoop(n){
  if(!G_HOLD.act)return;
  if(!gHoldStep())return;
  var d=Math.max(45,170-n*8);
  G_HOLD.iv=setTimeout(function(){gHoldLoop(n+1);},d);
}
document.addEventListener('pointerdown',function(e){
  var b=e.target.closest&&e.target.closest('[data-act="gbuy"],[data-act="grbuy"],[data-act="grpbuy"],[data-act="grbbuy"]');
  if(!b||b.disabled||e.button>0)return;
  gHoldStop();G_HOLD.act=b.dataset.act;G_HOLD.k=b.dataset.k;
  gHoldStep();
  G_HOLD.bt=setTimeout(function(){gHoldLoop(0);},380);
},true);
['pointerup','pointercancel'].forEach(function(ev){document.addEventListener(ev,function(){gHoldStop();G_HOLD.act='';},true);});
document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('[data-act="gbuy"],[data-act="grbuy"],[data-act="grpbuy"],[data-act="grbbuy"]'))e.preventDefault();},true);
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-act="gbuy"],[data-act="grbuy"],[data-act="grpbuy"],[data-act="grbbuy"]');
  if(b&&e.detail>0){e.stopImmediatePropagation();e.stopPropagation();}
},true);
/* ---- 동작 ---- */
var G_A={
  okoff:function(){gOff=null;var e=document.getElementById('goffp');if(e&&e.parentNode)e.parentNode.removeChild(e);},
  buy:function(b){var g=gGet(),k=b.dataset.k;if(!g.lv.hasOwnProperty(k))return;var c=gCost(k,g.lv[k]);if(g.hearts<c)return;g.hearts-=c;g.lv[k]++;gSfx('buy');gSave();gRefresh();},
  rbuy:function(b){var g=gGet(),k=b.dataset.k;if(!g.rl.hasOwnProperty(k))return;var mx={sk:20,cbt:20,cbn:9}[k];if(mx&&g.rl[k]>=mx)return;var c=gRCost(g.rl[k]);if(g.rubies<c)return;g.rubies-=c;g.rl[k]++;gSfx('buy');gSave();gRefresh();},
  rbbuy:function(b){var g=gGet(),k=b.dataset.k,u=G_RBU.filter(function(x){return x[0]===k;})[0];if(!u)return;var l=g.ru[k];if(u[6]&&l>=u[6])return;var c=gRBCost(u,l);if(g.rbp<c)return;g.rbp-=c;g.ru[k]++;gSfx('buy');gSave();gRefresh();},
  rb2:function(){
    var g=gGet();if(g.stage<1000)return;
    if(!arm('grb2'))return;
    var gain=gRBGain(g);g.rbp+=gain;g.rbn++;
    g.stage=gStartStage(g);g.best=Math.max(g.best,g.stage);g.hp=0;g.hearts=0;g.lv={atk:0,inc:0,spd:0};g.farm=false;g.hold=false;g.bossLock=false;g.sk=0;g.bt=0;g.dlyLeft=0;g.fails=0;g.last=Date.now();
    gSave();render();gSfx('coin');toast('환생했어! 환생 포인트 +'+gain+' 🔁');
  },
  rpbuy:function(b){var g=gGet(),k=b.dataset.k,u=G_RPU.filter(function(x){return x[0]===k;})[0];if(!u)return;var l=g.rp[k];if(u[6]&&l>=u[6])return;var c=gRPCost(u,l);if(g.rpt<c)return;g.rpt-=c;g.rp[k]++;gSfx('buy');gSave();gRefresh();},
  reb:function(){
    var g=gGet();if(g.evo<3||g.best<1000)return;
    if(!arm('greb'))return;
    var gain=gRPGain(g),fromSrc=gHeroSrc(g);g.rbEvo=Math.max(g.rbEvo||0,g.evo);g.rpt+=gain;g.rebirths++;
    g.evo=0;g.credit=0;g.ru=gRuZero();g.rbp=0;g.ch=0;g.stage=gStartStage(g);g.hp=0;g.hearts=0;g.lv={atk:0,inc:0,spd:0};g.farm=false;g.hold=false;g.bossLock=false;g.sk=0;g.bt=0;g.dlyLeft=0;g.fails=0;g.last=Date.now();
    gSave();render();gRebirthFx(fromSrc,gain);
  },
  tip:function(b){var L=+b.dataset.k;gTipK=gTipK===L?0:L;gRefresh();},
  tku:function(b){var L=+b.dataset.k,g=gGet(),t=null;g.tk.forEach(function(x){if(x.lvl===L)t=x;});if(t)gTkShare(t);},
  tkused:function(b){var L=+b.dataset.k,g=gGet(),t=null;g.tk.forEach(function(x){if(x.lvl===L)t=x;});if(!t||t.used)return;if(!arm('tk'+L))return;t.used=Date.now();gSave();render();toast('사용 완료로 표시했어 ✅');},
  rw:function(b){var k=b.dataset.k;gRw=(k==='cash'||k==='rep')?k:'ach';gRefresh();},
  rep:function(b){
    var g=gGet(),k=b.dataset.k,got=0;
    G_REP.forEach(function(R){if(k!=='all'&&R.k!==k)return;var a=gRepAvail(g,R);if(a>0){g.rc[R.k]=(g.rc[R.k]||0)+a;got+=a*G_REPR;}});
    if(!got)return;g.rubies+=got;gSfx('coin');gSave();gRefresh();toast('반복 보상! 루비 +'+got+' 💎');
  },
  ach:function(b){
    var id=b.dataset.k,g=gGet(),f=null,rw=0;
    G_ACH.forEach(function(G){var c=G.cur(g);G.l.forEach(function(x){if(G.p+x[0]===id){f=x;rw=x[1];if(!(c>=x[0]))f=null;}});});
    if(!f||g.ach[id])return;
    g.ach[id]=1;g.tickets+=rw;gSave();gRefresh();toast('업적 달성! 뽑기권 +'+rw+'장 🎟️');
  },
  boss:function(){var g=gGet();if(g.stage%10!==0||!g.farm)return;g.farm=false;g.hp=gHp(g.stage);g.bt=0;g.dlyLeft=0;g.last=Date.now();gSave();gPaintStage(g,true);gNoteKey='';gSetH('g-note',gNoteHtml(g));gSet('g-st',gStText(g));},
  menu:function(b){
    var k=b.dataset.k,m=$('main'),sec=$('g-sec');
    if(gMenuOn(k)){
      if(sec)sec.classList.add('out');
      setTimeout(function(){gSub='';gApplyMode(true);gRefresh();if(sec)sec.classList.remove('out');if(m)m.scrollTo({top:0,behavior:'smooth'});},130);
      return;
    }
    var was=gSub;gSub=k;gApplyMode(true);gRefresh();
    if(was===''&&sec){sec.classList.remove('in');void sec.offsetWidth;sec.classList.add('in');}
    if(m)m.scrollTop=0;
  },
  chip:function(b){
    var T={h:'💗 하트: 몬스터를 잡으면 저절로 모여. 하트 강화에 쓰여! (환생·진화하면 처음으로 돌아가)',d:'⚔️ 초당 공격력: 내 공격력 × 공격 속도야. 보스를 못 깨면 이 숫자가 모자란 거야.',r:'루비: 운동을 끝내면 받아. 루비 강화에 쓰고, 환생·진화해도 안 사라져!',t:'🎟️ 뽑기권: 운동 한 번 끝낼 때마다 2장, 하루 첫 접속에도 2장 받아. 뽑기 탭에서 오라랑 동료를 뽑아봐!'};
    var e=$('g-chtip');if(!e)return;var k=b.dataset.k;
    if(!e.hidden&&e.dataset.k===k){e.hidden=true;return;}
    e.textContent=T[k]||'';e.dataset.k=k;e.hidden=false;clearTimeout(gChT);gChT=setTimeout(function(){e.hidden=true;},4000);
  },
  pull:function(b){
    var g=gGet(),n=+b.dataset.k===10?10:1,pt=b.dataset.t==='p';if(g.tickets<n)return;
    g.tickets-=n;var res=[];for(var i=0;i<n;i++)res.push(pt?gRollPet(g):gRollOne(g));g.pulls+=n;gSave();gRefresh();var sb=null;res.forEach(function(r){if(r.rar===3&&!sb)sb=r;});if(sb)gSsrShow(sb.k,sb.name,function(){gGachaShow(res);},{src:sb.img});else gGachaShow(res);
  },
  dexi:function(b){
    var k=b.dataset.k,g=gGet();if(!G_DX[k])return;
    if(!g.dex[k]){toast('아직 못 만난 오라야 ❓');return;}
    gDexModal(k);
  },
  dxx:function(){gDexModalClose();},
  mdi:function(b){gMonModal(b.dataset.k);},
  dxeq:function(b){
    var k=b.dataset.k,g=gGet();if(!g.dex[k])return;
    if(g.hero===k){g.hero='';toast('오라를 벗었어');}else{g.hero=k;toast('「'+G_DX[k][0]+'」 오라를 장착했어! ✨');}
    gSave();gRefresh();gDexModalClose();
  },
  dxup:function(b){
    var k=b.dataset.k,g=gGet();if(!g.dex[k])return;
    var st=g.star[k]||1;if(st>=5)return;var need=G_SN[st];if((g.dup[k]||0)<need)return;
    g.dup[k]-=need;g.star[k]=st+1;gSave();gDexModalClose();gRefresh();
    if(g.star[k]>=5)gSsrShow(k,G_DX[k][0],function(){gRefresh();},{t:'★ 5',sub:'최고 강화 달성!'});
    else gStarFx(k,g.star[k],function(){gRefresh();});
  },
  tab:function(b){if(b.dataset.t==='up')gUpT=b.dataset.k;else if(b.dataset.t==='grow')gGrT=b.dataset.k;else if(b.dataset.t==='gac')gGacT=b.dataset.k;else if(b.dataset.t==='stat')gStT=b.dataset.k;else if(b.dataset.t==='farm')gFmT=b.dataset.k;else gDxT=b.dataset.k;gDexModalClose();gRefresh();},
  pdi:function(b){var k=b.dataset.k,g=gGet();if(!G_CPM[k])return;if(!g.cdex[k]){toast('아직 못 만난 동료야 ❓');return;}gPetModal(k);},
  peq:function(b){
    var k=b.dataset.k,g=gGet(),p=G_CPM[k];if(!p||!g.cdex[k])return;
    if(g.ceq[p.c]===k){g.ceq[p.c]='';toast(p.n+'는 쉬러 갔어');}else{g.ceq[p.c]=k;toast(p.n+' 출동! '+G_CPA[p.a][0]+' '+gCpFmt(p.a,gCpVal(g,k))+' ✨');}
    gSave();gRefresh();gDexModalClose();
  },
  pup:function(b){
    var k=b.dataset.k,g=gGet(),p=G_CPM[k];if(!p||!g.cdex[k])return;
    var st=g.cstar[k]||1;if(st>=5)return;var need=G_SN[st];if((g.cdup[k]||0)<need)return;
    g.cdup[k]-=need;g.cstar[k]=st+1;gSave();gDexModalClose();gRefresh();
    var tx=G_CPA[p.a][0]+' '+gCpFmt(p.a,gCpVal(g,k,st))+' → <b>'+gCpFmt(p.a,gCpVal(g,k,st+1))+'</b>';
    if(g.cstar[k]>=5)gSsrShow(k,p.n,function(){gRefresh();},{src:gCpImg(k),t:'★ 5',sub:'최고 강화 달성!'});
    else gStarFx(k,g.cstar[k],function(){gRefresh();},{src:gCpImg(k),txt:tx});
  },
  fmi:function(b){var L=+b.dataset.k,g=gGet();if(L>gMaxEvo(g)){toast('아직 못 만난 모습이야 🔒 성장하면 열려!');return;}gFormModal(L);},
  feq:function(b){var L=+b.dataset.k,g=gGet();if(L>gMaxEvo(g))return;g.form=(g.form===L)?-1:L;gSave();gRefresh();toast(g.form===L?'Lv.'+L+' 모습으로 바꿨어! ✨':'성장 모습으로 돌아왔어');gDexModalClose();},
  buffx:function(){gBuffClose();},
  snd:function(){var g=gGet();g.snd=g.snd?0:1;gSave();var b=$('g-snd');if(b)b.textContent=g.snd?'🔊':'🔇';if(g.snd)gSfx('buy');toast(g.snd?'효과음 켰어 🔊':'효과음 껐어 🔇');},
  buff:function(){gBuffModal();},
  evo:function(){
    var g=gGet();if(!gEvoReady(g))return;
    var from=g.evo,to=from+1,tk=false;g.evo=to;g.mxe=Math.max(g.mxe||0,to);
    if(G_TKAMT[to]&&!g.tkMade[to]){gMkTk(g,to);tk=true;}
    g.last=Date.now();gSave();render();gEvoFx(from,to);
    if(tk)setTimeout(function(){toast('🎁 '+G_TKAMT[to]+'만원 보상권 도착!');},1200);
  },
  btk:function(){var g=gGet();if(g.rubies<5)return;g.rubies-=5;g.tickets++;gSfx('buy');gSave();gRefresh();},
  bsh:function(){var g=gGet();if(g.stk.sh||g.rubies<100)return;if(!arm('gsh')){if($('gbm'))gBuffModal();return;}g.rubies-=100;g.stk.sh=1;gSfx('coin');gSave();gRefresh();toast('🛡️ 방지권을 샀어! 하루 빠져도 연속이 이어져');if($('gbm'))gBuffModal();},
  hero:function(){gBubble('tap');var h=$('g-hero');if(h){h.classList.remove('pop');void h.offsetWidth;h.classList.add('pop');}}
};
