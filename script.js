// just a template, not relavant to this project

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

var delta = 0
var lastTime = 0

var targetSize = {x: 1500, y: 1000}
var su = 1

var test = new ui.TextBox(0, 0, 0, 0, "testing")

function update(timestamp) {
    requestAnimationFrame(update)

    delta = (timestamp - lastTime) / 1000
	lastTime = timestamp
    if (!delta) { delta = 0 }
	if (delta > 0.5) { delta = 0.5 }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    var w = window.innerWidth
	var h = window.innerHeight

	let aspect = w / targetSize.x

	su = aspect
	if (su > h / targetSize.y) {
		su = h / targetSize.y
	}

    test.set(canvas.width/2, canvas.height/2, 600*su, 100*su)
    test.outlineSize = 25*su

    test.hover()
    test.draw()
}

input.checkInputs = (event) => {
    input.cistart()

    test.checkFocus(event)

    input.ciend()
}

requestAnimationFrame(update)