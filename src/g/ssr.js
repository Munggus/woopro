/* ===== SSR 연출 ===== */
function gSsrShow(key,name,done,o){o=o||{};gSfx('ssr');
  var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(reduce){done();return;}
  var old=document.getElementById('ssr');if(old&&old.parentNode)old.parentNode.removeChild(old);
  var el=document.createElement('div');el.className='ssr';el.id='ssr';
  var cf='',E=['💗','✨','⭐','💖','🌟','🎀'];
  for(var i=0;i<34;i++){var a=Math.random()*Math.PI*2,d=(26+Math.random()*34),vm=Math.min(window.innerWidth,window.innerHeight)/100;
    cf+='<span style="--dx:'+Math.round(Math.cos(a)*d*vm*1.1)+'px;--dy:'+Math.round(Math.sin(a)*d*vm*1.1)+'px;--rt:'+Math.round(Math.random()*360-180)+'deg;animation-delay:'+(Math.random()*.25)+'s;font-size:'+(18+Math.random()*20)+'px">'+E[i%E.length]+'</span>';}
  var src=o.src||MAS[key]||'';
  el.innerHTML='<div class="ssr-vig"></div><div class="ssr-rays"></div><div class="ssr-rays r2"></div><div class="ssr-glow"></div><img class="ssr-sil" src="'+src+'" alt=""><div class="ssr-flash"></div><div class="ssr-ring"></div><div class="ssr-ring b"></div><img class="ssr-hero" src="'+src+'" alt=""><div class="ssr-conf">'+cf+'</div><div class="ssr-t">'+(o.t||'SSR')+'</div><div class="ssr-n">'+name+(o.sub?'<br><small style="font-size:.6em;opacity:.95">'+o.sub+'</small>':'')+'</div><div class="ssr-h">화면을 눌러서 계속</div><div class="ssr-sk">건너뛰기 ▶</div>';
  document.body.appendChild(el);
  var T=[],fin=false;
  function end(){if(fin)return;fin=true;T.forEach(clearTimeout);el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},300);done();}
  T.push(setTimeout(function(){el.classList.add('pop');try{navigator.vibrate&&navigator.vibrate([80,40,80,40,200]);}catch(e){}},2300));
  el.addEventListener('click',function(){end();});
}
