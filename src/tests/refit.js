// 성장곡선(XR) 재맞춤: 구간별 목표 소요일에 맞도록 XR을 구한다. 사용: node tests/refit.js
var S=require('../g/sim6.js');
var T=[14,63,157,662,1624,4000],XR=[],prev=0;
for(var j=0;j<T.length;j++){
  var target=T[j],lo=-2,hi=9;
  for(var it=0;it<14;it++){
    var mid=(lo+hi)/2,r=S.run(XR.concat([mid]),Math.ceil(target*3)+50,{until:j+1});
    var t=r.res[j+1]==null?1e9:r.res[j+1]-prev;
    if(t>target)hi=mid;else lo=mid;
  }
  XR.push(+((lo+hi)/2).toFixed(3));
  var r2=S.run(XR,Math.ceil(target*3)+50,{until:j+1});prev=r2.res[j+1]||prev;
  console.log('block'+j+' XR='+XR[j]+' 소요='+(r2.res[j+1]-(j?r2.res[j]:0))+'일 (목표 '+target+')');
}
console.log(JSON.stringify(XR));
