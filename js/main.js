// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Countdown
    // Date: 8 de Julio de 2026, 20:00 hs Argentina
    initCountdown('2026-07-08T20:00:00-03:00');
    
    // Initialize Scroll Animations
    initScrollAnimations();
});

// Function to copy CBU to clipboard
function copyCBU() {
    const cbuText = document.getElementById('cbu-text').innerText;
    navigator.clipboard.writeText(cbuText).then(() => {
        alert("¡CBU copiado al portapapeles!");
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}
