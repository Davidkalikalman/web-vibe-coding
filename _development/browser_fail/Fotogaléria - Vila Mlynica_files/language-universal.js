/**
 * Universal Language and Scroll Functions
 * This file provides language change and scroll functionality across all pages
 * Include this file on all pages for consistent language switching behavior
 */

// Ensure dropdown toggle does not cause page scroll
(function attachLanguageToggleHandler() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachLanguageToggleHandler);
    return;
  }
  const toggle = document.getElementById('languageDropdown');
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      // Prevent default anchor navigation/scroll to top
      e.preventDefault();
      // Let Bootstrap manage open/close via data-bs-toggle
    }, { passive: false });
  }
})();

// Universal language change function for all pages
function universalLanguageChange(lang) {
  console.log('Universal language change called with:', lang);
  
  // Check if translations are available
  if (typeof translations === 'undefined' || !translations[lang]) {
    console.warn(`Language '${lang}' not supported or translations not loaded`);
    return false;
  }
  
  try {
    // Change language
    const success = changeLanguage(lang);
    
    if (success) {
      // Scroll to top after successful language change
      setTimeout(() => {
        scrollToTop();
      }, 100); // Small delay to ensure language change is processed
      
      // Show success feedback
      console.log(`Language changed to ${lang} and scrolled to top`);
      
      // Optional: Show a brief success message
      showLanguageChangeFeedback(lang);
    } else {
      console.error('Failed to change language to:', lang);
    }
    
    return success;
  } catch (error) {
    console.error('Error in universal language change:', error);
    return false;
  }
}

// Universal scroll to top function
function scrollToTop() {
  try {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Fallback for older browsers
    if (!window.scrollTo) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    
    console.log('Scrolled to top');
  } catch (error) {
    console.error('Error scrolling to top:', error);
    // Fallback scroll
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

// Show language change feedback (optional)
function showLanguageChangeFeedback(lang) {
  try {
    // Create a temporary feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(44, 85, 48, 0.9);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    `;
    
    const langNames = {
      'sk': 'Slovenčina',
      'en': 'English',
      'de': 'Deutsch',
      'hu': 'Magyar',
      'pl': 'Polski'
    };
    
    feedback.textContent = `Language changed to ${langNames[lang] || lang.toUpperCase()}`;
    document.body.appendChild(feedback);
    
    // Remove after 2 seconds
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 2000);
  } catch (error) {
    console.error('Error showing language feedback:', error);
  }
}

// Initialize universal language functionality
function initializeUniversalLanguage() {
  // Add event listeners for language dropdown items
  const languageItems = document.querySelectorAll('.language-option');
  languageItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const lang = this.getAttribute('data-lang');
      if (lang) {
        console.log('Language change requested:', lang);
        universalLanguageChange(lang);
      }
    }, { passive: false });
  });
  
  // Add global click handler as backup
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('language-option')) {
      e.preventDefault();
      e.stopPropagation();
      const lang = e.target.getAttribute('data-lang');
      if (lang) {
        console.log('Backup language change:', lang);
        universalLanguageChange(lang);
      }
    }
  }, { passive: false });
  
  console.log('Universal language functionality initialized');
}

// Make functions globally accessible
window.universalLanguageChange = universalLanguageChange;
window.scrollToTop = scrollToTop;
window.initializeUniversalLanguage = initializeUniversalLanguage;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUniversalLanguage);
} else {
  initializeUniversalLanguage();
}
