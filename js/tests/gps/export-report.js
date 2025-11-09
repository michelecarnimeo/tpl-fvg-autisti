/**
 * GPS Export Report Module
 * Export report GPS in formato JSON/TXT
 * 
 * @module js/tests/gps/export-report
 * @version 1.0.0
 * @date 09/11/2025
 */

(function() {
  'use strict';

  // Verifica dipendenze
  if (typeof window.GPSFakePosition === 'undefined') {
    console.warn('⚠️ GPSFakePosition non disponibile, alcuni dati fake position potrebbero non essere disponibili');
  }

  /**
   * Genera dati report GPS
   * @returns {Promise<Object>} Dati report
   */
  async function generateReportData() {
    const reportData = {
      timestamp: new Date().toISOString(),
      timestampReadable: new Date().toLocaleString('it-IT'),
      device: {
        type: document.getElementById('device-type')?.textContent || 'N/A',
        os: document.getElementById('device-os')?.textContent || 'N/A',
        browser: document.getElementById('device-browser')?.textContent || 'N/A',
        battery: document.getElementById('device-battery')?.textContent || 'N/A',
        gpsSupport: document.getElementById('device-gps')?.textContent || 'N/A',
        viewport: document.getElementById('device-viewport')?.textContent || 'N/A',
        touchSupport: document.getElementById('device-touch')?.textContent || 'N/A',
        pwaMode: document.getElementById('device-pwa')?.textContent || 'N/A',
        userAgent: navigator.userAgent,
        screen: window.screen ? `${window.screen.width}x${window.screen.height}` : 'N/A',
        pixelRatio: window.devicePixelRatio || 'N/A'
      },
      gps: {
        permissionStatus: document.getElementById('geo-permission-text')?.textContent || 'N/A',
        lastPosition: null,
        fakePositionActive: localStorage.getItem('tpl.useFakePosition') === 'true',
        fakePositionData: null
      }
    };

    // Recupera dati fake position se disponibili
    if (reportData.gps.fakePositionActive) {
      const fakePositionData = localStorage.getItem('tpl.fakePositionData');
      if (fakePositionData) {
        try {
          reportData.gps.fakePositionData = JSON.parse(fakePositionData);
        } catch (e) {
          console.warn('⚠️ Errore nel parsing fake position data:', e);
        }
      }
    }

    // Prova a ottenere posizione corrente
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000
          });
        });

        reportData.gps.lastPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date(position.timestamp).toLocaleString('it-IT')
        };
      } catch (e) {
        reportData.gps.lastPosition = { error: 'Impossibile rilevare posizione' };
      }
    }

    return reportData;
  }

  /**
   * Formatta report in JSON
   * @param {Object} data - Dati report
   * @returns {string} Report formattato in JSON
   */
  function formatReportJSON(data) {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Formatta report in TXT
   * @param {Object} data - Dati report
   * @returns {string} Report formattato in TXT
   */
  function formatReportTXT(data) {
    return `
========================================
  📍 REPORT TEST GPS - TPL FVG
========================================

Data e Ora: ${data.timestampReadable}

========================================
  📱 INFORMAZIONI DEVICE
========================================

Device Type:        ${data.device.type}
Sistema Operativo:  ${data.device.os}
Browser:            ${data.device.browser}
Batteria:           ${data.device.battery}
Supporto GPS:       ${data.device.gpsSupport}

Screen:             ${data.device.screen}
Viewport:           ${data.device.viewport}
Pixel Ratio:        ${data.device.pixelRatio}
Touch Support:      ${data.device.touchSupport}
PWA Mode:           ${data.device.pwaMode}

User Agent:
${data.device.userAgent}

========================================
  🛰️ INFORMAZIONI GPS
========================================

Permission Status:  ${data.gps.permissionStatus}
Fake Position:      ${data.gps.fakePositionActive ? 'Attiva' : 'Inattiva'}

${data.gps.lastPosition && !data.gps.lastPosition.error ? `
--- ULTIMA POSIZIONE ---
Latitudine:         ${data.gps.lastPosition.latitude}°
Longitudine:        ${data.gps.lastPosition.longitude}°
Accuratezza:        ±${data.gps.lastPosition.accuracy}m
Altitudine:         ${data.gps.lastPosition.altitude !== null ? data.gps.lastPosition.altitude + 'm' : 'N/A'}
Velocità:           ${data.gps.lastPosition.speed !== null ? (data.gps.lastPosition.speed * 3.6).toFixed(1) + ' km/h' : 'N/A'}
Direzione:          ${data.gps.lastPosition.heading !== null ? data.gps.lastPosition.heading + '°' : 'N/A'}
Timestamp:          ${data.gps.lastPosition.timestamp}
` : `
--- ULTIMA POSIZIONE ---
${data.gps.lastPosition?.error || 'Non disponibile'}
`}

${data.gps.fakePositionActive && data.gps.fakePositionData ? `
--- FAKE POSITION DATA ---
${JSON.stringify(data.gps.fakePositionData, null, 2)}
` : ''}

========================================
  📊 FINE REPORT
========================================
    `.trim();
  }

  /**
   * Scarica file
   * @param {string} content - Contenuto file
   * @param {string} filename - Nome file
   * @param {string} mimeType - Tipo MIME
   */
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export report GPS
   * @param {string} format - Formato report ('json' o 'txt')
   * @returns {Promise<void>}
   */
  async function exportGPSReport(format) {
    if (format !== 'json' && format !== 'txt') {
      console.error('❌ Formato non valido. Usa "json" o "txt"');
      return;
    }

    try {
      // Genera dati report
      const reportData = await generateReportData();

      // Formatta contenuto
      let content, filename, mimeType;
      if (format === 'json') {
        content = formatReportJSON(reportData);
        filename = `gps-report-${Date.now()}.json`;
        mimeType = 'application/json';
      } else {
        content = formatReportTXT(reportData);
        filename = `gps-report-${Date.now()}.txt`;
        mimeType = 'text/plain';
      }

      // Scarica file
      downloadFile(content, filename, mimeType);

      // Feedback visivo
      const btnId = format === 'json' ? 'export-json-btn' : 'export-txt-btn';
      const btn = document.getElementById(btnId);
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Scaricato!';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Errore durante export report:', error);
    }
  }

  // API Pubblica
  window.GPSExportReport = {
    export: exportGPSReport,
    generateData: generateReportData,
    formatJSON: formatReportJSON,
    formatTXT: formatReportTXT,
    download: downloadFile
  };

  console.log('✅ js/tests/gps/export-report.js caricato - GPSExportReport disponibile');

})();

