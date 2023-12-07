
utils.setup()
utils.setStyles()

var delta = 0
var lastTime = 0
var su = 0

var test = new ui.TextBox("testing")

function update(timestamp) {
    requestAnimationFrame(update)
    
    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()

    test.set(canvas.width/2, canvas.height/2, 600*su, 100*su)
    test.outlineSize = 25*su

    test.hover()
    test.draw()

    input.updateInput()
}

input.checkInputs = (event) => {
    input.cistart()

    test.checkFocus(event)

    input.ciend()
}

requestAnimationFrame(update)