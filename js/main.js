// ===============================
// UPMINAA FAN HUB SCRIPT
// Developed by 1ANXTZ
// ===============================



// BACK TO TOP

const backTop = document.querySelector(".back-top");


if(backTop){


window.addEventListener("scroll",()=>{


if(window.scrollY > 500){

backTop.classList.add("show");

}else{

backTop.classList.remove("show");

}


});



backTop.addEventListener("click",()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


});


}







// SCROLL REVEAL ANIMATION


const sections = document.querySelectorAll("section");



const revealObserver = new IntersectionObserver((entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";


}


});


},{

threshold:0.15

});



sections.forEach(section=>{


section.style.opacity="0";

section.style.transform="translateY(40px)";

section.style.transition="all .8s ease";


revealObserver.observe(section);


});








// AUTOMATIC COPYRIGHT YEAR


const copyright = document.querySelector(".copyright");


if(copyright){


const year = new Date().getFullYear();


copyright.innerHTML = 
`© ${year} Upminaa Fan Hub`;


}







// IMAGE ERROR HANDLER


const images = document.querySelectorAll("img");



images.forEach(img=>{


img.addEventListener("error",()=>{


img.style.display="none";


console.warn(
"Image failed to load:",
img.src
);


});


});
// ===============================
// GALLERY IMAGE PREVIEW
// ===============================


const galleryImages = document.querySelectorAll(".gallery-item img");



if(galleryImages.length){



const modal = document.createElement("div");


modal.className = "image-modal";



modal.innerHTML = `

<div class="modal-content">

<img src="" alt="Expanded gallery image">

</div>

`;



document.body.appendChild(modal);




const modalImage = modal.querySelector("img");




galleryImages.forEach(image=>{


image.addEventListener("click",()=>{


modalImage.src = image.src;


modal.classList.add("active");


});


});





modal.addEventListener("click",()=>{


modal.classList.remove("active");


});



}









// ===============================
// SOCIAL LINKS PLACEHOLDER CHECK
// ===============================


const links = document.querySelectorAll("a");



links.forEach(link=>{


link.addEventListener("click",(event)=>{


if(link.getAttribute("href")==="#"){


event.preventDefault();


console.log(
"This link still needs to be configured."
);


}


});


});









// ===============================
// SIMPLE PERFORMANCE SETTINGS
// ===============================


window.addEventListener("load",()=>{


document.body.classList.add("loaded");


});







// ===============================
// FUTURE TWITCH STATUS AREA
// ===============================


// Later you can connect Twitch API here
// to automatically change:
// OFFLINE -> LIVE
// and update stream information.



console.log(
"Upminaa Fan Hub loaded successfully 🚀"
);
