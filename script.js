// Configuración específica Oso a la Piedra
const CONFIG = {
    brandName: 'OSO A LA PIEDRA',
    brandColor: '#EE5E4D', // Rojo Cardenal
    brandSecondary: '#FEAB45', // Amarillo Oro
    scriptUrl: 'https://script.google.com/macros/s/AKfycbxrhwggOKH9YaNhnse763z0sX2OGNGBEHi-ZS-75XykiEROUDl_M9p5KUBjSLlm9zI/exec',
    
    // Mensajes personalizados de marca
    messages: {
        welcome: '¡Bienvenido a Oso a la Piedra!',
        success: '¡Perfecto! Ahora completá tus datos para participar',
        duplicate: '¡Este código ya fue utilizado! Una participación por compra 🍔',
        error: 'Ups, algo salió mal. Intentá nuevamente',
        submitted: '¡Felicitaciones! Ya estás participando del sorteo Oso a la Piedra 🏆'
    }
};

// Función para mostrar notificaciones con estilo marca
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Animación de confeti al ganar
function launchConfetti() {
    const colors = ['#EE5E4D', '#FEAB45', '#008459', '#F495BA'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            opacity: 0;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Agregar animación CSS para confeti
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Función cuando se envía exitosamente
function onSuccessSubmit(codigo) {
    showNotification(CONFIG.messages.submitted, 'success');
    launchConfetti();
    showStep('confirm');
    
    // Actualizar el código mostrado
    if (elements.codigoConfirmado) {
        elements.codigoConfirmado.textContent = codigo;
    }
}

// En el formulario, modificar el submit
if (elements.participacionForm) {
    elements.participacionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validación de términos
        if (!document.getElementById('terminos').checked) {
            showNotification('Debés aceptar las bases y condiciones para participar', 'error');
            return;
        }
        
        // Mostrar estado de carga
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        try {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simular envío (reemplazar con tu backend)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Éxito
            onSuccessSubmit(data.codigo);
            
        } catch (error) {
            console.error('Error:', error);
            showNotification(CONFIG.messages.error, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
}