// Accommodation page specific functionality

document.addEventListener('DOMContentLoaded', function() {
  initializeGalleryModal();
  initializeRoomFiltering();
});

// Gallery modal functionality
function initializeGalleryModal() {
  const galleryModal = document.getElementById('galleryModal');
  const galleryButtons = document.querySelectorAll('[data-bs-target="#galleryModal"]');

  if (!galleryModal || !galleryButtons.length) return;

  // Room gallery images
  const roomGalleries = {
    standard: [
      { src: '../images/gallery/interior/2_bed_room/1.jpg', alt: 'Štandardná izba - pohľad 1' },
      { src: '../images/gallery/interior/2_bed_room/2.jpg', alt: 'Štandardná izba - pohľad 2' },
      { src: '../images/gallery/interior/2_bed_room/3.jpg', alt: 'Štandardná izba - pohľad 3' },
      { src: '../images/gallery/interior/2_bed_room/4.jpg', alt: 'Štandardná izba - pohľad 4' }
    ],
    family: [
      { src: '../images/Picture outdoor1.jpg', alt: 'Family suite main view' },
      { src: '../images/Picture outdoor.jpg', alt: 'Family suite view' },
      { src: '../images/Picture outdoor2.jpg', alt: 'Family suite exterior' }
    ],
    luxury: [
      { src: '../images/Picture outdoor2.jpg', alt: 'Luxury suite main view' },
      { src: '../images/Picture outdoor.jpg', alt: 'Luxury suite view' },
      { src: '../images/Picture outdoor1.jpg', alt: 'Luxury suite exterior' }
    ]
  };

  galleryButtons.forEach(button => {
    button.addEventListener('click', function() {
      const roomType = this.getAttribute('data-room');
      if (roomGalleries[roomType]) {
        loadGalleryImages(roomGalleries[roomType], roomType);
      }
    });
  });

  function loadGalleryImages(images, roomType) {
    const carouselInner = document.getElementById('galleryCarouselInner');
    const modalTitle = document.getElementById('galleryModalLabel');

    if (!carouselInner) return;

    // Update modal title
    const roomTitles = {
      standard: 'Štandardná dvojlôžková izba',
      family: 'Rodinný apartmán',
      luxury: 'Luxusný apartmán'
    };

    if (modalTitle) {
      modalTitle.textContent = `Galéria - ${roomTitles[roomType] || 'Izba'}`;
    }

    // Clear existing images
    carouselInner.innerHTML = '';

    // Add new images
    images.forEach((image, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;

      carouselItem.innerHTML = `
        <img src="${image.src}" class="d-block w-100" alt="${image.alt}" style="height: 500px; object-fit: cover;">
      `;

      carouselInner.appendChild(carouselItem);
    });

    // Add indicators
    const carousel = document.getElementById('galleryCarousel');
    let indicators = carousel.querySelector('.carousel-indicators');

    if (indicators) {
      indicators.remove();
    }

    if (images.length > 1) {
      indicators = document.createElement('div');
      indicators.className = 'carousel-indicators';

      images.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#galleryCarousel');
        indicator.setAttribute('data-bs-slide-to', index.toString());
        indicator.className = index === 0 ? 'active' : '';
        if (index === 0) {
          indicator.setAttribute('aria-current', 'true');
        }
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);

        indicators.appendChild(indicator);
      });

      carousel.appendChild(indicators);
    }
  }
}

// Room filtering functionality
function initializeRoomFiltering() {
  // Add price display
  updateRoomPrices();

  // Add booking calendar integration (placeholder)
  initializeBookingIntegration();
}

function updateRoomPrices() {
  // Placeholder for dynamic pricing
  const priceRanges = {
    standard: '€45-65',
    family: '€75-95',
    luxury: '€120-150'
  };

  // This would integrate with a real pricing API
  Object.keys(priceRanges).forEach(roomType => {
    const priceElements = document.querySelectorAll(`[data-room="${roomType}"] .room-price`);
    priceElements.forEach(element => {
      element.textContent = priceRanges[roomType] + ' / noc';
    });
  });
}

function initializeBookingIntegration() {
  // Since booking buttons now open modals, this function is no longer needed
  // The booking modal integration is handled in the HTML with data-bs-toggle="modal"
  console.log('Booking integration: Modal-based booking system initialized');
}
