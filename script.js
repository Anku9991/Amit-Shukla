document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  window.setTimeout(() => preloader?.classList.add("done"), 900);

  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    navbar?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 640);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  menuToggle?.addEventListener("click", () => {
    const open = navLinks?.classList.toggle("open");
    menuToggle.classList.toggle("active", Boolean(open));
    menuToggle.setAttribute("aria-expanded", String(Boolean(open)));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("open");
      menuToggle?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.38 });

  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const duration = 1500;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN");
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.75 });

  counters.forEach((counter) => counterObserver.observe(counter));

  const tiltCards = document.querySelectorAll("[data-tilt]");
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 5}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const track = document.getElementById("testimonialTrack");
  const prev = document.getElementById("prevTestimonial");
  const next = document.getElementById("nextTestimonial");
  let testimonialIndex = 0;

  const updateTestimonials = () => {
    if (!track) return;
    const card = track.querySelector(".testimonial-card");
    if (!card) return;
    const gap = 16;
    const offset = testimonialIndex * (card.clientWidth + gap);
    track.style.transform = `translateX(${-offset}px)`;
  };

  next?.addEventListener("click", () => {
    const total = track?.querySelectorAll(".testimonial-card").length || 1;
    testimonialIndex = (testimonialIndex + 1) % total;
    updateTestimonials();
  });

  prev?.addEventListener("click", () => {
    const total = track?.querySelectorAll(".testimonial-card").length || 1;
    testimonialIndex = (testimonialIndex - 1 + total) % total;
    updateTestimonials();
  });

  window.addEventListener("resize", updateTestimonials, { passive: true });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = document.getElementById("closeLightbox");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = item.dataset.full || "";
      lightboxImage.alt = item.querySelector("img")?.alt || "गैलरी फोटो";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  const hideLightbox = () => {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
  };

  closeLightbox?.addEventListener("click", hideLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) hideLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideLightbox();
  });

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    if (!button || !formStatus) return;

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const subject = document.getElementById("subject")?.value.trim() || "संपर्क संदेश";
    const message = document.getElementById("message")?.value.trim() || "";
    const whatsappMessage = [
      "नमस्ते अमित जी,",
      "",
      `नाम: ${name}`,
      `ईमेल: ${email}`,
      `विषय: ${subject}`,
      "",
      `संदेश: ${message}`
    ].join("\n");

    window.open(`https://wa.me/919455541616?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener");
    formStatus.textContent = "WhatsApp खुल गया है। कृपया वहां संदेश भेजें।";
  });

  initDepthCanvas();
});

function initDepthCanvas() {
  const canvas = document.getElementById("depthCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles.length = 0;
    const count = Math.max(34, Math.min(90, Math.floor(width / 18)));
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
        size: Math.random() * 2.2 + 0.7,
        drift: Math.random() * 0.35 + 0.08,
        hue: Math.random() > 0.55 ? "247, 189, 85" : "22, 163, 74"
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y -= particle.drift * particle.z;
      particle.x += Math.sin((particle.y + particle.x) * 0.004) * 0.28;

      if (particle.y < -20) {
        particle.y = height + 20;
        particle.x = Math.random() * width;
      }

      const alpha = 0.12 + particle.z * 0.3;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${particle.hue}, ${alpha})`;
      ctx.arc(particle.x, particle.y, particle.size * particle.z, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resize();
    draw();
  }, { passive: true });
}
