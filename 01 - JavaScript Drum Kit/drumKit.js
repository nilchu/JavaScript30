function playSound(e) {
  let audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  let key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (!audio) return;

  key.classList.add("active");
  audio.currentTime = 0;
  audio.play();
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("active");
}

let keys = document.querySelectorAll(".key");
keys.forEach(key => 
    key.addEventListener("transitionend", removeTransition)
);

window.addEventListener("keydown", playSound);
