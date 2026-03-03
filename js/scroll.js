/* js/scroll.js
   Scroll-driven animations: reveal, roadmap progress, nav scroll state */

(function () {
  // ---- Reveal on scroll ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
        let delay = 0;
        siblings.forEach((el, i) => {
          if (el === entry.target) delay = i * 55;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ---- Nav scroll state ----
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });

  // ---- Roadmap dot activation on scroll ----
  const roadmapPoints = document.querySelectorAll('.roadmap-point[data-step]');
  const roadmapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const step = parseInt(entry.target.dataset.step);
      if (!step) return;
      const dot = entry.target.querySelector('.rp-dot');
      if (entry.isIntersecting) {
        dot.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  // Trigger roadmap dots as corresponding steps come into view
  const stepBlocks = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
  ];

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      const stepNum = parseInt(id.replace('step', ''));
      if (!stepNum) return;

      // Activate all roadmap dots up to this step
      document.querySelectorAll('.roadmap-point[data-step]').forEach(pt => {
        const ptStep = parseInt(pt.dataset.step);
        const dot = pt.querySelector('.rp-dot');
        if (ptStep <= stepNum) dot.classList.add('active');
      });
    });
  }, { threshold: 0.3 });

  stepBlocks.forEach(el => { if (el) stepObserver.observe(el); });

  // ---- Flow diagram dot hover pulse ----
  const flowStages = document.querySelectorAll('.flow-stage');
  flowStages.forEach(stage => {
    stage.addEventListener('mouseenter', () => {
      const dots = stage.querySelectorAll('.fd');
      dots.forEach((d, i) => {
        setTimeout(() => {
          d.style.transform = 'scale(1.5)';
          setTimeout(() => { d.style.transform = ''; }, 200);
        }, i * 40);
      });
    });
  });

  // ---- Smooth scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
