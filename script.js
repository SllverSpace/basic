
utils.setup()
utils.ignoreSafeArea()
utils.setStyles()

var delta = 0
var lastTime = 0
var su = 0

var dropdown = new ui.Dropdown(["Hello", "Hi", "123", "Cool"])

var test = new ui.SideButton("Testing")
test.bgColour = [0, 0, 0, 0.75]

var test2 = new ui.Button("rect", "Click Me!")

var textBox = new ui.TextBox("type here")

var fps = 0
var fps2 = 0

function update(timestamp) {
    requestAnimationFrame(update)
    fps++
    
    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()

    ui.text(100*su, 50*su, 50*su, fps2)

    let lines = ui.text(20*su, 50*su, 30*su, "This is a very long piece of text \nand now it's another line, but what happens if a just talk a lot, ohhh gotcha it's going to start wrapping lol, here's the alphabet: abcdefghijklmnopqrstuvwyxz0123456789 \nand here's some more yapping on a new line", {wrap: 500*su}).lines
    ui.rect(50*su, 50*su+lines*30*su*ui.spacingMul*ui.fontSizeMul, 20*su, 20*su, [255, 0, 0, 1])
    
    textBox.set(canvas.width/2, canvas.height/2-100*su, 800*su, 50*su)
    textBox.outlineSize = 10*su

    textBox.hover()
    textBox.draw()

    dropdown.set(canvas.width/2, canvas.height/2, 800*su, 50*su)
    dropdown.set2(30*su, 5*su)

    dropdown.basic()

    dropdown.draw()

    test.set(canvas.width/2, canvas.height/2+200*su, 500*su, 50*su)
    test.textSize = 50*su

    test.basic()
    test.draw()

    if (test.hovered() && input.mouse.lclick) {
        test.click()
    }

    test2.set(canvas.width/2, canvas.height/2-200*su, 75*su, 75*su)
    test2.textSize = 20*su
    test2.basic()
    test2.draw()

    if (test2.hovered() && input.mouse.lclick) {
        test2.click()
    }

    // if (input.mouse.lclick) {
    //     utils.requestAddToHomeScreen()
    // }

    // ui.text(10*su, 35*su, 25*su, "I have recently figured out that my website could look a lot more professional if i use html instead of js canvas, in english this just means that i don't like how pixelated everything is, and so i'm fixing it. This is going to take me a while as my previous ui system had 2000 lines of code, and i'll need to rewrite all of it for the new strat, and i'll also need to adapt all my recent js games into the new ui system because it would make them keep up to date with any bugfixes i make. Here, you can see my progress so far. https://basic2.silverspace.online - i can't be bothered making it a actual link sry lol", {wrap: 500*su})
    // ui.rect(515*su, 250*su, 10*su, 500*su, [255, 0, 0, 1])
    // ui.rect(input.mouse.x, input.mouse.y, 50*su, 50*su, [255, 255, 255, 1])

    input.updateInput(true)
}

input.checkInputs = (event) => {
    input.cistart()

    textBox.checkFocus(event)

    input.ciend()
}

input.scroll = (x, y) => {
   
}

setInterval(() => {
    console.log(fps)
    fps2 = fps
    fps = 0
}, 1000)

requestAnimationFrame(update)