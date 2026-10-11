(function () {
  var SWIPE_THRESHOLD = 50;

  function init(root) {
    var viewport = root.querySelector('.hotels__viewport');
    var track = root.querySelector('.hotels__track');
    var prev = root.querySelector('.hotels__arrow--prev');
    var next = root.querySelector('.hotels__arrow--next');
    var count = track.children.length;
    var index = 0;
    var startX = 0;
    var startY = 0;
    var tracking = false;

    function go(step) {
      index = (index + step + count) % count;
      track.style.setProperty('--i', index);
    }

    prev.addEventListener('click', function () {
      go(-1);
    });

    next.addEventListener('click', function () {
      go(1);
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === 'ArrowRight') {
        go(1);
      }
    });

    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') {
        return;
      }
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    viewport.addEventListener('pointerup', function (e) {
      if (!tracking) {
        return;
      }
      tracking = false;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
      }
    });

    viewport.addEventListener('pointercancel', function () {
      tracking = false;
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-hotels]'), init);
})();
