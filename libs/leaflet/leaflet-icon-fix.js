// Fix per i path delle icone di Leaflet quando hostato localmente
// Leaflet di default cerca le icone in 'dist/images/', ma noi le abbiamo in 'libs/leaflet/'

(function() {
  'use strict';
  
  if (typeof L === 'undefined') {
    console.warn('Leaflet non disponibile, impossibile applicare icon fix');
    return;
  }

  // Sovrascrivi i path predefiniti delle icone
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'libs/leaflet/marker-icon-2x.png',
    iconUrl: 'libs/leaflet/marker-icon.png',
    shadowUrl: 'libs/leaflet/marker-shadow.png',
  });

  console.log('✅ Leaflet icon paths configurati per hosting locale');
})();

