// rsvp.js

function updateGuestInputs() {
    const quantity = parseInt(document.getElementById('guests').value);
    const container = document.getElementById('guest-names-container');
    container.innerHTML = ''; // Limpiar campos anteriores

    if (quantity > 0) {
        for (let i = 1; i <= quantity; i++) {
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label for="guest-name-${i}">Nombre y Apellido - Invitado ${i}</label>
                <input type="text" id="guest-name-${i}" class="form-control guest-name-input" required placeholder="Nombre del invitado ${i}">
            `;
            container.appendChild(div);
        }
    }
}

function submitRSVP(event) {
    event.preventDefault();

    const guestsSelect = document.getElementById('guests').value;
    const diet = document.getElementById('diet').value.trim() || 'Ninguna';
    
    if (!guestsSelect) {
        alert("Por favor, selecciona la cantidad de personas.");
        return;
    }

    const hostPhoneNumber = "5491164627109"; 
    let message = "";
    
    if (guestsSelect === "0") {
        message = `Hola! Quería avisar que lamentablemente no podremos asistir a los 15 de Juana. ¡Que disfruten mucho!`;
    } else {
        // Recolectar nombres de los invitados
        const nameInputs = document.querySelectorAll('.guest-name-input');
        let guestNamesText = "";
        nameInputs.forEach((input, index) => {
            guestNamesText += `  ${index + 1}. ${input.value.trim()}\n`;
        });

        message = `¡Hola! Confirmo asistencia a los 15 de Juana 🎉\n\n` +
                  `👥 Cantidad de personas: ${guestsSelect}\n` +
                  `Nombres de los invitados:\n${guestNamesText}\n` +
                  `🍽️ Restricciones alimentarias: ${diet}\n\n` +
                  `¡Nos vemos ahí!`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${hostPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}
