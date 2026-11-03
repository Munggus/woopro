// 공식 골든 테스트: 수치를 옮기거나 고친 뒤에도 "같은 입력 → 같은 결과"인지 확인한다.
// 사용: node tests/golden.js save   (현재 공식 결과를 기준으로 저장)
//       node tests/golden.js        (저장된 기준과 비교)
var fs=require('fs'),path=require('path');
var SRC=fs.readFileSync(path.join(__dirname,'../g/core2.js'),'utf8');
var C=new Function(SRC+';return {gHp:gHp,gKill:gKill,gAtk:gAtk,gInc:gInc,gSpd:gSpd,gDps:gDps,gDly:gDly,gBossT:gBossT,gSkipP:gSkipP,gCost:gCost,gRCost:gRCost,gRBCost:gRBCost,gRPCost:gRPCost,gRBGain:gRBGain,gRPGain:gRPGain,gStartStage:gStartStage,gCbPer:gCbPer,gCbKeep:gCbKeep,gCbT:gCbT,gUlt:gUlt,gXm:gXm,G_RBU:G_RBU,G_RPU:G_RPU,GP:GP};')();
function mk(o){return Object.assign({hearts:1e9,ch:1e9,stage:10,hp:0,evo:0,lv:{atk:0,inc:0,spd:0},rl:{atk:0,heart:0,sk:0,mv:0,cbt:0,cbn:0},rp:{},ru:{},dex:{},stk:null},o||{});}
function snap(){
  var out={},stages=[1,2,5,10,50,99,100,101,500,999,1000,1001,1500,2000,2500,3000,4000,5000,7000,10000];
  stages.forEach(function(n){out['hp@'+n]=C.gHp(n);var g=mk({evo:0});out['kill@'+n]=C.gKill(g,n);});
  var states={
    '초기':mk(),
    '하트강화중':mk({lv:{atk:30,inc:25,spd:20},evo:3}),
    '하트강화많음':mk({lv:{atk:176,inc:150,spd:125},evo:1,rl:{atk:10,heart:8,sk:6,mv:3,cbt:5,cbn:6}}),
    '환생성장':mk({lv:{atk:80,inc:70,spd:60},evo:6,rl:{atk:20,heart:15,sk:10,mv:5,cbt:10,cbn:9},rp:{atk:10,inc:8,spd:5,sk:6,st:4,bt:3,mv:2,cbd:5,rub:3},ru:{atk:12,inc:10,spd:6,sk:8,st:9,ult:7}}),
    '최대':mk({lv:{atk:300,inc:300,spd:200},evo:10,rl:{atk:40,heart:40,sk:40,mv:10,cbt:20,cbn:30},rp:{atk:30,inc:30,spd:20,sk:20,st:20,bt:20,mv:20,cbd:20,rub:10},ru:{atk:25,inc:25,spd:25,sk:20,st:25,ult:25}})
  };
  Object.keys(states).forEach(function(k){var g=states[k];
    ['gAtk','gInc','gSpd','gDps','gDly','gBossT','gSkipP','gCbPer','gCbKeep','gCbT','gUlt','gStartStage','gRBGain','gRPGain'].forEach(function(f){out[k+'|'+f]=C[f](g);});});
  for(var l=0;l<=300;l+=15){['atk','inc','spd'].forEach(function(k){out['cost.'+k+'@'+l]=C.gCost(k,l);});out['rcost@'+l]=C.gRCost(l);}
  C.G_RBU.forEach(function(u){[0,5,10,20].forEach(function(l){out['rbcost.'+u[0]+'@'+l]=C.gRBCost(u,l);});});
  C.G_RPU.forEach(function(u){[0,5,10,20].forEach(function(l){out['rpcost.'+u[0]+'@'+l]=C.gRPCost(u,l);});});
  return out;
}
var f=path.join(__dirname,'golden.json'),cur=snap();
if(process.argv[2]==='save'){fs.writeFileSync(f,JSON.stringify(cur,null,1));console.log('기준 저장:',Object.keys(cur).length,'개 값');}
else{
  var ref=JSON.parse(fs.readFileSync(f,'utf8')),bad=[];
  Object.keys(ref).forEach(function(k){var a=ref[k],b=cur[k];if(!(Math.abs(a-b)<=Math.abs(a)*1e-12+1e-300))bad.push(k+': 기준 '+a+' → 현재 '+b);});
  Object.keys(cur).forEach(function(k){if(!(k in ref))bad.push(k+': 기준에 없는 새 값');});
  if(bad.length){console.log('❌ 달라진 값 '+bad.length+'개');bad.slice(0,20).forEach(function(x){console.log(' ',x);});process.exit(1);}
  console.log('✅ 골든 테스트 통과 ('+Object.keys(ref).length+'개 값 모두 동일)');
}
