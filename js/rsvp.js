// rsvp.js

let attending = null;

// Configuración del listado automático en Google Sheets (Opcional, 100% gratuito)
// Pega aquí la URL de tu Web App de Google Apps Script una vez que la hayas creado.
const googleSheetWebAppUrl = ""; 

function selectAttendance(isAttending) {
    attending = isAttending;
    
    const btnYes = document.getElementById('btn-rsvp-yes');
    const btnNo = document.getElementById('btn-rsvp-no');
    
    const yesContainer = document.getElementById('rsvp-yes-container');
    const noContainer = document.getElementById('rsvp-no-container');
    
    const nameYes = document.getElementById('name-yes');
    const nameNo = document.getElementById('name-no');
    const guestsSelect = document.getElementById('guests');
    
    document.getElementById('attendance').value = isAttending ? "yes" : "no";

    if (isAttending) {
        btnYes.classList.add('btn-active');
        btnYes.classList.remove('btn-secondary');
        btnNo.classList.add('btn-secondary');
        btnNo.classList.remove('btn-active');
        
        yesContainer.style.display = 'block';
        noContainer.style.display = 'none';
        
        nameYes.required = true;
        guestsSelect.required = true;
        nameNo.required = false;
        
        nameNo.value = "";
        document.getElementById('decline-message').value = "";
    } else {
        btnNo.classList.add('btn-active');
        btnNo.classList.remove('btn-secondary');
        btnYes.classList.add('btn-secondary');
        btnYes.classList.remove('btn-active');
        
        noContainer.style.display = 'block';
        yesContainer.style.display = 'none';
        
        nameNo.required = true;
        nameYes.required = false;
        guestsSelect.required = false;
        
        nameYes.value = "";
        guestsSelect.value = "";
        document.getElementById('guest-names-container').innerHTML = '';
        document.getElementById('diet').value = "";
        document.getElementById('music-suggestion').value = "";
    }

    setTimeout(() => {
        const targetContainer = isAttending ? yesContainer : noContainer;
        targetContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function updateGuestInputs() {
    const quantity = parseInt(document.getElementById('guests').value);
    const container = document.getElementById('guest-names-container');
    container.innerHTML = ''; 

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
    let dataForSheet = {};
    
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

        // Datos para planilla
        dataForSheet = {
            fecha: new Date().toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires"}),
            asistencia: "No asiste",
            nombre: nameNo,
            cantidad_personas: 0,
            nombres_acompanantes: "",
            restricciones: "",
            musica: declineMsg // Guardamos el mensaje en el campo música de la planilla como nota
        };
    } else {
        const nameYes = document.getElementById('name-yes').value.trim();
        const guestsSelect = document.getElementById('guests').value;
        const diet = document.getElementById('diet').value.trim() || 'Ninguna';
        const musicSuggestion = document.getElementById('music-suggestion').value.trim() || 'Ninguna';

        if (!nameYes) {
            alert("Por favor, completa tu nombre.");
            return;
        }

        if (!guestsSelect) {
            alert("Por favor, selecciona la cantidad de personas.");
            return;
        }

        let guestNamesText = `  1. ${nameYes} (Titular)\n`;
        let companionNames = [];
        const nameInputs = document.querySelectorAll('.guest-name-input');
        nameInputs.forEach((input, index) => {
            const val = input.value.trim();
            guestNamesText += `  ${index + 2}. ${val}\n`;
            companionNames.push(val);
        });

        message = `¡Hola Juana! Confirmo asistencia a tus 15 años 🥳\n\n` +
                  `👥 Cantidad de personas: ${guestsSelect}\n` +
                  `Nombres de los invitados:\n${guestNamesText}\n` +
                  `🍽️ Restricciones alimentarias: ${diet}\n` +
                  `🎵 Canción sugerida: ${musicSuggestion}\n\n` +
                  `¡Nos vemos ahí para festejar! 🎉`;

        // Datos para planilla
        dataForSheet = {
            fecha: new Date().toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires"}),
            asistencia: "Sí asiste",
            nombre: nameYes,
            cantidad_personas: guestsSelect,
            nombres_acompanantes: companionNames.join(", "),
            restricciones: diet,
            musica: musicSuggestion
        };
    }

    // Si la URL de Google Sheets está configurada, enviamos los datos de fondo
    if (googleSheetWebAppUrl) {
        fetch(googleSheetWebAppUrl, {
            method: 'POST',
            mode: 'no-cors', // no-cors para evitar restricciones de preflight en Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataForSheet)
        }).catch(err => console.error("Error al enviar a Google Sheets:", err));
    }

    // Abrir WhatsApp inmediatamente
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${hostPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}
