const form = document.querySelector('#custom')
    const input = document.querySelector('[name="minutes"]')
    const buttons = document.querySelectorAll('.timer__controls > button')
    const displayTimeLeft = document.querySelector('.display__time-left')
    const displayEndTime = document.querySelector('.display__end-time')
    const cursor = document.querySelector('.cursor')

    let timer;
    const audio = new Audio('alarm.mp3')

    window.addEventListener('mousemove', (e) => {
        const mouseCoords = { x: e.pageX, y: e.pageY }
        cursor.style.left = mouseCoords.x + 'px'
        cursor.style.top = mouseCoords.y + 'px'
    })

    buttons.forEach( button => {
        button.addEventListener('click', function() {
            startTimer(this.dataset.time)
        })

        button.addEventListener('mouseover', function() {
            cursor.style.transform = 'scale(1.2)'
        })

        button.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)'
        })
    })


    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const value = input.value
      if(!validateInpute(value)) {
        throw new TypeError('Input needs to be a number')
      }

      startTimer(value * 60)
      event.target.reset()
    })


    function prepareDisplayString(seconds) {
      
      let h, m, s, carry = 0

      carry = Math.floor(seconds / 60)
      s = (seconds % 60).toString().padStart(2, '0')

      m = (carry % 60).toString().padStart(2, '0')
      carry = Math.floor(carry / 60)

      h = carry.toString().padStart(2, '0')

      return `${h}:${m}:${s}`
    }


    function startTimer(seconds) {

      // Clear timer in case it was already running to prevent several 
      // instances from intervering with each other
      clearInterval(timer)
      audio.pause()

      // Calculate the time the timer finishes
      const date = new Date( Date.now() + ( seconds * 1000 ) )
      const h = date.getHours()
      const m = date.getMinutes()
      const s = date.getSeconds()
      const endTime = `${h}:` +
                      `${m >= 10 ? m : '0' + m}:` +
                      `${s >= 10 ? s : '0' + s}`

      displayEndTime.textContent = `Be back at ${endTime}`

      // Trick to run function immediately without executing outside the setInterval method
      // Execute function argument and return itself
      timer = setInterval( function run() {

        const display = prepareDisplayString(seconds)
        displayTimeLeft.textContent = display
        document.title = '⏰ ' + display
        if(seconds > 0) {
          --seconds
          return run
        } else {
          audio.play()
          clearInterval(timer)
        }
      }(),1000) 
    }


    // Check if the input contains only digits
    function validateInpute(input) {
      const regex = new RegExp(/^\d+$/,'i')
      const valid = regex.test(input)
      return valid
    }