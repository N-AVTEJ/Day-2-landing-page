/**
 * NEXORA Landing Page — Client Script
 * Day 2 of 100 Web Projects YouTube Challenge
 * 
 * Scope (Prompt 1):
 * - Sticky navigation scroll observer
 * - Smooth anchor link navigation offset handler
 * - Foundation preparation for Prompt 2 (Mobile Menu & FAQ Accordions)
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');

  // 1. Sticky Navigation Scroll Elevation
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial check on load
  handleScroll();

  // 2. Smooth Navigation with Header Offset for Anchors
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Mobile menu and interactive FAQ accordion logic will be integrated in Prompt 2.
});
