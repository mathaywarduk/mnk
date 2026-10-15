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

// *** HORIZONTAL SCROLL *** //
function ScrollToHash(el){
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    if (window.innerWidth < 1024) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      target.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }
}


// *** LAZY IMAGES *** //
// Swap the tiny blurred placeholder for a properly sized image once it's
// close to the viewport, then fade it in.
function loadImage(picture) {
  if (picture.dataset.lazy === "done") return;
  picture.dataset.lazy = "done";

  const img = picture.querySelector("img");
  const box = picture.getBoundingClientRect();
  let width = box.width || window.innerWidth;

  // object-fit: cover crops, so the image may need to be wider than its box
  if (getComputedStyle(img).objectFit === "cover" && img.width && img.height) {
    width = Math.max(width, box.height * (img.width / img.height));
  }

  img.addEventListener("load", function() {
    picture.classList.add("is-loaded");
    fixGalleryRatio(picture, img);
  }, { once: true });
  img.sizes = Math.ceil(width) + "px";
  img.srcset = img.dataset.srcset;
}

const imageObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      imageObserver.unobserve(entry.target);
      loadImage(entry.target);
    }
  });
}, { rootMargin: "50% 25%" });

function LazyImage(el) {
  imageObserver.observe(el);
}


// *** VIDEO *** //
// Videos only exist while they're on screen. The poster image shows until the
// video is actually playing, then the video fades in over it. Once it's fully
// off screen for a moment the video is removed to free up memory/bandwidth.
// In a gallery, only the active slide's video plays.
const UNLOAD_DELAY = 2000;

function loadVideo(el) {
  clearTimeout(el._unloadTimer);
  let video = el.querySelector("video");

  if (!video) {
    video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.addEventListener("playing", function() {
      video.classList.add("is-playing");
    });
    video.src = el.dataset.src;
    el.append(video);
  }

  return video;
}

function unloadVideo(el) {
  clearTimeout(el._unloadTimer);
  el._unloadTimer = setTimeout(function() {
    const video = el.querySelector("video");
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  }, UNLOAD_DELAY);
}

function isActiveSlide(el) {
  const slide = el.closest(".splide__slide");
  return !slide || slide.classList.contains("is-active");
}

// Play or pause a video based on whether it's on screen and active
function updateVideo(el) {
  if (el._visible && isActiveSlide(el)) {
    const playing = loadVideo(el).play();
    if (playing) playing.catch(function() {});
  } else {
    const video = el.querySelector("video");
    if (video) video.pause();
  }
}

const videoObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    entry.target._visible = entry.intersectionRatio >= 0.6;
    updateVideo(entry.target);
    if (!entry.isIntersecting) unloadVideo(entry.target);
  });
}, { threshold: [0, 0.6] });

function Video(el) {
  videoObserver.observe(el);
}


// *** GALLERY *** //
// Gallery tracks clip their slides, so the viewport observer can't see slides
// that are off to the side. Preload images for anything within a screen
// either side of where the gallery is now.
function loadGalleryNeighbours(gallery) {
  const track = gallery.querySelector(".splide__track").getBoundingClientRect();
  gallery.querySelectorAll("[data-lazy]:not([data-lazy='done'])").forEach(function(picture) {
    const box = picture.getBoundingClientRect();
    if (box.right > track.left - track.width && box.left < track.right + track.width) {
      loadImage(picture);
    }
  });
}

// Fallback for media we didn't know the size of at build time
function fixGalleryRatio(picture, img) {
  const media = picture.closest(".gallery-media");
  if (!media || media.style.getPropertyValue("--ar")) return;
  media.style.setProperty("--ar", img.naturalWidth / img.naturalHeight);
  const gallery = media.closest("[data-gallery]");
  if (gallery && gallery._splide) gallery._splide.refresh();
}

const galleryObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      galleryObserver.unobserve(entry.target);
      loadGalleryNeighbours(entry.target);
    }
  });
}, { rootMargin: "100% 0%" });

function Gallery(el) {
  if (!window.Splide) return;

  const splide = new Splide(el, {
    autoWidth: true,
    gap: "1.5em",
    speed: 600,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    flickPower: 400,
    snap: true,
    trimSpace: false,
    breakpoints: {
      1023: { focus: "center" },
    },
  });
  splide.on("moved", function() {
    loadGalleryNeighbours(el);
  });
  splide.on("active inactive", function(slide) {
    slide.slide.querySelectorAll("[data-video]").forEach(updateVideo);
  });
  splide.mount();
  el._splide = splide;

  galleryObserver.observe(el);
}


// *** INIT *** //
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll("[data-image-content]").forEach(ImageContent);
  document.querySelectorAll("[data-gallery]").forEach(Gallery);
  document.querySelectorAll("[data-lazy]").forEach(LazyImage);
  document.querySelectorAll("[data-video]").forEach(Video);
  document.querySelectorAll("[data-scroll-to-hash]").forEach(ScrollToHash);
});
