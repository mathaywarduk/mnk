// *** IMAGE WITH CONTENT *** //
function ImageContent(el) {
  const opener = el.querySelector("[data-image-content-open]");
  const closer = el.querySelector("[data-image-content-close]");
  const target = el.querySelector("[data-image-content-target]");

  opener.addEventListener("click", function() {
    target.classList.remove('opacity-0');
    opener.classList.add('hidden');
  });

  closer.addEventListener("click", function() {
    target.classList.add('opacity-0');
    opener.classList.remove('hidden');
  });
}

function moveGallery(i, track, items, el) {
  const count = items.length;
  const prev = el.querySelector("[data-gallery-prev]");
  const next = el.querySelector("[data-gallery-next]");
  let additionalOffset = 30;
  
  if (i == 0) {
    additionalOffset = 0;
  }

  // get offset of next item
  track.style.marginLeft = "-" + (items[i].offsetLeft - additionalOffset) + "px";

  if (i == count - 1) {
    next.classList.add('hidden');
  } else {
    next.classList.remove('hidden');
  }

  if (i == 0) {
    prev.classList.add('hidden');
  } else {
    prev.classList.remove('hidden');
  }

  items.forEach((element) => {
    element.classList.remove('is-active');
  });

  items[i].classList.add('is-active');
}

// *** GALLERY *** //
function activateGallery(el, reset) {
  const track = el.querySelector("[data-gallery-track]");
  const prev = el.querySelector("[data-gallery-prev]");
  const next = el.querySelector("[data-gallery-next]");
  const items = Array.from(track.children);
  let i = 0;
  let trackWidth = 0;

  if (reset) {
    track.style.marginLeft = 0;
    i = 0;
  }

  prev.classList.add('hidden');
  next.classList.remove('hidden');

  items[0].classList.add('is-active');

  items.forEach((element) => {
    trackWidth = trackWidth + element.clientWidth + parseFloat(window.getComputedStyle(track).getPropertyValue("gap").replace("px",""));
  });

  if (trackWidth > window.innerWidth) {

    next.addEventListener("click", function() {

      moveGallery(i+1, track, items, el);

      // increment current item
      i++;

      setTimeout(function () {
        playPauseAllVideos();
      }, 300);
      
    });

    prev.addEventListener("click", function() {
      
      moveGallery(i-1, track, items, el);

      
      // increment current item
      i--;

      setTimeout(function () {
        playPauseAllVideos();
      }, 300);
    });

    el.addEventListener("scrollend", function() {
      playPauseAllVideos();
    });

  } else {
    next.classList.add('hidden');
  }

}

function Gallery(el) {

  activateGallery(el, false);

  window.addEventListener("resize", function() {
    activateGallery(el, true);
  });

}

// *** AUTOPLAY VIDEO *** //

// UPDATED: true if >= 50% of width AND >= 50% of height is visible
function isInViewport(el) {

  const rect = el.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  const visibleWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

  if (visibleWidth <= 0 || visibleHeight <= 0) return false;

  const elementWidth = rect.width || el.offsetWidth;
  const elementHeight = rect.height || el.offsetHeight;

  return visibleWidth >= elementWidth / 1.5 && visibleHeight >= elementHeight / 1.5;

}

// NEW (minimal): swap z-index classes exactly as you described (z-0 / z-20)
function showVideo(container) {
  const placeholder = container.querySelector("picture");
  const video = container.querySelector("video");

  if (placeholder) {
    placeholder.classList.remove("z-20");
    placeholder.classList.add("z-0");
  }

  if (video) {
    video.classList.remove("z-0");
    video.classList.add("z-20");
  }
}

function showPlaceholder(container) {
  const placeholder = container.querySelector("picture");
  const video = container.querySelector("video");

  if (placeholder) {
    placeholder.classList.remove("z-0");
    placeholder.classList.add("z-20");
  }

  if (video) {
    video.classList.remove("z-20");
    video.classList.add("z-0");
  }
}

// UPDATED:
// - check viewport visibility on [data-video] container (not the video element)
// - ignore .is-active if the gallery is horizontally scrollable (mobile overflow-x use-case)
// - preserve z-index swapping via z-0 / z-20 classes
// - reset when leaving viewport (pause + currentTime = 0)
function playPause(video) {

  const container = video.closest("[data-video]") || video.parentNode;
  const inView = isInViewport(container);

  const gallery = container.closest("[data-gallery]");
  const isScrollableGallery = !!(gallery && gallery.scrollWidth > gallery.clientWidth);

  const isActive = container.classList.contains('is-active');
  const activeOk = isScrollableGallery ? true : isActive;

  if (inView && activeOk) {
    showVideo(container);
    video.play();
  } else {
    video.pause();
    try { video.currentTime = 0; } catch (e) {}
    showPlaceholder(container);
  }
}

function playPauseAllVideos() {
  document.querySelectorAll("video").forEach((element) => {
    playPause(element);
  });
}

function Video(el) {

  const video = el.querySelector("video");
  playPause(video);

  // UPDATED: scrollend is patchy; keep it but also listen for scroll
  window.addEventListener("scrollend", function() {
    playPause(video);
  });

  window.addEventListener("scroll", debounce(function(e){
    playPause(video);
  }));

  window.addEventListener("resize", debounce(function(e){
    playPause(video);
  }));

  // UPDATED: horizontal overflow scrolling on mobile happens on the gallery element
  const gallery = el.closest("[data-gallery]");
  if (gallery) {
    gallery.addEventListener("scroll", debounce(function() {
      playPause(video);
    }));

    gallery.addEventListener("scrollend", function() {
      playPause(video);
    });
  }

}

// *** HORIZONTAL SCROLL *** //
function ScrollToHash(el){
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (window.innerWidth < 1024) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      target.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }
}

// *** DEBOUNCE *** //
function debounce(func){
  var timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,100,event);
  };
}


// *** INIT *** //
window.addEventListener('DOMContentLoaded', (event) => {
  [...document.querySelectorAll("[data-image-content]")].map((el) => ImageContent(el));
});

window.addEventListener('load', (event) => {
  [...document.querySelectorAll("[data-video]")].map((el) => Video(el));
  [...document.querySelectorAll("[data-gallery]")].map((el) => Gallery(el));
  [...document.querySelectorAll("[data-scroll-to-hash]")].map((el) => ScrollToHash(el));
});
