// ---- ambient particle canvas ----
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let petals = [];
  function initParticles(){
    particles = [];
    const count = Math.min(80, Math.floor((w*h)/24000));
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.6+.4,
        vy: Math.random()*.25+.05,
        tw: Math.random()*Math.PI*2,
        color: Math.random() > .5 ? '77,232,255' : '255,95,168'
      });
    }
    petals = [];
    const pcount = Math.min(22, Math.floor(w/70));
    for(let i=0;i<pcount;i++){
      petals.push({
        x: Math.random()*w, y: Math.random()*h - h,
        size: Math.random()*7+5,
        vy: Math.random()*.5+.35,
        sway: Math.random()*Math.PI*2,
        swaySpeed: Math.random()*.02+.01,
        rot: Math.random()*Math.PI*2,
        rotSpeed: (Math.random()-.5)*.03,
        hue: Math.random() > .5 ? '255,143,196' : '255,209,102'
      });
    }
  }
  initParticles();
  window.addEventListener('resize', initParticles);

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size*0.55, 0, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.hue},0.55)`;
    ctx.fill();
    ctx.restore();
  }

  function drawParticles(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.tw += 0.02;
      const alpha = 0.35 + Math.sin(p.tw)*0.25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.color},${alpha})`;
      ctx.fill();
      p.y -= p.vy;
      if(p.y < -5){ p.y = h+5; p.x = Math.random()*w; }
    });
    petals.forEach(p=>{
      p.sway += p.swaySpeed;
      p.rot += p.rotSpeed;
      p.x += Math.sin(p.sway)*0.6;
      p.y += p.vy;
      drawPetal(p);
      if(p.y > h+20){ p.y = -20; p.x = Math.random()*w; }
    });
    if(!reduceMotion) requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ---- global parallax (mouse + touch) for section scene-bg layers ----
  function setParallax(nx, ny){
    document.documentElement.style.setProperty('--mx', nx.toFixed(3));
    document.documentElement.style.setProperty('--my', ny.toFixed(3));
  }
  if(!reduceMotion){
    window.addEventListener('mousemove', (e)=>{
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax(nx, ny);
    }, { passive:true });
    window.addEventListener('touchmove', (e)=>{
      const t = e.touches[0]; if(!t) return;
      const nx = (t.clientX / window.innerWidth - 0.5) * 2;
      const ny = (t.clientY / window.innerHeight - 0.5) * 2;
      setParallax(nx, ny);
    }, { passive:true });
  }

  // ---- cursor / touch sparkle trail ----
  const trailCanvas = document.getElementById('trailCanvas');
  const tctx = trailCanvas.getContext('2d');
  let tw, th, trailParticles = [];
  function resizeTrail(){ tw = trailCanvas.width = window.innerWidth; th = trailCanvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeTrail); resizeTrail();

  function spawnTrail(x, y){
    for(let i=0;i<2;i++){
      trailParticles.push({
        x, y,
        vx:(Math.random()-.5)*1.4, vy:-Math.random()*1.6-.4,
        life:1, r:Math.random()*3+2,
        hue: Math.random() > .5 ? '255,95,168' : '77,232,255'
      });
    }
    if(trailParticles.length > 160) trailParticles.splice(0, trailParticles.length-160);
  }
  if(!reduceMotion){
    window.addEventListener('mousemove', (e)=> spawnTrail(e.clientX, e.clientY), { passive:true });
    window.addEventListener('touchmove', (e)=>{ const t=e.touches[0]; if(t) spawnTrail(t.clientX, t.clientY); }, { passive:true });
  }
  function drawTrail(){
    tctx.clearRect(0,0,tw,th);
    trailParticles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.life -= 0.022;
      tctx.beginPath();
      tctx.arc(p.x, p.y, Math.max(0,p.r*p.life), 0, Math.PI*2);
      tctx.fillStyle = `rgba(${p.hue},${Math.max(0,p.life)})`;
      tctx.shadowColor = `rgba(${p.hue},.8)`;
      tctx.shadowBlur = 8;
      tctx.fill();
    });
    trailParticles = trailParticles.filter(p=>p.life>0);
    if(!reduceMotion) requestAnimationFrame(drawTrail);
  }
  if(!reduceMotion) drawTrail();

  // ---- intro splash screen ----
  (function(){
    const nameEl = document.getElementById('introName');
    if(nameEl){
      const text = nameEl.textContent;
      nameEl.textContent = '';
      [...text].forEach((ch,i)=>{
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = reduceMotion ? '0s' : (0.35 + i*0.055) + 's';
        nameEl.appendChild(span);
      });
    }
    const intro = document.getElementById('introScreen');
    const tagline = document.getElementById('introTagline');
    const percentEl = document.getElementById('introPercent');
    const bootLines = ['INITIALIZING...', 'LOADING ASSETS...', 'CONNECTING...', 'AI SCAN...', 'RENDERING SCENE...', 'SYSTEM ONLINE...', 'Welcome, Ritik.'];
    const finishIntro = ()=>{
      document.documentElement.classList.remove('intro-lock');
      if(intro){
        intro.classList.add('intro-hide');
        setTimeout(()=> intro.remove(), 900);
      }
    };
    if(reduceMotion){
      finishIntro();
    } else {
      if(tagline){
        bootLines.forEach((line,i)=>{
          setTimeout(()=>{
            tagline.style.opacity = 0;
            setTimeout(()=>{ tagline.textContent = line; tagline.style.opacity = 1; }, 180);
          }, i*420);
        });
      }
      if(percentEl){
        const pctStart = performance.now();
        const pctDuration = 2900;
        function pctTick(now){
          const p = Math.min(1, (now - pctStart) / pctDuration);
          percentEl.textContent = Math.round(p*100) + '%';
          if(p < 1) requestAnimationFrame(pctTick);
        }
        requestAnimationFrame(pctTick);
      }
      setTimeout(finishIntro, 3100);
    }
  })();

  // ---- nav shrink/morph on scroll ----
  const navEl = document.querySelector('nav');
  function updateNavMorph(){
    if(!navEl) return;
    navEl.classList.toggle('nav-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavMorph, { passive:true });
  updateNavMorph();

  // ---- hero crossfade on scroll + mouse parallax ----
  const heroFigure = document.getElementById('heroFigure');
  const charImg2 = document.getElementById('charImg2');
  const glowRing = document.getElementById('glowRing');
  const headerEl = document.querySelector('header');

  function updateHeroCrossfade(){
    if(!headerEl) return;
    const rect = headerEl.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / (rect.height*0.7)));
    charImg2.style.opacity = progress.toFixed(2);
  }
  window.addEventListener('scroll', updateHeroCrossfade, { passive:true });
  updateHeroCrossfade();

  if(window.matchMedia('(hover: hover)').matches && !reduceMotion){
    document.addEventListener('mousemove', (e)=>{
      const cx = window.innerWidth/2, cy = window.innerHeight/2;
      const dx = (e.clientX - cx)/cx, dy = (e.clientY - cy)/cy;
      heroFigure.style.transform = `translate(${dx*14}px, ${dy*10}px)`;
      glowRing.style.transform = `translate(${-dx*10}px, ${-dy*8}px)`;
    });
  }

  // ---- companion widget ----
  const buddy = document.getElementById('buddy');
  const buddyBubble = document.getElementById('buddyBubble');
  const buddyMessages = {
    about: "That's the real me 🙂",
    skills: "Peep the skill bars 📊",
    projects: "These are my favorites 🚀",
    education: "A bit about my journey 🎓",
    contact: "Let's actually talk 💬"
  };
  const heroObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      buddy.classList.toggle('show', !e.isIntersecting);
    });
  }, { threshold: 0.15 });
  if(headerEl) heroObserver.observe(headerEl);

  const sectionObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && buddyMessages[e.target.id]){
        buddyBubble.textContent = buddyMessages[e.target.id];
      }
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('main section[id]').forEach(sec=>sectionObserver.observe(sec));

  // ---- Lenis smooth scroll + GSAP ScrollTrigger reveals (premium path) ----
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduceMotion;

  if(window.Lenis && !reduceMotion){
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    window.__lenis = lenis;
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if(hasGsap){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  if(hasGsap){
    document.documentElement.classList.add('gsap-active');
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach(el=>{
      gsap.fromTo(el, { opacity:0, y:44 }, {
        opacity:1, y:0, duration:0.95, ease:'power3.out',
        scrollTrigger:{ trigger: el, start:'top 85%', once:true }
      });
    });
    gsap.utils.toArray('.reveal-left').forEach(el=>{
      gsap.fromTo(el, { opacity:0, x:-52 }, {
        opacity:1, x:0, duration:0.9, ease:'power3.out',
        scrollTrigger:{ trigger: el, start:'top 88%', once:true }
      });
    });
    gsap.utils.toArray('.reveal-right').forEach(el=>{
      gsap.fromTo(el, { opacity:0, x:52 }, {
        opacity:1, x:0, duration:0.9, ease:'power3.out',
        scrollTrigger:{ trigger: el, start:'top 88%', once:true }
      });
    });
    gsap.utils.toArray('.reveal-scale').forEach(el=>{
      gsap.fromTo(el, { opacity:0, scale:0.86 }, {
        opacity:1, scale:1, duration:0.85, ease:'back.out(1.5)',
        scrollTrigger:{ trigger: el, start:'top 88%', once:true }
      });
    });
    gsap.utils.toArray('.skill-card, .proj-card, .info-card, .tech-cat-card').forEach((card, i)=>{
      gsap.fromTo(card, { opacity:0, y:30 }, {
        opacity:1, y:0, duration:0.7, ease:'power2.out', delay:(i % 6) * 0.06,
        scrollTrigger:{ trigger: card, start:'top 92%', once:true }
      });
    });
    gsap.utils.toArray('.bar-fill').forEach(bar=>{
      gsap.to(bar, {
        width: bar.dataset.w + '%', duration:1.2, ease:'power2.out',
        scrollTrigger:{ trigger: bar, start:'top 92%', once:true }
      });
    });

    // ---- cinematic scroll-story: layers move at different speeds as you scroll ----
    // background photography per section drifts opposite to scroll, scaled by --depth
    // (canvas particle field + glow blobs are left completely untouched)
    gsap.utils.toArray('.scene-bg').forEach(bg=>{
      if(bg.closest('.edu-section')) return; // this section's bg has no vertical bleed margin — skip to avoid gaps
      const depth = parseFloat(getComputedStyle(bg).getPropertyValue('--depth')) || 10;
      const shift = Math.min(46, Math.max(18, depth * 1.3));
      const host = bg.closest('header, section') || bg.parentElement;
      gsap.fromTo(bg, { '--sy': `-${shift}px` }, {
        '--sy': `${shift}px`, ease:'none',
        scrollTrigger:{ trigger: host, start:'top bottom', end:'bottom top', scrub:0.6 }
      });
    });

    // section eyebrow / title drift at slightly different speeds from each other
    gsap.utils.toArray('.sec-head').forEach(head=>{
      const eyebrow = head.querySelector('.sec-eyebrow');
      const title = head.querySelector('.sec-title');
      if(eyebrow){
        gsap.fromTo(eyebrow, { y:26 }, {
          y:-26, ease:'none',
          scrollTrigger:{ trigger: head, start:'top bottom', end:'bottom top', scrub:0.6 }
        });
      }
      if(title){
        gsap.fromTo(title, { y:14 }, {
          y:-14, ease:'none',
          scrollTrigger:{ trigger: head, start:'top bottom', end:'bottom top', scrub:0.9 }
        });
      }
    });

    // ---- horizontal pinned scroll: vertical scroll drives sideways motion,
    // then normal vertical scroll resumes automatically once the track ends ----
    const strengthsTrack = document.getElementById('strengthsTrack');
    const hscrollSection = document.querySelector('.hscroll-section');
    if(strengthsTrack && hscrollSection && window.matchMedia('(min-width:900px)').matches){
      const viewport = strengthsTrack.parentElement;
      gsap.to(strengthsTrack, {
        x: () => -(strengthsTrack.scrollWidth - viewport.clientWidth),
        ease:'none',
        scrollTrigger:{
          trigger: hscrollSection,
          start:'top top',
          end: () => '+=' + Math.max(300, strengthsTrack.scrollWidth - viewport.clientWidth),
          scrub:0.8,
          pin:true,
          anticipatePin:1,
          invalidateOnRefresh:true
        }
      });
    }

    // ---- scroll-driven zoom on section background photography (replaces the
    // passive kenburns loop with an active zoom tied to scroll, per section) ----
    gsap.utils.toArray('.scene-bg img').forEach(img=>{
      img.style.animation = 'none';
      gsap.fromTo(img, { scale:1.05 }, {
        scale:1.22, ease:'none',
        scrollTrigger:{
          trigger: img.closest('header, section') || img.parentElement,
          start:'top bottom', end:'bottom top', scrub:0.8
        }
      });
    });

    // ---- dramatic small → large scroll zoom on the contact illustration ----
    const contactFigureImg = document.getElementById('contactFigureImg');
    if(contactFigureImg){
      contactFigureImg.style.animation = 'none'; // replacing the passive "bob" float with scroll-tied motion
      gsap.fromTo(contactFigureImg, { scale:0.45, opacity:0.5, y:60 }, {
        scale:1.08, opacity:1, y:0, ease:'power2.out',
        scrollTrigger:{
          trigger: contactFigureImg.closest('section'),
          start:'top 85%', end:'top 25%', scrub:0.7
        }
      });
    }
  }

  // ---- scroll reveal (fallback for browsers without GSAP/network) ----
  if(!hasGsap){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in');
          e.target.querySelectorAll('.bar-fill').forEach(bar=>{
            bar.style.width = bar.dataset.w + '%';
          });
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el=>observer.observe(el));
  }

  if(reduceMotion){
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el=>{
      el.classList.add('in');
      el.querySelectorAll('.bar-fill').forEach(bar=> bar.style.width = bar.dataset.w + '%');
    });
  }

  // ---- spotlight cards: cursor-follow glow (Linear/Stripe-style) ----
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.spotlight-card').forEach(card=>{
      card.addEventListener('mousemove', (e)=>{
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--sx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--sy', `${e.clientY - rect.top}px`);
      });
    });
  }

  // ---- card physics: 3D tilt + glass glare ----
  if(!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    const tiltEls = document.querySelectorAll(
      '.skill-card, .proj-card, .tech-cat-card, .info-card, .contact-card, .insight-card'
    );
    tiltEls.forEach(card=>{
      card.classList.add('tilt-card');
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);

      card.addEventListener('mouseenter', ()=>{
        card.style.transition = 'transform .05s linear';
      });
      card.addEventListener('mousemove', (e)=>{
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y - r.height/2) / (r.height/2)) * -6;
        const ry = ((x - r.width/2) / (r.width/2)) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,.16), transparent 55%)`;
      });
      card.addEventListener('mouseleave', ()=>{
        card.style.transition = 'transform .5s cubic-bezier(.2,.8,.3,1)';
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
        glare.style.background = 'transparent';
      });
    });
  }

  // ---- tech info modal ----
  const techInfo = {
    "Python": { icon:"python", desc:"General-purpose language used for backend APIs, automation, scripting, and as the backbone of most AI/ML work." },
    "JavaScript": { icon:"javascript", desc:"The language of the web — powers interactive frontends and, via Node.js, backend services too." },
    "TypeScript": { icon:"typescript", desc:"Typed superset of JavaScript that catches bugs early and makes larger codebases easier to maintain." },
    "React": { icon:"react", desc:"Component-based library for building fast, interactive user interfaces." },
    "React.js": { icon:"react", desc:"Component-based library for building fast, interactive user interfaces." },
    "Node.js": { icon:"nodedotjs", desc:"JavaScript runtime for building scalable backend services and REST APIs." },
    "Next.js": { icon:"nextdotjs", desc:"React framework with server-side rendering, routing, and performance optimizations built in." },
    "Express.js": { icon:"express", desc:"Minimal Node.js framework used to build REST APIs and backend routing quickly." },
    "Tailwind CSS": { icon:"tailwindcss", desc:"Utility-first CSS framework for building custom designs fast without leaving HTML." },
    "MongoDB": { icon:"mongodb", desc:"NoSQL database used for flexible, document-based data storage in full-stack apps and bots." },
    "PostgreSQL": { icon:"postgresql", desc:"Reliable relational database used for structured data and complex queries." },
    "Docker": { icon:"docker", desc:"Containerization tool used to package and ship applications consistently across environments." },
    "TensorFlow": { icon:"tensorflow", desc:"Open-source framework for building and training deep learning models." },
    "PyTorch": { icon:"pytorch", desc:"Flexible deep learning framework popular for research and production ML models." },
    "OpenAI API": { icon:"openai", desc:"Used to integrate large language models into apps — chat, generation, and reasoning features." },
    "LangChain": { icon:"langchain", desc:"Framework for building applications powered by LLMs, chaining prompts, tools, and memory." },
    "Hugging Face": { icon:"huggingface", desc:"Hub and libraries for pretrained models — NLP, vision, and more, ready to fine-tune or deploy." },
    "Pandas": { icon:"pandas", desc:"Core Python library for data manipulation and analysis." },
    "Git & GitHub": { icon:"github", desc:"Version control and collaboration — every project here is tracked, branched, and shipped through it." },
    "HTML5": { icon:"html5", desc:"Markup language that structures every web page and app." },
    "CSS3": { icon:"css3", desc:"Styling language used to bring layouts, animation, and design systems to life." },
    "C": { icon:"c", desc:"Low-level language used to build a strong fundamentals base in memory and systems concepts." },
    "SQL": { icon:null, desc:"Query language for reading and managing relational data." },
    "REST APIs": { icon:null, desc:"Standard architecture style used to design and consume backend services." },
    "FastAPI": { icon:"fastapi", desc:"Modern, fast Python web framework often used for ML model APIs." },
    "Flask": { icon:"flask", desc:"Lightweight Python web framework for quick backend prototypes and services." },
    "Scikit-learn": { icon:"scikitlearn", desc:"Python library for classical machine learning — classification, regression, clustering." },
    "Prompt Engineering": { icon:null, desc:"Crafting and refining prompts to get reliable, high-quality output from LLMs." },
    "MySQL": { icon:"mysql", desc:"Widely used relational database for structured application data." },
    "Redis": { icon:"redis", desc:"In-memory data store used for caching, sessions, and fast lookups." },
    "Vercel": { icon:"vercel", desc:"Deployment platform used to ship frontend and full-stack apps instantly." },
    "Firebase": { icon:"firebase", desc:"Backend-as-a-service used for auth, realtime data, and quick app infrastructure." },
    "Postman": { icon:"postman", desc:"Tool used to test and debug APIs during development." },
    "Linux": { icon:"linux", desc:"OS environment used for development, servers, and deploying bots and apps." },
    "VS Code": { icon:"visualstudiocode", desc:"Primary code editor — extensions, debugging, and Git integration in one place." },
    "CI/CD Basics": { icon:null, desc:"Automating build, test, and deploy pipelines for faster, safer shipping." }
  };

  const techModalOverlay = document.getElementById('techModalOverlay');
  const techModalIcon = document.getElementById('techModalIcon');
  const techModalTitle = document.getElementById('techModalTitle');
  const techModalDesc = document.getElementById('techModalDesc');
  const techModalClose = document.getElementById('techModalClose');

  function openTechModal(name){
    const info = techInfo[name];
    techModalTitle.textContent = name;
    techModalDesc.textContent = info ? info.desc : "Part of the toolkit — used across projects and bots.";
    techModalIcon.innerHTML = (info && info.icon)
      ? `<img src="https://cdn.simpleicons.org/${info.icon}" alt="" onerror="this.style.display='none'"/>`
      : '';
    techModalOverlay.classList.add('open');
  }
  function closeTechModal(){ techModalOverlay.classList.remove('open'); }

  document.querySelectorAll('.tech-chip, .tech-cat-chips .chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const name = chip.textContent.trim();
      openTechModal(name);
    });
  });
  if(techModalClose) techModalClose.addEventListener('click', closeTechModal);
  if(techModalOverlay) techModalOverlay.addEventListener('click', (e)=>{
    if(e.target === techModalOverlay) closeTechModal();
  });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeTechModal(); });

  // ---- mobile nav toggle ----
  const toggle = document.getElementById('navToggle');
  const navlinks = document.querySelector('.navlinks');
  toggle.addEventListener('click', ()=>{
    const open = navlinks.style.display === 'flex';
    navlinks.style.display = open ? 'none' : 'flex';
    navlinks.style.cssText += open ? '' : 'position:fixed;top:64px;left:0;right:0;flex-direction:column;background:rgba(8,6,15,.97);padding:20px 28px;gap:18px;';
  });
  document.querySelectorAll('.navlinks a').forEach(link=>{
    link.addEventListener('click', ()=>{
      if(window.innerWidth <= 640){
        navlinks.style.display = 'none';
      }
    });
  });

  // ---- smooth in-page navigation (premium page-transition feel) ----
  function smoothNavTo(hash){
    const target = document.querySelector(hash);
    if(!target) return;
    if(window.__lenis){
      window.__lenis.scrollTo(target, { offset:-70, duration:1.15 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block:'start' });
    }
    // brief landing glow on arrival — a small, tasteful "page transition" cue
    const head = target.querySelector('.sec-title') || target;
    head.classList.remove('landing-pulse');
    void head.offsetWidth; // restart animation
    head.classList.add('landing-pulse');
  }
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    const hash = link.getAttribute('href');
    if(!hash || hash === '#' || hash.length < 2) return;
    link.addEventListener('click', (e)=>{
      if(document.querySelector(hash)){
        e.preventDefault();
        smoothNavTo(hash);
      }
    });
  });

  // ---- floating back-to-top ----
  const floatTop = document.getElementById('floatTop');
  if(floatTop){
    window.addEventListener('scroll', ()=>{
      floatTop.classList.toggle('show', window.scrollY > 700);
    }, { passive:true });
    floatTop.addEventListener('click', ()=>{
      if(window.__lenis) window.__lenis.scrollTo(0, { duration:1.1 });
      else window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // ---- active section highlight + small contact toast ----
  const navAnchors = [...document.querySelectorAll('.navlinks a')];
  const sectionIds = [...document.querySelectorAll('main section[id]')];
  function updateActiveNav(){
    const fromTop = window.scrollY + 140;
    let current = '';
    sectionIds.forEach(sec=>{
      if(sec.offsetTop <= fromTop){ current = sec.id; }
    });
    navAnchors.forEach(link=>link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }
  window.addEventListener('scroll', updateActiveNav, { passive:true });
  updateActiveNav();

  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const formError = document.getElementById('formError');
  if(contactForm && toast){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.submit-btn');
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const endpoint = contactForm.getAttribute('action');
      if(formError) formError.classList.remove('show');

      // Guard: endpoint not configured yet — fall back to opening the email client
      if(!endpoint || endpoint.includes('YOUR_FORM_ID')){
        const email = contactForm.querySelector('[name="email"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();
        const subject = encodeURIComponent(`Portfolio contact from ${name || 'someone'}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.location.href = `mailto:rkritiksah750@gmail.com?subject=${subject}&body=${body}`;
        toast.textContent = 'Opening your email app to send this…';
        toast.classList.add('show');
        setTimeout(()=>toast.classList.remove('show'), 3200);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('sending');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending';

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        if(res.ok){
          toast.textContent = name ? `Thanks, ${name}! I'll get back soon.` : "Thanks! I'll get back soon.";
          toast.classList.add('show');
          contactForm.reset();
          setTimeout(()=>toast.classList.remove('show'), 2800);
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(()=>{
        if(formError) formError.classList.add('show');
      })
      .finally(()=>{
        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');
        submitBtn.textContent = originalLabel;
      });
    });
  }

  // ---- project card 3D tilt (desktop only) ----
  if(window.matchMedia('(hover: hover)').matches && !reduceMotion){
    document.querySelectorAll('.proj-card').forEach(card=>{
      card.addEventListener('mousemove', (e)=>{
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -8;
        const ry = ((x / r.width) - 0.5) * 8;
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', ()=>{
        card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ---- stat counters: real DOM counts + live GitHub API ----
  (function(){
    const nums = document.querySelectorAll('.stat-num');
    if(!nums.length) return;

    function animateTo(el, target, suffix){
      const duration = reduceMotion ? 0 : 1200;
      const start = performance.now();
      function tick(now){
        const p = duration ? Math.min(1, (now - start) / duration) : 1;
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p >= 1 ? suffix : '');
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    function resolveEl(el){
      // real DOM count (e.g. actual number of .proj-card on the page)
      if(el.dataset.countSelector){
        const count = document.querySelectorAll(el.dataset.countSelector).length;
        animateTo(el, count, el.dataset.suffix || '');
        return;
      }
      // live value fetched from GitHub's public API
      if(el.dataset.github){
        fetch('https://api.github.com/users/rxrshah')
          .then(r => r.ok ? r.json() : Promise.reject(r.status))
          .then(data => {
            const val = data[el.dataset.github];
            if(typeof val === 'number') animateTo(el, val, el.dataset.suffix || '');
            else el.textContent = '—';
          })
          .catch(()=>{ el.textContent = '—'; }); // graceful fallback, no fake number shown
        return;
      }
      // static, honestly-labelled value
      if(el.dataset.target){
        animateTo(el, parseFloat(el.dataset.target), el.dataset.suffix || '');
      }
    }

    const statObserver = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          resolveEl(e.target);
          statObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(el=> statObserver.observe(el));
  })();

  // ---- easter eggs: typed keywords + Konami code ----
  (function(){
    const overlay = document.getElementById('eggOverlay');
    const eggText = document.getElementById('eggText');
    if(!overlay || !eggText) return;
    let hideTimer = null;
    function showEgg(msg, extraClass){
      eggText.textContent = msg;
      overlay.classList.add('show');
      if(extraClass) document.body.classList.add(extraClass);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(()=>{ overlay.classList.remove('show'); }, 2600);
    }

    let typedBuffer = '';
    const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e)=>{
      // Konami code tracking
      const key = e.key;
      if(key === konamiSeq[konamiIndex]){
        konamiIndex++;
        if(konamiIndex === konamiSeq.length){
          showEgg('⚡ KONAMI UNLOCKED ⚡');
          document.body.classList.add('shadow-mode');
          setTimeout(()=> document.body.classList.remove('shadow-mode'), 4000);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = (key === konamiSeq[0]) ? 1 : 0;
      }

      // typed keyword tracking (letters only)
      if(/^[a-zA-Z]$/.test(key)){
        typedBuffer = (typedBuffer + key.toLowerCase()).slice(-10);
        if(typedBuffer.endsWith('ritik')){
          showEgg('👑 The Dev Himself');
          typedBuffer = '';
        } else if(typedBuffer.endsWith('shadow')){
          showEgg('Arise...');
          document.body.classList.add('shadow-mode');
          setTimeout(()=> document.body.classList.remove('shadow-mode'), 4500);
          typedBuffer = '';
        } else if(typedBuffer.endsWith('solo')){
          showEgg('🗡 Solo Leveling Mode');
          document.body.classList.add('shadow-mode');
          setTimeout(()=> document.body.classList.remove('shadow-mode'), 4500);
          typedBuffer = '';
        }
      }
    });
  })();

  const isDesktopPointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  // ---- custom cursor: glowing dot + trailing ring, morphs on hover ----
  if(isDesktopPointer && !reduceMotion){
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const ambientGlow = document.getElementById('ambientGlow');
    if(cursorDot && cursorRing){
      document.documentElement.classList.add('has-custom-cursor');
      let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my, gx = mx, gy = my;
      window.addEventListener('mousemove', (e)=>{
        mx = e.clientX; my = e.clientY;
        cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      });
      (function ringLoop(){
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
        if(ambientGlow){
          gx += (mx - gx) * 0.07;
          gy += (my - gy) * 0.07;
          ambientGlow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
        }
        requestAnimationFrame(ringLoop);
      })();
      document.querySelectorAll('a, button, .tilt-card, .spotlight-card, .proj-btn').forEach(el=>{
        el.addEventListener('mouseenter', ()=> cursorRing.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', ()=> cursorRing.classList.remove('cursor-hover'));
      });
    }
  }

  // ---- magnetic field: elements get pulled toward the cursor even from a
  // short distance away, with elastic release. Stronger + wider reach. ----
  if(isDesktopPointer && !reduceMotion){
    const magnetic = [];
    document.querySelectorAll('.magnetic').forEach(el=>{
      magnetic.push({ el, strength: parseFloat(el.dataset.magStrength) || 0.42, radius: parseFloat(el.dataset.magRadius) || 55 });
    });
    document.querySelectorAll('.navlinks a').forEach(el=>{
      magnetic.push({ el, strength: 0.28, radius: 34 });
    });

    let rects = [];
    function refreshMagRects(){
      rects = magnetic.map(m=>{
        const r = m.el.getBoundingClientRect();
        return { el:m.el, strength:m.strength, radius:m.radius,
                 cx:r.left+r.width/2, cy:r.top+r.height/2, w:r.width, h:r.height };
      });
    }
    refreshMagRects();
    window.addEventListener('resize', refreshMagRects);
    window.addEventListener('scroll', refreshMagRects, { passive:true });

    let pendingX = null, pendingY = null, magTicking = false;
    function applyMagnetic(){
      rects.forEach(m=>{
        const dx = pendingX - m.cx;
        const dy = pendingY - m.cy;
        const field = Math.max(m.w, m.h)/2 + m.radius;
        const dist = Math.hypot(dx, dy);
        if(dist < field){
          const pull = (1 - dist/field) * m.strength;
          m.el.style.transform = `translate(${dx*pull}px, ${dy*pull}px)`;
        } else {
          m.el.style.transform = 'translate(0,0)';
        }
      });
      magTicking = false;
    }
    window.addEventListener('mousemove', (e)=>{
      pendingX = e.clientX; pendingY = e.clientY;
      if(!magTicking){ magTicking = true; requestAnimationFrame(applyMagnetic); }
    });
  }

  // ---- click ripple: small tactile flourish on primary interactive elements ----
  document.querySelectorAll('.btn, .proj-btn, .float-top, .social-icon').forEach(el=>{
    el.addEventListener('click', (e)=>{
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.8;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      el.appendChild(ripple);
      ripple.addEventListener('animationend', ()=> ripple.remove());
    });
  });

  // ---- text scramble / decode-in effect for headings ----
  (function(){
    const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';
    function scrambleInto(el, finalText, duration){
      const steps = Math.max(10, Math.round(duration / 35));
      const len = finalText.length;
      let frame = 0;
      function tick(){
        let out = '';
        for(let i=0;i<len;i++){
          const ch = finalText[i];
          if(ch === ' '){ out += ' '; continue; }
          const revealAt = (i/len) * steps;
          out += (frame >= revealAt + steps*0.35) ? ch : SCRAMBLE_CHARS[Math.floor(Math.random()*SCRAMBLE_CHARS.length)];
        }
        el.textContent = out;
        frame++;
        if(frame <= steps) requestAnimationFrame(tick);
        else el.textContent = finalText;
      }
      tick();
    }

    const targets = document.querySelectorAll('.scramble-target');
    if(!targets.length) return;

    if(reduceMotion){ return; } // leave static final text as-is

    // hero name: scramble in shortly after the intro finishes
    const heroTargets = document.querySelectorAll('.hero-title .scramble-target');
    setTimeout(()=>{
      heroTargets.forEach((el,i)=>{
        const text = el.textContent;
        setTimeout(()=> scrambleInto(el, text, 650), i*120);
      });
    }, 3300);

    // section headings: scramble in once, first time they scroll into view
    const headingTargets = document.querySelectorAll('.sec-title.scramble-target');
    const scrambleObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          scrambleInto(entry.target, entry.target.textContent, 600);
          scrambleObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.6 });
    headingTargets.forEach(el=> scrambleObserver.observe(el));
  })();

  // ---- resume preview modal (no forced download — just an inline preview) ----
  (function(){
    const overlay = document.getElementById('resumeModalOverlay');
    const frame = document.getElementById('resumeFrame');
    const closeBtn = document.getElementById('resumeModalClose');
    if(!overlay || !frame) return;
    const RESUME_SRC = 'assets/Ritik-Kumar-Resume.pdf';

    function openResume(e){
      if(e) e.preventDefault();
      if(!frame.src || !frame.src.includes('Resume.pdf')) frame.src = RESUME_SRC;
      overlay.classList.add('open');
    }
    function closeResume(){
      overlay.classList.remove('open');
    }
    document.querySelectorAll('.resume-preview-trigger').forEach(link=>{
      link.addEventListener('click', openResume);
    });
    if(closeBtn) closeBtn.addEventListener('click', closeResume);
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeResume(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeResume(); });
  })();
