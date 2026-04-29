document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.style.display = 'none', 500);
  }, 2000);

  // 2. Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Typewriter Effect
  const words = ["Public Figure", "Community Leader", "Visionary Activist", "Voice of 190, Lambhua, Sultanpur"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriter = document.getElementById('typewriter');

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriter.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriter.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }
  type();

  // 4. Counter Animation
  const stats = document.querySelectorAll('.stat-num');
  const animateStats = () => {
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const count = +stat.innerText;
      const speed = target / 100;
      if (count < target) {
        stat.innerText = Math.ceil(count + speed);
        setTimeout(animateStats, 30);
      } else {
        stat.innerText = target;
      }
    });
  };

  // Intersection Observer for stats
  const observerOptions = { threshold: 0.5 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);

  // 5. Testimonial Slider
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const dotsContainer = document.getElementById('sliderDots');

  let currentSlide = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  }

  function goToSlide(index) {
    currentSlide = index;
    const size = slides[0].clientWidth + 32; // Include gap
    track.style.transform = `translateX(${-currentSlide * size}px)`;
    updateDots();
  }

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
  });

  // 6. Particle Canvas
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray = [];
  const numberOfParticles = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    draw() {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();

  // 7. Form Submission
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      contactForm.reset();
      btn.innerText = "Message Sent!";
      successMsg.style.display = 'block';
      setTimeout(() => {
        successMsg.style.display = 'none';
        btn.innerText = "Send Message";
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });

  // 8. Back to Top
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 9. Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
});
