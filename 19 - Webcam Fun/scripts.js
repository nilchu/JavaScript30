// @no-ts-check

let video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const button = document.querySelector('button')


async function getVideo() {

    try {
        let stream = await navigator.mediaDevices.getUserMedia( { audio: false, video: true } )
        video.srcObject = stream
        video.onloadedmetadata = () => {
            video.play()
        }
    } catch(err) {
        console.error(err.message, 'Webcam')
    }
    
}

function videoToCanvas() {
    const width = video.videoWidth
    const height = video.videoHeight

    canvas.width = width
    canvas.height = height

    //console.dir(ctx.getImageData(0,0,1,1))

    //let stream = video.srcObject
    //if(!stream) return 
    //console.log(stream.getTracks()[0].stop())
    //video.srcObject = null

    return setInterval(() => {

        ctx.drawImage(video, 0, 0, width, height)

        let pixels = ctx.getImageData(0,0, width, height)
        // pixels = redEffect(pixels)
        pixels = rgbSplit(pixels)

        ctx.putImageData(pixels, 0, 0)
    }, 50)
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 50
        pixels.data[i + 1] = pixels.data[i + 1] - 100
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5
        pixels.data[i + 3] = i % 5000
    }

    return pixels
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i]
        pixels.data[i + 100] = pixels.data[i + 1]
        pixels.data[i - 150] = pixels.data[i + 2]
    }

    return pixels
}

function takePhoto() {

    snap.currentTime = 0
    snap.play()

    const imgURL = canvas.toDataURL('image/png', 0.5)
    const link = document.createElement('a')
    /**
     * Not allowed to navigate top frame to data URL - Chrome Error
     * Therefore removed 
     */
    link.setAttribute('href', imgURL)
    link.setAttribute('download', 'photobooth')
    
    const image = new Image()
    image.src = imgURL
    
    link.appendChild(image)
    strip.insertBefore(link, strip.firstChild)
}

let posX = 0, posY = 0, prevPosX = 0, prevPosY = 0

function dragInit() {
    event.preventDefault()

    prevPosX = event.clientX
    prevPosY = event.clientY

    document.payload = {
        prevPosX,
        prevPosY,
        posX,
        posY
    }
    document.onmousemove = dragElement
    document.onmouseup = removeEventListeners
    
}

function dragElement() {
    event.preventDefault()
    
    posX = (prevPosX - event.clientX)
    posY = (prevPosY - event.clientY)
    prevPosX = event.clientX;
    prevPosY = event.clientY;


    video.style.top = (video.offsetTop - posY) + 'px'
    video.style.left = (video.offsetLeft - posX) + 'px'
}

function removeEventListeners() {
    document.onmousemove = null
    document.onmouseup = null
}

video.addEventListener('canplay', videoToCanvas)
video.addEventListener('mousedown', dragInit)
button.addEventListener('click', takePhoto)


getVideo()


