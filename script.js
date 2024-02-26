
utils.setup()
utils.setStyles()

var delta = 0
var lastTime = 0
var su = 0

var dropdown = new ui.Dropdown(["Hello", "Hi", "123", "Cool"])

function update(timestamp) {
    requestAnimationFrame(update)
    
    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, 1])

    dropdown.set(canvas.width/2, canvas.height/2, 800*su, 50*su)
    dropdown.set2(30*su, 5*su)

    dropdown.basic()

    dropdown.draw()

    input.updateInput(true)
}

input.checkInputs = (event) => {
    input.cistart()


    input.ciend()
}

input.scroll = (x, y) => {
   
}

requestAnimationFrame(update)