let load = document.getElementById('load');

window.addEventListener('load', function(){
    setTimeout(function(){
        load.style.display ='none';
    },1500);
})
//

let brocode =document.getElementById('vpr');
let navbar = document.getElementById('navbar');
let  navbarbrand = document.getElementById('navbarbrandimg');

window.addEventListener('scroll', function(){
    if(window.scrollY > 150){
        navbar.style.background= "linear-gradient( rgb(0,0,0,0.3))";
        navbar.style.backdropFilter = "blur(20px)"
        navbarbrand.src="photos/logo2.png";
    }
    else{
        navbar.style.backgroundColor="#000";
        navbarbrand.src="photos/logo1.png";
    }
})
// 
let testimain = document.getElementById('testimain');

let btnsreview1 = document.getElementById('btnsreview1');
let btnsreview2 = document.getElementById('btnsreview2');

btnsreview1.addEventListener('click', function(){
    testimain.scrollLeft +=380;
   
})
btnsreview2.addEventListener('click', function(){
    testimain.scrollLeft -=380;
   
})
//
//

let lightdark = document.getElementById('lightdark');
lightdark.addEventListener('click', function(){
    document.body.classList.toggle('dark-mode');
})