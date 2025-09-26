// Vila Mlynica - Gallery JavaScript
// Enhanced gallery functionality with filtering and modal

document.addEventListener('DOMContentLoaded', function() {
  initializeGallery();
});

function initializeGallery() {
  initializeGalleryFilter();
  initializeGalleryModal();
  initializeGalleryAnimations();
  initializeGalleryLazyLoading();
}

// Gallery filtering functionality
function initializeGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter gallery items
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
      
      // Track filter usage
      if (window.VilaMLynica && window.VilaMLynica.trackEvent) {
        window.VilaMLynica.trackEvent('gallery_filter_used', {
          filter: filter,
          page: 'gallery'
        });
      }
    });
  });
}

// Gallery modal functionality
function initializeGalleryModal() {
  const galleryModal = document.getElementById('galleryModal');
  const galleryImages = document.querySelectorAll('.gallery-item img');
  
  if (!galleryModal) return;

  // Build galleryData from the grid, in the same visual order
  const galleryData = Array.from(document.querySelectorAll('.gallery-item img')).map(img => {
    const titleNode = img.closest('.gallery-card')?.querySelector('.card-title');
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      title: titleNode ? titleNode.textContent.trim() : (img.getAttribute('alt') || 'Obrázok')
    };
  });

  // Add click handlers to gallery images
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      openGalleryModal(index, galleryData);
    });
  });

  // Handle modal events
  galleryModal.addEventListener('show.bs.modal', function(event) {
    const trigger = event.relatedTarget;
    if (trigger) {
      const slideIndex = parseInt(trigger.getAttribute('data-bs-slide-to') || '0');
      openGalleryModal(slideIndex, galleryData);
    }
  });

  // Track modal usage
  galleryModal.addEventListener('shown.bs.modal', function() {
    if (window.VilaMLynica && window.VilaMLynica.trackEvent) {
      window.VilaMLynica.trackEvent('gallery_modal_opened', {
        page: 'gallery'
      });
    }
  });
}

function openGalleryModal(startIndex, galleryData) {
  const carouselInner = document.getElementById('galleryCarouselInner');
  const modalTitle = document.getElementById('galleryModalLabel');
  
  if (!carouselInner) return;

  // Clear existing carousel items
  carouselInner.innerHTML = '';

  // Add all images to carousel
  galleryData.forEach((image, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item ${index === startIndex ? 'active' : ''}`;
    
    carouselItem.innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="min-height: 70vh;">
        <img src="${image.src}" class="d-block img-fluid" alt="${image.alt}" style="max-height: 70vh; object-fit: contain;">
      </div>
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-3">
        <h5>${image.title}</h5>
      </div>
    `;
    
    carouselInner.appendChild(carouselItem);
  });

  // Update modal title
  if (modalTitle && galleryData[startIndex]) {
    modalTitle.textContent = `Fotogaléria - ${galleryData[startIndex].title}`;
  }

  // Add indicators if more than one image
  const carousel = document.getElementById('galleryCarousel');
  let indicators = carousel.querySelector('.carousel-indicators');
  
  if (indicators) {
    indicators.remove();
  }

  if (galleryData.length > 1) {
    indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    galleryData.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.setAttribute('data-bs-target', '#galleryCarousel');
      indicator.setAttribute('data-bs-slide-to', index.toString());
      indicator.className = index === startIndex ? 'active' : '';
      if (index === startIndex) {
        indicator.setAttribute('aria-current', 'true');
      }
      indicator.setAttribute('aria-label', `Slide ${index + 1}`);
      
      indicators.appendChild(indicator);
    });
    
    carousel.appendChild(indicators);
  }
}

// Gallery animations
function initializeGalleryAnimations() {
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .gallery-item {
      animation: fadeInUp 0.5s ease forwards;
    }
    
    .gallery-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .gallery-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
    }
    
    .gallery-card img {
      transition: transform 0.3s ease;
    }
    
    .gallery-card:hover img {
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(style);
}

// Enhanced lazy loading for gallery
function initializeGalleryLazyLoading() {
  const galleryImages = document.querySelectorAll('.gallery-item img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.addEventListener('load', function() {
            this.classList.add('loaded');
          });
          
          // If image is already loaded
          if (img.complete) {
            img.classList.add('loaded');
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    galleryImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    galleryImages.forEach(img => {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
      if (img.complete) {
        img.classList.add('loaded');
      }
    });
  }
}

// Keyboard navigation for gallery modal
document.addEventListener('keydown', function(e) {
  const galleryModal = document.getElementById('galleryModal');
  if (galleryModal && galleryModal.classList.contains('show')) {
    const carousel = document.getElementById('galleryCarousel');
    if (carousel) {
      if (e.key === 'ArrowLeft') {
        const prevButton = carousel.querySelector('.carousel-control-prev');
        if (prevButton) prevButton.click();
      } else if (e.key === 'ArrowRight') {
        const nextButton = carousel.querySelector('.carousel-control-next');
        if (nextButton) nextButton.click();
      } else if (e.key === 'Escape') {
        const closeButton = galleryModal.querySelector('.btn-close');
        if (closeButton) closeButton.click();
      }
    }
  }
});

// Export functions for use in other files
window.VilaMLynicaGallery = {
  initializeGallery,
  openGalleryModal,
  initializeGalleryFilter,
  initializeGalleryModal,
  initializeGalleryAnimations,
  initializeGalleryLazyLoading
};
