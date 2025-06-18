
document.addEventListener("DOMContentLoaded", () => {
  
  gsap.from(".site-header", {
    duration: 1,
    y: -100,
    opacity: 0,
    ease: "power2.out"
  });

  
  gsap.from("h1", {
    duration: 1,
    y: 50,
    opacity: 0,
    delay: 0.5,
    ease: "power2.out"
  });

  
  gsap.from(".card", {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    delay: 1,
    ease: "power2.out"
  });

  
  gsap.from(".bottom-section", {
    duration: 1,
    y: 50,
    opacity: 0,
    delay: 1.5,
    ease: "power2.out"
  });

 
  gsap.from("footer", {
    duration: 1,
    y: 50,
    opacity: 0,
    delay: 2,
    ease: "power2.out"
  });
});
