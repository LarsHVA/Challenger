
const challengeKnop = document.querySelector(".challengeKnop");
const alertSuccesvol = document.querySelector(".succes");

challengeKnop.addEventListener('click', () => {
    // Toggle succes challenge
    alertSuccesvol.classList.toggle('hidden');
    console.log('test');
});
