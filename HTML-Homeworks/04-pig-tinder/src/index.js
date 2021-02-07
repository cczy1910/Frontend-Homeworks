let index = 0
let count = 8

function press(t) {
    let button = document.getElementsByClassName(t)[0]
    button.style.boxShadow = '0 0 7px #404040'
    setTimeout(() => {
        button.style.boxShadow = 'none'
    }, 100)
}

function like() {
    press("like")
    let current = document.getElementsByClassName("pig" + index)[0]
    let next = document.getElementsByClassName("pig" + ((index + 1) % count))[0]
    current.style['z-index'] = 2
    next.style['z-index'] = 1
    current.style['left'] = '120vw'
    setTimeout(() => {
        current.style['z-index'] = 0
        current.style['left'] = '0'
    }, 400)
    index = (index + 1) % count
}

function sup() {
    press("super")
    let current = document.getElementsByClassName("pig" + index)[0]
    let next = document.getElementsByClassName("pig" + ((index + 1) % count))[0]
    current.style['z-index'] = 2
    next.style['z-index'] = 1
    current.style['bottom'] = '100vh'
    setTimeout(() => {
        current.style['z-index'] = 0
        current.style['bottom'] = '0'
    }, 400)
    index = (index + 1) % count
}

function nope() {
    press("nope")
    let current = document.getElementsByClassName("pig" + index)[0]
    let next = document.getElementsByClassName("pig" + ((index + 1) % count))[0]
    current.style['z-index'] = 2
    next.style['z-index'] = 1
    current.style['left'] = '-120vw'
    setTimeout(() => {
        current.style['z-index'] = 0
        current.style['left'] = '0'
    }, 400)
    index = (index + 1) % count
}