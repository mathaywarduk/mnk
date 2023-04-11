// // *******
// // Toggler
// // *******

// function Toggler(el) {
//   const target = document.getElementById(el.getAttribute('aria-controls'));
//   const fixed = el.dataset.toggleFixed;
//   el.addEventListener("click", function(e) {
//     el.classList.toggle("is-active");
//     target.classList.toggle("is-active");


//     if (fixed !== undefined) {
//       window.scrollTo(0, 0);
//       document.querySelector("body").classList.toggle("overflow-hidden");
//     }
//   });
// }


// // *********
// // Blur Load
// // *********

// function updateImage(el, img, srcset) {
//     // Check if source elements already exist
//     let sources = el.querySelectorAll("source");

//     if (typeof(srcset) != "undefined" && sources.length < 1) {


//       const webpSrcSet = srcset.replaceAll('?w=', '?fm=webp&w=');

//       // Create source element for JPG
//       const jpgSource = document.createElement("source");
//       jpgSource.setAttribute("srcset", srcset);
//       jpgSource.setAttribute("type", "image/jpeg");

//       // Create source element for WEBP
//       const webpSource = document.createElement("source");
//       webpSource.setAttribute("srcset", webpSrcSet);
//       webpSource.setAttribute("type", "image/webp");

//       // Add source elements
//       el.prepend(jpgSource);
//       el.prepend(webpSource);
//     }
// }

// function isInView(el) {
//   const box = el.getBoundingClientRect();
//   return box.top < window.innerHeight && box.bottom >= 0;
// }

// function BlurLoad(el) {
//   const img = el.querySelector("img");
//   const srcset = img.dataset.srcset;

//   // if in viewport and not large image
//   if (isInView(el)) {
//     updateImage(el, img, srcset);
//   }

//   // check on scroll/resize if in viewport
//   document.addEventListener('scroll', function(e) {
//     if (isInView(el)) {
//       updateImage(el, img, srcset);
//     }
//   });
//   document.addEventListener('resize', function(e) {
//     if (isInView(el)) {
//       updateImage(el, img, srcset);
//     }
//   });
// }


// // ************
// // Image scroll
// // ************
// function ScrollElement(el) {
//   const direction = el.dataset.scrollDirection;
//   const elWidth = el.clientWidth;
//   const elPosition = el.offsetTop;
//   const stopPosition = elPosition + window.innerHeight;
//   const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

//   let newMargin = ((scrollPosition + window.innerHeight) - elPosition) / 3;

//   if (direction == "rtl") {
//     newMargin = 0 - newMargin;
//   }

//   el.style.marginLeft = newMargin + 'px';

// }

// function BindScroll(el) {
//   if (isInView(el)) {
//     ScrollElement(el);
//   }

//   document.addEventListener('scroll', function(e) {
//     if (isInView(el)) {
//       ScrollElement(el);
//     }
//   });
// }

// function hideAllTabTargets(tabs) {
//   tabs.forEach((element, index) => {
//     const target = document.querySelector(element.dataset.tabsTarget);
//     target.classList.add('hidden');
//   });
// }

// function BindTabs(el) {
//   const tabsNav = el.querySelector("[data-tabs-nav]");
//   const tabs = tabsNav.querySelectorAll("button");
//   const tabsTitles = el.querySelectorAll("[data-tabs-title]");

//   tabsNav.classList.remove("hidden");
//   tabsTitles.forEach((element) => {
//       element.classList.add("hidden");
//   });

//   tabs.forEach((element, index) => {
//     const target = document.querySelector(element.dataset.tabsTarget);

//     if (index != 0) {
//       target.classList.add('hidden');
//     } else {
//       element.classList.add("active");
//     }

//     element.addEventListener("click", function() {
//       hideAllTabTargets(tabs);
//       target.classList.remove('hidden');
//       tabs.forEach((element) => {
//         element.classList.remove('active');
//       })
//       this.classList.add('active');
//     });

//   });

// }


// window.addEventListener('DOMContentLoaded', (event) => {
//   [...document.querySelectorAll("[data-toggle]")].map((el) => Toggler(el));
//   [...document.querySelectorAll("[data-blur-load]")].map((el) => BlurLoad(el));
//   [...document.querySelectorAll("[data-scroll-int]")].map((el) => BindScroll(el));
//   [...document.querySelectorAll("[data-tabs]")].map((el) => BindTabs(el));
// });