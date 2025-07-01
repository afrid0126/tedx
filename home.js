  function toggleMenu(icon) {
    icon.classList.toggle("active");
    document.getElementById("overlay").classList.toggle("open");
  }
  document.body.classList.add("overlay-open");

document.body.classList.remove("overlay-open");

const timelineContainer = document.querySelector(".timeline-container");

  const endDate = new Date("August 2, 2025 00:00:00").getTime();

  function updateCountdown() {
  const now = new Date().getTime();
  let gap = endDate - now;

  if (gap < 0) gap = 0;

  const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;

  const d = Math.floor(gap / day);
  const h = Math.floor((gap % day) / hour);
  const m = Math.floor((gap % hour) / minute);
  const s = Math.floor((gap % minute) / second);

  document.getElementById("dayVal").innerText = d.toString().padStart(2, '0');
  document.getElementById("hourVal").innerText = h.toString().padStart(2, '0');
  document.getElementById("minuteVal").innerText = m.toString().padStart(2, '0');
  document.getElementById("secondVal").innerText = s.toString().padStart(2, '0');

const setProgress = (id, percent) => {
  const circle = document.getElementById(id);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${offset}`;
};


  setProgress("dayProgress", (d % 365) / 365 * 100);
  setProgress("hourProgress", h / 24 * 100);
  setProgress("minuteProgress", m / 60 * 100);
  setProgress("secondProgress", s / 60 * 100);
}

  setInterval(updateCountdown, 1000);
  updateCountdown();


    window.addEventListener('scroll', function () {
  const flowTitle = document.querySelector('.flow-title');
  const top = flowTitle.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (top < windowHeight - 100) {
    flowTitle.style.opacity = '1';
    flowTitle.style.transform = 'translateY(0)';
  }
});





    // ===== Timeline Line Width Update =====
function updateTimelineLineWidth() {
  const timeline = document.querySelector('.timeline');
  const timelineLine = document.querySelector('.timeline-line');
  const lastEvent = timeline?.lastElementChild;

  if (timeline && timelineLine && lastEvent) {
    const lineWidth = lastEvent.offsetLeft + lastEvent.offsetWidth + 100;
    timelineLine.style.width = `${lineWidth}px`;
  }
}

window.addEventListener('DOMContentLoaded', updateTimelineLineWidth);
window.addEventListener('resize', updateTimelineLineWidth);


// ===== Typing Popup on Event Click =====
const timelineItems = document.querySelectorAll(".timeline-item");
const popup = document.querySelector(".popup-card");
const popupTitle = popup.querySelector("h3");
const popupDesc = popup.querySelector("p");
const closeBtn = document.querySelector(".popup-close");
const overlay = document.getElementById("popupOverlay");

function typeText(element, text, delay = 20) {
  element.textContent = "";
  let i = 0;
  const typingInterval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i === text.length) clearInterval(typingInterval);
  }, delay);
}

timelineItems.forEach((item) => {
  item.addEventListener("click", () => {
    const title = item.getAttribute("data-title") || "Event Title";
    const desc = item.getAttribute("data-desc") || "Event description goes here.";

    popupTitle.classList.add("typing");
    popupDesc.classList.remove("typing");

    popup.classList.add("show");
    overlay.classList.add("show");

    popupTitle.textContent = title;
    popupDesc.textContent = "";

    setTimeout(() => {
      popupTitle.classList.remove("typing");
      popupDesc.classList.add("typing");
      typeText(popupDesc, desc, 18);
    }, 200);
  });
});

closeBtn.addEventListener("click", () => {
  popup.classList.remove("show");
  overlay.classList.remove("show");
});
overlay.addEventListener("click", () => {
  popup.classList.remove("show");
  overlay.classList.remove("show");
});

// ===== Timeline Scroll Arrow Buttons =====
const scrollAmount = 300;
const leftBtn = document.querySelector(".scroll-btn.left");
const rightBtn = document.querySelector(".scroll-btn.right");

leftBtn.addEventListener("click", () => {
  timelineContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});
rightBtn.addEventListener("click", () => {
  timelineContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

// ===== Fade-In Observer for Timeline Items =====
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
}, { threshold: 0.5 });

timelineItems.forEach((item) => fadeObserver.observe(item));




//============VIDEO LOADER========================//

// script.js

const videoPreloader = document.getElementById('video-preloader');
const loaderVideo = document.getElementById('loaderVideo');

let contentLoaded = false;
let videoEnded = false;

// Function to hide the preloader
function hidePreloader() {
    // Check if the preloader is currently displayed (i.e., on a mobile device)
    const isPreloaderActive = window.getComputedStyle(videoPreloader).display !== 'none';

    if (isPreloaderActive && contentLoaded && videoEnded) {
        if (videoPreloader) {
            videoPreloader.classList.add('hide'); // Start fade-out

            videoPreloader.addEventListener('transitionend', function() {
                videoPreloader.remove(); // Remove from DOM
                document.body.style.overflow = 'auto'; // Re-enable scrolling on the body
                document.documentElement.style.overflow = 'auto'; // Also for html element (some browsers)
            }, { once: true }); // Ensure listener runs only once
        }
    } else if (!isPreloaderActive && contentLoaded) {
        // If on desktop (preloader not active/shown) AND content is loaded,
        // ensure scrolling is enabled immediately without waiting for video.
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }
}

// 1. Listen for the entire page content to load
window.addEventListener('load', function() {
    contentLoaded = true;
    hidePreloader();
});

// 2. Play the video as soon as the HTML is ready (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function() {
    const isPreloaderActive = window.getComputedStyle(videoPreloader).display !== 'none';

    if (isPreloaderActive) {
        // Only try to play if the preloader is actually visible (on mobile)
        if (loaderVideo) {
            loaderVideo.play().catch(error => {
                console.warn("Video autoplay blocked or error:", error);
                videoEnded = true; // Assume video 'ended' if it couldn't play
                hidePreloader();
            });
        } else {
            videoEnded = true; // No video element found, treat as ended
            hidePreloader();
        }
    } else {
        // On desktop, immediately consider video 'ended' as it's not playing
        videoEnded = true;
        hidePreloader(); // This will then check contentLoaded and adjust body overflow
    }
});

// 3. Listen for when the video itself finishes playing
if (loaderVideo) { // Ensure loaderVideo exists before adding listener
    loaderVideo.addEventListener('ended', function() {
        videoEnded = true;
        hidePreloader();
    });
}
//hello world