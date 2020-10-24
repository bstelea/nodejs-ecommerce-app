$(window).scroll(function () {
    if ($(window).scrollTop() >= 50) {
        $('.navbar').css('background','#686868');
    } else {
        $('.navbar').css('background','transparent');
    }
});

$(window).on("load",function(){
  $(".loading-wrapper").fadeOut("slow");
});

// section polyfill
document.createElement('section');

// Object.create polyfill
if (!Object.create) {
    Object.create = create;
    function create(proto) {
        function F() { };
        F.prototype = proto;
        return new F();
    }
}