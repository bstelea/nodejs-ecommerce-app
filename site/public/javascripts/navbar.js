document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', navbarStick);

var navbar = document.getElementById("topnav");
var sticky = navbar.offsetTop;

function navbarStick() {
    if(window.pageYOffset >= sticky){
        navbar.classList.add("sticky");
    }
    else{
        navbar.classList.remove("sticky");
    }
}
})