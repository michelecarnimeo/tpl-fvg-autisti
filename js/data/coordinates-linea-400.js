/**
 * 🗺️ Coordinate GPS Reali - Linea 400 Udine-Grado
 * 
 * Coordinate geografiche delle 16 fermate della linea bus TPL FVG
 * Linea 400: Udine → Grado
 * 
 * Fonte: Google Maps / OpenStreetMap
 * @version 1.0.0
 * @date 17 Novembre 2025
 */

(function() {
  'use strict';

  /**
   * Coordinate GPS delle fermate Linea 400
   * Array ordinato da Udine a Grado (andata)
   */
  const coordinatesLinea400 = [
    {
      nome: "Udine",
      lat: 46.0619,
      lng: 13.2450,
      descrizione: "Autostazione Udine, Via Europa Unita"
    },
    {
      nome: "Lauzacco",
      lat: 45.9847,
      lng: 13.2797,
      descrizione: "Lauzacco, fermata principale"
    },
    {
      nome: "S. Stefano Udinese",
      lat: 45.9625,
      lng: 13.3064,
      descrizione: "San Stefano Udinese, centro paese"
    },
    {
      nome: "S. Maria La Longa",
      lat: 45.9367,
      lng: 13.3383,
      descrizione: "Santa Maria La Longa, piazza principale"
    },
    {
      nome: "Mereto Di Capitolo",
      lat: 45.9272,
      lng: 13.3653,
      descrizione: "Mereto Di Capitolo, centro"
    },
    {
      nome: "Palmanova",
      lat: 45.9053,
      lng: 13.3106,
      descrizione: "Palmanova, Città Fortezza UNESCO"
    },
    {
      nome: "Sevegliano",
      lat: 45.8872,
      lng: 13.3317,
      descrizione: "Sevegliano, frazione di Bagnaria Arsa"
    },
    {
      nome: "Strassoldo",
      lat: 45.8728,
      lng: 13.3444,
      descrizione: "Strassoldo, frazione di Cervignano"
    },
    {
      nome: "Muscoli",
      lat: 45.8619,
      lng: 13.3506,
      descrizione: "Muscoli, frazione di Cervignano"
    },
    {
      nome: "Cervignano SS14",
      lat: 45.8342,
      lng: 13.3419,
      descrizione: "Cervignano, Strada Statale 14"
    },
    {
      nome: "Cervignano FS",
      lat: 45.8233,
      lng: 13.3367,
      descrizione: "Cervignano, Stazione Ferroviaria"
    },
    {
      nome: "Cervignano AUT",
      lat: 45.8211,
      lng: 13.3428,
      descrizione: "Cervignano, Autostazione"
    },
    {
      nome: "Terzo Di Aquileia",
      lat: 45.7900,
      lng: 13.3503,
      descrizione: "Terzo di Aquileia, centro paese"
    },
    {
      nome: "Aquileia",
      lat: 45.7706,
      lng: 13.3686,
      descrizione: "Aquileia, Area Archeologica"
    },
    {
      nome: "Belvedere",
      lat: 45.7339,
      lng: 13.3942,
      descrizione: "Belvedere, frazione di Grado"
    },
    {
      nome: "Grado",
      lat: 45.6781,
      lng: 13.3972,
      descrizione: "Grado, Autostazione - Città Termale"
    }
  ];

  /**
   * Ottiene le coordinate per una fermata specifica
   * @param {string} nomeFermata - Nome della fermata
   * @returns {Object|null} Oggetto con lat, lng, descrizione o null se non trovato
   */
  function getCoordinates(nomeFermata) {
    const fermata = coordinatesLinea400.find(f => 
      f.nome.toLowerCase() === nomeFermata.toLowerCase() ||
      f.nome.toLowerCase().includes(nomeFermata.toLowerCase())
    );
    return fermata || null;
  }

  /**
   * Ottiene tutte le coordinate della linea
   * @returns {Array} Array di oggetti con nome, lat, lng, descrizione
   */
  function getAllCoordinates() {
    return [...coordinatesLinea400];
  }

  /**
   * Verifica se una fermata ha coordinate
   * @param {string} nomeFermata - Nome della fermata
   * @returns {boolean} True se ha coordinate, false altrimenti
   */
  function hasCoordinates(nomeFermata) {
    return getCoordinates(nomeFermata) !== null;
  }

  /**
   * Calcola bounds (limiti geografici) per tutta la linea
   * @returns {Array} [[minLat, minLng], [maxLat, maxLng]]
   */
  function getLineBounds() {
    const lats = coordinatesLinea400.map(f => f.lat);
    const lngs = coordinatesLinea400.map(f => f.lng);
    
    return [
      [Math.min(...lats), Math.min(...lngs)], // Sud-Ovest
      [Math.max(...lats), Math.max(...lngs)]  // Nord-Est
    ];
  }

  /**
   * Calcola centro geografico della linea
   * @returns {Object} {lat, lng}
   */
  function getLineCenter() {
    const lats = coordinatesLinea400.map(f => f.lat);
    const lngs = coordinatesLinea400.map(f => f.lng);
    
    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
    };
  }

  // Esponi API pubblica
  window.CoordinatesLinea400 = {
    data: coordinatesLinea400,
    get: getCoordinates,
    getAll: getAllCoordinates,
    has: hasCoordinates,
    getBounds: getLineBounds,
    getCenter: getLineCenter,
    count: coordinatesLinea400.length
  };

  console.log('🗺️ Coordinate Linea 400 caricateI:', coordinatesLinea400.length, 'fermate');
})();

