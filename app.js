const menuToggle = document.querySelector(".fa-bars");
const headerMenu = document.querySelector(".header-menu");

menuToggle.addEventListener("click", () => {
  headerMenu.style.display =
    headerMenu.style.display === "block" ? "none" : "block";
});
