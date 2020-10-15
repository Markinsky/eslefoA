function hola() {
    document.getElementById("oiecomova").addEventListener("click", function () {
      document.querySelector(".popup").style.display = "flex";
    });
  }
  
  function adios() {
    document.getElementById("mary").addEventListener("click", function () {
      document.querySelector(".popup").style.display = "none";
    });
  }
  
  function mostrar() {
    var dato = document.getElementById("selectEncuesta");
    datoB = dato.value;
  
    if (datoB <= 7) {
      document.querySelector(".oculto").style.display = "flex";
      document.querySelector(".popup-content").style.height = "590px";
      document.querySelector(".popup-content").style.width = "550px";
    } else {
      document.querySelector(".oculto").style.display = "none";
      document.querySelector(".popup-content").style.height = "250px";
      document.querySelector(".popup-content").style.width = "500px";
    }
  }
  