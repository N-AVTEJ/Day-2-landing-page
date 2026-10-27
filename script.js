/**
 * NEXORA Landing Page — JavaScript Functionality & Interactive Features
 * Day 2 of 100 Web Projects YouTube Challenge (Prompt 2 of 3)
 * 
 * Modules:
 * 1. Responsive Mobile Drawer Navigation
 * 2. Smooth Scrolling with Sticky Header Offset
 * 3. Active Section Scroll Spy (IntersectionObserver)
 * 4. WAI-ARIA Accessible FAQ Accordion
 * 5. Interactive Product Showcase Dashboard Tabs
 * 6. Floating Back-to-Top Button
 * 7. Demonstration Modal Dialog (Sign In, Pricing Tiers, Placeholders)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Helpers & Preferences ---//
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('navbar');
  const getHeaderHeight = () => (header ? header.offsetHeight : 72);

  // =========================================================================
  // 1. Responsive Mobile Drawer Navigation
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  const navBackdrop = document.getElementById('nav-backdrop');

  const openMobileMenu = () => {
    if (!mobileToggle || !mainNav) return;
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.setAttribute('aria-label', 'Close navigation menu');
    mainNav.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('menu-open');
  };

  const closeMobileMenu = () => {
    if (!mobileToggle || !mainNav) return;
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    mainNav.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  const isMobileMenuOpen = () => mainNav && mainNav.classList.contains('open');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (isMobileMenuOpen()) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close when backdrop is clicked
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close when pressing Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (isMobileMenuOpen()) {
        closeMobileMenu();
        if (mobileToggle) mobileToggle.focus();
      }
    }
  });

  // Automatically reset mobile menu state when viewport expands above 768px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMobileMenuOpen()) {
      closeMobileMenu();
    }
  });

  // =========================================================================
  // 2. Smooth Scrolling with Sticky Header Offset
  // =========================================================================
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetHash = link.getAttribute('href');
      if (!targetHash || targetHash === '#' || targetHash === '#demo') return;

      const targetSection = document.querySelector(targetHash);
      if (targetSection) {
        event.preventDefault();

        // Close mobile menu if link was clicked inside it
        if (isMobileMenuOpen()) {
          closeMobileMenu();
        }

        const headerOffset = getHeaderHeight() + 16;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Update URL hash without abrupt jumping
        if (history.pushState) {
          history.pushState(null, '', targetHash);
        }

        // Set accessibility focus on target section
        targetSection.setAttribute('tabindex', '-1');
        targetSection.focus({ preventScroll: true });
      }
    });
  });

  // Sticky header elevation on scroll
  const handleHeaderElevation = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderElevation, { passive: true });
  handleHeaderElevation();

  // =========================================================================
  // 3. Active Section Scroll Spy (IntersectionObserver)
  // =========================================================================
  const sectionIds = ['product', 'features', 'how-it-works', 'preview', 'pricing', 'faq'];
  const navLinksMap = new Map();

  sectionIds.forEach((id) => {
    const link = document.getElementById(`nav-${id}`);
    if (link) {
      navLinksMap.set(id, link);
    }
  });

  if ('IntersectionObserver' in window) {
    const sectionObserverOptions = {
      root: null,
      rootMargin: `-${getHeaderHeight() + 20}px 0px -50% 0px`,
      threshold: [0, 0.2, 0.5]
    };

    let activeSectionId = null;

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSectionId = entry.target.id;
        }
      });

      if (activeSectionId) {
        navLinksMap.forEach((link, id) => {
          if (id === activeSectionId) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    }, sectionObserverOptions);

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  // =========================================================================
  // 4. WAI-ARIA Accessible FAQ Accordion
  // =========================================================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const targetPanel = document.getElementById(panelId);

      // Single-open accordion pattern: close all other items first
      faqTriggers.forEach((otherTrigger) => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.hidden = true;
          }
        }
      });

      // Toggle clicked item
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        if (targetPanel) targetPanel.hidden = true;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        if (targetPanel) targetPanel.hidden = false;
      }
    });
  });

  // =========================================================================
  // 5. Interactive Product Showcase Dashboard Tabs
  // =========================================================================
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const showcasePanels = document.querySelectorAll('.showcase-panel');

  const activateTab = (tabToActivate) => {
    if (!tabToActivate) return;
    const targetPanelId = tabToActivate.getAttribute('aria-controls');

    showcaseTabs.forEach((tab) => {
      const isCurrent = tab === tabToActivate;
      tab.classList.toggle('active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      tab.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });

    showcasePanels.forEach((panel) => {
      if (panel.id === targetPanelId) {
        panel.hidden = false;
        panel.classList.add('active');
      } else {
        panel.hidden = true;
        panel.classList.remove('active');
      }
    });
  };

  showcaseTabs.forEach((tab, index) => {
    // Click activation
    tab.addEventListener('click', () => activateTab(tab));

    // Keyboard navigation (WAI-ARIA Tabs pattern)
    tab.addEventListener('keydown', (event) => {
      let targetIndex = null;

      if (event.key === 'ArrowRight') {
        targetIndex = (index + 1) % showcaseTabs.length;
      } else if (event.key === 'ArrowLeft') {
        targetIndex = (index - 1 + showcaseTabs.length) % showcaseTabs.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = showcaseTabs.length - 1;
      }

      if (targetIndex !== null) {
        event.preventDefault();
        const nextTab = showcaseTabs[targetIndex];
        nextTab.focus();
        activateTab(nextTab);
      }
    });
  });

  // =========================================================================
  // 6. Floating Back-to-Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  const handleBackToTopVisibility = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 380) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
  handleBackToTopVisibility();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      // Return focus to brand logo at the top
      const brandLogo = document.querySelector('.brand');
      if (brandLogo) brandLogo.focus();
    });
  }

  // =========================================================================
  // 7. Demonstration Modal Dialog (Sign In, Pricing Tiers, Placeholders)
  // =========================================================================
  const demoModal = document.getElementById('demo-modal');
  const demoModalTitle = document.getElementById('demo-modal-title');
  const demoModalDesc = document.getElementById('demo-modal-desc');
  const demoModalCloseBtn = document.getElementById('demo-modal-close-btn');
  const demoModalOkBtn = document.getElementById('demo-modal-ok-btn');
  let previouslyFocusedElement = null;

  const openDemoModal = (title, message) => {
    if (!demoModal) return;
    previouslyFocusedElement = document.activeElement;

    if (demoModalTitle && title) demoModalTitle.textContent = title;
    if (demoModalDesc && message) demoModalDesc.textContent = message;

    demoModal.hidden = false;
    document.body.classList.add('menu-open');

    // Focus OK button for accessible keyboard flow
    setTimeout(() => {
      if (demoModalOkBtn) demoModalOkBtn.focus();
    }, 50);
  };

  const closeDemoModal = () => {
    if (!demoModal || demoModal.hidden) return;
    demoModal.hidden = true;
    document.body.classList.remove('menu-open');

    // Restore focus to triggering control
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  };

  if (demoModalCloseBtn) demoModalCloseBtn.addEventListener('click', closeDemoModal);
  if (demoModalOkBtn) demoModalOkBtn.addEventListener('click', closeDemoModal);

  // Close modal when clicking on backdrop
  if (demoModal) {
    demoModal.addEventListener('click', (event) => {
      if (event.target === demoModal) {
        closeDemoModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && demoModal && !demoModal.hidden) {
      closeDemoModal();
    }
  });

  // Attach Demonstration Trigger to "Sign In" buttons
  const authButtons = document.querySelectorAll('.demo-auth-btn');
  authButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      if (isMobileMenuOpen()) closeMobileMenu();
      openDemoModal(
        'Demonstration Environment',
        'Authentication is simulated for this Day 2 portfolio showcase. No login credentials or sign-in database are required to experience the full interface.'
      );
    });
  });

  // Attach Demonstration Trigger to Pricing Plan Buttons
  const planButtons = document.querySelectorAll('.demo-plan-btn');
  planButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const planName = btn.getAttribute('data-plan') || 'NEXORA';
      const planPrice = btn.getAttribute('data-price') || 'Selected';
      openDemoModal(
        `${planName} Plan Selected (${planPrice})`,
        `You chose the ${planName} Plan tier. All plans, prices, and features are fictional demonstration content created for Day 2 of the 100 Web Projects challenge. No credit card or payment checkout is processed.`
      );
    });
  });

  // Attach Demonstration Trigger to External Placeholder Links
  const placeholderLinks = document.querySelectorAll('.demo-external-link');
  placeholderLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const linkLabel = link.getAttribute('aria-label') || link.textContent.trim();
      openDemoModal(
        'Demonstration Link',
        `"${linkLabel}" is an illustrative demonstration link for this portfolio project. Genuine external profiles and legal agreements are intentionally not connected.`
      );
    });
  });

});
