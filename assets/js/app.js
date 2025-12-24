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
    if (window.innerWidth < 1024) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      target.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }
}

function updateImage(el, img, srcset) {
    // Check if source elements already exist
    let sources = el.querySelectorAll("source");

    if (typeof(srcset) != "undefined" && sources.length < 1) {


      const webpSrcSet = srcset.replaceAll('?w=', '?fm=webp&w=');

      // Create source element for JPG
      const jpgSource = document.createElement("source");
      jpgSource.setAttribute("srcset", srcset);
      jpgSource.setAttribute("type", "image/jpeg");

      // Create source element for WEBP
      const webpSource = document.createElement("source");
      webpSource.setAttribute("srcset", webpSrcSet);
      webpSource.setAttribute("type", "image/webp");

      // Add source elements
      el.prepend(jpgSource);
      el.prepend(webpSource);
    }
}

function isInView(el) {
  const box = el.getBoundingClientRect();
  return box.top < window.innerHeight && box.bottom >= 0;
}

function BlurLoad(el) {
  const img = el.querySelector("img");
  const srcset = img.dataset.srcset;

  // if in viewport and not large image
  if (isInView(el) || el.dataset.blurLoadNow !== undefined) {
    updateImage(el, img, srcset);
  }

  // check on scroll/resize if in viewport
  document.addEventListener('scroll', function(e) {
    if (isInView(el)) {
      updateImage(el, img, srcset);
    }
  });
  document.addEventListener('resize', function(e) {
    if (isInView(el)) {
      updateImage(el, img, srcset);
    }
  });
}



// *** INIT *** //
window.addEventListener('DOMContentLoaded', (event) => {
  [...document.querySelectorAll("[data-image-content]")].map((el) => ImageContent(el));
  [...document.querySelectorAll("[data-blur-load]")].map((el) => BlurLoad(el));
  [...document.querySelectorAll("[data-scroll-to-hash]")].map((el) => ScrollToHash(el));
});
