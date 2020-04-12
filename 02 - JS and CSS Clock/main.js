const hourHand = document.querySelector('.hour-hand')
const minHand = document.querySelector('.min-hand')
const secondHand = document.querySelector('.second-hand')


function render() {

    function checkFlicker(ele, deg) { 
        if (deg === 90) {
          ele.style.transition = 'none'
        } else {
          ele.style.transition = 'all 0.05s'
          ele.style.transitionTimingFunction = 'cubic-bezier(0.1, 2.7, 0.58, 1)'
        }
      }

    const date = new Date()
    const hour = date.getHours()
    const min = date.getMinutes()
    const second = date.getSeconds()

    degHour = ((hour / 12) * 360) + ((min/60)*30) + 90; 
    degMin = ((min / 60) * 360) + ((second/60)*6) + 90;
    degSecond = ((second / 60) * 360) + 90;

    checkFlicker(hourHand, degHour)
    checkFlicker(minHand, degMin)
    checkFlicker(secondHand, degSecond)

    hourHand.style.transform = `rotate(${degHour}deg)`
    minHand.style.transform = `rotate(${degMin}deg)`
    secondHand.style.transform = `rotate(${degSecond}deg)`

}

const interval = window.setInterval(render, 1000)

