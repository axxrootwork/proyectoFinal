//Seleccionar los elementos del DOM
const juegosEl = document.getElementById("juegos");
const listaCarritoEl = document.getElementById("lista-carrito");
const totalCarritoEl = document.getElementById("total-carrito");
const comprarTodoEl = document.getElementById("comprar-todo");
const borrarCarritoEl = document.getElementById("borrar-carrito");

//Variables globales
let juegos = [];
let carrito = [];

//Función para cargar los juegos desde un archivo JSON
async function cargarJuegos() {
    try {
        const response = await fetch("/JSON/data.json");
        juegos = await response.json();
        mostrarJuegos(juegos);
    } catch (error) {
        console.log(error);
    }
}

function mostrarJuegos(juegos) {
    juegosEl.innerHTML = "";
    juegos.forEach((juego) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${juego.nombre}</h3>
            <img src="${juego.imagen}" alt="${juego.nombre}" />
            <p>Precio: ${juego.precio}</p>
            <button id="boton-${juego.id}">Agregar al carrito</button>
        `;
        juegosEl.appendChild(div);

        const boton = div.querySelector(`#boton-${juego.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(juego);
        });
    });
}


//Función para agregar un juego al carrito
function agregarAlCarrito(juego) {
    const productoEnCarrito = carrito.find((producto) => producto.id === juego.id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const productoNuevo = {
            id: juego.id,
            nombre: juego.nombre,
            precio: juego.precio,
            imagen: juego.imagen,
            cantidad: 1
        };
        carrito.push(productoNuevo);
    }
    mostrarCarrito();
}


//Función para mostrar el carrito en la página
function mostrarCarrito() {
    listaCarritoEl.innerHTML = "";
    carrito.forEach((producto) => {
        const li = document.createElement("li");
        li.innerHTML = `
        ${producto.nombre} - ${producto.cantidad} x $${producto.precio}
        <button id="boton-eliminar-${producto.id}">Eliminar</button>
        `;
        listaCarritoEl.appendChild(li);

        const botonEliminar = li.querySelector(`#boton-eliminar-${producto.id}`);
        botonEliminar.addEventListener("click", () => {
            eliminarDelCarrito(producto);
        });
    });

    actualizarTotalCarrito();
}

//Función para eliminar un juego del carrito
function eliminarDelCarrito(producto) {
    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        carrito = carrito.filter((p) => p.id !== producto.id);
    }
    mostrarCarrito();
}

//Función para actualizar el total del carrito en la página
function actualizarTotalCarrito() {
    const total = carrito.reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0);
    totalCarritoEl.innerText = `Total: $${total}`;
}

//Función para comprar todo
function comprarTodo() {
    alert("¡Gracias por su compra!");
    carrito = [];
    mostrarCarrito();
}

//Función para borrar el carrito
function borrarCarrito() {
    carrito = [];
    mostrarCarrito();
}

//Cargar los juegos al cargar la página
cargarJuegos();

//Agregar event listeners a los botones
comprarTodoEl.addEventListener("click", comprarTodo);
borrarCarritoEl.addEventListener("click", borrarCarrito);