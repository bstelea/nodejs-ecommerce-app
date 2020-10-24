var remail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const contactForm = document.getElementById('contactForm');
const email = document.getElementById('email');
const okButton = document.getElementById('okButton');

okButton.disabled = true;

email.addEventListener('keyup', function (event) {
  isValidEmail = remail.exec(email.value);
  if ( isValidEmail && email.value.length != 0) {
    email.style.color = "black";
    okButton.disabled = false;
  } else {
    email.style.color = "red";
    okButton.disabled = true;

  }
});