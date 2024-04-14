class UI {
    canvas = null
    font = "sans-serif"
    fontLoaded = true
    autoOutline = 4.5
    relative = true
    doScroll = true
    textShadow = {top: 0, bottom: 0, left: 0, right: 0, multiply: 0.5}
    targetSize = {x: 1500, y: 1000}
    spacingMul = 1
    time = 0
    fontSizeMul = 1
    images = {}
    scale = 0.5
    setFont(font, fontPath="", fontSizeMul=1) {
        this.fontLoaded = false
        this.font = font
        if (font == "font") {
            let font2 = new FontFace("font", "url("+fontPath+")")
            font2.load().then(function(loadedFont) {
                ui.fontLoaded = true
                document.fonts.add(loadedFont)
            })
            let style = document.createElement("style")
            style.textContent = `
                @font-face {
                    font-family: "font";
                    src: url("${fontPath}");
                }
            `
            document.head.appendChild(style)
        } else {
            this.fontLoaded = true
        }
        this.fontSizeMul = fontSizeMul
    }
    setC(canvas) {
        ctx.restore()
        this.canvas = canvas
        if (this.canvas) {
            ctx.beginPath()
            ctx.rect(this.canvas.x-this.canvas.width/2, this.canvas.y-this.canvas.height/2, this.canvas.width, this.canvas.height)
            ctx.closePath()
            ctx.save()
            ctx.clip()
        }
    }
    resizeCanvas() {
        // window.canvas.style.left = -window.innerWidth*(1-this.scale)+"px"
        // window.canvas.style.top = -window.innerHeight*(1-this.scale)+"px"
        window.canvas.width = window.innerWidth/this.scale
        window.canvas.height = window.innerHeight/this.scale
        window.canvas.style.transform = `scale(${this.scale}, ${this.scale})`
        window.canvas.style.transformOrigin = "top left"
        // window.canvas.style.transform = `translate(-${1/this.scale * 100}%, -${1/this.scale * 100}%)`
        document.body.style.cursor = ""
        document.body.style.zoom = "100%"
        window.scrollTo(0, 0)
        if (window.delta) this.time += window.delta
    }
    getSu() {
        let w = window.canvas.width
    	let h = window.canvas.height
    
    	let aspect = w / this.targetSize.x
    
    	window.su = aspect
    	if (su > h / this.targetSize.y) {
    		su = h / this.targetSize.y
    	}
        return su
    }
    newImg(src) {
        let img = new Image()
        img.src = src
        return img
    }
    getImg(src) {
        if (src in this.images) {
            return this.images[src]
        } else {
            let img = new Image()
            img.src = src
            this.images[src] = img
            return this.images[src]
        }
    }
    rect(x, y, width, height, colour=[0, 0, 0, 1], outlineSize=0, outlineColour=[0, 0, 0, 1]) {
        if (this.relative && this.canvas) {
            x += this.canvas.x-this.canvas.width/2
            y += this.canvas.y-this.canvas.height/2
        }
        if (this.doScroll && this.canvas) {
            x += this.canvas.off.x
            y += this.canvas.off.y
        }
        ctx.fillStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        if (outlineSize > 0) {
            ctx.lineWidth = outlineSize
            ctx.strokeStyle = `rgba(${outlineColour[0]},${outlineColour[1]},${outlineColour[2]},${outlineColour[3]})`
            ctx.strokeRect(x - width/2, y - height/2, width, height)
        }
        ctx.fillRect(x - width/2, y - height/2, width, height)
    }
    text(x, y, size, text, options={}) {
        if (!this.fontLoaded) { return {lines: 0, width: 0} }
        if (!text) return {lines: 0, width: 0}
        size *= this.fontSizeMul
        text = text.toString()

        var {align="left", colour=[255, 255, 255, 1], outlineColour=[0, 0, 0, 1], outlineSize="auto", wrap=-1} = options

        if (this.relative && this.canvas) {
            x += this.canvas.x-this.canvas.width/2
            y += this.canvas.y-this.canvas.height/2
        }
        if (this.doScroll && this.canvas) {
            x += this.canvas.off.x
            y += this.canvas.off.y
        }
        
        ctx.fillStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        ctx.font = `${size}px ${this.font}`
        ctx.lineJoin = "round"
        ctx.textAlign = align
        ctx.textBaseline = "middle"
        ctx.strokeStyle = `rgba(${outlineColour[0]},${outlineColour[1]},${outlineColour[2]},${outlineColour[3]})`
        if (outlineSize == "auto") {
            outlineSize = size/this.autoOutline
        }
        ctx.lineWidth = outlineSize

        let dirs = ["top", "bottom", "left", "right"]
        let simple = wrap == -1 && !text.includes("\n")
        let amt = 0
        let lw = ctx.measureText(text).width
        if (!simple) simple = lw < wrap && !text.includes("\n")
        if (simple) {
            ctx.strokeStyle = `rgba(${outlineColour[0]},${outlineColour[1]},${outlineColour[2]},${outlineColour[3]})` 
            ctx.strokeText(text, x, y)
            
            ctx.fillStyle = `rgba(${colour[0]*this.textShadow.multiply},${colour[1]*this.textShadow.multiply},${colour[2]*this.textShadow.multiply},${colour[3]*this.textShadow.multiply})`
            ctx.strokeStyle = `rgba(${outlineColour[0]*this.textShadow.multiply},${outlineColour[1]*this.textShadow.multiply},${outlineColour[2]*this.textShadow.multiply},${outlineColour[3]*this.textShadow.multiply})`         
            for (let dir of dirs) {
                if (this.textShadow[dir] != 0) {
                    amt = this.textShadow[dir]
                    if (amt == "auto") {
                        amt = Math.round(outlineSize/3)
                    }
                    if (dir == "left") {
                        ctx.strokeText(text, x - amt, y)
                        ctx.fillText(text, x - amt, y)
                    } else if (dir == "right") {
                        ctx.strokeText(text, x + amt, y)
                        ctx.fillText(text, x + amt, y)
                    } else if (dir == "top") {
                        ctx.strokeText(text, x, y - amt)
                        ctx.fillText(text, x, y - amt)
                    } else if (dir == "bottom") {
                        ctx.strokeText(text, x, y + amt)
                        ctx.fillText(text, x, y + amt)
                    }
                }
            }
            
            ctx.fillStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
            ctx.fillText(text, x, y)
            return {lines: 1, width: lw}
        }

        let words = text.split(" ")
        let lines = []
        let line = ""
        let newLine = false
        for (let word of words) {
            newLine = word.includes("\n")
            word = word.replace("\n", "")
            if ((ctx.measureText(line + word + " ").width < wrap || wrap == -1) && !newLine) {
                line += word + " "
            } else {
                if (line[line.length-1] == " ") {
                    line = line.substring(0, line.length-1)
                }
                
                // console.log(line.replace(" ", "/"))
                lines.push(line)
                line = word + " "
            }
        }
        if (line[line.length-1] == " ") {
            line = line.substring(0, line.length-1)
        }
        lines.push(line)

        let maxWidth = 0
        for (let i = 0; i < lines.length; i++) {
            let w = ctx.measureText(lines[i]).width
            while (w > wrap && wrap != -1) {
                lines[i] = lines[i].slice(0, -1)
                w = ctx.measureText(lines[i]).width
            }
            if (w > maxWidth) {
                maxWidth = w
            }
        }
        for (let i in lines) {
            let fixed = lines[i]

            ctx.strokeStyle = `rgba(${outlineColour[0]},${outlineColour[1]},${outlineColour[2]},${outlineColour[3]})` 
            ctx.strokeText(fixed, x, y + i*size*this.spacingMul)
            
            ctx.fillStyle = `rgba(${colour[0]*this.textShadow.multiply},${colour[1]*this.textShadow.multiply},${colour[2]*this.textShadow.multiply},${colour[3]*this.textShadow.multiply})`
            ctx.strokeStyle = `rgba(${outlineColour[0]*this.textShadow.multiply},${outlineColour[1]*this.textShadow.multiply},${outlineColour[2]*this.textShadow.multiply},${outlineColour[3]*this.textShadow.multiply})`         
            for (let dir of dirs) {
                if (this.textShadow[dir] != 0) {
                    amt = this.textShadow[dir]
                    if (amt == "auto") {
                        amt = Math.round(outlineSize/3)
                    }
                    if (dir == "left") {
                        ctx.strokeText(fixed, x - amt, y + i*size*this.spacingMul)
                        ctx.fillText(fixed, x - amt, y + i*size*this.spacingMul)
                    } else if (dir == "right") {
                        ctx.strokeText(fixed, x + amt, y + i*size*this.spacingMul)
                        ctx.fillText(fixed, x + amt, y + i*size*this.spacingMul)
                    } else if (dir == "top") {
                        ctx.strokeText(fixed, x, y - amt + i*size*this.spacingMul)
                        ctx.fillText(fixed, x, y - amt + i*size*this.spacingMul)
                    } else if (dir == "bottom") {
                        ctx.strokeText(fixed, x, y + amt + i*size*this.spacingMul)
                        ctx.fillText(fixed, x, y + amt + i*size*this.spacingMul)
                    }
                }
            }
            
            ctx.fillStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
            ctx.fillText(fixed, x, y + i*size*this.spacingMul)
        }
        return {lines: lines.length, width: maxWidth}
    }
    circle(x, y, radius, colour=[0, 0, 0, 1], options={}) {
        var {outlineColour=[0, 0, 0, 0], outlineSize=0, clockwise=true, sangle=0, eangle=Math.PI*2} = options
        if (this.relative && this.canvas) {
            x += this.canvas.x-this.canvas.width/2
            y += this.canvas.y-this.canvas.height/2
        }
        if (this.doScroll && this.canvas) {
            x += this.canvas.off.x
            y += this.canvas.off.y
        }
        ctx.beginPath()
        ctx.arc(x, y, radius, sangle, eangle, !clockwise)
        ctx.closePath()
        ctx.fillStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        if (outlineSize > 0) {
            ctx.strokeStyle = `rgba(${outlineColour[0]},${outlineColour[1]},${outlineColour[2]},${outlineColour[3]})`
            ctx.lineWidth = outlineSize
            ctx.stroke()
        }
        ctx.fill()
    }
    line(x1, y1, x2, y2, size, colour) {
        if (this.relative && this.canvas) {
            x1 += this.canvas.x-this.canvas.width/2
            y1 += this.canvas.y-this.canvas.height/2
            x2 += this.canvas.x-this.canvas.width/2
            y2 += this.canvas.y-this.canvas.height/2
        }
        if (this.doScroll && this.canvas) {
            x1 += this.canvas.off.x
            y1 += this.canvas.off.y
            x2 += this.canvas.off.x
            y2 += this.canvas.off.y
        }
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        ctx.lineWidth = size
        ctx.stroke()
    }
    path(poses, size, colour) {
        let sx = poses[0][0]
        let sy = poses[0][1]
        if (this.relative && this.canvas) {
            sx += this.canvas.x-this.canvas.width/2
            sy += this.canvas.y-this.canvas.height/2
        }
        if (this.doScroll && this.canvas) {
            sx += this.canvas.off.x
            sy += this.canvas.off.y
        }
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        for (let i = 1; i < poses.length; i++) {
            let x = poses[i][0]
            let y = poses[i][1]
            if (this.relative && this.canvas) {
                x += this.canvas.x-this.canvas.width/2
                y += this.canvas.y-this.canvas.height/2
            }
            if (this.doScroll && this.canvas) {
                x += this.canvas.off.x
                y += this.canvas.off.y
            }
            ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${colour[0]},${colour[1]},${colour[2]},${colour[3]})`
        ctx.lineWidth = size
        ctx.stroke()
    }
    measureText(size, text, options={}) {
        if (!this.fontLoaded) { return {lines: 0, width: 0} }
        size *= this.fontSizeMul

        var {outlineSize="auto", wrap=-1} = options

        ctx.font = `${size}px ${this.font}`
        ctx.lineJoin = "round"
        ctx.textBaseline = "middle"
        if (outlineSize == "auto") {
            outlineSize = size/this.autoOutline
        }
        ctx.lineWidth = outlineSize
        let words = text.split(" ")
        let lines = []
        let line = ""
        for (let word of words) {
            let newLine = word.includes("\n")
            word = word.replace("\n", "")
            if ((ctx.measureText(line + word + " ").width < wrap || wrap == -1) && !newLine) {
                line += word + " "
            } else {
                if (line[line.length-1] == " ") {
                    line = line.substring(0, line.length-1)
                }
                lines.push(line)
                line = word + " "
            }
        }
        if (line[line.length-1] == " ") {
            line = line.substring(0, line.length-1)
        }
        lines.push(line)

        for (let i = 0; i < lines.length; i++) {
            while (ctx.measureText(lines[i]).width > wrap && wrap != -1) {
                lines[i] = lines[i].slice(0, -1)
            }
        }
        let maxWidth = 0
        let dirs = ["top", "bottom", "left", "right"]
        let i2 = 0
        let links2 = []
        for (let i in lines) {
            let fixed = lines[i]

            let width = ctx.measureText(fixed).width
            if (width > maxWidth) {
                maxWidth = width
            }
        }
        return {lines: lines.length, width: maxWidth}
    }
    img(x, y, width, height, img, clip="none", roundV=true) {
        if (!img) return
        if (this.relative && this.canvas) {
            x += this.canvas.x-this.canvas.width/2
            y += this.canvas.y-this.canvas.height/2
        }
        if (this.doScroll && this.canvas) {
            x += this.canvas.off.x
            y += this.canvas.off.y
        }
        if (clip == "none") {
            clip = {use: false}
        } else {
            clip = {use: true, x: clip[0], y: clip[1], width: clip[2], height: clip[3]}
        }
        if (roundV) {
            x = Math.round(x)
            y = Math.round(y)
            width = Math.round(width/2)*2
            height = Math.round(height/2)*2
        }
        ctx.imageSmoothingEnabled = false
        if (clip.use) {
            ctx.drawImage(img, clip.x, clip.y, clip.width, clip.height, x-width/2, y-height/2, width, height)
        } else {
            ctx.drawImage(img, x-width/2, y-height/2, width, height)
        }
    }
    shadeImg(img, effect = (r, g, b, a) => {}) {
        let canvas2 = document.createElement("canvas")
        canvas2.width = img.width
        canvas2.height = img.height
        let ctx2 = canvas2.getContext("2d")
        ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height)
        var imgData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
        var dataA = imgData.data
        for (let i = 0; i < dataA.length; i += 4) {
            let n = effect(dataA[i], dataA[i+1], dataA[i+2], dataA[i+3])
            dataA[i] = n[0]
            dataA[i+1] = n[1]
            dataA[i+2] = n[2]
            dataA[i+3] = n[3]
        }
        ctx2.putImageData(imgData, 0, 0)
        let img2 = new Image()
        img2.src = canvas2.toDataURL()
        return img2
    }
    link(x, y, size, text, options={}) {
        if (!this.fontLoaded) { return {lines: 0, width: 0} }

        var {align="left", colour=[0, 200, 255, 1], outlineColour=[0, 0, 0, 1], outlineSize="auto"} = options

        let width = ui.text(x, y, size, text, {colour: colour, align: align}).width
        ui.rect(x + width/2, y + size/2, width, size/7, [0, 200, 255, 1])
        ui.text(x, y, size, text, {colour: colour, align: align}).width

        if (this.relative && this.canvas) {
            x += this.canvas.x-this.canvas.width/2
            y += this.canvas.y-this.canvas.height/2
        }
        if (this.doScroll && this.canvas) {
            x += this.canvas.off.x
            y += this.canvas.off.y
        }

        let x2 = 0
        if (align == "left") {
            x2 = x + width/2
        }
        if (align == "right") {
            x2 = x - width/2
        }
        if (align == "center") {
            x2 = x + width/2
        }
        
        return [x2, y, width, size]
    }
    hovered(x, y, width, height, relative=false, doScroll=false) {
        if (relative && this.canvas) {
            x += this.canvas.x-this.canvas.width/2
            y += this.canvas.y-this.canvas.height/2
        }
        if (doScroll && this.canvas) {
            x += this.canvas.off.x
            y += this.canvas.off.y
        }
        return (
            input.mouse.x > x-width/2 && input.mouse.x < x+width/2 &&
            input.mouse.y > y-height/2 && input.mouse.y < y+height/2
        )
    }
    get Object2D() {
        return class {
            x
            y
            width
            height
            constructor(x=0, y=0, width=0, height=0) {
                this.x = x
                this.y = y
                this.width = width
                this.height = height
            }
            set(x, y, width, height) {
                this.x = x
                this.y = y
                this.width = width
                this.height = height
            }
            collidingRect(rect) {
                return (
                    this.x+this.width/2 > rect.x-rect.width/2 &&
                    this.x-this.width/2 < rect.x+rect.width/2 &&
                    this.y+this.height/2 > rect.y-rect.height/2 &&
                    this.y-this.height/2 < rect.y+rect.height/2
                )
            }
            hasPoint(x, y) {
                return (
                    x > this.x-this.width/2 && x < this.x+this.width/2 &&
                    y > this.y-this.height/2 && y < this.y+this.height/2
                )
            }
        }
    }

    get TextBox() {
        return class extends ui.Object2D {
            text = ""
            placeholder = ""
            textO
            focused = false
            indicator
            time = 0
            lastText = ""
            mulX = 1
            mulY = 1
            focusTime = 0
            canvas
            outlineSize = 10
            outlineColour = [0, 0, 0, 1]
            colour = [0, 0, 0, 1]
            hide = false
            flash = 0
            maxCopies = 100
            flashA = 0
            focusA = 0
            copies = []
            lastText = null
            sp = 0
            twi = 0
            off = 0
            rx = 0
            ry = 0
            constructor(placeholder="", colour=[127, 127, 127, 1]) {
                super()
                this.placeholder = placeholder
                this.colour = colour
            }
            checkFocus(event) {
                if (this.hovered() && input.mouse.lclick) {
                    input.focused = this
                    this.focused = true
                    input.getInput.focus()
                    event.preventDefault()
                    this.time = 0
                    input.getInput.value = this.text
                }
            }
            hovered() {
                if (this.canvas) {
                    return this.hasPoint(input.mouse.x-this.canvas.x+this.canvas.width/2-this.canvas.off.x, input.mouse.y-this.canvas.y+this.canvas.height/2-this.canvas.off.y) && this.canvas.hovered()
                } else {
                    return this.hasPoint(input.mouse.x, input.mouse.y)
                }
            }
            hover() {
                if (this.hovered()) {
                    document.body.style.cursor = "text"
                    this.mulX = utils.lerp(this.mulX, 0.995, delta*15)
                    this.mulY = utils.lerp(this.mulY, 0.95, delta*15)
                } else {
                    this.mulX = utils.lerp(this.mulX, 1, delta*15)
                    this.mulY = utils.lerp(this.mulY, 1, delta*15)
                }

                if (this.sp < 0) {
                    this.sp = 0
                }

                if (this.sp > this.text.length) {
					this.sp = this.text.length
				}

                if (this.lastText != this.text) {
                    this.addCopy()
                    this.lastText = this.text
                }

                if (this.focused && input.mouse.lclick) {
                    let x = input.mouse.x - this.x + this.width/2 + this.off
                    let stext = ""
                    let i = 0
                    this.sp = 0
                    for (let letter of this.text) {
                        stext += letter
                        if (x > ui.measureText(this.height*0.75, stext).width) {
                            this.sp = i+1
                        }
                        i++
                    }
                }

                this.flash -= delta
                if (this.flash > 0) {
                    this.flashA = utils.lerp(this.flashA, 0.8, delta*20)
                } else {
                    this.flashA = utils.lerp(this.flashA, 0, delta*20)
                }

                if (this.focused) {
                    this.focusA = utils.lerp(this.focusA, 1, delta*10)
                } else {
                    this.focusA = utils.lerp(this.focusA, 0, delta*10)
                }
                if (this.focusA < 0.01) {
                    this.focusA = 0
                }
            }
            addCopy() {
                this.time = 0
                this.copies.push([this.text, this.sp])
                if (this.copies.length > this.maxCopies) {
                    this.copies.splice(0, 1)
                }
            }
            revert() {
                if (this.copies.length > 1) {
                    this.text = this.copies[this.copies.length-2][0]
                    this.sp = this.copies[this.copies.length-2][1]
                    this.copies.splice(this.copies.length-1, 1)
                    this.lastText = this.text
                    this.time = 0
                } else if (this.copies.length > 0) {
                    this.text = this.copies[0][0]
                    this.sp = this.copies[0][1]
                    this.lastText = this.text
                    this.time = 0
                }
            }
            draw(ignore=false) {
                if (!ignore) {
                    this.rx = this.x
                    this.ry = this.y
                    if (ui.relative && ui.canvas) {
                        this.rx += ui.canvas.x-ui.canvas.width/2
                        this.ry += ui.canvas.y-ui.canvas.height/2
                    }
                    if (ui.doScroll && ui.canvas) {
                        this.rx += ui.canvas.off.x
                        this.ry += ui.canvas.off.y
                    }
                }
                if (input.focusedL == this && input.mobile && !ignore) return

                if (input.focusedL == this && input.mobile) ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, this.focusA/4])

                let lx = this.x
                let ly = this.y

                if (input.mobile && input.focusedL == this) {
                    this.x = this.rx + (canvas.width/2 - this.rx) * this.focusA
                    this.y = this.ry + (this.height/2+25*su - this.ry) * this.focusA
                }

                ctx.save()

                ctx.beginPath()
                let x = this.x
                let y = this.y
                if (ui.relative && ui.canvas) {
                    x += ui.canvas.x-ui.canvas.width/2
                    y += ui.canvas.y-ui.canvas.height/2
                }
                if (ui.doScroll && ui.canvas) {
                    x += ui.canvas.off.x
                    y += ui.canvas.off.y
                }
                let w = this.width * this.mulX + this.outlineSize/2
                let h = this.height * this.mulY + this.outlineSize/2
                ctx.rect(x - w/2, y - h/2, w, h)
                ctx.clip()

                ui.rect(this.x, this.y, this.width * this.mulX, this.height * this.mulY, this.colour)

                let off = this.off
                // let off = this.twi - this.width + this.outlineSize*1.5*2
                // if (off < 0) off = 0
                // this.off = off

                if (!this.focused) {
                    this.sp = this.text.length
                }

                if (this.text.length < 1) {
                    ui.text(this.x - this.width/2 + this.height * 0.75 * 0.25 - off, this.y, this.height*0.75, this.placeholder, {colour: [100, 100, 100, 1]}).width
                    this.twi = utils.lerp(this.twi, 0, delta*20)
                } else {
                    let text2 = this.text
                    if (this.hide) {
                        text2 = ""
                        for (let i = 0; i < this.text.length; i++) {
                            text2 += "*"
                        }
                    }
                    ui.text(this.x - this.width/2 + this.height * 0.75 * 0.25 - off, this.y, this.height*0.75, text2)
                    this.twi = utils.lerp(this.twi, ui.measureText(this.height*0.75, text2.substring(0, this.sp)).width, delta*20)
                }

                this.time += delta
                if (this.time > 1) {
                    this.time = 0
                }
                if (this.focused && this.time < 0.5) {
                    ui.rect(this.x - this.width/2 + this.height * 0.75 * 0.25 + this.twi - off, this.y, this.height*0.75/7, this.height*0.75, [225, 225, 225, 1])
                }
                if (this.lastText != this.text) {
                    this.time = 0
                }
                this.lastText = this.text

                let s = this.height/7 * 2
                
                if (this.focused) {
                    this.focusTime += delta
                    if (this.focusTime > 1/10) {
                        this.focusTime = 1/10
                    }
                } else {
                    this.focusTime -= delta
                    if (this.focusTime < 0) {
                        this.focusTime = 0
                    }
                }
                
                let max = this.twi - this.width + this.height*0.75 * 0.75
                if (max - this.off > 0) {
                    this.off = utils.lerp(this.off, max, delta*10)
                }
                let min = this.twi - this.height*0.75 * 0.75
                if (min - this.off < 0) {
                    this.off = utils.lerp(this.off, min, delta*10)
                }
                if (this.off < 0) {
                    this.off = 0
                }

                ui.rect(this.x, this.y, this.width * this.mulX, this.height * this.mulY, [0, 0, 0, 0], this.outlineSize/2, this.outlineColour)

                ui.rect(this.x, this.y, this.width * this.mulX, this.height * this.mulY, [255, 255, 255, this.flashA])
                
                ctx.restore()

                ui.rect(this.x, this.y, this.width + s, this.height + s, [0, 0, 0, 0], this.outlineSize/4, [0, 0, 255, this.focusTime*10])

                this.x = lx
                this.y = ly
            }
        }
    }
    get Button() {
        return class extends ui.Object2D {
            type = ""
            bg
            text = ""
            textO
            textSize = 0
            bgColour = [0, 0, 0, 1]
            bgAlpha = 1
            visHeight = 0
            visWidth = 0
            mulVel = 0
            mul = 1
            hoverMul = 0.9
            clickMul = 0.7
            img
            scaleText = false
            clip
            canvas
            textOff = 0
            clicked = 0
            colour = [255, 255, 255, 1]
            constructor(type, text="") {
                super()
                this.text = text
                this.type = type
            }
            hovered() {
                if (this.canvas) {
                    return this.hasPoint(input.mouse.x-this.canvas.x+this.canvas.width/2-this.canvas.off.x, input.mouse.y-this.canvas.y+this.canvas.height/2-this.canvas.off.y) && this.canvas.hovered()
                } else {
                    return this.hasPoint(input.mouse.x, input.mouse.y)
                }
            }
            click() {
                this.clicked = 0.1
                this.visWidth = this.width*this.hoverMul*this.mul
                this.visHeight = this.height*this.hoverMul*this.mul
            }
            basic() {
                this.clicked -= delta
                if (this.clicked > 0) {
                    this.visWidth = utils.lerp(this.visWidth, this.width*this.clickMul*this.mul, delta*15)
                    this.visHeight = utils.lerp(this.visHeight, this.height*this.clickMul*this.mul, delta*15)
                    document.body.style.cursor = "pointer"
                } else if (this.hovered()) {
                    this.visWidth = utils.lerp(this.visWidth, this.width*this.hoverMul*this.mul, delta*15)
                    this.visHeight = utils.lerp(this.visHeight, this.height*this.hoverMul*this.mul, delta*15)
                    document.body.style.cursor = "pointer"
                } else {
                    this.visWidth = utils.lerp(this.visWidth, this.width*this.mul, delta*15)
                    this.visHeight = utils.lerp(this.visHeight, this.height*this.mul, delta*15)
                }
            }
            draw() {
                let last = ctx.globalAlpha
                ctx.globalAlpha *= this.bgAlpha
                if (this.type == "rect") {
                    ui.rect(this.x, this.y, this.visWidth, this.visHeight, this.bgColour)
                } else if (this.type == "img") {
                    ui.img(this.x, this.y, this.visWidth, this.visHeight, this.img, this.clip)
                }
                ctx.globalAlpha = last
                if (this.scaleText) {
                    ui.text(this.x + this.textOff, this.y, this.textSize * ((this.visWidth/this.width + this.visHeight/this.height) / 2), this.text, {align: "center", colour: this.colour})
                } else {
                    ui.text(this.x + this.textOff, this.y, this.textSize, this.text, {align: "center", colour: this.colour})
                }
            }
        }
    }
    get ScrollBar() {
        return class extends ui.Object2D {
            value = 50
            minValue = 0
            maxValue = 100
            handleImg
            handleClip = "none"
            handleWidth = 0
            handleHeight = 0
            bound = 3*4
            gOff = {x: 0, y: 0}
            img
            clip = "none"
            constructor(img, handleImg, clip="none", handleClip="none") {
                super()
                this.handleImg = handleImg
                this.handleClip = handleClip
                this.img = img
                this.clip = clip
            }
            set2(width, height, bound) {
                this.handleWidth = width
                this.handleHeight = height
                this.bound = bound
            }
            hovered() {
                return this.hasPoint(input.mouse.x-this.gOff.x, input.mouse.y-this.gOff.y)
            }
            convert(x) {
                return (x-this.x + this.width/2 - this.bound) / (this.width-this.bound*2) * (this.maxValue - this.minValue) + this.minValue
            }
            capValue() {
                if (this.value < this.minValue) {
                    this.value = this.minValue
                }
                if (this.value > this.maxValue) {
                    this.value = this.maxValue
                }
            }
            draw() {
                ui.img(this.x, this.y, this.width, this.height, this.img, this.clip)
                ui.img(this.x-this.width/2+this.bound + (this.width-this.bound*2) * ((this.value-this.minValue)/(this.maxValue-this.minValue)), this.y, this.handleWidth, this.handleHeight, this.handleImg, this.handleClip)
            }
        }
    }
    get Dropdown() {
        return class extends ui.Object2D {
            items = []
            bgColour = [127, 127, 127, 1]
            outlineColour = [0, 0, 0, 1]
            outlineSize = 0
            textSize = 0
            drop = 0
            open = false
            default = 0
            selected = 0
            colours = []
            selectedt = ""
            angle = Math.PI
            constructor(items, def=0) {
                super()
                this.default = def
                this.selected = def
                this.items = items
                this.selectedt = this.items[this.selected]
            }
            hovered() {
                if (!this.open) {
                    return ui.hovered(this.x, this.y, this.width, this.height)
                } else {
                    return ui.hovered(this.x, this.y + this.items.length*this.height/2, this.width, this.height+this.items.length*this.height)
                }
            }
            changed(value) {

            }
            hoveredBase() {
                return ui.hovered(this.x, this.y, this.width, this.height)
            }
            basic() {
                if (input.mouse.lclick && this.hoveredBase()) {
                    this.open = !this.open
                }
                if (input.mouse.lclick && this.open && !this.hovered()) {
                    this.open = false
                }
                if (this.open) {
                    this.drop = utils.lerp(this.drop, 1, delta*15)
                    this.angle = utils.lerp(this.angle, Math.PI+Math.PI/2, delta*15)
                } else {
                    this.drop = utils.lerp(this.drop, 0, delta*15)
                    this.angle = utils.lerp(this.angle, Math.PI, delta*15)
                }
                for (let i = 0; i < this.items.length; i++) {
                    let i2 = (this.items.length-1-i)
                    let y = (i2+1) * this.height * this.drop
                    if (input.mouse.lclick && this.drop > 0.99 && ui.hovered(this.x, this.y + y, this.width, this.height)) {
                        let newv = this.selected != i2
                        this.selected = i2
                        this.selectedt = this.items[this.selected]
                        if (newv) this.changed(this.items[i2])
                    }
                }
            }
            set2(textSize, outlineSize) {
                this.textSize = textSize
                this.outlineSize = outlineSize
            }
            draw() {
                let lighter = [this.bgColour[0]*1.15, this.bgColour[1]*1.15, this.bgColour[2]*1.15, this.bgColour[3]]
                let darker = [this.bgColour[0]/1.25, this.bgColour[1]/1.25, this.bgColour[2]/1.25, this.bgColour[3]]
                let mid = [this.bgColour[0]/1.1, this.bgColour[1]/1.1, this.bgColour[2]/1.1, this.bgColour[3]]

                while (this.colours.length < this.items.length) {
                    this.colours.push([...this.bgColour])
                }
                while (this.colours.length > this.items.length) {
                    this.colours.splice(this.colours.length-1)
                }

                let ti = this.items.length-1
                for (let i = 0; i < this.items.length; i++) {
                    let i2 = (this.items.length-1-i)
                    let y = (i2+1) * this.height * this.drop
                    if (i2 == this.selected) {
                        if (ui.hovered(this.x, this.y + y, this.width, this.height)) {
                            this.colours[i2][0] = utils.lerp(this.colours[i2][0], mid[0], delta*15)
                            this.colours[i2][1] = utils.lerp(this.colours[i2][1], mid[1], delta*15)
                            this.colours[i2][2] = utils.lerp(this.colours[i2][2], mid[2], delta*15)
                        } else {
                            this.colours[i2][0] = utils.lerp(this.colours[i2][0], darker[0], delta*15)
                            this.colours[i2][1] = utils.lerp(this.colours[i2][1], darker[1], delta*15)
                            this.colours[i2][2] = utils.lerp(this.colours[i2][2], darker[2], delta*15)
                        }
                    } else if (ui.hovered(this.x, this.y + y, this.width, this.height)) {
                        this.colours[i2][0] = utils.lerp(this.colours[i2][0], lighter[0], delta*15)
                        this.colours[i2][1] = utils.lerp(this.colours[i2][1], lighter[1], delta*15)
                        this.colours[i2][2] = utils.lerp(this.colours[i2][2], lighter[2], delta*15)
                    } else {
                        this.colours[i2][0] = utils.lerp(this.colours[i2][0], this.bgColour[0], delta*15)
                        this.colours[i2][1] = utils.lerp(this.colours[i2][1], this.bgColour[1], delta*15)
                        this.colours[i2][2] = utils.lerp(this.colours[i2][2], this.bgColour[2], delta*15)
                    }
                    ui.rect(this.x, this.y + y, this.width, this.height, this.colours[i2])
                    ui.text(this.x - this.width/2 + this.outlineSize*2, this.y + y, this.textSize, this.items[ti])
                    ui.line(this.x-this.width/2, this.y + y + this.height/2, this.x+this.width/2, this.y + y + this.height/2, this.outlineSize, darker)
                    ti--
                }

                ui.rect(this.x, this.y, this.width, this.height, lighter)
                ui.text(this.x - this.width/2 + this.outlineSize*2, this.y, this.textSize, this.items[this.selected])

                let mx = this.x + this.width/2 - this.height/2
                let my = this.y
                let s = this.height/4
                let v1 = {x: -s, y: -s/2}
                let v2 = {x: 0, y: s/2}
                let v3 = {x: s, y: -s/2}
                ui.path([[mx + utils.rotv2(v1, this.angle).x, my + utils.rotv2(v1, this.angle).y], [mx + utils.rotv2(v2, this.angle).x, my + utils.rotv2(v2, this.angle).y], [mx + utils.rotv2(v3, this.angle).x, my + utils.rotv2(v3, this.angle).y]], this.outlineSize, this.outlineColour)

                ui.line(this.x-this.width/2, this.y + this.height/2, this.x+this.width/2, this.y + this.height/2, this.outlineSize, darker)

                ui.line(this.x-this.width/2-this.outlineSize/2, this.y-this.height/2, this.x+this.width/2+this.outlineSize/2, this.y-this.height/2, this.outlineSize, this.outlineColour)
                ui.line(this.x-this.width/2, this.y-this.height/2, this.x-this.width/2, this.y+this.height/2 + this.drop*this.items.length*this.height, this.outlineSize, this.outlineColour)
                ui.line(this.x+this.width/2, this.y-this.height/2, this.x+this.width/2, this.y+this.height/2 + this.drop*this.items.length*this.height, this.outlineSize, this.outlineColour)
                ui.line(this.x-this.width/2-this.outlineSize/2, this.y+this.height/2 + this.drop*this.items.length*this.height, this.x+this.width/2 + this.outlineSize/2, this.y+this.height/2 + this.drop*this.items.length*this.height, this.outlineSize, this.outlineColour)
            }
        }
    }
    get SideButton() {
        return class extends ui.Button {
            offX = 0
            offXT = 0
            offV = 0
            invert = false
            customHover = -1
            constructor(text) {
                super("rect", text)
            }
            click() {
                this.offX = this.offXT
                this.offV = this.customHover != -1 ? -this.customHover*10*delta*120 : -this.width*0.01*delta*120
            } 
            basic() {
                if (this.offV >= 0) {
                    this.offX += (this.offXT - this.offX) * delta * 10
                }
        
                this.offX += this.offV
        
                if (this.offV < 0) {
                    this.offV += this.customHover != -1 ? this.customHover*10*delta : this.width*0.01*delta
                    // if (this.offX > this.offXT) {
                    //     this.offX = this.offXT
                    //     this.offV = 0
                    // }
                } else {
                    this.offV = 0
                }
                
                if (this.hovered()) {
                    document.body.style.cursor = "pointer"
                    this.offXT = this.customHover != -1 ? this.customHover : this.width*0.1
                } else if (this.offV >= 0) {
                    this.offXT = 0
                }
            }
            reset() {
                this.offX = 0
                this.offV = 0
                this.offXT = 0
            }
            draw() {
                let a = 1 - Math.abs(this.offX - this.width*0.1) / (this.width*0.2)
        
                let oldAlpha = ctx.globalAlpha
                if (this.offV < 0) {
                    ctx.globalAlpha *= a > 0 ? a : 0
                }
                
                let align = "left"
                if (this.invert) {
                    this.offX *= -1
                    align = "right"
                }
                
                let x = 0
                let width = 0
                if (this.invert) {
                    x = this.x+this.height/2 + this.offX/2
                    width = this.width-this.height - this.offX
                } else {
                    x = this.x-this.height/2 + this.offX/2
                    width = this.width-this.height + this.offX
                    
                }

                ui.rect(x, this.y, width, this.height, this.bgColour)
                if (this.invert) {
                    x = this.x + this.width/2 - this.textSize/2 + this.offX
                } else {
                    x = this.x - this.width/2 + this.textSize/2 + this.offX
                }

                ui.text(x, this.y, this.textSize, this.text, {align: align})
                
                ctx.fillStyle = `rgba(${this.bgColour[0]},${this.bgColour[1]},${this.bgColour[2]},${this.bgColour[3]})`
                ctx.beginPath()
                if (this.invert) {
                    ctx.moveTo(this.x-this.width/2+this.height+0.25 + this.offX, this.y-this.height/2)
                    ctx.lineTo(this.x-this.width/2 + this.offX, this.y-this.height/2)
                    ctx.lineTo(this.x-this.width/2+this.height+0.25 + this.offX, this.y+this.height/2)
                } else {
                    ctx.moveTo(this.x+this.width/2-this.height-0.25 + this.offX, this.y-this.height/2)
                    ctx.lineTo(this.x+this.width/2 + this.offX, this.y-this.height/2)
                    ctx.lineTo(this.x+this.width/2-this.height-0.25 + this.offX, this.y+this.height/2)
                }
                ctx.fill()
                
                ctx.globalAlpha = oldAlpha
        
                if (this.invert) {
                    this.offX *= -1
                }
            }
        }
    }
    get Canvas() {
        return class extends ui.Object2D {
            colour = [0, 0, 0, 1]
            bounds = {minX: 0, minY: 0, maxX: 0, maxY: 0}
            tVis = 0
            vis = 0
            stop = 0
            off = {x: 0, y: 0}
            loff = {x: 0, y: 0}
            constructor(colour=[0, 0, 0, 1]) {
                super()
                this.colour = colour
            }
            update() {
                if (this.off.x < this.bounds.minX) {
                    this.off.x = this.bounds.minX
                }
                if (this.off.x > this.bounds.maxX) {
                    this.off.x = this.bounds.maxX
                }
                if (this.off.y < this.bounds.minY) {
                    this.off.y = this.bounds.minY
                }
                if (this.off.y > this.bounds.maxY) {
                    this.off.y = this.bounds.maxY
                }
            }
            scroll(x, y) {
                this.off.x -= x
                this.off.y -= y
                this.update()
            }
            hovered() {
                return this.hasPoint(input.mouse.x, input.mouse.y)
            }
            draw() {
                ui.rect(this.x, this.y, this.width, this.height, this.colour)
            }
            off() {
                return {x: this.x-this.width/2+this.ctx.off.x, y: this.y-this.height/2+this.ctx.off.y}
            }
            drawScroll(off={x: 10, y: 10}, size=10, force=false) {
                let oldS = ui.doScroll
                ui.doScroll = false
                this.stop -= delta
                if (this.stop <= 0 || this.tVis-this.vis >= 0) {
                    this.vis = utils.lerp(this.vis, this.tVis, delta*10)
                }

                let scrollSize = 1
                if (Math.abs(this.bounds.maxY-this.bounds.minY)+this.height > this.height) {
                    scrollSize = this.height/(Math.abs(this.bounds.maxY-this.bounds.minY) + this.height)
                }

                scrollSize *= this.height-off.y*2

                this.tVis = 0
                if (this.hasPoint(input.mouse.x, input.mouse.y) && input.mouse.x-this.x > this.width/2-off.x*2-size && input.mouse.y-this.y+this.height/2 > off.y/2 && input.mouse.y-this.y+this.height/2 < this.height-off.y/2) {
                    this.tVis = 0.9
                    this.stop = 0.5
                    if (input.mouse.ldown && input.mouse.y-this.y+this.height/2-scrollSize/2 > off.y/2 && input.mouse.y-this.y+this.height/2 < this.height-off.y/2-scrollSize/2) {
                        this.off.y = (input.mouse.y-this.y+this.height/2-size - scrollSize/2) / (this.height-size*2-scrollSize) * this.bounds.minY
                    }
                }

                if (this.loff.y != this.off.y) {
                    this.tVis = 0.9
                    this.stop = 0.5
                }
                this.loff.y = this.off.y

                ui.rect(this.width-off.x-size/2, this.height/2, size, this.height-off.y*2, [150, 150, 150, this.vis])

                let x2 = this.width-off.x-size/2
                let y2 = Math.abs(this.off.y)/Math.abs(this.bounds.minY) * (this.height-off.y*2 - scrollSize) + off.y + scrollSize/2
                if (ui.relative && ui.canvas) {
                    x2 += ui.canvas.x-ui.canvas.width/2
                    y2 += ui.canvas.y-ui.canvas.height/2
                }
                ctx.beginPath()
                ctx.arc(x2, y2-scrollSize/2, size*0.75, 0, Math.PI, true)
                ctx.lineTo(x2-size*1.5/2, y2+scrollSize/2)
                ctx.arc(x2, y2+scrollSize/2, size*0.75, Math.PI, 0, true)
                ctx.lineTo(x2+size*1.5/2, y2-scrollSize/2)
                ctx.restore()
                ctx.fillStyle = `rgba(200, 200, 200, ${this.vis})`
                ctx.fill()
                // ui.circle(x2, , size*0.75, [200, 200, 20 0, this.vis])
                ui.doScroll = oldS
            }
            drawBorder(size, colour) {
                let oldS = ui.doScroll
                ui.doScroll = false
                ui.rect(this.width/2, this.height/2, this.width, this.height, [0, 0, 0, 0], size, colour)
                ui.doScroll = oldS
            }
        }
    }
}

var ui = new UI()
