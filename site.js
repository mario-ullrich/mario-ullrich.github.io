/* Shared behaviour for every page of the site.
   Each page defines its own DE translation table in an inline script
   before loading this file. */

/* Load MathJax only on pages that actually contain TeX math, so math-free
   pages never download the (~1 MB) library. We scan the page text for the
   inline and display math delimiters (backslash-paren and backslash-bracket),
   ignoring <script> contents so this check can't match its own source.
   tex-chtml is MathJax's minimal bundle: TeX input and HTML output, no
   MathML input, which is all this site uses. */
(function () {
  if (!document.body) return;
  var content = document.body.innerHTML.replace(/<script[\s\S]*?<\/script>/gi, '');
  if (content.indexOf('\\(') === -1 && content.indexOf('\\[') === -1) return;
  window.MathJax = {
    tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
    options: { skipHtmlTags: ['script', 'style', 'textarea', 'pre', 'code'] }
  };
  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml.min.js';
  s.id = 'MathJax-script';
  s.async = true;
  document.head.appendChild(s);
})();

/* Visitor statistics via GoatCounter (https://www.goatcounter.com).
   It sets no cookies and stores no personal data, so the site needs no
   consent banner. GOATCOUNTER_CODE is the account name registered there,
   i.e. the first part of <code>.goatcounter.com; setting it to an empty
   string switches the counter off everywhere. The counter script ignores
   localhost, so previewing the site does not appear in the statistics. */
(function () {
  var GOATCOUNTER_CODE = 'mario-ullrich';
  if (!GOATCOUNTER_CODE) return;
  var s = document.createElement('script');
  s.src = 'https://gc.zgo.at/count.js';
  s.async = true;
  s.setAttribute('data-goatcounter',
                 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count');
  document.head.appendChild(s);
})();

/* Live pictures of the dependency graphs on the Lean page. Each a.depgraph
   links to a blueprint's dep_graph_document.html, which carries its graph as
   Graphviz source inside .renderDot(`...`). We fetch that page, cut out the
   source and lay it out with the Graphviz the blueprint itself ships
   (js/hpcc.min.js with js/graphvizlib.wasm), so the picture always shows the
   graph as currently published, laid out exactly as on the full page. The
   library (about 1.2 MB, shared with the full page and cached) is fetched
   only once a picture comes near the viewport. The links start hidden, so
   without JavaScript, or if anything fails, the picture simply stays away. */
(function () {
  var pics = document.querySelectorAll('a.depgraph');
  if (!pics.length || !window.fetch || !window.Promise || !window.IntersectionObserver) return;
  /* the library, as a promise, taken from the blueprint of the first picture;
     after a failure it is fetched afresh from the next picture's blueprint */
  var lib = null;
  function loadGraphviz(base) {
    if (!lib) lib = new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = base + 'js/hpcc.min.js';
      s.onload = function () {
        var w = window['@hpcc-js/wasm'];
        if (!w) return fail();
        w.wasmFolder(base + 'js');
        ok(w.graphviz);
      };
      s.onerror = fail;
      document.head.appendChild(s);
    });
    return lib;
  }
  function draw(a) {
    var base = a.href.replace(/[^\/]*$/, '');
    var page = fetch(a.href).then(function (r) { return r.ok ? r.text() : Promise.reject(); });
    return Promise.all([page, loadGraphviz(base)]).then(function (res) {
      var m = res[0].match(/\.renderDot\(`([\s\S]*?)`\)/);
      if (!m) throw new Error('no graph');
      return res[1].layout(m[1], 'svg', 'dot');
    }).then(function (svg) {
      var box = a.querySelector('.depgraph-pic');
      box.innerHTML = svg.slice(svg.indexOf('<svg'));
      var el = box.querySelector('svg');
      el.removeAttribute('width');
      el.removeAttribute('height');
      /* the ids would repeat between the two pictures; the tooltips of the
         graph, the clusters and the edges are noise, those of the nodes
         name the result under the pointer */
      el.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
      el.querySelectorAll('g.graph > title, g.cluster > title, g.edge > title').forEach(function (t) { t.remove(); });
      requestAnimationFrame(function () { a.classList.add('ready'); });
    }).catch(function () { a.hidden = true; lib = null; });
  }
  /* one picture after the other, so that the library is fetched only once,
     and a blueprint that cannot be reached costs only its own picture */
  var queue = Promise.resolve();
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      seen.unobserve(e.target);
      queue = queue.then(function () { return draw(e.target); });
    });
  }, { rootMargin: '400px 0px' });
  pics.forEach(function (a) { a.hidden = false; seen.observe(a); });
})();

  var yrEl=document.getElementById('yr'); if(yrEl) yrEl.textContent=new Date().getFullYear();
  var DE = window.DE || {};
  var EN={};
  document.querySelectorAll('[data-i18n]').forEach(function(el){EN[el.getAttribute('data-i18n')]=el.innerHTML;});
  function getLang(){
    var p=new URLSearchParams(location.search).get('lang');
    if(p==='de'||p==='en')return p;
    try{var s=localStorage.getItem('lang');if(s)return s;}catch(e){}
    return 'en';
  }
  function setLang(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      var v=(l==='de'?(DE[k]!=null?DE[k]:EN[k]):EN[k]);
      if(v!=null)el.innerHTML=v;
    });
    document.documentElement.lang=l;
    document.querySelectorAll('.lang-toggle button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===l);});
    try{localStorage.setItem('lang',l);}catch(e){}
    try{var u=new URL(location);u.searchParams.set('lang',l);history.replaceState(null,'',u);}catch(e){}
    document.querySelectorAll('.nav-links a, a.brand').forEach(function(a){
      var h=a.getAttribute('href'); if(!h) return; var base=h.split('?')[0];
      if(/\.html$/.test(base)) a.setAttribute('href', base+'?lang='+l);
    });
    if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise();
  }
  document.querySelectorAll('.lang-toggle button').forEach(function(b){
    b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));});
  });
  setLang(getLang());

  var toggle=document.querySelector('.nav-toggle'),links=document.querySelector('.nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',function(){links.classList.toggle('open');});
    links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open');});});
  }

  var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  var path=(location.pathname.split('/').pop()||'index.html'); if(path==='')path='index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a){
    if(a.getAttribute('href').split('?')[0]===path)a.classList.add('active');
  });

  /* random point-set background, regenerated every load */
  (function(){
    var ns='http://www.w3.org/2000/svg';
    document.querySelectorAll('.hero-bg svg, .page-bg svg').forEach(function(svg){
      while(svg.firstChild)svg.removeChild(svg.firstChild);
      for(var i=0;i<74;i++){
        var c=document.createElementNS(ns,'circle');
        c.setAttribute('cx',(Math.random()*100).toFixed(2));
        c.setAttribute('cy',(Math.random()*100).toFixed(2));
        c.setAttribute('r',(0.3+Math.random()*0.55).toFixed(2));
        svg.appendChild(c);
      }
    });
  })();

  document.querySelectorAll('a.email').forEach(function(a){try{var e=atob(a.getAttribute('data-eml'));a.setAttribute('href','mailto:'+e);if(!a.textContent.trim())a.textContent=e;}catch(x){}});
  document.querySelectorAll('.copy-email').forEach(function(btn){
    btn.addEventListener('click',function(){
      var a=btn.parentNode.querySelector('a.email'); var e='';
      try{e=atob(a.getAttribute('data-eml'));}catch(x){e=a?a.textContent:'';}
      var lbl=btn.textContent;
      var ok=function(){btn.textContent='Copied';btn.classList.add('copied');setTimeout(function(){btn.textContent=lbl;btn.classList.remove('copied');},1200);};
      var fb=function(){var sx=window.pageXOffset,sy=window.pageYOffset;var ta=document.createElement('textarea');ta.value=e;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;opacity:0;';document.body.appendChild(ta);ta.select();try{ta.setSelectionRange(0,e.length);}catch(x){}try{document.execCommand('copy');}catch(x){}document.body.removeChild(ta);window.scrollTo(sx,sy);ok();};
      if(navigator.clipboard&&navigator.clipboard.writeText&&window.isSecureContext){navigator.clipboard.writeText(e).then(ok,fb);}else{fb();}
    });
  });
  document.querySelectorAll('a[href]').forEach(function(a){
    var h=a.getAttribute('href')||'';
    if(/^https?:\/\//i.test(h) && a.host!==location.host){a.target='_blank';a.rel='noopener noreferrer';}
  });
