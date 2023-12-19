class Utils {
    setGlobals(vecs=true) {
        window.lerp = this.lerp
        window.cap = this.cap
        if (!vecs) { return }
        window.vec2 = this.vec2
        window.vec3 = this.vec3

        window.addv2 = this.addv2
        window.subv2 = this.subv2
        window.mulv2 = this.mulv2
        window.divv2 = this.divv2

        window.addv3 = this.addv3
        window.subv3 = this.subv3
        window.mulv3 = this.mulv3
        window.divv3 = this.divv3

        window.rotv2 = this.rotv2
        window.rotv3 = this.rotv3
    }
    setup(id="canvas") {
        window.canvas = document.getElementById(id)
        window.ctx = window.canvas.getContext("2d")
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
        return {x: vec.x*Math.cos(rot) - vec.y*Math.cos(rot), y: vec.x*Math.sin(rot) + vec.y*Math.sin(rot)}
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
}

var utils = new Utils()