// Virtual Tour functionality

document.addEventListener('DOMContentLoaded', function() {
  initializeVirtualTour();
});

function initializeVirtualTour() {
  initializeTourNavigation();
  initializeTourViewer();
  initializeGalleryItems();
}

// Tour navigation
function initializeTourNavigation() {
  const tourButtons = document.querySelectorAll('[data-tour]');
  
  tourButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tourType = this.getAttribute('data-tour');
      loadTourScene(tourType);
      
      // Update active button
      tourButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Tour viewer functionality
function initializeTourViewer() {
  const viewer = document.getElementById('tourViewer');
  const loadingIndicator = viewer.querySelector('.loading-indicator');
  const tourImage = document.getElementById('tourImage');
  
  // Initialize with exterior tour
  loadTourScene('exterior');
  
  // Tour controls
  initializeTourControls();
}

function loadTourScene(sceneType) {
  const viewer = document.getElementById('tourViewer');
  const loadingIndicator = viewer.querySelector('.loading-indicator');
  const tourImage = document.getElementById('tourImage');
  const tourTitle = document.getElementById('tourTitle');
  const tourDescription = document.getElementById('tourDescription');
  
  // Show loading
  loadingIndicator.style.display = 'block';
  tourImage.style.display = 'none';
  
  // Scene data
  const scenes = {
    exterior: {
      image: '../images/exterior-360.jpg',
      title: 'Exteriér hotela',
      description: 'Pozrite si nádherný exteriér Vila Mlynica obklopený majestátnymi Vysokými Tatrami. Moderná architektúra v harmony s prírodou.'
    },
    lobby: {
      image: '../images/lobby-360.jpg',
      title: 'Hotelové lobby',
      description: 'Priestranné a eleganté lobby s moderným dizajnom a útulnou atmosférou. Miesto kde sa hostia cítia vítaní.'
    },
    restaurant: {
      image: '../images/restaurant-360.jpg',
      title: 'Reštaurácia',
      description: 'Naša reštaurácia s nádherným výhľadom na hory, kde si môžete vychutnať výborné jedlá z miestnych ingrediencií.'
    },
    'standard-room': {
      image: '../images/standard-room-360.jpg',
      title: 'Štandardná izba',
      description: 'Komfortná a priestranná štandardná izba s moderným vybavením a krásnym výhľadom na okolité hory.'
    },
    'family-suite': {
      image: '../images/family-suite-360.jpg',
      title: 'Rodinný apartmán',
      description: 'Veľkorysý rodinný apartmán s oddelenými priestormi, ideálny pre rodiny s deťmi.'
    },
    'luxury-suite': {
      image: '../images/luxury-suite-360.jpg',
      title: 'Luxusný apartmán',
      description: 'Náš najexkluzívnejší apartmán s terasou a panoramatickým výhľadom na Vysoké Tatry.'
    }
  };
  
  const scene = scenes[sceneType];
  if (!scene) return;
  
  // Simulate loading time
  setTimeout(() => {
    // Update content
    tourTitle.textContent = scene.title;
    tourDescription.textContent = scene.description;
    
    // Load image
    tourImage.src = scene.image;
    tourImage.onload = () => {
      loadingIndicator.style.display = 'none';
      tourImage.style.display = 'block';
      
      // Add hotspots (placeholder)
      addHotspots(sceneType);
    };
  }, 1000);
}

function addHotspots(sceneType) {
  const hotspotsOverlay = document.querySelector('.hotspots-overlay');
  hotspotsOverlay.innerHTML = '';
  
  // Example hotspots (would be positioned based on actual 360° coordinates)
  const hotspots = {
    exterior: [
      { x: 30, y: 40, target: 'lobby', label: 'Vstup do hotela' },
      { x: 70, y: 60, target: 'restaurant', label: 'Terasa reštaurácie' }
    ],
    lobby: [
      { x: 50, y: 30, target: 'standard-room', label: 'Izby' },
      { x: 80, y: 50, target: 'restaurant', label: 'Reštaurácia' }
    ],
    restaurant: [
      { x: 20, y: 40, target: 'lobby', label: 'Lobby' },
      { x: 60, y: 70, target: 'exterior', label: 'Terasa' }
    ]
  };
  
  const sceneHotspots = hotspots[sceneType] || [];
  
  sceneHotspots.forEach(hotspot => {
    const hotspotElement = document.createElement('button');
    hotspotElement.className = 'hotspot btn btn-primary btn-sm position-absolute';
    hotspotElement.style.left = `${hotspot.x}%`;
    hotspotElement.style.top = `${hotspot.y}%`;
    hotspotElement.innerHTML = '<i class="bi bi-plus-circle"></i>';
    hotspotElement.title = hotspot.label;
    hotspotElement.setAttribute('data-bs-toggle', 'tooltip');
    
    hotspotElement.addEventListener('click', () => {
      loadTourScene(hotspot.target);
      // Update navigation button
      const targetButton = document.querySelector(`[data-tour="${hotspot.target}"]`);
      if (targetButton) {
        document.querySelectorAll('[data-tour]').forEach(btn => btn.classList.remove('active'));
        targetButton.classList.add('active');
      }
    });
    
    hotspotsOverlay.appendChild(hotspotElement);
  });
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function initializeTourControls() {
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const resetViewBtn = document.getElementById('resetView');
  const fullscreenBtn = document.getElementById('fullscreen');
  const tourViewer = document.getElementById('tourViewer');
  const tourImage = document.getElementById('tourImage');
  
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  
  // Zoom in
  zoomInBtn?.addEventListener('click', () => {
    scale = Math.min(scale * 1.2, 3);
    updateImageTransform();
  });
  
  // Zoom out
  zoomOutBtn?.addEventListener('click', () => {
    scale = Math.max(scale / 1.2, 0.5);
    updateImageTransform();
  });
  
  // Reset view
  resetViewBtn?.addEventListener('click', () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
  });
  
  // Fullscreen
  fullscreenBtn?.addEventListener('click', () => {
    if (tourViewer.requestFullscreen) {
      tourViewer.requestFullscreen();
    } else if (tourViewer.webkitRequestFullscreen) {
      tourViewer.webkitRequestFullscreen();
    } else if (tourViewer.msRequestFullscreen) {
      tourViewer.msRequestFullscreen();
    }
  });
  
  function updateImageTransform() {
    if (tourImage) {
      tourImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }
  }
  
  // Mouse/touch controls for panning
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  
  tourImage?.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    tourImage.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !tourImage) return;
    
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    
    translateX += deltaX / scale;
    translateY += deltaY / scale;
    
    updateImageTransform();
    
    lastX = e.clientX;
    lastY = e.clientY;
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    if (tourImage) {
      tourImage.style.cursor = 'grab';
    }
  });
  
  // Touch events for mobile
  tourImage?.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }
  });
  
  tourImage?.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - lastX;
    const deltaY = e.touches[0].clientY - lastY;
    
    translateX += deltaX / scale;
    translateY += deltaY / scale;
    
    updateImageTransform();
    
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  });
  
  tourImage?.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Gallery items functionality
function initializeGalleryItems() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    const button = item.querySelector('[data-tour]');
    if (button) {
      button.addEventListener('click', function() {
        const tourType = this.getAttribute('data-tour');
        loadTourScene(tourType);
        
        // Update navigation
        const navButton = document.querySelector(`[data-tour="${tourType}"]:not(.gallery-item [data-tour])`);
        if (navButton) {
          document.querySelectorAll('[data-tour]:not(.gallery-item [data-tour])').forEach(btn => btn.classList.remove('active'));
          navButton.classList.add('active');
        }
        
        // Scroll to tour viewer
        document.getElementById('tourViewer').scrollIntoView({ behavior: 'smooth' });
      });
    }
  });
}
