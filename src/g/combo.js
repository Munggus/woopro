/* ===== 콤보 · 필살기 (직접 눌러서 싸우기) ===== */
var gCb={n:0,t:0,cnt:0};
function gWalking(g){return !g.farm&&g.dlyLeft>0;}
function gCbLvl(g){var T=gCbT(g),n=gCb.n;return n>=3*T?3:n>=2*T?2:n>=T?1:0;}
function gCbTier(n){return n>=100?4:n>=50?3:n>=25?2:n>=10?1:0;}
function gVib(p){try{if(gS&&gS.snd&&navigator.vibrate)navigator.vibrate(p);}catch(e){}}
function gRM(){try{return window.matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){return false;}}
function gCbHtml(){return '<div class="gcmb" id="g-cb" hidden><small>COMBO</small><b id="g-cbn">0</b><span class="gcbx" id="g-cbx"></span><div class="gcbt"><i id="g-cbt"></i></div><div class="gcbg"><i id="g-cbg"></i><u></u><u></u><u></u></div></div><div class="gults" id="g-ults" hidden>'+[1,2,3,4].map(function(i){return '<button class="gult" data-act="gult" data-l="'+i+'"><span>'+G_ULT[i-1][1]+'</span><b>'+G_USH[i-1]+'</b><em class="gcdt"></em></button>';}).join('')+'</div><div class="gtaph" id="g-taph">화면을 톡톡 눌러봐! 👆</div>';}
function gFxEnsure(){
  var hw=$('g-hw'),a=$('g-arena');
  if(hw&&!hw.querySelector('.gfist'))hw.insertAdjacentHTML('beforeend','<div class="gfist"></div><div class="gflB"></div><div class="gflF"></div><div class="gflE"></div>');
  if(a&&!$('g-burn'))a.insertAdjacentHTML('beforeend','<div class="gburn" id="g-burn"><span class="fb"></span><span class="ft"></span><span class="fl"></span><span class="fr"></span></div>');
}
function gCbUi(g){
  gFxEnsure();
  var hw0=$('g-hw'),ar0=$('g-arena'),n0=gCb.n;
  if(hw0){hw0.classList.toggle('gcmo',n0>0);hw0.style.setProperty('--cb',Math.min(n0,50));hw0.classList.toggle('gfi',n0>=20);hw0.style.setProperty('--fs',(0.7+0.15*Math.floor(Math.min(n0,100)/20)).toFixed(2));hw0.classList.toggle('gmx',n0>=100);}
  if(ar0){ar0.classList.toggle('gblz',n0>=50);ar0.classList.toggle('gmx',n0>=100);}
  var cb=$('g-cb');if(!cb)return;
  var n=gCb.n,T=gCbT(g),lv=gCbLvl(g);
  cb.hidden=n<=0;
  if(n>0){var b=$('g-cbn');if(b.textContent!==String(n))b.textContent=n;cb.dataset.t=gCbTier(n);cb.dataset.l=lv;$('g-cbx').textContent='공격 +'+Math.round(gCbPer(g)*n*100)+'%';$('g-cbg').style.width=Math.min(100,n/(3*T)*100)+'%';}
  var bt=$('g-cbt');
  if(bt&&n>0){var keep=gCbKeep(g)*1000;
    if(gWalking(g)){if(bt.dataset.k!=='w'){bt.dataset.k='w';bt.style.transition='none';bt.style.width='100%';}}
    else{var kk=gCb.t+'|'+keep;if(bt.dataset.k!==kk){bt.dataset.k=kk;var rem=Math.max(0,keep-(Date.now()-gCb.t));bt.style.transition='none';bt.style.width=Math.min(100,rem/keep*100)+'%';void bt.offsetWidth;bt.style.transition='width '+rem+'ms linear';bt.style.width='0%';}}
  }else if(bt)bt.dataset.k='';
  var us=$('g-ults');
  if(us){var now0=Date.now(),pick=-1,pickRdy=-1,k0;
    for(k0=3;k0>=0;k0--){if(n>=gUNeed(g,k0)){if(pick<0)pick=k0;if(pickRdy<0&&gUcd[k0]<=now0)pickRdy=k0;}}
    var sel=pickRdy>=0?pickRdy:pick;
    var showU=!gSm&&!gWalking(g)&&sel>=0;us.hidden=!showU;
    if(showU){var bs=us.children;
      for(k0=0;k0<4;k0++)bs[k0].hidden=k0!==sel;
      var bb=bs[sel],cdl=Math.max(0,gUcd[sel]-now0),st=cdl>0?'cd':'rdy',tx=cdl>0?Math.ceil(cdl/1000)+'s':'';
      if(bb.dataset.s!==st)bb.dataset.s=st;var em=bb.lastChild;if(em.textContent!==tx)em.textContent=tx;}
  }
  var th=$('g-taph');if(th)th.hidden=gSm||gCb.cnt>=6||n>0;
}
function gCbTick(g,now,failed){
  if(failed&&gCb.n)gCb.n=0;
  if(gWalking(g))gCb.t=now;
  else if(gCb.n>0&&now-gCb.t>gCbKeep(g)*1000)gCb.n=0;
  gCbUi(g);
}
function gApplyDmg(g,dmg){
  if(typeof gGold!=='undefined'&&gGold&&gGold.end){gGoldHit(g,dmg);return;}
  if(g.farm){var n=Math.max(1,g.stage-1);g.hearts+=gKill(g,n)*Math.min(1,dmg/gHp(n));
    var sh0=gShown(g);gFarmS=(gFarmS||Date.now())-dmg/gDps(g)*1000;
    var hp0=$('g-hp');if(hp0)hp0.style.width=Math.max(0,Math.min(100,gFrac(g,Date.now())*100))+'%';return;}
  if(!(g.hp>0))g.hp=gHp(g.stage);
  var e=gDps(g)*1e-6;g.hp=Math.max(e,g.hp-dmg);
  var hp=$('g-hp');if(hp)hp.style.width=Math.max(0,Math.min(100,gFrac(g,Date.now())*100))+'%';
  if(g.hp<=e*1.01)gTick();
}
function gRmLater(el,ms){setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},ms);}
function gFxSparks(f,mr,fr,k,tier){
  if(gRM())return;
  var em=['✨','⭐','💗','🌈','💥'];
  for(var i=0;i<k;i++){var s=document.createElement('span');s.className='gfxsp';s.textContent=em[Math.min(4,Math.floor(Math.random()*(1+tier)))];
    s.style.left=(mr.left-fr.left+mr.width*(.3+Math.random()*.4))+'px';s.style.top=(mr.top-fr.top+mr.height*(.25+Math.random()*.4))+'px';
    var a=Math.random()*6.283,d=26+Math.random()*(30+tier*14);
    s.style.setProperty('--dx',Math.round(Math.cos(a)*d)+'px');s.style.setProperty('--dy',Math.round(Math.sin(a)*d-14)+'px');
    f.appendChild(s);gRmLater(s,650);}
}
function gShake(big){
  if(gRM())return;var a=$('g-arena');if(!a)return;
  a.classList.remove('gshk','gshk2');void a.offsetWidth;a.classList.add(big?'gshk2':'gshk');
}
function gHitFx(g,dmg){
  var f=$('g-field'),m=$('g-mon');if(!f||!m)return;
  var fr=f.getBoundingClientRect(),mr=m.getBoundingClientRect(),tier=gCbTier(gCb.n);
  var mi=m.querySelector('.gmi');if(mi){mi.classList.remove('gh');void mi.offsetWidth;mi.classList.add('gh');}
  if(f.querySelectorAll('.gtd').length<9){
    var s=document.createElement('span');s.className='gtd t'+tier;s.textContent=gFmt(dmg);
    s.style.left=(mr.left-fr.left+mr.width*(.15+Math.random()*.5))+'px';s.style.top=(mr.top-fr.top+mr.height*(.05+Math.random()*.35))+'px';
    s.style.setProperty('--dx',Math.round((Math.random()-.5)*46)+'px');
    f.appendChild(s);gRmLater(s,720);
  }
  gFxSparks(f,mr,fr,1+tier,tier);
  if(tier>=2||gCb.n%6===0)gShake(false);
  var T=gCbT(g),n=gCb.n;
  if(n===T||n===2*T||n===3*T){gSfx('gauge');gVib([14,20,30]);}
  else if(n===10||n===25||n===50||n===100){gSfx('cbm');gVib([20,20,20]);}
  else{gSfx('hit');gVib(5);}
}
function gTap(){
  var g=gS;if(!g||nav.tab!=='game'||gSm||!$('g-field')||gWalking(g))return;
  var now=Date.now();
  if(gCb.n>0&&now-gCb.t>gCbKeep(g)*1000)gCb.n=0;
  gCb.n=Math.min(100,gCb.n+1);gCb.t=now;gCb.cnt++;
  var dmg=gAtk(g)*(1+gCbPer(g)*gCb.n);
  gApplyDmg(g,dmg);
  gHitFx(g,dmg);
  gCbUi(g);
  var b=$('g-cbn');if(b){b.classList.remove('pp');void b.offsetWidth;b.classList.add('pp');}
  gPunch();
}
var gPnT=0;
function gPunch(){
  var hr=$('g-hero'),hw=$('g-hw');if(!hr||!hw)return;
  hr.classList.remove('gpn');hw.classList.remove('gpn');void hr.offsetWidth;hr.classList.add('gpn');hw.classList.add('gpn');
  var fi=hw.querySelector('.gfist');if(fi){fi.classList.remove('gpl');void fi.offsetWidth;fi.classList.add('gpl');}
  clearTimeout(gPnT);gPnT=setTimeout(function(){var h=$('g-hero'),w=$('g-hw');if(h)h.classList.remove('gpn');if(w)w.classList.remove('gpn');},260);
}
var G_ULTL=[['하트 빔~! 💗','사랑을 담아서!','두근두근 빔!'],['별똥별이다! ☄️','소원을 빌어봐!','반짝반짝 소나기!'],['사랑이 최고~!! 🌈','모두 힘내라 얍!!','우리 모두 반짝반짝!'],['다 같이 가자~!','우리는 함께야!','친구들, 힘을 빌려줘!']];
var gUltBusy=0,gUcd=[0,0,0,0];
function gUltGeo(){
  var a=$('g-arena'),h=$('g-hero'),m=$('g-mon');if(!a||!h||!m)return null;
  var ar=a.getBoundingClientRect(),hr=h.getBoundingClientRect(),mr=m.getBoundingClientRect();
  return {aw:ar.width,ah:ar.height,fx:hr.left+hr.width*.82-ar.left,fy:hr.top+hr.height*.52-ar.top,tx:mr.left+mr.width*.42-ar.left,ty:mr.top+mr.height*.55-ar.top};
}
function gU4Html(g,d,ln,gm,a,sp){
  var ar=a.getBoundingClientRect(),bh=a.offsetHeight*.33,h='<i class="uv"></i><i class="uray"></i>',cps=[],hw=$('g-hw'),hr=$('g-hero');
  function R(el){var r=el.getBoundingClientRect();return {x:r.left-ar.left,y:r.top-ar.top,w:r.width,h:r.height};}
  var band='<div class="ufp" style="--bh:'+bh+'px;left:'+Math.round(a.offsetWidth*.56-1.44*bh)+'px;background-image:url('+sp+')"></div>';
  var order=['veh','gnd','sky'],pos={veh:'0%',gnd:'21%',sky:'10%'};
  if(hw)order.forEach(function(c,i){var el=hw.querySelector('.gcp.'+c);if(!el)return;cps.push({c:c,src:el.src,r:R(el)});band+='<img class="ufc '+c+'" alt="" src="'+el.src+'" style="left:'+pos[c]+';animation-delay:'+(120+i*110)+'ms">';});
  h+='<div class="uface">'+band+'<b>'+d[1]+'</b></div>';
  var tx=gm.tx,ty=gm.ty,sky=null,dsh={veh:[1100,520],gnd:[1350,520]};
  h+='<div class="u4w">';
  cps.forEach(function(o){
    if(o.c==='sky'){sky=o;return;}
    var cx=o.r.x+o.r.w/2,cy=o.r.y+o.r.h/2,dl=dsh[o.c][0],du=dsh[o.c][1];
    h+='<img class="u4c" alt="" src="'+o.src+'" style="left:'+Math.round(o.r.x)+'px;top:'+Math.round(o.r.y)+'px;width:'+Math.round(o.r.w)+'px;height:'+Math.round(o.r.h)+'px;--dx:'+Math.round(tx-cx-o.r.w*.15)+'px;--dy:'+Math.round(ty-cy)+'px;--dl:'+dl+'ms;--du:'+du+'ms">';
    h+='<span class="u4b" style="left:'+Math.round(tx-18)+'px;top:'+Math.round(ty-30+(o.c==='veh'?0:14))+'px;animation-delay:'+(dl+du)+'ms">'+(o.c==='veh'?'💥':'✨')+'</span>';
  });
  if(hr){
    var hh=R(hr),hcx=hh.x+hh.w/2,hcy=hh.y+hh.h/2,rise=Math.round(hh.h*1.5);
    h+='<div class="u4g" style="--rise:'+rise+'px;--dx:'+Math.round(tx-hcx-hh.w*.2)+'px;--dy:'+Math.round(ty-hcy)+'px">';
    if(sky){var sx=Math.round(hcx-sky.r.w/2-sky.r.x),sy=Math.round(hh.y+hh.h*.5-sky.r.h-sky.r.y);
      h+='<img class="u4k" alt="" src="'+sky.src+'" style="left:'+Math.round(sky.r.x)+'px;top:'+Math.round(sky.r.y)+'px;width:'+Math.round(sky.r.w)+'px;height:'+Math.round(sky.r.h)+'px;--sx:'+sx+'px;--sy:'+sy+'px">';}
    h+='<div class="u4h" style="left:'+Math.round(hh.x)+'px;top:'+Math.round(hh.y)+'px;width:'+Math.round(hh.w)+'px;height:'+Math.round(hh.h)+'px;background-image:url('+sp+')"></div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<span class="u4b big" style="left:'+Math.round(tx-30)+'px;top:'+Math.round(ty-50)+'px;animation-delay:3710ms">💥</span>';
  h+='<div class="u4slw"><i class="u4sl"></i></div><div class="u4slw s2"><i class="u4sl"></i></div>';
  return h+'<b class="unm">'+d[1]+' '+d[2]+'!!</b><em class="uln">'+ln+'</em><i class="ufl"></i>';
}
function gUltHtml(lv,d,ln,g,gm,a){
  var fr=gFront(g.evo),h='<i class="uv"></i><i class="uray"></i>',sp=SPR_S[gFormLv(g)]||'';
  if(lv===4)return gU4Html(g,d,ln,gm,a,sp);
  if(lv===1){
    var bh=a.offsetHeight*.33;
    h+='<div class="uface"><div class="ufp" style="--bh:'+bh+'px;left:'+Math.round(a.offsetWidth*.56-1.44*bh)+'px;background-image:url('+sp+')"></div><b>'+d[1]+'</b></div>';
  }else{
    h+='<div class="uface"><img class="ufi" alt="" src="'+fr+'"><b>'+d[1]+'</b></div>'+'<div class="ugh"><img alt="" src="'+fr+'"></div><div class="ugh g2"><img alt="" src="'+fr+'"></div><div class="ugh g3"><img alt="" src="'+fr+'"></div>';
  }
  if(lv===1&&gm){
    var dx=gm.tx-gm.fx,dy=gm.ty-gm.fy,len=Math.round(Math.sqrt(dx*dx+dy*dy)),ang=Math.atan2(dy,dx)*180/Math.PI;
    h+='<div class="ubeam" style="left:'+Math.round(gm.fx)+'px;top:'+Math.round(gm.fy)+'px;--ang:'+ang.toFixed(1)+'deg;--len:'+len+'px"><i></i></div><div class="uhrt" style="left:'+Math.round(gm.fx)+'px;top:'+Math.round(gm.fy)+'px;--ang:'+ang.toFixed(1)+'deg;--len:'+len+'px"><b>💗</b></div>';
  }
  if(lv===2&&gm){
    for(var i=0;i<18;i++){
      var big=i<7,ex=gm.tx+(Math.random()-.5)*Math.max(60,gm.aw*.34),ey=gm.ty+(Math.random()-.5)*50,sx=ex+60+Math.random()*140,sy=-50-Math.random()*40,dl=900+Math.random()*560;
      h+='<span class="ust" style="left:'+Math.round(sx)+'px;top:'+Math.round(sy)+'px;font-size:'+(big?38+Math.round(Math.random()*16):20+Math.round(Math.random()*8))+'px;--dx:'+Math.round(ex-sx)+'px;--dy:'+Math.round(ey-sy)+'px;animation-delay:'+Math.round(dl)+'ms">'+(big?'☄️':'⭐')+'</span>';
      h+='<span class="usb" style="left:'+Math.round(ex-14)+'px;top:'+Math.round(ey-14)+'px;animation-delay:'+Math.round(dl+420)+'ms">'+(big?'💥':'✨')+'</span>';
    }
  }
  if(lv===3){
    var cols=['#ff4d6d','#ff9a3c','#ffe14d','#5ee08a','#4db8ff','#6a7dff','#b86dff'],ps='';
    cols.forEach(function(c,i){ps+='<path pathLength="100" d="M '+(-4+i*1.5)+' 64 C '+(18+i*.8)+' '+(-12+i*4.2)+', '+(82-i*.8)+' '+(-12+i*4.2)+', '+(104-i*1.5)+' 64" stroke="'+c+'"/>';});
    h+='<svg class="urb" viewBox="0 0 100 60" preserveAspectRatio="none">'+ps+'</svg>';
  }
  return h+'<b class="unm">'+d[1]+' '+d[2]+'!</b><em class="uln">'+ln+'</em><i class="ufl"></i>';
}
function gUltFire(lv){
  var g=gS;if(!g||gSm||gWalking(g)||gUltBusy)return;
  lv=lv|0;if(lv<1||lv>4)return;
  var now0=Date.now();if(gUcd[lv-1]>now0||gCb.n<gUNeed(g,lv-1))return;
  var d=G_ULT[lv-1],n=gCb.n,dmg=gDps(g)*d[0]*(1+gCbPer(g)*n)*gUlt(g);
  gCb.n=0;gCb.t=now0;gUltBusy=1;gUcd[lv-1]=now0+G_UCD[lv-1]*1000;
  var P=[null,{delay:1350,life:2300,gst:0,fdur:750},{delay:1500,life:2500,gst:650,fdur:900,gd:300},{delay:1850,life:2900,gst:750,fdur:1000,gd:300},{delay:3710,life:6300,gst:0,fdur:1050}][lv];
  var delay=P.delay,life=P.life;
  var a=$('g-arena'),gm=gUltGeo();
  if(a&&gm){var el=document.createElement('div');el.className='gufx l'+lv;
    el.style.setProperty('--d',delay+'ms');el.style.setProperty('--t',life+'ms');el.style.setProperty('--gst',P.gst+'ms');el.style.setProperty('--gdur',(P.gd||300)+'ms');el.style.setProperty('--fs',P.fdur+'ms');el.style.setProperty('--aw',gm.aw+'px');el.style.setProperty('--rs','1000ms');
    var ln=G_ULTL[lv-1][Math.floor(Math.random()*3)];
    el.innerHTML=gUltHtml(lv,d,ln,g,gm,a);
    a.appendChild(el);gRmLater(el,life);
    if(lv===1){var hw=$('g-hw'),hr=$('g-hero');if(hw&&hr&&!gRM()){hw.classList.remove('gpn');hr.classList.remove('gpn');void hw.offsetWidth;hw.classList.add('gbow');hr.classList.add('gbow');setTimeout(function(){var w=$('g-hw'),h=$('g-hero');if(w)w.classList.remove('gbow');if(h)h.classList.remove('gbow');},1000);}}
    if(lv===4&&!gRM()){a.classList.add('gu4h');setTimeout(function(){var a2=$('g-arena');if(a2)a2.classList.remove('gu4h');},3780);
      [1620,1870].forEach(function(t){setTimeout(function(){var f=$('g-field'),m=$('g-mon');if(!f||!m||gS===null)return;var fr=f.getBoundingClientRect();gFxSparks(f,m.getBoundingClientRect(),fr,12,3);gShake(false);gVib(40);},t);});}
    if(lv===3)setTimeout(function(){var f=$('g-field'),m=$('g-mon');if(!f||!m||gS===null)return;var fr=f.getBoundingClientRect();gFxSparks(f,{left:fr.left+fr.width*.2,top:fr.top-40,width:fr.width*.6,height:fr.height*.6},fr,26,4);gShake(true);gSfx('u3');},1800);
  }
  gSfx('u'+lv);gVib([30,20,60,30,90]);
  setTimeout(function(){
    gUltBusy=0;var g2=gS;if(!g2||nav.tab!=='game')return;
    gApplyDmg(g2,dmg);
    var f=$('g-field'),m=$('g-mon');
    if(f&&m){var fr=f.getBoundingClientRect(),mr=m.getBoundingClientRect();
      var s=document.createElement('span');s.className='gtd big l'+lv;s.textContent=gFmt(dmg)+'!';
      s.style.left=(mr.left-fr.left+mr.width*.1)+'px';s.style.top=(mr.top-fr.top-6)+'px';s.style.setProperty('--dx','0px');
      f.appendChild(s);gRmLater(s,1100);
      gFxSparks(f,mr,fr,[10,18,28,36][lv-1],4);
      var mi=m.querySelector('.gmi');if(mi){mi.classList.remove('gh');void mi.offsetWidth;mi.classList.add('gh');}}
    gShake(true);gVib([60,30,120]);
    gCbUi(g2);
  },delay);
  gCbUi(g);
}
document.addEventListener('pointerdown',function(e){
  var t=e.target;if(!t||!t.closest)return;
  if(!t.closest('#g-field')||t.closest('button'))return;
  gTap();
},true);
G_SFX.hit=function(){var n=Math.min(100,gCb.n);gTn(380+n*8,0,.05,'square',.05,520+n*8);};
G_SFX.gauge=function(){gTn(880,0,.08,'triangle',.1);gTn(1319,.07,.16,'triangle',.1);};
G_SFX.cbm=function(){[659,784,988].forEach(function(f,i){gTn(f,i*.05,.12,'square',.07);});};
G_SFX.u1=function(){gTn(300,0,.3,'sawtooth',.09,900);gTn(1200,.3,.25,'triangle',.12);};
G_SFX.u2=function(){for(var i=0;i<6;i++)gTn(1800-i*200,i*.06,.18,'triangle',.1);gTn(180,.5,.4,'sawtooth',.14,60);};
G_SFX.u4=function(){[392,523,659,784].forEach(function(f,i){gTn(f,i*.1,.2,'square',.09);});gTn(200,1.1,.5,'sawtooth',.1,700);gTn(1500,2.15,.5,'triangle',.14,200);gTn(90,2.2,.7,'sawtooth',.18,40);};
G_SFX.u3=function(){[523,659,784,1047,1319,1568].forEach(function(f,i){gTn(f,i*.07,.3,'triangle',.12);});gTn(120,.7,.7,'sawtooth',.16,40);gTn(2093,.8,.6,'sine',.09);};

/* ===== v78: 황금 몬스터 ===== */
var gGold=null;
var G_GOLD=G_DATA.gold;
function gGoldPre(g,dt,now){
  var G=gGold;if(!G)return false;
  if(g.farm||g.stage!==G.n||g.stage%10===0){gGold=null;gGoldClear();return false;}
  if(g.dlyLeft>0){g.dlyLeft=Math.max(0,g.dlyLeft-dt);return true;}
  if(!G.end)G.end=now+G_GOLD.T;
  G.hp-=gDps(g)*dt;
  if(G.hp<=0){gGoldKill(g);return true;}
  if(now>=G.end){gGoldFlee(g);}
  return true;
}
function gGoldPost(g,pst,pf,now){
  if(gGold||pf||g.farm||g.stage<=pst||g.stage%10===0||gUltBusy)return;
  if(Math.random()>=G_GOLD.P)return;
  var mx=G_GOLD.HP*gHp(g.stage);gGold={n:g.stage,hp:mx,max:mx,end:0};
  gGoldBanner('✨ 황금 몬스터 출현! ✨','10초 안에 잡아봐!');gSfx('gold');
}
function gGoldHit(g,dmg){
  var G=gGold;if(!G)return;G.hp-=dmg;
  var hp=$('g-hp');if(hp)hp.style.width=Math.max(0,Math.min(100,gQuant(G.hp/G.max,G.max,g)*100))+'%';
  if(G.hp<=0)gGoldKill(g);
}
function gGoldUi(g,now){
  var m=$('g-mon'),G=gGold;
  if(m&&m.classList.contains('gold')!==!!G)m.classList.toggle('gold',!!G);
  var bt=$('g-bt');
  if(!G){if(bt&&bt.classList.contains('gld'))bt.classList.remove('gld');return false;}
  if(bt){bt.hidden=false;bt.classList.add('gld');var f=G.end?Math.max(0,(G.end-now)/G_GOLD.T):1;$('g-bti').style.width=(f*100)+'%';}
  return true;
}
function gGoldClear(){var m=$('g-mon');if(m)m.classList.remove('gold');var bt=$('g-bt');if(bt){bt.classList.remove('gld');var g=gS;if(g)bt.hidden=!(gShown(g)%10===0&&!g.farm);}}
function gGoldBanner(t,sub){
  var a=$('g-arena');if(!a)return;var el=document.createElement('div');el.className='gbn gold';
  el.innerHTML='<b>'+t+'</b><small>'+sub+'</small>';a.appendChild(el);gRmLater(el,1900);
}
function gGoldKill(g){
  var G=gGold;gGold=null;
  var h=gKill(g,G.n)*G_GOLD.HR,r=1+(Math.random()<.5?1:0);
  g.hearts+=h;g.rubies=(g.rubies||0)+r;g.ch=(g.ch||0)+h;
  var f=$('g-field'),m=$('g-mon');
  if(f&&m){var fr=f.getBoundingClientRect(),mr=m.getBoundingClientRect();
    gFxSparks(f,mr,fr,36,4);
    var s=document.createElement('span');s.className='gtd big l3';s.innerHTML='+'+gFmt(h)+' 💗';
    s.style.left=(mr.left-fr.left-10)+'px';s.style.top=(mr.top-fr.top-8)+'px';s.style.setProperty('--dx','0px');f.appendChild(s);gRmLater(s,1200);}
  gGoldBanner('🌟 황금 몬스터 처치! 🌟','+'+gFmt(h)+' 💗  +'+r+' 💎');
  gShake(true);gSfx('goldk');gVib([50,30,120]);gGoldClear();
  var hp=$('g-hp');if(hp)hp.style.width='100%';
}
function gGoldFlee(g){
  gGold=null;toast('황금 몬스터가 도망갔어… 😢');gSfx('fail');gGoldClear();
}
G_SFX.gold=function(){[880,1175,1568,2093].forEach(function(f,i){gTn(f,i*.08,.2,'triangle',.11);});};
G_SFX.goldk=function(){[659,880,1175,1568,2093,2637].forEach(function(f,i){gTn(f,i*.06,.25,'square',.08);});gTn(130,.3,.5,'sawtooth',.12,50);};

/* ===== v78: 보스 등장 / 처치 연출 ===== */
function gBossWarn(n){
  var a=$('g-arena');if(!a||gRM())return;
  var king=n%100===0,el=document.createElement('div');el.className='gbw'+(king?' king':'');
  el.innerHTML='<i class="gbwv"></i><i class="gbwb t"></i><i class="gbwb b"></i><b>⚠ WARNING ⚠</b><em>'+(king?'👑 KING BOSS 출현!! 👑':'보스가 나타났다!')+'</em>';
  a.appendChild(el);gRmLater(el,king?2300:1900);gVib([80,40,80]);
  if(king)gShake(false);
}
function gBossClear(n){
  var a=$('g-arena'),f=$('g-field'),m=$('g-mon');if(!a||!f||!m)return;
  var king=n%100===0,fr=f.getBoundingClientRect(),mr=m.getBoundingClientRect();
  if(!gRM()){
    var el=document.createElement('div');el.className='gbc'+(king?' king':'');
    el.style.setProperty('--cx',(mr.left-fr.left+mr.width*.5)+'px');el.style.setProperty('--cy',(mr.top-fr.top+mr.height*.5)+'px');
    el.innerHTML='<i class="gbf"></i><i class="gbr"></i><i class="gbr r2"></i><b>'+(king?'👑 KING CLEAR! 👑':'BOSS CLEAR!')+'</b>';
    f.appendChild(el);gRmLater(el,2000);
    gFxSparks(f,mr,fr,king?70:44,4);
    [200,420,650].forEach(function(t,i){setTimeout(function(){var f2=$('g-field'),m2=$('g-mon');if(!f2||!m2)return;gFxSparks(f2,{left:mr.left+(i-1)*34,top:mr.top-10-i*10,width:mr.width,height:mr.height},f2.getBoundingClientRect(),king?30:20,4);},t);});
    a.classList.remove('gbslow');void a.offsetWidth;a.classList.add('gbslow');setTimeout(function(){var a2=$('g-arena');if(a2)a2.classList.remove('gbslow');},1100);
  }
  gShake(true);gVib(king?[80,40,120,40,200]:[60,30,120]);gSfx('bclr');
}
G_SFX.bclr=function(){[392,523,659,784,1047].forEach(function(f,i){gTn(f,i*.09,.22,'square',.09);});gTn(1568,.5,.5,'triangle',.12);gTn(100,.05,.6,'sawtooth',.16,40);};
