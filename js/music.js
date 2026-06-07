// music.js

let musicStarted = false;

function toggleMusic(event) {
    if (event) {
        event.stopPropagation(); // Evita conflictos con el listener del click global
    }
    
    const music = document.getElementById('bg-music');
    const playIcon = document.getElementById('music-icon-play');
    const pauseIcon = document.getElementById('music-icon-pause');
    const musicBtn = document.getElementById('music-btn');

    if (music.paused) {
        music.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            musicBtn.classList.add('music-playing');
            musicStarted = true;
        }).catch(err => {
            console.log("El navegador bloqueó la reproducción automática. Se requiere interacción directa.");
        });
    } else {
        music.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        musicBtn.classList.remove('music-playing');
    }
}

// Reproducción automática suave al primer click/tap del usuario en la pantalla
document.addEventListener('click', () => {
    if (!musicStarted) {
        const music = document.getElementById('bg-music');
        music.play().then(() => {
            const playIcon = document.getElementById('music-icon-play');
            const pauseIcon = document.getElementById('music-icon-pause');
            const musicBtn = document.getElementById('music-btn');
            
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            musicBtn.classList.add('music-playing');
            musicStarted = true;
        }).catch(err => {
            console.log("Autoplay bloqueado hasta interacción directa con el botón de play.");
        });
    }
}, { once: true });
