
utils.setup()
utils.setStyles()

var delta = 0
var lastTime = 0
var su = 0

var dropdown = new ui.Dropdown(["Hello", "Hi", "123", "Cool"])

var test = new ui.SideButton("Testing")
test.bgColour = [0, 0, 0, 0.75]

var test2 = new ui.Button("rect", "Click Me!")


function update(timestamp) {
    requestAnimationFrame(update)
    
    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()

    dropdown.set(canvas.width/2, canvas.height/2, 800*su, 50*su)
    dropdown.set2(30*su, 5*su)

    dropdown.basic()

    dropdown.draw()

    test.set(canvas.width/2, canvas.height/2+200*su, 500*su, 50*su)
    test.textSize = 50*su

    test.basic()
    test.draw()

    test2.set(canvas.width/2, canvas.height/2-200*su, 75*su, 75*su)
    test2.textSize = 20*su
    test2.basic()
    test2.draw()

    if (test2.hovered() && input.mouse.lclick) {
        test2.click()
    }

    // ui.text(10*su, 35*su, 25*su, "I have recently figured out that my website could look a lot more professional if i use html instead of js canvas, in english this just means that i don't like how pixelated everything is, and so i'm fixing it. This is going to take me a while as my previous ui system had 2000 lines of code, and i'll need to rewrite all of it for the new strat, and i'll also need to adapt all my recent js games into the new ui system because it would make them keep up to date with any bugfixes i make. Here, you can see my progress so far. https://basic2.silverspace.online - i can't be bothered making it a actual link sry lol", {wrap: 500*su})
    // ui.rect(515*su, 250*su, 10*su, 500*su, [255, 0, 0, 1])
    // ui.rect(input.mouse.x, input.mouse.y, 50*su, 50*su, [255, 255, 255, 1])

    input.updateInput(true)
}

input.checkInputs = (event) => {
    input.cistart()


    input.ciend()
}

input.scroll = (x, y) => {
   
}

requestAnimationFrame(update)