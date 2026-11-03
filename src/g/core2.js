var GP={H0:13,PW:2.1,BM:6,KR:0.62,BOSS_T:30,A0:3,AM:1.07,SS:0.024,SCAP:4,DLY:3,CA0:10,CAg:1.155,CS0:60,CSg:1.22,CI0:25,CIg:1.10,EM:1.3,RAT:0.15,RHT:0.15,RU:0.12,SG:0.40,IM:0.10,EH:0.45,EK:1.5};
var G_EVOM=function(e){return Math.pow(GP.EM,e);};
function gEH(n){return n>=100?1:(GP.EH+(1-GP.EH)*n/100);}
function gEK(n){return n>=100?1:(1+GP.EK*(1-n/100));}
function gDexB(g){var b=0;if(g.dex&&typeof G_RB!=='undefined'){var c=[0,0,0,0];for(var k in g.dex){b+=(G_RB[G_RAR[k]]||0)*(G_SM[(g.star&&g.star[k])||1]||1);c[G_RAR[k]]++;}for(var r=0;r<4;r++)if(c[r]>=G_RTOT[r])b+=G_SETB[r];}return b/100;}
function gHm(n){return n<=500?1:Math.pow(n/500,1.85);}
var G_XR=[0.407,0.6,2.0,1.2,0.7,0.35],G_XP=[0];(function(){for(var j=0;j<80;j++)G_XP.push(G_XP[j]+G_XR[Math.min(j,G_XR.length-1)]);})();
function gXm(n){if(!(n>0))return 1;var j=Math.min(79,Math.floor(n/1000));return Math.exp(G_XP[j]+G_XR[Math.min(j,G_XR.length-1)]*(n-1000*j)/1000);}
function gHp(n){return gXm(n)*gHm(n)*GP.H0*Math.pow(n,GP.PW)*(n%10===0?GP.BM:1)*gEH(n);}
function gBase(n){return GP.H0*Math.pow(n,GP.PW);}
function gStkExp(s){var d=new Date(s.ld);return new Date(d.getFullYear(),d.getMonth(),d.getDate()+2+(s.sh?1:0)).getTime();}
function gStkB(g){var s=g.stk;if(!s||!s.n||!s.ld)return 0;return Date.now()<gStkExp(s)?0.05*s.n:0;}
function gPb(g,k){return (typeof gPetB==='function'&&g.ceq)?(gPetB(g)[k]||0):0;}
function gInc(g){return G_EVOM(g.evo)*(1+gStkB(g))*(1+gDexB(g))*(1+GP.IM*g.lv.inc)*(1+GP.RHT*g.rl.heart)*(1+GP.SG*(g.rp.inc||0))*(1+GP.RU*gRu(g,'inc'))*(1+gPb(g,'inc'));}
function gKill(g,n){return gBase(n)*gEK(n)*GP.KR*gInc(g)*(n%10===0?4:1);}
function gAtk(g){return (1+gStkB(g))*(1+gDexB(g))*GP.A0*Math.pow(GP.AM,g.lv.atk)*G_EVOM(g.evo)*(1+GP.RAT*g.rl.atk)*(1+GP.SG*(g.rp.atk||0))*(1+GP.RU*gRu(g,'atk'))*(1+gPb(g,'atk'));}
function gSpd(g){return Math.min(GP.SCAP,1+GP.SS*g.lv.spd)*(1+0.05*(g.rp.spd||0))*(1+0.03*gRu(g,'spd'))*(1+gPb(g,'spd'));}
function gDps(g){return gAtk(g)*gSpd(g);}
function gDly(g){return Math.max(0.5,GP.DLY*Math.pow(0.93,g.rp.mv||0)*Math.pow(0.97,(g.rl&&g.rl.mv)||0)/(1+gPb(g,'mv')));}
function gBossT(g){return GP.BOSS_T+Math.min(20,(g.rp.bt||0))+gPb(g,'bt');}
function gSkipP(g){return Math.min(0.8,0.03*(g.rp.sk||0)+0.02*gRu(g,'sk')+0.015*((g.rl&&g.rl.sk)||0)+gPb(g,'skip'));}
function gCbPer(g){return 0.03+0.001*((g.rp&&g.rp.cbd)||0)+gPb(g,'cbd');}
function gCbKeep(g){return 3+0.1*((g.rl&&g.rl.cbt)||0)+gPb(g,'cbt');}
function gCbT(g){var r=Math.floor(((g.rl&&g.rl.cbn)||0)/3)+Math.floor(gPb(g,'cbn')+1e-9);return Math.max(6,10-r);}
function gUlt(g){return (1+0.08*gRu(g,'ult'))*(1+gPb(g,'ult'));}
var G_ULT=[[4,'💘','하트 빔'],[7,'☄️','별똥별 소나기'],[12,'🌈','무지개 대폭발'],[10,'🤝','도와줘 친구들']];
var G_UCD=[20,40,60,90],G_USH=['하트빔','별똥별','무지개','친구들'];
function gUNeed(g,i){return i<3?gCbT(g)*(i+1):100;}
function gRuZero(){var o={};G_RBU.forEach(function(u){o[u[0]]=0;});return o;}
function gRu(g,k){return (g.ru&&g.ru[k])||0;}
function gStartStage(g){return 1+4*gRu(g,'st')+10*((g.rp&&g.rp.st)||0);}
function gRBGain(g){return g.stage<1000?0:Math.floor(Math.pow((g.stage-1000)/100+1,1.5));}
var G_RBU=[['atk','⚔️','공격력','+12%',2,1.5,0],['inc','💗','하트 수입','+12%',2,1.5,0],['spd','⚡','공격 속도','+3%',3,1.55,0],['sk','🪜','층 건너뛰기','확률 +2% (최대 40%)',4,1.5,20],['st','🚀','시작 층','환생·진화 뒤 +4층에서 시작',5,1.5,25],['ult','💥','필살기 위력','+8%',4,1.55,25]];
function gRBCost(u,l){return Math.ceil(u[4]*Math.pow(u[5],l));}
function gCost(k,l){return k==='atk'?GP.CA0*Math.pow(GP.CAg,l):k==='inc'?GP.CI0*Math.pow(GP.CIg,l):GP.CS0*Math.pow(GP.CSg,l);}
function gRCost(l){return Math.ceil(5*Math.pow(1.5,l));}
function gCanBoss(g,n){return gDps(g)*gBossT(g)>=gHp(n);}
function gRPGain(g){return Math.floor(Math.pow(Math.log10(1+Math.max(g.hearts,g.ch||0)/1e6),1.6)*(0.5+0.5*g.evo)*(1+0.1*((g.rp&&g.rp.rpg)||0)));}
var G_RPU=[['atk','⚔️','공격력','+40%',3,1.55,0],['inc','💗','하트 수입','+40%',3,1.55,0],['spd','⚡','공격 속도','+5%',5,1.6,0],['sk','🪜','층 건너뛰기','확률 +3% (최대 60%)',8,1.5,20],['st','🚀','시작 층','진화 뒤 +10층에서 시작',8,1.5,20],['cbd','🔥','콤보 파워','콤보 1당 데미지 +0.1%p (최대 +2%p)',6,1.5,20],['mv','🏃','이동 속도','층 이동 대기시간 −7%',6,1.5,20],['bt','⏱️','보스 제한시간','+1초 (최대 +20초)',6,1.5,20],['tk','🎟️','뽑기권 획득','운동 1회마다 +1장',20,2,10],['rub','RUBY','루비 획득량','운동 보상 루비 +10%',5,1.6,0],['rpg','🌸','성장포인트 획득량','진화 때 받는 포인트 +10%',6,1.6,0]];
function gRPCost(u,l){return Math.ceil(u[4]*Math.pow(u[5],l));}
function gAdvance(g,dt){
  if(!(dt>0))return {h:0,s:0};
  var h0=g.hearts,s0=g.stage,dps=gDps(g),guard=0,dly=gDly(g);
  if(!(g.hp>0))g.hp=g.farm?gHp(Math.max(1,g.stage-1)):gHp(g.stage);
  while(dt>1e-9&&guard++<60000){
    var n=g.stage,boss=n%10===0,T=gBossT(g);
    if(g.farm){
      var full=gHp(Math.max(1,n-1))/dps+dly,kills=dt/full;
      g.hearts+=gKill(g,Math.max(1,n-1))*kills;g.kills+=Math.floor(kills);dt=0;break;
    }
    if(g.dlyLeft>0){var d0=Math.min(dt,g.dlyLeft);g.dlyLeft-=d0;dt-=d0;if(dt<=1e-9)break;}
    if(boss){
      var rem=T-(g.bt||0);
      if(dps*rem>=g.hp-1e-9){
        var need=g.hp/dps;
        if(need<=dt){dt-=need;g.hearts+=gKill(g,n);g.kills++;g.stage++;g.best=Math.max(g.best,g.stage);g.hp=gHp(g.stage);g.bt=0;g.dlyLeft=dly;g.bossLock=false;}
        else{g.hp-=dps*dt;g.bt=(g.bt||0)+dt;dt=0;}
      }else{
        var use=Math.min(dt,rem);g.hp-=dps*use;g.bt=(g.bt||0)+use;dt-=use;
        if((g.bt||0)>=T-1e-9){g.farm=true;g.bossLock=true;g.fails=(g.fails||0)+1;g.hp=gHp(Math.max(1,n-1));g.bt=0;}
      }
      continue;
    }
    if(g.dlyLeft>0){var d0=Math.min(dt,g.dlyLeft);g.dlyLeft-=d0;dt-=d0;if(dt<=1e-9)break;}
    var need2=g.hp/dps;
    if(need2<=dt){dt-=need2;g.hearts+=gKill(g,n);g.kills++;
      g.stage++;g.sk=(g.sk||0)+gSkipP(g);
      if(g.sk>=1&&g.stage%10!==0){g.sk-=1;g.stage++;}
      g.best=Math.max(g.best,g.stage);g.hp=gHp(g.stage);g.dlyLeft=dly;}
    else{g.hp-=dps*dt;dt=0;}
  }
  g.ch=(g.ch||0)+Math.max(0,g.hearts-h0);
  return {h:g.hearts-h0,s:g.stage-s0};
}
