if (addEventListener) {
  window.addEventListener('load', fetchElements);
} else {
  window.attachEvent('onload', fetchElements);
}

function fetchElements() {
  var remail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const email = document.getElementById('inputEmail');
  const submitButton = document.querySelector('#submitNewsletter');

  email.addEventListener('keyup', checkEmailValidity);

  function checkEmailValidity() {
    isValidEmail = remail.exec(email.value);
    if (isValidEmail && email.value.length != 0) {
      email.style.color = "black";
      submitButton.disabled = false;
    } else {
      email.style.color = "red";
      submitButton.disabled = true;
    }
  }
}
