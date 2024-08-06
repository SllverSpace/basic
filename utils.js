class Utils {
    prev = {}
    setGlobals(vecs=true) {
        this.setGlobal("lerp", this.lerp)
        this.setGlobal("cap", this.cap)
        if (!vecs) { return }
        this.setGlobal("vec2", this.vec2)
        this.setGlobal("vec3", this.vec3)

        this.setGlobal("addv2", this.addv2)
        this.setGlobal("subv2", this.subv2)
        this.setGlobal("mulv2", this.mulv2)
        this.setGlobal("divv2", this.divv2)

        this.setGlobal("addv3", this.addv3)
        this.setGlobal("subv3", this.subv3)
        this.setGlobal("mulv3", this.mulv3)
        this.setGlobal("divv3", this.divv3)

        this.setGlobal("addvl3", this.addvl3)
        this.setGlobal("subvl3", this.subvl3)
        this.setGlobal("mulvl3", this.mulvl3)
        this.setGlobal("divvl3", this.divvl3)

        this.setGlobal("rotv2", this.rotv2)
        this.setGlobal("rotv3", this.rotv3)
        this.setGlobal("rotv2x", this.rotv2x)
        this.setGlobal("rotv2y", this.rotv2y)

        this.raths = false
        this.rathsMsg = ""
    }
    setGlobal(name, value) {
        this.prev[name] = window[name]
        window[name] = value
    }
    setup(id="canvas", viewportContent=null) {
        window.canvas = document.getElementById(id)
        window.ctx = window.canvas.getContext("2d")
        this.viewportMeta = document.createElement("meta")
        this.viewportMeta.name = "viewport"
        this.viewportMeta.content = viewportContent ? viewportContent : "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        document.head.appendChild(this.viewportMeta)
    }
    requestAddToHomeScreen(msg="Hey there! You seem to like this website, want to install it as an app?") {
        this.raths = true
        this.rathsMsg = msg
    }
    ignoreSafeArea() {
        this.viewportMeta.content += ", viewport-fit=cover"
    }
    setStyles() {
        canvas.style.position = "absolute"
        canvas.style.left = 0
        canvas.style.top = 0
        document.body.style.overflow = "hidden"
    }
    getDelta(timestamp, max=0.1) {
        window.delta = (timestamp - window.lastTime) / 1000
        if (!window.delta || window.delta < 0) window.delta = 0
        if (window.delta > max) window.delta = max
        window.lastTime = timestamp
        return window.delta
    }
    insertAtIndex(originalString, index, stringToInsert) {
        return originalString.slice(0, index) + stringToInsert + originalString.slice(index)
    }
    removeAtIndex(originalString, index) {
        if (index < 0 || index >= originalString.length) {
          return originalString
        }
        return originalString.slice(0, index) + originalString.slice(index + 1)
    }
    vec2(x, y) {
        return {x:x, y:y}
    }
    vec3(x, y, z) {
        return {x:x, y:y, z:z}
    }

    addv2(v1, v2) {
        return {x:v1.x+v2.x, y: v1.y+v2.y}
    }
    subv2(v1, v2) {
        return {x:v1.x-v2.x, y: v1.y-v2.y}
    }
    mulv2(v1, v2) {
        return {x:v1.x*v2.x, y: v1.y*v2.y}
    }
    divv2(v1, v2) {
        return {x:v1.x/v2.x, y: v1.y/v2.y}
    }

    addv3(v1, v2) {
        return {x:v1.x+v2.x, y: v1.y+v2.y, z: v1.z+v2.z}
    }
    subv3(v1, v2) {
        return {x:v1.x-v2.x, y: v1.y-v2.y, z: v1.z-v2.z}
    }
    mulv3(v1, v2) {
        return {x:v1.x*v2.x, y: v1.y*v2.y, z: v1.z*v2.z}
    }
    divv3(v1, v2) {
        return {x:v1.x/v2.x, y: v1.y/v2.y, z: v1.z/v2.z}
    }

    addvl3(v1, v2) {
        return [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]]
    }
    subvl3(v1, v2) {
        return [v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2]]
    }
    mulvl3(v1, v2) {
        return [v1[0]*v2[0], v1[1]*v2[1], v1[2]*v2[2]]
    }
    divvl3(v1, v2) {
        return [v1[0]/v2[0], v1[1]/v2[1], v1[2]/v2[2]]
    }

    rotv2(vec, rot) {
        return {x: vec.x*Math.sin(rot) + vec.y*Math.sin(rot+Math.PI/2), y: vec.x*Math.cos(rot) + vec.y*Math.cos(rot+Math.PI/2)}
    }
    rotv3(vec, rot) {
        let x1 = vec.x * Math.cos(rot.z) - vec.y * Math.sin(rot.z)
        let y1 = vec.x * Math.sin(rot.z) + vec.y * Math.cos(rot.z)

        let y2 = y1 * Math.cos(rot.x) - vec.z * Math.sin(rot.x)
        let z1 = y1 * Math.sin(rot.x) + vec.z * Math.cos(rot.x)

        let x2 = x1 * Math.cos(rot.y) + z1 * Math.sin(rot.y)
        let z2 = -x1 * Math.sin(rot.y) + z1 * Math.cos(rot.y)

        return {x:x2, y:y2, z:z2}
    }
    rotv2x(x, y, rot) {
        return vec.x*Math.sin(rot) + vec.y*Math.sin(rot+Math.PI/2)
    }
    rotv2y(x, y, rot) {
        return vec.x*Math.cos(rot) + vec.y*Math.cos(rot+Math.PI/2)
    }

    lerp(start, end, multiply) {
        if (multiply > 1) multiply = 1
        if (multiply < 0) multiply = 0
        return start + (end-start) * multiply
    }
    cap(value, min, max) {
        if (value < min) {
            value = min
        }
        if (value > max) {
            value = max
        }
    }
    rect2dc(x1, y1, w1, h1, x2, y2, w2, h2) {
        return (
            x1+w1/2 > x2-w2/2 &&
            x1-w1/2 < x2+w2/2 &&
            y1+h1/2 > y2-h2/2 &&
            y1-h1/2 < y2+h2/2
        )
    }
}

var utils = new Utils()