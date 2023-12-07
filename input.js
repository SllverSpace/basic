
// my input handler, it uses dynamic event listeners to allow for easy code changes for other projects using this

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
	constructor() {
		this.getInput = document.createElement("textarea")
		this.getInput.style.position = "absolute"
		this.getInput.style.left = "-1000px"
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
	}
	copyText(text) {
		navigator.clipboard.writeText(text)
	}
	paste(event) {
		event.preventDefault()
		navigator.clipboard.readText()
		.then(pastedText => {
			if (this.focused) {
				this.focused.text += pastedText
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
		this.mouse.x = event.clientX
		this.mouse.y = event.clientY
		this.onClick(event)
	}
	mouseMove(event) {
		this.mouse.x = event.clientX
		this.mouse.y = event.clientY
	}
	mouseUp(event) {
		this.mouse.ldown = false
		this.mouse.rdown = false
	}
	touchStart(event) {
		for (let touch of event.changedTouches) {
			this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY}
		}

		this.mouse.ldown = true
		this.mouse.has = true
		this.mobile = true
		this.moved = 0
		this.downTime = 0
		this.mouse.x = event.touches[0].clientX
		this.mouse.y = event.touches[0].clientY
		event.preventDefault()

		this.touches = {}
		for (let touch of event.touches) {
			this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY}
		}
	}
	touchMove(event) {
		for (let touch of event.changedTouches) {
			let deltaMove = {x: touch.clientX - this.touches[touch.identifier].x, y: touch.clientY - this.touches[touch.identifier].y}

			this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY}

			this.moved += Math.abs((deltaMove.x+deltaMove.y)/2)

			this.scroll(-deltaMove.x, -deltaMove.y)
		}
		
		this.mouse.x = event.touches[0].clientX
		this.mouse.y = event.touches[0].clientY
		this.mobile = true
		this.mouse.has = true
		this.mouse.ldown = true

		this.touches = {}
		for (let touch of event.touches) {
			this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY}
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
		setTimeout(() => {
			for (let touch of event.changedTouches) {
				delete this.touches[touch.identifier]
			}
			if (Object.keys(this.touches).length <= 0) {
				this.mouse.ldown = false
			}
		}, 100)
		if (this.moved < 50 && this.downTime < 0.2) {
			this.mouse.lclick = true
		}
		this.mouse.lclick = true
		this.mobile = true
		this.onClick(event)

		this.touches = {}
		for (let touch of event.touches) {
			this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY}
		}
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
				} else if (event.key == "z" && isCmd) {
					this.focused.revert()
				} else if (event.key != "v" || !isCmd) {
					this.focused.text += event.key
				}
			} else if (event.key == "Backspace") {
				this.focused.text = this.focused.text.substring(0, this.focused.text.length-1)
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
		}
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
		this.scroll(event.deltaX, event.deltaY)
	}
	updateInput() {
		this.mouse.lclick = false
		this.mouse.rclick = false
		this.jKeys = {}
		this.jKeysRaw = {}
		// if (document.activeElement != this.getInput) {
		// 	if (this.focused) {
		// 		this.focused.focused = false
		// 		this.focused = null
		// 	}
		// }
	}
}

var input = new Input()
