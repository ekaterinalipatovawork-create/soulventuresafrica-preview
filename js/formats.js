(function () {
  var DRAG_THRESHOLD = 50;

  function init(root) {
    var viewport = root.querySelector('.formats__viewport');
    var track = root.querySelector('.formats__track');
    var prev = root.querySelector('.formats__arrow--prev');
    var next = root.querySelector('.formats__arrow--next');
    var slides = Array.prototype.slice.call(track.children);
    var count = slides.length;
    var index = 1;
    var busy = false;
    var startX = 0;
    var dragX = 0;
    var dragging = false;
    var fallback = 0;

    var head = slides[count - 1].cloneNode(true);
    var tail = slides[0].cloneNode(true);
    head.setAttribute('aria-hidden', 'true');
    tail.setAttribute('aria-hidden', 'true');
    track.insertBefore(head, slides[0]);
    track.appendChild(tail);

    function place(i, animate, offset) {
      track.classList.toggle('is-static', !animate);
      track.style.transform = 'translate3d(calc(' + (-i * 100) + '% + ' + (offset || 0) + 'px), 0, 0)';
      index = i;
    }

    function settle() {
      clearTimeout(fallback);
      busy = false;
      if (index === 0) {
        place(count, false);
      } else if (index === count + 1) {
        place(1, false);
      }
      void track.offsetWidth;
    }

    function move(step) {
      if (busy) {
        return;
      }
      busy = true;
      place(index + step, true);
      fallback = setTimeout(settle, 400);
    }

    track.addEventListener('transitionend', function (e) {
      if (e.target === track && e.propertyName === 'transform') {
        settle();
      }
    });

    prev.addEventListener('click', function () {
      move(-1);
    });

    next.addEventListener('click', function () {
      move(1);
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        move(-1);
      } else if (e.key === 'ArrowRight') {
        move(1);
      }
    });

    viewport.addEventListener('pointerdown', function (e) {
      if (busy || (e.pointerType === 'mouse' && e.button !== 0)) {
        return;
      }
      dragging = true;
      startX = e.clientX;
      dragX = 0;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', function (e) {
      if (!dragging) {
        return;
      }
      dragX = e.clientX - startX;
      place(index, false, dragX);
    });

    function release() {
      if (!dragging) {
        return;
      }
      dragging = false;
      viewport.classList.remove('is-dragging');
      void track.offsetWidth;
      if (dragX <= -DRAG_THRESHOLD) {
        busy = true;
        place(index + 1, true);
        fallback = setTimeout(settle, 400);
      } else if (dragX >= DRAG_THRESHOLD) {
        busy = true;
        place(index - 1, true);
        fallback = setTimeout(settle, 400);
      } else {
        place(index, true);
      }
    }

    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);

    place(1, false);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-formats]'), init);
})();
