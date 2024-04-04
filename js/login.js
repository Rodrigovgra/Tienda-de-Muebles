const cerrarSesion = document.getElementById("cerrarSesion");
const loginContainer = document.getElementById("login-container");

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Obtener usuarios almacenados en el localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si existe un usuario con los datos ingresados
    const authenticatedUser = users.find(user => user.username === username && user.password === password);

    if (username === '' || password === '') {
        Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
    
    } else if (authenticatedUser) {
        // Usuario autenticado correctamente
        localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
        Swal.fire('¡Bienvenido!', 'Has iniciado sesión correctamente.', 'success')
            .then(() => {
                // Redirigir a la página deseada
                // window.location.href = '../index.html';
                loginContainer.classList.add("disabled");
            });
        
        // // Asociar el carrito del usuario con el usuario autenticado NO FUNCIONA AAAAAAAAAAH
        // const cartKey = `cart_${authenticatedUser.id}`;
        // const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        // localStorage.setItem('productosEnCarrito', JSON.stringify(cart));
    } else {
        // Usuario no autenticado
        Swal.fire('Error', 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.', 'error');
    }
}

document.getElementById('register-link').addEventListener('click', function() {
    Swal.fire({
        title: 'Registro',
        html: `
            <input type="text" id="register-username" class="swal2-input" placeholder="Usuario">
            <input type="password" id="register-password" class="swal2-input" placeholder="Contraseña">
        `,
        showCancelButton: true,
        confirmButtonText: 'Registrarse',
        confirmButtonColor:"#4B3939",
        cancelButtonColor:"#5b605f",
        cancelButtonText: 'Cancelar',
        color: "rgb(70, 70, 70)",
        background: "#ddcdc4",
        preConfirm: () => {
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;

            // Verificar que no se dejen campos en blanco
            if (username === '' || password === '') {
                Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
                return false; // Detener la ejecución si hay campos vacíos
            }

            // Obtener usuarios almacenados en el localStorage
            let users = localStorage.getItem('users');

            // Si no hay usuarios almacenados, crear un nuevo array
            if (!users) {
                users = [];
            } else {
                // Si hay usuarios almacenados, convertir el JSON a array
                users = JSON.parse(users);
            }

            // Verificar si el nombre de usuario ya existe en el array
            const existingUser = users.find(user => user.username === username);

            if (existingUser) {
                Swal.fire('Error', 'El nombre de usuario ya está registrado. Por favor, elige otro.', 'error');
                return false; // Evitar que se cierre el modal de registro
            }

            // Generar un ID único basado en la marca de tiempo actual
            const userId = Date.now();

            // Agregar el nuevo usuario al array con el ID único
            users.push({ id: userId, username: username, password: password });

            // Convertir el array a JSON y guardarlo en el localStorage
            localStorage.setItem('users', JSON.stringify(users));

            Swal.fire('¡Registrado!', 'El usuario ha sido registrado correctamente.', 'success');
        }
    });
});
