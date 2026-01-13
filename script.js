// Configuración: URL de tu Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx_TBMaF63FegMj-Oz-QQJo1jJNITfIUM8mdJFnTBxxry9_fqIhyYu8Leo_R7lnCBx0/exec";

window.onload = async () => {
    // 1. Obtener el código desde la URL (ej: ?codigo=OSO-123)
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get('codigo');

    if (!codigo) {
        mostrarError("No se encontró ningún código. Por favor, escaneá el QR de tu ticket de compra.");
        return;
    }

    // Guardar el código en el input oculto del formulario
    document.getElementById('codigo-input').value = codigo;

    try {
        // 2. Validar con Google si el código existe y no fue usado
        // Agregamos un timestamp (t=...) para evitar que el navegador guarde una respuesta vieja (caché)
        const res = await fetch(`${SCRIPT_URL}?codigo=${codigo}&t=${new Date().getTime()}`);
        const data = await res.json();

        if (data.valid) {
            // Si es válido, ocultamos el cargando y mostramos el formulario
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('form-container').classList.remove('hidden');
        } else {
            // Si el código ya se usó o no existe
            mostrarError(data.message);
        }
    } catch (e) {
        console.error("Error de validación:", e);
        mostrarError("Error de conexión. Asegurate de tener internet e intentá de nuevo.");
    }
};

// 3. Manejar el envío del formulario
document.getElementById('sorteo-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btn-enviar');
    btn.disabled = true;
    btn.innerText = "Enviando registro...";

    // Recolectamos todos los campos del formulario
    const codigo = document.getElementById('codigo-input').value;
    const nombre = e.target.nombre.value;
    const whatsapp = e.target.whatsapp.value;
    const nroCompra = e.target.nro_compra.value; 
    const instagram = e.target.instagram.value;  
    const aceptaPromos = e.target.newsletter.checked ? "Sí" : "No";

    // Usamos URLSearchParams para enviar los datos por POST
    const params = new URLSearchParams();
    params.append('codigo', codigo);
    params.append('nombre', nombre);
    params.append('whatsapp', whatsapp);
    params.append('nroCompra', nroCompra); // Debe coincidir con p.nroCompra en el Apps Script
    params.append('instagram', instagram);
    params.append('newsletter', aceptaPromos);

    try {
        // Enviamos el registro a Google Sheets
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: params,
            mode: 'no-cors' 
        });
        
        // Ocultamos formulario y mostramos mensaje de éxito con el GIF
        document.getElementById('form-container').classList.add('hidden');
        document.getElementById('success-container').classList.remove('hidden');
        
        // Scroll hacia arriba para que se vea el mensaje de éxito y el GIF
        window.scrollTo(0, 0);
        
    } catch (e) {
        console.error("Error de envío:", e);
        alert("Hubo un problema al guardar tus datos. Por favor, intentá de nuevo.");
        btn.disabled = false;
        btn.innerText = "ENVIAR Y PARTICIPAR";
    }
};

/**
 * Función auxiliar para mostrar errores visuales
 */
function mostrarError(msg) {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('error-container').classList.remove('hidden');
    document.getElementById('error-msg').innerText = msg;
}