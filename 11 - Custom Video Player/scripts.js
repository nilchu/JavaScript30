const player = document.querySelector('.player')
const video = document.querySelector('video.player__video')
const progressBar = document.querySelector('.player .progress')
const progressFill = document.querySelector('.player .progress__filled')
const playButton = document.querySelector('.player .player__button')
const sliders = document.querySelectorAll('input[type="range"]')
const skipButtons = document.querySelectorAll('button[data-skip]')
const fullscreen = document.querySelector('.player button[data-fullscreen]')

function clearFocus() {
    this.blur()
}

function updateButton() {
    playButton.textContent = !this.paused ? '❚ ❚' : '►'
}

function togglePlay() {
    const method = video.paused ? 'play' : 'pause'
    video[method]()
    clearFocus()   
}

function seekPosition(event) {
    const currentSeekPosition = (event.offsetX / progressBar.clientWidth) * video.duration
    video.currentTime = currentSeekPosition

}

function updateProgressBar() {
    const filled = (video.currentTime * 100) / video.duration
    progressFill.style.flexBasis = `${filled}%`
}

function changeSliderValue() {
    video[this.name] = this.value
}

function skip() {
    const updatedTime = video.currentTime + parseFloat(this.dataset.skip)
    if(updatedTime < 0) video.currentTime = 0
    if(updatedTime > video.duration) video.currentTime = 0
    video.currentTime = updatedTime
    clearFocus()
}

function toggleFullscreen() {
    if(this.dataset.fullscreen) {
        enterFullscreen(video)
    } else {
        exitFullscreen()
    }
}

function enterFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen()
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen()
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    }
  }

  function exitFullscreen() {
    if(document.exitFullscreen) {
      document.exitFullscreen()
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

function checkForKeyboardAction(event) {
    if(event.keyCode === 32) {
        window.focus()
        togglePlay()
    }
}

// taken from underscore.js via https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	let timeout
	return function() {
		const context = this, args = arguments;
		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

video.addEventListener('timeupdate', updateProgressBar)
video.addEventListener('seeked', updateProgressBar)
video.addEventListener('click', togglePlay)
video.addEventListener('pause', updateButton)
video.addEventListener('play', updateButton)

playButton.addEventListener('click', togglePlay)

let mousedown = false
progressBar.addEventListener('click', seekPosition)
progressBar.addEventListener('mousemove', e => mousedown ? debounce(seekPosition(e),50) : undefined)
progressBar.addEventListener('mousedown', () => mousedown = true)
progressBar.addEventListener('mouseup', () => mousedown = false)

sliders.forEach( slider => slider.addEventListener('change', changeSliderValue))
sliders.forEach( slider => slider.addEventListener('mousemove', changeSliderValue))

skipButtons.forEach( skipButton => skipButton.addEventListener('click', skip))

fullscreen.addEventListener('click', toggleFullscreen)

window.addEventListener('keydown', checkForKeyboardAction)