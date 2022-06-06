const FullScreen = document.getElementById("FullScreen")
   FullScreen.setAttribute('class', 'btn bg-success rounded-circle shadow-lg')
   FullScreen.setAttribute('type', 'button')
   FullScreen.setAttribute('aria-label', 'Click:FullScreen')
   let BxScreen = document.createElement('IMG')
      BxScreen.setAttribute('src', 'assets/img/boxicons/bx-fullscreen-sm.svg')
      BxScreen.setAttribute('alt', 'bx-fullscreen')
FullScreen.appendChild(BxScreen)


function GetFullscreenElement() {
   return document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullscreenElement
      || document.msFullscreenElement
}

function BtnToggle_FullScreen() {
   if (GetFullscreenElement()) {
      document.exitFullscreen()
   } else {
      document.documentElement.requestFullscreen().catch(console.log)
      // "catch(console.log)" Si hay un error, que se registre en la consola.
   }
}

const Bx_FullScreen = document.querySelector("#FullScreen img")
FullScreen.onclick = function() {
   let isNot = Bx_FullScreen.getAttribute('src')
   if (isNot === 'assets/img/boxicons/bx-fullscreen-sm.svg') {
      Bx_FullScreen.setAttribute('src', 'assets/img/boxicons/bx-exit-fullscreen-sm.svg')
   } else {
      Bx_FullScreen.setAttribute('src', 'assets/img/boxicons/bx-fullscreen-sm.svg')
   }
   BtnToggle_FullScreen()
}