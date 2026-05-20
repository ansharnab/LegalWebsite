
// Disclaimer Modal Logic
const disclaimerModal = document.getElementById('disclaimer-modal');
const agreeBtn = document.getElementById('agree-btn');
const body = document.body;

// Function to show modal
function showDisclaimer() {
    disclaimerModal.classList.add('active');
    body.classList.add('modal-open');
}

// Function to hide modal
function hideDisclaimer() {
    disclaimerModal.classList.remove('active');
    body.classList.remove('modal-open');
    // Optional: Save to localStorage so it doesn't show again in this session/browser
    // localStorage.setItem('legalDisclaimerAgreed', 'true'); 
}

// Check if previously agreed (Optional - currently disabled to show every time as implied by "without agreeing ... won't show")
// const hasAgreed = localStorage.getItem('legalDisclaimerAgreed');
// if (!hasAgreed) {
//     showDisclaimer();
// }

// Always show on load for this demo/requirement
showDisclaimer();

if (agreeBtn) {
    agreeBtn.addEventListener('click', hideDisclaimer);
}
