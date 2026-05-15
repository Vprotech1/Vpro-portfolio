let load = document.getElementById('load');

window.addEventListener('load', function(){
    setTimeout(function(){
        load.style.display ='none';
    },1500);
})
// 
let navbar = document.getElementById('navbar');
let  navbarbrand = document.getElementById('navbarbrandimg');

window.addEventListener('scroll', function(){
    if(window.scrollY > 150){
        navbar.style.background= "linear-gradient( rgb(0,0,0,0.3))";
        navbar.style.backdropFilter = "blur(20px)"
        navbarbrand.src="photos/logo2.png";
    }
    else{
        navbar.style.backgroundColor="black"
        navbarbrand.src="photos/logo1.png";
    }
})