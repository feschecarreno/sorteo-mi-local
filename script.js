const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxrhwggOKH9YaNhnse763z0sX2OGNGBEHi-ZS-75XykiEROUDl_M9p5KUBjSLlm9zI/exec";

window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get('codigo');

    if (!codigo) {
        mostrarError("No se encontró ningún código. Escaneá el QR de tu ticket.");
        return;
    }

    document.getElementById('codigo-input').value = codigo;

    try {
        const res = await fetch(`${SCRIPT_URL}?codigo=${codigo}`);
        const data = await res.json();

        if (data.valid) {
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('form-container').classList.remove('hidden');
        } else {
            mostrarError(data.message);
        }
    } catch (e) {
        mostrarError("Error de conexión. Intentá de nuevo.");
    }
};

document.getElementById('sorteo-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-enviar');
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData);

    try {
        // Usamos mode 'no-cors' para evitar bloqueos del navegador al escribir en Google
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: params,
            mode: 'no-cors'
        });
        
        document.getElementById('form-container').classList.add('hidden');
        document.getElementById('success-container').classList.remove('hidden');
    } catch (e) {
        alert("Error al enviar. Intentá de nuevo.");
        btn.disabled = false;
        btn.innerText = "ENVIAR Y PARTICIPAR";
    }
};

function mostrarError(msg) {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('error-container').classList.remove('hidden');
    document.getElementById('error-msg').innerText = msg;
}