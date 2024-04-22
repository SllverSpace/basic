class Input {
	mouse = {x: 0, y: 0, locked: false, has: false, ldown: false, rdown: false, lclick: false, rclick: false}
	keys = {}
	jKeys = {}
	keysRaw = {}
	jKeysRaw = {}
	touches = {}
	focused = null
	mobile = false
	getInput
	moved = 0
	downTime = 0
	startP
	copyFlash = 0
	copyFlashA = 0
	focusedL = null
	rathsA = 0
	constructor() {
		this.getInput = document.createElement("textarea")
		this.getInput.style.position = "absolute"
		this.getInput.style.left = "-1000px"
		this.getInput.style.top = "-1000px"
		document.body.appendChild(this.getInput)
		
		addEventListener("mousedown", (event) => {this.mouseDown(event)})
		addEventListener("mousemove", (event) => {this.mouseMove(event)})
		addEventListener("mouseup", (event) => {this.mouseUp(event)})
		addEventListener("touchstart", (event) => {this.touchStart(event)}, { passive: false })
		addEventListener("touchmove", (event) => {this.touchMove(event)})
		addEventListener("touchend", (event) => {this.touchEnd(event)})
		addEventListener("touchcancel", (event) => {this.touchCancel(event)})
		addEventListener("blur", (event) => {this.blur(event)})
		addEventListener("keydown", (event) => {this.keydown(event)})
		addEventListener("keyup", (event) => {this.keyup(event)})
		addEventListener("wheel", (event) => {this.wheel(event)})
		addEventListener("paste", (event) => {this.paste(event)})
		addEventListener("contextmenu", (event) => {this.contextmenu(event)})
	}
	setGlobals() {
		window.keys = this.keys
		window.jKeys = this.jKeys
		window.hkeys = this.hkeys
		window.keysRaw = this.keysRaw
		window.jKeysRaw = this.jKeysRaw
		window.mobile = this.mobile
		window.focused = this.focused
		window.mouse = this.mouse
		window.touches = this.touches
	}
	copyText(text) {
		navigator.clipboard.writeText(text)
	}
	paste(event) {
		event.preventDefault()
		navigator.clipboard.readText()
		.then(pastedText => {
			if (this.focused) {
				this.focused.text = utils.insertAtIndex(this.focused.text, this.focused.sp, pastedText)
				this.focused.sp += pastedText.length
			}
		})
		.catch(err => {
			
		})
	}
	onClick(event) {
		this.checkInputs(event)
	}
	checkInputs(event) {

	}
	contextmenu(event) {
		event.preventDefault()
	}
	cistart() {
		if (this.focused) {
			this.focused.focused = false
			this.focused = null
		}
	}
	ciend() {
		if (!this.focused) {
			this.getInput.blur()
		}
	}
	scroll(x, y) {
		
	}
	lockMouse() {
		const element = canvas
		if (element.requestPointerLock && !this.mobile) {
			element.requestPointerLock()
		}
	}
	unlockMouse() {
		if (document.exitPointerLock && !this.mobile) {
			document.exitPointerLock()
		}
	}
	isMouseLocked() {
		if (!this.mobile) {
			return document.pointerLockElement ||
			document.mozPointerLockElement ||
			document.webkitPointerLockElement
		}
		return this.mouse.locked
	}
	mouseDown(event) {
		if (event.button == 0) {
			this.mouse.lclick = true
			this.mouse.ldown = true
		} else if (event.button == 2) {
			this.mouse.rclick = true
			this.mouse.rdown = true
		}
		this.mouse.x = event.clientX/ui.scale
		this.mouse.y = event.clientY/ui.scale
		this.onClick(event)
		event.preventDefault()
	}
	mouseMove(event) {
		this.mouse.x = event.clientX/ui.scale
		this.mouse.y = event.clientY/ui.scale
	}
	mouseUp(event) {
		this.mouse.ldown = false
		this.mouse.rdown = false
	}
	touchStart(event) {
		for (let touch of event.changedTouches) {
			this.touches[touch.identifier] = {x: touch.clientX/ui.scale, y: touch.clientY/ui.scale}
		}

		this.mouse.ldown = true
		this.mouse.has = true
		this.mobile = true
		this.moved = 0
		this.downTime = 0
		this.mouse.x = event.touches[0].clientX/ui.scale
		this.mouse.y = event.touches[0].clientY/ui.scale
		event.preventDefault()

		this.touches = {}
		for (let touch of event.touches) {
			this.touches[touch.identifier] = {x: touch.clientX/ui.scale, y: touch.clientY/ui.scale}
		}
	}
	touchMove(event) {
		for (let touch of event.changedTouches) {
			if (!this.touches[touch.identifier]) {
				continue
			}
			let deltaMove = {x: touch.clientX/ui.scale - this.touches[touch.identifier].x, y: touch.clientY/ui.scale - this.touches[touch.identifier].y}

			this.touches[touch.identifier] = {x: touch.clientX/ui.scale, y: touch.clientY/ui.scale}

			this.moved += Math.abs((deltaMove.x+deltaMove.y)/2)

			this.scroll(-deltaMove.x/ui.scale, -deltaMove.y/ui.scale)
		}
		
		this.mouse.x = event.touches[0].clientX/ui.scale
		this.mouse.y = event.touches[0].clientY/ui.scale
		this.mobile = true
		this.mouse.has = true
		this.mouse.ldown = true

		this.touches = {}
		for (let touch of event.touches) {
			this.touches[touch.identifier] = {x: touch.clientX/ui.scale, y: touch.clientY/ui.scale}
		}
	}
	touchCancel(event) {
		if (this.focused) {
			this.focused.focused = false
			this.focused = null
		}
	}
	blur(event) {
		this.keys = {}
		this.jKeys = {}
		this.keysRaw = {}
		this.jKeysRaw = []
		this.mouse.lclick = false
		this.mouse.rclick = false
		this.mouse.ldown = false
		this.mouse.rdown = false
		this.touches = {}
		if (this.focused) {
			this.focused.focused = false
			this.focused = null
		}
		this.unlockMouse()
	}
	touchEnd(event) {
		for (let touch of event.changedTouches) {
			this.mouse.x = touch.clientX/ui.scale
			this.mouse.y = touch.clientY/ui.scale
			delete this.touches[touch.identifier]
		}
		if (Object.keys(this.touches).length <= 0) {
			this.mouse.ldown = false
		}
		if (this.moved < 50 && this.downTime < 0.2) {
			this.mouse.lclick = true
		}
		this.mouse.lclick = true
		this.mobile = true
		this.onClick(event)

		this.touches = {}
		for (let touch of event.touches) {
			this.touches[touch.identifier] = {x: touch.clientX/ui.scale, y: touch.clientY/ui.scale}
		}
	}
	keyPress(event) {

	}
	keyPressAlways(event) {

	}
	keydown(event) {
		let isCmd = event.ctrlKey || event.metaKey
		if (this.focused) {
			if (event.key.length == 1) {
				if (event.key == "c" && isCmd) {
					this.copyText(this.focused.text)
					this.focused.flash = 0.1
				} else if (event.key == "x" && isCmd) {
					this.copyText(this.focused.text)
					this.focused.flash = 0.1
					this.focused.text = ""
					this.focused.sp = 0
				} else if (event.key == "z" && isCmd) {
					this.focused.revert()
				} else if (event.key == "backspace" && isCmd) {

				} else if (event.key != "v" || !isCmd) {
					this.focused.text = utils.insertAtIndex(this.focused.text, this.focused.sp, event.key)
					this.focused.sp += 1
				}
			} else if (event.key == "Backspace") {
				this.focused.text = utils.removeAtIndex(this.focused.text, this.focused.sp-1)
				this.focused.sp -= 1
				if (this.focused.sp < 0) {
					this.focused.sp = 0
				}
				if (isCmd) {
					while (this.focused.text[this.focused.sp-1] != " ") {
						this.focused.text = utils.removeAtIndex(this.focused.text, this.focused.sp-1)
						this.focused.sp -= 1
						if (this.focused.sp < 0) {
							this.focused.sp = 0
							break
						}
					}
				}
			} else if (event.key == "ArrowLeft") {
				this.focused.sp -= 1
				if (this.focused.sp < 0) {
					this.focused.sp = 0
				}
				this.focused.time = 0
				this.focused.addCopy()
			} else if (event.key == "ArrowRight") {
				this.focused.sp += 1
				if (this.focused.sp > this.focused.text.length) {
					this.focused.sp = this.focused.text.length
				}
				this.focused.time = 0
				this.focused.addCopy()
			}
			if (event.key == "+") {
				event.preventDefault()
			}
		} else {
			if (!this.keys[event.code]) {
				this.jKeys[event.code] = true
			}
			this.keys[event.code] = true
			
			if (!this.keysRaw[event.key]) {
				this.jKeysRaw[event.key] = true
			}
			this.keysRaw[event.key] = true

			this.keyPress(event)
		}
		this.keyPressAlways(event)
		if (event.code == "Tab") {
			event.preventDefault()
		}
		if (isCmd) {
			this.keys = {}
			this.keysRaw = {}
		}
	}
	keyup(event) {
		delete this.keys[event.code]
		delete this.keysRaw[event.key]
	}
	wheel(event) {
		this.scroll(event.deltaX/ui.scale, event.deltaY/ui.scale)
	}
	updateInput(debug=false) {
		this.copyFlash -= window.delta
		if (this.copyFlash > 0) {
			this.copyFlashA = utils.lerp(this.copyFlashA, 1)
		} else {
			this.copyFlashA = utils.lerp(this.copyFlashA, 0)
		}

		if (debug && this.keys["ShiftLeft"]) {
			if (this.mouse.lclick) {
				this.startP = {x: this.mouse.x, y: this.mouse.y}
			}
			if (this.mouse.ldown) {
				let mid = {x: this.startP.x+(this.mouse.x-this.startP.x)/2, y: this.startP.y+(this.mouse.y-this.startP.y)/2}
				ui.text(this.startP.x, this.startP.y, 20*su, `(${Math.round(this.startP.x/su)}, ${Math.round(this.startP.y/su)})`, {align: "center"})
				ui.text(this.mouse.x, this.mouse.y, 20*su, `(${Math.round(this.mouse.x/su)}, ${Math.round(this.mouse.y/su)})`, {align: "center"})
				ui.rect(mid.x, mid.y, this.mouse.x-this.startP.x, this.mouse.y-this.startP.y, [200, 200, 200, 0.2], 5*su, [100, 100, 100, 0.2])
				ui.text(mid.x, mid.y, 20*su, `(${Math.round(mid.x/su)}, ${Math.round(mid.y/su)})`, {align: "center"})

				ui.text(mid.x, this.startP.y-15*su, 20*su, Math.round(this.mouse.x-this.startP.x), {align: "center"})
				ui.text(mid.x, this.mouse.y+15*su, 20*su, Math.round(this.mouse.x-this.startP.x), {align: "center"})
				ui.text(this.startP.x-5*su, mid.y, 20*su, Math.round(this.mouse.y-this.startP.y), {align: "right"})
				ui.text(this.mouse.x+5*su, mid.y, 20*su, Math.round(this.mouse.y-this.startP.y), {align: "right"})

				if (this.jKeys["KeyC"]) {
					this.copyText(mid.x+"*su, "+mid.y+"*su, "+Math.abs(this.mouse.x-this.startP.x)+"*su, "+Math.abs(this.mouse.y-this.startP.y)+"*su")
					this.copyFlash = 1
				}
			}
		}

		if (utils.raths) {
			this.rathsA = utils.lerp(this.rathsA, 1, delta*10)
		} else {
			this.rathsA = utils.lerp(this.rathsA, 0, delta*10)
		}

		if (this.rathsA > 0.01) {
			ui.rect(canvas.width/2, 210*su, 500*su, 400*su, [127, 127, 127, this.rathsA*0.5], 10*su, [0, 60, 127, 0.5])
			ui.text(canvas.width/2, 100*su, 40*su, utils.rathsMsg, {wrap: 500*su, align: "center"})
		}


		this.mouse.lclick = false
		this.mouse.rclick = false
		this.jKeys = {}
		this.jKeysRaw = {}

		if (this.focused) {
			this.focusedL = this.focused
		}
		if (this.focusedL && this.focusedL.focusA < 0.01) {
			this.focusedL = null
		}
		// if (document.activeElement != this.getInput) {
		// 	if (this.focused) {
		// 		this.focused.focused = false
		// 		this.focused = null
		// 	}
		// }

		if (this.mobile && this.focusedL) {
			this.focusedL.draw(true)
		}
	}
}

var input = new Input()
