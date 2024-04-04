//Hago un llamado al carrito guardado en el localStorage
let productosCarrito = localStorage.getItem("productosEnCarrito");
//le saco el formato JSON
productosCarrito = JSON.parse(productosCarrito);

//Accedo a los elementos necesarios del DOM
const carritoVacio = document.getElementById("carritoVacio");
const footerCarrito = document.getElementById("footerCarrito");
const contenedorProductos = document.getElementById("productos-carrito");
const contenedorFunciones = document.getElementById("funciones-carrito");
let productoCarritoEliminar = document.querySelectorAll(".producto-carrito-eliminar");
const btnVaciarCarrito = document.getElementById("funciones-carrito-vaciar");
const totalCarrito = document.getElementById("totalCarrito");
const btnComprarCarrito = document.getElementById("funciones-carrito-comprar");

//Creo la funcion para subir los productos al carrito
function subirProductosAlCarrito() {
    //funcion para crear las tarjetas cuando haya productos en el localStorage
    if (productosCarrito && productosCarrito.length > 0) {
        carritoVacio.classList.add("disabled")
        contenedorProductos.classList.remove("disabled");
        contenedorFunciones.classList.remove("disabled");
        contenedorProductos.innerHTML = "";
        productosCarrito.forEach(producto => {
            const div = document.createElement("div")
            div.classList.add("productoCarrito")
            div.innerHTML = `
                <img class="producto-carrito-img" src="${producto.img}" alt="${producto.nombre}">  
                <div class="producto-carrito-nombre">
                    <p> Nombre </p>
                    <p class="nombre"> ${producto.nombre}</p>
                </div>      
                <div class="producto-carrito-cantidad">
                    <p> Cantidad </p>
                    <p>${producto.cantidad}</p>
                </div>           
                <div class="producto-carrito-precio">
                    <p>Precio</p>
                    <p>$${producto.precio}</p>
                </div>          
                <div class="producto-carrito-subtotal">
                    <p>Subtotal</p>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="producto-carrito-eliminar boton" id="${producto.id}">
                    <svg class="basura" xmlns="http://www.w3.org/2000/svg" width="25" height="28" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                </button>
    
            `;
            contenedorProductos.appendChild(div);
        });
        //se actualizan el boton de eliminar y el total del carrito cada vez que se crean las tarjetas
        actualizarBotonesEliminar();
        actualizarTotal()

    } else {
        //cuando el carrito esta vacio
        carritoVacio.classList.remove("disabled")
        contenedorProductos.classList.add("disabled");
        contenedorFunciones.classList.add("disabled");
        footerCarrito.classList.add("footerCarrito");
    }
}
//llamado para subir los productos
subirProductosAlCarrito()

//Creo la funcion para asignarle un evento a los botones de eliminar del carrito
function actualizarBotonesEliminar() {
    productoCarritoEliminar = document.querySelectorAll(".producto-carrito-eliminar");

    productoCarritoEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

//Creo la funcion para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosCarrito.findIndex(producto => producto.id === parseInt(idBoton));
    if (index !== -1) {
        // Para reducir la cantidad del producto si esta es mayor a 1
        if (productosCarrito[index].cantidad > 1) {
            productosCarrito[index].cantidad--;
            //Agrego un toast
            Toastify({
                text: "Producto Eliminado",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #413131, #6e5a5a)",
                    borderRadius: "0.375rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                },
                offset: {
                    x: '1.5rem',
                    y: '1.5rem'
                },
                onClick: function () { }
            }).showToast();
        } else {
            // Si la cantidad es 1 o menos, elimina el producto del carrito
            productosCarrito.splice(index, 1);
        }
        //Llamo la funcion de subir al carrito para actualizar las tarjetas de los productos o actualizar los disabled en el caso de que el carrito este vacio
        subirProductosAlCarrito()
        //Guardo los cambios en el localStorage
        localStorage.setItem("productosEnCarrito", JSON.stringify(productosCarrito));
    }
}

//Agrego un evento al boton de vaciar carrito
btnVaciarCarrito.addEventListener("click", vaciarCarrito);
//Funcion que contiene la accion del boton vaciar carrito
function vaciarCarrito() {
    //Agrego una alerta interactiva
    Swal.fire({
        title: "Zona de peligro",
        text: `Se borraran ${productosCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Estoy seguro",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            //Si el usuario confirma se elimina el carrito, se actualiza el contenedor del mismo y se guarda en el localStorage
            productosCarrito.length = 0;
            localStorage.setItem("productosEnCarrito", JSON.stringify(productosCarrito));
            subirProductosAlCarrito();
            Swal.fire({
                title: "Eliminado",
                text: "Carrito eliminado exitosamene",
                icon: "success"
            });
        }
    });
}

//Funcion para actualizar el total del carrito mediante un reduce
function actualizarTotal() {
    const total = productosCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    totalCarrito.innerText = `$${total}`;
}

//Agrego un evento el boton de comprar carrito
btnComprarCarrito.addEventListener("click", comprarCarrito);
//Funcion que contiene la accion del boton comprar carrito
function comprarCarrito() {
    //agrego un setTimeout para demorar el vaciamiento del carrito
    setTimeout(() => {
        productosCarrito.length = 0;
        localStorage.setItem("productosEnCarrito", JSON.stringify(productosCarrito));
        subirProductosAlCarrito();
    }, 1500)
    //agrego un alerta
    Swal.fire({
        position: "center-center",
        icon: "success",
        title: "Gracias por tu compra!",
        showConfirmButton: false,
        timer: 1500
    });
}
