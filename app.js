document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.fa-bars');
  const closeMenu = document.querySelector('.close-menu');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const body = document.body;
  
  // Check if elements exist before adding event listeners
  if(menuToggle) {
    menuToggle.addEventListener('click', function() {
      body.classList.add('mobile-menu-active');
    });
  }
  
  function closeMenuFunction() {
    body.classList.remove('mobile-menu-active');
  }
  
  if(closeMenu) {
    closeMenu.addEventListener('click', closeMenuFunction);
  }
  
  if(menuOverlay) {
    menuOverlay.addEventListener('click', closeMenuFunction);
  }
});