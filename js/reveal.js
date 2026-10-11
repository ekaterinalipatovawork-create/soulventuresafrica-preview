(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!items.length || !('IntersectionObserver' in window)) return;

  var touch = window.matchMedia('(hover: none)').matches;
  var targets = items.filter(function (el) {
    return !touch || el.getAttribute('data-reveal') === 'always';
  });
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  targets.forEach(function (el) {
    el.classList.add('is-pending');
    observer.observe(el);
  });
})();
