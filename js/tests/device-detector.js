/**
 * js/tests/device-detector.js
 *
 * Device Detection Module
 * Rileva e aggiorna informazioni su device, OS, browser, batteria, GPS, touch, PWA
 *
 * Funzionalità:
 * - Rilevamento tipo device (Desktop/Mobile/Tablet)
 * - Rilevamento OS (Windows, macOS, Android, iOS, Linux)
 * - Rilevamento Browser (Chrome, Firefox, Safari, Edge, Opera)
 * - Gestione batteria (livello, stato carica, aggiornamento colore card)
 * - Rilevamento supporto GPS
 * - Rilevamento supporto touch
 * - Rilevamento PWA mode (standalone, minimal-ui, fullscreen)
 *
 * API Pubblica: window.DeviceDetector
 */

(function () {
  'use strict';

  /**
   * Aggiorna colore card batteria in base a livello e stato carica
   * @param {number} level - Livello batteria (0-100)
   * @param {boolean} isCharging - Se la batteria è in carica
   * @param {boolean} isSupported - Se l'API batteria è supportata
   */
  function updateBatteryCardColor(level, isCharging, isSupported) {
    const batteryCard = document.getElementById('device-battery')?.closest('.device-info-card');
    if (!batteryCard) return;

    if (!isSupported) {
      batteryCard.setAttribute('data-color', 'gray');
    } else if (isCharging) {
      batteryCard.setAttribute('data-color', 'green');
    } else if (level >= 50) {
      batteryCard.setAttribute('data-color', 'green');
    } else if (level >= 20) {
      batteryCard.setAttribute('data-color', 'orange');
    } else {
      batteryCard.setAttribute('data-color', 'red');
    }
  }

  /**
   * Aggiorna stato PWA mode
   */
  function updatePWAMode() {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator.standalone === true);
    const pwaEl = document.getElementById('device-pwa');
    const pwaCard = pwaEl?.closest('.device-info-card');

    if (pwaEl) {
      pwaEl.textContent = isPWA ? '✅ Sì' : '❌ No';
      // Cambia colore card: verde se "Sì", grigio se "No"
      if (pwaCard) {
        pwaCard.setAttribute('data-color', isPWA ? 'green' : 'gray');
      }
    }
  }

  /**
   * Rileva e aggiorna tutte le informazioni del device
   */
  function detectDeviceInfo() {
    const ua = navigator.userAgent;

    // === Device Type ===
    let deviceType = '💻 Desktop';
    if (/Mobile|Android|iPhone/i.test(ua)) {
      deviceType = '📱 Mobile';
    } else if (/Tablet|iPad/i.test(ua)) {
      deviceType = '📱 Tablet';
    }
    const deviceTypeEl = document.getElementById('device-type');
    if (deviceTypeEl) {
      deviceTypeEl.textContent = deviceType;
    }

    // === OS ===
    let os = 'Sconosciuto';
    if (/Windows NT 10/i.test(ua)) os = '🪟 Windows 10/11';
    else if (/Windows NT 6.3/i.test(ua)) os = '🪟 Windows 8.1';
    else if (/Windows NT 6.2/i.test(ua)) os = '🪟 Windows 8';
    else if (/Windows NT 6.1/i.test(ua)) os = '🪟 Windows 7';
    else if (/Windows/i.test(ua)) os = '🪟 Windows';
    else if (/Mac OS X 10[._](\d+)/i.test(ua)) {
      const version = ua.match(/Mac OS X 10[._](\d+)/i)[1];
      os = `🍎 macOS 10.${version}`;
    } else if (/Mac/i.test(ua)) os = '🍎 macOS';
    else if (/Android (\d+)/i.test(ua)) {
      const version = ua.match(/Android (\d+)/i)[1];
      os = `🤖 Android ${version}`;
    } else if (/Android/i.test(ua)) os = '🤖 Android';
    else if (/iPhone OS (\d+)/i.test(ua)) {
      const version = ua.match(/iPhone OS (\d+)/i)[1];
      os = `📱 iOS ${version}`;
    } else if (/iPad.*OS (\d+)/i.test(ua)) {
      const version = ua.match(/iPad.*OS (\d+)/i)[1];
      os = `📱 iPadOS ${version}`;
    } else if (/Linux/i.test(ua)) os = '🐧 Linux';
    const osEl = document.getElementById('device-os');
    if (osEl) {
      osEl.textContent = os;
    }

    // === Browser ===
    let browser = 'Sconosciuto';
    if (/Edg\//i.test(ua)) {
      const version = ua.match(/Edg\/(\d+)/i)[1];
      browser = `Edge ${version}`;
    } else if (/Chrome\//i.test(ua) && !/Edg/i.test(ua)) {
      const version = ua.match(/Chrome\/(\d+)/i)[1];
      browser = `Chrome ${version}`;
    } else if (/Firefox\//i.test(ua)) {
      const version = ua.match(/Firefox\/(\d+)/i)[1];
      browser = `Firefox ${version}`;
    } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
      const version = ua.match(/Version\/(\d+)/i);
      browser = version ? `Safari ${version[1]}` : 'Safari';
    } else if (/Opera|OPR\//i.test(ua)) {
      browser = 'Opera';
    }
    const browserEl = document.getElementById('device-browser');
    if (browserEl) {
      browserEl.textContent = browser;
    }

    // === Battery ===
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const level = Math.round(battery.level * 100);
        const charging = battery.charging ? '🔌 In carica' : '🔋';
        const batteryEl = document.getElementById('device-battery');
        if (batteryEl) {
          batteryEl.textContent = `${charging} ${level}%`;
          updateBatteryCardColor(level, battery.charging, true);
        }

        // Aggiorna su cambio batteria
        battery.addEventListener('levelchange', () => {
          const newLevel = Math.round(battery.level * 100);
          const newCharging = battery.charging ? '🔌 In carica' : '🔋';
          const batteryEl = document.getElementById('device-battery');
          if (batteryEl) {
            batteryEl.textContent = `${newCharging} ${newLevel}%`;
            updateBatteryCardColor(newLevel, battery.charging, true);
          }
        });

        battery.addEventListener('chargingchange', () => {
          const currentLevel = Math.round(battery.level * 100);
          const isCharging = battery.charging ? '🔌 In carica' : '🔋';
          const batteryEl = document.getElementById('device-battery');
          if (batteryEl) {
            batteryEl.textContent = `${isCharging} ${currentLevel}%`;
            updateBatteryCardColor(currentLevel, battery.charging, true);
          }
        });
      });
    } else {
      const batteryEl = document.getElementById('device-battery');
      if (batteryEl) {
        batteryEl.textContent = 'Non supportato';
        updateBatteryCardColor(0, false, false);
      }
    }

    // === GPS Support ===
    const hasGPS = 'geolocation' in navigator;
    const gpsEl = document.getElementById('device-gps');
    const gpsCard = gpsEl?.closest('.device-info-card');

    if (gpsEl) {
      gpsEl.textContent = hasGPS ? '✅ Supportato' : '❌ Non supportato';
      // Cambia colore card: verde se supportato, grigio se non supportato
      if (gpsCard) {
        gpsCard.setAttribute('data-color', hasGPS ? 'green' : 'gray');
      }
    }

    // === Dettagli Tecnici ===
    // Touch Support
    const touchSupport = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const touchEl = document.getElementById('device-touch');
    const touchCard = touchEl?.closest('.device-info-card');

    if (touchEl) {
      touchEl.textContent = touchSupport ? '✅ Sì' : '❌ No';
      // Cambia colore card: verde se "Sì", grigio se "No"
      if (touchCard) {
        touchCard.setAttribute('data-color', touchSupport ? 'green' : 'gray');
      }
    }

    // PWA Mode - aggiorna inizialmente
    updatePWAMode();

    // Listener per aggiornare PWA Mode quando cambia display-mode (installazione/disinstallazione)
    if (window.matchMedia) {
      const standaloneQuery = window.matchMedia('(display-mode: standalone)');
      const minimalUIQuery = window.matchMedia('(display-mode: minimal-ui)');
      const fullscreenQuery = window.matchMedia('(display-mode: fullscreen)');

      // Ascolta cambiamenti (usando addEventListener se supportato, altrimenti addListener per compatibilità)
      if (standaloneQuery.addEventListener) {
        standaloneQuery.addEventListener('change', updatePWAMode);
        minimalUIQuery.addEventListener('change', updatePWAMode);
        fullscreenQuery.addEventListener('change', updatePWAMode);
      } else if (standaloneQuery.addListener) {
        // Fallback per browser più vecchi
        standaloneQuery.addListener(updatePWAMode);
        minimalUIQuery.addListener(updatePWAMode);
        fullscreenQuery.addListener(updatePWAMode);
      }
    }

    // Ascolta anche eventi di installazione PWA (se supportati)
    window.addEventListener('appinstalled', () => {
      console.log('📲 PWA installata - aggiorno stato');
      setTimeout(updatePWAMode, 100); // Piccolo delay per permettere al browser di aggiornare display-mode
    });
  }

  // API Pubblica
  window.DeviceDetector = {
    detect: detectDeviceInfo,
    updateBatteryCardColor: updateBatteryCardColor,
    updatePWAMode: updatePWAMode
  };

  console.log('✅ js/tests/device-detector.js caricato - DeviceDetector disponibile');

  // Auto-inizializza quando DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      detectDeviceInfo();
    });
  } else {
    // DOM già caricato
    detectDeviceInfo();
  }
})();

