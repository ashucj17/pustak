document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".fa-bars");
  const headerMenu = document.querySelector(".header-menu");

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    headerMenu.classList.toggle("open");
  });
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", isDark ? "light" : "dark");
});
