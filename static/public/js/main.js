if (window.location.pathname == '/account' || window.location.pathname == '/register') {
    const changePassword = document.querySelector('#changePassword');
    const togglePassword = document.querySelector('#togglePassword');
    let randomoutput = '';
    // character string
    let randomCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$';
    let randomCharactersSplit = randomCharacters.split('');
    // 10 times random character
    for (var i = 0; i < 10; i++) {
        randomoutput += randomCharacters.charAt(Math.floor(Math.random() * randomCharactersSplit.length));
    }
    changePassword.value = randomoutput;

    togglePassword.addEventListener('click', (e) => {
        // Toggle the type attribute
        const type = changePassword.getAttribute('type') === 'password' ? 'text' : 'password';
        changePassword.setAttribute('type', type);
        // Toggle eye icon
        togglePassword.classList.toggle('fa-eye-slash');
    });
};