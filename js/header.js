(function () {
  var header = document.querySelector('.site-header');
  var menu = document.querySelector('.menu');
  if (!header || !menu) return;

  var threshold = 250;

  function onScroll() {
    header.classList.toggle('is-visible', header.hasAttribute('data-static') || window.scrollY > threshold);
  }

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  document.querySelectorAll('[data-menu-open]').forEach(function (el) {
    el.addEventListener('click', function () {
      setMenu(true);
    });
  });

  document.querySelectorAll('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      setMenu(false);
    });
  });

  menu.addEventListener('click', function (e) {
    if (e.target === menu) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
