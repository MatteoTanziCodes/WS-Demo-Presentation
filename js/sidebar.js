/* js/sidebar.js
   Sidebar: show/hide after hero, active section link tracking */

(function () {
  const sidebar = document.getElementById('sidebar');
  const hero = document.getElementById('hero');
  if (!sidebar || !hero) return;

  // ---- Show sidebar once hero leaves viewport ----
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        sidebar.classList.remove('hidden');
      } else {
        sidebar.classList.add('hidden');
      }
    });
  }, { threshold: 0.1 });
  heroObserver.observe(hero);

  // ---- Active link tracking as sections scroll into view ----
  const sectionMap = [
    { id: 'problem', link: document.querySelector('.sidebar-link[href="#problem"]') },
    { id: 'summit',  link: document.querySelector('.sidebar-link[href="#summit"]') },
    { id: 'system',  link: document.querySelector('.sidebar-link[href="#system"]') },
    { id: 'step1',   link: document.querySelector('.sidebar-link[href="#step1"]') },
    { id: 'step2',   link: document.querySelector('.sidebar-link[href="#step2"]') },
    { id: 'step3',   link: document.querySelector('.sidebar-link[href="#step3"]') },
    { id: 'human',   link: document.querySelector('.sidebar-link[href="#human"]') },
  ].filter(s => document.getElementById(s.id) && s.link);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const match = sectionMap.find(s => s.id === entry.target.id);
      if (!match) return;
      sectionMap.forEach(s => s.link.classList.remove('active'));
      match.link.classList.add('active');
    });
  }, { threshold: 0.35 });

  sectionMap.forEach(s => sectionObserver.observe(document.getElementById(s.id)));

})();
