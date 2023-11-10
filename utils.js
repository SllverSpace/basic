
class Utils {
    setGlobals() {
        window.lerp = this.lerp
        window.vec2 = this.vec2
        window.vec3 = this.vec3
        window.cap = this.cap
    }
    vec2(x, y) {
        return {x:x, y:y}
    }
    vec3(x, y, z) {
        return {x:x, y:y, z:z}
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