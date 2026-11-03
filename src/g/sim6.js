var fs=require('fs');var SRC=fs.readFileSync('g/data.js','utf8')+fs.readFileSync('g/core2.js','utf8');
// R: array of ln-multiplier per 1000-floor block starting at floor 1000 (continuous exp)
function load(){
  var s=SRC.replace("G_XR=G_DATA.curve.XR","G_XR=XR.slice()");
  s=s.replace("function gDps(g){return gAtk(g)*gSpd(g);}","function gDps(g){return GXV*gAtk(g)*gSpd(g);}");
  return new Function('XR','GXV_ref',"var GXV=1;"+s+";return {gAdvance:gAdvance,gCost:gCost,gRCost:gRCost,gDps:gDps,gHp:gHp,gBossT:gBossT,gRBGain:gRBGain,gRPGain:gRPGain,gStartStage:gStartStage,gRuZero:gRuZero,G_RBU:G_RBU,G_RPU:G_RPU,gRBCost:gRBCost,gRPCost:gRPCost,setX:function(v){GXV=v;}};");
}
function run(XR,days,opt){
  opt=opt||{};var ACT=opt.act==null?3.5:opt.act;
  var C=load()(XR);
  var g={hearts:0,stage:1,hp:0,kills:0,best:1,farm:false,bossLock:false,fails:0,lv:{atk:0,inc:0,spd:0},rl:{atk:0,heart:0,sk:0},rp:{},ru:{},evo:0,rubies:0,dex:{},stk:null,ch:0,rbp:0};
  var credit=0,rpt=0,res={},maxS=1,rbn=0,evoN=0,log=[],hist=[];
  function zero(){g.hearts=0;g.lv={atk:0,inc:0,spd:0};g.stage=C.gStartStage(g);g.hp=0;g.farm=false;g.bossLock=false;g.bt=0;g.dlyLeft=0;g.sk=0;}
  function buyH(){var ch=true,gd=0;while(ch&&gd++<400){ch=false;['atk','inc','spd'].forEach(function(k){var c=C.gCost(k,g.lv[k]);if(g.hearts>=c&&!(k==='spd'&&g.lv.spd>=125)){g.hearts-=c;g.lv[k]++;ch=true;}});}}
  function buyR(){var ch=true;while(ch){ch=false;['atk','heart','sk'].forEach(function(k){var c=C.gRCost(g.rl[k]);if(g.rubies>=c&&!(k==='sk'&&g.rl.sk>=40)){g.rubies-=c;g.rl[k]++;ch=true;}});}}
  function buyRB(){var ch=true;while(ch){ch=false;C.G_RBU.forEach(function(u){if(u[0]==='ult')return;var l=g.ru[u[0]]||0;if(u[6]&&l>=u[6])return;var c=C.gRBCost(u,l);if(g.rbp>=c){g.rbp-=c;g.ru[u[0]]=l+1;ch=true;}});}}
  function buyRP(){var ch=true;while(ch){ch=false;C.G_RPU.forEach(function(u){if(['atk','inc','spd','sk','st'].indexOf(u[0])<0)return;var l=g.rp[u[0]]||0;if(u[6]&&l>=u[6])return;var c=C.gRPCost(u,l);if(rpt>=c){rpt-=c;g.rp[u[0]]=l+1;ch=true;}});}}
  function chal(){if(g.farm&&g.stage%10===0&&C.gDps(g)*C.gBossT(g)>=C.gHp(g.stage)){g.farm=false;g.hp=C.gHp(g.stage);g.bt=0;g.dlyLeft=0;}}
  function note(d){if(g.stage>maxS){maxS=g.stage;var b=Math.floor(maxS/1000);for(var j=1;j<=b;j++)if(res[j]==null)res[j]=d;}}
  for(var d=1;d<=days;d++){
    credit+=1;g.evo=Math.min(10,Math.floor(Math.log2(credit+1)));g.rubies+=Math.round(28*(1+0.1*g.evo));buyR();
    C.setX(ACT);for(var s=0;s<60;s++){buyH();chal();C.gAdvance(g,60);note(d);}
    C.setX(1);chal();C.gAdvance(g,28800);note(d);
    buyH();chal();
    hist.push(maxS);if(opt.until&&res[opt.until]!=null)break;
    // prestige policy
    var back=hist[Math.max(0,hist.length-4)];
    var stalled=g.stage<=hist.length>3&&false;
    var prog=g.stage-(g._ps3||0);
    if(d%3===0){var st=(g.stage-(g._pst||0))<Math.max(10,g.stage*0.02);g._pst=g.stage;
      if(st&&g.stage>=1000){
        var canEvo=g.evo>=3&&g.best>=1000&&C.gRPGain(g)>=2;
        if(canEvo&&(g._rbSince||0)>=(opt.rbPerEvo||5)){rpt+=C.gRPGain(g);g.ru=C.gRuZero();g.rbp=0;g.ch=0;g._rbSince=0;evoN++;zero();buyRP();log.push(d+'d 진화#'+evoN+' rpt='+rpt);}
        else{var gn=C.gRBGain(g);if(gn>0){g.rbp+=gn;g._rbSince=(g._rbSince||0)+1;rbn++;zero();}}
      }
      buyRB();buyRP();
    }
  }
  return {res:res,maxS:maxS,stage:g.stage,rbn:rbn,evoN:evoN,log:log,rp:g.rp,ru:g.ru};
}
module.exports={run:run};
if(require.main===module){
  var T0=+process.argv[2]||21,F=+process.argv[3]||2.1,NB=+process.argv[4]||6;
  var XR=[],prev=0;
  for(var j=0;j<NB;j++){
    var target=T0*Math.pow(F,j),lo=-2,hi=8,best=0;
    for(var it=0;it<16;it++){
      var mid=(lo+hi)/2,X=XR.concat([mid]);
      var r=run(X,Math.ceil(target*3)+50,{until:j+1});
      var t=r.res[j+1]==null?1e9:r.res[j+1]-prev;
      if(t>target)hi=mid;else lo=mid;best=mid;
    }
    XR.push(+((lo+hi)/2).toFixed(3));
    var r=run(XR,Math.ceil(target*3)+50,{until:j+1});prev=r.res[j+1]||prev;
    console.log('block'+j+' r='+XR[j]+' 도달일='+r.res[j+1]+' 소요='+(r.res[j+1]-(j?r.res[j]:0))+' (목표 '+target.toFixed(0)+')');
  }
  console.log(JSON.stringify(XR));
}
