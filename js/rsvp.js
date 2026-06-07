// rsvp.js

let attending = null;

function selectAttendance(isAttending) {
    attending = isAttending;
    
    const btnYes = document.getElementById('btn-rsvp-yes');
    const btnNo = document.getElementById('btn-rsvp-no');
    
    const yesContainer = document.getElementById('rsvp-yes-container');
    const noContainer = document.getElementById('rsvp-no-container');
    
    const nameYes = document.getElementById('name-yes');
    const nameNo = document.getElementById('name-no');
    const guestsSelect = document.getElementById('guests');
    
    // Almacenar el estado
    document.getElementById('attendance').value = isAttending ? "yes" : "no";

    if (isAttending) {
        btnYes.classList.add('btn-active');
        btnYes.classList.remove('btn-secondary');
        btnNo.classList.add('btn-secondary');
        btnNo.classList.remove('btn-active');
        
        // Mostrar form de Sí
        yesContainer.style.display = 'block';
        noContainer.style.display = 'none';
        
        // Configurar requeridos
        nameYes.required = true;
        guestsSelect.required = true;
        nameNo.required = false;
        
        // Limpiar campos del No
        nameNo.value = "";
        document.getElementById('decline-message').value = "";
    } else {
        btnNo.classList.add('btn-active');
        btnNo.classList.remove('btn-secondary');
        btnYes.classList.add('btn-secondary');
        btnYes.classList.remove('btn-active');
        
        // Mostrar form de No
        noContainer.style.display = 'block';
        yesContainer.style.display = 'none';
        
        // Configurar requeridos
        nameNo.required = true;
        nameYes.required = false;
        guestsSelect.required = false;
        
        // Limpiar campos del Sí
        nameYes.value = "";
        guestsSelect.value = "";
        document.getElementById('guest-names-container').innerHTML = '';
        document.getElementById('diet').value = "";
    }

    // Scroll suave hacia los campos abiertos
    setTimeout(() => {
        const targetContainer = isAttending ? yesContainer : noContainer;
        targetContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function updateGuestInputs() {
    const quantity = parseInt(document.getElementById('guests').value);
    const container = document.getElementById('guest-names-container');
    container.innerHTML = ''; // Limpiar anteriores

    if (quantity > 1) {
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

    const hostPhoneNumber = "5491164627109"; 
    let message = "";
    
    if (attending === null) {
        alert("Por favor, selecciona si vas a asistir o no.");
        return;
    }

    if (attending === false) {
        const nameNo = document.getElementById('name-no').value.trim();
        const declineMsg = document.getElementById('decline-message').value.trim();

        if (!nameNo) {
            alert("Por favor, completa tu nombre.");
            return;
        }

        message = `¡Hola Juana! Quería avisarte que lamentablemente no podré asistir a tus 15. \n\n` +
                  `👤 Nombre: ${nameNo}\n`;
        
        if (declineMsg) {
            message += `💬 Mensaje: "${declineMsg}"\n`;
        }
        
        message += `\n¡Te deseo una noche hermosa y que disfrutes muchísimo! 🎉`;
    } else {
        const nameYes = document.getElementById('name-yes').value.trim();
        const guestsSelect = document.getElementById('guests').value;
        const diet = document.getElementById('diet').value.trim() || 'Ninguna';

        if (!nameYes) {
            alert("Por favor, completa tu nombre.");
            return;
        }

        if (!guestsSelect) {
            alert("Por favor, selecciona la cantidad de personas.");
            return;
        }

        let guestNamesText = `  1. ${nameYes} (Titular)\n`;
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
