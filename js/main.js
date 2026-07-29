/* ===========================
   UPMINAA FAN HUB
   MAIN JAVASCRIPT
=========================== */


/*
   Back To Top Button
*/


const backTopButton = document.querySelector(".back-top");



if (backTopButton) {


window.addEventListener("scroll", () => {


if (window.scrollY > 500) {


backTopButton.classList.add("show");


} else {


backTopButton.classList.remove("show");


}


});





backTopButton.addEventListener("click", () => {


window.scrollTo({

top:0,

behavior:"smooth"

});


});


}









/*
   Scroll Reveal Animation
*/


const animatedElements = document.querySelectorAll(

".cosplay-card, .gallery-card, .community-card, .youtube-card, .information-source"

);





const revealObserver = new IntersectionObserver(

(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";


revealObserver.unobserve(entry.target);


}


});


},

{

threshold:.15

}

);







animatedElements.forEach(element=>{


element.style.opacity="0";


element.style.transform="translateY(40px)";


element.style.transition=

"all .6s ease";



revealObserver.observe(element);


});









/*
   Image Error Detection

   Ajuda encontrar imagens quebradas
*/


const images = document.querySelectorAll("img");



images.forEach(image=>{


image.addEventListener("error",()=>{


console.warn(

"Image failed to load:",

image.src

);


});


});









/*
   Current Year Footer
*/


const year = document.querySelector(".copyright");


if(year){


year.innerHTML = year.innerHTML.replace(

"2026",

new Date().getFullYear()

);


}/* ===========================
   TWITCH LIVE STATUS SYSTEM
=========================== */


/*

Temporary Twitch status system.

Later we can connect:
- Twitch API
- Stream title
- Game category
- Viewers
- Thumbnail

*/


const twitchStatus = {


online:false,


title:"",


game:"",


viewers:0


};









function updateTwitchStatus(){



const liveContainers = document.querySelectorAll(

".live-header, .live-indicator"

);



const statusText = document.querySelector(

"#liveStatus"

);





const playerCard = document.querySelector(

".live-player-card"

);






if(twitchStatus.online){





if(statusText){


statusText.textContent="LIVE NOW";


}





if(playerCard){


playerCard.classList.add("live");


}





liveContainers.forEach(container=>{


container.classList.add("online");


});





}else{





if(statusText){


statusText.textContent="OFFLINE";


}





if(playerCard){


playerCard.classList.remove("live");


}





liveContainers.forEach(container=>{


container.classList.remove("online");


});



}




}









/*

Simulation mode

Remove later when API is connected

*/


function simulateTwitch(){



// Change to true to test LIVE mode


twitchStatus.online=false;



updateTwitchStatus();



}







simulateTwitch();









/*
   Open Twitch links safely
*/


const twitchLinks = document.querySelectorAll(

'a[href*="twitch.tv"]'

);



twitchLinks.forEach(link=>{


link.addEventListener("click",()=>{


console.log(

"Opening Twitch profile"

);


});


});/* ===========================
   YOUTUBE CONTENT SYSTEM
=========================== */


/*

Future integration:

YouTube API will provide:

- Latest videos
- Shorts
- Titles
- Thumbnails
- Publish date
- Video links


*/


const youtubeContent = {


shorts:[


{


title:"Latest YouTube Short",


thumbnail:"",


url:"#"


},



{


title:"Popular YouTube Short",


thumbnail:"",


url:"#"


}



],





videos:[


{


title:"Latest Video",


thumbnail:"",


url:"#"


},



{


title:"Featured Video",


thumbnail:"",


url:"#"


}



]


};









function renderYoutubeContent(){



const youtubeCards = document.querySelectorAll(

".youtube-card"

);




const content = [


...youtubeContent.shorts,


...youtubeContent.videos


];







youtubeCards.forEach((card,index)=>{



const item = content[index];



if(!item) return;





const title = card.querySelector("h3");



const description = card.querySelector("p");





if(title){


title.textContent=item.title;


}





if(description){


description.textContent=

"Automatically updated from YouTube.";


}






if(item.thumbnail){


const placeholder = card.querySelector(

".youtube-placeholder"

);



if(placeholder){


placeholder.style.backgroundImage=

`url(${item.thumbnail})`;



}



}






});





}







renderYoutubeContent();









/* ===========================
   SMOOTH INTERNAL LINKS
=========================== */


const internalLinks = document.querySelectorAll(

'a[href^="#"]'

);



internalLinks.forEach(link=>{


link.addEventListener("click",(event)=>{



const target = document.querySelector(

link.getAttribute("href")

);





if(target){



event.preventDefault();




target.scrollIntoView({

behavior:"smooth"

});



}



});



});









/* ===========================
   SITE READY MESSAGE
=========================== */


console.log(

"%cUpminaa Fan Hub loaded successfully 💜",

"color:#8b5cf6;font-size:16px;font-weight:bold;"

);
