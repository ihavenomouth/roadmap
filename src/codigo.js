"use strict";

///////////////
// FUNCTIONS
////////////////////

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}



const paletas = {
  "70s": ["bg-neutral-200", "text-neutral-800", "bg-white", "bg-slate-600", "bg-red-500", "bg-yellow-500"],
  
  "ocean": ["bg-slate-900", "text-slate-200", "bg-violet-950", "bg-lime-400", "bg-green-600", "bg-emerald-700", "bg-cyan-400", "bg-blue-600"],

  "betis": ["bg-white", "text-green-800", "bg-emerald-100", "bg-green-700", "bg-green-600", "bg-green-500"],

  "pastel": ["bg-white", "text-slate-500", "bg-slate-100", "bg-pink-300", "bg-blue-300", "bg-green-300"],

  "rojo": ["bg-white", "text-red-900", "bg-red-50", "bg-red-600", "bg-red-500", "bg-red-400"],

  "cielo": ["bg-white", "text-sky-900", "bg-sky-50", "bg-sky-600", "bg-sky-500", "bg-sky-400"],

  "vibrante": ["bg-white", "text-purple-900", "bg-purple-50", "bg-[#663399]", "bg-purple-600", "bg-yellow-400", "bg-orange-500"],

  "oscuro": ["bg-neutral-800", "text-neutral-100", "bg-neutral-900", "bg-neutral-600", "bg-neutral-500", "bg-neutral-400"],

  "nocturno": ["bg-slate-800", "text-slate-100", "bg-slate-950", "bg-slate-700", "bg-slate-600", "bg-[#ff1493]"]
};


const txtPasos = document.querySelector("#txtPasos");
const fieldPasos = document.querySelector("#fieldPasos");


txtPasos.addEventListener("input", (e) => {
  const valor = e.target.value;
  let num = Number(valor);

  if (isNaN(num) || num < 1) {
    num = 1;
    e.target.value = 1;
  } else if (num > 10) {
    num = 10;
    e.target.value = 10;
  }

  const currentInputs = fieldPasos.querySelectorAll("input");
  const currentCount = currentInputs.length;

  if (num > currentCount) {
    // Añadir nuevos inputs
    for (let i = currentCount; i < num; i++) {
      let label = document.createElement("label");
      label.innerText = `Paso ${i + 1}`;
      label.classList.add("block", "text-right");
      label.setAttribute("for", `txtPaso${i + 1}`);
      label.id = `lblPaso${i+1}`; // ID para facilitar borrado
      fieldPasos.appendChild(label);

      let input = document.createElement("input");
      input.classList.add("p-2", "border-2", "rounded", "col-span-2");
      input.setAttribute("id", `txtPaso${i + 1}`);
      input.value = label.innerText;
      fieldPasos.appendChild(input);
    }
  } else if (num < currentCount) {
    // Eliminar inputs sobrantes
    for (let i = currentCount; i > num; i--) {
      const label = document.getElementById(`lblPaso${i}`);
      const input = document.getElementById(`txtPaso${i}`);
      if (label) label.remove();
      if (input) input.remove();
    }
  }
});


btnGenerar.addEventListener("click", (e) => {
  const pasos = Number(txtPasos.value);
  if (pasos < 1) {
    console.error("El número de pasos debe ser mayor a 1");
    return;
  }

  const roadmap = document.querySelector("article");
  roadmap.innerHTML = "";

  //necesitamos el doble de columnas que de pasos
  roadmap.className = `grid h-[50rem] grid-rows-9 relative`; 
  roadmap.style.gridTemplateColumns = `repeat(${2 * pasos}, minmax(0, 1fr))`;

  console.log("Generando..." + pasos + " pasos");

  // Selección de paleta (MOVIDO AL INICIO)
  const nombrePaleta = document.querySelector("#txtPaleta").value;
  const paleta = paletas[nombrePaleta] || paletas["70s"];
  
  // Colores según especificación
  // 1. Fondo Texto: Primera posición (index 0)
  // 2. Color Texto: Segunda posición (index 1)
  // 3. Fondo Article: Tercera posición (index 2)
  // 4. Color Serpiente: Cuarta posición (index 3+)
  const bgTexto = paleta[0];
  const colorTexto = paleta[1];
  const bgArticle = paleta[2];
  const bgSerpiente = paleta[3];

  const tituloText = document.querySelector("#txtTitulo").value || "ROADMAP";
  const h2Titulo = document.createElement("h2");
  h2Titulo.classList.add("absolute", "top-4", "right-4", "font-bold", "text-8xl", "z-50", "pointer-events-none");
  h2Titulo.classList.add(colorTexto);
  h2Titulo.innerText = tituloText;
  roadmap.appendChild(h2Titulo);

  // Aplicar fondo al article
  roadmap.classList.add(bgArticle);


  // --- PRIMER PASO (Index 0) ---
  const alturaInicial = getRandomIntInclusive(5, 7); // Siempre abajo (5-7) para mantener texto arriba
  const inputTexto1 = document.querySelector(`#txtPaso1`);
  const texto1 = inputTexto1 ? inputTexto1.value : `Paso 1`;

  // 1. División del TEXTO Paso 1 (Siempre arriba porque altura >= 5)
  let divTexto1 = document.createElement("div");
  divTexto1.classList.add("grid", "items-center", "justify-center", "col-span-2", "p-4", "text-center");
  divTexto1.style.gridColumnStart = "1";
  divTexto1.classList.add(bgTexto, colorTexto);
  divTexto1.innerText = texto1;
  divTexto1.classList.add("row-start-1", `row-end-${alturaInicial + 1}`, "align-top");
  roadmap.appendChild(divTexto1);

  // 2. División de la SERPIENTE Paso 1
  let divSerpiente1 = document.createElement("div");
  divSerpiente1.classList.add("col-span-2", `row-start-${alturaInicial}`, "row-span-1", bgSerpiente);
  divSerpiente1.style.gridColumnStart = "1";
  roadmap.appendChild(divSerpiente1);


  // --- RESTO DE PASOS ---
  let prevAltura = alturaInicial;

  for (let i = 1; i < pasos; i++) {
    const stepNum = i + 1;
    const colStart = 2 * i + 1;
    const inputTexto = document.querySelector(`#txtPaso${stepNum}`);
    const texto = inputTexto ? inputTexto.value : `Paso ${stepNum}`;
    
    // Los colores de la serpiente empiezan en el índice 3 de la paleta
    // i=1 (Paso 2) usa index 4...
    // Paso 1 (i=0 implícito) ya usó paleta[3].
    const snakeColorIndex = 3 + (i % (paleta.length - 3)); 
    const colorSnake = paleta[snakeColorIndex];


    if (stepNum % 2 !== 0) { 
      // === PASO IMPAR (3, 5...) -> RECTO ===
      // Texto: SIEMPRE ARRIBA
      const altura = prevAltura;

      let divTexto = document.createElement("div");
      divTexto.classList.add("grid", "items-center", "justify-center", "p-4", "text-center");
      divTexto.style.gridColumn = `${colStart} / span 2`; // col-span-2
      divTexto.classList.add(bgTexto, colorTexto);
      divTexto.innerText = texto;
      divTexto.classList.add("row-start-1", `row-end-${altura}`, "align-bottom");
      roadmap.appendChild(divTexto);

      // Serpiente
      let divRecta = document.createElement("div");
      divRecta.classList.add(`row-start-${altura}`, "row-span-1", colorSnake);
      divRecta.style.gridColumn = `${colStart} / span 2`;
      roadmap.appendChild(divRecta);

    } else {
      // === PASO PAR (2, 4...) -> CODO (┐ o ┘) ===
      let nuevaAltura;
      let isGoingDown = prevAltura <= 4;
      
      if (isGoingDown) {
        nuevaAltura = getRandomIntInclusive(5, 7); // Baja
      } else {
        nuevaAltura = getRandomIntInclusive(3, 4); // Sube
      }

      // Texto: SIEMPRE ABAJO
      let divTexto = document.createElement("div");
      divTexto.classList.add("grid", "items-center", "justify-center", "p-4", "text-center");
      divTexto.classList.add(bgTexto, colorTexto);
      divTexto.innerText = texto;
      
      // Posición vertical: debajo de la línea horizontal (que está en prevAltura)
      
      // Ancho: Si baja, reducimos a 1 columna para no chocar con la vertical
      if (isGoingDown) {
        divTexto.classList.add(`row-start-${nuevaAltura + 1}`, "row-end-10", "align-top");
        divTexto.style.gridColumn = `${colStart} / span 2`;

        const divFondo = document.createElement("div");
        divFondo.classList.add(`row-start-${prevAltura + 1}`, `row-end-${nuevaAltura+1}`,  bgTexto);
        divFondo.style.gridColumn = `${colStart} / span 2`;
        roadmap.appendChild(divFondo);  
      } else {
        const divFondo = document.createElement("div");
        divFondo.classList.add(`row-start-${prevAltura + 1}`, `row-end-${prevAltura}`,  bgTexto);
        divFondo.style.gridColumn = `${colStart} / span 2`;
        roadmap.appendChild(divFondo);  

        divTexto.classList.add(`row-start-${prevAltura + 1}`, "row-end-10", "align-top");
         divTexto.style.gridColumn = `${colStart} / span 2`;
      }
      roadmap.appendChild(divTexto);

      // Dibujar Codo
      // 1. Recta Horizontal (en prevAltura)
      let divH = document.createElement("div");
      divH.classList.add(`row-start-${prevAltura}`, "row-span-1", colorSnake);
      divH.style.gridColumn = `${colStart} / span 1`;
      roadmap.appendChild(divH);

      // 2. Recta Vertical
      let divV = document.createElement("div");
      const startRow = Math.min(prevAltura, nuevaAltura);
      const endRow = Math.max(prevAltura, nuevaAltura);
      const span = endRow - startRow + 1;
      divV.classList.add(`row-start-${startRow}`, `row-span-${span}`, colorSnake);
      divV.style.gridColumn = `${colStart + 1} / span 1`;
      
      // Bordes
      if (isGoingDown) { 
           divV.classList.add("rounded-tr-3xl", "rounded-bl-3xl");
      } else { 
           divV.classList.add("rounded-br-3xl", "rounded-tl-3xl");
      }
      roadmap.appendChild(divV);

      prevAltura = nuevaAltura;
    }
  }
});

txtPasos.dispatchEvent(new Event("input"));


// Funcionalidad "Ver Código"
const btnVerCodigo = document.querySelector("#btnVerCodigo");
const dlgCodigo = document.querySelector("#dlgCodigo");
const txtCodigo = document.querySelector("#txtCodigo");
const btnCerrarDialog = document.querySelector("#btnCerrarDialog");

btnVerCodigo.addEventListener("click", () => {
  const article = document.querySelector("article");
  txtCodigo.value = article.outerHTML;
  dlgCodigo.showModal();
});

btnCerrarDialog.addEventListener("click", () => {
  dlgCodigo.close();
});