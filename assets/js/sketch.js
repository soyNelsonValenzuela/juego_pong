// Variables para la paleta del jugador y la computadora
let jugadorY;
let computadoraY;
let anchoPaleta = 17, altoPaleta = 100;
let velocidadComputadora = 4;

// Variables para la pelota
let pelotaX, pelotaY, velocidadPelotaX = 6, velocidadPelotaY = 6;
let diametroPelota = 20;
let incrementoVelocidad = 0.5; // Incremento de la velocidad de la pelota
let anguloPelota = 0; // Ángulo de rotación de la pelota
let velocidadRotacion = 0.1; // Velocidad de rotación base

// Tamaño de la pantalla
let anchoPantalla = 800, altoPantalla = 400;

// Contadores de puntos
let puntosJugador = 0;
let puntosComputadora = 0;

// Variables para las imágenes
let fondo;
let imagenPaletaJugador;
let imagenPaletaComputadora;
let imagenPelota;

// Variables para los sonidos
let sonidoRebote;
let sonidoPunto;

// Variable para pausar el juego
let juegoPausado = false;

function preload() {
  // Cargar las imágenes de fondo, paletas y pelota
  fondo = loadImage("./sprites/img/fondo1.png");
  imagenPaletaJugador = loadImage("./sprites/img/barra1.png"); // Imagen de la paleta del jugador
  imagenPaletaComputadora = loadImage("./sprites/img/barra2.png"); // Imagen de la paleta de la computadora
  imagenPelota = loadImage("./sprites/img/bola.png"); // Imagen de la pelota

  // Cargar los sonidos
  sonidoRebote = loadSound("./assets/sounds/446100__justinvoke__bounce.wav"); // Sonido de rebote
  sonidoPunto = loadSound("./assets/sounds/173859__jivatma07__j1game_over_mono.wav"); // Sonido cuando se anota un punto
}

function setup() {
  createCanvas(anchoPantalla, altoPantalla);
  jugadorY = height / 2 - altoPaleta / 2;
  computadoraY = height / 2 - altoPaleta / 2;
  pelotaX = width / 2;
  pelotaY = height / 2;
}

function draw() {
  // Dibujar la imagen de fondo
  background(fondo);

  // Dibujar marcador
  textSize(32);
  fill(222);
  text(puntosJugador, width / 4, 50);
  text(puntosComputadora, (3 * width) / 4, 50);

  // Verificar si el juego está en pausa
  if (juegoPausado) {
    textSize(32);
    textAlign(CENTER);
    fill(255, 0, 0);
    text("Juego Pausado", width / 2, height / 2);
    return; // Salir de la función draw si el juego está en pausa
  }

  // Movimiento de la pelota
  pelotaX += velocidadPelotaX;
  pelotaY += velocidadPelotaY;

  // Dibujar las paletas y la pelota
  dibujarPaletasYPelota();

  // Rebote de la pelota en las paletas
  manejarRebotes();

  // Verificar si la pelota sale de los límites y sumar puntos
  verificarPuntos();

  // Movimiento de las paletas
  moverPaletas();
}

function dibujarPaletasYPelota() {
  // Dibujar paletas usando las imágenes
  image(imagenPaletaJugador, 10, jugadorY, anchoPaleta, altoPaleta);
  image(imagenPaletaComputadora, width - 25, computadoraY, anchoPaleta, altoPaleta);

  // Dibujar la pelota con rotación
  push();
  translate(pelotaX, pelotaY); // Mover el punto de origen al centro de la pelota
  rotate(anguloPelota); // Aplicar rotación
  imageMode(CENTER); // Dibujar la pelota desde el centro
  image(imagenPelota, 0, 0, diametroPelota, diametroPelota); // Dibujar la pelota
  pop();

  // Calcular la velocidad de rotación en función de la velocidad de la pelota
  let velocidadPelota = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY); // Magnitud de la velocidad
  anguloPelota += velocidadRotacion * velocidadPelota; // Aumentar el ángulo de rotación

  // Rebote de la pelota en la parte superior e inferior
  if (pelotaY < 0 || pelotaY > height) {
    velocidadPelotaY *= -1;
  }
}

function manejarRebotes() {
  // Rebote de la pelota en las paletas
  if (pelotaX < 30 && pelotaY > jugadorY && pelotaY < jugadorY + altoPaleta) {
    ajustarRebote(jugadorY); // Ajustar el ángulo al rebotar en la paleta del jugador
    velocidadPelotaX *= -1;
    aumentarVelocidad();
    sonidoRebote.play(); // Reproducir el sonido al rebotar en la paleta del jugador
  }
  if (pelotaX > width - 30 && pelotaY > computadoraY && pelotaY < computadoraY + altoPaleta) {
    ajustarRebote(computadoraY); // Ajustar el ángulo al rebotar en la paleta de la computadora
    velocidadPelotaX *= -1;
    aumentarVelocidad();
    sonidoRebote.play(); // Reproducir el sonido al rebotar en la paleta de la computadora
  }
}

function verificarPuntos() {
  // Verificar si la pelota sale de los límites y sumar puntos
  if (pelotaX <= 0) {
    puntosComputadora++;
    sonidoPunto.play(); // Reproducir el sonido cuando la computadora anota un punto
    reiniciarPelota();
  } else if (pelotaX >= width) {
    puntosJugador++;
    sonidoPunto.play(); // Reproducir el sonido cuando el jugador anota un punto
    reiniciarPelota();
  }
}

function moverPaletas() {
  // Movimiento de la paleta del jugador
  if (keyIsDown(UP_ARROW)) {
    jugadorY -= 10;
  }
  if (keyIsDown(DOWN_ARROW)) {
    jugadorY += 10;
  }

  // Movimiento de la paleta de la computadora
  if (pelotaY > computadoraY + altoPaleta / 2) {
    computadoraY += velocidadComputadora;
  } else {
    computadoraY -= velocidadComputadora;
  }

  // Limitar el movimiento de las paletas a los bordes de la pantalla
  jugadorY = constrain(jugadorY, 0, height - altoPaleta);
  computadoraY = constrain(computadoraY, 0, height - altoPaleta);
}

function reiniciarPelota() {
  pelotaX = width / 2;
  pelotaY = height / 2;
  velocidadPelotaX = 5 * (random() > 0.5 ? 1 : -1); // Reiniciar velocidad y dirección aleatoria
  velocidadPelotaY = 5 * (random() > 0.5 ? 1 : -1);
  anguloPelota = 0; // Reiniciar el ángulo de rotación
}

function aumentarVelocidad() {
  // Aumenta la velocidad de la pelota
  if (velocidadPelotaX > 0) {
    velocidadPelotaX += incrementoVelocidad;
  } else {
    velocidadPelotaX -= incrementoVelocidad;
  }

  if (velocidadPelotaY > 0) {
    velocidadPelotaY += incrementoVelocidad;
  } else {
    velocidadPelotaY -= incrementoVelocidad;
  }
}

function ajustarRebote(paletaY) {
  // Ajustar la velocidad vertical (Y) de la pelota basado en el punto de impacto
  let puntoImpacto = pelotaY - paletaY; // Distancia entre el centro de la paleta y el punto de impacto
  let factorAngulo = (puntoImpacto - altoPaleta / 2) / (altoPaleta / 2); // Normalizar valor entre -1 y 1

  // Evitar que el ángulo sea totalmente vertical
  let maxAngulo = 8; // Máxima variación en la velocidad vertical
  velocidadPelotaY = maxAngulo * factorAngulo;
}

// Función para pausar y reanudar el juego
function keyPressed() {
  if (key === 'P' || key === 'p') {
    juegoPausado = !juegoPausado; // Cambiar entre pausa y reanudar
  }
}