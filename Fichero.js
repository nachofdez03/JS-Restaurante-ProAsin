document.addEventListener("DOMContentLoaded", function () {
  const reservaLink = document.querySelector('a[href="#reserva"]');
  const inicioLink = document.querySelector('a[href="#inicio"]');
  const contenidoPrincipal = document.querySelector(".main");
  const formularioSection = document.querySelector(".Formulario");

  reservaLink.addEventListener("click", function (event) {
    event.preventDefault();
    contenidoPrincipal.style.display = "none"; // Oculta el contenido principal
    formularioSection.style.display = "block";
  });

  inicioLink.addEventListener("click", function (event) {
    event.preventDefault();
    location.reload(); // Recarga la página al hacer clic en "Inicio"
  });
});
