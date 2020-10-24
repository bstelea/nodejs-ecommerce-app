if (addEventListener) {
    window.addEventListener('load', fetchElements);
} else {
    window.attachEvent('onload', fetchElements);
}

    
function fetchElements() {
    const password = document.getElementById('newPassword');
    const lowercase = document.getElementById('lowercase');
    const uppercase = document.getElementById('uppercase');
    const number = document.getElementById('onenumber');
    const length = document.getElementById('8chars');
    
    var roneLowerCase = /[a-z]+/;
    var roneUpperCase = /[A-Z]+/;
    var roneNumber = /\d+/;
    var lengthof8 = /[A-Za-z\d]{8,}/;

    if (password) {
        password.addEventListener('keyup', toggleColour);
    }

    function toggleColour() {
        if (roneLowerCase.exec(password.value)) {
            lowercase.classList.remove('red');
            lowercase.classList.add('green');
        } else if (!roneLowerCase.exec(password.value)) {
            lowercase.classList.remove('green');
            lowercase.classList.add('red');
        }

        if (roneUpperCase.exec(password.value)) {
            uppercase.classList.remove('red');
            uppercase.classList.add('green');
        } else if (!roneUpperCase.exec(password.value)) {
            uppercase.classList.remove('green');
            uppercase.classList.add('red');
        }

        if (roneNumber.exec(password.value)) {
            number.classList.remove('red');
            number.classList.add('green');
        } else if(!roneNumber.exec(password.value)) {
            number.classList.remove('green');
            number.classList.add('red');
        }

        if (lengthof8.exec(password.value)) {
            length.classList.remove('red');
            length.classList.add('green');
        } else if (!lengthof8.exec(password.value)) {
            length.classList.remove('green');
            length.classList.add('red');
        }
    }
}