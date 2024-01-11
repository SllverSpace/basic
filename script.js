
utils.setup()
utils.setStyles()

var delta = 0
var lastTime = 0
var su = 0

var test = new ui.TextBox("testing")

var test2 = new ui.Canvas([127, 127, 127, 1])

function update(timestamp) {
    requestAnimationFrame(update)
    
    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()

    test.set(canvas.width/2, canvas.height/2, 800*su, 100*su)
    test.outlineSize = 25*su

    test.hover()
    test.draw()

    test2.set(canvas.width/2, canvas.height/2-300*su, 500*su, 400*su)
    test2.draw()
    test2.bounds.minY = -500

    ui.setC(test2)

    ui.text(10*su, 250*su, 50*su, "Hello!!")

    test2.drawBorder(10*su, [0, 0, 0, 1])
    test2.drawScroll({x: 10*su, y: 10*su}, 10*su)

    ui.setC()

    input.updateInput()
}

input.checkInputs = (event) => {
    input.cistart()

    test.checkFocus(event)

    input.ciend()
}

input.scroll = (x, y) => {
    if (test2.hovered()) {
        test2.scroll(x, y)
    }
}

requestAnimationFrame(update)