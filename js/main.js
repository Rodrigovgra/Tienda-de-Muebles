// Declaro un array para los productos
let productos = [];

// Creo un fetch para traer el array almacenado en el json local
fetch ("js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        subirProductos(productos);
    });

function crearElementoHTML(producto, esPromocion = false) {
    const container = document.createElement("div");
    container.className = esPromocion ? "col-xl-4 col-md-4 col-sm-12" : "col-xl-3 col-md-6 col-sm-12";
    container.innerHTML += `
    <div class="card text-center">
        <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
            <h3 class="card-title">${producto.nombre}</h3>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text">$${producto.precio}</p>
            <a class="btn colorBtn" id="${producto.id}">Agregar al Carrito</a>
        </div>
    </div>
    `;
    return container;
}

function subirProductos () {
    const productos1 = productos.slice(0, 4);
    const productos2 = productos.slice(4, 8);
    const promociones = productos.slice(8, 11);

    productos1.forEach((producto) => {
        const container = crearElementoHTML(producto);
        const rowProductos1 = document.getElementById("rowProductos1");
        if (rowProductos1) {
            rowProductos1.appendChild(container);
        }
    });

    productos2.forEach((producto) => {
        const container = crearElementoHTML(producto);
        const rowProductos2 = document.getElementById("rowProductos2");
        if (rowProductos2) {
            rowProductos2.appendChild(container);
        }
    });

    promociones.forEach ((producto) => {
        const container = crearElementoHTML(producto, true);
        const rowPromociones = document.getElementById("rowPromociones");
        if (rowPromociones) {
            rowPromociones.appendChild(container);
        }
    });
    actualizarBotonesAgregar()
}

subirProductos();

function actualizarBotonesAgregar() {
    //llamado de todos los botones de agregar al carrito
    const botonAgregar = document.querySelectorAll(".btn");
    // Función para asignar la accion de agregar productos al carrito a los botones
    botonAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

//Declaro la variable sin un valor especifico
let productosCarrito;

//Hago un llamado al carrito del localStorage y lo almaceno en la variable productosCarritoLs
let productosCarritoLs = localStorage.getItem("productosEnCarrito");

//Si productosCarritoLs tiene contenido parseo la info y se la asigno a la variable de productosCarrito
if (productosCarritoLs){
    productosCarrito = JSON.parse(productosCarritoLs);
    //llamo a la funcion para actualizar el numero del carrito
    actualizarNumero();
} else {
    //si no hay info en localStorage se inicia productosCarrito como una arreglo vacio
    productosCarrito = [];
}

//Funcion que contiene la accion del boton agregar al carrito 
function agregarAlCarrito(e) {
    //Agrego un toast cada vez que se agrega un producto al carrito
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
        //   color: "",  
          background: "linear-gradient(to right, #413131, #6e5a5a)",
          borderRadius: ".2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', 
            y: '3rem' 
          },
        onClick: function(){} 
    }).showToast();
    // Obtengo el id del botón para reconocer el producto que se agrega al carrito
    const idBoton = e.currentTarget.id;
    //busco el id del producto mediante un find
    const productoAgregado = productos.find(producto => producto.id === parseInt(idBoton))
    //verifico si el producto ya está en el carrito
    if(productosCarrito.some(producto => producto.id === parseInt(idBoton))) {
        //si el producto ya esta en el carrito aumento su cantidad
        const index = productosCarrito.findIndex(producto => producto.id === parseInt(idBoton))
        productosCarrito[index].cantidad++;
    } else {
        //si no esta en el carrito lo agrego con la cantidad 1
        productoAgregado.cantidad = 1;
        productosCarrito.push(productoAgregado);
    }
    //se actualiza el numero del carrito y se guarda la info en el localStorage
    actualizarNumero();
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosCarrito));
}

//Funcion para actualizar el numero del carrito mediante un reduce
function actualizarNumero() {
    let nuevoNumero = productosCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numero.innerText = nuevoNumero;
}
