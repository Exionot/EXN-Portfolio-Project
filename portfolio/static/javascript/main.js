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
                link.getAttribute("href") === `/#${id}`
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


// Projects Gallery 
document.addEventListener('DOMContentLoaded', function() {
    const imageContainer = document.querySelector('.projects-gallery-image-container');
    const images = document.querySelectorAll('.projects-gallery-image');
    const imageItems = document.querySelectorAll('.projects-gallery-image-item');
    const prevBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');
    let currentIndex = 0;

    function updateGallery(newIndex) {
        images[currentIndex].classList.remove('focus');
        
        currentIndex = newIndex;
        
        images[currentIndex].classList.add('focus');
        
        const imageWidth = 35; 
        const marginAdjustment = currentIndex * 3; 
        
        const offset = -(currentIndex * imageWidth);
        imageContainer.style.transform = `translateX(calc(${offset}vw + ${marginAdjustment}rem))`;

        if (currentIndex === 0) {
            prevBtn.classList.add('disabled');
            prevBtn.disabled = true;
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.disabled = false;
        }
        
        if (currentIndex === images.length - 1) {
            nextBtn.classList.add('disabled');
            nextBtn.disabled = true;
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.disabled = false;
        }
    }

    imageItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            updateGallery(index);
        });
    });

    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            updateGallery(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < images.length - 1) {
            updateGallery(currentIndex + 1);
        }
    });
});