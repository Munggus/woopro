var G_EVOM=function(e){return Math.pow(GP.EM,e);};
function gEH(n){return n>=100?1:(GP.EH+(1-GP.EH)*n/100);}
function gEK(n){return n>=100?1:(1+GP.EK*(1-n/100));}
function gDexB(g){var b=0;if(g.dex&&typeof G_RB!=='undefined'){var c=[0,0,0,0];for(var k in g.dex){b+=(G_RB[G_RAR[k]]||0)*(G_SM[(g.star&&g.star[k])||1]||1);c[G_RAR[k]]++;}for(var r=0;r<4;r++)if(c[r]>=G_RTOT[r])b+=G_SETB[r];}return b/100;}
function gHm(n){var c=G_DATA.curve;return n<=c.hmFrom?1:Math.pow(n/c.hmFrom,c.hmPow);}
var G_XR=G_DATA.curve.XR,G_XP=[0];(function(){for(var j=0;j<80;j++)G_XP.push(G_XP[j]+G_XR[Math.min(j,G_XR.length-1)]);})();
function gXm(n){if(!(n>0))return 1;var j=Math.min(79,Math.floor(n/1000));return Math.exp(G_XP[j]+G_XR[Math.min(j,G_XR.length-1)]*(n-1000*j)/1000);}
function gHp(n){return gXm(n)*gHm(n)*GP.H0*Math.pow(n,GP.PW)*(n%10===0?GP.BM:1)*gEH(n);}
function gBase(n){return GP.H0*Math.pow(n,GP.PW);}
function gStkExp(s){var d=new Date(s.ld);return new Date(d.getFullYear(),d.getMonth(),d.getDate()+G_DATA.streak.graceDays+(s.sh?G_DATA.streak.graceShield:0)).getTime();}
function gStkB(g){var s=g.stk;if(!s||!s.n||!s.ld)return 0;return Date.now()<gStkExp(s)?G_DATA.streak.per*s.n:0;}
function gGb(g,k){return (typeof gGearB==='function')?gGearB(g,k):0;}
function gPb(g,k){return (typeof gPetB==='function'&&g.ceq)?(gPetB(g)[k]||0):0;}
function gInc(g){return G_EVOM(g.evo)*(1+gStkB(g))*(1+gDexB(g))*(1+GP.IM*g.lv.inc)*(1+GP.RHT*g.rl.heart)*(1+GP.SG*(g.rp.inc||0))*(1+GP.RU*gRu(g,'inc'))*(1+gPb(g,'inc'))*(1+gGb(g,'inc'));}
function gKill(g,n){return gBase(n)*gEK(n)*GP.KR*gInc(g)*(n%10===0?G_DATA.curve.bossKill:1);}
function gAtk(g){return (1+gStkB(g))*(1+gDexB(g))*GP.A0*Math.pow(GP.AM,g.lv.atk)*G_EVOM(g.evo)*(1+GP.RAT*g.rl.atk)*(1+GP.SG*(g.rp.atk||0))*(1+GP.RU*gRu(g,'atk'))*(1+gPb(g,'atk'))*(1+gGb(g,'atk'));}
function gSpd(g){return Math.min(GP.SCAP,1+GP.SS*g.lv.spd)*(1+G_DATA.spd.rp*(g.rp.spd||0))*(1+G_DATA.spd.ru*gRu(g,'spd'))*(1+gPb(g,'spd'))*(1+gGb(g,'spd'));}
function gDps(g){return gAtk(g)*gSpd(g);}
function gDly(g){return Math.max(G_DATA.dly.min,GP.DLY*Math.pow(G_DATA.dly.rp,g.rp.mv||0)*Math.pow(G_DATA.dly.rl,(g.rl&&g.rl.mv)||0)/(1+gPb(g,'mv')));}
function gBossT(g){return GP.BOSS_T+Math.min(G_DATA.bt.max,(g.rp.bt||0))+gPb(g,'bt');}
function gSkipP(g){return Math.min(G_DATA.skip.max,G_DATA.skip.rp*(g.rp.sk||0)+G_DATA.skip.ru*gRu(g,'sk')+G_DATA.skip.rl*((g.rl&&g.rl.sk)||0)+gPb(g,'skip'));}
function gCbPer(g){return G_DATA.combo.per+G_DATA.combo.perRp*((g.rp&&g.rp.cbd)||0)+gPb(g,'cbd');}
function gCbKeep(g){return G_DATA.combo.keep+G_DATA.combo.keepRl*((g.rl&&g.rl.cbt)||0)+gPb(g,'cbt');}
function gCbT(g){var r=Math.floor(((g.rl&&g.rl.cbn)||0)/G_DATA.combo.rlStep)+Math.floor(gPb(g,'cbn')+1e-9);return Math.max(G_DATA.combo.Tmin,G_DATA.combo.T0-r);}
function gUlt(g){return (1+G_DATA.ult.ru*gRu(g,'ult'))*(1+gPb(g,'ult'))*(1+gGb(g,'ult'));}
var G_ULT=G_DATA.ults;
var G_UCD=G_DATA.ultCd,G_USH=G_DATA.ultShort;
function gUNeed(g,i){return i<3?gCbT(g)*(i+1):G_DATA.combo.full;}
function gRuZero(){var o={};G_RBU.forEach(function(u){o[u[0]]=0;});return o;}
function gRu(g,k){return (g.ru&&g.ru[k])||0;}
function gStartStage(g){return 1+G_DATA.start.ru*gRu(g,'st')+G_DATA.start.rp*((g.rp&&g.rp.st)||0);}
function gRBGain(g){return (function(r){return g.stage<r.from?0:r.base+Math.floor(r.mult*Math.pow((g.stage-r.from)/r.per+1,r.pow));})(G_DATA.rbGain);}
var G_RBU=G_DATA.RBU;
function gRBCost(u,l){return Math.ceil(u[4]*Math.pow(u[5],l));}
function gCost(k,l){return k==='atk'?GP.CA0*Math.pow(GP.CAg,l):k==='inc'?GP.CI0*Math.pow(GP.CIg,l):GP.CS0*Math.pow(GP.CSg,l);}
function gRCost(l){return Math.ceil(G_DATA.rCost.a*Math.pow(G_DATA.rCost.g,l));}
function gCanBoss(g,n){return gDps(g)*gBossT(g)>=gHp(n);}
function gRPGain(g){var q=G_DATA.rpGain;return q.base+Math.floor(q.mult*Math.pow(Math.log10(1+Math.max(g.hearts,g.ch||0)/q.unit),q.pow)*(q.evoBase+q.evoPer*g.evo)*(1+q.rpgPer*((g.rp&&g.rp.rpg)||0)));}
var G_RPU=G_DATA.RPU;
function gRPCost(u,l){return Math.ceil(u[4]*Math.pow(u[5],l));}
function gAdvance(g,dt){
  if(!(dt>0))return {h:0,s:0};
  var h0=g.hearts,s0=g.stage,dps=gDps(g),guard=0,dly=gDly(g);
  if(!(g.hp>0))g.hp=g.farm?gHp(Math.max(1,g.stage-1)):gHp(g.stage);
  while(dt>1e-9&&guard++<60000){
    var n=g.stage,boss=n%10===0,T=gBossT(g);
    if(g.farm){
      var full=gHp(Math.max(1,n-1))/dps+dly,kills=dt/full;
      g.hearts+=gKill(g,Math.max(1,n-1))*kills;g.kills+=Math.floor(kills);if(typeof gDropK==='function')gDropK(g,Math.max(1,n-1),kills);dt=0;break;
    }
    if(g.dlyLeft>0){var d0=Math.min(dt,g.dlyLeft);g.dlyLeft-=d0;dt-=d0;if(dt<=1e-9)break;}
    if(boss){
      var rem=T-(g.bt||0);
      if(dps*rem>=g.hp-1e-9){
        var need=g.hp/dps;
        if(need<=dt){dt-=need;g.hearts+=gKill(g,n);g.kills++;if(typeof gDrop1==='function')gDrop1(g,n,true);g.stage++;g.best=Math.max(g.best,g.stage);g.hp=gHp(g.stage);g.bt=0;g.dlyLeft=dly;g.bossLock=false;}
        else{g.hp-=dps*dt;g.bt=(g.bt||0)+dt;dt=0;}
      }else{
        var use=Math.min(dt,rem);g.hp-=dps*use;g.bt=(g.bt||0)+use;dt-=use;
        if((g.bt||0)>=T-1e-9){g.farm=true;g.bossLock=true;g.fails=(g.fails||0)+1;g.hp=gHp(Math.max(1,n-1));g.bt=0;}
      }
      continue;
    }
    if(g.dlyLeft>0){var d0=Math.min(dt,g.dlyLeft);g.dlyLeft-=d0;dt-=d0;if(dt<=1e-9)break;}
    var need2=g.hp/dps;
    if(need2<=dt){dt-=need2;g.hearts+=gKill(g,n);g.kills++;if(typeof gDrop1==='function')gDrop1(g,n,false);
      g.stage++;g.sk=(g.sk||0)+gSkipP(g);
      if(g.sk>=1&&g.stage%10!==0){g.sk-=1;g.stage++;}
      g.best=Math.max(g.best,g.stage);g.hp=gHp(g.stage);g.dlyLeft=dly;}
    else{g.hp-=dps*dt;dt=0;}
  }
  g.ch=(g.ch||0)+Math.max(0,g.hearts-h0);
  return {h:g.hearts-h0,s:g.stage-s0};
}
