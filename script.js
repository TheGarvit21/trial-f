let crsr = document.querySelector("#cursor");
let blur = document.querySelector("#cursor-blur");
document.addEventListener("mousemove", (dets) => {
  crsr.style.left = dets.x + "px";
  crsr.style.top = dets.y + "px";
  blur.style.left = dets.x - 75 + "px";
  blur.style.top = dets.y - 75 + "px";
});

// let h4all = document.querySelectorAll("#nav h4");
// h4all.forEach((elem) => {
//   elem.addEventListener("mouseenter", () => {
//     crsr.style.scale = 3;
//     crsr.style.border = "1px solid";
//   });
// });

gsap.to("#nav", {
  backgroundColor: "#000",
  height: "100px",
  duration: 0.5,

  scrollTrigger: {
    trigger: "#nav",
    srcoller: "body",
    // markers: true,
    start: "top -10px",
    end: "top -11px",
    scrub: 1,
  },
});

gsap.to("#main", {
  backgroundColor: "#000",
  scrollTrigger: {
    trigger: "#main",
    scroller: "body",
    // markers: true,
    start: "top 10%",
    end: "top -70%",
    scrub: 2,
  },
});

gsap.from("#about-us img,#about-us-in", {
  y: 90,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#about-us",
    scroller: "body",
    // markers:true,
    start: "top 70%",
    end: "top 65%",
    scrub: 4,
  },
});

gsap.from(".card", {
  scale: 0.8,
  // opacity:0,
  duration: 1,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".card",
    scroller: "body",
    // markers:false,
    start: "top 70%",
    end: "top 65%",
    scrub: 1,
  },
});

gsap.from("#page4 h1", {
  y: 50,
  scrollTrigger: {
    trigger: "#page4 h1",
    scroller: "body",
    // markers:true,
    start: "top 75%",
    end: "top 70%",
    scrub: 3,
  },
});

// ..............
// Testimonials animation
gsap.from(".testimonial", {
  x: -100,
  opacity: 0,
  duration: 1,
  stagger: 0.3,
  scrollTrigger: {
    trigger: ".testimonials-container",
    scroller: "body",
    start: "top 80%",
    end: "top 60%",
    scrub: 1
  }
});

// Add hover effect for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      scale: 1.05,
      duration: 0.3
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      scale: 1,
      duration: 0.3
    });
  });
});

// Smooth scroll for navigation
document.querySelectorAll('#nav h4').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    gsap.to(window, {
      duration: 1,
      scrollTo: target,
      ease: "power2.inOut"
    });
  });
});



const priceCards = document.querySelectorAll('.price-card');
priceCards.forEach(card => {
  // Create floating animation
  gsap.to(card, {
    y: -20,
    duration: 2,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    delay: Math.random() * 2 // Random delay for each card
  });

  // Mouse movement effect
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out"
    });
  });

  // Reset rotation when mouse leaves
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  });
});


// ------footer----
document.querySelectorAll('.footer-section ul li a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    gsap.to(link, {
      x: 5,
      color: '#95c11e',
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  link.addEventListener('mouseleave', () => {
    gsap.to(link, {
      x: 0,
      color: 'rgba(255, 255, 255, 0.8)',
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// Animate waves
gsap.to('.wave', {
  x: '-50%',
  duration: 25,
  ease: 'none',
  repeat: -1
});

// Animate contact icons pulse
const pulseTimeline = gsap.timeline({ repeat: -1 });
document.querySelectorAll('.pulse').forEach(icon => {
  pulseTimeline.to(icon, {
    scale: 1.2,
    duration: 1,
    ease: 'power1.inOut'
  }).to(icon, {
    scale: 1,
    duration: 1,
    ease: 'power1.inOut'
  });
});

// Footer logo animation
gsap.from('.footer-logo', {
  x: -100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: '.footer-logo',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1
  }
});

// Footer bottom fade in
gsap.from('.footer-bottom', {
  opacity: 0,
  y: 20,
  duration: 1,
  scrollTrigger: {
    trigger: '.footer-bottom',
    start: 'top 90%',
    end: 'top 70%',
    scrub: 1
  }
});

// Staggered animation for contact info
gsap.from('.contact-info li', {
  x: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  scrollTrigger: {
    trigger: '.contact-info',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1
  }
});

// Create hover effect for footer bottom links
document.querySelectorAll('.footer-bottom-links a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    gsap.to(link, {
      color: '#95c11e',
      y: -2,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  link.addEventListener('mouseleave', () => {
    gsap.to(link, {
      color: 'rgba(255, 255, 255, 0.6)',
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// Add parallax effect to waves
ScrollTrigger.create({
  trigger: '.premium-footer',
  start: 'top bottom',
  end: 'bottom top',
  onUpdate: self => {
    gsap.to('.wave', {
      y: self.progress * 50,
      duration: 0.5,
      ease: 'none'
    });
  }
});

// Footer Wave and Hover Animations
const initFooterAnimations = () => {
  // Wave animations
  gsap.to('#wave1', {
    x: '-50%',
    duration: 15,
    repeat: -1,
    ease: 'none'
  });

  gsap.to('#wave2', {
    x: '-45%',
    duration: 18,
    repeat: -1,
    ease: 'none',
    delay: 0.5
  });

  gsap.to('#wave3', {
    x: '-55%',
    duration: 20,
    repeat: -1,
    ease: 'none',
    delay: 1
  });

  gsap.to('#wave4', {
    x: '-48%',
    duration: 22,
    repeat: -1,
    ease: 'none',
    delay: 1.5
  });

  // Smooth reveal on scroll
  gsap.from('.footer-content', {
    y: 100,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '.premium-footer',
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    }
  });

  // Social Icons Hover Effect
  document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        y: -5,
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
      });
    });
  });

  // Navigation Links Hover Effect
  document.querySelectorAll('.footer-section ul li a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        x: 8,
        color: '#95c11e',
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        x: 0,
        color: 'rgba(255, 255, 255, 0.8)',
        duration: 0.3,
        ease: 'power2.in'
      });
    });
  });

  // Contact Info Icons Pulse
  gsap.to('.contact-info i', {
    scale: 1.2,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    stagger: {
      each: 0.2,
      repeat: -1
    }
  });

  // Wave Parallax Effect
  ScrollTrigger.create({
    trigger: '.premium-footer',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: self => {
      gsap.to('.wave', {
        y: self.progress * 30,
        duration: 0.3,
        ease: 'none'
      });
    }
  });

  // Footer Bottom Links Hover
  document.querySelectorAll('.footer-bottom-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        y: -2,
        color: '#95c11e',
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        y: 0,
        color: 'rgba(255, 255, 255, 0.6)',
        duration: 0.3,
        ease: 'power2.in'
      });
    });
  });
};

// Initialize footer animations
initFooterAnimations();

// / Add hover animation
document.addEventListener('DOMContentLoaded', () => {
  const premiumButton = document.querySelector("#page1 button");
  
  if (!premiumButton) {
    console.error("Premium button not found!");
    return;
  }

  // Create magnetic effect
  const magneticEffect = (event) => {
    const bound = premiumButton.getBoundingClientRect();
    const magneticPullX = (event.clientX - (bound.left + bound.width / 2)) * 0.2;
    const magneticPullY = (event.clientY - (bound.top + bound.height / 2)) * 0.2;
    
    gsap.to(premiumButton, {
      x: magneticPullX,
      y: magneticPullY,
      duration: 0.6,
      ease: "power3.out"
    });
  };

  // Add glowing border animation
  const glowingEffect = gsap.to(premiumButton, {
    boxShadow: "0 0 20px rgb(7, 86, 102), 0 0 40px rgba(149, 193, 30, 0.5)",
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    paused: true
  });

  // Rainbow gradient animation
  const gradientAnimation = gsap.to(premiumButton, {
    backgroundImage: "linear-gradient(45deg, #95c11e, rgb(7, 86, 102), #95c11e)",
    backgroundSize: "200% 200%",
    duration: 2,
    repeat: -1,
    ease: "none",
    paused: true
  });

  // Text animation on hover
  const textAnimation = () => {
    const text = premiumButton.textContent;
    premiumButton.textContent = '';
    
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      premiumButton.appendChild(span);
      
      gsap.to(span, {
        opacity: 1,
        y: [-20, 0],
        duration: 0.3,
        delay: i * 0.05,
        ease: "back.out"
      });
    });
  };

  // Enhanced hover effect
  premiumButton.addEventListener("mouseenter", () => {
    // Existing hover animations
    buttonTimeline.play();
    createParticles(premiumButton);
    
    // New hover animations
    glowingEffect.play();
    gradientAnimation.play();
    textAnimation();
    
    // Scale up button slightly
    gsap.to(premiumButton, {
      scale: 1.1,
      duration: 0.3,
      ease: "back.out(1.7)"
    });
  });

  // Track mouse position for magnetic effect
  document.addEventListener("mousemove", (e) => {
    const bound = premiumButton.getBoundingClientRect();
    const distance = getDistance(
      e.clientX,
      e.clientY,
      bound.left + bound.width / 2,
      bound.top + bound.height / 2
    );
    
    if (distance < 100) {
      magneticEffect(e);
    } else {
      gsap.to(premiumButton, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  });

  // Reset animations on mouse leave
  premiumButton.addEventListener("mouseleave", () => {
    buttonTimeline.reverse();
    glowingEffect.pause();
    gradientAnimation.pause();
    
    gsap.to(premiumButton, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      backgroundImage: "linear-gradient(45deg, rgb(7, 86, 102), #95c11e)"
    });
  });

  // Add click animation with ripple and burst effect
  premiumButton.addEventListener("click", (e) => {
    // Create burst effect
    for (let i = 0; i < 20; i++) {
      createBurstParticle(e, premiumButton);
    }
    
    // Add shake effect
    gsap.to(premiumButton, {
      x: "random(-5, 5)",
      y: "random(-5, 5)",
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "none",
      onComplete: () => {
        gsap.to(premiumButton, {
          x: 0,
          y: 0,
          duration: 0.2
        });
      }
    });
  });

  // Helper function to create burst particles
  function createBurstParticle(e, button) {
    const particle = document.createElement("span");
    particle.classList.add("burst-particle");
    button.appendChild(particle);

    const bound = button.getBoundingClientRect();
    const startX = e.clientX - bound.left;
    const startY = e.clientY - bound.top;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 100;
    const size = 5 + Math.random() * 5;

    gsap.set(particle, {
      x: startX,
      y: startY,
      width: size,
      height: size,
      backgroundColor: Math.random() > 0.5 ? "#95c11e" : "rgb(7, 86, 102)"
    });

    gsap.to(particle, {
      x: startX + Math.cos(angle) * velocity,
      y: startY + Math.sin(angle) * velocity,
      opacity: 0,
      duration: 0.6 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  }

  // Helper function to calculate distance between two points
  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
});

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
  .burst-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
  }
`;
document.head.appendChild(style);

// Add this function at the beginning of script.js
function updateNavButtons() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const hasConfiguredProfile = localStorage.getItem('profileConfigured') === 'true';
    const navRight = document.querySelector('.nav-right');
    
    if (isLoggedIn && hasConfiguredProfile) {
        // Show user profile button
        navRight.innerHTML = `
            <a href="profile/profile.html" class="auth-btn profile-btn">
                <i class="fas fa-user"></i> My Profile
            </a>
            <button class="auth-btn logout-btn" onclick="handleLogout()">Logout</button>
        `;
    } else if (isLoggedIn && !hasConfiguredProfile) {
        // Redirect to profile configuration
        window.location.href = 'profile/index.html';
    } else {
        // Show login/signup buttons
        navRight.innerHTML = `
            <a href="login.html"><button class="auth-btn login-btn">Login</button></a>
            <a href="signup.html"><button class="auth-btn signup-btn">Sign Up</button></a>
        `;
    }
}

// Add logout handler
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('profileConfigured');
    localStorage.removeItem('userProfile');
    updateNavButtons();
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', updateNavButtons);
