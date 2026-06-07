// rsvp.js

// Almacena si asiste o no (true / false)
let attending = null;

function selectAttendance(isAttending) {
    attending = isAttending;
    
    const btnYes = document.getElementById('btn-rsvp-yes');
    const btnNo = document.getElementById('btn-rsvp-no');
    const fieldsContainer = document.getElementById('rsvp-fields-container');
    const detailsContainer = document.getElementById('attendance-details');
    const nameInput = document.getElementById('name');
    const guestsSelect = document.getElementById('guests');
    
    // Guardar el estado en el campo oculto
    document.getElementById('attendance').value = isAttending ? "yes" : "no";

    // Modificar estilos de los botones activos
    if (isAttending) {
        btnYes.classList.add('btn-active');
        btnYes.classList.remove('btn-secondary');
        btnNo.classList.add('btn-secondary');
        btnNo.classList.remove('btn-active');
        
        // Mostrar todos los campos
        fieldsContainer.style.display = 'block';
        detailsContainer.style.display = 'block';
        
        // Hacer requeridos los campos de asistencia
        nameInput.required = true;
        guestsSelect.required = true;
    } else {
        btnNo.classList.add('btn-active');
        btnNo.classList.remove('btn-secondary');
        btnYes.classList.add('btn-secondary');
        btnYes.classList.remove('btn-active');
        
        // Mostrar solo el campo de Nombre y el botón para enviar
        fieldsContainer.style.display = 'block';
        detailsContainer.style.display = 'none';
        
        // Quitar requeridos de los campos que se ocultaron
        nameInput.required = true;
        guestsSelect.required = false;
        guestsSelect.value = ""; // Limpiar selección
        document.getElementById('guest-names-container').innerHTML = ''; // Limpiar nombres dinámicos
    }

    // Scroll suave hacia los campos para mejor UX en móviles
    setTimeout(() => {
        fieldsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function updateGuestInputs() {
    const quantity = parseInt(document.getElementById('guests').value);
    const container = document.getElementById('guest-names-container');
    container.innerHTML = ''; // Limpiar campos anteriores

    if (quantity > 1) { // Empezamos desde el invitado 2, ya que el invitado 1 es el titular
        const title = document.createElement('p');
        title.style.fontSize = '0.9rem';
        title.style.color = 'var(--text-accent)';
        title.style.margin = '10px 0 5px 0';
        title.style.textAlign = 'left';
        title.innerText = 'Nombres de los acompañantes:';
        container.appendChild(title);

        for (let i = 2; i <= quantity; i++) {
            const div = document.createElement('div');
            div.className = 'form-group';
            div.style.marginBottom = '10px';
            div.innerHTML = `
                <label for="guest-name-${i}" style="font-size: 0.8rem;">Acompañante ${i}</label>
                <input type="text" id="guest-name-${i}" class="form-control guest-name-input" required placeholder="Nombre completo">
            `;
            container.appendChild(div);
        }
    }
}

function submitRSVP(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const hostPhoneNumber = "5491164627109"; 
    let message = "";
    
    if (attending === null) {
        alert("Por favor, selecciona si vas a asistir o no.");
        return;
    }

    if (!name) {
        alert("Por favor, completa tu nombre.");
        return;
    }

    if (attending === false) {
        message = `¡Hola Juana! Quería avisarte que lamentablemente no podré asistir a tus 15. \n\n` +
                  `👤 Nombre: ${name}\n\n` +
                  `¡Te deseo una noche hermosa y que disfrutes muchísimo! 🎉`;
    } else {
        const guestsSelect = document.getElementById('guests').value;
        const diet = document.getElementById('diet').value.trim() || 'Ninguna';

        if (!guestsSelect) {
            alert("Por favor, selecciona la cantidad de personas.");
            return;
        }

        // Recolectar nombres de los invitados (Invitado 1 es el titular, el resto son acompañantes)
        let guestNamesText = `  1. ${name} (Titular)\n`;
        const nameInputs = document.querySelectorAll('.guest-name-input');
        nameInputs.forEach((input, index) => {
            guestNamesText += `  ${index + 2}. ${input.value.trim()}\n`;
        });

        message = `¡Hola Juana! Confirmo asistencia a tus 15 años 🥳\n\n` +
                  `👥 Cantidad de personas: ${guestsSelect}\n` +
                  `Nombres de los invitados:\n${guestNamesText}\n` +
                  `🍽️ Restricciones alimentarias: ${diet}\n\n` +
                  `¡Nos vemos ahí para festejar! 🎉`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${hostPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}
