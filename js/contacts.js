(function () {
  var walkers = document.querySelectorAll('.contacts__walker');

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(walkers, function (el) {
      el.classList.add('is-walking');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-walking');
        observer.unobserve(entry.target);
      }
    });
  });

  Array.prototype.forEach.call(walkers, function (el) {
    observer.observe(el);
  });
})();
