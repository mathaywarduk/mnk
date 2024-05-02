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

function isInViewport(el) {

  let rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
}

function playPause(video) {


  if (isInViewport(video)) {
    video.play();
  } else {
    video.pause()
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

  window.addEventListener("scrollend", function() {
    playPause(video);
  });

  window.addEventListener("resize", function() {
    playPause(video);
  });

}

// *** HORIZONTAL SCROLL *** //


// *** INIT *** //
window.addEventListener('DOMContentLoaded', (event) => {
  [...document.querySelectorAll("[data-image-content]")].map((el) => ImageContent(el));
});

window.addEventListener('load', (event) => {
  [...document.querySelectorAll("[data-video]")].map((el) => Video(el));
  [...document.querySelectorAll("[data-gallery]")].map((el) => Gallery(el));
});