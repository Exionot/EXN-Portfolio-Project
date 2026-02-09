const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver((entries) => {
    let mostVisible = null;
    let maxRatio = 0;

    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target;
        }
    });

    if (mostVisible) {
        const id = mostVisible.getAttribute("id");
        
        navLinks.forEach(link => {
            link.classList.toggle(
                "toggled",
                link.getAttribute("href") === `#${id}`
            );
        });

        history.replaceState(null, "", `#${id}`);
    }
}, {
    root: null,
    rootMargin: "0px 0px -50% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1] 
});

sections.forEach(section => observer.observe(section));


// Footer stopper
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");

    const footerTop = footer.getBoundingClientRect().top;
    const navHeight = nav.offsetHeight;

    if (footerTop <= navHeight) {
        nav.style.top = `${footerTop - navHeight}px`;
    } else {
        nav.style.top = "0px";
    }
});


// Nav text animation
const nav = document.querySelector("nav");
const elements = nav.querySelectorAll(".nav-text");

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";

// const maxFramesPerChar = 5;
// const frameDelayMs = 20;
const hoverDelayMs = 150;

let hoverTimeoutId = null;

function animateElement(el, frameDelayMs = 20, maxFramesPerChar = 5) {
  const targetText = (el.textContent).trim();
  let frame = 0;

  function animate() {
    let display = "";

    for (let i = 0; i < targetText.length; i++) {
      if (frame / maxFramesPerChar > i) {
        display += targetText[i];
      } else {
        display += charset[Math.floor(Math.random() * charset.length)];
      }
    }

    el.textContent = display;
    frame++;

    if (display !== targetText) {
      el._timeoutId = setTimeout(animate, frameDelayMs);
    }
  }

  if (el._timeoutId) {
    clearTimeout(el._timeoutId);
  }

  frame = 0;
  el._timeoutId = setTimeout(animate, frameDelayMs);
}

elements.forEach(el => {
  el.dataset.targetText = el.textContent;
});

nav.addEventListener("mouseenter", () => {
  hoverTimeoutId = setTimeout(() => {
    elements.forEach(el => animateElement(el));
  }, hoverDelayMs);
});

nav.addEventListener("mouseleave", () => {
  if (hoverTimeoutId) {
    clearTimeout(hoverTimeoutId);
    hoverTimeoutId = null;
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const heroButtons = document.querySelectorAll(".hero-button-text");
    console.log(heroButtons[0].dataset.targetText)
    heroButtons.forEach(button => {
        animateElement(button);
    })
});