/**
 * ========================================
 * TEST ACCORDION WRAPPERS
 * Wrapper functions per retrocompatibilità con onclick inline
 * ========================================
 * 
 * Questo file definisce le funzioni globali che vengono chiamate
 * dagli onclick nell'HTML. Queste funzioni delegano a TestAccordion
 * quando disponibile, altrimenti usano un fallback.
 * 
 * IMPORTANTE: Questo file deve essere caricato PRIMA del DOM
 * per essere disponibile quando il browser legge gli onclick.
 * 
 * @version 1.0.0
 * @date 2025-11-06
 */

// Funzioni accordion - definite immediatamente nello scope globale
window.toggleDbGroup = function(groupId) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleGroup) {
        TestAccordion.toggleGroup('db', groupId);
    } else {
        // Fallback se TestAccordion non è disponibile
        const content = document.getElementById(`db-${groupId}-content`);
        const icon = document.getElementById(`db-${groupId}-icon`);
        if (content && icon) {
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
                icon.classList.add('expanded');
            }
        }
    }
};

window.togglePriceGroup = function(groupId) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleGroup) {
        TestAccordion.toggleGroup('price', groupId);
    } else {
        const content = document.getElementById(`price-${groupId}-content`);
        const icon = document.getElementById(`price-${groupId}-icon`);
        if (content && icon) {
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
                icon.classList.add('expanded');
            }
        }
    }
};

window.toggleStorageGroup = function(groupId) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleGroup) {
        TestAccordion.toggleGroup('storage', groupId);
    } else {
        const content = document.getElementById(`storage-${groupId}-content`);
        const icon = document.getElementById(`storage-${groupId}-icon`);
        if (content && icon) {
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
                icon.classList.add('expanded');
            }
        }
    }
};

window.toggleSettingsGroup = function(groupId) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleGroup) {
        TestAccordion.toggleGroup('settings', groupId);
    } else {
        const content = document.getElementById(`settings-${groupId}-content`);
        const icon = document.getElementById(`settings-${groupId}-icon`);
        if (content && icon) {
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
                icon.classList.add('expanded');
            }
        }
    }
};

window.toggleSwGroup = function(groupId) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleGroup) {
        TestAccordion.toggleGroup('sw', groupId);
    } else {
        const content = document.getElementById(`sw-${groupId}-content`);
        const icon = document.getElementById(`sw-${groupId}-icon`);
        if (content && icon) {
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.classList.remove('expanded');
                icon.textContent = '▶';
            } else {
                content.classList.add('expanded');
                icon.classList.add('expanded');
                icon.textContent = '▼';
            }
        }
    }
};

window.toggleRouteGroup = function(groupId) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleGroup) {
        TestAccordion.toggleGroup('route', groupId);
    } else {
        const content = document.getElementById(`route-${groupId}-content`);
        const icon = document.getElementById(`route-${groupId}-icon`);
        if (content && icon) {
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
                icon.classList.add('expanded');
            }
        }
    }
};

window.toggleAllDbGroups = function(open) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
        TestAccordion.toggleAllGroups('db', open);
    } else {
        const groups = ['group1', 'group2', 'group3', 'group4'];
        groups.forEach(groupId => {
            const content = document.getElementById(`db-${groupId}-content`);
            const icon = document.getElementById(`db-${groupId}-icon`);
            if (content && icon) {
                if (open) {
                    content.classList.add('expanded');
                    icon.classList.add('expanded');
                } else {
                    content.classList.remove('expanded');
                    icon.classList.remove('expanded');
                }
            }
        });
    }
};

window.toggleAllStorageGroups = function(open) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
        TestAccordion.toggleAllGroups('storage', open);
    } else {
        const groups = ['group1', 'group2', 'group3', 'group4', 'group5'];
        groups.forEach(groupId => {
            const content = document.getElementById(`storage-${groupId}-content`);
            const icon = document.getElementById(`storage-${groupId}-icon`);
            if (content && icon) {
                if (open) {
                    content.classList.add('expanded');
                    icon.classList.add('expanded');
                } else {
                    content.classList.remove('expanded');
                    icon.classList.remove('expanded');
                }
            }
        });
    }
};

window.toggleAllPriceGroups = function(open) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
        TestAccordion.toggleAllGroups('price', open);
    } else {
        const groups = ['group1', 'group2', 'group3', 'group4'];
        groups.forEach(groupId => {
            const content = document.getElementById(`price-${groupId}-content`);
            const icon = document.getElementById(`price-${groupId}-icon`);
            if (content && icon) {
                if (open) {
                    content.classList.add('expanded');
                    icon.classList.add('expanded');
                } else {
                    content.classList.remove('expanded');
                    icon.classList.remove('expanded');
                }
            }
        });
    }
};

window.toggleAllRouteGroups = function(open) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
        TestAccordion.toggleAllGroups('route', open);
    } else {
        const groups = ['group1', 'group2', 'group3', 'group4'];
        groups.forEach(groupId => {
            const content = document.getElementById(`route-${groupId}-content`);
            const icon = document.getElementById(`route-${groupId}-icon`);
            if (content && icon) {
                if (open) {
                    content.classList.add('expanded');
                    icon.classList.add('expanded');
                } else {
                    content.classList.remove('expanded');
                    icon.classList.remove('expanded');
                }
            }
        });
    }
};

window.toggleAllSettingsGroups = function(open) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
        TestAccordion.toggleAllGroups('settings', open);
    } else {
        const groups = ['group1', 'group2', 'group3', 'group4', 'group5'];
        groups.forEach(groupId => {
            const content = document.getElementById(`settings-${groupId}-content`);
            const icon = document.getElementById(`settings-${groupId}-icon`);
            if (content && icon) {
                if (open) {
                    content.classList.add('expanded');
                    icon.classList.add('expanded');
                } else {
                    content.classList.remove('expanded');
                    icon.classList.remove('expanded');
                }
            }
        });
    }
};

window.toggleAllSwGroups = function(open) {
    if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
        TestAccordion.toggleAllGroups('sw', open);
    } else {
        const groups = ['group1', 'group2', 'group3', 'group4'];
        groups.forEach(groupId => {
            const content = document.getElementById(`sw-${groupId}-content`);
            const icon = document.getElementById(`sw-${groupId}-icon`);
            if (content && icon) {
                if (open) {
                    content.classList.add('expanded');
                    icon.classList.add('expanded');
                    icon.textContent = '▼';
                } else {
                    content.classList.remove('expanded');
                    icon.classList.remove('expanded');
                    icon.textContent = '▶';
                }
            }
        });
    }
};

console.log('✅ js/tests/test-accordion-wrappers.js caricato - Funzioni accordion disponibili nello scope globale');

/**
 * ========================================
 * EVENT DELEGATION PER TOGGLE GRUPPI
 * ========================================
 * 
 * Sostituisce gli onclick inline con event delegation
 * usando data-toggle-group e data-group-id
 */

/**
 * Inizializza event delegation per toggle dei gruppi accordion
 */
function initAccordionToggleEventDelegation() {
  // Verifica se il listener è già stato aggiunto
  if (document.body && document.body.dataset.accordionToggleDelegationAdded === 'true') {
    return;
  }

  // Funzione per aggiungere il listener
  const addListener = () => {
    if (document.body.dataset.accordionToggleDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per header con data-toggle-group
    document.body.addEventListener('click', (e) => {
      const header = e.target.closest('[data-toggle-group]');
      
      if (header && header.classList.contains('test-group-header')) {
        e.preventDefault();
        e.stopPropagation();
        
        const prefix = header.dataset.toggleGroup;
        const groupId = header.dataset.groupId;
        
        if (prefix && groupId) {
          // Mappatura prefix -> nome funzione
          const functionMap = {
            'db': 'toggleDbGroup',
            'storage': 'toggleStorageGroup',
            'price': 'togglePriceGroup',
            'sw': 'toggleSwGroup',
            'route': 'toggleRouteGroup',
            'settings': 'toggleSettingsGroup'
          };
          
          const toggleFunctionName = functionMap[prefix];
          const toggleFunction = toggleFunctionName ? window[toggleFunctionName] : null;
          
          if (typeof toggleFunction === 'function') {
            toggleFunction(groupId);
          } else {
            console.error(`❌ Funzione ${toggleFunctionName || 'sconosciuta'} non disponibile per prefix "${prefix}"`);
          }
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.accordionToggleDelegationAdded = 'true';
    console.log('✅ Event delegation per toggle gruppi accordion inizializzata');
  };

  // Auto-inizializza event delegation quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addListener);
  } else {
    addListener();
  }
}

// Auto-inizializza event delegation
initAccordionToggleEventDelegation();

