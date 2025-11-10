/**
 * TOC Navigation - Gestione navigazione Table of Contents
 * 
 * Gestisce:
 * - Smooth scroll per link dell'indice mobile (#section-index)
 * - Smooth scroll per link della sidebar desktop (#toc-sidebar)
 * - Intersection Observer per highlight dinamico delle sezioni attive
 * 
 * @version 1.0.0
 * @date 2025-01-XX
 */

(function() {
  'use strict';

  /**
   * Inizializza smooth scroll per i link dell'indice mobile
   */
  function initMobileTOC() {
    const toc = document.getElementById('section-index');
    if (!toc) return;

    toc.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          try { 
            history.replaceState(null, '', a.getAttribute('href')); 
          } catch { }
        }
      });
    });
  }

  /**
   * Inizializza smooth scroll e Intersection Observer per la sidebar desktop
   */
  function initSidebarTOC() {
    const sidebar = document.getElementById('toc-sidebar');
    const sidebarLinks = sidebar?.querySelectorAll('.toc-sidebar-link');
    const sections = [];

    if (!sidebar || !sidebarLinks || sidebarLinks.length === 0) {
      return;
    }

    // Raccogli tutte le sezioni
    sidebarLinks.forEach(link => {
      const sectionId = link.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (section) {
        sections.push({ link, section, id: sectionId });
      }
    });

    // Smooth scroll per i link della sidebar
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80; // Offset per navbar
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Aggiorna URL senza ricaricare
          try {
            history.replaceState(null, '', targetId);
          } catch {}
        }
      });
    });

    // Intersection Observer per highlight dinamico
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger quando sezione è nel terzo superiore della viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const correspondingLink = sidebar.querySelector(`[data-section="${sectionId}"]`);
          
          if (correspondingLink) {
            // Rimuovi active da tutti i link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Aggiungi active al link corrispondente
            correspondingLink.classList.add('active');
            
            // Scroll della sidebar per mantenere il link visibile
            const linkRect = correspondingLink.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();
            
            if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
              correspondingLink.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
              });
            }
          }
        }
      });
    }, observerOptions);

    // Osserva tutte le sezioni
    sections.forEach(({ section }) => {
      observer.observe(section);
    });

    // Evidenzia la prima sezione visibile all'avvio
    function highlightFirstVisible() {
      for (const { link, section } of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight * 0.5) {
          sidebarLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          return;
        }
      }
    }

    // Esegui all'avvio e dopo un piccolo delay per assicurarsi che tutto sia caricato
    setTimeout(highlightFirstVisible, 100);
    window.addEventListener('load', highlightFirstVisible);
  }

  /**
   * Inizializza tutto il sistema TOC
   */
  function init() {
    initMobileTOC();
    initSidebarTOC();
  }

  // API pubblica
  window.TOCNavigation = {
    init: init,
    initMobile: initMobileTOC,
    initSidebar: initSidebarTOC
  };

  // Auto-inizializza quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('✅ js/features/toc-navigation.js caricato - TOC Navigation inizializzato');
})();

