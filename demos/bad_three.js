var THREE = THREE || {};
if (!window.Int32Array) window.Int32Array = Array, window.Float32Array = Array;
THREE.Color = function (b) {
    this.setHex(b)
};
THREE.Color.prototype = {
    copy: function (b) {
        this.r = b.r;
        this.g = b.g;
        this.b = b.b;
        this.hex = b.hex
    },
    setHex: function (b) {
        this.hex = ~~b & 16777215;
        this.updateRGB()
    },
    setRGB: function (b, c, e) {
        this.r = b;
        this.g = c;
        this.b = e;
        this.updateHex()
    },
    setHSV: function (b, c, e) {
        var f, g, k, h, m, n;
        if (e == 0) f = g = k = 0;
        else switch (h = Math.floor(b * 6), m = b * 6 - h, b = e * (1 - c), n = e * (1 - c * m), c = e * (1 - c * (1 - m)), h) {
            case 1:
                f = n;
                g = e;
                k = b;
                break;
            case 2:
                f = b;
                g = e;
                k = c;
                break;
            case 3:
                f = b;
                g = n;
                k = e;
                break;
            case 4:
                f = c;
                g = b;
                k = e;
                break;
            case 5:
                f = e;
                g = b;
                k = n;
                break;
            case 6:
            case 0:
                f = e, g = c, k = b
        }
        this.setRGB(f,
        g, k)
    },
    updateHex: function () {
        this.hex = ~~ (this.r * 255) << 16 ^ ~~ (this.g * 255) << 8 ^ ~~ (this.b * 255)
    },
    updateRGB: function () {
        this.r = (this.hex >> 16 & 255) / 255;
        this.g = (this.hex >> 8 & 255) / 255;
        this.b = (this.hex & 255) / 255
    },
    clone: function () {
        return new THREE.Color(this.hex)
    }
};
THREE.Vector2 = function (b, c) {
    this.set(b || 0, c || 0)
};
THREE.Vector2.prototype = {
    set: function (b, c) {
        this.x = b;
        this.y = c;
        return this
    },
    copy: function (b) {
        this.x = b.x;
        this.y = b.y;
        return this
    },
    clone: function () {
        return new THREE.Vector2(this.x, this.y)
    },
    add: function (b, c) {
        this.x = b.x + c.x;
        this.y = b.y + c.y;
        return this
    },
    addSelf: function (b) {
        this.x += b.x;
        this.y += b.y;
        return this
    },
    sub: function (b, c) {
        this.x = b.x - c.x;
        this.y = b.y - c.y;
        return this
    },
    subSelf: function (b) {
        this.x -= b.x;
        this.y -= b.y;
        return this
    },
    multiplyScalar: function (b) {
        this.x *= b;
        this.y *= b;
        return this
    },
    divideScalar: function (b) {
        b ? (this.x /= b, this.y /= b) : this.set(0, 0);
        return this
    },
    negate: function () {
        return this.multiplyScalar(-1)
    },
    dot: function (b) {
        return this.x * b.x + this.y * b.y
    },
    lengthSq: function () {
        return this.x * this.x + this.y * this.y
    },
    length: function () {
        return Math.sqrt(this.lengthSq())
    },
    normalize: function () {
        return this.divideScalar(this.length())
    },
    distanceTo: function (b) {
        return Math.sqrt(this.distanceToSquared(b))
    },
    distanceToSquared: function (b) {
        var c = this.x - b.x,
            b = this.y - b.y;
        return c * c + b * b
    },
    setLength: function (b) {
        return this.normalize().multiplyScalar(b)
    },
    unit: function () {
        return this.normalize()
    },
    equals: function (b) {
        return b.x == this.x && b.y == this.y
    }
};
THREE.Vector3 = function (b, c, e) {
    this.set(b || 0, c || 0, e || 0)
};
THREE.Vector3.prototype = {
    set: function (b, c, e) {
        this.x = b;
        this.y = c;
        this.z = e;
        return this
    },
    copy: function (b) {
        this.x = b.x;
        this.y = b.y;
        this.z = b.z;
        return this
    },
    clone: function () {
        return new THREE.Vector3(this.x, this.y, this.z)
    },
    add: function (b, c) {
        this.x = b.x + c.x;
        this.y = b.y + c.y;
        this.z = b.z + c.z;
        return this
    },
    addSelf: function (b) {
        this.x += b.x;
        this.y += b.y;
        this.z += b.z;
        return this
    },
    addScalar: function (b) {
        this.x += b;
        this.y += b;
        this.z += b;
        return this
    },
    sub: function (b, c) {
        this.x = b.x - c.x;
        this.y = b.y - c.y;
        this.z = b.z - c.z;
        return this
    },
    subSelf: function (b) {
        this.x -= b.x;
        this.y -= b.y;
        this.z -= b.z;
        return this
    },
    multiply: function (b, c) {
        this.x = b.x * c.x;
        this.y = b.y * c.y;
        this.z = b.z * c.z;
        return this
    },
    multiplySelf: function (b) {
        this.x *= b.x;
        this.y *= b.y;
        this.z *= b.z;
        return this
    },
    multiplyScalar: function (b) {
        this.x *= b;
        this.y *= b;
        this.z *= b;
        return this
    },
    divideSelf: function (b) {
        return this.divide(this, b)
    },
    divideScalar: function (b) {
        b ? (this.x /= b, this.y /= b, this.z /= b) : this.set(0, 0, 0);
        return this
    },
    negate: function () {
        return this.multiplyScalar(-1)
    },
    dot: function (b) {
        return this.x * b.x + this.y * b.y + this.z * b.z
    },
    lengthSq: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z
    },
    length: function () {
        return Math.sqrt(this.lengthSq())
    },
    lengthManhattan: function () {
        return this.x + this.y + this.z
    },
    normalize: function () {
        return this.divideScalar(this.length())
    },
    setLength: function (b) {
        return this.normalize().multiplyScalar(b)
    },
    cross: function (b, c) {
        this.x = b.y * c.z - b.z * c.y;
        this.y = b.z * c.x - b.x * c.z;
        this.z = b.x * c.y - b.y * c.x;
        return this
    },
    crossSelf: function (b) {
        return this.set(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x)
    },
    distanceTo: function (b) {
        return Math.sqrt(this.distanceToSquared(b))
    },
    distanceToSquared: function (b) {
        return (new THREE.Vector3).sub(this, b).lengthSq()
    },
    setPositionFromMatrix: function (b) {
        this.x = b.n14;
        this.y = b.n24;
        this.z = b.n34
    },
    setRotationFromMatrix: function (b) {
        var c = Math.cos(this.y);
        this.y = Math.asin(b.n13);
        Math.abs(c) > 1.0E-5 ? (this.x = Math.atan2(-b.n23 / c, b.n33 / c), this.z = Math.atan2(-b.n12 / c, b.n11 / c)) : (this.x = 0, this.z = Math.atan2(b.n21, b.n22))
    },
    isZero: function () {
        return this.lengthSq() < 1.0E-4
    }
};
THREE.Vector4 = function (b, c, e, f) {
    this.set(b || 0, c || 0, e || 0, f || 1)
};
THREE.Vector4.prototype = {
    set: function (b, c, e, f) {
        this.x = b;
        this.y = c;
        this.z = e;
        this.w = f;
        return this
    },
    copy: function (b) {
        return this.set(b.x, b.y, b.z, b.w || 1)
    },
    clone: function () {
        return new THREE.Vector4(this.x, this.y, this.z, this.w)
    },
    add: function (b, c) {
        this.x = b.x + c.x;
        this.y = b.y + c.y;
        this.z = b.z + c.z;
        this.w = b.w + c.w;
        return this
    },
    addSelf: function (b) {
        this.x += b.x;
        this.y += b.y;
        this.z += b.z;
        this.w += b.w;
        return this
    },
    sub: function (b, c) {
        this.x = b.x - c.x;
        this.y = b.y - c.y;
        this.z = b.z - c.z;
        this.w = b.w - c.w;
        return this
    },
    subSelf: function (b) {
        this.x -= b.x;
        this.y -= b.y;
        this.z -= b.z;
        this.w -= b.w;
        return this
    },
    multiplyScalar: function (b) {
        this.x *= b;
        this.y *= b;
        this.z *= b;
        this.w *= b;
        return this
    },
    divideScalar: function (b) {
        b ? (this.x /= b, this.y /= b, this.z /= b, this.w /= b) : this.set(0, 0, 0, 1);
        return this
    },
    negate: function () {
        return this.multiplyScalar(-1)
    },
    dot: function (b) {
        return this.x * b.x + this.y * b.y + this.z * b.z + this.w * b.w
    },
    lengthSq: function () {
        return this.dot(this)
    },
    length: function () {
        return Math.sqrt(this.lengthSq())
    },
    normalize: function () {
        return this.divideScalar(this.length())
    },
    setLength: function (b) {
        return this.normalize().multiplyScalar(b)
    },
    lerpSelf: function (b, c) {
        this.x += (b.x - this.x) * c;
        this.y += (b.y - this.y) * c;
        this.z += (b.z - this.z) * c;
        this.w += (b.w - this.w) * c;
        return this
    }
};
THREE.Ray = function (b, c) {
    this.origin = b || new THREE.Vector3;
    this.direction = c || new THREE.Vector3
};
THREE.Ray.prototype = {
    intersectScene: function (b) {
        return this.intersectObjects(b.objects)
    },
    intersectObjects: function (b) {
        var c, e, f = [];
        c = 0;
        for (e = b.length; c < e; c++) f = f.concat(this.intersectObject(b[c]));
        f.sort(function (b, e) {
            return b.distance - e.distance
        });
        return f
    },
    intersectObject: function (b) {
        function c(b, e, c) {
            var f, c = c.matrixWorld.getPosition();
            f = c.clone().subSelf(b).dot(e);
            b = b.clone().addSelf(e.clone().multiplyScalar(f));
            return c.distanceTo(b)
        }
        function e(b, e, c, f) {
            var f = f.clone().subSelf(e),
                c = c.clone().subSelf(e),
                g = b.clone().subSelf(e),
                b = f.dot(f),
                e = f.dot(c),
                f = f.dot(g),
                h = c.dot(c),
                c = c.dot(g),
                g = 1 / (b * h - e * e),
                h = (h * f - e * c) * g,
                b = (b * c - e * f) * g;
            return h > 0 && b > 0 && h + b < 1
        }
        if (b instanceof THREE.Particle) {
            var f = c(this.origin, this.direction, b);
            if (!f || f > b.scale.x) return [];
            return [{
                distance: f,
                point: b.position,
                face: null,
                object: b
            }]
        } else if (b instanceof THREE.Mesh) {
            f = c(this.origin, this.direction, b);
            if (!f || f > b.geometry.boundingSphere.radius * Math.max(b.scale.x, Math.max(b.scale.y, b.scale.z))) return [];
            var g, k, h, m, n, o, p, t, v, u, w = b.geometry,
                B = w.vertices,
                A = [],
                f = 0;
            for (g = w.faces.length; f < g; f++) if (k = w.faces[f], v = this.origin.clone(), u = this.direction.clone(), o = b.matrixWorld, h = o.multiplyVector3(B[k.a].position.clone()), m = o.multiplyVector3(B[k.b].position.clone()), n = o.multiplyVector3(B[k.c].position.clone()), o = k instanceof THREE.Face4 ? o.multiplyVector3(B[k.d].position.clone()) : null, p = b.matrixRotationWorld.multiplyVector3(k.normal.clone()), t = u.dot(p), b.doubleSided || (b.flipSided ? t > 0 : t < 0)) if (p = p.dot((new THREE.Vector3).sub(h, v)) / t, v = v.addSelf(u.multiplyScalar(p)),
            k instanceof THREE.Face3) e(v, h, m, n) && (k = {
                distance: this.origin.distanceTo(v),
                point: v,
                face: k,
                object: b
            }, A.push(k));
            else if (k instanceof THREE.Face4 && (e(v, h, m, o) || e(v, m, n, o))) k = {
                distance: this.origin.distanceTo(v),
                point: v,
                face: k,
                object: b
            }, A.push(k);
            return A
        } else return []
    }
};
THREE.Rectangle = function () {
    function b() {
        k = f - c;
        h = g - e
    }
    var c, e, f, g, k, h, m = !0;
    this.getX = function () {
        return c
    };
    this.getY = function () {
        return e
    };
    this.getWidth = function () {
        return k
    };
    this.getHeight = function () {
        return h
    };
    this.getLeft = function () {
        return c
    };
    this.getTop = function () {
        return e
    };
    this.getRight = function () {
        return f
    };
    this.getBottom = function () {
        return g
    };
    this.set = function (h, k, p, t) {
        m = !1;
        c = h;
        e = k;
        f = p;
        g = t;
        b()
    };
    this.addPoint = function (h, k) {
        m ? (m = !1, c = h, e = k, f = h, g = k) : (c = c < h ? c : h, e = e < k ? e : k, f = f > h ? f : h, g = g > k ? g : k);
        b()
    };
    this.add3Points = function (h, k, p, t, v, u) {
        m ? (m = !1, c = h < p ? h < v ? h : v : p < v ? p : v, e = k < t ? k < u ? k : u : t < u ? t : u, f = h > p ? h > v ? h : v : p > v ? p : v, g = k > t ? k > u ? k : u : t > u ? t : u) : (c = h < p ? h < v ? h < c ? h : c : v < c ? v : c : p < v ? p < c ? p : c : v < c ? v : c, e = k < t ? k < u ? k < e ? k : e : u < e ? u : e : t < u ? t < e ? t : e : u < e ? u : e, f = h > p ? h > v ? h > f ? h : f : v > f ? v : f : p > v ? p > f ? p : f : v > f ? v : f, g = k > t ? k > u ? k > g ? k : g : u > g ? u : g : t > u ? t > g ? t : g : u > g ? u : g);
        b()
    };
    this.addRectangle = function (h) {
        m ? (m = !1, c = h.getLeft(), e = h.getTop(), f = h.getRight(), g = h.getBottom()) : (c = c < h.getLeft() ? c : h.getLeft(), e = e < h.getTop() ? e : h.getTop(), f = f > h.getRight() ? f : h.getRight(), g = g > h.getBottom() ? g : h.getBottom());
        b()
    };
    this.inflate = function (h) {
        c -= h;
        e -= h;
        f += h;
        g += h;
        b()
    };
    this.minSelf = function (h) {
        c = c > h.getLeft() ? c : h.getLeft();
        e = e > h.getTop() ? e : h.getTop();
        f = f < h.getRight() ? f : h.getRight();
        g = g < h.getBottom() ? g : h.getBottom();
        b()
    };
    this.instersects = function (b) {
        return Math.min(f, b.getRight()) - Math.max(c, b.getLeft()) >= 0 && Math.min(g, b.getBottom()) - Math.max(e, b.getTop()) >= 0
    };
    this.empty = function () {
        m = !0;
        g = f = e = c = 0;
        b()
    };
    this.isEmpty = function () {
        return m
    }
};
THREE.Matrix3 = function () {
    this.m = []
};
THREE.Matrix3.prototype = {
    transpose: function () {
        var b, c = this.m;
        b = c[1];
        c[1] = c[3];
        c[3] = b;
        b = c[2];
        c[2] = c[6];
        c[6] = b;
        b = c[5];
        c[5] = c[7];
        c[7] = b;
        return this
    },
    transposeIntoArray: function (b) {
        var c = this.m;
        b[0] = c[0];
        b[1] = c[3];
        b[2] = c[6];
        b[3] = c[1];
        b[4] = c[4];
        b[5] = c[7];
        b[6] = c[2];
        b[7] = c[5];
        b[8] = c[8];
        return this
    }
};
THREE.Matrix4 = function (b, c, e, f, g, k, h, m, n, o, p, t, v, u, w, B) {
    this.set(b || 1, c || 0, e || 0, f || 0, g || 0, k || 1, h || 0, m || 0, n || 0, o || 0, p || 1, t || 0, v || 0, u || 0, w || 0, B || 1);
    this.flat = Array(16);
    this.m33 = new THREE.Matrix3
};
THREE.Matrix4.prototype = {
    set: function (b, c, e, f, g, k, h, m, n, o, p, t, v, u, w, B) {
        this.n11 = b;
        this.n12 = c;
        this.n13 = e;
        this.n14 = f;
        this.n21 = g;
        this.n22 = k;
        this.n23 = h;
        this.n24 = m;
        this.n31 = n;
        this.n32 = o;
        this.n33 = p;
        this.n34 = t;
        this.n41 = v;
        this.n42 = u;
        this.n43 = w;
        this.n44 = B;
        return this
    },
    identity: function () {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this
    },
    copy: function (b) {
        this.set(b.n11, b.n12, b.n13, b.n14, b.n21, b.n22, b.n23, b.n24, b.n31, b.n32, b.n33, b.n34, b.n41, b.n42, b.n43, b.n44);
        return this
    },
    lookAt: function (b, c, e) {
        var f = THREE.Matrix4.__v1,
            g = THREE.Matrix4.__v2,
            k = THREE.Matrix4.__v3;
        k.sub(b, c).normalize();
        if (k.length() === 0) k.z = 1;
        f.cross(e, k).normalize();
        f.length() === 0 && (k.x += 1.0E-4, f.cross(e, k).normalize());
        g.cross(k, f).normalize();
        this.n11 = f.x;
        this.n12 = g.x;
        this.n13 = k.x;
        this.n21 = f.y;
        this.n22 = g.y;
        this.n23 = k.y;
        this.n31 = f.z;
        this.n32 = g.z;
        this.n33 = k.z;
        return this
    },
    multiplyVector3: function (b) {
        var c = b.x,
            e = b.y,
            f = b.z,
            g = 1 / (this.n41 * c + this.n42 * e + this.n43 * f + this.n44);
        b.x = (this.n11 * c + this.n12 * e + this.n13 * f + this.n14) * g;
        b.y = (this.n21 * c + this.n22 * e + this.n23 * f + this.n24) * g;
        b.z = (this.n31 * c + this.n32 * e + this.n33 * f + this.n34) * g;
        return b
    },
    multiplyVector4: function (b) {
        var c = b.x,
            e = b.y,
            f = b.z,
            g = b.w;
        b.x = this.n11 * c + this.n12 * e + this.n13 * f + this.n14 * g;
        b.y = this.n21 * c + this.n22 * e + this.n23 * f + this.n24 * g;
        b.z = this.n31 * c + this.n32 * e + this.n33 * f + this.n34 * g;
        b.w = this.n41 * c + this.n42 * e + this.n43 * f + this.n44 * g;
        return b
    },
    rotateAxis: function (b) {
        var c = b.x,
            e = b.y,
            f = b.z;
        b.x = c * this.n11 + e * this.n12 + f * this.n13;
        b.y = c * this.n21 + e * this.n22 + f * this.n23;
        b.z = c * this.n31 + e * this.n32 + f * this.n33;
        b.normalize();
        return b
    },
    crossVector: function (b) {
        var c = new THREE.Vector4;
        c.x = this.n11 * b.x + this.n12 * b.y + this.n13 * b.z + this.n14 * b.w;
        c.y = this.n21 * b.x + this.n22 * b.y + this.n23 * b.z + this.n24 * b.w;
        c.z = this.n31 * b.x + this.n32 * b.y + this.n33 * b.z + this.n34 * b.w;
        c.w = b.w ? this.n41 * b.x + this.n42 * b.y + this.n43 * b.z + this.n44 * b.w : 1;
        return c
    },
    multiply: function (b, c) {
        var e = b.n11,
            f = b.n12,
            g = b.n13,
            k = b.n14,
            h = b.n21,
            m = b.n22,
            n = b.n23,
            o = b.n24,
            p = b.n31,
            t = b.n32,
            v = b.n33,
            u = b.n34,
            w = b.n41,
            B = b.n42,
            A = b.n43,
            y = b.n44,
            G = c.n11,
            z = c.n12,
            C = c.n13,
            H = c.n14,
            D = c.n21,
            Q = c.n22,
            J = c.n23,
            F = c.n24,
            I = c.n31,
            S = c.n32,
            K = c.n33,
            ea = c.n34,
            j = c.n41,
            ca = c.n42,
            T = c.n43,
            Z = c.n44;
        this.n11 = e * G + f * D + g * I + k * j;
        this.n12 = e * z + f * Q + g * S + k * ca;
        this.n13 = e * C + f * J + g * K + k * T;
        this.n14 = e * H + f * F + g * ea + k * Z;
        this.n21 = h * G + m * D + n * I + o * j;
        this.n22 = h * z + m * Q + n * S + o * ca;
        this.n23 = h * C + m * J + n * K + o * T;
        this.n24 = h * H + m * F + n * ea + o * Z;
        this.n31 = p * G + t * D + v * I + u * j;
        this.n32 = p * z + t * Q + v * S + u * ca;
        this.n33 = p * C + t * J + v * K + u * T;
        this.n34 = p * H + t * F + v * ea + u * Z;
        this.n41 = w * G + B * D + A * I + y * j;
        this.n42 = w * z + B * Q + A * S + y * ca;
        this.n43 = w * C + B * J + A * K + y * T;
        this.n44 = w * H + B * F + A * ea + y * Z;
        return this
    },
    multiplyToArray: function (b, c, e) {
        this.multiply(b, c);
        e[0] = this.n11;
        e[1] = this.n21;
        e[2] = this.n31;
        e[3] = this.n41;
        e[4] = this.n12;
        e[5] = this.n22;
        e[6] = this.n32;
        e[7] = this.n42;
        e[8] = this.n13;
        e[9] = this.n23;
        e[10] = this.n33;
        e[11] = this.n43;
        e[12] = this.n14;
        e[13] = this.n24;
        e[14] = this.n34;
        e[15] = this.n44;
        return this
    },
    multiplySelf: function (b) {
        this.multiply(this, b);
        return this
    },
    multiplyScalar: function (b) {
        this.n11 *= b;
        this.n12 *= b;
        this.n13 *= b;
        this.n14 *= b;
        this.n21 *= b;
        this.n22 *= b;
        this.n23 *= b;
        this.n24 *= b;
        this.n31 *= b;
        this.n32 *= b;
        this.n33 *= b;
        this.n34 *= b;
        this.n41 *= b;
        this.n42 *= b;
        this.n43 *= b;
        this.n44 *= b;
        return this
    },
    determinant: function () {
        var b = this.n11,
            c = this.n12,
            e = this.n13,
            f = this.n14,
            g = this.n21,
            k = this.n22,
            h = this.n23,
            m = this.n24,
            n = this.n31,
            o = this.n32,
            p = this.n33,
            t = this.n34,
            v = this.n41,
            u = this.n42,
            w = this.n43,
            B = this.n44;
        return f * h * o * v - e * m * o * v - f * k * p * v + c * m * p * v + e * k * t * v - c * h * t * v - f * h * n * u + e * m * n * u + f * g * p * u - b * m * p * u - e * g * t * u + b * h * t * u + f * k * n * w - c * m * n * w - f * g * o * w + b * m * o * w + c * g * t * w - b * k * t * w - e * k * n * B + c * h * n * B + e * g * o * B - b * h * o * B - c * g * p * B + b * k * p * B
    },
    transpose: function () {
        var b;
        b = this.n21;
        this.n21 = this.n12;
        this.n12 = b;
        b = this.n31;
        this.n31 = this.n13;
        this.n13 = b;
        b = this.n32;
        this.n32 = this.n23;
        this.n23 = b;
        b = this.n41;
        this.n41 = this.n14;
        this.n14 = b;
        b = this.n42;
        this.n42 = this.n24;
        this.n24 = b;
        b = this.n43;
        this.n43 = this.n34;
        this.n43 = b;
        return this
    },
    clone: function () {
        var b = new THREE.Matrix4;
        b.n11 = this.n11;
        b.n12 = this.n12;
        b.n13 = this.n13;
        b.n14 = this.n14;
        b.n21 = this.n21;
        b.n22 = this.n22;
        b.n23 = this.n23;
        b.n24 = this.n24;
        b.n31 = this.n31;
        b.n32 = this.n32;
        b.n33 = this.n33;
        b.n34 = this.n34;
        b.n41 = this.n41;
        b.n42 = this.n42;
        b.n43 = this.n43;
        b.n44 = this.n44;
        return b
    },
    flatten: function () {
        this.flat[0] = this.n11;
        this.flat[1] = this.n21;
        this.flat[2] = this.n31;
        this.flat[3] = this.n41;
        this.flat[4] = this.n12;
        this.flat[5] = this.n22;
        this.flat[6] = this.n32;
        this.flat[7] = this.n42;
        this.flat[8] = this.n13;
        this.flat[9] = this.n23;
        this.flat[10] = this.n33;
        this.flat[11] = this.n43;
        this.flat[12] = this.n14;
        this.flat[13] = this.n24;
        this.flat[14] = this.n34;
        this.flat[15] = this.n44;
        return this.flat
    },
    flattenToArray: function (b) {
        b[0] = this.n11;
        b[1] = this.n21;
        b[2] = this.n31;
        b[3] = this.n41;
        b[4] = this.n12;
        b[5] = this.n22;
        b[6] = this.n32;
        b[7] = this.n42;
        b[8] = this.n13;
        b[9] = this.n23;
        b[10] = this.n33;
        b[11] = this.n43;
        b[12] = this.n14;
        b[13] = this.n24;
        b[14] = this.n34;
        b[15] = this.n44;
        return b
    },
    flattenToArrayOffset: function (b, c) {
        b[c] = this.n11;
        b[c + 1] = this.n21;
        b[c + 2] = this.n31;
        b[c + 3] = this.n41;
        b[c + 4] = this.n12;
        b[c + 5] = this.n22;
        b[c + 6] = this.n32;
        b[c + 7] = this.n42;
        b[c + 8] = this.n13;
        b[c + 9] = this.n23;
        b[c + 10] = this.n33;
        b[c + 11] = this.n43;
        b[c + 12] = this.n14;
        b[c + 13] = this.n24;
        b[c + 14] = this.n34;
        b[c + 15] = this.n44;
        return b
    },
    setTranslation: function (b, c, e) {
        this.set(1, 0, 0, b, 0, 1, 0, c, 0, 0, 1, e, 0, 0, 0, 1);
        return this
    },
    setScale: function (b, c, e) {
        this.set(b, 0, 0, 0, 0, c, 0, 0, 0, 0, e, 0, 0, 0, 0, 1);
        return this
    },
    setRotationX: function (b) {
        var c = Math.cos(b),
            b = Math.sin(b);
        this.set(1, 0, 0, 0, 0, c, -b, 0, 0, b, c, 0, 0, 0, 0, 1);
        return this
    },
    setRotationY: function (b) {
        var c = Math.cos(b),
            b = Math.sin(b);
        this.set(c, 0, b, 0, 0, 1, 0, 0, -b, 0, c, 0, 0, 0, 0, 1);
        return this
    },
    setRotationZ: function (b) {
        var c = Math.cos(b),
            b = Math.sin(b);
        this.set(c, -b, 0, 0, b, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this
    },
    setRotationAxis: function (b, c) {
        var e = Math.cos(c),
            f = Math.sin(c),
            g = 1 - e,
            k = b.x,
            h = b.y,
            m = b.z,
            n = g * k,
            o = g * h;
        this.set(n * k + e, n * h - f * m, n * m + f * h, 0, n * h + f * m, o * h + e, o * m - f * k, 0, n * m - f * h, o * m + f * k, g * m * m + e, 0, 0, 0, 0, 1);
        return this
    },
    setPosition: function (b) {
        this.n14 = b.x;
        this.n24 = b.y;
        this.n34 = b.z;
        return this
    },
    getPosition: function () {
        if (!this.position) this.position = new THREE.Vector3;
        this.position.set(this.n14, this.n24, this.n34);
        return this.position
    },
    getColumnX: function () {
        if (!this.columnX) this.columnX = new THREE.Vector3;
        this.columnX.set(this.n11,
        this.n21, this.n31);
        return this.columnX
    },
    getColumnY: function () {
        if (!this.columnY) this.columnY = new THREE.Vector3;
        this.columnY.set(this.n12, this.n22, this.n32);
        return this.columnY
    },
    getColumnZ: function () {
        if (!this.columnZ) this.columnZ = new THREE.Vector3;
        this.columnZ.set(this.n13, this.n23, this.n33);
        return this.columnZ
    },
    setRotationFromEuler: function (b, c) {
        var e = b.x,
            f = b.y,
            g = b.z,
            k = Math.cos(e),
            e = Math.sin(e),
            h = Math.cos(f),
            f = Math.sin(f),
            m = Math.cos(g),
            g = Math.sin(g);
        switch (c) {
            case "YXZ":
                var n = h * m,
                    o = h * g,
                    p = f * m,
                    t = f * g;
                this.n11 = n + t * e;
                this.n12 = p * e - o;
                this.n13 = k * f;
                this.n21 = k * g;
                this.n22 = k * m;
                this.n23 = -e;
                this.n31 = o * e - p;
                this.n32 = t + n * e;
                this.n33 = k * h;
                break;
            case "ZXY":
                n = h * m;
                o = h * g;
                p = f * m;
                t = f * g;
                this.n11 = n - t * e;
                this.n12 = -k * g;
                this.n13 = p + o * e;
                this.n21 = o + p * e;
                this.n22 = k * m;
                this.n23 = t - n * e;
                this.n31 = -k * f;
                this.n32 = e;
                this.n33 = k * h;
                break;
            case "ZYX":
                n = k * m;
                o = k * g;
                p = e * m;
                t = e * g;
                this.n11 = h * m;
                this.n12 = p * f - o;
                this.n13 = n * f + t;
                this.n21 = h * g;
                this.n22 = t * f + n;
                this.n23 = o * f - p;
                this.n31 = -f;
                this.n32 = e * h;
                this.n33 = k * h;
                break;
            case "YZX":
                n = k * h;
                o = k * f;
                p = e * h;
                t = e * f;
                this.n11 = h * m;
                this.n12 = t - n * g;
                this.n13 = p * g + o;
                this.n21 = g;
                this.n22 = k * m;
                this.n23 = -e * m;
                this.n31 = -f * m;
                this.n32 = o * g + p;
                this.n33 = n - t * g;
                break;
            case "XZY":
                n = k * h;
                o = k * f;
                p = e * h;
                t = e * f;
                this.n11 = h * m;
                this.n12 = -g;
                this.n13 = f * m;
                this.n21 = n * g + t;
                this.n22 = k * m;
                this.n23 = o * g - p;
                this.n31 = p * g - o;
                this.n32 = e * m;
                this.n33 = t * g + n;
                break;
            default:
                n = k * m, o = k * g, p = e * m, t = e * g, this.n11 = h * m, this.n12 = -h * g, this.n13 = f, this.n21 = o + p * f, this.n22 = n - t * f, this.n23 = -e * h, this.n31 = t - n * f, this.n32 = p + o * f, this.n33 = k * h
        }
        return this
    },
    setRotationFromQuaternion: function (b) {
        var c = b.x,
            e = b.y,
            f = b.z,
            g = b.w,
            k = c + c,
            h = e + e,
            m = f + f,
            b = c * k,
            n = c * h;
        c *= m;
        var o = e * h;
        e *= m;
        f *= m;
        k *= g;
        h *= g;
        g *= m;
        this.n11 = 1 - (o + f);
        this.n12 = n - g;
        this.n13 = c + h;
        this.n21 = n + g;
        this.n22 = 1 - (b + f);
        this.n23 = e - k;
        this.n31 = c - h;
        this.n32 = e + k;
        this.n33 = 1 - (b + o);
        return this
    },
    scale: function (b) {
        var c = b.x,
            e = b.y,
            b = b.z;
        this.n11 *= c;
        this.n12 *= e;
        this.n13 *= b;
        this.n21 *= c;
        this.n22 *= e;
        this.n23 *= b;
        this.n31 *= c;
        this.n32 *= e;
        this.n33 *= b;
        this.n41 *= c;
        this.n42 *= e;
        this.n43 *= b;
        return this
    },
    extractPosition: function (b) {
        this.n14 = b.n14;
        this.n24 = b.n24;
        this.n34 = b.n34
    },
    extractRotation: function (b, c) {
        var e = 1 / c.x,
            f = 1 / c.y,
            g = 1 / c.z;
        this.n11 = b.n11 * e;
        this.n21 = b.n21 * e;
        this.n31 = b.n31 * e;
        this.n12 = b.n12 * f;
        this.n22 = b.n22 * f;
        this.n32 = b.n32 * f;
        this.n13 = b.n13 * g;
        this.n23 = b.n23 * g;
        this.n33 = b.n33 * g
    }
};
THREE.Matrix4.makeInvert = function (b, c) {
    var e = b.n11,
        f = b.n12,
        g = b.n13,
        k = b.n14,
        h = b.n21,
        m = b.n22,
        n = b.n23,
        o = b.n24,
        p = b.n31,
        t = b.n32,
        v = b.n33,
        u = b.n34,
        w = b.n41,
        B = b.n42,
        A = b.n43,
        y = b.n44;
    c === void 0 && (c = new THREE.Matrix4);
    c.n11 = n * u * B - o * v * B + o * t * A - m * u * A - n * t * y + m * v * y;
    c.n12 = k * v * B - g * u * B - k * t * A + f * u * A + g * t * y - f * v * y;
    c.n13 = g * o * B - k * n * B + k * m * A - f * o * A - g * m * y + f * n * y;
    c.n14 = k * n * t - g * o * t - k * m * v + f * o * v + g * m * u - f * n * u;
    c.n21 = o * v * w - n * u * w - o * p * A + h * u * A + n * p * y - h * v * y;
    c.n22 = g * u * w - k * v * w + k * p * A - e * u * A - g * p * y + e * v * y;
    c.n23 = k * n * w - g * o * w - k * h * A + e * o * A + g * h * y - e * n * y;
    c.n24 = g * o * p - k * n * p + k * h * v - e * o * v - g * h * u + e * n * u;
    c.n31 = m * u * w - o * t * w + o * p * B - h * u * B - m * p * y + h * t * y;
    c.n32 = k * t * w - f * u * w - k * p * B + e * u * B + f * p * y - e * t * y;
    c.n33 = g * o * w - k * m * w + k * h * B - e * o * B - f * h * y + e * m * y;
    c.n34 = k * m * p - f * o * p - k * h * t + e * o * t + f * h * u - e * m * u;
    c.n41 = n * t * w - m * v * w - n * p * B + h * v * B + m * p * A - h * t * A;
    c.n42 = f * v * w - g * t * w + g * p * B - e * v * B - f * p * A + e * t * A;
    c.n43 = g * m * w - f * n * w - g * h * B + e * n * B + f * h * A - e * m * A;
    c.n44 = f * n * p - g * m * p + g * h * t - e * n * t - f * h * v + e * m * v;
    c.multiplyScalar(1 / b.determinant());
    return c
};
THREE.Matrix4.makeInvert3x3 = function (b) {
    var c = b.m33,
        e = c.m,
        f = b.n33 * b.n22 - b.n32 * b.n23,
        g = -b.n33 * b.n21 + b.n31 * b.n23,
        k = b.n32 * b.n21 - b.n31 * b.n22,
        h = -b.n33 * b.n12 + b.n32 * b.n13,
        m = b.n33 * b.n11 - b.n31 * b.n13,
        n = -b.n32 * b.n11 + b.n31 * b.n12,
        o = b.n23 * b.n12 - b.n22 * b.n13,
        p = -b.n23 * b.n11 + b.n21 * b.n13,
        t = b.n22 * b.n11 - b.n21 * b.n12,
        b = b.n11 * f + b.n21 * h + b.n31 * o;
    b == 0 && console.error("THREE.Matrix4.makeInvert3x3: Matrix not invertible.");
    b = 1 / b;
    e[0] = b * f;
    e[1] = b * g;
    e[2] = b * k;
    e[3] = b * h;
    e[4] = b * m;
    e[5] = b * n;
    e[6] = b * o;
    e[7] = b * p;
    e[8] = b * t;
    return c
};
THREE.Matrix4.makeFrustum = function (b, c, e, f, g, k) {
    var h;
    h = new THREE.Matrix4;
    h.n11 = 2 * g / (c - b);
    h.n12 = 0;
    h.n13 = (c + b) / (c - b);
    h.n14 = 0;
    h.n21 = 0;
    h.n22 = 2 * g / (f - e);
    h.n23 = (f + e) / (f - e);
    h.n24 = 0;
    h.n31 = 0;
    h.n32 = 0;
    h.n33 = -(k + g) / (k - g);
    h.n34 = -2 * k * g / (k - g);
    h.n41 = 0;
    h.n42 = 0;
    h.n43 = -1;
    h.n44 = 0;
    return h
};
THREE.Matrix4.makePerspective = function (b, c, e, f) {
    var g, b = e * Math.tan(b * Math.PI / 360);
    g = -b;
    return THREE.Matrix4.makeFrustum(g * c, b * c, g, b, e, f)
};
THREE.Matrix4.makeOrtho = function (b, c, e, f, g, k) {
    var h, m, n, o;
    h = new THREE.Matrix4;
    m = c - b;
    n = e - f;
    o = k - g;
    h.n11 = 2 / m;
    h.n12 = 0;
    h.n13 = 0;
    h.n14 = -((c + b) / m);
    h.n21 = 0;
    h.n22 = 2 / n;
    h.n23 = 0;
    h.n24 = -((e + f) / n);
    h.n31 = 0;
    h.n32 = 0;
    h.n33 = -2 / o;
    h.n34 = -((k + g) / o);
    h.n41 = 0;
    h.n42 = 0;
    h.n43 = 0;
    h.n44 = 1;
    return h
};
THREE.Matrix4.__v1 = new THREE.Vector3;
THREE.Matrix4.__v2 = new THREE.Vector3;
THREE.Matrix4.__v3 = new THREE.Vector3;
THREE.Object3D = function () {
    this.parent = void 0;
    this.children = [];
    this.up = new THREE.Vector3(0, 1, 0);
    this.position = new THREE.Vector3;
    this.rotation = new THREE.Vector3;
    this.eulerOrder = "XYZ";
    this.scale = new THREE.Vector3(1, 1, 1);
    this.flipSided = this.doubleSided = this.dynamic = !1;
    this.renderDepth = null;
    this.rotationAutoUpdate = !0;
    this.matrix = new THREE.Matrix4;
    this.matrixWorld = new THREE.Matrix4;
    this.matrixRotationWorld = new THREE.Matrix4;
    this.matrixWorldNeedsUpdate = this.matrixAutoUpdate = !0;
    this.quaternion = new THREE.Quaternion;
    this.useQuaternion = !1;
    this.boundRadius = 0;
    this.boundRadiusScale = 1;
    this.visible = !0;
    this._vector = new THREE.Vector3;
    this.name = ""
};
THREE.Object3D.prototype = {
    translate: function (b, c) {
        this.matrix.rotateAxis(c);
        this.position.addSelf(c.multiplyScalar(b))
    },
    translateX: function (b) {
        this.translate(b, this._vector.set(1, 0, 0))
    },
    translateY: function (b) {
        this.translate(b, this._vector.set(0, 1, 0))
    },
    translateZ: function (b) {
        this.translate(b, this._vector.set(0, 0, 1))
    },
    lookAt: function (b) {
        this.matrix.lookAt(b, this.position, this.up);
        this.rotationAutoUpdate && this.rotation.setRotationFromMatrix(this.matrix)
    },
    addChild: function (b) {
        if (this.children.indexOf(b) === -1) {
            b.parent !== void 0 && b.parent.removeChild(b);
            b.parent = this;
            this.children.push(b);
            for (var c = this; c.parent !== void 0;) c = c.parent;
            c !== void 0 && c instanceof THREE.Scene && c.addChildRecurse(b)
        }
    },
    removeChild: function (b) {
        var c = this.children.indexOf(b);
        if (c !== -1) b.parent = void 0, this.children.splice(c, 1)
    },
    getChildByName: function (b, c) {
        var e, f, g;
        e = 0;
        for (f = this.children.length; e < f; e++) {
            g = this.children[e];
            if (g.name === b) return g;
            if (c && (g = g.getChildByName(b, c), g !== void 0)) return g
        }
    },
    updateMatrix: function () {
        this.matrix.setPosition(this.position);
        this.useQuaternion ? this.matrix.setRotationFromQuaternion(this.quaternion) : this.matrix.setRotationFromEuler(this.rotation, this.eulerOrder);
        if (this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1) this.matrix.scale(this.scale), this.boundRadiusScale = Math.max(this.scale.x, Math.max(this.scale.y, this.scale.z));
        this.matrixWorldNeedsUpdate = !0
    },
    update: function (b, c, e) {
        this.matrixAutoUpdate && this.updateMatrix();
        if (this.matrixWorldNeedsUpdate || c) b ? this.matrixWorld.multiply(b, this.matrix) : this.matrixWorld.copy(this.matrix),
        this.matrixRotationWorld.extractRotation(this.matrixWorld, this.scale), this.matrixWorldNeedsUpdate = !1, c = !0;
        for (var b = 0, f = this.children.length; b < f; b++) this.children[b].update(this.matrixWorld, c, e)
    }
};
THREE.Quaternion = function (b, c, e, f) {
    this.set(b || 0, c || 0, e || 0, f !== void 0 ? f : 1)
};
THREE.Quaternion.prototype = {
    set: function (b, c, e, f) {
        this.x = b;
        this.y = c;
        this.z = e;
        this.w = f;
        return this
    },
    copy: function (b) {
        this.x = b.x;
        this.y = b.y;
        this.z = b.z;
        this.w = b.w;
        return this
    },
    setFromEuler: function (b) {
        var c = 0.5 * Math.PI / 360,
            e = b.x * c,
            f = b.y * c,
            g = b.z * c,
            b = Math.cos(f),
            f = Math.sin(f),
            c = Math.cos(-g),
            g = Math.sin(-g),
            k = Math.cos(e),
            e = Math.sin(e),
            h = b * c,
            m = f * g;
        this.w = h * k - m * e;
        this.x = h * e + m * k;
        this.y = f * c * k + b * g * e;
        this.z = b * g * k - f * c * e;
        return this
    },
    setFromAxisAngle: function (b, c) {
        var e = c / 2,
            f = Math.sin(e);
        this.x = b.x * f;
        this.y = b.y * f;
        this.z = b.z * f;
        this.w = Math.cos(e);
        return this
    },
    calculateW: function () {
        this.w = -Math.sqrt(Math.abs(1 - this.x * this.x - this.y * this.y - this.z * this.z));
        return this
    },
    inverse: function () {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    },
    normalize: function () {
        var b = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        b == 0 ? this.w = this.z = this.y = this.x = 0 : (b = 1 / b, this.x *= b, this.y *= b, this.z *= b, this.w *= b);
        return this
    },
    multiplySelf: function (b) {
        var c = this.x,
            e = this.y,
            f = this.z,
            g = this.w,
            k = b.x,
            h = b.y,
            m = b.z,
            b = b.w;
        this.x = c * b + g * k + e * m - f * h;
        this.y = e * b + g * h + f * k - c * m;
        this.z = f * b + g * m + c * h - e * k;
        this.w = g * b - c * k - e * h - f * m;
        return this
    },
    multiply: function (b, c) {
        this.x = b.x * c.w + b.y * c.z - b.z * c.y + b.w * c.x;
        this.y = -b.x * c.z + b.y * c.w + b.z * c.x + b.w * c.y;
        this.z = b.x * c.y - b.y * c.x + b.z * c.w + b.w * c.z;
        this.w = -b.x * c.x - b.y * c.y - b.z * c.z + b.w * c.w;
        return this
    },
    multiplyVector3: function (b, c) {
        c || (c = b);
        var e = b.x,
            f = b.y,
            g = b.z,
            k = this.x,
            h = this.y,
            m = this.z,
            n = this.w,
            o = n * e + h * g - m * f,
            p = n * f + m * e - k * g,
            t = n * g + k * f - h * e,
            e = -k * e - h * f - m * g;
        c.x = o * n + e * -k + p * -m - t * -h;
        c.y = p * n + e * -h + t * -k - o * -m;
        c.z = t * n + e * -m + o * -h - p * -k;
        return c
    }
};
THREE.Quaternion.slerp = function (b, c, e, f) {
    var g = b.w * c.w + b.x * c.x + b.y * c.y + b.z * c.z;
    if (Math.abs(g) >= 1) return e.w = b.w, e.x = b.x, e.y = b.y, e.z = b.z, e;
    var k = Math.acos(g),
        h = Math.sqrt(1 - g * g);
    if (Math.abs(h) < 0.001) return e.w = 0.5 * (b.w + c.w), e.x = 0.5 * (b.x + c.x), e.y = 0.5 * (b.y + c.y), e.z = 0.5 * (b.z + c.z), e;
    g = Math.sin((1 - f) * k) / h;
    f = Math.sin(f * k) / h;
    e.w = b.w * g + c.w * f;
    e.x = b.x * g + c.x * f;
    e.y = b.y * g + c.y * f;
    e.z = b.z * g + c.z * f;
    return e
};
THREE.Vertex = function (b) {
    this.position = b || new THREE.Vector3
};
THREE.Face3 = function (b, c, e, f, g, k) {
    this.a = b;
    this.b = c;
    this.c = e;
    this.normal = f instanceof THREE.Vector3 ? f : new THREE.Vector3;
    this.vertexNormals = f instanceof Array ? f : [];
    this.color = g instanceof THREE.Color ? g : new THREE.Color;
    this.vertexColors = g instanceof Array ? g : [];
    this.vertexTangents = [];
    this.materials = k instanceof Array ? k : [k];
    this.centroid = new THREE.Vector3
};
THREE.Face4 = function (b, c, e, f, g, k, h) {
    this.a = b;
    this.b = c;
    this.c = e;
    this.d = f;
    this.normal = g instanceof THREE.Vector3 ? g : new THREE.Vector3;
    this.vertexNormals = g instanceof Array ? g : [];
    this.color = k instanceof THREE.Color ? k : new THREE.Color;
    this.vertexColors = k instanceof Array ? k : [];
    this.vertexTangents = [];
    this.materials = h instanceof Array ? h : [h];
    this.centroid = new THREE.Vector3
};
THREE.UV = function (b, c) {
    this.set(b || 0, c || 0)
};
THREE.UV.prototype = {
    set: function (b, c) {
        this.u = b;
        this.v = c;
        return this
    },
    copy: function (b) {
        this.set(b.u, b.v);
        return this
    }
};
THREE.Geometry = function () {
    this.id = "Geometry" + THREE.GeometryIdCounter++;
    this.vertices = [];
    this.colors = [];
    this.faces = [];
    this.edges = [];
    this.faceUvs = [
        []
    ];
    this.faceVertexUvs = [
        []
    ];
    this.morphTargets = [];
    this.morphColors = [];
    this.skinWeights = [];
    this.skinIndices = [];
    this.boundingSphere = this.boundingBox = null;
    this.hasTangents = !1
};
THREE.Geometry.prototype = {
    computeCentroids: function () {
        var b, c, e;
        b = 0;
        for (c = this.faces.length; b < c; b++) e = this.faces[b], e.centroid.set(0, 0, 0), e instanceof THREE.Face3 ? (e.centroid.addSelf(this.vertices[e.a].position), e.centroid.addSelf(this.vertices[e.b].position), e.centroid.addSelf(this.vertices[e.c].position), e.centroid.divideScalar(3)) : e instanceof THREE.Face4 && (e.centroid.addSelf(this.vertices[e.a].position), e.centroid.addSelf(this.vertices[e.b].position), e.centroid.addSelf(this.vertices[e.c].position),
        e.centroid.addSelf(this.vertices[e.d].position), e.centroid.divideScalar(4))
    },
    computeFaceNormals: function (b) {
        var c, e, f, g, k, h, m = new THREE.Vector3,
            n = new THREE.Vector3;
        f = 0;
        for (g = this.faces.length; f < g; f++) {
            k = this.faces[f];
            if (b && k.vertexNormals.length) {
                m.set(0, 0, 0);
                c = 0;
                for (e = k.vertexNormals.length; c < e; c++) m.addSelf(k.vertexNormals[c]);
                m.divideScalar(3)
            } else c = this.vertices[k.a], e = this.vertices[k.b], h = this.vertices[k.c], m.sub(h.position, e.position), n.sub(c.position, e.position), m.crossSelf(n);
            m.isZero() || m.normalize();
            k.normal.copy(m)
        }
    },
    computeVertexNormals: function () {
        var b, c, e, f;
        if (this.__tmpVertices == void 0) {
            f = this.__tmpVertices = Array(this.vertices.length);
            b = 0;
            for (c = this.vertices.length; b < c; b++) f[b] = new THREE.Vector3;
            b = 0;
            for (c = this.faces.length; b < c; b++) if (e = this.faces[b], e instanceof THREE.Face3) e.vertexNormals = [new THREE.Vector3, new THREE.Vector3, new THREE.Vector3];
            else if (e instanceof THREE.Face4) e.vertexNormals = [new THREE.Vector3, new THREE.Vector3, new THREE.Vector3, new THREE.Vector3]
        } else {
            f = this.__tmpVertices;
            b = 0;
            for (c = this.vertices.length; b < c; b++) f[b].set(0, 0, 0)
        }
        b = 0;
        for (c = this.faces.length; b < c; b++) e = this.faces[b], e instanceof THREE.Face3 ? (f[e.a].addSelf(e.normal), f[e.b].addSelf(e.normal), f[e.c].addSelf(e.normal)) : e instanceof THREE.Face4 && (f[e.a].addSelf(e.normal), f[e.b].addSelf(e.normal), f[e.c].addSelf(e.normal), f[e.d].addSelf(e.normal));
        b = 0;
        for (c = this.vertices.length; b < c; b++) f[b].normalize();
        b = 0;
        for (c = this.faces.length; b < c; b++) e = this.faces[b], e instanceof THREE.Face3 ? (e.vertexNormals[0].copy(f[e.a]),
        e.vertexNormals[1].copy(f[e.b]), e.vertexNormals[2].copy(f[e.c])) : e instanceof THREE.Face4 && (e.vertexNormals[0].copy(f[e.a]), e.vertexNormals[1].copy(f[e.b]), e.vertexNormals[2].copy(f[e.c]), e.vertexNormals[3].copy(f[e.d]))
    },
    computeTangents: function () {
        function b(b, e, c, j, f, g, k) {
            m = b.vertices[e].position;
            n = b.vertices[c].position;
            o = b.vertices[j].position;
            p = h[f];
            t = h[g];
            v = h[k];
            u = n.x - m.x;
            w = o.x - m.x;
            B = n.y - m.y;
            A = o.y - m.y;
            y = n.z - m.z;
            G = o.z - m.z;
            z = t.u - p.u;
            C = v.u - p.u;
            H = t.v - p.v;
            D = v.v - p.v;
            Q = 1 / (z * D - C * H);
            S.set((D * u - H * w) * Q, (D * B - H * A) * Q, (D * y - H * G) * Q);
            K.set((z * w - C * u) * Q, (z * A - C * B) * Q, (z * G - C * y) * Q);
            F[e].addSelf(S);
            F[c].addSelf(S);
            F[j].addSelf(S);
            I[e].addSelf(K);
            I[c].addSelf(K);
            I[j].addSelf(K)
        }
        var c, e, f, g, k, h, m, n, o, p, t, v, u, w, B, A, y, G, z, C, H, D, Q, J, F = [],
            I = [],
            S = new THREE.Vector3,
            K = new THREE.Vector3,
            ea = new THREE.Vector3,
            j = new THREE.Vector3,
            ca = new THREE.Vector3;
        c = 0;
        for (e = this.vertices.length; c < e; c++) F[c] = new THREE.Vector3, I[c] = new THREE.Vector3;
        c = 0;
        for (e = this.faces.length; c < e; c++) k = this.faces[c], h = this.faceVertexUvs[0][c], k instanceof
        THREE.Face3 ? b(this, k.a, k.b, k.c, 0, 1, 2) : k instanceof THREE.Face4 && (b(this, k.a, k.b, k.c, 0, 1, 2), b(this, k.a, k.b, k.d, 0, 1, 3));
        var T = ["a", "b", "c", "d"];
        c = 0;
        for (e = this.faces.length; c < e; c++) {
            k = this.faces[c];
            for (f = 0; f < k.vertexNormals.length; f++) ca.copy(k.vertexNormals[f]), g = k[T[f]], J = F[g], ea.copy(J), ea.subSelf(ca.multiplyScalar(ca.dot(J))).normalize(), j.cross(k.vertexNormals[f], J), g = j.dot(I[g]), g = g < 0 ? -1 : 1, k.vertexTangents[f] = new THREE.Vector4(ea.x, ea.y, ea.z, g)
        }
        this.hasTangents = !0
    },
    computeBoundingBox: function () {
        var b;
        if (this.vertices.length > 0) {
            this.boundingBox = {
                x: [this.vertices[0].position.x, this.vertices[0].position.x],
                y: [this.vertices[0].position.y, this.vertices[0].position.y],
                z: [this.vertices[0].position.z, this.vertices[0].position.z]
            };
            for (var c = 1, e = this.vertices.length; c < e; c++) {
                b = this.vertices[c];
                if (b.position.x < this.boundingBox.x[0]) this.boundingBox.x[0] = b.position.x;
                else if (b.position.x > this.boundingBox.x[1]) this.boundingBox.x[1] = b.position.x;
                if (b.position.y < this.boundingBox.y[0]) this.boundingBox.y[0] = b.position.y;
                else if (b.position.y > this.boundingBox.y[1]) this.boundingBox.y[1] = b.position.y;
                if (b.position.z < this.boundingBox.z[0]) this.boundingBox.z[0] = b.position.z;
                else if (b.position.z > this.boundingBox.z[1]) this.boundingBox.z[1] = b.position.z
            }
        }
    },
    computeBoundingSphere: function () {
        for (var b = 0, c = 0, e = this.vertices.length; c < e; c++) b = Math.max(b, this.vertices[c].position.length());
        this.boundingSphere = {
            radius: b
        }
    },
    computeEdgeFaces: function () {
        function b(b, e) {
            return Math.min(b, e) + "_" + Math.max(b, e)
        }
        function c(b, e, c) {
            b[e] === void 0 ? (b[e] = {
                set: {},
                array: []
            }, b[e].set[c] = 1, b[e].array.push(c)) : b[e].set[c] === void 0 && (b[e].set[c] = 1, b[e].array.push(c))
        }
        var e, f, g, k, h, m = {};
        e = 0;
        for (f = this.faces.length; e < f; e++) h = this.faces[e], h instanceof THREE.Face3 ? (g = b(h.a, h.b), c(m, g, e), g = b(h.b, h.c), c(m, g, e), g = b(h.a, h.c), c(m, g, e)) : h instanceof THREE.Face4 && (g = b(h.b, h.d), c(m, g, e), g = b(h.a, h.b), c(m, g, e), g = b(h.a, h.d), c(m, g, e), g = b(h.b, h.c), c(m, g, e), g = b(h.c, h.d), c(m, g, e));
        e = 0;
        for (f = this.edges.length; e < f; e++) {
            h = this.edges[e];
            g = h.vertexIndices[0];
            k = h.vertexIndices[1];
            h.faceIndices = m[b(g, k)].array;
            for (g = 0; g < h.faceIndices.length; g++) k = h.faceIndices[g], h.faces.push(this.faces[k])
        }
    }
};
THREE.GeometryIdCounter = 0;
THREE.Spline = function (b) {
    function c(b, e, c, f, g, h, k) {
        b = (c - b) * 0.5;
        f = (f - e) * 0.5;
        return (2 * (e - c) + b + f) * k + (-3 * (e - c) - 2 * b - f) * h + b * g + e
    }
    this.points = b;
    var e = [],
        f = {
            x: 0,
            y: 0,
            z: 0
        }, g, k, h, m, n, o, p, t, v;
    this.initFromArray = function (b) {
        this.points = [];
        for (var e = 0; e < b.length; e++) this.points[e] = {
            x: b[e][0],
            y: b[e][1],
            z: b[e][2]
        }
    };
    this.getPoint = function (b) {
        g = (this.points.length - 1) * b;
        k = Math.floor(g);
        h = g - k;
        e[0] = k == 0 ? k : k - 1;
        e[1] = k;
        e[2] = k > this.points.length - 2 ? k : k + 1;
        e[3] = k > this.points.length - 3 ? k : k + 2;
        o = this.points[e[0]];
        p = this.points[e[1]];
        t = this.points[e[2]];
        v = this.points[e[3]];
        m = h * h;
        n = h * m;
        f.x = c(o.x, p.x, t.x, v.x, h, m, n);
        f.y = c(o.y, p.y, t.y, v.y, h, m, n);
        f.z = c(o.z, p.z, t.z, v.z, h, m, n);
        return f
    };
    this.getControlPointsArray = function () {
        var b, e, c = this.points.length,
            f = [];
        for (b = 0; b < c; b++) e = this.points[b], f[b] = [e.x, e.y, e.z];
        return f
    };
    this.getLength = function (b) {
        var e, c, f = e = e = 0,
            g = new THREE.Vector3,
            h = new THREE.Vector3,
            k = [],
            m = 0;
        k[0] = 0;
        b || (b = 100);
        c = this.points.length * b;
        g.copy(this.points[0]);
        for (b = 1; b < c; b++) e = b / c, position = this.getPoint(e), h.copy(position),
        m += h.distanceTo(g), g.copy(position), e *= this.points.length - 1, e = Math.floor(e), e != f && (k[e] = m, f = e);
        k[k.length] = m;
        return {
            chunks: k,
            total: m
        }
    };
    this.reparametrizeByArcLength = function (b) {
        var e, c, f, g, h, k, m = [],
            n = new THREE.Vector3,
            o = this.getLength();
        m.push(n.copy(this.points[0]).clone());
        for (e = 1; e < this.points.length; e++) {
            c = o.chunks[e] - o.chunks[e - 1];
            k = Math.ceil(b * c / o.total);
            g = (e - 1) / (this.points.length - 1);
            h = e / (this.points.length - 1);
            for (c = 1; c < k - 1; c++) f = g + c * (1 / k) * (h - g), position = this.getPoint(f), m.push(n.copy(position).clone());
            m.push(n.copy(this.points[e]).clone())
        }
        this.points = m
    }
};
THREE.Edge = function (b, c, e, f) {
    this.vertices = [b, c];
    this.vertexIndices = [e, f];
    this.faces = [];
    this.faceIndices = []
};
THREE.Camera = function (b, c, e, f, g) {
    THREE.Object3D.call(this);
    this.fov = b || 50;
    this.aspect = c || 1;
    this.near = e || 0.1;
    this.far = f || 2E3;
    this.target = g || new THREE.Object3D;
    this.useTarget = !0;
    this.matrixWorldInverse = new THREE.Matrix4;
    this.projectionMatrix = null;
    this.updateProjectionMatrix()
};
THREE.Camera.prototype = new THREE.Object3D;
THREE.Camera.prototype.constructor = THREE.Camera;
THREE.Camera.prototype.supr = THREE.Object3D.prototype;
THREE.Camera.prototype.translate = function (b, c) {
    this.matrix.rotateAxis(c);
    c.multiplyScalar(b);
    this.position.addSelf(c);
    this.target.position.addSelf(c)
};
THREE.Camera.prototype.updateProjectionMatrix = function () {
    if (this.fullWidth) {
        var b = this.fullWidth / this.fullHeight,
            c = Math.tan(this.fov * Math.PI / 360) * this.near,
            e = -c,
            f = b * e,
            b = Math.abs(b * c - f),
            e = Math.abs(c - e);
        this.projectionMatrix = THREE.Matrix4.makeFrustum(f + this.x * b / this.fullWidth, f + (this.x + this.width) * b / this.fullWidth, c - (this.y + this.height) * e / this.fullHeight, c - this.y * e / this.fullHeight, this.near, this.far)
    } else this.projectionMatrix = THREE.Matrix4.makePerspective(this.fov, this.aspect, this.near, this.far)
};
THREE.Camera.prototype.setViewOffset = function (b, c, e, f, g, k) {
    this.fullWidth = b;
    this.fullHeight = c;
    this.x = e;
    this.y = f;
    this.width = g;
    this.height = k;
    this.updateProjectionMatrix()
};
THREE.Camera.prototype.update = function (b, c, e) {
    if (this.useTarget) this.matrix.lookAt(this.position, this.target.position, this.up), this.matrix.setPosition(this.position), b ? this.matrixWorld.multiply(b, this.matrix) : this.matrixWorld.copy(this.matrix), THREE.Matrix4.makeInvert(this.matrixWorld, this.matrixWorldInverse), c = !0;
    else if (this.matrixAutoUpdate && this.updateMatrix(), c || this.matrixWorldNeedsUpdate) b ? this.matrixWorld.multiply(b, this.matrix) : this.matrixWorld.copy(this.matrix), this.matrixWorldNeedsUpdate = !1, c = !0, THREE.Matrix4.makeInvert(this.matrixWorld, this.matrixWorldInverse);
    for (b = 0; b < this.children.length; b++) this.children[b].update(this.matrixWorld, c, e)
};
THREE.Light = function (b) {
    THREE.Object3D.call(this);
    this.color = new THREE.Color(b)
};
THREE.Light.prototype = new THREE.Object3D;
THREE.Light.prototype.constructor = THREE.Light;
THREE.Light.prototype.supr = THREE.Object3D.prototype;
THREE.AmbientLight = function (b) {
    THREE.Light.call(this, b)
};
THREE.AmbientLight.prototype = new THREE.Light;
THREE.AmbientLight.prototype.constructor = THREE.AmbientLight;
THREE.DirectionalLight = function (b, c, e, f) {
    THREE.Light.call(this, b);
    this.position = new THREE.Vector3(0, 1, 0);
    this.intensity = c || 1;
    this.distance = e || 0;
    this.castShadow = f !== void 0 ? f : !1
};
THREE.DirectionalLight.prototype = new THREE.Light;
THREE.DirectionalLight.prototype.constructor = THREE.DirectionalLight;
THREE.PointLight = function (b, c, e) {
    THREE.Light.call(this, b);
    this.position = new THREE.Vector3;
    this.intensity = c || 1;
    this.distance = e || 0
};
THREE.PointLight.prototype = new THREE.Light;
THREE.PointLight.prototype.constructor = THREE.PointLight;
THREE.LensFlare = function (b, c, e, f) {
    THREE.Object3D.call(this);
    this.positionScreen = new THREE.Vector3;
    this.lensFlares = [];
    this.customUpdateCallback = void 0;
    b !== void 0 && this.add(b, c, e, f)
};
THREE.LensFlare.prototype = new THREE.Object3D;
THREE.LensFlare.prototype.constructor = THREE.LensFlare;
THREE.LensFlare.prototype.supr = THREE.Object3D.prototype;
THREE.LensFlare.prototype.add = function (b, c, e, f) {
    c === void 0 && (c = -1);
    e === void 0 && (e = 0);
    if (f === void 0) f = THREE.BillboardBlending;
    e = Math.min(e, Math.max(0, e));
    this.lensFlares.push({
        texture: b,
        size: c,
        distance: e,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotation: 1,
        opacity: 1,
        blending: f
    })
};
THREE.LensFlare.prototype.updateLensFlares = function () {
    var b, c = this.lensFlares.length,
        e, f = -this.positionScreen.x * 2,
        g = -this.positionScreen.y * 2;
    for (b = 0; b < c; b++) e = this.lensFlares[b], e.x = this.positionScreen.x + f * e.distance, e.y = this.positionScreen.y + g * e.distance, e.wantedRotation = e.x * Math.PI * 0.25, e.rotation += (e.wantedRotation - e.rotation) * 0.25
};
THREE.Material = function (b) {
    this.id = THREE.MaterialCounter.value++;
    b = b || {};
    this.opacity = b.opacity !== void 0 ? b.opacity : 1;
    this.transparent = b.transparent !== void 0 ? b.transparent : !1;
    this.blending = b.blending !== void 0 ? b.blending : THREE.NormalBlending;
    this.depthTest = b.depthTest !== void 0 ? b.depthTest : !0;
    this.polygonOffset = b.polygonOffset !== void 0 ? b.polygonOffset : !1;
    this.polygonOffsetFactor = b.polygonOffsetFactor !== void 0 ? b.polygonOffsetFactor : 0;
    this.polygonOffsetUnits = b.polygonOffsetUnits !== void 0 ? b.polygonOffsetUnits : 0
};
THREE.NoShading = 0;
THREE.FlatShading = 1;
THREE.SmoothShading = 2;
THREE.NoColors = 0;
THREE.FaceColors = 1;
THREE.VertexColors = 2;
THREE.NormalBlending = 0;
THREE.AdditiveBlending = 1;
THREE.SubtractiveBlending = 2;
THREE.MultiplyBlending = 3;
THREE.AdditiveAlphaBlending = 4;
THREE.MaterialCounter = {
    value: 0
};
THREE.CubeReflectionMapping = function () {};
THREE.CubeRefractionMapping = function () {};
THREE.LatitudeReflectionMapping = function () {};
THREE.LatitudeRefractionMapping = function () {};
THREE.SphericalReflectionMapping = function () {};
THREE.SphericalRefractionMapping = function () {};
THREE.UVMapping = function () {};
THREE.LineBasicMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.color = b.color !== void 0 ? new THREE.Color(b.color) : new THREE.Color(16777215);
    this.linewidth = b.linewidth !== void 0 ? b.linewidth : 1;
    this.linecap = b.linecap !== void 0 ? b.linecap : "round";
    this.linejoin = b.linejoin !== void 0 ? b.linejoin : "round";
    this.vertexColors = b.vertexColors ? b.vertexColors : !1
};
THREE.LineBasicMaterial.prototype = new THREE.Material;
THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial;
THREE.MeshBasicMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.color = b.color !== void 0 ? new THREE.Color(b.color) : new THREE.Color(16777215);
    this.map = b.map !== void 0 ? b.map : null;
    this.lightMap = b.lightMap !== void 0 ? b.lightMap : null;
    this.envMap = b.envMap !== void 0 ? b.envMap : null;
    this.combine = b.combine !== void 0 ? b.combine : THREE.MultiplyOperation;
    this.reflectivity = b.reflectivity !== void 0 ? b.reflectivity : 1;
    this.refractionRatio = b.refractionRatio !== void 0 ? b.refractionRatio : 0.98;
    this.shading = b.shading !== void 0 ? b.shading : THREE.SmoothShading;
    this.wireframe = b.wireframe !== void 0 ? b.wireframe : !1;
    this.wireframeLinewidth = b.wireframeLinewidth !== void 0 ? b.wireframeLinewidth : 1;
    this.wireframeLinecap = b.wireframeLinecap !== void 0 ? b.wireframeLinecap : "round";
    this.wireframeLinejoin = b.wireframeLinejoin !== void 0 ? b.wireframeLinejoin : "round";
    this.vertexColors = b.vertexColors !== void 0 ? b.vertexColors : !1;
    this.skinning = b.skinning !== void 0 ? b.skinning : !1;
    this.morphTargets = b.morphTargets !== void 0 ? b.morphTargets : !1
};
THREE.MeshBasicMaterial.prototype = new THREE.Material;
THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial;
THREE.MeshLambertMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.color = b.color !== void 0 ? new THREE.Color(b.color) : new THREE.Color(16777215);
    this.map = b.map !== void 0 ? b.map : null;
    this.lightMap = b.lightMap !== void 0 ? b.lightMap : null;
    this.envMap = b.envMap !== void 0 ? b.envMap : null;
    this.combine = b.combine !== void 0 ? b.combine : THREE.MultiplyOperation;
    this.reflectivity = b.reflectivity !== void 0 ? b.reflectivity : 1;
    this.refractionRatio = b.refractionRatio !== void 0 ? b.refractionRatio : 0.98;
    this.shading = b.shading !== void 0 ? b.shading : THREE.SmoothShading;
    this.wireframe = b.wireframe !== void 0 ? b.wireframe : !1;
    this.wireframeLinewidth = b.wireframeLinewidth !== void 0 ? b.wireframeLinewidth : 1;
    this.wireframeLinecap = b.wireframeLinecap !== void 0 ? b.wireframeLinecap : "round";
    this.wireframeLinejoin = b.wireframeLinejoin !== void 0 ? b.wireframeLinejoin : "round";
    this.vertexColors = b.vertexColors !== void 0 ? b.vertexColors : !1;
    this.skinning = b.skinning !== void 0 ? b.skinning : !1;
    this.morphTargets = b.morphTargets !== void 0 ? b.morphTargets : !1
};
THREE.MeshLambertMaterial.prototype = new THREE.Material;
THREE.MeshLambertMaterial.prototype.constructor = THREE.MeshLambertMaterial;
THREE.MeshPhongMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.color = b.color !== void 0 ? new THREE.Color(b.color) : new THREE.Color(16777215);
    this.ambient = b.ambient !== void 0 ? new THREE.Color(b.ambient) : new THREE.Color(328965);
    this.specular = b.specular !== void 0 ? new THREE.Color(b.specular) : new THREE.Color(1118481);
    this.shininess = b.shininess !== void 0 ? b.shininess : 30;
    this.map = b.map !== void 0 ? b.map : null;
    this.lightMap = b.lightMap !== void 0 ? b.lightMap : null;
    this.envMap = b.envMap !== void 0 ? b.envMap : null;
    this.combine = b.combine !== void 0 ? b.combine : THREE.MultiplyOperation;
    this.reflectivity = b.reflectivity !== void 0 ? b.reflectivity : 1;
    this.refractionRatio = b.refractionRatio !== void 0 ? b.refractionRatio : 0.98;
    this.shading = b.shading !== void 0 ? b.shading : THREE.SmoothShading;
    this.wireframe = b.wireframe !== void 0 ? b.wireframe : !1;
    this.wireframeLinewidth = b.wireframeLinewidth !== void 0 ? b.wireframeLinewidth : 1;
    this.wireframeLinecap = b.wireframeLinecap !== void 0 ? b.wireframeLinecap : "round";
    this.wireframeLinejoin = b.wireframeLinejoin !== void 0 ? b.wireframeLinejoin : "round";
    this.vertexColors = b.vertexColors !== void 0 ? b.vertexColors : !1;
    this.skinning = b.skinning !== void 0 ? b.skinning : !1;
    this.morphTargets = b.morphTargets !== void 0 ? b.morphTargets : !1
};
THREE.MeshPhongMaterial.prototype = new THREE.Material;
THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial;
THREE.MeshDepthMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.shading = b.shading !== void 0 ? b.shading : THREE.SmoothShading;
    this.wireframe = b.wireframe !== void 0 ? b.wireframe : !1;
    this.wireframeLinewidth = b.wireframeLinewidth !== void 0 ? b.wireframeLinewidth : 1
};
THREE.MeshDepthMaterial.prototype = new THREE.Material;
THREE.MeshDepthMaterial.prototype.constructor = THREE.MeshDepthMaterial;
THREE.MeshNormalMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.shading = b.shading ? b.shading : THREE.FlatShading;
    this.wireframe = b.wireframe ? b.wireframe : !1;
    this.wireframeLinewidth = b.wireframeLinewidth ? b.wireframeLinewidth : 1
};
THREE.MeshNormalMaterial.prototype = new THREE.Material;
THREE.MeshNormalMaterial.prototype.constructor = THREE.MeshNormalMaterial;
THREE.MeshFaceMaterial = function () {};
THREE.MeshShaderMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.fragmentShader = b.fragmentShader !== void 0 ? b.fragmentShader : "void main() {}";
    this.vertexShader = b.vertexShader !== void 0 ? b.vertexShader : "void main() {}";
    this.uniforms = b.uniforms !== void 0 ? b.uniforms : {};
    this.attributes = b.attributes;
    this.shading = b.shading !== void 0 ? b.shading : THREE.SmoothShading;
    this.wireframe = b.wireframe !== void 0 ? b.wireframe : !1;
    this.wireframeLinewidth = b.wireframeLinewidth !== void 0 ? b.wireframeLinewidth : 1;
    this.fog = b.fog !== void 0 ? b.fog : !1;
    this.lights = b.lights !== void 0 ? b.lights : !1;
    this.vertexColors = b.vertexColors !== void 0 ? b.vertexColors : !1;
    this.skinning = b.skinning !== void 0 ? b.skinning : !1;
    this.morphTargets = b.morphTargets !== void 0 ? b.morphTargets : !1
};
THREE.MeshShaderMaterial.prototype = new THREE.Material;
THREE.MeshShaderMaterial.prototype.constructor = THREE.MeshShaderMaterial;
THREE.ShadowVolumeDynamicMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.color = b.color !== void 0 ? new THREE.Color(b.color) : new THREE.Color(16777215);
    this.map = b.map !== void 0 ? b.map : null;
    this.lightMap = b.lightMap !== void 0 ? b.lightMap : null;
    this.envMap = b.envMap !== void 0 ? b.envMap : null;
    this.combine = b.combine !== void 0 ? b.combine : THREE.MultiplyOperation;
    this.reflectivity = b.reflectivity !== void 0 ? b.reflectivity : 1;
    this.refractionRatio = b.refractionRatio !== void 0 ? b.refractionRatio : 0.98;
    this.shading = b.shading !== void 0 ? b.shading : THREE.SmoothShading;
    this.wireframe = b.wireframe !== void 0 ? b.wireframe : !1;
    this.wireframeLinewidth = b.wireframeLinewidth !== void 0 ? b.wireframeLinewidth : 1;
    this.wireframeLinecap = b.wireframeLinecap !== void 0 ? b.wireframeLinecap : "round";
    this.wireframeLinejoin = b.wireframeLinejoin !== void 0 ? b.wireframeLinejoin : "round";
    this.vertexColors = b.vertexColors !== void 0 ? b.vertexColors : !1;
    this.skinning = b.skinning !== void 0 ? b.skinning : !1;
    this.morphTargets = b.morphTargets !== void 0 ? b.morphTargets : !1
};
THREE.ShadowVolumeDynamicMaterial.prototype = new THREE.Material;
THREE.ShadowVolumeDynamicMaterial.prototype.constructor = THREE.ShadowVolumeDynamicMaterial;
THREE.ParticleBasicMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.color = b.color !== void 0 ? new THREE.Color(b.color) : new THREE.Color(16777215);
    this.map = b.map !== void 0 ? b.map : null;
    this.size = b.size !== void 0 ? b.size : 1;
    this.sizeAttenuation = b.sizeAttenuation !== void 0 ? b.sizeAttenuation : !0;
    this.vertexColors = b.vertexColors !== void 0 ? b.vertexColors : !1
};
THREE.ParticleBasicMaterial.prototype = new THREE.Material;
THREE.ParticleBasicMaterial.prototype.constructor = THREE.ParticleBasicMaterial;
THREE.ParticleCanvasMaterial = function (b) {
    THREE.Material.call(this, b);
    b = b || {};
    this.color = b.color !== void 0 ? new THREE.Color(b.color) : new THREE.Color(16777215);
    this.program = b.program !== void 0 ? b.program : function () {}
};
THREE.ParticleCanvasMaterial.prototype = new THREE.Material;
THREE.ParticleCanvasMaterial.prototype.constructor = THREE.ParticleCanvasMaterial;
THREE.ParticleDOMMaterial = function (b) {
    THREE.Material.call(this);
    this.domElement = b
};
THREE.Texture = function (b, c, e, f, g, k) {
    this.image = b;
    this.mapping = c !== void 0 ? c : new THREE.UVMapping;
    this.wrapS = e !== void 0 ? e : THREE.ClampToEdgeWrapping;
    this.wrapT = f !== void 0 ? f : THREE.ClampToEdgeWrapping;
    this.magFilter = g !== void 0 ? g : THREE.LinearFilter;
    this.minFilter = k !== void 0 ? k : THREE.LinearMipMapLinearFilter;
    this.offset = new THREE.Vector2(0, 0);
    this.repeat = new THREE.Vector2(1, 1);
    this.needsUpdate = !1
};
THREE.Texture.prototype = {
    clone: function () {
        return new THREE.Texture(this.image, this.mapping, this.wrapS, this.wrapT, this.magFilter, this.minFilter)
    }
};
THREE.MultiplyOperation = 0;
THREE.MixOperation = 1;
THREE.RepeatWrapping = 0;
THREE.ClampToEdgeWrapping = 1;
THREE.MirroredRepeatWrapping = 2;
THREE.NearestFilter = 3;
THREE.NearestMipMapNearestFilter = 4;
THREE.NearestMipMapLinearFilter = 5;
THREE.LinearFilter = 6;
THREE.LinearMipMapNearestFilter = 7;
THREE.LinearMipMapLinearFilter = 8;
THREE.ByteType = 9;
THREE.UnsignedByteType = 10;
THREE.ShortType = 11;
THREE.UnsignedShortType = 12;
THREE.IntType = 13;
THREE.UnsignedIntType = 14;
THREE.FloatType = 15;
THREE.AlphaFormat = 16;
THREE.RGBFormat = 17;
THREE.RGBAFormat = 18;
THREE.LuminanceFormat = 19;
THREE.LuminanceAlphaFormat = 20;
THREE.Particle = function (b) {
    THREE.Object3D.call(this);
    this.materials = b instanceof Array ? b : [b]
};
THREE.Particle.prototype = new THREE.Object3D;
THREE.Particle.prototype.constructor = THREE.Particle;
THREE.ParticleSystem = function (b, c) {
    THREE.Object3D.call(this);
    this.geometry = b;
    this.materials = c instanceof Array ? c : [c];
    this.sortParticles = !1
};
THREE.ParticleSystem.prototype = new THREE.Object3D;
THREE.ParticleSystem.prototype.constructor = THREE.ParticleSystem;
THREE.Line = function (b, c, e) {
    THREE.Object3D.call(this);
    this.geometry = b;
    this.materials = c instanceof Array ? c : [c];
    this.type = e != void 0 ? e : THREE.LineStrip
};
THREE.LineStrip = 0;
THREE.LinePieces = 1;
THREE.Line.prototype = new THREE.Object3D;
THREE.Line.prototype.constructor = THREE.Line;
THREE.Mesh = function (b, c) {
    THREE.Object3D.call(this);
    this.geometry = b;
    this.materials = c && c.length ? c : [c];
    this.overdraw = !1;
    if (this.geometry && (this.geometry.boundingSphere || this.geometry.computeBoundingSphere(), this.boundRadius = b.boundingSphere.radius, this.geometry.morphTargets.length)) {
        this.morphTargetBase = -1;
        this.morphTargetForcedOrder = [];
        this.morphTargetInfluences = [];
        this.morphTargetDictionary = {};
        for (var e = 0; e < this.geometry.morphTargets.length; e++) this.morphTargetInfluences.push(0), this.morphTargetDictionary[this.geometry.morphTargets[e].name] = e
    }
};
THREE.Mesh.prototype = new THREE.Object3D;
THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Mesh.prototype.supr = THREE.Object3D.prototype;
THREE.Mesh.prototype.getMorphTargetIndexByName = function (b) {
    if (this.morphTargetDictionary[b] !== void 0) return this.morphTargetDictionary[b];
    console.log("THREE.Mesh.getMorphTargetIndexByName: morph target " + b + " does not exist. Returning 0.");
    return 0
};
THREE.Bone = function (b) {
    THREE.Object3D.call(this);
    this.skin = b;
    this.skinMatrix = new THREE.Matrix4;
    this.hasNoneBoneChildren = !1
};
THREE.Bone.prototype = new THREE.Object3D;
THREE.Bone.prototype.constructor = THREE.Bone;
THREE.Bone.prototype.supr = THREE.Object3D.prototype;
THREE.Bone.prototype.update = function (b, c, e) {
    this.matrixAutoUpdate && (c |= this.updateMatrix());
    if (c || this.matrixWorldNeedsUpdate) b ? this.skinMatrix.multiply(b, this.matrix) : this.skinMatrix.copy(this.matrix), this.matrixWorldNeedsUpdate = !1, c = !0;
    var f, g = this.children.length;
    if (this.hasNoneBoneChildren) {
        this.matrixWorld.multiply(this.skin.matrixWorld, this.skinMatrix);
        for (f = 0; f < g; f++) b = this.children[f], b instanceof THREE.Bone ? b.update(this.skinMatrix, c, e) : b.update(this.matrixWorld, !0, e)
    } else for (f = 0; f < g; f++) this.children[f].update(this.skinMatrix,
    c, e)
};
THREE.Bone.prototype.addChild = function (b) {
    if (this.children.indexOf(b) === -1 && (b.parent !== void 0 && b.parent.removeChild(b), b.parent = this, this.children.push(b), !(b instanceof THREE.Bone))) this.hasNoneBoneChildren = !0
};
THREE.SkinnedMesh = function (b, c) {
    THREE.Mesh.call(this, b, c);
    this.identityMatrix = new THREE.Matrix4;
    this.bones = [];
    this.boneMatrices = [];
    var e, f, g, k, h, m;
    if (this.geometry.bones !== void 0) {
        for (e = 0; e < this.geometry.bones.length; e++) g = this.geometry.bones[e], k = g.pos, h = g.rotq, m = g.scl, f = this.addBone(), f.name = g.name, f.position.set(k[0], k[1], k[2]), f.quaternion.set(h[0], h[1], h[2], h[3]), f.useQuaternion = !0, m !== void 0 ? f.scale.set(m[0], m[1], m[2]) : f.scale.set(1, 1, 1);
        for (e = 0; e < this.bones.length; e++) g = this.geometry.bones[e],
        f = this.bones[e], g.parent === -1 ? this.addChild(f) : this.bones[g.parent].addChild(f);
        this.boneMatrices = new Float32Array(16 * this.bones.length);
        this.pose()
    }
};
THREE.SkinnedMesh.prototype = new THREE.Mesh;
THREE.SkinnedMesh.prototype.constructor = THREE.SkinnedMesh;
THREE.SkinnedMesh.prototype.update = function (b, c, e) {
    if (this.visible) {
        this.matrixAutoUpdate && (c |= this.updateMatrix());
        if (c || this.matrixWorldNeedsUpdate) b ? this.matrixWorld.multiply(b, this.matrix) : this.matrixWorld.copy(this.matrix), this.matrixWorldNeedsUpdate = !1, c = !0;
        var f, g = this.children.length;
        for (f = 0; f < g; f++) b = this.children[f], b instanceof THREE.Bone ? b.update(this.identityMatrix, !1, e) : b.update(this.matrixWorld, c, e);
        e = this.bones.length;
        ba = this.bones;
        bm = this.boneMatrices;
        for (c = 0; c < e; c++) ba[c].skinMatrix.flattenToArrayOffset(bm,
        c * 16)
    }
};
THREE.SkinnedMesh.prototype.addBone = function (b) {
    b === void 0 && (b = new THREE.Bone(this));
    this.bones.push(b);
    return b
};
THREE.SkinnedMesh.prototype.pose = function () {
    this.update(void 0, !0);
    for (var b, c = [], e = 0; e < this.bones.length; e++) b = this.bones[e], c.push(THREE.Matrix4.makeInvert(b.skinMatrix)), b.skinMatrix.flattenToArrayOffset(this.boneMatrices, e * 16);
    if (this.geometry.skinVerticesA === void 0) {
        this.geometry.skinVerticesA = [];
        this.geometry.skinVerticesB = [];
        var f;
        for (b = 0; b < this.geometry.skinIndices.length; b++) {
            var e = this.geometry.vertices[b].position,
                g = this.geometry.skinIndices[b].x,
                k = this.geometry.skinIndices[b].y;
            f = new THREE.Vector3(e.x,
            e.y, e.z);
            this.geometry.skinVerticesA.push(c[g].multiplyVector3(f));
            f = new THREE.Vector3(e.x, e.y, e.z);
            this.geometry.skinVerticesB.push(c[k].multiplyVector3(f));
            this.geometry.skinWeights[b].x + this.geometry.skinWeights[b].y !== 1 && (e = (1 - (this.geometry.skinWeights[b].x + this.geometry.skinWeights[b].y)) * 0.5, this.geometry.skinWeights[b].x += e, this.geometry.skinWeights[b].y += e)
        }
    }
};
THREE.Ribbon = function (b, c) {
    THREE.Object3D.call(this);
    this.geometry = b;
    this.materials = c instanceof Array ? c : [c]
};
THREE.Ribbon.prototype = new THREE.Object3D;
THREE.Ribbon.prototype.constructor = THREE.Ribbon;
THREE.LOD = function () {
    THREE.Object3D.call(this);
    this.LODs = []
};
THREE.LOD.prototype = new THREE.Object3D;
THREE.LOD.prototype.constructor = THREE.LOD;
THREE.LOD.prototype.supr = THREE.Object3D.prototype;
THREE.LOD.prototype.add = function (b, c) {
    c === void 0 && (c = 0);
    for (var c = Math.abs(c), e = 0; e < this.LODs.length; e++) if (c < this.LODs[e].visibleAtDistance) break;
    this.LODs.splice(e, 0, {
        visibleAtDistance: c,
        object3D: b
    });
    this.addChild(b)
};
THREE.LOD.prototype.update = function (b, c, e) {
    this.matrixAutoUpdate && (c |= this.updateMatrix());
    if (c || this.matrixWorldNeedsUpdate) b ? this.matrixWorld.multiply(b, this.matrix) : this.matrixWorld.copy(this.matrix), this.matrixWorldNeedsUpdate = !1, c = !0;
    if (this.LODs.length > 1) {
        b = e.matrixWorldInverse;
        b = -(b.n31 * this.position.x + b.n32 * this.position.y + b.n33 * this.position.z + b.n34);
        this.LODs[0].object3D.visible = !0;
        for (var f = 1; f < this.LODs.length; f++) if (b >= this.LODs[f].visibleAtDistance) this.LODs[f - 1].object3D.visible = !1,
        this.LODs[f].object3D.visible = !0;
        else break;
        for (; f < this.LODs.length; f++) this.LODs[f].object3D.visible = !1
    }
    for (b = 0; b < this.children.length; b++) this.children[b].update(this.matrixWorld, c, e)
};
THREE.ShadowVolume = function (b, c) {
    b instanceof THREE.Mesh ? (THREE.Mesh.call(this, b.geometry, c ? [new THREE.ShadowVolumeDynamicMaterial] : [new THREE.ShadowVolumeDynamicMaterial]), b.addChild(this)) : THREE.Mesh.call(this, b, c ? [new THREE.ShadowVolumeDynamicMaterial] : [new THREE.ShadowVolumeDynamicMaterial]);
    this.calculateShadowVolumeGeometry()
};
THREE.ShadowVolume.prototype = new THREE.Mesh;
THREE.ShadowVolume.prototype.constructor = THREE.ShadowVolume;
THREE.ShadowVolume.prototype.supr = THREE.Mesh.prototype;
THREE.ShadowVolume.prototype.calculateShadowVolumeGeometry = function () {
    if (this.geometry.edges && this.geometry.edges.length) {
        var b, c, e, f, g, k, h, m, n, o, p, t, v, u, w = new THREE.Geometry;
        w.vertices = this.geometry.vertices;
        f = w.faces = this.geometry.faces;
        var B = w.egdes = this.geometry.edges,
            A = w.edgeFaces = [];
        g = 0;
        var y = [];
        b = 0;
        for (c = f.length; b < c; b++) if (e = f[b], y.push(g), g += e instanceof THREE.Face3 ? 3 : 4, e.vertexNormals[0] = e.normal, e.vertexNormals[1] = e.normal, e.vertexNormals[2] = e.normal, e instanceof THREE.Face4) e.vertexNormals[3] = e.normal;
        b = 0;
        for (c = B.length; b < c; b++) m = B[b], e = m.faces[0], f = m.faces[1], g = m.faceIndices[0], k = m.faceIndices[1], h = m.vertexIndices[0], m = m.vertexIndices[1], e.a === h ? (n = "a", p = y[g] + 0) : e.b === h ? (n = "b", p = y[g] + 1) : e.c === h ? (n = "c", p = y[g] + 2) : e.d === h && (n = "d", p = y[g] + 3), e.a === m ? (n += "a", t = y[g] + 0) : e.b === m ? (n += "b", t = y[g] + 1) : e.c === m ? (n += "c", t = y[g] + 2) : e.d === m && (n += "d", t = y[g] + 3), f.a === h ? (o = "a", v = y[k] + 0) : f.b === h ? (o = "b", v = y[k] + 1) : f.c === h ? (o = "c", v = y[k] + 2) : f.d === h && (o = "d", v = y[k] + 3), f.a === m ? (o += "a", u = y[k] + 0) : f.b === m ? (o += "b", u = y[k] + 1) : f.c === m ? (o += "c", u = y[k] + 2) : f.d === m && (o += "d", u = y[k] + 3), n === "ac" || n === "ad" || n === "ca" || n === "da" ? p > t && (e = p, p = t, t = e) : p < t && (e = p, p = t, t = e), o === "ac" || o === "ad" || o === "ca" || o === "da" ? v > u && (e = v, v = u, u = e) : v < u && (e = v, v = u, u = e), e = new THREE.Face4(p, t, v, u), e.normal.set(1, 0, 0), A.push(e);
        this.geometry = w
    } else this.calculateShadowVolumeGeometryWithoutEdgeInfo(this.geometry)
};
THREE.ShadowVolume.prototype.calculateShadowVolumeGeometryWithoutEdgeInfo = function (b) {
    this.geometry = new THREE.Geometry;
    this.geometry.boundingSphere = b.boundingSphere;
    this.geometry.edgeFaces = [];
    var c = this.geometry.vertices,
        e = this.geometry.faces,
        f = this.geometry.edgeFaces,
        g = b.faces,
        b = b.vertices,
        k = g.length,
        h, m, n, o, p, t = ["a", "b", "c", "d"];
    for (n = 0; n < k; n++) {
        m = c.length;
        h = g[n];
        h instanceof THREE.Face4 ? (o = 4, m = new THREE.Face4(m, m + 1, m + 2, m + 3)) : (o = 3, m = new THREE.Face3(m, m + 1, m + 2));
        m.normal.copy(h.normal);
        e.push(m);
        for (m = 0; m < o; m++) p = b[h[t[m]]], c.push(new THREE.Vertex(p.position.clone()))
    }
    for (k = 0; k < g.length - 1; k++) {
        b = e[k];
        for (h = k + 1; h < g.length; h++) m = e[h], m = this.facesShareEdge(c, b, m), m !== void 0 && (m = new THREE.Face4(m.indices[0], m.indices[3], m.indices[2], m.indices[1]), m.normal.set(1, 0, 0), f.push(m))
    }
};
THREE.ShadowVolume.prototype.facesShareEdge = function (b, c, e) {
    var f, g, k, h, m, n, o, p, t, v, u, w, B, A = 0,
        y = ["a", "b", "c", "d"];
    f = c instanceof THREE.Face4 ? 4 : 3;
    g = e instanceof THREE.Face4 ? 4 : 3;
    for (w = 0; w < f; w++) {
        k = c[y[w]];
        m = b[k];
        for (B = 0; B < g; B++) if (h = e[y[B]], n = b[h], Math.abs(m.position.x - n.position.x) < 1.0E-4 && Math.abs(m.position.y - n.position.y) < 1.0E-4 && Math.abs(m.position.z - n.position.z) < 1.0E-4 && (A++, A === 1 && (o = m, p = n, t = k, v = h, u = y[w]), A === 2)) return u += y[w], u === "ad" || u === "ac" ? {
            faces: [c, e],
            vertices: [o, p, n, m],
            indices: [t, v,
            h, k],
            vertexTypes: [1, 2, 2, 1],
            extrudable: !0
        } : {
            faces: [c, e],
            vertices: [o, m, n, p],
            indices: [t, k, h, v],
            vertexTypes: [1, 1, 2, 2],
            extrudable: !0
        }
    }
};
THREE.Sprite = function (b) {
    THREE.Object3D.call(this);
    if (b.material !== void 0) this.material = b.material, this.map = void 0, this.blending = material.blending;
    else if (b.map !== void 0) this.map = b.map instanceof THREE.Texture ? b.map : THREE.ImageUtils.loadTexture(b.map), this.material = void 0, this.blending = b.blending !== void 0 ? b.blending : THREE.NormalBlending;
    this.useScreenCoordinates = b.useScreenCoordinates !== void 0 ? b.useScreenCoordinates : !0;
    this.mergeWith3D = b.mergeWith3D !== void 0 ? b.mergeWith3D : !this.useScreenCoordinates;
    this.affectedByDistance = b.affectedByDistance !== void 0 ? b.affectedByDistance : !this.useScreenCoordinates;
    this.scaleByViewport = b.scaleByViewport !== void 0 ? b.scaleByViewport : !this.affectedByDistance;
    this.alignment = b.alignment instanceof THREE.Vector2 ? b.alignment : THREE.SpriteAlignment.center;
    this.rotation3d = this.rotation;
    this.rotation = 0;
    this.opacity = 1;
    this.uvOffset = new THREE.Vector2(0, 0);
    this.uvScale = new THREE.Vector2(1, 1)
};
THREE.Sprite.prototype = new THREE.Object3D;
THREE.Sprite.prototype.constructor = THREE.Sprite;
THREE.Sprite.prototype.supr = THREE.Object3D.prototype;
THREE.Sprite.prototype.updateMatrix = function () {
    this.matrix.setPosition(this.position);
    this.rotation3d.set(0, 0, this.rotation);
    this.matrix.setRotationFromEuler(this.rotation3d);
    if (this.scale.x !== 1 || this.scale.y !== 1) this.matrix.scale(this.scale), this.boundRadiusScale = Math.max(this.scale.x, this.scale.y);
    this.matrixWorldNeedsUpdate = !0
};
THREE.SpriteAlignment = {};
THREE.SpriteAlignment.topLeft = new THREE.Vector2(1, -1);
THREE.SpriteAlignment.topCenter = new THREE.Vector2(0, -1);
THREE.SpriteAlignment.topRight = new THREE.Vector2(-1, -1);
THREE.SpriteAlignment.centerLeft = new THREE.Vector2(1, 0);
THREE.SpriteAlignment.center = new THREE.Vector2(0, 0);
THREE.SpriteAlignment.centerRight = new THREE.Vector2(-1, 0);
THREE.SpriteAlignment.bottomLeft = new THREE.Vector2(1, 1);
THREE.SpriteAlignment.bottomCenter = new THREE.Vector2(0, 1);
THREE.SpriteAlignment.bottomRight = new THREE.Vector2(-1, 1);
THREE.Scene = function () {
    THREE.Object3D.call(this);
    this.matrixAutoUpdate = !1;
    this.collisions = this.overrideMaterial = this.fog = null;
    this.objects = [];
    this.lights = [];
    this.__objectsAdded = [];
    this.__objectsRemoved = []
};
THREE.Scene.prototype = new THREE.Object3D;
THREE.Scene.prototype.constructor = THREE.Scene;
THREE.Scene.prototype.supr = THREE.Object3D.prototype;
THREE.Scene.prototype.addChild = function (b) {
    this.supr.addChild.call(this, b);
    this.addChildRecurse(b)
};
THREE.Scene.prototype.addChildRecurse = function (b) {
    if (b instanceof THREE.Light) this.lights.indexOf(b) === -1 && this.lights.push(b);
    else if (!(b instanceof THREE.Camera || b instanceof THREE.Bone) && this.objects.indexOf(b) === -1) this.objects.push(b), this.__objectsAdded.push(b);
    for (var c = 0; c < b.children.length; c++) this.addChildRecurse(b.children[c])
};
THREE.Scene.prototype.removeChild = function (b) {
    this.supr.removeChild.call(this, b);
    this.removeChildRecurse(b)
};
THREE.Scene.prototype.removeChildRecurse = function (b) {
    if (b instanceof THREE.Light) {
        var c = this.lights.indexOf(b);
        c !== -1 && this.lights.splice(c, 1)
    } else b instanceof THREE.Camera || (c = this.objects.indexOf(b), c !== -1 && (this.objects.splice(c, 1), this.__objectsRemoved.push(b)));
    for (c = 0; c < b.children.length; c++) this.removeChildRecurse(b.children[c])
};
THREE.Scene.prototype.addObject = THREE.Scene.prototype.addChild;
THREE.Scene.prototype.removeObject = THREE.Scene.prototype.removeChild;
THREE.Scene.prototype.addLight = THREE.Scene.prototype.addChild;
THREE.Scene.prototype.removeLight = THREE.Scene.prototype.removeChild;
THREE.Fog = function (b, c, e) {
    this.color = new THREE.Color(b);
    this.near = c || 1;
    this.far = e || 1E3
};
THREE.FogExp2 = function (b, c) {
    this.color = new THREE.Color(b);
    this.density = c !== void 0 ? c : 2.5E-4
};
THREE.Projector = function () {
    function b() {
        var b = n[m] = n[m] || new THREE.RenderableVertex;
        m++;
        return b
    }
    function c(b, e) {
        return e.z - b.z
    }
    function e(b, e) {
        var c = 0,
            j = 1,
            f = b.z + b.w,
            g = e.z + e.w,
            h = -b.z + b.w,
            k = -e.z + e.w;
        return f >= 0 && g >= 0 && h >= 0 && k >= 0 ? !0 : f < 0 && g < 0 || h < 0 && k < 0 ? !1 : (f < 0 ? c = Math.max(c, f / (f - g)) : g < 0 && (j = Math.min(j, f / (f - g))), h < 0 ? c = Math.max(c, h / (h - k)) : k < 0 && (j = Math.min(j, h / (h - k))), j < c ? !1 : (b.lerpSelf(e, c), e.lerpSelf(b, 1 - j), !0))
    }
    var f, g, k = [],
        h, m, n = [],
        o, p, t = [],
        v, u = [],
        w, B, A = [],
        y, G, z = [],
        C = new THREE.Vector4,
        H = new THREE.Vector4,
        D = new THREE.Matrix4,
        Q = new THREE.Matrix4,
        J = [new THREE.Vector4, new THREE.Vector4, new THREE.Vector4, new THREE.Vector4, new THREE.Vector4, new THREE.Vector4],
        F = new THREE.Vector4,
        I = new THREE.Vector4;
    this.projectVector = function (b, e) {
        D.multiply(e.projectionMatrix, e.matrixWorldInverse);
        D.multiplyVector3(b);
        return b
    };
    this.unprojectVector = function (b, e) {
        D.multiply(e.matrixWorld, THREE.Matrix4.makeInvert(e.projectionMatrix));
        D.multiplyVector3(b);
        return b
    };
    this.projectObjects = function (b, e, h) {
        var e = [],
            j, m, n;
        g = 0;
        m = b.objects;
        b = 0;
        for (j = m.length; b < j; b++) {
            n = m[b];
            var o;
            if (!(o = !n.visible)) if (o = n instanceof THREE.Mesh) {
                a: {
                    o = void 0;
                    for (var p = n.matrixWorld, t = -n.geometry.boundingSphere.radius * Math.max(n.scale.x, Math.max(n.scale.y, n.scale.z)), u = 0; u < 6; u++) if (o = J[u].x * p.n14 + J[u].y * p.n24 + J[u].z * p.n34 + J[u].w, o <= t) {
                        o = !1;
                        break a
                    }
                    o = !0
                }
                o = !o
            }
            if (!o) o = k[g] = k[g] || new THREE.RenderableObject, g++, f = o, C.copy(n.position), D.multiplyVector3(C), f.object = n, f.z = C.z, e.push(f)
        }
        h && e.sort(c);
        return e
    };
    this.projectScene = function (f, g, k) {
        var j = [],
            C = g.near,
            T = g.far,
            Z, N, da, X, aa, ia, ha, na, ja, L, fa, W, U, $, Y, ka, la;
        G = B = v = p = 0;
        g.matrixAutoUpdate && g.update(void 0, !0);
        f.update(void 0, !1, g);
        D.multiply(g.projectionMatrix, g.matrixWorldInverse);
        J[0].set(D.n41 - D.n11, D.n42 - D.n12, D.n43 - D.n13, D.n44 - D.n14);
        J[1].set(D.n41 + D.n11, D.n42 + D.n12, D.n43 + D.n13, D.n44 + D.n14);
        J[2].set(D.n41 + D.n21, D.n42 + D.n22, D.n43 + D.n23, D.n44 + D.n24);
        J[3].set(D.n41 - D.n21, D.n42 - D.n22, D.n43 - D.n23, D.n44 - D.n24);
        J[4].set(D.n41 - D.n31, D.n42 - D.n32, D.n43 - D.n33, D.n44 - D.n34);
        J[5].set(D.n41 + D.n31, D.n42 + D.n32, D.n43 + D.n33, D.n44 + D.n34);
        for (Z = 0; Z < 6; Z++) ja = J[Z], ja.divideScalar(Math.sqrt(ja.x * ja.x + ja.y * ja.y + ja.z * ja.z));
        ja = this.projectObjects(f, g, !0);
        f = 0;
        for (Z = ja.length; f < Z; f++) if (L = ja[f].object, L.visible) if (fa = L.matrixWorld, W = L.matrixRotationWorld, U = L.materials, $ = L.overdraw, m = 0, L instanceof THREE.Mesh) {
            Y = L.geometry;
            X = Y.vertices;
            ka = Y.faces;
            Y = Y.faceVertexUvs;
            N = 0;
            for (da = X.length; N < da; N++) h = b(), h.positionWorld.copy(X[N].position), fa.multiplyVector3(h.positionWorld), h.positionScreen.copy(h.positionWorld),
            D.multiplyVector4(h.positionScreen), h.positionScreen.x /= h.positionScreen.w, h.positionScreen.y /= h.positionScreen.w, h.visible = h.positionScreen.z > C && h.positionScreen.z < T;
            X = 0;
            for (N = ka.length; X < N; X++) {
                da = ka[X];
                if (da instanceof THREE.Face3) if (aa = n[da.a], ia = n[da.b], ha = n[da.c], aa.visible && ia.visible && ha.visible && (L.doubleSided || L.flipSided != (ha.positionScreen.x - aa.positionScreen.x) * (ia.positionScreen.y - aa.positionScreen.y) - (ha.positionScreen.y - aa.positionScreen.y) * (ia.positionScreen.x - aa.positionScreen.x) < 0)) na = t[p] = t[p] || new THREE.RenderableFace3, p++, o = na, o.v1.copy(aa), o.v2.copy(ia), o.v3.copy(ha);
                else continue;
                else if (da instanceof THREE.Face4) if (aa = n[da.a], ia = n[da.b], ha = n[da.c], na = n[da.d], aa.visible && ia.visible && ha.visible && na.visible && (L.doubleSided || L.flipSided != ((na.positionScreen.x - aa.positionScreen.x) * (ia.positionScreen.y - aa.positionScreen.y) - (na.positionScreen.y - aa.positionScreen.y) * (ia.positionScreen.x - aa.positionScreen.x) < 0 || (ia.positionScreen.x - ha.positionScreen.x) * (na.positionScreen.y - ha.positionScreen.y) - (ia.positionScreen.y - ha.positionScreen.y) * (na.positionScreen.x - ha.positionScreen.x) < 0))) la = u[v] = u[v] || new THREE.RenderableFace4, v++, o = la, o.v1.copy(aa), o.v2.copy(ia), o.v3.copy(ha), o.v4.copy(na);
                else continue;
                o.normalWorld.copy(da.normal);
                W.multiplyVector3(o.normalWorld);
                o.centroidWorld.copy(da.centroid);
                fa.multiplyVector3(o.centroidWorld);
                o.centroidScreen.copy(o.centroidWorld);
                D.multiplyVector3(o.centroidScreen);
                ha = da.vertexNormals;
                aa = 0;
                for (ia = ha.length; aa < ia; aa++) na = o.vertexNormalsWorld[aa],
                na.copy(ha[aa]), W.multiplyVector3(na);
                aa = 0;
                for (ia = Y.length; aa < ia; aa++) if (la = Y[aa][X]) {
                    ha = 0;
                    for (na = la.length; ha < na; ha++) o.uvs[aa][ha] = la[ha]
                }
                o.meshMaterials = U;
                o.faceMaterials = da.materials;
                o.overdraw = $;
                o.z = o.centroidScreen.z;
                j.push(o)
            }
        } else if (L instanceof THREE.Line) {
            Q.multiply(D, fa);
            X = L.geometry.vertices;
            aa = b();
            aa.positionScreen.copy(X[0].position);
            Q.multiplyVector4(aa.positionScreen);
            N = 1;
            for (da = X.length; N < da; N++) if (aa = b(), aa.positionScreen.copy(X[N].position), Q.multiplyVector4(aa.positionScreen),
            ia = n[m - 2], F.copy(aa.positionScreen), I.copy(ia.positionScreen), e(F, I)) F.multiplyScalar(1 / F.w), I.multiplyScalar(1 / I.w), fa = A[B] = A[B] || new THREE.RenderableLine, B++, w = fa, w.v1.positionScreen.copy(F), w.v2.positionScreen.copy(I), w.z = Math.max(F.z, I.z), w.materials = L.materials, j.push(w)
        } else if (L instanceof THREE.Particle && (H.set(L.matrixWorld.n14, L.matrixWorld.n24, L.matrixWorld.n34, 1), D.multiplyVector4(H), H.z /= H.w, H.z > 0 && H.z < 1)) fa = z[G] = z[G] || new THREE.RenderableParticle, G++, y = fa, y.x = H.x / H.w, y.y = H.y / H.w, y.z = H.z, y.rotation = L.rotation.z, y.scale.x = L.scale.x * Math.abs(y.x - (H.x + g.projectionMatrix.n11) / (H.w + g.projectionMatrix.n14)), y.scale.y = L.scale.y * Math.abs(y.y - (H.y + g.projectionMatrix.n22) / (H.w + g.projectionMatrix.n24)), y.materials = L.materials, j.push(y);
        k && j.sort(c);
        return j
    }
};
THREE.DOMRenderer = function () {
    THREE.Renderer.call(this);
    var b = null,
        c = new THREE.Projector,
        e, f, g, k;
    this.domElement = document.createElement("div");
    this.setSize = function (b, c) {
        e = b;
        f = c;
        g = e / 2;
        k = f / 2
    };
    this.render = function (e, f) {
        var n, o, p, t, v, u, w, B;
        b = c.projectScene(e, f);
        n = 0;
        for (o = b.length; n < o; n++) if (v = b[n], v instanceof THREE.RenderableParticle) {
            w = v.x * g + g;
            B = v.y * k + k;
            p = 0;
            for (t = v.material.length; p < t; p++) if (u = v.material[p], u instanceof THREE.ParticleDOMMaterial) u = u.domElement, u.style.left = w + "px", u.style.top = B + "px"
        }
    }
};
THREE.CanvasRenderer = function (b) {
    function c(b) {
        if (y != b) w.globalAlpha = y = b
    }
    function e(b) {
        if (G != b) {
            switch (b) {
                case THREE.NormalBlending:
                    w.globalCompositeOperation = "source-over";
                    break;
                case THREE.AdditiveBlending:
                    w.globalCompositeOperation = "lighter";
                    break;
                case THREE.SubtractiveBlending:
                    w.globalCompositeOperation = "darker"
            }
            G = b
        }
    }
    function f(b) {
        if (z != b.hex) z = b.hex, w.strokeStyle = "#" + k(z.toString(16))
    }
    function g(b) {
        if (C != b.hex) C = b.hex, w.fillStyle = "#" + k(C.toString(16))
    }
    function k(b) {
        for (; b.length < 6;) b = "0" + b;
        return b
    }
    var h = this,
        m = null,
        n = new THREE.Projector,
        b = b || {}, o = b.canvas !== void 0 ? b.canvas : document.createElement("canvas"),
        p, t, v, u, w = o.getContext("2d"),
        B = new THREE.Color(0),
        A = 0,
        y = 1,
        G = 0,
        z = null,
        C = null,
        H = null,
        D = null,
        Q = null,
        J, F, I, S, K = new THREE.RenderableVertex,
        ea = new THREE.RenderableVertex,
        j, ca, T, Z, N, da, X, aa, ia, ha, na, ja, L = new THREE.Color(0),
        fa = new THREE.Color(0),
        W = new THREE.Color(0),
        U = new THREE.Color(0),
        $ = new THREE.Color(0),
        Y, ka, la, ga, Da, ua, Aa, xa, qa, ya, va = new THREE.Rectangle,
        oa = new THREE.Rectangle,
        R = new THREE.Rectangle,
        O = !1,
        ra = new THREE.Color,
        P = new THREE.Color,
        Ba = new THREE.Color,
        V = new THREE.Color,
        pa = new THREE.Vector3,
        Pa, Qa, Wa, wa, Ra, Sa, b = 16;
    Pa = document.createElement("canvas");
    Pa.width = Pa.height = 2;
    Qa = Pa.getContext("2d");
    Qa.fillStyle = "rgba(0,0,0,1)";
    Qa.fillRect(0, 0, 2, 2);
    Wa = Qa.getImageData(0, 0, 2, 2);
    wa = Wa.data;
    Ra = document.createElement("canvas");
    Ra.width = Ra.height = b;
    Sa = Ra.getContext("2d");
    Sa.translate(-b / 2, -b / 2);
    Sa.scale(b, b);
    b--;
    this.domElement = o;
    this.sortElements = this.sortObjects = this.autoClear = !0;
    this.data = {
        vertices: 0,
        faces: 0
    };
    this.setSize = function (b, e) {
        p = b;
        t = e;
        v = p / 2;
        u = t / 2;
        o.width = p;
        o.height = t;
        va.set(-v, -u, v, u);
        oa.set(-v, -u, v, u);
        y = 1;
        G = 0;
        Q = D = H = C = z = null
    };
    this.setClearColor = function (b, e) {
        B = b;
        A = e;
        oa.set(-v, -u, v, u)
    };
    this.setClearColorHex = function (b, e) {
        B.setHex(b);
        A = e;
        oa.set(-v, -u, v, u)
    };
    this.clear = function () {
        w.setTransform(1, 0, 0, -1, v, u);
        if (!oa.isEmpty()) oa.inflate(1), oa.minSelf(va), A == 0 ? w.clearRect(oa.getX(), oa.getY(), oa.getWidth(), oa.getHeight()) : (e(THREE.NormalBlending), c(1), C = "rgba(" + Math.floor(B.r * 255) + "," + Math.floor(B.g * 255) + "," + Math.floor(B.b * 255) + "," + A + ")", w.fillStyle = C, w.fillRect(oa.getX(), oa.getY(), oa.getWidth(), oa.getHeight())), oa.empty()
    };
    this.render = function (b, k) {
        function o(b) {
            var e, c, j, f = b.lights;
            P.setRGB(0, 0, 0);
            Ba.setRGB(0, 0, 0);
            V.setRGB(0, 0, 0);
            b = 0;
            for (e = f.length; b < e; b++) c = f[b], j = c.color, c instanceof THREE.AmbientLight ? (P.r += j.r, P.g += j.g, P.b += j.b) : c instanceof THREE.DirectionalLight ? (Ba.r += j.r, Ba.g += j.g, Ba.b += j.b) : c instanceof THREE.PointLight && (V.r += j.r, V.g += j.g, V.b += j.b)
        }
        function p(b, e, c, j) {
            var f, g, h, k,
            m = b.lights,
                b = 0;
            for (f = m.length; b < f; b++) g = m[b], h = g.color, g instanceof THREE.DirectionalLight ? (k = c.dot(g.position), k <= 0 || (k *= g.intensity, j.r += h.r * k, j.g += h.g * k, j.b += h.b * k)) : g instanceof THREE.PointLight && (k = c.dot(pa.sub(g.position, e).normalize()), k <= 0 || (k *= g.distance == 0 ? 1 : 1 - Math.min(e.distanceTo(g.position) / g.distance, 1), k != 0 && (k *= g.intensity, j.r += h.r * k, j.g += h.g * k, j.b += h.b * k)))
        }
        function t(b, j, h) {
            c(h.opacity);
            e(h.blending);
            var k, m, n, o, p, V;
            if (h instanceof THREE.ParticleBasicMaterial) {
                if (h.map) o = h.map.image,
                p = o.width >> 1, V = o.height >> 1, h = j.scale.x * v, n = j.scale.y * u, k = h * p, m = n * V, R.set(b.x - k, b.y - m, b.x + k, b.y + m), va.instersects(R) && (w.save(), w.translate(b.x, b.y), w.rotate(-j.rotation), w.scale(h, -n), w.translate(-p, -V), w.drawImage(o, 0, 0), w.restore())
            } else h instanceof THREE.ParticleCanvasMaterial && (k = j.scale.x * v, m = j.scale.y * u, R.set(b.x - k, b.y - m, b.x + k, b.y + m), va.instersects(R) && (f(h.color), g(h.color), w.save(), w.translate(b.x, b.y), w.rotate(-j.rotation), w.scale(k, m), h.program(w), w.restore()))
        }
        function y(b, j, g, h) {
            c(h.opacity);
            e(h.blending);
            w.beginPath();
            w.moveTo(b.positionScreen.x, b.positionScreen.y);
            w.lineTo(j.positionScreen.x, j.positionScreen.y);
            w.closePath();
            if (h instanceof THREE.LineBasicMaterial) {
                b = h.linewidth;
                if (H != b) w.lineWidth = H = b;
                b = h.linecap;
                if (D != b) w.lineCap = D = b;
                b = h.linejoin;
                if (Q != b) w.lineJoin = Q = b;
                f(h.color);
                w.stroke();
                R.inflate(h.linewidth * 2)
            }
        }
        function A(b, f, g, m, n, o, V, t, u) {
            h.data.vertices += 3;
            h.data.faces++;
            c(t.opacity);
            e(t.blending);
            j = b.positionScreen.x;
            ca = b.positionScreen.y;
            T = f.positionScreen.x;
            Z = f.positionScreen.y;
            N = g.positionScreen.x;
            da = g.positionScreen.y;
            z(j, ca, T, Z, N, da);
            if (t instanceof THREE.MeshBasicMaterial) if (t.map) t.map.mapping instanceof THREE.UVMapping && (ga = V.uvs[0], Ea(j, ca, T, Z, N, da, t.map.image, ga[m].u, ga[m].v, ga[n].u, ga[n].v, ga[o].u, ga[o].v));
            else if (t.envMap) {
                if (t.envMap.mapping instanceof THREE.SphericalReflectionMapping) b = k.matrixWorldInverse, pa.copy(V.vertexNormalsWorld[0]), Da = (pa.x * b.n11 + pa.y * b.n12 + pa.z * b.n13) * 0.5 + 0.5, ua = -(pa.x * b.n21 + pa.y * b.n22 + pa.z * b.n23) * 0.5 + 0.5, pa.copy(V.vertexNormalsWorld[1]),
                Aa = (pa.x * b.n11 + pa.y * b.n12 + pa.z * b.n13) * 0.5 + 0.5, xa = -(pa.x * b.n21 + pa.y * b.n22 + pa.z * b.n23) * 0.5 + 0.5, pa.copy(V.vertexNormalsWorld[2]), qa = (pa.x * b.n11 + pa.y * b.n12 + pa.z * b.n13) * 0.5 + 0.5, ya = -(pa.x * b.n21 + pa.y * b.n22 + pa.z * b.n23) * 0.5 + 0.5, Ea(j, ca, T, Z, N, da, t.envMap.image, Da, ua, Aa, xa, qa, ya)
            } else t.wireframe ? C(t.color, t.wireframeLinewidth, t.wireframeLinecap, t.wireframeLinejoin) : Ga(t.color);
            else if (t instanceof THREE.MeshLambertMaterial) t.map && !t.wireframe && (t.map.mapping instanceof THREE.UVMapping && (ga = V.uvs[0], Ea(j, ca,
            T, Z, N, da, t.map.image, ga[m].u, ga[m].v, ga[n].u, ga[n].v, ga[o].u, ga[o].v)), e(THREE.SubtractiveBlending)), O ? !t.wireframe && t.shading == THREE.SmoothShading && V.vertexNormalsWorld.length == 3 ? (fa.r = W.r = U.r = P.r, fa.g = W.g = U.g = P.g, fa.b = W.b = U.b = P.b, p(u, V.v1.positionWorld, V.vertexNormalsWorld[0], fa), p(u, V.v2.positionWorld, V.vertexNormalsWorld[1], W), p(u, V.v3.positionWorld, V.vertexNormalsWorld[2], U), $.r = (W.r + U.r) * 0.5, $.g = (W.g + U.g) * 0.5, $.b = (W.b + U.b) * 0.5, la = Ta(fa, W, U, $), Ea(j, ca, T, Z, N, da, la, 0, 0, 1, 0, 0, 1)) : (ra.r = P.r, ra.g = P.g, ra.b = P.b, p(u, V.centroidWorld, V.normalWorld, ra), L.r = Math.max(0, Math.min(t.color.r * ra.r, 1)), L.g = Math.max(0, Math.min(t.color.g * ra.g, 1)), L.b = Math.max(0, Math.min(t.color.b * ra.b, 1)), L.updateHex(), t.wireframe ? C(L, t.wireframeLinewidth, t.wireframeLinecap, t.wireframeLinejoin) : Ga(L)) : t.wireframe ? C(t.color, t.wireframeLinewidth, t.wireframeLinecap, t.wireframeLinejoin) : Ga(t.color);
            else if (t instanceof THREE.MeshDepthMaterial) Y = k.near, ka = k.far, fa.r = fa.g = fa.b = 1 - Ja(b.positionScreen.z, Y, ka), W.r = W.g = W.b = 1 - Ja(f.positionScreen.z,
            Y, ka), U.r = U.g = U.b = 1 - Ja(g.positionScreen.z, Y, ka), $.r = (W.r + U.r) * 0.5, $.g = (W.g + U.g) * 0.5, $.b = (W.b + U.b) * 0.5, la = Ta(fa, W, U, $), Ea(j, ca, T, Z, N, da, la, 0, 0, 1, 0, 0, 1);
            else if (t instanceof THREE.MeshNormalMaterial) L.r = Na(V.normalWorld.x), L.g = Na(V.normalWorld.y), L.b = Na(V.normalWorld.z), L.updateHex(), t.wireframe ? C(L, t.wireframeLinewidth, t.wireframeLinecap, t.wireframeLinejoin) : Ga(L)
        }
        function B(b, f, g, m, n, o, t, V, u) {
            h.data.vertices += 4;
            h.data.faces++;
            c(V.opacity);
            e(V.blending);
            if (V.map || V.envMap) A(b, f, m, 0, 1, 3, t, V, u), A(n,
            g, o, 1, 2, 3, t, V, u);
            else if (j = b.positionScreen.x, ca = b.positionScreen.y, T = f.positionScreen.x, Z = f.positionScreen.y, N = g.positionScreen.x, da = g.positionScreen.y, X = m.positionScreen.x, aa = m.positionScreen.y, ia = n.positionScreen.x, ha = n.positionScreen.y, na = o.positionScreen.x, ja = o.positionScreen.y, V instanceof THREE.MeshBasicMaterial) G(j, ca, T, Z, N, da, X, aa), V.wireframe ? C(V.color, V.wireframeLinewidth, V.wireframeLinecap, V.wireframeLinejoin) : Ga(V.color);
            else if (V instanceof THREE.MeshLambertMaterial) O ? !V.wireframe && V.shading == THREE.SmoothShading && t.vertexNormalsWorld.length == 4 ? (fa.r = W.r = U.r = $.r = P.r, fa.g = W.g = U.g = $.g = P.g, fa.b = W.b = U.b = $.b = P.b, p(u, t.v1.positionWorld, t.vertexNormalsWorld[0], fa), p(u, t.v2.positionWorld, t.vertexNormalsWorld[1], W), p(u, t.v4.positionWorld, t.vertexNormalsWorld[3], U), p(u, t.v3.positionWorld, t.vertexNormalsWorld[2], $), la = Ta(fa, W, U, $), z(j, ca, T, Z, X, aa), Ea(j, ca, T, Z, X, aa, la, 0, 0, 1, 0, 0, 1), z(ia, ha, N, da, na, ja), Ea(ia, ha, N, da, na, ja, la, 1, 0, 1, 1, 0, 1)) : (ra.r = P.r, ra.g = P.g, ra.b = P.b, p(u, t.centroidWorld, t.normalWorld,
            ra), L.r = Math.max(0, Math.min(V.color.r * ra.r, 1)), L.g = Math.max(0, Math.min(V.color.g * ra.g, 1)), L.b = Math.max(0, Math.min(V.color.b * ra.b, 1)), L.updateHex(), G(j, ca, T, Z, N, da, X, aa), V.wireframe ? C(L, V.wireframeLinewidth, V.wireframeLinecap, V.wireframeLinejoin) : Ga(L)) : (G(j, ca, T, Z, N, da, X, aa), V.wireframe ? C(V.color, V.wireframeLinewidth, V.wireframeLinecap, V.wireframeLinejoin) : Ga(V.color));
            else if (V instanceof THREE.MeshNormalMaterial) L.r = Na(t.normalWorld.x), L.g = Na(t.normalWorld.y), L.b = Na(t.normalWorld.z), L.updateHex(),
            G(j, ca, T, Z, N, da, X, aa), V.wireframe ? C(L, V.wireframeLinewidth, V.wireframeLinecap, V.wireframeLinejoin) : Ga(L);
            else if (V instanceof THREE.MeshDepthMaterial) Y = k.near, ka = k.far, fa.r = fa.g = fa.b = 1 - Ja(b.positionScreen.z, Y, ka), W.r = W.g = W.b = 1 - Ja(f.positionScreen.z, Y, ka), U.r = U.g = U.b = 1 - Ja(m.positionScreen.z, Y, ka), $.r = $.g = $.b = 1 - Ja(g.positionScreen.z, Y, ka), la = Ta(fa, W, U, $), z(j, ca, T, Z, X, aa), Ea(j, ca, T, Z, X, aa, la, 0, 0, 1, 0, 0, 1), z(ia, ha, N, da, na, ja), Ea(ia, ha, N, da, na, ja, la, 1, 0, 1, 1, 0, 1)
        }
        function z(b, e, c, j, f, g) {
            w.beginPath();
            w.moveTo(b,
            e);
            w.lineTo(c, j);
            w.lineTo(f, g);
            w.lineTo(b, e);
            w.closePath()
        }
        function G(b, e, c, j, f, g, h, k) {
            w.beginPath();
            w.moveTo(b, e);
            w.lineTo(c, j);
            w.lineTo(f, g);
            w.lineTo(h, k);
            w.lineTo(b, e);
            w.closePath()
        }
        function C(b, e, c, j) {
            if (H != e) w.lineWidth = H = e;
            if (D != c) w.lineCap = D = c;
            if (Q != j) w.lineJoin = Q = j;
            f(b);
            w.stroke();
            R.inflate(e * 2)
        }
        function Ga(b) {
            g(b);
            w.fill()
        }
        function Ea(b, e, c, j, f, g, h, k, m, n, V, t, o) {
            var p, u;
            p = h.width - 1;
            u = h.height - 1;
            k *= p;
            m *= u;
            n *= p;
            V *= u;
            t *= p;
            o *= u;
            c -= b;
            j -= e;
            f -= b;
            g -= e;
            n -= k;
            V -= m;
            t -= k;
            o -= m;
            p = n * o - t * V;
            if (!((p < 0 ? -p : p) < 1)) u = 1 / p, p = (o * c - V * f) * u, V = (o * j - V * g) * u, c = (n * f - t * c) * u, j = (n * g - t * j) * u, b = b - p * k - c * m, e = e - V * k - j * m, w.save(), w.transform(p, V, c, j, b, e), w.clip(), w.drawImage(h, 0, 0), w.restore()
        }
        function Ta(b, e, c, j) {
            var f = ~~ (b.r * 255),
                g = ~~ (b.g * 255),
                b = ~~ (b.b * 255),
                h = ~~ (e.r * 255),
                k = ~~ (e.g * 255),
                e = ~~ (e.b * 255),
                m = ~~ (c.r * 255),
                n = ~~ (c.g * 255),
                c = ~~ (c.b * 255),
                V = ~~ (j.r * 255),
                t = ~~ (j.g * 255),
                j = ~~ (j.b * 255);
            wa[0] = f < 0 ? 0 : f > 255 ? 255 : f;
            wa[1] = g < 0 ? 0 : g > 255 ? 255 : g;
            wa[2] = b < 0 ? 0 : b > 255 ? 255 : b;
            wa[4] = h < 0 ? 0 : h > 255 ? 255 : h;
            wa[5] = k < 0 ? 0 : k > 255 ? 255 : k;
            wa[6] = e < 0 ? 0 : e > 255 ? 255 : e;
            wa[8] = m < 0 ? 0 : m > 255 ? 255 : m;
            wa[9] = n < 0 ? 0 : n > 255 ? 255 : n;
            wa[10] = c < 0 ? 0 : c > 255 ? 255 : c;
            wa[12] = V < 0 ? 0 : V > 255 ? 255 : V;
            wa[13] = t < 0 ? 0 : t > 255 ? 255 : t;
            wa[14] = j < 0 ? 0 : j > 255 ? 255 : j;
            Qa.putImageData(Wa, 0, 0);
            Sa.drawImage(Pa, 0, 0);
            return Ra
        }
        function Ja(b, e, c) {
            b = (b - e) / (c - e);
            return b * b * (3 - 2 * b)
        }
        function Na(b) {
            b = (b + 1) * 0.5;
            return b < 0 ? 0 : b > 1 ? 1 : b
        }
        function E(b, e) {
            var c = e.x - b.x,
                j = e.y - b.y,
                f = c * c + j * j;
            f != 0 && (f = 1 / Math.sqrt(f), c *= f, j *= f, e.x += c, e.y += j, b.x -= c, b.y -= j)
        }
        var Ua, x, ma, za, Ha, Oa, Va, sa;
        this.autoClear ? this.clear() : w.setTransform(1, 0, 0, -1, v, u);
        h.data.vertices = 0;
        h.data.faces = 0;
        m = n.projectScene(b, k, this.sortElements);
        (O = b.lights.length > 0) && o(b);
        Ua = 0;
        for (x = m.length; Ua < x; Ua++) {
            ma = m[Ua];
            R.empty();
            if (ma instanceof THREE.RenderableParticle) {
                J = ma;
                J.x *= v;
                J.y *= u;
                za = 0;
                for (Ha = ma.materials.length; za < Ha;) sa = ma.materials[za++], sa.opacity != 0 && t(J, ma, sa, b)
            } else if (ma instanceof THREE.RenderableLine) {
                if (J = ma.v1, F = ma.v2, J.positionScreen.x *= v, J.positionScreen.y *= u, F.positionScreen.x *= v, F.positionScreen.y *= u, R.addPoint(J.positionScreen.x, J.positionScreen.y), R.addPoint(F.positionScreen.x,
                F.positionScreen.y), va.instersects(R)) {
                    za = 0;
                    for (Ha = ma.materials.length; za < Ha;) sa = ma.materials[za++], sa.opacity != 0 && y(J, F, ma, sa, b)
                }
            } else if (ma instanceof THREE.RenderableFace3) {
                if (J = ma.v1, F = ma.v2, I = ma.v3, J.positionScreen.x *= v, J.positionScreen.y *= u, F.positionScreen.x *= v, F.positionScreen.y *= u, I.positionScreen.x *= v, I.positionScreen.y *= u, ma.overdraw && (E(J.positionScreen, F.positionScreen), E(F.positionScreen, I.positionScreen), E(I.positionScreen, J.positionScreen)), R.add3Points(J.positionScreen.x, J.positionScreen.y,
                F.positionScreen.x, F.positionScreen.y, I.positionScreen.x, I.positionScreen.y), va.instersects(R)) {
                    za = 0;
                    for (Ha = ma.meshMaterials.length; za < Ha;) if (sa = ma.meshMaterials[za++], sa instanceof THREE.MeshFaceMaterial) {
                        Oa = 0;
                        for (Va = ma.faceMaterials.length; Oa < Va;)(sa = ma.faceMaterials[Oa++]) && sa.opacity != 0 && A(J, F, I, 0, 1, 2, ma, sa, b)
                    } else sa.opacity != 0 && A(J, F, I, 0, 1, 2, ma, sa, b)
                }
            } else if (ma instanceof THREE.RenderableFace4 && (J = ma.v1, F = ma.v2, I = ma.v3, S = ma.v4, J.positionScreen.x *= v, J.positionScreen.y *= u, F.positionScreen.x *= v, F.positionScreen.y *= u, I.positionScreen.x *= v, I.positionScreen.y *= u, S.positionScreen.x *= v, S.positionScreen.y *= u, K.positionScreen.copy(F.positionScreen), ea.positionScreen.copy(S.positionScreen), ma.overdraw && (E(J.positionScreen, F.positionScreen), E(F.positionScreen, S.positionScreen), E(S.positionScreen, J.positionScreen), E(I.positionScreen, K.positionScreen), E(I.positionScreen, ea.positionScreen)), R.addPoint(J.positionScreen.x, J.positionScreen.y), R.addPoint(F.positionScreen.x, F.positionScreen.y), R.addPoint(I.positionScreen.x,
            I.positionScreen.y), R.addPoint(S.positionScreen.x, S.positionScreen.y), va.instersects(R))) {
                za = 0;
                for (Ha = ma.meshMaterials.length; za < Ha;) if (sa = ma.meshMaterials[za++], sa instanceof THREE.MeshFaceMaterial) {
                    Oa = 0;
                    for (Va = ma.faceMaterials.length; Oa < Va;)(sa = ma.faceMaterials[Oa++]) && sa.opacity != 0 && B(J, F, I, S, K, ea, ma, sa, b)
                } else sa.opacity != 0 && B(J, F, I, S, K, ea, ma, sa, b)
            }
            oa.addRectangle(R)
        }
        w.setTransform(1, 0, 0, 1, 0, 0)
    }
};
THREE.SVGRenderer = function () {
    function b(b, e, c) {
        var j, f, g, h;
        j = 0;
        for (f = b.lights.length; j < f; j++) g = b.lights[j], g instanceof THREE.DirectionalLight ? (h = e.normalWorld.dot(g.position) * g.intensity, h > 0 && (c.r += g.color.r * h, c.g += g.color.g * h, c.b += g.color.b * h)) : g instanceof THREE.PointLight && (S.sub(g.position, e.centroidWorld), S.normalize(), h = e.normalWorld.dot(S) * g.intensity, h > 0 && (c.r += g.color.r * h, c.g += g.color.g * h, c.b += g.color.b * h))
    }
    function c(e, c, m, n, t, p) {
        h.data.vertices += 3;
        h.data.faces++;
        j = f(ca++);
        j.setAttribute("d",
            "M " + e.positionScreen.x + " " + e.positionScreen.y + " L " + c.positionScreen.x + " " + c.positionScreen.y + " L " + m.positionScreen.x + "," + m.positionScreen.y + "z");
        t instanceof THREE.MeshBasicMaterial ? H.hex = t.color.hex : t instanceof THREE.MeshLambertMaterial ? C ? (D.r = Q.r, D.g = Q.g, D.b = Q.b, b(p, n, D), H.r = Math.max(0, Math.min(t.color.r * D.r, 1)), H.g = Math.max(0, Math.min(t.color.g * D.g, 1)), H.b = Math.max(0, Math.min(t.color.b * D.b, 1)), H.updateHex()) : H.hex = t.color.hex : t instanceof THREE.MeshDepthMaterial ? (I = 1 - t.__2near / (t.__farPlusNear - n.z * t.__farMinusNear), H.setRGB(I, I, I)) : t instanceof THREE.MeshNormalMaterial && H.setRGB(g(n.normalWorld.x), g(n.normalWorld.y), g(n.normalWorld.z));
        t.wireframe ? j.setAttribute("style", "fill: none; stroke: #" + k(H.hex.toString(16)) + "; stroke-width: " + t.wireframeLinewidth + "; stroke-opacity: " + t.opacity + "; stroke-linecap: " + t.wireframeLinecap + "; stroke-linejoin: " + t.wireframeLinejoin) : j.setAttribute("style", "fill: #" + k(H.hex.toString(16)) + "; fill-opacity: " + t.opacity);
        o.appendChild(j)
    }
    function e(e, c, m, n,
    t, p, u) {
        h.data.vertices += 4;
        h.data.faces++;
        j = f(ca++);
        j.setAttribute("d", "M " + e.positionScreen.x + " " + e.positionScreen.y + " L " + c.positionScreen.x + " " + c.positionScreen.y + " L " + m.positionScreen.x + "," + m.positionScreen.y + " L " + n.positionScreen.x + "," + n.positionScreen.y + "z");
        p instanceof THREE.MeshBasicMaterial ? H.hex = p.color.hex : p instanceof THREE.MeshLambertMaterial ? C ? (D.r = Q.r, D.g = Q.g, D.b = Q.b, b(u, t, D), H.r = Math.max(0, Math.min(p.color.r * D.r, 1)), H.g = Math.max(0, Math.min(p.color.g * D.g, 1)), H.b = Math.max(0, Math.min(p.color.b * D.b, 1)), H.updateHex()) : H.hex = p.color.hex : p instanceof THREE.MeshDepthMaterial ? (I = 1 - p.__2near / (p.__farPlusNear - t.z * p.__farMinusNear), H.setRGB(I, I, I)) : p instanceof THREE.MeshNormalMaterial && H.setRGB(g(t.normalWorld.x), g(t.normalWorld.y), g(t.normalWorld.z));
        p.wireframe ? j.setAttribute("style", "fill: none; stroke: #" + k(H.hex.toString(16)) + "; stroke-width: " + p.wireframeLinewidth + "; stroke-opacity: " + p.opacity + "; stroke-linecap: " + p.wireframeLinecap + "; stroke-linejoin: " + p.wireframeLinejoin) : j.setAttribute("style",
            "fill: #" + k(H.hex.toString(16)) + "; fill-opacity: " + p.opacity);
        o.appendChild(j)
    }
    function f(b) {
        K[b] == null && (K[b] = document.createElementNS("http://www.w3.org/2000/svg", "path"), Z == 0 && K[b].setAttribute("shape-rendering", "crispEdges"));
        return K[b]
    }
    function g(b) {
        b = (b + 1) * 0.5;
        return b < 0 ? 0 : b > 1 ? 1 : b
    }
    function k(b) {
        for (; b.length < 6;) b = "0" + b;
        return b
    }
    var h = this,
        m = null,
        n = new THREE.Projector,
        o = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        p, t, v, u, w, B, A, y, G = new THREE.Rectangle,
        z = new THREE.Rectangle,
        C = !1,
        H = new THREE.Color(16777215),
        D = new THREE.Color(16777215),
        Q = new THREE.Color(0),
        J = new THREE.Color(0),
        F = new THREE.Color(0),
        I, S = new THREE.Vector3,
        K = [],
        ea = [],
        j, ca, T, Z = 1;
    this.domElement = o;
    this.sortElements = this.sortObjects = this.autoClear = !0;
    this.data = {
        vertices: 0,
        faces: 0
    };
    this.setQuality = function (b) {
        switch (b) {
            case "high":
                Z = 1;
                break;
            case "low":
                Z = 0
        }
    };
    this.setSize = function (b, e) {
        p = b;
        t = e;
        v = p / 2;
        u = t / 2;
        o.setAttribute("viewBox", -v + " " + -u + " " + p + " " + t);
        o.setAttribute("width", p);
        o.setAttribute("height", t);
        G.set(-v, -u, v, u)
    };
    this.clear = function () {
        for (; o.childNodes.length > 0;) o.removeChild(o.childNodes[0])
    };
    this.render = function (b, f) {
        var g, t, p, H, D, I, L, K;
        this.autoClear && this.clear();
        h.data.vertices = 0;
        h.data.faces = 0;
        m = n.projectScene(b, f, this.sortElements);
        T = ca = 0;
        if (C = b.lights.length > 0) {
            L = b.lights;
            Q.setRGB(0, 0, 0);
            J.setRGB(0, 0, 0);
            F.setRGB(0, 0, 0);
            g = 0;
            for (t = L.length; g < t; g++) p = L[g], H = p.color, p instanceof THREE.AmbientLight ? (Q.r += H.r, Q.g += H.g, Q.b += H.b) : p instanceof THREE.DirectionalLight ? (J.r += H.r, J.g += H.g, J.b += H.b) : p instanceof
            THREE.PointLight && (F.r += H.r, F.g += H.g, F.b += H.b)
        }
        g = 0;
        for (t = m.length; g < t; g++) if (L = m[g], z.empty(), L instanceof THREE.RenderableParticle) {
            w = L;
            w.x *= v;
            w.y *= -u;
            p = 0;
            for (H = L.materials.length; p < H;) p++
        } else if (L instanceof THREE.RenderableLine) {
            if (w = L.v1, B = L.v2, w.positionScreen.x *= v, w.positionScreen.y *= -u, B.positionScreen.x *= v, B.positionScreen.y *= -u, z.addPoint(w.positionScreen.x, w.positionScreen.y), z.addPoint(B.positionScreen.x, B.positionScreen.y), G.instersects(z)) {
                p = 0;
                for (H = L.materials.length; p < H;) if ((K = L.materials[p++]) && K.opacity != 0) {
                    D = w;
                    I = B;
                    var S = T++;
                    ea[S] == null && (ea[S] = document.createElementNS("http://www.w3.org/2000/svg", "line"), Z == 0 && ea[S].setAttribute("shape-rendering", "crispEdges"));
                    j = ea[S];
                    j.setAttribute("x1", D.positionScreen.x);
                    j.setAttribute("y1", D.positionScreen.y);
                    j.setAttribute("x2", I.positionScreen.x);
                    j.setAttribute("y2", I.positionScreen.y);
                    K instanceof THREE.LineBasicMaterial && (j.setAttribute("style", "fill: none; stroke: ##" + k(K.color.hex.toString(16)) + "; stroke-width: " + K.linewidth + "; stroke-opacity: " + K.opacity + "; stroke-linecap: " + K.linecap + "; stroke-linejoin: " + K.linejoin), o.appendChild(j))
                }
            }
        } else if (L instanceof THREE.RenderableFace3) {
            if (w = L.v1, B = L.v2, A = L.v3, w.positionScreen.x *= v, w.positionScreen.y *= -u, B.positionScreen.x *= v, B.positionScreen.y *= -u, A.positionScreen.x *= v, A.positionScreen.y *= -u, z.addPoint(w.positionScreen.x, w.positionScreen.y), z.addPoint(B.positionScreen.x, B.positionScreen.y), z.addPoint(A.positionScreen.x, A.positionScreen.y), G.instersects(z)) {
                p = 0;
                for (H = L.meshMaterials.length; p < H;) if (K = L.meshMaterials[p++], K instanceof THREE.MeshFaceMaterial) {
                    D = 0;
                    for (I = L.faceMaterials.length; D < I;)(K = L.faceMaterials[D++]) && K.opacity != 0 && c(w, B, A, L, K, b)
                } else K && K.opacity != 0 && c(w, B, A, L, K, b)
            }
        } else if (L instanceof THREE.RenderableFace4 && (w = L.v1, B = L.v2, A = L.v3, y = L.v4, w.positionScreen.x *= v, w.positionScreen.y *= -u, B.positionScreen.x *= v, B.positionScreen.y *= -u, A.positionScreen.x *= v, A.positionScreen.y *= -u, y.positionScreen.x *= v, y.positionScreen.y *= -u, z.addPoint(w.positionScreen.x, w.positionScreen.y), z.addPoint(B.positionScreen.x,
        B.positionScreen.y), z.addPoint(A.positionScreen.x, A.positionScreen.y), z.addPoint(y.positionScreen.x, y.positionScreen.y), G.instersects(z))) {
            p = 0;
            for (H = L.meshMaterials.length; p < H;) if (K = L.meshMaterials[p++], K instanceof THREE.MeshFaceMaterial) {
                D = 0;
                for (I = L.faceMaterials.length; D < I;)(K = L.faceMaterials[D++]) && K.opacity != 0 && e(w, B, A, y, L, K, b)
            } else K && K.opacity != 0 && e(w, B, A, y, L, K, b)
        }
    }
};
THREE.ShaderChunk = {
    fog_pars_fragment: "#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",
    fog_fragment: "#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",
    envmap_pars_fragment: "#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform int combine;\n#endif",
    envmap_fragment: "#ifdef USE_ENVMAP\nvec4 cubeColor = textureCube( envMap, vec3( -vReflect.x, vReflect.yz ) );\nif ( combine == 1 ) {\ngl_FragColor = vec4( mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity ), opacity );\n} else {\ngl_FragColor = gl_FragColor * cubeColor;\n}\n#endif",
    envmap_pars_vertex: "#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",
    envmap_vertex: "#ifdef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",
    map_particle_pars_fragment: "#ifdef USE_MAP\nuniform sampler2D map;\n#endif",
    map_particle_fragment: "#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, gl_PointCoord );\n#endif",
    map_pars_vertex: "#ifdef USE_MAP\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",
    map_pars_fragment: "#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif",
    map_vertex: "#ifdef USE_MAP\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",
    map_fragment: "#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, vUv );\n#endif",
    lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",
    lightmap_pars_vertex: "#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",
    lightmap_fragment: "#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",
    lightmap_vertex: "#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",
    lights_pars_vertex: "uniform bool enableLighting;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#ifdef PHONG\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif",
    lights_vertex: "if ( !enableLighting ) {\nvLightWeighting = vec3( 1.0 );\n} else {\nvLightWeighting = ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nfloat directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );\nvLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat pointLightWeighting = max( dot( transformedNormal, lVector ), 0.0 );\nvLightWeighting += pointLightColor[ i ] * pointLightWeighting * lDistance;\n#ifdef PHONG\nvPointLight[ i ] = vec4( lVector, lDistance );\n#endif\n}\n#endif\n}",
    lights_pars_fragment: "#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
    lights_fragment: "vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\nvec4 mColor = vec4( diffuse, opacity );\nvec4 mSpecular = vec4( specular, opacity );\n#if MAX_POINT_LIGHTS > 0\nvec4 pointDiffuse  = vec4( 0.0 );\nvec4 pointSpecular = vec4( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nvec3 pointHalfVector = normalize( vPointLight[ i ].xyz + vViewPosition );\nfloat pointDistance = vPointLight[ i ].w;\nfloat pointDotNormalHalf = dot( normal, pointHalfVector );\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\nfloat pointSpecularWeight = 0.0;\nif ( pointDotNormalHalf >= 0.0 )\npointSpecularWeight = pow( pointDotNormalHalf, shininess );\npointDiffuse  += mColor * pointDiffuseWeight * pointDistance;\npointSpecular += mSpecular * pointSpecularWeight * pointDistance;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec4 dirDiffuse  = vec4( 0.0 );\nvec4 dirSpecular = vec4( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nvec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );\nfloat dirDotNormalHalf = dot( normal, dirHalfVector );\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\nfloat dirSpecularWeight = 0.0;\nif ( dirDotNormalHalf >= 0.0 )\ndirSpecularWeight = pow( dirDotNormalHalf, shininess );\ndirDiffuse  += mColor * dirDiffuseWeight;\ndirSpecular += mSpecular * dirSpecularWeight;\n}\n#endif\nvec4 totalLight = vec4( ambient, opacity );\n#if MAX_DIR_LIGHTS > 0\ntotalLight += dirDiffuse + dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalLight += pointDiffuse + pointSpecular;\n#endif\ngl_FragColor = gl_FragColor * totalLight;",
    color_pars_fragment: "#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",
    color_fragment: "#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",
    color_pars_vertex: "#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",
    color_vertex: "#ifdef USE_COLOR\nvColor = color;\n#endif",
    skinning_pars_vertex: "#ifdef USE_SKINNING\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\n#endif",
    skinning_vertex: "#ifdef USE_SKINNING\ngl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;\ngl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;\ngl_Position  = projectionMatrix * viewMatrix * objectMatrix * gl_Position;\n#endif",
    morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\nuniform float morphTargetInfluences[ 8 ];\n#endif",
    morphtarget_vertex: "#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0, 0.0, 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\nmorphed += position;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );\n#endif",
    default_vertex: "#ifndef USE_MORPHTARGETS\n#ifndef USE_SKINNING\ngl_Position = projectionMatrix * mvPosition;\n#endif\n#endif"
};
THREE.UniformsUtils = {
    merge: function (b) {
        var c, e, f, g = {};
        for (c = 0; c < b.length; c++) for (e in f = this.clone(b[c]), f) g[e] = f[e];
        return g
    },
    clone: function (b) {
        var c, e, f, g = {};
        for (c in b) for (e in g[c] = {}, b[c]) f = b[c][e], g[c][e] = f instanceof THREE.Color || f instanceof THREE.Vector3 || f instanceof THREE.Texture ? f.clone() : f;
        return g
    }
};
THREE.UniformsLib = {
    common: {
        diffuse: {
            type: "c",
            value: new THREE.Color(15658734)
        },
        opacity: {
            type: "f",
            value: 1
        },
        map: {
            type: "t",
            value: 0,
            texture: null
        },
        offsetRepeat: {
            type: "v4",
            value: new THREE.Vector4(0, 0, 1, 1)
        },
        lightMap: {
            type: "t",
            value: 2,
            texture: null
        },
        envMap: {
            type: "t",
            value: 1,
            texture: null
        },
        useRefract: {
            type: "i",
            value: 0
        },
        reflectivity: {
            type: "f",
            value: 1
        },
        refractionRatio: {
            type: "f",
            value: 0.98
        },
        combine: {
            type: "i",
            value: 0
        },
        morphTargetInfluences: {
            type: "f",
            value: 0
        }
    },
    fog: {
        fogDensity: {
            type: "f",
            value: 2.5E-4
        },
        fogNear: {
            type: "f",
            value: 1
        },
        fogFar: {
            type: "f",
            value: 2E3
        },
        fogColor: {
            type: "c",
            value: new THREE.Color(16777215)
        }
    },
    lights: {
        enableLighting: {
            type: "i",
            value: 1
        },
        ambientLightColor: {
            type: "fv",
            value: []
        },
        directionalLightDirection: {
            type: "fv",
            value: []
        },
        directionalLightColor: {
            type: "fv",
            value: []
        },
        pointLightColor: {
            type: "fv",
            value: []
        },
        pointLightPosition: {
            type: "fv",
            value: []
        },
        pointLightDistance: {
            type: "fv1",
            value: []
        }
    },
    particle: {
        psColor: {
            type: "c",
            value: new THREE.Color(15658734)
        },
        opacity: {
            type: "f",
            value: 1
        },
        size: {
            type: "f",
            value: 1
        },
        scale: {
            type: "f",
            value: 1
        },
        map: {
            type: "t",
            value: 0,
            texture: null
        },
        fogDensity: {
            type: "f",
            value: 2.5E-4
        },
        fogNear: {
            type: "f",
            value: 1
        },
        fogFar: {
            type: "f",
            value: 2E3
        },
        fogColor: {
            type: "c",
            value: new THREE.Color(16777215)
        }
    }
};
THREE.ShaderLib = {
    lensFlareVertexTexture: {
        vertexShader: "uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 UV;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = UV;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
        fragmentShader: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D map;\nuniform float opacity;\nuniform int renderType;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 color = texture2D( map, vUV );\ncolor.a *= opacity * vVisibility;\ngl_FragColor = color;\n}\n}"
    },
    lensFlare: {
        vertexShader: "uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nattribute vec2 position;\nattribute vec2 UV;\nvarying vec2 vUV;\nvoid main() {\nvUV = UV;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
        fragmentShader: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform int renderType;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 color = texture2D( map, vUV );\ncolor.a *= opacity * visibility;\ngl_FragColor = color;\n}\n}"
    },
    sprite: {
        vertexShader: "uniform int useScreenCoordinates;\nuniform int affectedByDistance;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",
        fragmentShader: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUV;\nvoid main() {\nvec4 color = texture2D( map, vUV );\ncolor.a *= opacity;\ngl_FragColor = color;\n}"
    },
    shadowPost: {
        vertexShader: "uniform \tmat4 \tprojectionMatrix;\nattribute \tvec3 \tposition;\nvoid main() {\ngl_Position = projectionMatrix * vec4( position, 1.0 );\n}",
        fragmentShader: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform \tfloat \tdarkness;\nvoid main() {\ngl_FragColor = vec4( 0, 0, 0, darkness );\n}"
    },
    shadowVolumeDynamic: {
        uniforms: {
            directionalLightDirection: {
                type: "fv",
                value: []
            }
        },
        vertexShader: "uniform \tvec3 \tdirectionalLightDirection;\nvoid main() {\nvec4 pos      = objectMatrix * vec4( position, 1.0 );\nvec3 norm     = mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal;\nvec4 extruded = vec4( directionalLightDirection * 5000.0 * step( 0.0, dot( directionalLightDirection, norm ) ), 0.0 );\ngl_Position   = projectionMatrix * viewMatrix * ( pos + extruded );\n}",
        fragmentShader: "void main() {\ngl_FragColor = vec4( 1.0 );\n}"
    },
    depth: {
        uniforms: {
            mNear: {
                type: "f",
                value: 1
            },
            mFar: {
                type: "f",
                value: 2E3
            },
            opacity: {
                type: "f",
                value: 1
            }
        },
        fragmentShader: "uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}",
        vertexShader: "void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}"
    },
    normal: {
        uniforms: {
            opacity: {
                type: "f",
                value: 1
            }
        },
        fragmentShader: "uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}",
        vertexShader: "varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\ngl_Position = projectionMatrix * mvPosition;\n}"
    },
    basic: {
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.fog]),
        fragmentShader: ["uniform vec3 diffuse;\nuniform float opacity;",
        THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, "void main() {\ngl_FragColor = vec4( diffuse, opacity );", THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.fog_fragment, "}"].join("\n"),
        vertexShader: [THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex,
        THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, "void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.default_vertex, "}"].join("\n")
    },
    lambert: {
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common,
        THREE.UniformsLib.fog, THREE.UniformsLib.lights]),
        fragmentShader: ["uniform vec3 diffuse;\nuniform float opacity;\nvarying vec3 vLightWeighting;", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, "void main() {\ngl_FragColor = vec4( diffuse, opacity );\ngl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );", THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.lightmap_fragment,
        THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.fog_fragment, "}"].join("\n"),
        vertexShader: ["varying vec3 vLightWeighting;", THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, "void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", THREE.ShaderChunk.map_vertex,
        THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.color_vertex, "vec3 transformedNormal = normalize( normalMatrix * normal );", THREE.ShaderChunk.lights_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.default_vertex, "}"].join("\n")
    },
    phong: {
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.fog, THREE.UniformsLib.lights, {
            ambient: {
                type: "c",
                value: new THREE.Color(328965)
            },
            specular: {
                type: "c",
                value: new THREE.Color(1118481)
            },
            shininess: {
                type: "f",
                value: 30
            }
        }]),
        fragmentShader: ["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 specular;\nuniform float shininess;\nvarying vec3 vLightWeighting;", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.lights_pars_fragment, "void main() {\ngl_FragColor = vec4( vLightWeighting, 1.0 );", THREE.ShaderChunk.lights_fragment,
        THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.fog_fragment, "}"].join("\n"),
        vertexShader: ["#define PHONG\nvarying vec3 vLightWeighting;\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;", THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex,
        THREE.ShaderChunk.morphtarget_pars_vertex, "void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.color_vertex, "#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = cameraPosition - mPosition.xyz;\nvec3 transformedNormal = normalize( normalMatrix * normal );\nvNormal = transformedNormal;", THREE.ShaderChunk.lights_vertex,
        THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.default_vertex, "}"].join("\n")
    },
    particle_basic: {
        uniforms: THREE.UniformsLib.particle,
        fragmentShader: ["uniform vec3 psColor;\nuniform float opacity;", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_particle_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, "void main() {\ngl_FragColor = vec4( psColor, opacity );", THREE.ShaderChunk.map_particle_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.fog_fragment,
            "}"].join("\n"),
        vertexShader: ["uniform float size;\nuniform float scale;", THREE.ShaderChunk.color_pars_vertex, "void main() {", THREE.ShaderChunk.color_vertex, "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;\n}"].join("\n")
    }
};
THREE.WebGLRenderer = function (b) {
    function c(b, e, c) {
        var f, g, h, k = b.vertices,
            m = k.length,
            n = b.colors,
            t = n.length,
            p = b.__vertexArray,
            o = b.__colorArray,
            u = b.__sortArray,
            v = b.__dirtyVertices,
            w = b.__dirtyColors;
        if (c.sortParticles) {
            Y.multiplySelf(c.matrixWorld);
            for (f = 0; f < m; f++) g = k[f].position, ga.copy(g), Y.multiplyVector3(ga), u[f] = [ga.z, f];
            u.sort(function (b, e) {
                return e[0] - b[0]
            });
            for (f = 0; f < m; f++) g = k[u[f][1]].position, h = f * 3, p[h] = g.x, p[h + 1] = g.y, p[h + 2] = g.z;
            for (f = 0; f < t; f++) h = f * 3, color = n[u[f][1]], o[h] = color.r, o[h + 1] = color.g,
            o[h + 2] = color.b
        } else {
            if (v) for (f = 0; f < m; f++) g = k[f].position, h = f * 3, p[h] = g.x, p[h + 1] = g.y, p[h + 2] = g.z;
            if (w) for (f = 0; f < t; f++) color = n[f], h = f * 3, o[h] = color.r, o[h + 1] = color.g, o[h + 2] = color.b
        }
        if (v || c.sortParticles) j.bindBuffer(j.ARRAY_BUFFER, b.__webglVertexBuffer), j.bufferData(j.ARRAY_BUFFER, p, e);
        if (w || c.sortParticles) j.bindBuffer(j.ARRAY_BUFFER, b.__webglColorBuffer), j.bufferData(j.ARRAY_BUFFER, o, e)
    }
    function e(b, e, c, f, g) {
        f.program || ea.initMaterial(f, e, c, g);
        var h = f.program,
            k = h.uniforms,
            m = f.uniforms;
        h != T && (j.useProgram(h),
        T = h);
        j.uniformMatrix4fv(k.projectionMatrix, !1, ka);
        if (c && (f instanceof THREE.MeshBasicMaterial || f instanceof THREE.MeshLambertMaterial || f instanceof THREE.MeshPhongMaterial || f instanceof THREE.LineBasicMaterial || f instanceof THREE.ParticleBasicMaterial || f.fog)) if (m.fogColor.value = c.color, c instanceof THREE.Fog) m.fogNear.value = c.near, m.fogFar.value = c.far;
        else if (c instanceof THREE.FogExp2) m.fogDensity.value = c.density;
        if (f instanceof THREE.MeshPhongMaterial || f instanceof THREE.MeshLambertMaterial || f.lights) {
            var n,
            t, p = 0,
                o = 0,
                u = 0,
                v, w, y, A, B = Da,
                z = B.directional.colors,
                H = B.directional.positions,
                G = B.point.colors,
                D = B.point.positions,
                Y = B.point.distances,
                C = 0,
                E = 0,
                c = t = A = 0;
            for (n = e.length; c < n; c++) if (t = e[c], v = t.color, w = t.position, y = t.intensity, A = t.distance, t instanceof THREE.AmbientLight) p += v.r, o += v.g, u += v.b;
            else if (t instanceof THREE.DirectionalLight) A = C * 3, z[A] = v.r * y, z[A + 1] = v.g * y, z[A + 2] = v.b * y, H[A] = w.x, H[A + 1] = w.y, H[A + 2] = w.z, C += 1;
            else if (t instanceof THREE.PointLight) t = E * 3, G[t] = v.r * y, G[t + 1] = v.g * y, G[t + 2] = v.b * y, D[t] = w.x, D[t + 1] = w.y, D[t + 2] = w.z, Y[E] = A, E += 1;
            for (c = C * 3; c < z.length; c++) z[c] = 0;
            for (c = E * 3; c < G.length; c++) G[c] = 0;
            B.point.length = E;
            B.directional.length = C;
            B.ambient[0] = p;
            B.ambient[1] = o;
            B.ambient[2] = u;
            c = Da;
            m.enableLighting.value = c.directional.length + c.point.length;
            m.ambientLightColor.value = c.ambient;
            m.directionalLightColor.value = c.directional.colors;
            m.directionalLightDirection.value = c.directional.positions;
            m.pointLightColor.value = c.point.colors;
            m.pointLightPosition.value = c.point.positions;
            m.pointLightDistance.value = c.point.distances
        }
        if (f instanceof
        THREE.MeshBasicMaterial || f instanceof THREE.MeshLambertMaterial || f instanceof THREE.MeshPhongMaterial) m.diffuse.value = f.color, m.opacity.value = f.opacity, (m.map.texture = f.map) && m.offsetRepeat.value.set(f.map.offset.x, f.map.offset.y, f.map.repeat.x, f.map.repeat.y), m.lightMap.texture = f.lightMap, m.envMap.texture = f.envMap, m.reflectivity.value = f.reflectivity, m.refractionRatio.value = f.refractionRatio, m.combine.value = f.combine, m.useRefract.value = f.envMap && f.envMap.mapping instanceof THREE.CubeRefractionMapping;
        if (f instanceof THREE.LineBasicMaterial) m.diffuse.value = f.color, m.opacity.value = f.opacity;
        else if (f instanceof THREE.ParticleBasicMaterial) m.psColor.value = f.color, m.opacity.value = f.opacity, m.size.value = f.size, m.scale.value = ua.height / 2, m.map.texture = f.map;
        else if (f instanceof THREE.MeshPhongMaterial) m.ambient.value = f.ambient, m.specular.value = f.specular, m.shininess.value = f.shininess;
        else if (f instanceof THREE.MeshDepthMaterial) m.mNear.value = b.near, m.mFar.value = b.far, m.opacity.value = f.opacity;
        else if (f instanceof
        THREE.MeshNormalMaterial) m.opacity.value = f.opacity;
        for (var F in m) if (o = h.uniforms[F]) if (n = m[F], p = n.type, c = n.value, p == "i") j.uniform1i(o, c);
        else if (p == "f") j.uniform1f(o, c);
        else if (p == "fv1") j.uniform1fv(o, c);
        else if (p == "fv") j.uniform3fv(o, c);
        else if (p == "v2") j.uniform2f(o, c.x, c.y);
        else if (p == "v3") j.uniform3f(o, c.x, c.y, c.z);
        else if (p == "v4") j.uniform4f(o, c.x, c.y, c.z, c.w);
        else if (p == "c") j.uniform3f(o, c.r, c.g, c.b);
        else if (p == "t" && (j.uniform1i(o, c), n = n.texture)) if (n.image instanceof Array && n.image.length == 6) {
            if (n.image.length == 6) {
                if (n.needsUpdate) {
                    if (n.__webglInit) {
                        j.bindTexture(j.TEXTURE_CUBE_MAP, n.image.__webglTextureCube);
                        for (p = 0; p < 6; ++p) j.texSubImage2D(j.TEXTURE_CUBE_MAP_POSITIVE_X + p, 0, 0, 0, j.RGBA, j.UNSIGNED_BYTE, n.image[p])
                    } else {
                        n.image.__webglTextureCube = j.createTexture();
                        j.bindTexture(j.TEXTURE_CUBE_MAP, n.image.__webglTextureCube);
                        for (p = 0; p < 6; ++p) j.texImage2D(j.TEXTURE_CUBE_MAP_POSITIVE_X + p, 0, j.RGBA, j.RGBA, j.UNSIGNED_BYTE, n.image[p]);
                        n.__webglInit = !0
                    }
                    Q(j.TEXTURE_CUBE_MAP, n, n.image[0]);
                    j.bindTexture(j.TEXTURE_CUBE_MAP,
                    null);
                    n.needsUpdate = !1
                }
                j.activeTexture(j.TEXTURE0 + c);
                j.bindTexture(j.TEXTURE_CUBE_MAP, n.image.__webglTextureCube)
            }
        } else J(n, c);
        j.uniformMatrix4fv(k.modelViewMatrix, !1, g._modelViewMatrixArray);
        j.uniformMatrix3fv(k.normalMatrix, !1, g._normalMatrixArray);
        (f instanceof THREE.MeshShaderMaterial || f instanceof THREE.MeshPhongMaterial || f.envMap) && k.cameraPosition !== null && j.uniform3f(k.cameraPosition, b.position.x, b.position.y, b.position.z);
        (f instanceof THREE.MeshShaderMaterial || f.envMap || f.skinning) && k.objectMatrix !== null && j.uniformMatrix4fv(k.objectMatrix, !1, g._objectMatrixArray);
        (f instanceof THREE.MeshPhongMaterial || f instanceof THREE.MeshLambertMaterial || f instanceof THREE.MeshShaderMaterial || f.skinning) && k.viewMatrix !== null && j.uniformMatrix4fv(k.viewMatrix, !1, la);
        if (f instanceof THREE.ShadowVolumeDynamicMaterial) b = m.directionalLightDirection.value, b[0] = -e[1].position.x, b[1] = -e[1].position.y, b[2] = -e[1].position.z, j.uniform3fv(k.directionalLightDirection, b), j.uniformMatrix4fv(k.objectMatrix, !1, g._objectMatrixArray),
        j.uniformMatrix4fv(k.viewMatrix, !1, la);
        f.skinning && (j.uniformMatrix4fv(k.cameraInverseMatrix, !1, la), j.uniformMatrix4fv(k.boneGlobalMatrices, !1, g.boneMatrices));
        return h
    }
    function f(b, c, f, g, h, k) {
        if (g.opacity != 0) {
            var m, b = e(b, c, f, g, k).attributes;
            if (!g.morphTargets && b.position >= 0) j.bindBuffer(j.ARRAY_BUFFER, h.__webglVertexBuffer), j.vertexAttribPointer(b.position, 3, j.FLOAT, !1, 0, 0);
            else {
                c = g.program.attributes;
                k.morphTargetBase !== -1 ? (j.bindBuffer(j.ARRAY_BUFFER, h.__webglMorphTargetsBuffers[k.morphTargetBase]),
                j.vertexAttribPointer(c.position, 3, j.FLOAT, !1, 0, 0)) : c.position >= 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglVertexBuffer), j.vertexAttribPointer(c.position, 3, j.FLOAT, !1, 0, 0));
                if (k.morphTargetForcedOrder.length) for (var f = 0, n = k.morphTargetForcedOrder, t = k.morphTargetInfluences; f < g.numSupportedMorphTargets && f < n.length;) j.bindBuffer(j.ARRAY_BUFFER, h.__webglMorphTargetsBuffers[n[f]]), j.vertexAttribPointer(c["morphTarget" + f], 3, j.FLOAT, !1, 0, 0), k.__webglMorphTargetInfluences[f] = t[n[f]], f++;
                else {
                    var n = [],
                        p = -1,
                        o = 0,
                        t = k.morphTargetInfluences,
                        u, v = t.length,
                        f = 0;
                    for (k.morphTargetBase !== -1 && (n[k.morphTargetBase] = !0); f < g.numSupportedMorphTargets;) {
                        for (u = 0; u < v; u++)!n[u] && t[u] > p && (o = u, p = t[o]);
                        j.bindBuffer(j.ARRAY_BUFFER, h.__webglMorphTargetsBuffers[o]);
                        j.vertexAttribPointer(c["morphTarget" + f], 3, j.FLOAT, !1, 0, 0);
                        k.__webglMorphTargetInfluences[f] = p;
                        n[o] = 1;
                        p = -1;
                        f++
                    }
                }
                g.program.uniforms.morphTargetInfluences !== null && j.uniform1fv(g.program.uniforms.morphTargetInfluences, k.__webglMorphTargetInfluences)
            }
            if (h.__webglCustomAttributes) for (m in h.__webglCustomAttributes) b[m] >= 0 && (c = h.__webglCustomAttributes[m], j.bindBuffer(j.ARRAY_BUFFER, c.buffer), j.vertexAttribPointer(b[m], c.size, j.FLOAT, !1, 0, 0));
            b.color >= 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglColorBuffer), j.vertexAttribPointer(b.color, 3, j.FLOAT, !1, 0, 0));
            b.normal >= 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglNormalBuffer), j.vertexAttribPointer(b.normal, 3, j.FLOAT, !1, 0, 0));
            b.tangent >= 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglTangentBuffer), j.vertexAttribPointer(b.tangent, 4, j.FLOAT, !1, 0, 0));
            b.uv >= 0 && (h.__webglUVBuffer ? (j.bindBuffer(j.ARRAY_BUFFER,
            h.__webglUVBuffer), j.vertexAttribPointer(b.uv, 2, j.FLOAT, !1, 0, 0), j.enableVertexAttribArray(b.uv)) : j.disableVertexAttribArray(b.uv));
            b.uv2 >= 0 && (h.__webglUV2Buffer ? (j.bindBuffer(j.ARRAY_BUFFER, h.__webglUV2Buffer), j.vertexAttribPointer(b.uv2, 2, j.FLOAT, !1, 0, 0), j.enableVertexAttribArray(b.uv2)) : j.disableVertexAttribArray(b.uv2));
            g.skinning && b.skinVertexA >= 0 && b.skinVertexB >= 0 && b.skinIndex >= 0 && b.skinWeight >= 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglSkinVertexABuffer), j.vertexAttribPointer(b.skinVertexA, 4,
            j.FLOAT, !1, 0, 0), j.bindBuffer(j.ARRAY_BUFFER, h.__webglSkinVertexBBuffer), j.vertexAttribPointer(b.skinVertexB, 4, j.FLOAT, !1, 0, 0), j.bindBuffer(j.ARRAY_BUFFER, h.__webglSkinIndicesBuffer), j.vertexAttribPointer(b.skinIndex, 4, j.FLOAT, !1, 0, 0), j.bindBuffer(j.ARRAY_BUFFER, h.__webglSkinWeightsBuffer), j.vertexAttribPointer(b.skinWeight, 4, j.FLOAT, !1, 0, 0));
            k instanceof THREE.Mesh ? (g.wireframe ? (j.lineWidth(g.wireframeLinewidth), j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, h.__webglLineBuffer), j.drawElements(j.LINES, h.__webglLineCount,
            j.UNSIGNED_SHORT, 0)) : (j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, h.__webglFaceBuffer), j.drawElements(j.TRIANGLES, h.__webglFaceCount, j.UNSIGNED_SHORT, 0)), ea.data.vertices += h.__webglFaceCount, ea.data.faces += h.__webglFaceCount / 3, ea.data.drawCalls++) : k instanceof THREE.Line ? (k = k.type == THREE.LineStrip ? j.LINE_STRIP : j.LINES, j.lineWidth(g.linewidth), j.drawArrays(k, 0, h.__webglLineCount), ea.data.drawCalls++) : k instanceof THREE.ParticleSystem ? (j.drawArrays(j.POINTS, 0, h.__webglParticleCount), ea.data.drawCalls++) : k instanceof
            THREE.Ribbon && (j.drawArrays(j.TRIANGLE_STRIP, 0, h.__webglVertexCount), ea.data.drawCalls++)
        }
    }
    function g(b, e, c) {
        if (!b.__webglVertexBuffer) b.__webglVertexBuffer = j.createBuffer();
        if (!b.__webglNormalBuffer) b.__webglNormalBuffer = j.createBuffer();
        b.hasPos && (j.bindBuffer(j.ARRAY_BUFFER, b.__webglVertexBuffer), j.bufferData(j.ARRAY_BUFFER, b.positionArray, j.DYNAMIC_DRAW), j.enableVertexAttribArray(e.attributes.position), j.vertexAttribPointer(e.attributes.position, 3, j.FLOAT, !1, 0, 0));
        if (b.hasNormal) {
            j.bindBuffer(j.ARRAY_BUFFER,
            b.__webglNormalBuffer);
            if (c == THREE.FlatShading) {
                var f, g, h, k, m, n, t, p, o, u, v = b.count * 3;
                for (u = 0; u < v; u += 9) c = b.normalArray, f = c[u], g = c[u + 1], h = c[u + 2], k = c[u + 3], n = c[u + 4], p = c[u + 5], m = c[u + 6], t = c[u + 7], o = c[u + 8], f = (f + k + m) / 3, g = (g + n + t) / 3, h = (h + p + o) / 3, c[u] = f, c[u + 1] = g, c[u + 2] = h, c[u + 3] = f, c[u + 4] = g, c[u + 5] = h, c[u + 6] = f, c[u + 7] = g, c[u + 8] = h
            }
            j.bufferData(j.ARRAY_BUFFER, b.normalArray, j.DYNAMIC_DRAW);
            j.enableVertexAttribArray(e.attributes.normal);
            j.vertexAttribPointer(e.attributes.normal, 3, j.FLOAT, !1, 0, 0)
        }
        j.drawArrays(j.TRIANGLES,
        0, b.count);
        b.count = 0
    }
    function k(b) {
        if (da != b.doubleSided) b.doubleSided ? j.disable(j.CULL_FACE) : j.enable(j.CULL_FACE), da = b.doubleSided;
        if (X != b.flipSided) b.flipSided ? j.frontFace(j.CW) : j.frontFace(j.CCW), X = b.flipSided
    }
    function h(b) {
        ia != b && (b ? j.enable(j.DEPTH_TEST) : j.disable(j.DEPTH_TEST), ia = b)
    }
    function m(b, e, c) {
        ha != b && (b ? j.enable(j.POLYGON_OFFSET_FILL) : j.disable(j.POLYGON_OFFSET_FILL), ha = b);
        if (b && (na != e || ja != c)) j.polygonOffset(e, c), na = e, ja = c
    }
    function n(b) {
        $[0].set(b.n41 - b.n11, b.n42 - b.n12, b.n43 - b.n13, b.n44 - b.n14);
        $[1].set(b.n41 + b.n11, b.n42 + b.n12, b.n43 + b.n13, b.n44 + b.n14);
        $[2].set(b.n41 + b.n21, b.n42 + b.n22, b.n43 + b.n23, b.n44 + b.n24);
        $[3].set(b.n41 - b.n21, b.n42 - b.n22, b.n43 - b.n23, b.n44 - b.n24);
        $[4].set(b.n41 - b.n31, b.n42 - b.n32, b.n43 - b.n33, b.n44 - b.n34);
        $[5].set(b.n41 + b.n31, b.n42 + b.n32, b.n43 + b.n33, b.n44 + b.n34);
        for (var e, b = 0; b < 6; b++) e = $[b], e.divideScalar(Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z))
    }
    function o(b) {
        for (var e = b.matrixWorld, c = -b.geometry.boundingSphere.radius * Math.max(b.scale.x, Math.max(b.scale.y, b.scale.z)),
        f = 0; f < 6; f++) if (b = $[f].x * e.n14 + $[f].y * e.n24 + $[f].z * e.n34 + $[f].w, b <= c) return !1;
        return !0
    }
    function p(b, e) {
        b.list[b.count] = e;
        b.count += 1
    }
    function t(b) {
        var e, c, f = b.object,
            j = b.opaque,
            g = b.transparent;
        g.count = 0;
        b = j.count = 0;
        for (e = f.materials.length; b < e; b++) c = f.materials[b], c.transparent ? p(g, c) : p(j, c)
    }
    function v(b) {
        var e, c, f, j, g = b.object,
            h = b.buffer,
            k = b.opaque,
            m = b.transparent;
        m.count = 0;
        b = k.count = 0;
        for (f = g.materials.length; b < f; b++) if (e = g.materials[b], e instanceof THREE.MeshFaceMaterial) {
            e = 0;
            for (c = h.materials.length; e < c; e++)(j = h.materials[e]) && (j.transparent ? p(m, j) : p(k, j))
        } else(j = e) && (j.transparent ? p(m, j) : p(k, j))
    }
    function u(b, e) {
        return e.z - b.z
    }
    function w(b) {
        j.enable(j.POLYGON_OFFSET_FILL);
        j.polygonOffset(0.1, 1);
        j.enable(j.STENCIL_TEST);
        j.enable(j.DEPTH_TEST);
        j.depthMask(!1);
        j.colorMask(!1, !1, !1, !1);
        j.stencilFunc(j.ALWAYS, 1, 255);
        j.stencilOpSeparate(j.BACK, j.KEEP, j.INCR, j.KEEP);
        j.stencilOpSeparate(j.FRONT, j.KEEP, j.DECR, j.KEEP);
        var e, c = b.lights.length,
            f, g = b.lights,
            h = [],
            k, m, n, t, p, o = b.__webglShadowVolumes.length;
        for (e = 0; e < c; e++) if (f = b.lights[e], f instanceof THREE.DirectionalLight && f.castShadow) {
            h[0] = -f.position.x;
            h[1] = -f.position.y;
            h[2] = -f.position.z;
            for (p = 0; p < o; p++) f = b.__webglShadowVolumes[p].object, k = b.__webglShadowVolumes[p].buffer, m = f.materials[0], m.program || ea.initMaterial(m, g, void 0, f), m = m.program, n = m.uniforms, t = m.attributes, T !== m && (j.useProgram(m), T = m, j.uniformMatrix4fv(n.projectionMatrix, !1, ka), j.uniformMatrix4fv(n.viewMatrix, !1, la), j.uniform3fv(n.directionalLightDirection, h)), f.matrixWorld.flattenToArray(f._objectMatrixArray),
            j.uniformMatrix4fv(n.objectMatrix, !1, f._objectMatrixArray), j.bindBuffer(j.ARRAY_BUFFER, k.__webglVertexBuffer), j.vertexAttribPointer(t.position, 3, j.FLOAT, !1, 0, 0), j.bindBuffer(j.ARRAY_BUFFER, k.__webglNormalBuffer), j.vertexAttribPointer(t.normal, 3, j.FLOAT, !1, 0, 0), j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, k.__webglFaceBuffer), j.cullFace(j.FRONT), j.drawElements(j.TRIANGLES, k.__webglFaceCount, j.UNSIGNED_SHORT, 0), j.cullFace(j.BACK), j.drawElements(j.TRIANGLES, k.__webglFaceCount, j.UNSIGNED_SHORT, 0)
        }
        j.disable(j.POLYGON_OFFSET_FILL);
        j.colorMask(!0, !0, !0, !0);
        j.stencilFunc(j.NOTEQUAL, 0, 255);
        j.stencilOp(j.KEEP, j.KEEP, j.KEEP);
        j.disable(j.DEPTH_TEST);
        aa = -1;
        T = R.program;
        j.useProgram(R.program);
        j.uniformMatrix4fv(R.projectionLocation, !1, ka);
        j.uniform1f(R.darknessLocation, R.darkness);
        j.bindBuffer(j.ARRAY_BUFFER, R.vertexBuffer);
        j.vertexAttribPointer(R.vertexLocation, 3, j.FLOAT, !1, 0, 0);
        j.enableVertexAttribArray(R.vertexLocation);
        j.blendFunc(j.ONE, j.ONE_MINUS_SRC_ALPHA);
        j.blendEquation(j.FUNC_ADD);
        j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, R.elementBuffer);
        j.drawElements(j.TRIANGLES, 6, j.UNSIGNED_SHORT, 0);
        j.disable(j.STENCIL_TEST);
        j.enable(j.DEPTH_TEST);
        j.depthMask(N)
    }
    function B(b, e) {
        var c, f, g;
        c = P.attributes;
        var h = P.uniforms,
            k = U / W,
            m, n = [],
            t = W * 0.5,
            p = U * 0.5,
            o = !0;
        j.useProgram(P.program);
        T = P.program;
        aa = -1;
        Ba || (j.enableVertexAttribArray(P.attributes.position), j.enableVertexAttribArray(P.attributes.uv), Ba = !0);
        j.disable(j.CULL_FACE);
        j.enable(j.BLEND);
        j.depthMask(!0);
        j.bindBuffer(j.ARRAY_BUFFER, P.vertexBuffer);
        j.vertexAttribPointer(c.position, 2, j.FLOAT, !1, 16,
        0);
        j.vertexAttribPointer(c.uv, 2, j.FLOAT, !1, 16, 8);
        j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, P.elementBuffer);
        j.uniformMatrix4fv(h.projectionMatrix, !1, ka);
        j.activeTexture(j.TEXTURE0);
        j.uniform1i(h.map, 0);
        c = 0;
        for (f = b.__webglSprites.length; c < f; c++) g = b.__webglSprites[c], g.useScreenCoordinates ? g.z = -g.position.z : (g._modelViewMatrix.multiplyToArray(e.matrixWorldInverse, g.matrixWorld, g._modelViewMatrixArray), g.z = -g._modelViewMatrix.n34);
        b.__webglSprites.sort(u);
        c = 0;
        for (f = b.__webglSprites.length; c < f; c++) g = b.__webglSprites[c],
        g.material === void 0 && g.map && g.map.image && g.map.image.width && (g.useScreenCoordinates ? (j.uniform1i(h.useScreenCoordinates, 1), j.uniform3f(h.screenPosition, (g.position.x - t) / t, (p - g.position.y) / p, Math.max(0, Math.min(1, g.position.z)))) : (j.uniform1i(h.useScreenCoordinates, 0), j.uniform1i(h.affectedByDistance, g.affectedByDistance ? 1 : 0), j.uniformMatrix4fv(h.modelViewMatrix, !1, g._modelViewMatrixArray)), m = g.map.image.width / (g.scaleByViewport ? U : 1), n[0] = m * k * g.scale.x, n[1] = m * g.scale.y, j.uniform2f(h.uvScale, g.uvScale.x,
        g.uvScale.y), j.uniform2f(h.uvOffset, g.uvOffset.x, g.uvOffset.y), j.uniform2f(h.alignment, g.alignment.x, g.alignment.y), j.uniform1f(h.opacity, g.opacity), j.uniform1f(h.rotation, g.rotation), j.uniform2fv(h.scale, n), g.mergeWith3D && !o ? (j.enable(j.DEPTH_TEST), o = !0) : !g.mergeWith3D && o && (j.disable(j.DEPTH_TEST), o = !1), D(g.blending), J(g.map, 0), j.drawElements(j.TRIANGLES, 6, j.UNSIGNED_SHORT, 0));
        j.enable(j.CULL_FACE);
        j.enable(j.DEPTH_TEST);
        j.depthMask(N)
    }
    function A(b, e) {
        var c, f, g = b.__webglLensFlares.length,
            h, k, m, n = new THREE.Vector3,
            t = U / W,
            p = W * 0.5,
            o = U * 0.5,
            u = 16 / U,
            v = [u * t, u],
            w = [1, 1, 0],
            y = [1, 1],
            A = O.uniforms;
        c = O.attributes;
        j.useProgram(O.program);
        T = O.program;
        aa = -1;
        ra || (j.enableVertexAttribArray(O.attributes.vertex), j.enableVertexAttribArray(O.attributes.uv), ra = !0);
        j.uniform1i(A.occlusionMap, 0);
        j.uniform1i(A.map, 1);
        j.bindBuffer(j.ARRAY_BUFFER, O.vertexBuffer);
        j.vertexAttribPointer(c.vertex, 2, j.FLOAT, !1, 16, 0);
        j.vertexAttribPointer(c.uv, 2, j.FLOAT, !1, 16, 8);
        j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, O.elementBuffer);
        j.disable(j.CULL_FACE);
        j.depthMask(!1);
        j.activeTexture(j.TEXTURE0);
        j.bindTexture(j.TEXTURE_2D, O.occlusionTexture);
        j.activeTexture(j.TEXTURE1);
        for (f = 0; f < g; f++) if (c = b.__webglLensFlares[f].object, n.set(c.matrixWorld.n14, c.matrixWorld.n24, c.matrixWorld.n34), e.matrixWorldInverse.multiplyVector3(n), e.projectionMatrix.multiplyVector3(n), w[0] = n.x, w[1] = n.y, w[2] = n.z, y[0] = w[0] * p + p, y[1] = w[1] * o + o, O.hasVertexTexture || y[0] > 0 && y[0] < W && y[1] > 0 && y[1] < U) {
            j.bindTexture(j.TEXTURE_2D, O.tempTexture);
            j.copyTexImage2D(j.TEXTURE_2D, 0, j.RGB, y[0] - 8, y[1] - 8, 16, 16, 0);
            j.uniform1i(A.renderType, 0);
            j.uniform2fv(A.scale, v);
            j.uniform3fv(A.screenPosition, w);
            j.disable(j.BLEND);
            j.enable(j.DEPTH_TEST);
            j.drawElements(j.TRIANGLES, 6, j.UNSIGNED_SHORT, 0);
            j.bindTexture(j.TEXTURE_2D, O.occlusionTexture);
            j.copyTexImage2D(j.TEXTURE_2D, 0, j.RGBA, y[0] - 8, y[1] - 8, 16, 16, 0);
            j.uniform1i(A.renderType, 1);
            j.disable(j.DEPTH_TEST);
            j.bindTexture(j.TEXTURE_2D, O.tempTexture);
            j.drawElements(j.TRIANGLES, 6, j.UNSIGNED_SHORT, 0);
            c.positionScreen.x = w[0];
            c.positionScreen.y = w[1];
            c.positionScreen.z = w[2];
            c.customUpdateCallback ? c.customUpdateCallback(c) : c.updateLensFlares();
            j.uniform1i(A.renderType, 2);
            j.enable(j.BLEND);
            h = 0;
            for (k = c.lensFlares.length; h < k; h++) if (m = c.lensFlares[h], m.opacity > 0.001 && m.scale > 0.001) w[0] = m.x, w[1] = m.y, w[2] = m.z, u = m.size * m.scale / U, v[0] = u * t, v[1] = u, j.uniform3fv(A.screenPosition, w), j.uniform2fv(A.scale, v), j.uniform1f(A.rotation, m.rotation), j.uniform1f(A.opacity, m.opacity), D(m.blending), J(m.texture, 1), j.drawElements(j.TRIANGLES, 6, j.UNSIGNED_SHORT, 0)
        }
        j.enable(j.CULL_FACE);
        j.enable(j.DEPTH_TEST);
        j.depthMask(N)
    }
    function y(b, e) {
        b._modelViewMatrix.multiplyToArray(e.matrixWorldInverse, b.matrixWorld, b._modelViewMatrixArray);
        THREE.Matrix4.makeInvert3x3(b._modelViewMatrix).transposeIntoArray(b._normalMatrixArray)
    }
    function G(b) {
        var e, f, g, h;
        if (b instanceof THREE.Mesh) {
            f = b.geometry;
            for (e in f.geometryGroups) {
                g = f.geometryGroups[e];
                a: {
                    for (var k = h = void 0, m = void 0, n = void 0, t = void 0, t = g.__materials, k = 0, m = t.length; k < m; k++) if (n = t[k], n.attributes) for (h in n.attributes) if (n.attributes[h].needsUpdate) {
                        h = !0;
                        break a
                    }
                    h = !1
                }
                if (f.__dirtyVertices || f.__dirtyMorphTargets || f.__dirtyElements || f.__dirtyUvs || f.__dirtyNormals || f.__dirtyColors || f.__dirtyTangents || h) if (h = g, k = b, m = j.DYNAMIC_DRAW, h.__inittedArrays) {
                    var p = t = n = void 0,
                        o = void 0,
                        u = p = void 0,
                        v = void 0,
                        w = void 0,
                        y = void 0,
                        A = void 0,
                        B = void 0,
                        z = void 0,
                        H = void 0,
                        G = void 0,
                        D = void 0,
                        Y = void 0,
                        C = void 0,
                        ka = void 0,
                        E = o = y = o = w = v = void 0,
                        F = void 0,
                        x = F = E = v = void 0,
                        K = void 0,
                        J = x = F = E = p = p = u = y = o = x = F = E = K = x = F = E = K = x = F = E = void 0,
                        I = 0,
                        L = 0,
                        N = 0,
                        P = 0,
                        la = 0,
                        O = 0,
                        ga = 0,
                        aa = 0,
                        Q = 0,
                        M = 0,
                        R = 0,
                        F = E = 0,
                        S = h.__vertexArray,
                        ca = h.__uvArray,
                        ea = h.__uv2Array,
                        da = h.__normalArray,
                        T = h.__tangentArray,
                        Z = h.__colorArray,
                        U = h.__skinVertexAArray,
                        W = h.__skinVertexBArray,
                        X = h.__skinIndexArray,
                        $ = h.__skinWeightArray,
                        Da = h.__morphTargetsArrays,
                        ia = h.__webglCustomAttributes,
                        x = void 0,
                        fa = h.__faceArray,
                        ha = h.__lineArray,
                        na = h.__needsSmoothNormals,
                        B = h.__vertexColorType,
                        A = h.__uvType,
                        z = h.__normalType,
                        ja = k.geometry,
                        ua = ja.__dirtyVertices,
                        oa = ja.__dirtyElements,
                        qa = ja.__dirtyUvs,
                        ra = ja.__dirtyNormals,
                        Aa = ja.__dirtyTangents,
                        va = ja.__dirtyColors,
                        ya = ja.__dirtyMorphTargets,
                        xa = ja.vertices,
                        Ba = h.faces,
                        Za = ja.faces,
                        Xa = ja.faceVertexUvs[0],
                        Ya = ja.faceVertexUvs[1],
                        Ka = ja.skinVerticesA,
                        La = ja.skinVerticesB,
                        Ma = ja.skinIndices,
                        Fa = ja.skinWeights,
                        Ia = k instanceof THREE.ShadowVolume ? ja.edgeFaces : void 0,
                        Ca = ja.morphTargets;
                    if (ia) for (J in ia) ia[J].offset = 0, ia[J].offsetSrc = 0;
                    n = 0;
                    for (t = Ba.length; n < t; n++) if (p = Ba[n], o = Za[p], Xa && (H = Xa[p]), Ya && (G = Ya[p]), p = o.vertexNormals, u = o.normal, v = o.vertexColors, w = o.color, y = o.vertexTangents, o instanceof THREE.Face3) {
                        if (ua) D = xa[o.a].position, Y = xa[o.b].position,
                        C = xa[o.c].position, S[L] = D.x, S[L + 1] = D.y, S[L + 2] = D.z, S[L + 3] = Y.x, S[L + 4] = Y.y, S[L + 5] = Y.z, S[L + 6] = C.x, S[L + 7] = C.y, S[L + 8] = C.z, L += 9;
                        if (ia) for (J in ia) if (x = ia[J], x.__original.needsUpdate) E = x.offset, F = x.offsetSrc, x.size === 1 ? (x.boundTo === void 0 || x.boundTo === "vertices" ? (x.array[E + 0] = x.value[o.a], x.array[E + 1] = x.value[o.b], x.array[E + 2] = x.value[o.c]) : x.boundTo === "faces" ? (x.array[E + 0] = x.value[F], x.array[E + 1] = x.value[F], x.array[E + 2] = x.value[F], x.offsetSrc++) : x.boundTo === "faceVertices" && (x.array[E + 0] = x.value[F + 0], x.array[E + 1] = x.value[F + 1], x.array[E + 2] = x.value[F + 2], x.offsetSrc += 3), x.offset += 3) : (x.boundTo === void 0 || x.boundTo === "vertices" ? (D = x.value[o.a], Y = x.value[o.b], C = x.value[o.c]) : x.boundTo === "faces" ? (D = x.value[F], Y = x.value[F], C = x.value[F], x.offsetSrc++) : x.boundTo === "faceVertices" && (D = x.value[F + 0], Y = x.value[F + 1], C = x.value[F + 2], x.offsetSrc += 3), x.size === 2 ? (x.array[E + 0] = D.x, x.array[E + 1] = D.y, x.array[E + 2] = Y.x, x.array[E + 3] = Y.y, x.array[E + 4] = C.x, x.array[E + 5] = C.y, x.offset += 6) : x.size === 3 ? (x.type === "c" ? (x.array[E + 0] = D.r, x.array[E + 1] = D.g, x.array[E + 2] = D.b, x.array[E + 3] = Y.r, x.array[E + 4] = Y.g, x.array[E + 5] = Y.b, x.array[E + 6] = C.r, x.array[E + 7] = C.g, x.array[E + 8] = C.b) : (x.array[E + 0] = D.x, x.array[E + 1] = D.y, x.array[E + 2] = D.z, x.array[E + 3] = Y.x, x.array[E + 4] = Y.y, x.array[E + 5] = Y.z, x.array[E + 6] = C.x, x.array[E + 7] = C.y, x.array[E + 8] = C.z), x.offset += 9) : (x.array[E + 0] = D.x, x.array[E + 1] = D.y, x.array[E + 2] = D.z, x.array[E + 3] = D.w, x.array[E + 4] = Y.x, x.array[E + 5] = Y.y, x.array[E + 6] = Y.z, x.array[E + 7] = Y.w, x.array[E + 8] = C.x, x.array[E + 9] = C.y, x.array[E + 10] = C.z, x.array[E + 11] = C.w,
                        x.offset += 12));
                        if (ya) {
                            E = 0;
                            for (F = Ca.length; E < F; E++) D = Ca[E].vertices[o.a].position, Y = Ca[E].vertices[o.b].position, C = Ca[E].vertices[o.c].position, x = Da[E], x[R + 0] = D.x, x[R + 1] = D.y, x[R + 2] = D.z, x[R + 3] = Y.x, x[R + 4] = Y.y, x[R + 5] = Y.z, x[R + 6] = C.x, x[R + 7] = C.y, x[R + 8] = C.z;
                            R += 9
                        }
                        if (Fa.length) E = Fa[o.a], F = Fa[o.b], x = Fa[o.c], $[M] = E.x, $[M + 1] = E.y, $[M + 2] = E.z, $[M + 3] = E.w, $[M + 4] = F.x, $[M + 5] = F.y, $[M + 6] = F.z, $[M + 7] = F.w, $[M + 8] = x.x, $[M + 9] = x.y, $[M + 10] = x.z, $[M + 11] = x.w, E = Ma[o.a], F = Ma[o.b], x = Ma[o.c], X[M] = E.x, X[M + 1] = E.y, X[M + 2] = E.z, X[M + 3] = E.w,
                        X[M + 4] = F.x, X[M + 5] = F.y, X[M + 6] = F.z, X[M + 7] = F.w, X[M + 8] = x.x, X[M + 9] = x.y, X[M + 10] = x.z, X[M + 11] = x.w, E = Ka[o.a], F = Ka[o.b], x = Ka[o.c], U[M] = E.x, U[M + 1] = E.y, U[M + 2] = E.z, U[M + 3] = 1, U[M + 4] = F.x, U[M + 5] = F.y, U[M + 6] = F.z, U[M + 7] = 1, U[M + 8] = x.x, U[M + 9] = x.y, U[M + 10] = x.z, U[M + 11] = 1, E = La[o.a], F = La[o.b], x = La[o.c], W[M] = E.x, W[M + 1] = E.y, W[M + 2] = E.z, W[M + 3] = 1, W[M + 4] = F.x, W[M + 5] = F.y, W[M + 6] = F.z, W[M + 7] = 1, W[M + 8] = x.x, W[M + 9] = x.y, W[M + 10] = x.z, W[M + 11] = 1, M += 12;
                        if (va && B) v.length == 3 && B == THREE.VertexColors ? (o = v[0], E = v[1], F = v[2]) : F = E = o = w, Z[Q] = o.r, Z[Q + 1] = o.g,
                        Z[Q + 2] = o.b, Z[Q + 3] = E.r, Z[Q + 4] = E.g, Z[Q + 5] = E.b, Z[Q + 6] = F.r, Z[Q + 7] = F.g, Z[Q + 8] = F.b, Q += 9;
                        if (Aa && ja.hasTangents) v = y[0], w = y[1], o = y[2], T[ga] = v.x, T[ga + 1] = v.y, T[ga + 2] = v.z, T[ga + 3] = v.w, T[ga + 4] = w.x, T[ga + 5] = w.y, T[ga + 6] = w.z, T[ga + 7] = w.w, T[ga + 8] = o.x, T[ga + 9] = o.y, T[ga + 10] = o.z, T[ga + 11] = o.w, ga += 12;
                        if (ra && z) if (p.length == 3 && na) for (y = 0; y < 3; y++) u = p[y], da[O] = u.x, da[O + 1] = u.y, da[O + 2] = u.z, O += 3;
                        else for (y = 0; y < 3; y++) da[O] = u.x, da[O + 1] = u.y, da[O + 2] = u.z, O += 3;
                        if (qa && H !== void 0 && A) for (y = 0; y < 3; y++) p = H[y], ca[N] = p.u, ca[N + 1] = p.v, N += 2;
                        if (qa && G !== void 0 && A) for (y = 0; y < 3; y++) p = G[y], ea[P] = p.u, ea[P + 1] = p.v, P += 2;
                        oa && (fa[la] = I, fa[la + 1] = I + 1, fa[la + 2] = I + 2, la += 3, ha[aa] = I, ha[aa + 1] = I + 1, ha[aa + 2] = I, ha[aa + 3] = I + 2, ha[aa + 4] = I + 1, ha[aa + 5] = I + 2, aa += 6, I += 3)
                    } else if (o instanceof THREE.Face4) {
                        if (ua) D = xa[o.a].position, Y = xa[o.b].position, C = xa[o.c].position, ka = xa[o.d].position, S[L] = D.x, S[L + 1] = D.y, S[L + 2] = D.z, S[L + 3] = Y.x, S[L + 4] = Y.y, S[L + 5] = Y.z, S[L + 6] = C.x, S[L + 7] = C.y, S[L + 8] = C.z, S[L + 9] = ka.x, S[L + 10] = ka.y, S[L + 11] = ka.z, L += 12;
                        if (ia) for (J in ia) if (x = ia[J], x.__original.needsUpdate) E = x.offset, F = x.offsetSrc, x.size === 1 ? (x.boundTo === void 0 || x.boundTo === "vertices" ? (x.array[E + 0] = x.value[o.a], x.array[E + 1] = x.value[o.b], x.array[E + 2] = x.value[o.c], x.array[E + 3] = x.value[o.d]) : x.boundTo === "faces" ? (x.array[E + 0] = x.value[F], x.array[E + 1] = x.value[F], x.array[E + 2] = x.value[F], x.array[E + 3] = x.value[F], x.offsetSrc++) : x.boundTo === "faceVertices" && (x.array[E + 0] = x.value[F + 0], x.array[E + 1] = x.value[F + 1], x.array[E + 2] = x.value[F + 2], x.array[E + 3] = x.value[F + 3], x.offsetSrc += 4), x.offset += 4) : (x.boundTo === void 0 || x.boundTo ===
                            "vertices" ? (D = x.value[o.a], Y = x.value[o.b], C = x.value[o.c], ka = x.value[o.d]) : x.boundTo === "faces" ? (D = x.value[F], Y = x.value[F], C = x.value[F], ka = x.value[F], x.offsetSrc++) : x.boundTo === "faceVertices" && (D = x.value[F + 0], Y = x.value[F + 1], C = x.value[F + 2], ka = x.value[F + 3], x.offsetSrc += 4), x.size === 2 ? (x.array[E + 0] = D.x, x.array[E + 1] = D.y, x.array[E + 2] = Y.x, x.array[E + 3] = Y.y, x.array[E + 4] = C.x, x.array[E + 5] = C.y, x.array[E + 6] = ka.x, x.array[E + 7] = ka.y, x.offset += 8) : x.size === 3 ? (x.type === "c" ? (x.array[E + 0] = D.r, x.array[E + 1] = D.g, x.array[E + 2] = D.b, x.array[E + 3] = Y.r, x.array[E + 4] = Y.g, x.array[E + 5] = Y.b, x.array[E + 6] = C.r, x.array[E + 7] = C.g, x.array[E + 8] = C.b, x.array[E + 9] = ka.r, x.array[E + 10] = ka.g, x.array[E + 11] = ka.b) : (x.array[E + 0] = D.x, x.array[E + 1] = D.y, x.array[E + 2] = D.z, x.array[E + 3] = Y.x, x.array[E + 4] = Y.y, x.array[E + 5] = Y.z, x.array[E + 6] = C.x, x.array[E + 7] = C.y, x.array[E + 8] = C.z, x.array[E + 9] = ka.x, x.array[E + 10] = ka.y, x.array[E + 11] = ka.z), x.offset += 12) : (x.array[E + 0] = D.x, x.array[E + 1] = D.y, x.array[E + 2] = D.z, x.array[E + 3] = D.w, x.array[E + 4] = Y.x, x.array[E + 5] = Y.y, x.array[E + 6] = Y.z, x.array[E + 7] = Y.w, x.array[E + 8] = C.x, x.array[E + 9] = C.y, x.array[E + 10] = C.z, x.array[E + 11] = C.w, x.array[E + 12] = ka.x, x.array[E + 13] = ka.y, x.array[E + 14] = ka.z, x.array[E + 15] = ka.w, x.offset += 16));
                        if (ya) {
                            E = 0;
                            for (F = Ca.length; E < F; E++) D = Ca[E].vertices[o.a].position, Y = Ca[E].vertices[o.b].position, C = Ca[E].vertices[o.c].position, ka = Ca[E].vertices[o.d].position, x = Da[E], x[R + 0] = D.x, x[R + 1] = D.y, x[R + 2] = D.z, x[R + 3] = Y.x, x[R + 4] = Y.y, x[R + 5] = Y.z, x[R + 6] = C.x, x[R + 7] = C.y, x[R + 8] = C.z, x[R + 9] = ka.x, x[R + 10] = ka.y, x[R + 11] = ka.z;
                            R += 12
                        }
                        if (Fa.length) E = Fa[o.a], F = Fa[o.b], x = Fa[o.c], K = Fa[o.d], $[M] = E.x, $[M + 1] = E.y, $[M + 2] = E.z, $[M + 3] = E.w, $[M + 4] = F.x, $[M + 5] = F.y, $[M + 6] = F.z, $[M + 7] = F.w, $[M + 8] = x.x, $[M + 9] = x.y, $[M + 10] = x.z, $[M + 11] = x.w, $[M + 12] = K.x, $[M + 13] = K.y, $[M + 14] = K.z, $[M + 15] = K.w, E = Ma[o.a], F = Ma[o.b], x = Ma[o.c], K = Ma[o.d], X[M] = E.x, X[M + 1] = E.y, X[M + 2] = E.z, X[M + 3] = E.w, X[M + 4] = F.x, X[M + 5] = F.y, X[M + 6] = F.z, X[M + 7] = F.w, X[M + 8] = x.x, X[M + 9] = x.y, X[M + 10] = x.z, X[M + 11] = x.w, X[M + 12] = K.x, X[M + 13] = K.y, X[M + 14] = K.z, X[M + 15] = K.w, E = Ka[o.a], F = Ka[o.b], x = Ka[o.c], K = Ka[o.d], U[M] = E.x, U[M + 1] = E.y, U[M + 2] = E.z, U[M + 3] = 1, U[M + 4] = F.x, U[M + 5] = F.y, U[M + 6] = F.z, U[M + 7] = 1, U[M + 8] = x.x, U[M + 9] = x.y, U[M + 10] = x.z, U[M + 11] = 1, U[M + 12] = K.x, U[M + 13] = K.y, U[M + 14] = K.z, U[M + 15] = 1, E = La[o.a], F = La[o.b], x = La[o.c], o = La[o.d], W[M] = E.x, W[M + 1] = E.y, W[M + 2] = E.z, W[M + 3] = 1, W[M + 4] = F.x, W[M + 5] = F.y, W[M + 6] = F.z, W[M + 7] = 1, W[M + 8] = x.x, W[M + 9] = x.y, W[M + 10] = x.z, W[M + 11] = 1, W[M + 12] = o.x, W[M + 13] = o.y, W[M + 14] = o.z, W[M + 15] = 1, M += 16;
                        if (va && B) v.length == 4 && B == THREE.VertexColors ? (o = v[0], E = v[1], F = v[2], v = v[3]) : v = F = E = o = w, Z[Q] = o.r, Z[Q + 1] = o.g, Z[Q + 2] = o.b, Z[Q + 3] = E.r, Z[Q + 4] = E.g,
                        Z[Q + 5] = E.b, Z[Q + 6] = F.r, Z[Q + 7] = F.g, Z[Q + 8] = F.b, Z[Q + 9] = v.r, Z[Q + 10] = v.g, Z[Q + 11] = v.b, Q += 12;
                        if (Aa && ja.hasTangents) v = y[0], w = y[1], o = y[2], y = y[3], T[ga] = v.x, T[ga + 1] = v.y, T[ga + 2] = v.z, T[ga + 3] = v.w, T[ga + 4] = w.x, T[ga + 5] = w.y, T[ga + 6] = w.z, T[ga + 7] = w.w, T[ga + 8] = o.x, T[ga + 9] = o.y, T[ga + 10] = o.z, T[ga + 11] = o.w, T[ga + 12] = y.x, T[ga + 13] = y.y, T[ga + 14] = y.z, T[ga + 15] = y.w, ga += 16;
                        if (ra && z) if (p.length == 4 && na) for (y = 0; y < 4; y++) u = p[y], da[O] = u.x, da[O + 1] = u.y, da[O + 2] = u.z, O += 3;
                        else for (y = 0; y < 4; y++) da[O] = u.x, da[O + 1] = u.y, da[O + 2] = u.z, O += 3;
                        if (qa && H !== void 0 && A) for (y = 0; y < 4; y++) p = H[y], ca[N] = p.u, ca[N + 1] = p.v, N += 2;
                        if (qa && G !== void 0 && A) for (y = 0; y < 4; y++) p = G[y], ea[P] = p.u, ea[P + 1] = p.v, P += 2;
                        oa && (fa[la] = I, fa[la + 1] = I + 1, fa[la + 2] = I + 3, fa[la + 3] = I + 1, fa[la + 4] = I + 2, fa[la + 5] = I + 3, la += 6, ha[aa] = I, ha[aa + 1] = I + 1, ha[aa + 2] = I, ha[aa + 3] = I + 3, ha[aa + 4] = I + 1, ha[aa + 5] = I + 2, ha[aa + 6] = I + 2, ha[aa + 7] = I + 3, aa += 8, I += 4)
                    }
                    if (Ia) {
                        n = 0;
                        for (t = Ia.length; n < t; n++) fa[la] = Ia[n].a, fa[la + 1] = Ia[n].b, fa[la + 2] = Ia[n].c, fa[la + 3] = Ia[n].a, fa[la + 4] = Ia[n].c, fa[la + 5] = Ia[n].d, la += 6
                    }
                    ua && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglVertexBuffer),
                    j.bufferData(j.ARRAY_BUFFER, S, m));
                    if (ia) for (J in ia) x = ia[J], x.__original.needsUpdate && (j.bindBuffer(j.ARRAY_BUFFER, x.buffer), j.bufferData(j.ARRAY_BUFFER, x.array, m));
                    if (ya) {
                        E = 0;
                        for (F = Ca.length; E < F; E++) j.bindBuffer(j.ARRAY_BUFFER, h.__webglMorphTargetsBuffers[E]), j.bufferData(j.ARRAY_BUFFER, Da[E], m)
                    }
                    va && Q > 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglColorBuffer), j.bufferData(j.ARRAY_BUFFER, Z, m));
                    ra && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglNormalBuffer), j.bufferData(j.ARRAY_BUFFER, da, m));
                    Aa && ja.hasTangents && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglTangentBuffer), j.bufferData(j.ARRAY_BUFFER, T, m));
                    qa && N > 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglUVBuffer), j.bufferData(j.ARRAY_BUFFER, ca, m));
                    qa && P > 0 && (j.bindBuffer(j.ARRAY_BUFFER, h.__webglUV2Buffer), j.bufferData(j.ARRAY_BUFFER, ea, m));
                    oa && (j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, h.__webglFaceBuffer), j.bufferData(j.ELEMENT_ARRAY_BUFFER, fa, m), j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, h.__webglLineBuffer), j.bufferData(j.ELEMENT_ARRAY_BUFFER, ha, m));
                    M > 0 && (j.bindBuffer(j.ARRAY_BUFFER,
                    h.__webglSkinVertexABuffer), j.bufferData(j.ARRAY_BUFFER, U, m), j.bindBuffer(j.ARRAY_BUFFER, h.__webglSkinVertexBBuffer), j.bufferData(j.ARRAY_BUFFER, W, m), j.bindBuffer(j.ARRAY_BUFFER, h.__webglSkinIndicesBuffer), j.bufferData(j.ARRAY_BUFFER, X, m), j.bindBuffer(j.ARRAY_BUFFER, h.__webglSkinWeightsBuffer), j.bufferData(j.ARRAY_BUFFER, $, m));
                    k.dynamic || (delete h.__inittedArrays, delete h.__colorArray, delete h.__normalArray, delete h.__tangentArray, delete h.__uvArray, delete h.__uv2Array, delete h.__faceArray, delete h.__vertexArray,
                    delete h.__lineArray, delete h.__skinVertexAArray, delete h.__skinVertexBArray, delete h.__skinIndexArray, delete h.__skinWeightArray)
                }
            }
            f.__dirtyVertices = !1;
            f.__dirtyMorphTargets = !1;
            f.__dirtyElements = !1;
            f.__dirtyUvs = !1;
            f.__dirtyNormals = !1;
            f.__dirtyTangents = !1;
            f.__dirtyColors = !1;
            var ta;
            g = g.__materials;
            f = 0;
            for (b = g.length; f < b; f++) if (e = g[f], e.attributes) for (ta in e.attributes) e.attributes[ta].needsUpdate = !1
        } else if (b instanceof THREE.Ribbon) {
            f = b.geometry;
            if (f.__dirtyVertices || f.__dirtyColors) {
                ta = f;
                b = j.DYNAMIC_DRAW;
                t = ta.vertices;
                g = ta.colors;
                A = t.length;
                h = g.length;
                B = ta.__vertexArray;
                k = ta.__colorArray;
                z = ta.__dirtyColors;
                if (ta.__dirtyVertices) {
                    for (m = 0; m < A; m++) n = t[m].position, e = m * 3, B[e] = n.x, B[e + 1] = n.y, B[e + 2] = n.z;
                    j.bindBuffer(j.ARRAY_BUFFER, ta.__webglVertexBuffer);
                    j.bufferData(j.ARRAY_BUFFER, B, b)
                }
                if (z) {
                    for (m = 0; m < h; m++) color = g[m], e = m * 3, k[e] = color.r, k[e + 1] = color.g, k[e + 2] = color.b;
                    j.bindBuffer(j.ARRAY_BUFFER, ta.__webglColorBuffer);
                    j.bufferData(j.ARRAY_BUFFER, k, b)
                }
            }
            f.__dirtyVertices = !1;
            f.__dirtyColors = !1
        } else if (b instanceof
        THREE.Line) {
            f = b.geometry;
            if (f.__dirtyVertices || f.__dirtyColors) {
                ta = f;
                b = j.DYNAMIC_DRAW;
                t = ta.vertices;
                g = ta.colors;
                A = t.length;
                h = g.length;
                B = ta.__vertexArray;
                k = ta.__colorArray;
                z = ta.__dirtyColors;
                if (ta.__dirtyVertices) {
                    for (m = 0; m < A; m++) n = t[m].position, e = m * 3, B[e] = n.x, B[e + 1] = n.y, B[e + 2] = n.z;
                    j.bindBuffer(j.ARRAY_BUFFER, ta.__webglVertexBuffer);
                    j.bufferData(j.ARRAY_BUFFER, B, b)
                }
                if (z) {
                    for (m = 0; m < h; m++) color = g[m], e = m * 3, k[e] = color.r, k[e + 1] = color.g, k[e + 2] = color.b;
                    j.bindBuffer(j.ARRAY_BUFFER, ta.__webglColorBuffer);
                    j.bufferData(j.ARRAY_BUFFER,
                    k, b)
                }
            }
            f.__dirtyVertices = !1;
            f.__dirtyColors = !1
        } else if (b instanceof THREE.ParticleSystem) f = b.geometry, (f.__dirtyVertices || f.__dirtyColors || b.sortParticles) && c(f, j.DYNAMIC_DRAW, b), f.__dirtyVertices = !1, f.__dirtyColors = !1
    }
    function z(b, e) {
        var c;
        for (c = b.length - 1; c >= 0; c--) b[c].object == e && b.splice(c, 1)
    }
    function C(b) {
        function e(b) {
            var h = [];
            c = 0;
            for (f = b.length; c < f; c++) b[c] == void 0 ? h.push("undefined") : h.push(b[c].id);
            return h.join("_")
        }
        var c, f, h, g, j, k, m, o, n = {}, p = b.morphTargets !== void 0 ? b.morphTargets.length : 0;
        b.geometryGroups = {};
        h = 0;
        for (g = b.faces.length; h < g; h++) j = b.faces[h], k = j.materials, m = e(k), n[m] == void 0 && (n[m] = {
            hash: m,
            counter: 0
        }), o = n[m].hash + "_" + n[m].counter, b.geometryGroups[o] == void 0 && (b.geometryGroups[o] = {
            faces: [],
            materials: k,
            vertices: 0,
            numMorphTargets: p
        }), j = j instanceof THREE.Face3 ? 3 : 4, b.geometryGroups[o].vertices + j > 65535 && (n[m].counter += 1, o = n[m].hash + "_" + n[m].counter, b.geometryGroups[o] == void 0 && (b.geometryGroups[o] = {
            faces: [],
            materials: k,
            vertices: 0,
            numMorphTargets: p
        })), b.geometryGroups[o].faces.push(h),
        b.geometryGroups[o].vertices += j
    }
    function H(b, e, c) {
        b.push({
            buffer: e,
            object: c,
            opaque: {
                list: [],
                count: 0
            },
            transparent: {
                list: [],
                count: 0
            }
        })
    }
    function D(b) {
        if (b != aa) {
            switch (b) {
                case THREE.AdditiveBlending:
                    j.blendEquation(j.FUNC_ADD);
                    j.blendFunc(j.SRC_ALPHA, j.ONE);
                    break;
                case THREE.SubtractiveBlending:
                    j.blendEquation(j.FUNC_ADD);
                    j.blendFunc(j.ZERO, j.ONE_MINUS_SRC_COLOR);
                    break;
                case THREE.MultiplyBlending:
                    j.blendEquation(j.FUNC_ADD);
                    j.blendFunc(j.ZERO, j.SRC_COLOR);
                    break;
                default:
                    j.blendEquationSeparate(j.FUNC_ADD,
                    j.FUNC_ADD), j.blendFuncSeparate(j.SRC_ALPHA, j.ONE_MINUS_SRC_ALPHA, j.ONE, j.ONE_MINUS_SRC_ALPHA)
            }
            aa = b
        }
    }
    function Q(b, e, c) {
        (c.width & c.width - 1) == 0 && (c.height & c.height - 1) == 0 ? (j.texParameteri(b, j.TEXTURE_WRAP_S, K(e.wrapS)), j.texParameteri(b, j.TEXTURE_WRAP_T, K(e.wrapT)), j.texParameteri(b, j.TEXTURE_MAG_FILTER, K(e.magFilter)), j.texParameteri(b, j.TEXTURE_MIN_FILTER, K(e.minFilter)), j.generateMipmap(b)) : (j.texParameteri(b, j.TEXTURE_WRAP_S, j.CLAMP_TO_EDGE), j.texParameteri(b, j.TEXTURE_WRAP_T, j.CLAMP_TO_EDGE), j.texParameteri(b,
        j.TEXTURE_MAG_FILTER, S(e.magFilter)), j.texParameteri(b, j.TEXTURE_MIN_FILTER, S(e.minFilter)))
    }
    function J(b, e) {
        if (b.needsUpdate) b.__webglInit ? (j.bindTexture(j.TEXTURE_2D, b.__webglTexture), j.texImage2D(j.TEXTURE_2D, 0, j.RGBA, j.RGBA, j.UNSIGNED_BYTE, b.image)) : (b.__webglTexture = j.createTexture(), j.bindTexture(j.TEXTURE_2D, b.__webglTexture), j.texImage2D(j.TEXTURE_2D, 0, j.RGBA, j.RGBA, j.UNSIGNED_BYTE, b.image), b.__webglInit = !0), Q(j.TEXTURE_2D, b, b.image), j.bindTexture(j.TEXTURE_2D, null), b.needsUpdate = !1;
        j.activeTexture(j.TEXTURE0 + e);
        j.bindTexture(j.TEXTURE_2D, b.__webglTexture)
    }
    function F(b) {
        if (b && !b.__webglFramebuffer) {
            if (b.depthBuffer === void 0) b.depthBuffer = !0;
            if (b.stencilBuffer === void 0) b.stencilBuffer = !0;
            b.__webglFramebuffer = j.createFramebuffer();
            b.__webglRenderbuffer = j.createRenderbuffer();
            b.__webglTexture = j.createTexture();
            j.bindTexture(j.TEXTURE_2D, b.__webglTexture);
            j.texParameteri(j.TEXTURE_2D, j.TEXTURE_WRAP_S, K(b.wrapS));
            j.texParameteri(j.TEXTURE_2D, j.TEXTURE_WRAP_T, K(b.wrapT));
            j.texParameteri(j.TEXTURE_2D, j.TEXTURE_MAG_FILTER,
            K(b.magFilter));
            j.texParameteri(j.TEXTURE_2D, j.TEXTURE_MIN_FILTER, K(b.minFilter));
            j.texImage2D(j.TEXTURE_2D, 0, K(b.format), b.width, b.height, 0, K(b.format), K(b.type), null);
            j.bindRenderbuffer(j.RENDERBUFFER, b.__webglRenderbuffer);
            j.bindFramebuffer(j.FRAMEBUFFER, b.__webglFramebuffer);
            j.framebufferTexture2D(j.FRAMEBUFFER, j.COLOR_ATTACHMENT0, j.TEXTURE_2D, b.__webglTexture, 0);
            b.depthBuffer && !b.stencilBuffer ? (j.renderbufferStorage(j.RENDERBUFFER, j.DEPTH_COMPONENT16, b.width, b.height), j.framebufferRenderbuffer(j.FRAMEBUFFER,
            j.DEPTH_ATTACHMENT, j.RENDERBUFFER, b.__webglRenderbuffer)) : b.depthBuffer && b.stencilBuffer ? (j.renderbufferStorage(j.RENDERBUFFER, j.DEPTH_STENCIL, b.width, b.height), j.framebufferRenderbuffer(j.FRAMEBUFFER, j.DEPTH_STENCIL_ATTACHMENT, j.RENDERBUFFER, b.__webglRenderbuffer)) : j.renderbufferStorage(j.RENDERBUFFER, j.RGBA4, b.width, b.height);
            j.bindTexture(j.TEXTURE_2D, null);
            j.bindRenderbuffer(j.RENDERBUFFER, null);
            j.bindFramebuffer(j.FRAMEBUFFER, null)
        }
        var e, c;
        b ? (e = b.__webglFramebuffer, c = b.width, b = b.height) : (e = null,
        c = W, b = U);
        e != Z && (j.bindFramebuffer(j.FRAMEBUFFER, e), j.viewport(L, fa, c, b), Z = e)
    }
    function I(b, e) {
        var c;
        b == "fragment" ? c = j.createShader(j.FRAGMENT_SHADER) : b == "vertex" && (c = j.createShader(j.VERTEX_SHADER));
        j.shaderSource(c, e);
        j.compileShader(c);
        if (!j.getShaderParameter(c, j.COMPILE_STATUS)) return console.error(j.getShaderInfoLog(c)), console.error(e), null;
        return c
    }
    function S(b) {
        switch (b) {
            case THREE.NearestFilter:
            case THREE.NearestMipMapNearestFilter:
            case THREE.NearestMipMapLinearFilter:
                return j.NEAREST;
            default:
                return j.LINEAR
        }
    }

    function K(b) {
        switch (b) {
            case THREE.RepeatWrapping:
                return j.REPEAT;
            case THREE.ClampToEdgeWrapping:
                return j.CLAMP_TO_EDGE;
            case THREE.MirroredRepeatWrapping:
                return j.MIRRORED_REPEAT;
            case THREE.NearestFilter:
                return j.NEAREST;
            case THREE.NearestMipMapNearestFilter:
                return j.NEAREST_MIPMAP_NEAREST;
            case THREE.NearestMipMapLinearFilter:
                return j.NEAREST_MIPMAP_LINEAR;
            case THREE.LinearFilter:
                return j.LINEAR;
            case THREE.LinearMipMapNearestFilter:
                return j.LINEAR_MIPMAP_NEAREST;
            case THREE.LinearMipMapLinearFilter:
                return j.LINEAR_MIPMAP_LINEAR;
            case THREE.ByteType:
                return j.BYTE;
            case THREE.UnsignedByteType:
                return j.UNSIGNED_BYTE;
            case THREE.ShortType:
                return j.SHORT;
            case THREE.UnsignedShortType:
                return j.UNSIGNED_SHORT;
            case THREE.IntType:
                return j.INT;
            case THREE.UnsignedShortType:
                return j.UNSIGNED_INT;
            case THREE.FloatType:
                return j.FLOAT;
            case THREE.AlphaFormat:
                return j.ALPHA;
            case THREE.RGBFormat:
                return j.RGB;
            case THREE.RGBAFormat:
                return j.RGBA;
            case THREE.LuminanceFormat:
                return j.LUMINANCE;
            case THREE.LuminanceAlphaFormat:
                return j.LUMINANCE_ALPHA
        }
        return 0
    }
    var ea = this,
        j, ca = [],
        T = null,
        Z = null,
        N = !0,
        da = null,
        X = null,
        aa = null,
        ia = null,
        ha = null,
        na = null,
        ja = null,
        L = 0,
        fa = 0,
        W = 0,
        U = 0,
        $ = [new THREE.Vector4, new THREE.Vector4, new THREE.Vector4, new THREE.Vector4, new THREE.Vector4, new THREE.Vector4],
        Y = new THREE.Matrix4,
        ka = new Float32Array(16),
        la = new Float32Array(16),
        ga = new THREE.Vector4,
        Da = {
            ambient: [0, 0, 0],
            directional: {
                length: 0,
                colors: [],
                positions: []
            },
            point: {
                length: 0,
                colors: [],
                positions: [],
                distances: []
            }
        }, b = b || {}, ua = b.canvas !== void 0 ? b.canvas : document.createElement("canvas"),
        Aa = b.stencil !== void 0 ? b.stencil : !0,
        xa = b.antialias !== void 0 ? b.antialias : !1,
        qa = b.clearColor !== void 0 ? new THREE.Color(b.clearColor) : new THREE.Color(0),
        ya = b.clearAlpha !== void 0 ? b.clearAlpha : 0;
    this.data = {
        vertices: 0,
        faces: 0,
        drawCalls: 0
    };
    this.maxMorphTargets = 8;
    this.domElement = ua;
    this.sortObjects = this.autoClear = !0;
    try {
        if (!(j = ua.getContext("experimental-webgl", {
            antialias: xa,
            stencil: Aa
        }))) throw "Error creating WebGL context.";
        console.log(navigator.userAgent + " | " + j.getParameter(j.VERSION) + " | " + j.getParameter(j.VENDOR) +
            " | " + j.getParameter(j.RENDERER) + " | " + j.getParameter(j.SHADING_LANGUAGE_VERSION))
    } catch (va) {
        console.error(va)
    }
    j.clearColor(0, 0, 0, 1);
    j.clearDepth(1);
    j.enable(j.DEPTH_TEST);
    j.depthFunc(j.LEQUAL);
    j.frontFace(j.CCW);
    j.cullFace(j.BACK);
    j.enable(j.CULL_FACE);
    j.enable(j.BLEND);
    j.blendEquation(j.FUNC_ADD);
    j.blendFunc(j.SRC_ALPHA, j.ONE_MINUS_SRC_ALPHA);
    j.clearColor(qa.r, qa.g, qa.b, ya);
    this.context = j;
    var oa = j.getParameter(j.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
    if (Aa) {
        var R = {};
        R.vertices = new Float32Array(12);
        R.faces = new Uint16Array(6);
        R.darkness = 0.5;
        R.vertices[0] = -20;
        R.vertices[1] = -20;
        R.vertices[2] = -1;
        R.vertices[3] = 20;
        R.vertices[4] = -20;
        R.vertices[5] = -1;
        R.vertices[6] = 20;
        R.vertices[7] = 20;
        R.vertices[8] = -1;
        R.vertices[9] = -20;
        R.vertices[10] = 20;
        R.vertices[11] = -1;
        R.faces[0] = 0;
        R.faces[1] = 1;
        R.faces[2] = 2;
        R.faces[3] = 0;
        R.faces[4] = 2;
        R.faces[5] = 3;
        R.vertexBuffer = j.createBuffer();
        R.elementBuffer = j.createBuffer();
        j.bindBuffer(j.ARRAY_BUFFER, R.vertexBuffer);
        j.bufferData(j.ARRAY_BUFFER, R.vertices, j.STATIC_DRAW);
        j.bindBuffer(j.ELEMENT_ARRAY_BUFFER,
        R.elementBuffer);
        j.bufferData(j.ELEMENT_ARRAY_BUFFER, R.faces, j.STATIC_DRAW);
        R.program = j.createProgram();
        j.attachShader(R.program, I("fragment", THREE.ShaderLib.shadowPost.fragmentShader));
        j.attachShader(R.program, I("vertex", THREE.ShaderLib.shadowPost.vertexShader));
        j.linkProgram(R.program);
        R.vertexLocation = j.getAttribLocation(R.program, "position");
        R.projectionLocation = j.getUniformLocation(R.program, "projectionMatrix");
        R.darknessLocation = j.getUniformLocation(R.program, "darkness")
    }
    var O = {};
    O.vertices = new Float32Array(16);
    O.faces = new Uint16Array(6);
    b = 0;
    O.vertices[b++] = -1;
    O.vertices[b++] = -1;
    O.vertices[b++] = 0;
    O.vertices[b++] = 0;
    O.vertices[b++] = 1;
    O.vertices[b++] = -1;
    O.vertices[b++] = 1;
    O.vertices[b++] = 0;
    O.vertices[b++] = 1;
    O.vertices[b++] = 1;
    O.vertices[b++] = 1;
    O.vertices[b++] = 1;
    O.vertices[b++] = -1;
    O.vertices[b++] = 1;
    O.vertices[b++] = 0;
    O.vertices[b++] = 1;
    b = 0;
    O.faces[b++] = 0;
    O.faces[b++] = 1;
    O.faces[b++] = 2;
    O.faces[b++] = 0;
    O.faces[b++] = 2;
    O.faces[b++] = 3;
    O.vertexBuffer = j.createBuffer();
    O.elementBuffer = j.createBuffer();
    O.tempTexture = j.createTexture();
    O.occlusionTexture = j.createTexture();
    j.bindBuffer(j.ARRAY_BUFFER, O.vertexBuffer);
    j.bufferData(j.ARRAY_BUFFER, O.vertices, j.STATIC_DRAW);
    j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, O.elementBuffer);
    j.bufferData(j.ELEMENT_ARRAY_BUFFER, O.faces, j.STATIC_DRAW);
    j.bindTexture(j.TEXTURE_2D, O.tempTexture);
    j.texImage2D(j.TEXTURE_2D, 0, j.RGB, 16, 16, 0, j.RGB, j.UNSIGNED_BYTE, null);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_WRAP_S, j.CLAMP_TO_EDGE);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_WRAP_T, j.CLAMP_TO_EDGE);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_MAG_FILTER, j.NEAREST);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_MIN_FILTER, j.NEAREST);
    j.bindTexture(j.TEXTURE_2D, O.occlusionTexture);
    j.texImage2D(j.TEXTURE_2D, 0, j.RGBA, 16, 16, 0, j.RGBA, j.UNSIGNED_BYTE, null);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_WRAP_S, j.CLAMP_TO_EDGE);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_WRAP_T, j.CLAMP_TO_EDGE);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_MAG_FILTER, j.NEAREST);
    j.texParameteri(j.TEXTURE_2D, j.TEXTURE_MIN_FILTER, j.NEAREST);
    j.getParameter(j.MAX_VERTEX_TEXTURE_IMAGE_UNITS) <= 0 ? (O.hasVertexTexture = !1, O.program = j.createProgram(), j.attachShader(O.program, I("fragment", THREE.ShaderLib.lensFlare.fragmentShader)), j.attachShader(O.program, I("vertex", THREE.ShaderLib.lensFlare.vertexShader))) : (O.hasVertexTexture = !0, O.program = j.createProgram(), j.attachShader(O.program, I("fragment", THREE.ShaderLib.lensFlareVertexTexture.fragmentShader)), j.attachShader(O.program, I("vertex", THREE.ShaderLib.lensFlareVertexTexture.vertexShader)));
    j.linkProgram(O.program);
    O.attributes = {};
    O.uniforms = {};
    O.attributes.vertex = j.getAttribLocation(O.program, "position");
    O.attributes.uv = j.getAttribLocation(O.program, "UV");
    O.uniforms.renderType = j.getUniformLocation(O.program, "renderType");
    O.uniforms.map = j.getUniformLocation(O.program, "map");
    O.uniforms.occlusionMap = j.getUniformLocation(O.program, "occlusionMap");
    O.uniforms.opacity = j.getUniformLocation(O.program, "opacity");
    O.uniforms.scale = j.getUniformLocation(O.program, "scale");
    O.uniforms.rotation = j.getUniformLocation(O.program, "rotation");
    O.uniforms.screenPosition = j.getUniformLocation(O.program, "screenPosition");
    var ra = !1,
        P = {};
    P.vertices = new Float32Array(16);
    P.faces = new Uint16Array(6);
    b = 0;
    P.vertices[b++] = -1;
    P.vertices[b++] = -1;
    P.vertices[b++] = 0;
    P.vertices[b++] = 1;
    P.vertices[b++] = 1;
    P.vertices[b++] = -1;
    P.vertices[b++] = 1;
    P.vertices[b++] = 1;
    P.vertices[b++] = 1;
    P.vertices[b++] = 1;
    P.vertices[b++] = 1;
    P.vertices[b++] = 0;
    P.vertices[b++] = -1;
    P.vertices[b++] = 1;
    P.vertices[b++] = 0;
    b = P.vertices[b++] = 0;
    P.faces[b++] = 0;
    P.faces[b++] = 1;
    P.faces[b++] = 2;
    P.faces[b++] = 0;
    P.faces[b++] = 2;
    P.faces[b++] = 3;
    P.vertexBuffer = j.createBuffer();
    P.elementBuffer = j.createBuffer();
    j.bindBuffer(j.ARRAY_BUFFER, P.vertexBuffer);
    j.bufferData(j.ARRAY_BUFFER, P.vertices, j.STATIC_DRAW);
    j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, P.elementBuffer);
    j.bufferData(j.ELEMENT_ARRAY_BUFFER, P.faces, j.STATIC_DRAW);
    P.program = j.createProgram();
    j.attachShader(P.program, I("fragment", THREE.ShaderLib.sprite.fragmentShader));
    j.attachShader(P.program, I("vertex", THREE.ShaderLib.sprite.vertexShader));
    j.linkProgram(P.program);
    P.attributes = {};
    P.uniforms = {};
    P.attributes.position = j.getAttribLocation(P.program, "position");
    P.attributes.uv = j.getAttribLocation(P.program, "uv");
    P.uniforms.uvOffset = j.getUniformLocation(P.program, "uvOffset");
    P.uniforms.uvScale = j.getUniformLocation(P.program, "uvScale");
    P.uniforms.rotation = j.getUniformLocation(P.program, "rotation");
    P.uniforms.scale = j.getUniformLocation(P.program, "scale");
    P.uniforms.alignment = j.getUniformLocation(P.program, "alignment");
    P.uniforms.map = j.getUniformLocation(P.program, "map");
    P.uniforms.opacity = j.getUniformLocation(P.program,
        "opacity");
    P.uniforms.useScreenCoordinates = j.getUniformLocation(P.program, "useScreenCoordinates");
    P.uniforms.affectedByDistance = j.getUniformLocation(P.program, "affectedByDistance");
    P.uniforms.screenPosition = j.getUniformLocation(P.program, "screenPosition");
    P.uniforms.modelViewMatrix = j.getUniformLocation(P.program, "modelViewMatrix");
    P.uniforms.projectionMatrix = j.getUniformLocation(P.program, "projectionMatrix");
    var Ba = !1;
    this.setSize = function (b, e) {
        ua.width = b;
        ua.height = e;
        this.setViewport(0, 0, ua.width,
        ua.height)
    };
    this.setViewport = function (b, e, c, f) {
        L = b;
        fa = e;
        W = c;
        U = f;
        j.viewport(L, fa, W, U)
    };
    this.setScissor = function (b, e, c, f) {
        j.scissor(b, e, c, f)
    };
    this.enableScissorTest = function (b) {
        b ? j.enable(j.SCISSOR_TEST) : j.disable(j.SCISSOR_TEST)
    };
    this.enableDepthBufferWrite = function (b) {
        N = b;
        j.depthMask(b)
    };
    this.setClearColorHex = function (b, e) {
        qa.setHex(b);
        ya = e;
        j.clearColor(qa.r, qa.g, qa.b, ya)
    };
    this.setClearColor = function (b, e) {
        qa.copy(b);
        ya = e;
        j.clearColor(qa.r, qa.g, qa.b, ya)
    };
    this.clear = function () {
        j.clear(j.COLOR_BUFFER_BIT | j.DEPTH_BUFFER_BIT | j.STENCIL_BUFFER_BIT)
    };
    this.setStencilShadowDarkness = function (b) {
        R.darkness = b
    };
    this.getContext = function () {
        return j
    };
    this.initMaterial = function (b, e, c, f) {
        var h, g, k;
        b instanceof THREE.MeshDepthMaterial ? k = "depth" : b instanceof THREE.ShadowVolumeDynamicMaterial ? k = "shadowVolumeDynamic" : b instanceof THREE.MeshNormalMaterial ? k = "normal" : b instanceof THREE.MeshBasicMaterial ? k = "basic" : b instanceof THREE.MeshLambertMaterial ? k = "lambert" : b instanceof THREE.MeshPhongMaterial ? k = "phong" : b instanceof
        THREE.LineBasicMaterial ? k = "basic" : b instanceof THREE.ParticleBasicMaterial && (k = "particle_basic");
        if (k) {
            var m = THREE.ShaderLib[k];
            b.uniforms = THREE.UniformsUtils.clone(m.uniforms);
            b.vertexShader = m.vertexShader;
            b.fragmentShader = m.fragmentShader
        }
        var o, n, p;
        o = p = m = 0;
        for (n = e.length; o < n; o++) g = e[o], g instanceof THREE.DirectionalLight && p++, g instanceof THREE.PointLight && m++;
        m + p <= 4 ? e = p : (e = Math.ceil(4 * p / (m + p)), m = 4 - e);
        g = {
            directional: e,
            point: m
        };
        p = 50;
        if (f !== void 0 && f instanceof THREE.SkinnedMesh) p = f.bones.length;
        var t;
        a: {
            o = b.fragmentShader;
            n = b.vertexShader;
            var m = b.uniforms,
                e = b.attributes,
                c = {
                    map: !! b.map,
                    envMap: !! b.envMap,
                    lightMap: !! b.lightMap,
                    vertexColors: b.vertexColors,
                    fog: c,
                    sizeAttenuation: b.sizeAttenuation,
                    skinning: b.skinning,
                    morphTargets: b.morphTargets,
                    maxMorphTargets: this.maxMorphTargets,
                    maxDirLights: g.directional,
                    maxPointLights: g.point,
                    maxBones: p
                }, u;
            g = [];
            k ? g.push(k) : (g.push(o), g.push(n));
            for (u in c) g.push(u), g.push(c[u]);
            k = g.join();
            u = 0;
            for (g = ca.length; u < g; u++) if (ca[u].code == k) {
                t = ca[u].program;
                break a
            }
            u = j.createProgram();
            g = [oa ? "#define VERTEX_TEXTURES" : "", "#define MAX_DIR_LIGHTS " + c.maxDirLights, "#define MAX_POINT_LIGHTS " + c.maxPointLights, "#define MAX_BONES " + c.maxBones, c.map ? "#define USE_MAP" : "", c.envMap ? "#define USE_ENVMAP" : "", c.lightMap ? "#define USE_LIGHTMAP" : "", c.vertexColors ? "#define USE_COLOR" : "", c.skinning ? "#define USE_SKINNING" : "", c.morphTargets ? "#define USE_MORPHTARGETS" : "", c.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", "uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nuniform mat4 cameraInverseMatrix;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinVertexA;\nattribute vec4 skinVertexB;\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
            p = ["#ifdef GL_ES\nprecision highp float;\n#endif", "#define MAX_DIR_LIGHTS " + c.maxDirLights, "#define MAX_POINT_LIGHTS " + c.maxPointLights, c.fog ? "#define USE_FOG" : "", c.fog instanceof THREE.FogExp2 ? "#define FOG_EXP2" : "", c.map ? "#define USE_MAP" : "", c.envMap ? "#define USE_ENVMAP" : "", c.lightMap ? "#define USE_LIGHTMAP" : "", c.vertexColors ? "#define USE_COLOR" : "", "uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");
            j.attachShader(u, I("fragment", p + o));
            j.attachShader(u, I("vertex", g + n));
            j.linkProgram(u);
            j.getProgramParameter(u, j.LINK_STATUS) || console.error("Could not initialise shader\nVALIDATE_STATUS: " + j.getProgramParameter(u, j.VALIDATE_STATUS) + ", gl error [" + j.getError() + "]");
            u.uniforms = {};
            u.attributes = {};
            var v;
            o = ["viewMatrix", "modelViewMatrix", "projectionMatrix", "normalMatrix", "objectMatrix", "cameraPosition", "cameraInverseMatrix", "boneGlobalMatrices", "morphTargetInfluences"];
            for (v in m) o.push(v);
            v = o;
            m = 0;
            for (o = v.length; m < o; m++) n = v[m], u.uniforms[n] = j.getUniformLocation(u, n);
            o = ["position", "normal",
                "uv", "uv2", "tangent", "color", "skinVertexA", "skinVertexB", "skinIndex", "skinWeight"];
            for (v = 0; v < c.maxMorphTargets; v++) o.push("morphTarget" + v);
            for (t in e) o.push(t);
            t = o;
            v = 0;
            for (e = t.length; v < e; v++) c = t[v], u.attributes[c] = j.getAttribLocation(u, c);
            ca.push({
                program: u,
                code: k
            });
            t = u
        }
        b.program = t;
        t = b.program.attributes;
        t.position >= 0 && j.enableVertexAttribArray(t.position);
        t.color >= 0 && j.enableVertexAttribArray(t.color);
        t.normal >= 0 && j.enableVertexAttribArray(t.normal);
        t.tangent >= 0 && j.enableVertexAttribArray(t.tangent);
        b.skinning && t.skinVertexA >= 0 && t.skinVertexB >= 0 && t.skinIndex >= 0 && t.skinWeight >= 0 && (j.enableVertexAttribArray(t.skinVertexA), j.enableVertexAttribArray(t.skinVertexB), j.enableVertexAttribArray(t.skinIndex), j.enableVertexAttribArray(t.skinWeight));
        if (b.attributes) for (h in b.attributes) t[h] !== void 0 && t[h] >= 0 && j.enableVertexAttribArray(t[h]);
        if (b.morphTargets) {
            b.numSupportedMorphTargets = 0;
            t.morphTarget0 >= 0 && (j.enableVertexAttribArray(t.morphTarget0), b.numSupportedMorphTargets++);
            t.morphTarget1 >= 0 && (j.enableVertexAttribArray(t.morphTarget1),
            b.numSupportedMorphTargets++);
            t.morphTarget2 >= 0 && (j.enableVertexAttribArray(t.morphTarget2), b.numSupportedMorphTargets++);
            t.morphTarget3 >= 0 && (j.enableVertexAttribArray(t.morphTarget3), b.numSupportedMorphTargets++);
            t.morphTarget4 >= 0 && (j.enableVertexAttribArray(t.morphTarget4), b.numSupportedMorphTargets++);
            t.morphTarget5 >= 0 && (j.enableVertexAttribArray(t.morphTarget5), b.numSupportedMorphTargets++);
            t.morphTarget6 >= 0 && (j.enableVertexAttribArray(t.morphTarget6), b.numSupportedMorphTargets++);
            t.morphTarget7 >= 0 && (j.enableVertexAttribArray(t.morphTarget7), b.numSupportedMorphTargets++);
            f.__webglMorphTargetInfluences = new Float32Array(this.maxMorphTargets);
            b = 0;
            for (h = this.maxMorphTargets; b < h; b++) f.__webglMorphTargetInfluences[b] = 0
        }
    };
    this.render = function (b, c, p, z) {
        var C, H, G, I, K, L, J, N, O = b.lights,
            P = b.fog;
        ea.data.vertices = 0;
        ea.data.faces = 0;
        ea.data.drawCalls = 0;
        c.matrixAutoUpdate && c.update(void 0, !0);
        b.update(void 0, !1, c);
        c.matrixWorldInverse.flattenToArray(la);
        c.projectionMatrix.flattenToArray(ka);
        Y.multiply(c.projectionMatrix,
        c.matrixWorldInverse);
        n(Y);
        this.initWebGLObjects(b);
        F(p);
        (this.autoClear || z) && this.clear();
        K = b.__webglObjects.length;
        for (z = 0; z < K; z++) if (C = b.__webglObjects[z], J = C.object, J.visible) if (!(J instanceof THREE.Mesh) || o(J)) {
            if (J.matrixWorld.flattenToArray(J._objectMatrixArray), y(J, c), v(C), C.render = !0, this.sortObjects) C.object.renderDepth ? C.z = C.object.renderDepth : (ga.copy(J.position), Y.multiplyVector3(ga), C.z = ga.z)
        } else C.render = !1;
        else C.render = !1;
        this.sortObjects && b.__webglObjects.sort(u);
        L = b.__webglObjectsImmediate.length;
        for (z = 0; z < L; z++) C = b.__webglObjectsImmediate[z], J = C.object, J.visible && (J.matrixAutoUpdate && J.matrixWorld.flattenToArray(J._objectMatrixArray), y(J, c), t(C));
        if (b.overrideMaterial) {
            h(b.overrideMaterial.depthTest);
            D(b.overrideMaterial.blending);
            for (z = 0; z < K; z++) if (C = b.__webglObjects[z], C.render) J = C.object, N = C.buffer, k(J), f(c, O, P, b.overrideMaterial, N, J);
            for (z = 0; z < L; z++) C = b.__webglObjectsImmediate[z], J = C.object, J.visible && (k(J), H = e(c, O, P, b.overrideMaterial, J), J.render(function (e) {
                g(e, H, b.overrideMaterial.shading)
            }))
        } else {
            D(THREE.NormalBlending);
            for (z = 0; z < K; z++) if (C = b.__webglObjects[z], C.render) {
                J = C.object;
                N = C.buffer;
                G = C.opaque;
                k(J);
                for (C = 0; C < G.count; C++) I = G.list[C], h(I.depthTest), m(I.polygonOffset, I.polygonOffsetFactor, I.polygonOffsetUnits), f(c, O, P, I, N, J)
            }
            for (z = 0; z < L; z++) if (C = b.__webglObjectsImmediate[z], J = C.object, J.visible) {
                G = C.opaque;
                k(J);
                for (C = 0; C < G.count; C++) I = G.list[C], h(I.depthTest), m(I.polygonOffset, I.polygonOffsetFactor, I.polygonOffsetUnits), H = e(c, O, P, I, J), J.render(function (b) {
                    g(b, H, I.shading)
                })
            }
            for (z = 0; z < K; z++) if (C = b.__webglObjects[z],
            C.render) {
                J = C.object;
                N = C.buffer;
                G = C.transparent;
                k(J);
                for (C = 0; C < G.count; C++) I = G.list[C], D(I.blending), h(I.depthTest), m(I.polygonOffset, I.polygonOffsetFactor, I.polygonOffsetUnits), f(c, O, P, I, N, J)
            }
            for (z = 0; z < L; z++) if (C = b.__webglObjectsImmediate[z], J = C.object, J.visible) {
                G = C.transparent;
                k(J);
                for (C = 0; C < G.count; C++) I = G.list[C], D(I.blending), h(I.depthTest), m(I.polygonOffset, I.polygonOffsetFactor, I.polygonOffsetUnits), H = e(c, O, P, I, J), J.render(function (b) {
                    g(b, H, I.shading)
                })
            }
        }
        b.__webglSprites.length && B(b, c);
        Aa && b.__webglShadowVolumes.length && b.lights.length && w(b);
        b.__webglLensFlares.length && A(b, c);
        p && p.minFilter !== THREE.NearestFilter && p.minFilter !== THREE.LinearFilter && (j.bindTexture(j.TEXTURE_2D, p.__webglTexture), j.generateMipmap(j.TEXTURE_2D), j.bindTexture(j.TEXTURE_2D, null))
    };
    this.initWebGLObjects = function (b) {
        if (!b.__webglObjects) b.__webglObjects = [], b.__webglObjectsImmediate = [], b.__webglShadowVolumes = [], b.__webglLensFlares = [], b.__webglSprites = [];
        for (; b.__objectsAdded.length;) {
            var e = b.__objectsAdded[0],
                c = b,
                f = void 0,
                g = void 0,
                h = void 0;
            if (e._modelViewMatrix == void 0) e._modelViewMatrix = new THREE.Matrix4, e._normalMatrixArray = new Float32Array(9), e._modelViewMatrixArray = new Float32Array(16), e._objectMatrixArray = new Float32Array(16), e.matrixWorld.flattenToArray(e._objectMatrixArray);
            if (e instanceof THREE.Mesh) for (f in g = e.geometry, g.geometryGroups == void 0 && C(g), g.geometryGroups) {
                h = g.geometryGroups[f];
                if (!h.__webglVertexBuffer) {
                    var k = h;
                    k.__webglVertexBuffer = j.createBuffer();
                    k.__webglNormalBuffer = j.createBuffer();
                    k.__webglTangentBuffer = j.createBuffer();
                    k.__webglColorBuffer = j.createBuffer();
                    k.__webglUVBuffer = j.createBuffer();
                    k.__webglUV2Buffer = j.createBuffer();
                    k.__webglSkinVertexABuffer = j.createBuffer();
                    k.__webglSkinVertexBBuffer = j.createBuffer();
                    k.__webglSkinIndicesBuffer = j.createBuffer();
                    k.__webglSkinWeightsBuffer = j.createBuffer();
                    k.__webglFaceBuffer = j.createBuffer();
                    k.__webglLineBuffer = j.createBuffer();
                    if (k.numMorphTargets) {
                        var m = void 0,
                            o = void 0;
                        k.__webglMorphTargetsBuffers = [];
                        m = 0;
                        for (o = k.numMorphTargets; m < o; m++) k.__webglMorphTargetsBuffers.push(j.createBuffer())
                    }
                    for (var k = h, m = e, n = void 0, t = void 0, p = void 0, u = p = void 0, v = void 0, w = void 0, y = w = o = 0, A = p = t = void 0, B = A = t = n = void 0, p = void 0, u = m.geometry, v = u.faces, A = k.faces, n = 0, t = A.length; n < t; n++) p = A[n], p = v[p], p instanceof THREE.Face3 ? (o += 3, w += 1, y += 3) : p instanceof THREE.Face4 && (o += 4, w += 2, y += 4);
                    for (var n = k, t = m, D = A = v = void 0, F = void 0, D = void 0, p = [], v = 0, A = t.materials.length; v < A; v++) if (D = t.materials[v], D instanceof THREE.MeshFaceMaterial) {
                        D = 0;
                        for (l = n.materials.length; D < l; D++)(F = n.materials[D]) && p.push(F)
                    } else(F = D) && p.push(F);
                    n = p;
                    k.__materials = n;
                    a: {
                        v = t = void 0;
                        A = n.length;
                        for (t = 0; t < A; t++) if (v = n[t], v.map || v.lightMap || v instanceof THREE.MeshShaderMaterial) {
                            t = !0;
                            break a
                        }
                        t = !1
                    }
                    a: {
                        A = v = void 0;
                        p = n.length;
                        for (v = 0; v < p; v++) if (A = n[v], !(A instanceof THREE.MeshBasicMaterial && !A.envMap || A instanceof THREE.MeshDepthMaterial)) {
                            A = A && A.shading != void 0 && A.shading == THREE.SmoothShading ? THREE.SmoothShading : THREE.FlatShading;
                            break a
                        }
                        A = !1
                    }
                    a: {
                        p = v = void 0;
                        D = n.length;
                        for (v = 0; v < D; v++) if (p = n[v],
                        p.vertexColors) {
                            p = p.vertexColors;
                            break a
                        }
                        p = !1
                    }
                    k.__vertexArray = new Float32Array(o * 3);
                    if (A) k.__normalArray = new Float32Array(o * 3);
                    if (u.hasTangents) k.__tangentArray = new Float32Array(o * 4);
                    if (p) k.__colorArray = new Float32Array(o * 3);
                    if (t) {
                        if (u.faceUvs.length > 0 || u.faceVertexUvs.length > 0) k.__uvArray = new Float32Array(o * 2);
                        if (u.faceUvs.length > 1 || u.faceVertexUvs.length > 1) k.__uv2Array = new Float32Array(o * 2)
                    }
                    if (m.geometry.skinWeights.length && m.geometry.skinIndices.length) k.__skinVertexAArray = new Float32Array(o * 4),
                    k.__skinVertexBArray = new Float32Array(o * 4), k.__skinIndexArray = new Float32Array(o * 4), k.__skinWeightArray = new Float32Array(o * 4);
                    k.__faceArray = new Uint16Array(w * 3 + (m.geometry.edgeFaces ? m.geometry.edgeFaces.length * 6 : 0));
                    k.__lineArray = new Uint16Array(y * 2);
                    if (k.numMorphTargets) {
                        k.__morphTargetsArrays = [];
                        u = 0;
                        for (v = k.numMorphTargets; u < v; u++) k.__morphTargetsArrays.push(new Float32Array(o * 3))
                    }
                    k.__needsSmoothNormals = A == THREE.SmoothShading;
                    k.__uvType = t;
                    k.__vertexColorType = p;
                    k.__normalType = A;
                    k.__webglFaceCount = w * 3 + (m.geometry.edgeFaces ? m.geometry.edgeFaces.length * 6 : 0);
                    k.__webglLineCount = y * 2;
                    u = 0;
                    for (v = n.length; u < v; u++) if (t = n[u], t.attributes) for (a in k.__webglCustomAttributes = {}, t.attributes) {
                        p = t.attributes[a];
                        A = {};
                        for (B in p) A[B] = p[B];
                        if (!A.__webglInitialized || A.createUniqueBuffers) A.__webglInitialized = !0, w = 1, A.type === "v2" ? w = 2 : A.type === "v3" ? w = 3 : A.type === "v4" ? w = 4 : A.type === "c" && (w = 3), A.size = w, A.array = new Float32Array(o * w), A.buffer = j.createBuffer(), A.buffer.belongsToAttribute = a, p.needsUpdate = !0, A.__original = p;
                        k.__webglCustomAttributes[a] = A
                    }
                    k.__inittedArrays = !0;
                    g.__dirtyVertices = !0;
                    g.__dirtyMorphTargets = !0;
                    g.__dirtyElements = !0;
                    g.__dirtyUvs = !0;
                    g.__dirtyNormals = !0;
                    g.__dirtyTangents = !0;
                    g.__dirtyColors = !0
                }
                e instanceof THREE.ShadowVolume ? H(c.__webglShadowVolumes, h, e) : H(c.__webglObjects, h, e)
            } else if (e instanceof THREE.LensFlare) H(c.__webglLensFlares, void 0, e);
            else if (e instanceof THREE.Ribbon) {
                g = e.geometry;
                if (!g.__webglVertexBuffer) f = g, f.__webglVertexBuffer = j.createBuffer(), f.__webglColorBuffer = j.createBuffer(),
                f = g, h = f.vertices.length, f.__vertexArray = new Float32Array(h * 3), f.__colorArray = new Float32Array(h * 3), f.__webglVertexCount = h, g.__dirtyVertices = !0, g.__dirtyColors = !0;
                H(c.__webglObjects, g, e)
            } else if (e instanceof THREE.Line) {
                g = e.geometry;
                if (!g.__webglVertexBuffer) f = g, f.__webglVertexBuffer = j.createBuffer(), f.__webglColorBuffer = j.createBuffer(), f = g, h = f.vertices.length, f.__vertexArray = new Float32Array(h * 3), f.__colorArray = new Float32Array(h * 3), f.__webglLineCount = h, g.__dirtyVertices = !0, g.__dirtyColors = !0;
                H(c.__webglObjects,
                g, e)
            } else if (e instanceof THREE.ParticleSystem) {
                g = e.geometry;
                if (!g.__webglVertexBuffer) f = g, f.__webglVertexBuffer = j.createBuffer(), f.__webglColorBuffer = j.createBuffer(), f = g, h = f.vertices.length, f.__vertexArray = new Float32Array(h * 3), f.__colorArray = new Float32Array(h * 3), f.__sortArray = [], f.__webglParticleCount = h, g.__dirtyVertices = !0, g.__dirtyColors = !0;
                H(c.__webglObjects, g, e)
            } else THREE.MarchingCubes !== void 0 && e instanceof THREE.MarchingCubes ? c.__webglObjectsImmediate.push({
                object: e,
                opaque: {
                    list: [],
                    count: 0
                },
                transparent: {
                    list: [],
                    count: 0
                }
            }) : e instanceof THREE.Sprite && c.__webglSprites.push(e);
            b.__objectsAdded.splice(0, 1)
        }
        for (; b.__objectsRemoved.length;) {
            c = b.__objectsRemoved[0];
            e = b;
            if (c instanceof THREE.ShadowVolume) z(e.__webglShadowVolumes, c);
            else if (c instanceof THREE.Mesh || c instanceof THREE.ParticleSystem || c instanceof THREE.Ribbon || c instanceof THREE.Line) z(e.__webglObjects, c);
            else if (c instanceof THREE.Sprite) {
                e = e.__webglSprites;
                g = void 0;
                for (g = e.length - 1; g >= 0; g--) e[g] == c && e.splice(g, 1)
            } else c instanceof
            THREE.LensFlare ? z(e.__webglLensFlares, c) : c instanceof THREE.MarchingCubes && z(e.__webglObjectsImmediate, c);
            b.__objectsRemoved.splice(0, 1)
        }
        e = 0;
        for (c = b.__webglObjects.length; e < c; e++) G(b.__webglObjects[e].object, b);
        e = 0;
        for (c = b.__webglShadowVolumes.length; e < c; e++) G(b.__webglShadowVolumes[e].object, b);
        e = 0;
        for (c = b.__webglLensFlares.length; e < c; e++) G(b.__webglLensFlares[e].object, b)
    };
    this.setFaceCulling = function (b, e) {
        b ? (!e || e == "ccw" ? j.frontFace(j.CCW) : j.frontFace(j.CW), b == "back" ? j.cullFace(j.BACK) : b == "front" ? j.cullFace(j.FRONT) : j.cullFace(j.FRONT_AND_BACK), j.enable(j.CULL_FACE)) : j.disable(j.CULL_FACE)
    };
    this.supportsVertexTextures = function () {
        return oa
    }
};
THREE.WebGLRenderTarget = function (b, c, e) {
    this.width = b;
    this.height = c;
    e = e || {};
    this.wrapS = e.wrapS !== void 0 ? e.wrapS : THREE.ClampToEdgeWrapping;
    this.wrapT = e.wrapT !== void 0 ? e.wrapT : THREE.ClampToEdgeWrapping;
    this.magFilter = e.magFilter !== void 0 ? e.magFilter : THREE.LinearFilter;
    this.minFilter = e.minFilter !== void 0 ? e.minFilter : THREE.LinearMipMapLinearFilter;
    this.offset = new THREE.Vector2(0, 0);
    this.repeat = new THREE.Vector2(1, 1);
    this.format = e.format !== void 0 ? e.format : THREE.RGBAFormat;
    this.type = e.type !== void 0 ? e.type : THREE.UnsignedByteType;
    this.depthBuffer = e.depthBuffer !== void 0 ? e.depthBuffer : !0;
    this.stencilBuffer = e.stencilBuffer !== void 0 ? e.stencilBuffer : !0
};
THREE.RenderableVertex = function () {
    this.positionWorld = new THREE.Vector3;
    this.positionScreen = new THREE.Vector4;
    this.visible = !0
};
THREE.RenderableVertex.prototype.copy = function (b) {
    this.positionWorld.copy(b.positionWorld);
    this.positionScreen.copy(b.positionScreen)
};
THREE.RenderableFace3 = function () {
    this.v1 = new THREE.RenderableVertex;
    this.v2 = new THREE.RenderableVertex;
    this.v3 = new THREE.RenderableVertex;
    this.centroidWorld = new THREE.Vector3;
    this.centroidScreen = new THREE.Vector3;
    this.normalWorld = new THREE.Vector3;
    this.vertexNormalsWorld = [new THREE.Vector3, new THREE.Vector3, new THREE.Vector3];
    this.faceMaterials = this.meshMaterials = null;
    this.overdraw = !1;
    this.uvs = [
        []
    ];
    this.z = null
};
THREE.RenderableFace4 = function () {
    this.v1 = new THREE.RenderableVertex;
    this.v2 = new THREE.RenderableVertex;
    this.v3 = new THREE.RenderableVertex;
    this.v4 = new THREE.RenderableVertex;
    this.centroidWorld = new THREE.Vector3;
    this.centroidScreen = new THREE.Vector3;
    this.normalWorld = new THREE.Vector3;
    this.vertexNormalsWorld = [new THREE.Vector3, new THREE.Vector3, new THREE.Vector3, new THREE.Vector3];
    this.faceMaterials = this.meshMaterials = null;
    this.overdraw = !1;
    this.uvs = [
        []
    ];
    this.z = null
};
THREE.RenderableObject = function () {
    this.z = this.object = null
};
THREE.RenderableParticle = function () {
    this.rotation = this.z = this.y = this.x = null;
    this.scale = new THREE.Vector2;
    this.materials = null
};
THREE.RenderableLine = function () {
    this.z = null;
    this.v1 = new THREE.RenderableVertex;
    this.v2 = new THREE.RenderableVertex;
    this.materials = null
};
THREE.ColorUtils = {
    adjustHSV: function (b, c, e, f) {
        var g = THREE.ColorUtils.__hsv;
        THREE.ColorUtils.rgbToHsv(b, g);
        g.h = THREE.ColorUtils.clamp(g.h + c, 0, 1);
        g.s = THREE.ColorUtils.clamp(g.s + e, 0, 1);
        g.v = THREE.ColorUtils.clamp(g.v + f, 0, 1);
        b.setHSV(g.h, g.s, g.v)
    },
    rgbToHsv: function (b, c) {
        var e = b.r,
            f = b.g,
            g = b.b,
            k = Math.max(Math.max(e, f), g),
            h = Math.min(Math.min(e, f), g);
        if (h == k) h = e = 0;
        else {
            var m = k - h,
                h = m / k,
                e = e == k ? (f - g) / m : f == k ? 2 + (g - e) / m : 4 + (e - f) / m;
            e /= 6;
            e < 0 && (e += 1);
            e > 1 && (e -= 1)
        }
        c === void 0 && (c = {
            h: 0,
            s: 0,
            v: 0
        });
        c.h = e;
        c.s = h;
        c.v = k;
        return c
    },
    clamp: function (b, c, e) {
        return b < c ? c : b > e ? e : b
    }
};
THREE.ColorUtils.__hsv = {
    h: 0,
    s: 0,
    v: 0
};
var GeometryUtils = {
    merge: function (b, c) {
        var e = c instanceof THREE.Mesh,
            f = b.vertices.length,
            g = e ? c.geometry : c,
            k = b.vertices,
            h = g.vertices,
            m = b.faces,
            n = g.faces,
            o = b.faceVertexUvs[0],
            g = g.faceVertexUvs[0];
        e && c.matrixAutoUpdate && c.updateMatrix();
        for (var p = 0, t = h.length; p < t; p++) {
            var v = new THREE.Vertex(h[p].position.clone());
            e && c.matrix.multiplyVector3(v.position);
            k.push(v)
        }
        p = 0;
        for (t = n.length; p < t; p++) {
            var h = n[p],
                u, w, B = h.vertexNormals,
                v = h.vertexColors;
            h instanceof THREE.Face3 ? u = new THREE.Face3(h.a + f, h.b + f, h.c + f) : h instanceof THREE.Face4 && (u = new THREE.Face4(h.a + f, h.b + f, h.c + f, h.d + f));
            u.normal.copy(h.normal);
            e = 0;
            for (k = B.length; e < k; e++) w = B[e], u.vertexNormals.push(w.clone());
            u.color.copy(h.color);
            e = 0;
            for (k = v.length; e < k; e++) w = v[e], u.vertexColors.push(w.clone());
            u.materials = h.materials.slice();
            u.centroid.copy(h.centroid);
            m.push(u)
        }
        p = 0;
        for (t = g.length; p < t; p++) {
            f = g[p];
            m = [];
            e = 0;
            for (k = f.length; e < k; e++) m.push(new THREE.UV(f[e].u, f[e].v));
            o.push(m)
        }
    }
};
THREE.ImageUtils = {
    loadTexture: function (b, c, e) {
        var f = new Image,
            g = new THREE.Texture(f, c);
        f.onload = function () {
            g.needsUpdate = !0;
            e && e(this)
        };
        f.crossOrigin = "";
        f.src = b;
        return g
    },
    loadTextureCube: function (b, c, e) {
        var f, g = [],
            k = new THREE.Texture(g, c),
            c = g.loadCount = 0;
        for (f = b.length; c < f; ++c) g[c] = new Image, g[c].onload = function () {
            g.loadCount += 1;
            if (g.loadCount == 6) k.needsUpdate = !0;
            e && e(this)
        }, g[c].crossOrigin = "", g[c].src = b[c];
        return k
    }
};
THREE.SceneUtils = {
    showHierarchy: function (b, c) {
        THREE.SceneUtils.traverseHierarchy(b, function (b) {
            b.visible = c
        })
    },
    traverseHierarchy: function (b, c) {
        var e, f, g = b.children.length;
        for (f = 0; f < g; f++) e = b.children[f], c(e), THREE.SceneUtils.traverseHierarchy(e, c)
    }
};
if (THREE.WebGLRenderer) THREE.ShaderUtils = {
    lib: {
        fresnel: {
            uniforms: {
                mRefractionRatio: {
                    type: "f",
                    value: 1.02
                },
                mFresnelBias: {
                    type: "f",
                    value: 0.1
                },
                mFresnelPower: {
                    type: "f",
                    value: 2
                },
                mFresnelScale: {
                    type: "f",
                    value: 1
                },
                tCube: {
                    type: "t",
                    value: 1,
                    texture: null
                }
            },
            fragmentShader: "uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",
            vertexShader: "uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"
        },
        normal: {
            uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, THREE.UniformsLib.lights, {
                enableAO: {
                    type: "i",
                    value: 0
                },
                enableDiffuse: {
                    type: "i",
                    value: 0
                },
                enableSpecular: {
                    type: "i",
                    value: 0
                },
                tDiffuse: {
                    type: "t",
                    value: 0,
                    texture: null
                },
                tNormal: {
                    type: "t",
                    value: 2,
                    texture: null
                },
                tSpecular: {
                    type: "t",
                    value: 3,
                    texture: null
                },
                tAO: {
                    type: "t",
                    value: 4,
                    texture: null
                },
                uNormalScale: {
                    type: "f",
                    value: 1
                },
                tDisplacement: {
                    type: "t",
                    value: 5,
                    texture: null
                },
                uDisplacementBias: {
                    type: "f",
                    value: 0
                },
                uDisplacementScale: {
                    type: "f",
                    value: 1
                },
                uDiffuseColor: {
                    type: "c",
                    value: new THREE.Color(15658734)
                },
                uSpecularColor: {
                    type: "c",
                    value: new THREE.Color(1118481)
                },
                uAmbientColor: {
                    type: "c",
                    value: new THREE.Color(328965)
                },
                uShininess: {
                    type: "f",
                    value: 30
                },
                uOpacity: {
                    type: "f",
                    value: 1
                }
            }]),
            fragmentShader: ["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform float uNormalScale;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;",
            THREE.ShaderChunk.fog_pars_fragment, "void main() {\ngl_FragColor = vec4( 1.0 );\nvec4 mColor = vec4( uDiffuseColor, uOpacity );\nvec4 mSpecular = vec4( uSpecularColor, uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse )\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\nif( enableAO )\ngl_FragColor = gl_FragColor * texture2D( tAO, vUv );\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( vTangent, vBinormal, vNormal );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec4 pointTotal  = vec4( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nvec3 pointHalfVector = normalize( vPointLight[ i ].xyz + vViewPosition );\nfloat pointDistance = vPointLight[ i ].w;\nfloat pointDotNormalHalf = dot( normal, pointHalfVector );\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\nfloat pointSpecularWeight = 0.0;\nif ( pointDotNormalHalf >= 0.0 )\npointSpecularWeight = specularTex.r * pow( pointDotNormalHalf, uShininess );\npointTotal  += pointDistance * vec4( pointLightColor[ i ], 1.0 ) * ( mColor * pointDiffuseWeight + mSpecular * pointSpecularWeight * pointDiffuseWeight );\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec4 dirTotal  = vec4( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nvec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );\nfloat dirDotNormalHalf = dot( normal, dirHalfVector );\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\nfloat dirSpecularWeight = 0.0;\nif ( dirDotNormalHalf >= 0.0 )\ndirSpecularWeight = specularTex.r * pow( dirDotNormalHalf, uShininess );\ndirTotal  += vec4( directionalLightColor[ i ], 1.0 ) * ( mColor * dirDiffuseWeight + mSpecular * dirSpecularWeight * dirDiffuseWeight );\n}\n#endif\nvec4 totalLight = vec4( ambientLightColor * uAmbientColor, uOpacity );\n#if MAX_DIR_LIGHTS > 0\ntotalLight += dirTotal;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalLight += pointTotal;\n#endif\ngl_FragColor = gl_FragColor * totalLight;",
            THREE.ShaderChunk.fog_fragment, "}"].join("\n"),
            vertexShader: "attribute vec4 tangent;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\nvTangent = normalize( normalMatrix * tangent.xyz );\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvBinormal = normalize( vBinormal );\nvUv = uv;\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#ifdef VERTEX_TEXTURES\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\nvec4 displacedPosition = vec4( vNormal.xyz * df, 0.0 ) + mvPosition;\ngl_Position = projectionMatrix * displacedPosition;\n#else\ngl_Position = projectionMatrix * mvPosition;\n#endif\n}"
        },
        cube: {
            uniforms: {
                tCube: {
                    type: "t",
                    value: 1,
                    texture: null
                }
            },
            vertexShader: "varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "uniform samplerCube tCube;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( - wPos.x, wPos.yz ) );\n}"
        },
        convolution: {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: 0,
                    texture: null
                },
                uImageIncrement: {
                    type: "v2",
                    value: new THREE.Vector2(0.001953125, 0)
                },
                cKernel: {
                    type: "fv1",
                    value: []
                }
            },
            vertexShader: "varying vec2 vUv;\nuniform vec2 uImageIncrement;\nvoid main(void) {\nvUv = uv - ((KERNEL_SIZE - 1.0) / 2.0) * uImageIncrement;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "varying vec2 vUv;\nuniform sampler2D tDiffuse;\nuniform vec2 uImageIncrement;\nuniform float cKernel[KERNEL_SIZE];\nvoid main(void) {\nvec2 imageCoord = vUv;\nvec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );\nfor( int i=0; i<KERNEL_SIZE; ++i ) {\nsum += texture2D( tDiffuse, imageCoord ) * cKernel[i];\nimageCoord += uImageIncrement;\n}\ngl_FragColor = sum;\n}"
        },
        film: {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: 0,
                    texture: null
                },
                time: {
                    type: "f",
                    value: 0
                },
                nIntensity: {
                    type: "f",
                    value: 0.5
                },
                sIntensity: {
                    type: "f",
                    value: 0.05
                },
                sCount: {
                    type: "f",
                    value: 4096
                },
                grayscale: {
                    type: "i",
                    value: 1
                }
            },
            vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "varying vec2 vUv;\nuniform sampler2D tDiffuse;\nuniform float time;\nuniform bool grayscale;\nuniform float nIntensity;\nuniform float sIntensity;\nuniform float sCount;\nvoid main() {\nvec4 cTextureScreen = texture2D( tDiffuse, vUv );\nfloat x = vUv.x * vUv.y * time *  1000.0;\nx = mod( x, 13.0 ) * mod( x, 123.0 );\nfloat dx = mod( x, 0.01 );\nvec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );\nvec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );\ncResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;\ncResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );\nif( grayscale ) {\ncResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );\n}\ngl_FragColor =  vec4( cResult, cTextureScreen.a );\n}"
        },
        screen: {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: 0,
                    texture: null
                },
                opacity: {
                    type: "f",
                    value: 1
                }
            },
            vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "varying vec2 vUv;\nuniform sampler2D tDiffuse;\nuniform float opacity;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\ngl_FragColor = opacity * texel;\n}"
        },
        basic: {
            uniforms: {},
            vertexShader: "void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "void main() {\ngl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );\n}"
        }
    },
    buildKernel: function (b) {
        var c, e, f, g, k = 2 * Math.ceil(b * 3) + 1;
        k > 25 && (k = 25);
        g = (k - 1) * 0.5;
        e = Array(k);
        for (c = f = 0; c < k; ++c) e[c] = Math.exp(-((c - g) * (c - g)) / (2 * b * b)), f += e[c];
        for (c = 0; c < k; ++c) e[c] /= f;
        return e
    }
};
THREE.AnimationHandler = function () {
    var b = [],
        c = {}, e = {
            update: function (e) {
                for (var c = 0; c < b.length; c++) b[c].update(e)
            },
            addToUpdate: function (e) {
                b.indexOf(e) === -1 && b.push(e)
            },
            removeFromUpdate: function (e) {
                e = b.indexOf(e);
                e !== -1 && b.splice(e, 1)
            },
            add: function (b) {
                c[b.name] !== void 0 && console.log("THREE.AnimationHandler.add: Warning! " + b.name + " already exists in library. Overwriting.");
                c[b.name] = b;
                if (b.initialized !== !0) {
                    for (var e = 0; e < b.hierarchy.length; e++) {
                        for (var f = 0; f < b.hierarchy[e].keys.length; f++) {
                            if (b.hierarchy[e].keys[f].time < 0) b.hierarchy[e].keys[f].time = 0;
                            if (b.hierarchy[e].keys[f].rot !== void 0 && !(b.hierarchy[e].keys[f].rot instanceof THREE.Quaternion)) {
                                var m = b.hierarchy[e].keys[f].rot;
                                b.hierarchy[e].keys[f].rot = new THREE.Quaternion(m[0], m[1], m[2], m[3])
                            }
                        }
                        if (b.hierarchy[e].keys[0].morphTargets !== void 0) {
                            m = {};
                            for (f = 0; f < b.hierarchy[e].keys.length; f++) for (var n = 0; n < b.hierarchy[e].keys[f].morphTargets.length; n++) {
                                var o = b.hierarchy[e].keys[f].morphTargets[n];
                                m[o] = -1
                            }
                            b.hierarchy[e].usedMorphTargets = m;
                            for (f = 0; f < b.hierarchy[e].keys.length; f++) {
                                var p = {};
                                for (o in m) {
                                    for (n = 0; n < b.hierarchy[e].keys[f].morphTargets.length; n++) if (b.hierarchy[e].keys[f].morphTargets[n] === o) {
                                        p[o] = b.hierarchy[e].keys[f].morphTargetsInfluences[n];
                                        break
                                    }
                                    n === b.hierarchy[e].keys[f].morphTargets.length && (p[o] = 0)
                                }
                                b.hierarchy[e].keys[f].morphTargetsInfluences = p
                            }
                        }
                        for (f = 1; f < b.hierarchy[e].keys.length; f++) b.hierarchy[e].keys[f].time === b.hierarchy[e].keys[f - 1].time && (b.hierarchy[e].keys.splice(f, 1), f--);
                        for (f = 1; f < b.hierarchy[e].keys.length; f++) b.hierarchy[e].keys[f].index = f
                    }
                    f = parseInt(b.length * b.fps, 10);
                    b.JIT = {};
                    b.JIT.hierarchy = [];
                    for (e = 0; e < b.hierarchy.length; e++) b.JIT.hierarchy.push(Array(f));
                    b.initialized = !0
                }
            },
            get: function (b) {
                if (typeof b === "string") return c[b] ? c[b] : (console.log("THREE.AnimationHandler.get: Couldn't find animation " + b), null)
            },
            parse: function (b) {
                var e = [];
                if (b instanceof THREE.SkinnedMesh) for (var c = 0; c < b.bones.length; c++) e.push(b.bones[c]);
                else f(b, e);
                return e
            }
        }, f = function (b, e) {
            e.push(b);
            for (var c = 0; c < b.children.length; c++) f(b.children[c], e)
        };
    e.LINEAR = 0;
    e.CATMULLROM = 1;
    e.CATMULLROM_FORWARD = 2;
    return e
}();
THREE.Animation = function (b, c, e, f) {
    this.root = b;
    this.data = THREE.AnimationHandler.get(c);
    this.hierarchy = THREE.AnimationHandler.parse(b);
    this.currentTime = 0;
    this.timeScale = 1;
    this.isPlaying = !1;
    this.loop = this.isPaused = !0;
    this.interpolationType = e !== void 0 ? e : THREE.AnimationHandler.LINEAR;
    this.JITCompile = f !== void 0 ? f : !0;
    this.points = [];
    this.target = new THREE.Vector3
};
THREE.Animation.prototype.play = function (b, c) {
    if (!this.isPlaying) {
        this.isPlaying = !0;
        this.loop = b !== void 0 ? b : !0;
        this.currentTime = c !== void 0 ? c : 0;
        var e, f = this.hierarchy.length,
            g;
        for (e = 0; e < f; e++) {
            g = this.hierarchy[e];
            if (this.interpolationType !== THREE.AnimationHandler.CATMULLROM_FORWARD) g.useQuaternion = !0;
            g.matrixAutoUpdate = !0;
            if (g.animationCache === void 0) g.animationCache = {}, g.animationCache.prevKey = {
                pos: 0,
                rot: 0,
                scl: 0
            }, g.animationCache.nextKey = {
                pos: 0,
                rot: 0,
                scl: 0
            }, g.animationCache.originalMatrix = g instanceof
            THREE.Bone ? g.skinMatrix : g.matrix;
            var k = g.animationCache.prevKey;
            g = g.animationCache.nextKey;
            k.pos = this.data.hierarchy[e].keys[0];
            k.rot = this.data.hierarchy[e].keys[0];
            k.scl = this.data.hierarchy[e].keys[0];
            g.pos = this.getNextKeyWith("pos", e, 1);
            g.rot = this.getNextKeyWith("rot", e, 1);
            g.scl = this.getNextKeyWith("scl", e, 1)
        }
        this.update(0)
    }
    this.isPaused = !1;
    THREE.AnimationHandler.addToUpdate(this)
};
THREE.Animation.prototype.pause = function () {
    this.isPaused ? THREE.AnimationHandler.addToUpdate(this) : THREE.AnimationHandler.removeFromUpdate(this);
    this.isPaused = !this.isPaused
};
THREE.Animation.prototype.stop = function () {
    this.isPaused = this.isPlaying = !1;
    THREE.AnimationHandler.removeFromUpdate(this);
    for (var b = 0; b < this.hierarchy.length; b++) if (this.hierarchy[b].animationCache !== void 0) this.hierarchy[b] instanceof THREE.Bone ? this.hierarchy[b].skinMatrix = this.hierarchy[b].animationCache.originalMatrix : this.hierarchy[b].matrix = this.hierarchy[b].animationCache.originalMatrix, delete this.hierarchy[b].animationCache
};
THREE.Animation.prototype.update = function (b) {
    if (this.isPlaying) {
        var c = ["pos", "rot", "scl"],
            e, f, g, k, h, m, n, o, p = this.data.JIT.hierarchy,
            t, v;
        this.currentTime += b * this.timeScale;
        v = this.currentTime;
        t = this.currentTime %= this.data.length;
        o = parseInt(Math.min(t * this.data.fps, this.data.length * this.data.fps), 10);
        for (var u = 0, w = this.hierarchy.length; u < w; u++) if (b = this.hierarchy[u], n = b.animationCache, this.JITCompile && p[u][o] !== void 0) b instanceof THREE.Bone ? (b.skinMatrix = p[u][o], b.matrixAutoUpdate = !1, b.matrixWorldNeedsUpdate = !1) : (b.matrix = p[u][o], b.matrixAutoUpdate = !1, b.matrixWorldNeedsUpdate = !0);
        else {
            if (this.JITCompile) b instanceof THREE.Bone ? b.skinMatrix = b.animationCache.originalMatrix : b.matrix = b.animationCache.originalMatrix;
            for (var B = 0; B < 3; B++) {
                e = c[B];
                h = n.prevKey[e];
                m = n.nextKey[e];
                if (m.time <= v) {
                    if (t < v) if (this.loop) {
                        h = this.data.hierarchy[u].keys[0];
                        for (m = this.getNextKeyWith(e, u, 1); m.time < t;) h = m, m = this.getNextKeyWith(e, u, m.index + 1)
                    } else {
                        this.stop();
                        return
                    } else {
                        do h = m, m = this.getNextKeyWith(e, u, m.index + 1);
                        while (m.time < t)
                    }
                    n.prevKey[e] = h;
                    n.nextKey[e] = m
                }
                b.matrixAutoUpdate = !0;
                b.matrixWorldNeedsUpdate = !0;
                f = (t - h.time) / (m.time - h.time);
                g = h[e];
                k = m[e];
                if (f < 0 || f > 1) console.log("THREE.Animation.update: Warning! Scale out of bounds:" + f + " on bone " + u), f = f < 0 ? 0 : 1;
                if (e === "pos") if (e = b.position, this.interpolationType === THREE.AnimationHandler.LINEAR) e.x = g[0] + (k[0] - g[0]) * f, e.y = g[1] + (k[1] - g[1]) * f, e.z = g[2] + (k[2] - g[2]) * f;
                else {
                    if (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) if (this.points[0] = this.getPrevKeyWith("pos", u, h.index - 1).pos, this.points[1] = g, this.points[2] = k, this.points[3] = this.getNextKeyWith("pos", u, m.index + 1).pos, f = f * 0.33 + 0.33, g = this.interpolateCatmullRom(this.points, f), e.x = g[0], e.y = g[1], e.z = g[2], this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) f = this.interpolateCatmullRom(this.points, f * 1.01), this.target.set(f[0], f[1], f[2]), this.target.subSelf(e), this.target.y = 0, this.target.normalize(), f = Math.atan2(this.target.x, this.target.z), b.rotation.set(0, f, 0)
                } else if (e ===
                    "rot") THREE.Quaternion.slerp(g, k, b.quaternion, f);
                else if (e === "scl") e = b.scale, e.x = g[0] + (k[0] - g[0]) * f, e.y = g[1] + (k[1] - g[1]) * f, e.z = g[2] + (k[2] - g[2]) * f
            }
        }
        if (this.JITCompile && p[0][o] === void 0) {
            this.hierarchy[0].update(void 0, !0);
            for (u = 0; u < this.hierarchy.length; u++) p[u][o] = this.hierarchy[u] instanceof THREE.Bone ? this.hierarchy[u].skinMatrix.clone() : this.hierarchy[u].matrix.clone()
        }
    }
};
THREE.Animation.prototype.interpolateCatmullRom = function (b, c) {
    var e = [],
        f = [],
        g, k, h, m, n, o;
    g = (b.length - 1) * c;
    k = Math.floor(g);
    g -= k;
    e[0] = k == 0 ? k : k - 1;
    e[1] = k;
    e[2] = k > b.length - 2 ? k : k + 1;
    e[3] = k > b.length - 3 ? k : k + 2;
    k = b[e[0]];
    m = b[e[1]];
    n = b[e[2]];
    o = b[e[3]];
    e = g * g;
    h = g * e;
    f[0] = this.interpolate(k[0], m[0], n[0], o[0], g, e, h);
    f[1] = this.interpolate(k[1], m[1], n[1], o[1], g, e, h);
    f[2] = this.interpolate(k[2], m[2], n[2], o[2], g, e, h);
    return f
};
THREE.Animation.prototype.interpolate = function (b, c, e, f, g, k, h) {
    b = (e - b) * 0.5;
    f = (f - c) * 0.5;
    return (2 * (c - e) + b + f) * h + (-3 * (c - e) - 2 * b - f) * k + b * g + c
};
THREE.Animation.prototype.getNextKeyWith = function (b, c, e) {
    var f = this.data.hierarchy[c].keys;
    for (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? e = e < f.length - 1 ? e : f.length - 1 : e %= f.length; e < f.length; e++) if (f[e][b] !== void 0) return f[e];
    return this.data.hierarchy[c].keys[0]
};
THREE.Animation.prototype.getPrevKeyWith = function (b, c, e) {
    for (var f = this.data.hierarchy[c].keys, e = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? e > 0 ? e : 0 : e >= 0 ? e : e + f.length; e >= 0; e--) if (f[e][b] !== void 0) return f[e];
    return this.data.hierarchy[c].keys[f.length - 1]
};
THREE.FirstPersonCamera = function (b) {
    function c(b, c) {
        return function () {
            c.apply(b, arguments)
        }
    }
    THREE.Camera.call(this, b.fov, b.aspect, b.near, b.far, b.target);
    this.movementSpeed = 1;
    this.lookSpeed = 0.005;
    this.noFly = !1;
    this.lookVertical = !0;
    this.autoForward = !1;
    this.activeLook = !0;
    this.heightSpeed = !1;
    this.heightCoef = 1;
    this.heightMin = 0;
    this.constrainVertical = !1;
    this.verticalMin = 0;
    this.verticalMax = 3.14;
    this.domElement = document;
    this.lastUpdate = (new Date).getTime();
    this.tdiff = 0;
    if (b) {
        if (b.movementSpeed !== void 0) this.movementSpeed = b.movementSpeed;
        if (b.lookSpeed !== void 0) this.lookSpeed = b.lookSpeed;
        if (b.noFly !== void 0) this.noFly = b.noFly;
        if (b.lookVertical !== void 0) this.lookVertical = b.lookVertical;
        if (b.autoForward !== void 0) this.autoForward = b.autoForward;
        if (b.activeLook !== void 0) this.activeLook = b.activeLook;
        if (b.heightSpeed !== void 0) this.heightSpeed = b.heightSpeed;
        if (b.heightCoef !== void 0) this.heightCoef = b.heightCoef;
        if (b.heightMin !== void 0) this.heightMin = b.heightMin;
        if (b.heightMax !== void 0) this.heightMax = b.heightMax;
        if (b.constrainVertical !== void 0) this.constrainVertical = b.constrainVertical;
        if (b.verticalMin !== void 0) this.verticalMin = b.verticalMin;
        if (b.verticalMax !== void 0) this.verticalMax = b.verticalMax;
        if (b.domElement !== void 0) this.domElement = b.domElement
    }
    this.theta = this.phi = this.lon = this.lat = this.mouseY = this.mouseX = this.autoSpeedFactor = 0;
    this.mouseDragOn = this.freeze = this.moveRight = this.moveLeft = this.moveBackward = this.moveForward = !1;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.onMouseDown = function (b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.activeLook) switch (b.button) {
            case 0:
                this.moveForward = !0;
                break;
            case 2:
                this.moveBackward = !0
        }
        this.mouseDragOn = !0
    };
    this.onMouseUp = function (b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.activeLook) switch (b.button) {
            case 0:
                this.moveForward = !1;
                break;
            case 2:
                this.moveBackward = !1
        }
        this.mouseDragOn = !1
    };
    this.onMouseMove = function (b) {
        this.mouseX = b.clientX - this.windowHalfX;
        this.mouseY = b.clientY - this.windowHalfY
    };
    this.onKeyDown = function (b) {
        switch (b.keyCode) {
            case 38:
            case 87:
                this.moveForward = !0;
                break;
            case 37:
            case 65:
                this.moveLeft = !0;
                break;
            case 40:
            case 83:
                this.moveBackward = !0;
                break;
            case 39:
            case 68:
                this.moveRight = !0;
                break;
            case 81:
                this.freeze = !this.freeze
        }
    };
    this.onKeyUp = function (b) {
        switch (b.keyCode) {
            case 38:
            case 87:
                this.moveForward = !1;
                break;
            case 37:
            case 65:
                this.moveLeft = !1;
                break;
            case 40:
            case 83:
                this.moveBackward = !1;
                break;
            case 39:
            case 68:
                this.moveRight = !1
        }
    };
    this.update = function () {
        var b = (new Date).getTime();
        this.tdiff = (b - this.lastUpdate) / 1E3;
        this.lastUpdate = b;
        if (!this.freeze) {
            this.autoSpeedFactor = this.heightSpeed ? this.tdiff * ((this.position.y < this.heightMin ? this.heightMin : this.position.y > this.heightMax ? this.heightMax : this.position.y) - this.heightMin) * this.heightCoef : 0;
            var c = this.tdiff * this.movementSpeed;
            (this.moveForward || this.autoForward && !this.moveBackward) && this.translateZ(-(c + this.autoSpeedFactor));
            this.moveBackward && this.translateZ(c);
            this.moveLeft && this.translateX(-c);
            this.moveRight && this.translateX(c);
            c = this.tdiff * this.lookSpeed;
            this.activeLook || (c = 0);
            this.lon += this.mouseX * c;
            this.lookVertical && (this.lat -= this.mouseY * c);
            this.lat = Math.max(-85, Math.min(85, this.lat));
            this.phi = (90 - this.lat) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;
            var b = this.target.position,
                g = this.position;
            b.x = g.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
            b.y = g.y + 100 * Math.cos(this.phi);
            b.z = g.z + 100 * Math.sin(this.phi) * Math.sin(this.theta)
        }
        this.lon += this.mouseX * c;
        this.lookVertical && (this.lat -= this.mouseY * c);
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = (90 - this.lat) * Math.PI / 180;
        this.theta = this.lon * Math.PI / 180;
        if (this.constrainVertical) this.phi = (this.phi - 0) * (this.verticalMax - this.verticalMin) / 3.14 + this.verticalMin;
        b = this.target.position;
        g = this.position;
        b.x = g.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        b.y = g.y + 100 * Math.cos(this.phi);
        b.z = g.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
        this.supr.update.call(this)
    };
    this.domElement.addEventListener("contextmenu", function (b) {
        b.preventDefault()
    }, !1);
    this.domElement.addEventListener("mousemove", c(this, this.onMouseMove), !1);
    this.domElement.addEventListener("mousedown", c(this, this.onMouseDown), !1);
    this.domElement.addEventListener("mouseup", c(this, this.onMouseUp), !1);
    this.domElement.addEventListener("keydown", c(this, this.onKeyDown), !1);
    this.domElement.addEventListener("keyup", c(this, this.onKeyUp), !1)
};
THREE.FirstPersonCamera.prototype = new THREE.Camera;
THREE.FirstPersonCamera.prototype.constructor = THREE.FirstPersonCamera;
THREE.FirstPersonCamera.prototype.supr = THREE.Camera.prototype;
THREE.FirstPersonCamera.prototype.translate = function (b, c) {
    this.matrix.rotateAxis(c);
    if (this.noFly) c.y = 0;
    this.position.addSelf(c.multiplyScalar(b));
    this.target.position.addSelf(c.multiplyScalar(b))
};
THREE.PathCamera = function (b) {
    function c(b, e, c, f) {
        var g = {
            name: c,
            fps: 0.6,
            length: f,
            hierarchy: []
        }, h, k = e.getControlPointsArray(),
            m = e.getLength(),
            n = k.length,
            G = 0;
        h = n - 1;
        e = {
            parent: -1,
            keys: []
        };
        e.keys[0] = {
            time: 0,
            pos: k[0],
            rot: [0, 0, 0, 1],
            scl: [1, 1, 1]
        };
        e.keys[h] = {
            time: f,
            pos: k[h],
            rot: [0, 0, 0, 1],
            scl: [1, 1, 1]
        };
        for (h = 1; h < n - 1; h++) G = f * m.chunks[h] / m.total, e.keys[h] = {
            time: G,
            pos: k[h]
        };
        g.hierarchy[0] = e;
        THREE.AnimationHandler.add(g);
        return new THREE.Animation(b, c, THREE.AnimationHandler.CATMULLROM_FORWARD, !1)
    }
    function e(b, e) {
        var c,
        f, h = new THREE.Geometry;
        for (c = 0; c < b.points.length * e; c++) f = c / (b.points.length * e), f = b.getPoint(f), h.vertices[c] = new THREE.Vertex(new THREE.Vector3(f.x, f.y, f.z));
        return h
    }
    function f(b, c) {
        var f = e(c, 10),
            h = e(c, 10),
            g = new THREE.LineBasicMaterial({
                color: 16711680,
                linewidth: 3
            });
        lineObj = new THREE.Line(f, g);
        particleObj = new THREE.ParticleSystem(h, new THREE.ParticleBasicMaterial({
            color: 16755200,
            size: 3
        }));
        lineObj.scale.set(1, 1, 1);
        b.addChild(lineObj);
        particleObj.scale.set(1, 1, 1);
        b.addChild(particleObj);
        h = new THREE.SphereGeometry(1,
        16, 8);
        g = new THREE.MeshBasicMaterial({
            color: 65280
        });
        for (i = 0; i < c.points.length; i++) f = new THREE.Mesh(h, g), f.position.copy(c.points[i]), f.updateMatrix(), b.addChild(f)
    }
    THREE.Camera.call(this, b.fov, b.aspect, b.near, b.far, b.target);
    this.id = "PathCamera" + THREE.PathCameraIdCounter++;
    this.duration = 1E4;
    this.waypoints = [];
    this.useConstantSpeed = !0;
    this.resamplingCoef = 50;
    this.debugPath = new THREE.Object3D;
    this.debugDummy = new THREE.Object3D;
    this.animationParent = new THREE.Object3D;
    this.lookSpeed = 0.005;
    this.lookHorizontal = this.lookVertical = !0;
    this.verticalAngleMap = {
        srcRange: [0, 6.28],
        dstRange: [0, 6.28]
    };
    this.horizontalAngleMap = {
        srcRange: [0, 6.28],
        dstRange: [0, 6.28]
    };
    this.domElement = document;
    if (b) {
        if (b.duration !== void 0) this.duration = b.duration * 1E3;
        if (b.waypoints !== void 0) this.waypoints = b.waypoints;
        if (b.useConstantSpeed !== void 0) this.useConstantSpeed = b.useConstantSpeed;
        if (b.resamplingCoef !== void 0) this.resamplingCoef = b.resamplingCoef;
        if (b.createDebugPath !== void 0) this.createDebugPath = b.createDebugPath;
        if (b.createDebugDummy !== void 0) this.createDebugDummy = b.createDebugDummy;
        if (b.lookSpeed !== void 0) this.lookSpeed = b.lookSpeed;
        if (b.lookVertical !== void 0) this.lookVertical = b.lookVertical;
        if (b.lookHorizontal !== void 0) this.lookHorizontal = b.lookHorizontal;
        if (b.verticalAngleMap !== void 0) this.verticalAngleMap = b.verticalAngleMap;
        if (b.horizontalAngleMap !== void 0) this.horizontalAngleMap = b.horizontalAngleMap;
        if (b.domElement !== void 0) this.domElement = b.domElement
    }
    this.theta = this.phi = this.lon = this.lat = this.mouseY = this.mouseX = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    var g = Math.PI * 2,
        k = Math.PI / 180;
    this.update = function (b, e, c) {
        var f, h;
        this.lookHorizontal && (this.lon += this.mouseX * this.lookSpeed);
        this.lookVertical && (this.lat -= this.mouseY * this.lookSpeed);
        this.lon = Math.max(0, Math.min(360, this.lon));
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = (90 - this.lat) * k;
        this.theta = this.lon * k;
        f = this.phi % g;
        this.phi = f >= 0 ? f : f + g;
        f = this.verticalAngleMap.srcRange;
        h = this.verticalAngleMap.dstRange;
        var m = h[1] - h[0];
        this.phi = TWEEN.Easing.Quadratic.EaseInOut(((this.phi - f[0]) * (h[1] - h[0]) / (f[1] - f[0]) + h[0] - h[0]) / m) * m + h[0];
        f = this.horizontalAngleMap.srcRange;
        h = this.horizontalAngleMap.dstRange;
        m = h[1] - h[0];
        this.theta = TWEEN.Easing.Quadratic.EaseInOut(((this.theta - f[0]) * (h[1] - h[0]) / (f[1] - f[0]) + h[0] - h[0]) / m) * m + h[0];
        f = this.target.position;
        f.x = 100 * Math.sin(this.phi) * Math.cos(this.theta);
        f.y = 100 * Math.cos(this.phi);
        f.z = 100 * Math.sin(this.phi) * Math.sin(this.theta);
        this.supr.update.call(this, b, e, c)
    };
    this.onMouseMove = function (b) {
        this.mouseX = b.clientX - this.windowHalfX;
        this.mouseY = b.clientY - this.windowHalfY
    };
    this.spline = new THREE.Spline;
    this.spline.initFromArray(this.waypoints);
    this.useConstantSpeed && this.spline.reparametrizeByArcLength(this.resamplingCoef);
    if (this.createDebugDummy) {
        var b = new THREE.MeshLambertMaterial({
            color: 30719
        }),
            h = new THREE.MeshLambertMaterial({
                color: 65280
            }),
            m = new THREE.CubeGeometry(10, 10, 20),
            n = new THREE.CubeGeometry(2, 2, 10);
        this.animationParent = new THREE.Mesh(m, b);
        b = new THREE.Mesh(n, h);
        b.position.set(0, 10, 0);
        this.animation = c(this.animationParent, this.spline, this.id, this.duration);
        this.animationParent.addChild(this);
        this.animationParent.addChild(this.target);
        this.animationParent.addChild(b)
    } else this.animation = c(this.animationParent, this.spline, this.id, this.duration), this.animationParent.addChild(this.target), this.animationParent.addChild(this);
    this.createDebugPath && f(this.debugPath, this.spline);
    this.domElement.addEventListener("mousemove", function (b, e) {
        return function () {
            e.apply(b, arguments)
        }
    }(this, this.onMouseMove), !1)
};
THREE.PathCamera.prototype = new THREE.Camera;
THREE.PathCamera.prototype.constructor = THREE.PathCamera;
THREE.PathCamera.prototype.supr = THREE.Camera.prototype;
THREE.PathCameraIdCounter = 0;
THREE.FlyCamera = function (b) {
    function c(b, c) {
        return function () {
            c.apply(b, arguments)
        }
    }
    THREE.Camera.call(this, b.fov, b.aspect, b.near, b.far, b.target);
    this.tmpQuaternion = new THREE.Quaternion;
    this.movementSpeed = 1;
    this.rollSpeed = 0.005;
    this.autoForward = this.dragToLook = !1;
    this.domElement = document;
    if (b) {
        if (b.movementSpeed !== void 0) this.movementSpeed = b.movementSpeed;
        if (b.rollSpeed !== void 0) this.rollSpeed = b.rollSpeed;
        if (b.dragToLook !== void 0) this.dragToLook = b.dragToLook;
        if (b.autoForward !== void 0) this.autoForward = b.autoForward;
        if (b.domElement !== void 0) this.domElement = b.domElement
    }
    this.useTarget = !1;
    this.useQuaternion = !0;
    this.mouseStatus = 0;
    this.moveState = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0,
        pitchUp: 0,
        pitchDown: 0,
        yawLeft: 0,
        yawRight: 0,
        rollLeft: 0,
        rollRight: 0
    };
    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);
    this.lastUpdate = -1;
    this.tdiff = 0;
    this.handleEvent = function (b) {
        if (typeof this[b.type] == "function") this[b.type](b)
    };
    this.keydown = function (b) {
        if (!b.altKey) {
            switch (b.keyCode) {
                case 16:
                    this.movementSpeedMultiplier = 0.1;
                    break;
                case 87:
                    this.moveState.forward = 1;
                    break;
                case 83:
                    this.moveState.back = 1;
                    break;
                case 65:
                    this.moveState.left = 1;
                    break;
                case 68:
                    this.moveState.right = 1;
                    break;
                case 82:
                    this.moveState.up = 1;
                    break;
                case 70:
                    this.moveState.down = 1;
                    break;
                case 38:
                    this.moveState.pitchUp = 1;
                    break;
                case 40:
                    this.moveState.pitchDown = 1;
                    break;
                case 37:
                    this.moveState.yawLeft = 1;
                    break;
                case 39:
                    this.moveState.yawRight = 1;
                    break;
                case 81:
                    this.moveState.rollLeft = 1;
                    break;
                case 69:
                    this.moveState.rollRight = 1
            }
            this.updateMovementVector();
            this.updateRotationVector()
        }
    };
    this.keyup = function (b) {
        switch (b.keyCode) {
            case 16:
                this.movementSpeedMultiplier = 1;
                break;
            case 87:
                this.moveState.forward = 0;
                break;
            case 83:
                this.moveState.back = 0;
                break;
            case 65:
                this.moveState.left = 0;
                break;
            case 68:
                this.moveState.right = 0;
                break;
            case 82:
                this.moveState.up = 0;
                break;
            case 70:
                this.moveState.down = 0;
                break;
            case 38:
                this.moveState.pitchUp = 0;
                break;
            case 40:
                this.moveState.pitchDown = 0;
                break;
            case 37:
                this.moveState.yawLeft = 0;
                break;
            case 39:
                this.moveState.yawRight = 0;
                break;
            case 81:
                this.moveState.rollLeft = 0;
                break;
            case 69:
                this.moveState.rollRight = 0
        }
        this.updateMovementVector();
        this.updateRotationVector()
    };
    this.mousedown = function (b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.dragToLook) this.mouseStatus++;
        else switch (b.button) {
            case 0:
                this.moveForward = !0;
                break;
            case 2:
                this.moveBackward = !0
        }
    };
    this.mousemove = function (b) {
        if (!this.dragToLook || this.mouseStatus > 0) {
            var c = this.getContainerDimensions(),
                g = c.size[0] / 2,
                k = c.size[1] / 2;
            this.moveState.yawLeft = -(b.clientX - c.offset[0] - g) / g;
            this.moveState.pitchDown = (b.clientY - c.offset[1] - k) / k;
            this.updateRotationVector()
        }
    };
    this.mouseup = function (b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.dragToLook) this.mouseStatus--, this.moveState.yawLeft = this.moveState.pitchDown = 0;
        else switch (b.button) {
            case 0:
                this.moveForward = !1;
                break;
            case 2:
                this.moveBackward = !1
        }
        this.updateRotationVector()
    };
    this.update = function () {
        var b = (new Date).getTime();
        if (this.lastUpdate == -1) this.lastUpdate = b;
        this.tdiff = (b - this.lastUpdate) / 1E3;
        this.lastUpdate = b;
        var b = this.tdiff * this.movementSpeed,
            c = this.tdiff * this.rollSpeed;
        this.translateX(this.moveVector.x * b);
        this.translateY(this.moveVector.y * b);
        this.translateZ(this.moveVector.z * b);
        this.tmpQuaternion.set(this.rotationVector.x * c, this.rotationVector.y * c, this.rotationVector.z * c, 1).normalize();
        this.quaternion.multiplySelf(this.tmpQuaternion);
        this.matrix.setPosition(this.position);
        this.matrix.setRotationFromQuaternion(this.quaternion);
        this.matrixWorldNeedsUpdate = !0;
        this.supr.update.call(this)
    };
    this.updateMovementVector = function () {
        var b = this.moveState.forward || this.autoForward && !this.moveState.back ? 1 : 0;
        this.moveVector.x = -this.moveState.left + this.moveState.right;
        this.moveVector.y = -this.moveState.down + this.moveState.up;
        this.moveVector.z = -b + this.moveState.back
    };
    this.updateRotationVector = function () {
        this.rotationVector.x = -this.moveState.pitchDown + this.moveState.pitchUp;
        this.rotationVector.y = -this.moveState.yawRight + this.moveState.yawLeft;
        this.rotationVector.z = -this.moveState.rollRight + this.moveState.rollLeft
    };
    this.getContainerDimensions = function () {
        return this.domElement != document ? {
            size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
            offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
        } : {
            size: [window.innerWidth, window.innerHeight],
            offset: [0, 0]
        }
    };
    this.domElement.addEventListener("mousemove", c(this, this.mousemove), !1);
    this.domElement.addEventListener("mousedown", c(this, this.mousedown), !1);
    this.domElement.addEventListener("mouseup", c(this, this.mouseup), !1);
    window.addEventListener("keydown", c(this, this.keydown), !1);
    window.addEventListener("keyup", c(this,
    this.keyup), !1);
    this.updateMovementVector();
    this.updateRotationVector()
};
THREE.FlyCamera.prototype = new THREE.Camera;
THREE.FlyCamera.prototype.constructor = THREE.FlyCamera;
THREE.FlyCamera.prototype.supr = THREE.Camera.prototype;
THREE.RollCamera = function (b, c, e, f) {
    THREE.Camera.call(this, b, c, e, f);
    this.mouseLook = !0;
    this.autoForward = !1;
    this.rollSpeed = this.movementSpeed = this.lookSpeed = 1;
    this.constrainVertical = [-0.9, 0.9];
    this.domElement = document;
    this.matrixAutoUpdate = this.useTarget = !1;
    this.forward = new THREE.Vector3(0, 0, 1);
    this.roll = 0;
    this.lastUpdate = -1;
    this.delta = 0;
    var g = new THREE.Vector3,
        k = new THREE.Vector3,
        h = new THREE.Vector3,
        m = new THREE.Matrix4,
        n = !1,
        o = 1,
        p = 0,
        t = 0,
        v = 0,
        u = 0,
        w = 0,
        B = window.innerWidth / 2,
        A = window.innerHeight / 2;
    this.update = function () {
        var b = (new Date).getTime();
        if (this.lastUpdate == -1) this.lastUpdate = b;
        this.delta = (b - this.lastUpdate) / 1E3;
        this.lastUpdate = b;
        this.mouseLook && (b = this.delta * this.lookSpeed, this.rotateHorizontally(b * u), this.rotateVertically(b * w));
        b = this.delta * this.movementSpeed;
        this.translateZ(b * (p > 0 || this.autoForward && !(p < 0) ? 1 : p));
        this.translateX(b * t);
        this.translateY(b * v);
        n && (this.roll += this.rollSpeed * this.delta * o);
        if (this.forward.y > this.constrainVertical[1]) this.forward.y = this.constrainVertical[1], this.forward.normalize();
        else if (this.forward.y < this.constrainVertical[0]) this.forward.y = this.constrainVertical[0], this.forward.normalize();
        h.copy(this.forward);
        k.set(0, 1, 0);
        g.cross(k, h).normalize();
        k.cross(h, g).normalize();
        this.matrix.n11 = g.x;
        this.matrix.n12 = k.x;
        this.matrix.n13 = h.x;
        this.matrix.n21 = g.y;
        this.matrix.n22 = k.y;
        this.matrix.n23 = h.y;
        this.matrix.n31 = g.z;
        this.matrix.n32 = k.z;
        this.matrix.n33 = h.z;
        m.identity();
        m.n11 = Math.cos(this.roll);
        m.n12 = -Math.sin(this.roll);
        m.n21 = Math.sin(this.roll);
        m.n22 = Math.cos(this.roll);
        this.matrix.multiplySelf(m);
        this.matrixWorldNeedsUpdate = !0;
        this.matrix.n14 = this.position.x;
        this.matrix.n24 = this.position.y;
        this.matrix.n34 = this.position.z;
        this.supr.update.call(this)
    };
    this.translateX = function (b) {
        this.position.x += this.matrix.n11 * b;
        this.position.y += this.matrix.n21 * b;
        this.position.z += this.matrix.n31 * b
    };
    this.translateY = function (b) {
        this.position.x += this.matrix.n12 * b;
        this.position.y += this.matrix.n22 * b;
        this.position.z += this.matrix.n32 * b
    };
    this.translateZ = function (b) {
        this.position.x -= this.matrix.n13 * b;
        this.position.y -= this.matrix.n23 * b;
        this.position.z -= this.matrix.n33 * b
    };
    this.rotateHorizontally = function (b) {
        g.set(this.matrix.n11, this.matrix.n21, this.matrix.n31);
        g.multiplyScalar(b);
        this.forward.subSelf(g);
        this.forward.normalize()
    };
    this.rotateVertically = function (b) {
        k.set(this.matrix.n12, this.matrix.n22, this.matrix.n32);
        k.multiplyScalar(b);
        this.forward.addSelf(k);
        this.forward.normalize()
    };
    this.domElement.addEventListener("contextmenu", function (b) {
        b.preventDefault()
    }, !1);
    this.domElement.addEventListener("mousemove",

    function (b) {
        u = (b.clientX - B) / window.innerWidth;
        w = (b.clientY - A) / window.innerHeight
    }, !1);
    this.domElement.addEventListener("mousedown", function (b) {
        b.preventDefault();
        b.stopPropagation();
        switch (b.button) {
            case 0:
                p = 1;
                break;
            case 2:
                p = -1
        }
    }, !1);
    this.domElement.addEventListener("mouseup", function (b) {
        b.preventDefault();
        b.stopPropagation();
        switch (b.button) {
            case 0:
                p = 0;
                break;
            case 2:
                p = 0
        }
    }, !1);
    this.domElement.addEventListener("keydown", function (b) {
        switch (b.keyCode) {
            case 38:
            case 87:
                p = 1;
                break;
            case 37:
            case 65:
                t = -1;
                break;
            case 40:
            case 83:
                p = -1;
                break;
            case 39:
            case 68:
                t = 1;
                break;
            case 81:
                n = !0;
                o = 1;
                break;
            case 69:
                n = !0;
                o = -1;
                break;
            case 82:
                v = 1;
                break;
            case 70:
                v = -1
        }
    }, !1);
    this.domElement.addEventListener("keyup", function (b) {
        switch (b.keyCode) {
            case 38:
            case 87:
                p = 0;
                break;
            case 37:
            case 65:
                t = 0;
                break;
            case 40:
            case 83:
                p = 0;
                break;
            case 39:
            case 68:
                t = 0;
                break;
            case 81:
                n = !1;
                break;
            case 69:
                n = !1;
                break;
            case 82:
                v = 0;
                break;
            case 70:
                v = 0
        }
    }, !1)
};
THREE.RollCamera.prototype = new THREE.Camera;
THREE.RollCamera.prototype.constructor = THREE.RollCamera;
THREE.RollCamera.prototype.supr = THREE.Camera.prototype;
THREE.TrackballCamera = function (b) {
    function c(b, e) {
        return function () {
            e.apply(b, arguments)
        }
    }
    b = b || {};
    THREE.Camera.call(this, b.fov, b.aspect, b.near, b.far, b.target);
    this.domElement = b.domElement || document;
    this.screen = b.screen || {
        width: window.innerWidth,
        height: window.innerHeight,
        offsetLeft: 0,
        offsetTop: 0
    };
    this.radius = b.radius || (this.screen.width + this.screen.height) / 4;
    this.rotateSpeed = b.rotateSpeed || 1;
    this.zoomSpeed = b.zoomSpeed || 1.2;
    this.panSpeed = b.panSpeed || 0.3;
    this.noZoom = b.noZoom || !1;
    this.noPan = b.noPan || !1;
    this.staticMoving = b.staticMoving || !1;
    this.dynamicDampingFactor = b.dynamicDampingFactor || 0.2;
    this.minDistance = b.minDistance || 0;
    this.maxDistance = b.maxDistance || Infinity;
    this.keys = b.keys || [65, 83, 68];
    this.useTarget = !0;
    var e = !1,
        f = this.STATE.NONE,
        g = new THREE.Vector3,
        k = new THREE.Vector3,
        h = new THREE.Vector3,
        m = new THREE.Vector2,
        n = new THREE.Vector2,
        o = new THREE.Vector2,
        p = new THREE.Vector2;
    this.handleEvent = function (b) {
        if (typeof this[b.type] == "function") this[b.type](b)
    };
    this.getMouseOnScreen = function (b, e) {
        return new THREE.Vector2((b - this.screen.offsetLeft) / this.radius * 0.5, (e - this.screen.offsetTop) / this.radius * 0.5)
    };
    this.getMouseProjectionOnBall = function (b, e) {
        var c = new THREE.Vector3((b - this.screen.width * 0.5 - this.screen.offsetLeft) / this.radius, (this.screen.height * 0.5 + this.screen.offsetTop - e) / this.radius, 0),
            f = c.length();
        f > 1 ? c.normalize() : c.z = Math.sqrt(1 - f * f);
        g = this.position.clone().subSelf(this.target.position);
        f = this.up.clone().setLength(c.y);
        f.addSelf(this.up.clone().crossSelf(g).setLength(c.x));
        f.addSelf(g.setLength(c.z));
        return f
    };
    this.rotateCamera = function () {
        var b = Math.acos(k.dot(h) / k.length() / h.length());
        if (b) {
            var e = (new THREE.Vector3).cross(k, h).normalize(),
                c = new THREE.Quaternion;
            b *= this.rotateSpeed;
            c.setFromAxisAngle(e, -b);
            c.multiplyVector3(g);
            c.multiplyVector3(this.up);
            c.multiplyVector3(h);
            this.staticMoving ? k = h : (c.setFromAxisAngle(e, b * (this.dynamicDampingFactor - 1)), c.multiplyVector3(k))
        }
    };
    this.zoomCamera = function () {
        var b = 1 + (n.y - m.y) * this.zoomSpeed;
        b !== 1 && b > 0 && (g.multiplyScalar(b), this.staticMoving ? m = n : m.y += (n.y - m.y) * this.dynamicDampingFactor)
    };
    this.panCamera = function () {
        var b = p.clone().subSelf(o);
        if (b.lengthSq()) {
            b.multiplyScalar(g.length() * this.panSpeed);
            var e = g.clone().crossSelf(this.up).setLength(b.x);
            e.addSelf(this.up.clone().setLength(b.y));
            this.position.addSelf(e);
            this.target.position.addSelf(e);
            this.staticMoving ? o = p : o.addSelf(b.sub(p, o).multiplyScalar(this.dynamicDampingFactor))
        }
    };
    this.checkDistances = function () {
        if (!this.noZoom || !this.noPan) this.position.lengthSq() > this.maxDistance * this.maxDistance && this.position.setLength(this.maxDistance),
        g.lengthSq() < this.minDistance * this.minDistance && this.position.add(this.target.position, g.setLength(this.minDistance))
    };
    this.update = function (b, e, c) {
        g = this.position.clone().subSelf(this.target.position);
        this.rotateCamera();
        this.noZoom || this.zoomCamera();
        this.noPan || this.panCamera();
        this.position.add(this.target.position, g);
        this.checkDistances();
        this.supr.update.call(this, b, e, c)
    };
    this.domElement.addEventListener("contextmenu", function (b) {
        b.preventDefault()
    }, !1);
    this.domElement.addEventListener("mousemove",
    c(this, function (b) {
        e && (k = h = this.getMouseProjectionOnBall(b.clientX, b.clientY), m = n = this.getMouseOnScreen(b.clientX, b.clientY), o = p = this.getMouseOnScreen(b.clientX, b.clientY), e = !1);
        f !== this.STATE.NONE && (f === this.STATE.ROTATE ? h = this.getMouseProjectionOnBall(b.clientX, b.clientY) : f === this.STATE.ZOOM && !this.noZoom ? n = this.getMouseOnScreen(b.clientX, b.clientY) : f === this.STATE.PAN && !this.noPan && (p = this.getMouseOnScreen(b.clientX, b.clientY)))
    }), !1);
    this.domElement.addEventListener("mousedown", c(this, function (b) {
        b.preventDefault();
        b.stopPropagation();
        if (f === this.STATE.NONE) f = b.button, f === this.STATE.ROTATE ? k = h = this.getMouseProjectionOnBall(b.clientX, b.clientY) : f === this.STATE.ZOOM && !this.noZoom ? m = n = this.getMouseOnScreen(b.clientX, b.clientY) : this.noPan || (o = p = this.getMouseOnScreen(b.clientX, b.clientY))
    }), !1);
    this.domElement.addEventListener("mouseup", c(this, function (b) {
        b.preventDefault();
        b.stopPropagation();
        f = this.STATE.NONE
    }), !1);
    window.addEventListener("keydown", c(this, function (b) {
        if (f === this.STATE.NONE) {
            if (b.keyCode === this.keys[this.STATE.ROTATE]) f = this.STATE.ROTATE;
            else if (b.keyCode === this.keys[this.STATE.ZOOM] && !this.noZoom) f = this.STATE.ZOOM;
            else if (b.keyCode === this.keys[this.STATE.PAN] && !this.noPan) f = this.STATE.PAN;
            f !== this.STATE.NONE && (e = !0)
        }
    }), !1);
    window.addEventListener("keyup", c(this, function () {
        if (f !== this.STATE.NONE) f = this.STATE.NONE
    }), !1)
};
THREE.TrackballCamera.prototype = new THREE.Camera;
THREE.TrackballCamera.prototype.constructor = THREE.TrackballCamera;
THREE.TrackballCamera.prototype.supr = THREE.Camera.prototype;
THREE.TrackballCamera.prototype.STATE = {
    NONE: -1,
    ROTATE: 0,
    ZOOM: 1,
    PAN: 2
};
THREE.QuakeCamera = THREE.FirstPersonCamera;
THREE.CubeGeometry = function (b, c, e, f, g, k, h, m, n) {
    function o(b, e, c, h, m, n, o, t) {
        var u, v, w = f || 1,
            B = g || 1,
            K = m / 2,
            ea = n / 2,
            j = p.vertices.length;
        if (b == "x" && e == "y" || b == "y" && e == "x") u = "z";
        else if (b == "x" && e == "z" || b == "z" && e == "x") u = "y", B = k || 1;
        else if (b == "z" && e == "y" || b == "y" && e == "z") u = "x", w = k || 1;
        var ca = w + 1,
            T = B + 1;
        m /= w;
        var Z = n / B;
        for (v = 0; v < T; v++) for (n = 0; n < ca; n++) {
            var N = new THREE.Vector3;
            N[b] = (n * m - K) * c;
            N[e] = (v * Z - ea) * h;
            N[u] = o;
            p.vertices.push(new THREE.Vertex(N))
        }
        for (v = 0; v < B; v++) for (n = 0; n < w; n++) p.faces.push(new THREE.Face4(n + ca * v + j, n + ca * (v + 1) + j, n + 1 + ca * (v + 1) + j, n + 1 + ca * v + j, null, null, t)), p.faceVertexUvs[0].push([new THREE.UV(n / w, v / B), new THREE.UV(n / w, (v + 1) / B), new THREE.UV((n + 1) / w, (v + 1) / B), new THREE.UV((n + 1) / w, v / B)])
    }
    THREE.Geometry.call(this);
    var p = this,
        t = b / 2,
        v = c / 2,
        u = e / 2,
        m = m ? -1 : 1;
    if (h !== void 0) if (h instanceof Array) this.materials = h;
    else {
        this.materials = [];
        for (var w = 0; w < 6; w++) this.materials.push([h])
    } else this.materials = [];
    this.sides = {
        px: !0,
        nx: !0,
        py: !0,
        ny: !0,
        pz: !0,
        nz: !0
    };
    if (n != void 0) for (var B in n) this.sides[B] != void 0 && (this.sides[B] = n[B]);
    this.sides.px && o("z", "y", 1 * m, -1, e, c, -t, this.materials[0]);
    this.sides.nx && o("z", "y", -1 * m, -1, e, c, t, this.materials[1]);
    this.sides.py && o("x", "z", 1 * m, 1, b, e, v, this.materials[2]);
    this.sides.ny && o("x", "z", 1 * m, -1, b, e, -v, this.materials[3]);
    this.sides.pz && o("x", "y", 1 * m, -1, b, c, u, this.materials[4]);
    this.sides.nz && o("x", "y", -1 * m, -1, b, c, -u, this.materials[5]);
    (function () {
        for (var b = [], e = [], c = 0, f = p.vertices.length; c < f; c++) {
            for (var h = p.vertices[c], g = !1, k = 0, m = b.length; k < m; k++) {
                var n = b[k];
                if (h.position.x == n.position.x && h.position.y == n.position.y && h.position.z == n.position.z) {
                    e[c] = k;
                    g = !0;
                    break
                }
            }
            if (!g) e[c] = b.length, b.push(new THREE.Vertex(h.position.clone()))
        }
        c = 0;
        for (f = p.faces.length; c < f; c++) h = p.faces[c], h.a = e[h.a], h.b = e[h.b], h.c = e[h.c], h.d = e[h.d];
        p.vertices = b
    })();
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.CubeGeometry.prototype = new THREE.Geometry;
THREE.CubeGeometry.prototype.constructor = THREE.CubeGeometry;
THREE.CylinderGeometry = function (b, c, e, f, g, k) {
    function h(b, e, c) {
        m.vertices.push(new THREE.Vertex(new THREE.Vector3(b, e, c)))
    }
    THREE.Geometry.call(this);
    var m = this,
        n, o = Math.PI * 2,
        p = f / 2;
    for (n = 0; n < b; n++) h(Math.sin(o * n / b) * c, Math.cos(o * n / b) * c, -p);
    for (n = 0; n < b; n++) h(Math.sin(o * n / b) * e, Math.cos(o * n / b) * e, p);
    for (n = 0; n < b; n++) m.faces.push(new THREE.Face4(n, n + b, b + (n + 1) % b, (n + 1) % b));
    if (e > 0) {
        h(0, 0, -p - (k || 0));
        for (n = b; n < b + b / 2; n++) m.faces.push(new THREE.Face4(2 * b, (2 * n - 2 * b) % b, (2 * n - 2 * b + 1) % b, (2 * n - 2 * b + 2) % b))
    }
    if (c > 0) {
        h(0, 0, p + (g || 0));
        for (n = b + b / 2; n < 2 * b; n++) m.faces.push(new THREE.Face4(2 * b + 1, (2 * n - 2 * b + 2) % b + b, (2 * n - 2 * b + 1) % b + b, (2 * n - 2 * b) % b + b))
    }
    n = 0;
    for (b = this.faces.length; n < b; n++) {
        var c = [],
            e = this.faces[n],
            g = this.vertices[e.a],
            k = this.vertices[e.b],
            p = this.vertices[e.c],
            t = this.vertices[e.d];
        c.push(new THREE.UV(0.5 + Math.atan2(g.position.x, g.position.y) / o, 0.5 + g.position.z / f));
        c.push(new THREE.UV(0.5 + Math.atan2(k.position.x, k.position.y) / o, 0.5 + k.position.z / f));
        c.push(new THREE.UV(0.5 + Math.atan2(p.position.x, p.position.y) / o, 0.5 + p.position.z / f));
        e instanceof THREE.Face4 && c.push(new THREE.UV(0.5 + Math.atan2(t.position.x, t.position.y) / o, 0.5 + t.position.z / f));
        this.faceVertexUvs[0].push(c)
    }
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.CylinderGeometry.prototype = new THREE.Geometry;
THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry;
THREE.IcosahedronGeometry = function (b) {
    function c(b, e, c) {
        var f = Math.sqrt(b * b + e * e + c * c);
        return g.vertices.push(new THREE.Vertex(new THREE.Vector3(b / f, e / f, c / f))) - 1
    }
    function e(b, e, c, f) {
        f.faces.push(new THREE.Face3(b, e, c))
    }
    function f(b, e) {
        var f = g.vertices[b].position,
            h = g.vertices[e].position;
        return c((f.x + h.x) / 2, (f.y + h.y) / 2, (f.z + h.z) / 2)
    }
    var g = this,
        k = new THREE.Geometry,
        h;
    this.subdivisions = b || 0;
    THREE.Geometry.call(this);
    b = (1 + Math.sqrt(5)) / 2;
    c(-1, b, 0);
    c(1, b, 0);
    c(-1, -b, 0);
    c(1, -b, 0);
    c(0, -1, b);
    c(0, 1, b);
    c(0, -1, -b);
    c(0, 1, -b);
    c(b, 0, -1);
    c(b, 0, 1);
    c(-b, 0, -1);
    c(-b, 0, 1);
    e(0, 11, 5, k);
    e(0, 5, 1, k);
    e(0, 1, 7, k);
    e(0, 7, 10, k);
    e(0, 10, 11, k);
    e(1, 5, 9, k);
    e(5, 11, 4, k);
    e(11, 10, 2, k);
    e(10, 7, 6, k);
    e(7, 1, 8, k);
    e(3, 9, 4, k);
    e(3, 4, 2, k);
    e(3, 2, 6, k);
    e(3, 6, 8, k);
    e(3, 8, 9, k);
    e(4, 9, 5, k);
    e(2, 4, 11, k);
    e(6, 2, 10, k);
    e(8, 6, 7, k);
    e(9, 8, 1, k);
    for (b = 0; b < this.subdivisions; b++) {
        h = new THREE.Geometry;
        for (var m in k.faces) {
            var n = f(k.faces[m].a, k.faces[m].b),
                o = f(k.faces[m].b, k.faces[m].c),
                p = f(k.faces[m].c, k.faces[m].a);
            e(k.faces[m].a, n, p, h);
            e(k.faces[m].b, o, n, h);
            e(k.faces[m].c, p, o, h);
            e(n, o, p, h)
        }
        k.faces = h.faces
    }
    g.faces = k.faces;
    delete k;
    delete h;
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.IcosahedronGeometry.prototype = new THREE.Geometry;
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;
THREE.LatheGeometry = function (b, c, e) {
    THREE.Geometry.call(this);
    this.steps = c || 12;
    this.angle = e || 2 * Math.PI;
    for (var c = this.angle / this.steps, e = [], f = [], g = [], k = [], h = (new THREE.Matrix4).setRotationZ(c), m = 0; m < b.length; m++) this.vertices.push(new THREE.Vertex(b[m])), e[m] = b[m].clone(), f[m] = this.vertices.length - 1;
    for (var n = 0; n <= this.angle + 0.001; n += c) {
        for (m = 0; m < e.length; m++) n < this.angle ? (e[m] = h.multiplyVector3(e[m].clone()), this.vertices.push(new THREE.Vertex(e[m])), g[m] = this.vertices.length - 1) : g = k;
        n == 0 && (k = f);
        for (m = 0; m < f.length - 1; m++) this.faces.push(new THREE.Face4(g[m], g[m + 1], f[m + 1], f[m])), this.faceVertexUvs[0].push([new THREE.UV(1 - n / this.angle, m / b.length), new THREE.UV(1 - n / this.angle, (m + 1) / b.length), new THREE.UV(1 - (n - c) / this.angle, (m + 1) / b.length), new THREE.UV(1 - (n - c) / this.angle, m / b.length)]);
        f = g;
        g = []
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.LatheGeometry.prototype = new THREE.Geometry;
THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry;
THREE.PlaneGeometry = function (b, c, e, f) {
    THREE.Geometry.call(this);
    var g, k = b / 2,
        h = c / 2,
        e = e || 1,
        f = f || 1,
        m = e + 1,
        n = f + 1;
    b /= e;
    var o = c / f;
    for (g = 0; g < n; g++) for (c = 0; c < m; c++) this.vertices.push(new THREE.Vertex(new THREE.Vector3(c * b - k, -(g * o - h), 0)));
    for (g = 0; g < f; g++) for (c = 0; c < e; c++) this.faces.push(new THREE.Face4(c + m * g, c + m * (g + 1), c + 1 + m * (g + 1), c + 1 + m * g)), this.faceVertexUvs[0].push([new THREE.UV(c / e, g / f), new THREE.UV(c / e, (g + 1) / f), new THREE.UV((c + 1) / e, (g + 1) / f), new THREE.UV((c + 1) / e, g / f)]);
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.PlaneGeometry.prototype = new THREE.Geometry;
THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry;
THREE.SphereGeometry = function (b, c, e) {
    THREE.Geometry.call(this);
    for (var b = b || 50, f, g = Math.PI, k = Math.max(3, c || 8), h = Math.max(2, e || 6), c = [], e = 0; e < h + 1; e++) {
        f = e / h;
        var m = b * Math.cos(f * g),
            n = b * Math.sin(f * g),
            o = [],
            p = 0;
        for (f = 0; f < k; f++) {
            var t = 2 * f / k,
                v = n * Math.sin(t * g),
                t = n * Math.cos(t * g);
            (e == 0 || e == h) && f > 0 || (p = this.vertices.push(new THREE.Vertex(new THREE.Vector3(t, m, v))) - 1);
            o.push(p)
        }
        c.push(o)
    }
    for (var u, w, B, g = c.length, e = 0; e < g; e++) if (k = c[e].length, e > 0) for (f = 0; f < k; f++) {
        o = f == k - 1;
        h = c[e][o ? 0 : f + 1];
        m = c[e][o ? k - 1 : f];
        n = c[e - 1][o ? k - 1 : f];
        o = c[e - 1][o ? 0 : f + 1];
        v = e / (g - 1);
        u = (e - 1) / (g - 1);
        w = (f + 1) / k;
        var t = f / k,
            p = new THREE.UV(1 - w, v),
            v = new THREE.UV(1 - t, v),
            t = new THREE.UV(1 - t, u),
            A = new THREE.UV(1 - w, u);
        e < c.length - 1 && (u = this.vertices[h].position.clone(), w = this.vertices[m].position.clone(), B = this.vertices[n].position.clone(), u.normalize(), w.normalize(), B.normalize(), this.faces.push(new THREE.Face3(h, m, n, [new THREE.Vector3(u.x, u.y, u.z), new THREE.Vector3(w.x, w.y, w.z), new THREE.Vector3(B.x, B.y, B.z)])), this.faceVertexUvs[0].push([p, v, t]));
        e > 1 && (u = this.vertices[h].position.clone(), w = this.vertices[n].position.clone(), B = this.vertices[o].position.clone(), u.normalize(), w.normalize(), B.normalize(), this.faces.push(new THREE.Face3(h, n, o, [new THREE.Vector3(u.x, u.y, u.z), new THREE.Vector3(w.x, w.y, w.z), new THREE.Vector3(B.x, B.y, B.z)])), this.faceVertexUvs[0].push([p, t, A]))
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
    this.boundingSphere = {
        radius: b
    }
};
THREE.SphereGeometry.prototype = new THREE.Geometry;
THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry;
THREE.TextGeometry = function (b, c) {
    THREE.Geometry.call(this);
    this.parameters = c || {};
    this.set(b)
};
THREE.TextGeometry.prototype = new THREE.Geometry;
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;
THREE.TextGeometry.prototype.set = function (b, c) {
    function e(b, e, c) {
        w.vertices.push(new THREE.Vertex(new THREE.Vector3(b, e, c)))
    }
    function f(b, e, c, f) {
        w.faces.push(new THREE.Face4(b, e, c, f))
    }
    this.text = b;
    var c = c || this.parameters,
        g = c.height !== void 0 ? c.height : 50,
        k = c.curveSegments !== void 0 ? c.curveSegments : 4,
        h = c.font !== void 0 ? c.font : "helvetiker",
        m = c.weight !== void 0 ? c.weight : "normal",
        n = c.style !== void 0 ? c.style : "normal",
        o = c.bezelThickness !== void 0 ? c.bezelThickness : 10,
        p = c.bezelSize !== void 0 ? c.bezelSize : 8,
        t = c.bezelEnabled !== void 0 ? c.bezelEnabled : !1;
    THREE.FontUtils.size = c.size !== void 0 ? c.size : 100;
    THREE.FontUtils.divisions = k;
    THREE.FontUtils.face = h;
    THREE.FontUtils.weight = m;
    THREE.FontUtils.style = n;
    THREE.FontUtils.bezelSize = p;
    var m = THREE.FontUtils.drawText(b),
        k = m.points,
        v = m.faces,
        h = m.contour,
        u = m.bezel,
        w = this;
    w.vertices = [];
    w.faces = [];
    for (var B, n = k.length, A = v.length, p = u.length, m = 0; m < n; m++) B = k[m], e(B.x, B.y, 0);
    for (m = 0; m < n; m++) B = k[m], e(B.x, B.y, g);
    if (t) {
        for (m = 0; m < p; m++) B = u[m], e(B.x, B.y, o);
        for (m = 0; m < p; m++) B = u[m], e(B.x, B.y, g - o)
    }
    for (m = 0; m < A; m++) g = v[m], w.faces.push(new THREE.Face3(g[2], g[1], g[0]));
    for (m = 0; m < A; m++) g = v[m], w.faces.push(new THREE.Face3(g[0] + n, g[1] + n, g[2] + n));
    var y;
    if (t) for (m = u.length; --m > 0;) {
        if (y) {
            if (y.equals(h[m])) {
                y = null;
                continue
            }
        } else y = h[m];
        o = n * 2 + m;
        v = o - 1;
        f(o, v, v + p, o + p);
        for (t = 0; t < n; t++) if (k[t].equals(h[m])) break;
        for (g = 0; g < n; g++) if (k[g].equals(h[m - 1])) break;
        f(t, g, v, o);
        f(o + p, v + p, g + n, t + n)
    } else for (m = h.length; --m > 0;) {
        if (y) {
            if (y.equals(h[m])) {
                y = null;
                continue
            }
        } else y = h[m];
        for (t = 0; t < n; t++) if (k[t].equals(h[m])) break;
        for (g = 0; g < n; g++) if (k[g].equals(h[m - 1])) break;
        f(t, g, g + n, t + n)
    }
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.FontUtils = {
    faces: {},
    face: "helvetiker",
    weight: "normal",
    style: "normal",
    size: 150,
    divisions: 10,
    getFace: function () {
        return this.faces[this.face][this.weight][this.style]
    },
    loadFace: function (b) {
        var c = b.familyName.toLowerCase();
        this.faces[c] = this.faces[c] || {};
        this.faces[c][b.cssFontWeight] = this.faces[c][b.cssFontWeight] || {};
        this.faces[c][b.cssFontWeight][b.cssFontStyle] = b;
        return this.faces[c][b.cssFontWeight][b.cssFontStyle] = b
    },
    extractPoints: function (b, c) {
        if (b.length < 3) return console.log("not valid polygon"), {
            points: b,
            faces: []
        };
        for (var e, f, g, k, h, m = [], n = 0; n < c.length; n++) {
            h = c[n];
            k = [];
            for (e = 0; e < h.length; e++) f = h[e], k.push(f.x + "," + f.y);
            var o;
            e = k.slice(1).indexOf(k[0]);
            var p = this.Triangulate.area(h.slice(0, e + 1)) < 0;
            f = [];
            for (e = -1; e < k.length;) {
                o = e + 1;
                e = k[o];
                e = k.slice(o + 1).indexOf(e) + o;
                if (e <= o) break;
                var t = h.slice(o, e + 1);
                p ? this.Triangulate.area(t) < 0 ? (o > 0 && m.push({
                    shape: g,
                    holes: f
                }), g = t, f = []) : f.push(t) : this.Triangulate.area(t) < 0 ? (m.push({
                    shape: t,
                    holes: f
                }), f = []) : f.push(t);
                e++
            }
            p && m.push({
                shape: g,
                holes: f
            })
        }
        var v, u, w,
        B, A, y;
        k = [];
        for (h = 0; h < m.length; h++) {
            n = m[h];
            g = n.shape;
            f = n.holes;
            for (o = 0; o < f.length; o++) {
                p = f[o];
                w = Number.POSITIVE_INFINITY;
                for (t = 0; t < p.length; t++) {
                    A = p[t];
                    for (e = 0; e < g.length; e++) B = g[e], B = A.distanceTo(B), B < w && (w = B, v = t, u = e)
                }
                e = u - 1 >= 0 ? u - 1 : g.length - 1;
                var t = v - 1 >= 0 ? v - 1 : p.length - 1,
                    G = [];
                G.push(p[v]);
                G.push(g[u]);
                G.push(g[e]);
                w = this.Triangulate.area(G);
                var z = [];
                z.push(p[v]);
                z.push(p[t]);
                z.push(g[u]);
                A = this.Triangulate.area(z);
                B = u;
                y = v;
                u += 1;
                v += -1;
                u < 0 && (u += g.length);
                u %= g.length;
                v < 0 && (v += p.length);
                v %= g.length;
                e = u - 1 >= 0 ? u - 1 : g.length - 1;
                t = v - 1 >= 0 ? v - 1 : p.length - 1;
                G = [];
                G.push(p[v]);
                G.push(g[u]);
                G.push(g[e]);
                G = this.Triangulate.area(G);
                z = [];
                z.push(p[v]);
                z.push(p[t]);
                z.push(g[u]);
                z = this.Triangulate.area(z);
                w + A > G + z && (u = B, v = y, u < 0 && (u += g.length), u %= g.length, v < 0 && (v += p.length), v %= g.length, e = u - 1 >= 0 ? u - 1 : g.length - 1, t = v - 1 >= 0 ? v - 1 : p.length - 1);
                w = g.slice(0, u);
                A = g.slice(u);
                B = p.slice(v);
                y = p.slice(0, v);
                k.push(p[v]);
                k.push(g[u]);
                k.push(g[e]);
                k.push(p[v]);
                k.push(p[t]);
                k.push(g[u]);
                g = w.concat(B).concat(y).concat(A)
            }
            n.shape = g
        }
        v = [];
        u = [];
        for (h = o = 0; h < m.length; h++) {
            n = m[h];
            g = n.shape;
            v = v.concat(g);
            p = THREE.FontUtils.Triangulate(g, !0);
            for (f = 0; f < p.length; f++) n = p[f], n[0] += o, n[1] += o, n[2] += o;
            u = u.concat(p);
            o += g.length
        }
        var C;
        for (f = 0; f < k.length / 3; f++) {
            n = [];
            for (m = 0; m < 3; m++) {
                h = !1;
                for (g = 0; g < v.length && !h; g++) C = f * 3 + m, v[g].equals(k[C]) && (n.push(g), h = !0);
                h || (v.push(k[C]), n.push(v.length - 1), console.log("not found"))
            }
            u.push(n)
        }
        return {
            points: v,
            faces: u
        }
    },
    drawText: function (b) {
        var c = [],
            e = [],
            f, g = this.getFace(),
            k = this.size / g.resolution,
            h = 0;
        f = String(b).split("");
        for (var m = f.length, b = 0; b < m; b++) {
            var n = this.extractGlyphPoints(f[b], g, k, h);
            h += n.offset;
            c.push(n.points);
            e = e.concat(n.points)
        }
        b = h / 2;
        for (f = 0; f < e.length; f++) e[f].x -= b;
        c = this.extractPoints(e, c);
        c.contour = e;
        g = [];
        k = [];
        f = [];
        for (var h = [], m = new THREE.Vector2, o, b = e.length; --b >= 0;) {
            if (o) {
                if (o.equals(e[b])) {
                    o = null;
                    n = this.Triangulate.area(f) > 0;
                    h.push(n);
                    k.push(m.divideScalar(f.length));
                    f = [];
                    m = new THREE.Vector2;
                    continue
                }
            } else o = e[b];
            m.addSelf(e[b]);
            f.push(e[b])
        }
        b = e.length;
        f = 0;
        for (var p; --b >= 0;) n = e[b], m = k[f], n = n.clone().subSelf(m),
        p = this.bezelSize / n.length(), h[f] ? p += 1 : p = 1 - p, p = n.multiplyScalar(p).addSelf(m), g.unshift(p), o ? o.equals(e[b]) && (o = null, f++) : o = e[b];
        c.bezel = g;
        return c
    },
    b2p0: function (b, c) {
        var e = 1 - b;
        return e * e * c
    },
    b2p1: function (b, c) {
        return 2 * (1 - b) * b * c
    },
    b2p2: function (b, c) {
        return b * b * c
    },
    b2: function (b, c, e, f) {
        return this.b2p0(b, c) + this.b2p1(b, e) + this.b2p2(b, f)
    },
    b3p0: function (b, c) {
        var e = 1 - b;
        return e * e * e * c
    },
    b3p1: function (b, c) {
        var e = 1 - b;
        return 3 * e * e * b * c
    },
    b3p2: function (b, c) {
        return 3 * (1 - b) * b * b * c
    },
    b3p3: function (b, c) {
        return b * b * b * c
    },
    b3: function (b, c, e, f, g) {
        return this.b3p0(b, c) + this.b3p1(b, e) + this.b3p2(b, f) + this.b3p3(b, g)
    },
    extractGlyphPoints: function (b, c, e, f) {
        var g = [],
            k, h, m, n, o, p, t, v, u, w, B = c.glyphs[b] || c.glyphs[ctxt.options.fallbackCharacter];
        if (B) {
            if (B.o) {
                c = B._cachedOutline || (B._cachedOutline = B.o.split(" "));
                m = c.length;
                for (b = 0; b < m;) switch (h = c[b++], h) {
                    case "m":
                        h = c[b++] * e + f;
                        n = c[b++] * e;
                        g.push(new THREE.Vector2(h, n));
                        break;
                    case "l":
                        h = c[b++] * e + f;
                        n = c[b++] * e;
                        g.push(new THREE.Vector2(h, n));
                        break;
                    case "q":
                        h = c[b++] * e + f;
                        n = c[b++] * e;
                        t = c[b++] * e + f;
                        v = c[b++] * e;
                        if (k = g[g.length - 1]) {
                            o = k.x;
                            p = k.y;
                            k = 1;
                            for (divisions = this.divisions; k <= divisions; k++) {
                                var A = k / divisions,
                                    y = THREE.FontUtils.b2(A, o, t, h),
                                    A = THREE.FontUtils.b2(A, p, v, n);
                                g.push(new THREE.Vector2(y, A))
                            }
                        }
                        break;
                    case "b":
                        if (h = c[b++] * e + f, n = c[b++] * e, t = c[b++] * e + f, v = c[b++] * -e, u = c[b++] * e + f, w = c[b++] * -e, k = g[g.length - 1]) {
                            o = k.x;
                            p = k.y;
                            k = 1;
                            for (divisions = this.divisions; k <= divisions; k++) A = k / divisions, y = THREE.FontUtils.b3(A, o, t, u, h), A = THREE.FontUtils.b3(A, p, v, w, n), g.push(new THREE.Vector2(y, A))
                        }
                }
            }
            return {
                offset: B.ha * e,
                points: g
            }
        }
    }
};
(function (b) {
    var c = function (b) {
        for (var c = b.length, g = 0, k = c - 1, h = 0; h < c; k = h++) g += b[k].x * b[h].y - b[h].x * b[k].y;
        return g * 0.5
    };
    b.Triangulate = function (b, f) {
        var g = b.length;
        if (g < 3) return null;
        var k = [],
            h = [],
            m = [],
            n, o, p;
        if (c(b) > 0) for (o = 0; o < g; o++) h[o] = o;
        else for (o = 0; o < g; o++) h[o] = g - 1 - o;
        var t = 2 * g;
        for (o = g - 1; g > 2;) {
            if (t-- <= 0) {
                console.log("Warning, unable to triangulate polygon!");
                if (f) return m;
                return k
            }
            n = o;
            g <= n && (n = 0);
            o = n + 1;
            g <= o && (o = 0);
            p = o + 1;
            g <= p && (p = 0);
            var v;
            a: {
                v = b;
                var u = n,
                    w = o,
                    B = p,
                    A = g,
                    y = h,
                    G = void 0,
                    z = void 0,
                    C = void 0,
                    H = void 0,
                    D = void 0,
                    Q = void 0,
                    J = void 0,
                    F = void 0,
                    I = void 0,
                    z = v[y[u]].x,
                    C = v[y[u]].y,
                    H = v[y[w]].x,
                    D = v[y[w]].y,
                    Q = v[y[B]].x,
                    J = v[y[B]].y;
                if (1.0E-10 > (H - z) * (J - C) - (D - C) * (Q - z)) v = !1;
                else {
                    for (G = 0; G < A; G++) if (!(G == u || G == w || G == B)) {
                        var F = v[y[G]].x,
                            I = v[y[G]].y,
                            S = void 0,
                            K = void 0,
                            ea = void 0,
                            j = void 0,
                            ca = void 0,
                            T = void 0,
                            Z = void 0,
                            N = void 0,
                            da = void 0,
                            X = void 0,
                            aa = void 0,
                            ia = void 0,
                            S = ea = ca = void 0,
                            S = Q - H,
                            K = J - D,
                            ea = z - Q,
                            j = C - J,
                            ca = H - z,
                            T = D - C,
                            Z = F - z,
                            N = I - C,
                            da = F - H,
                            X = I - D,
                            aa = F - Q,
                            ia = I - J,
                            S = S * X - K * da,
                            ca = ca * N - T * Z,
                            ea = ea * ia - j * aa;
                        if (S >= 0 && ea >= 0 && ca >= 0) {
                            v = !1;
                            break a
                        }
                    }
                    v = !0
                }
            }
            if (v) {
                t = h[n];
                v = h[o];
                u = h[p];
                k.push(b[t]);
                k.push(b[v]);
                k.push(b[u]);
                m.push([h[n], h[o], h[p]]);
                n = o;
                for (p = o + 1; p < g; n++, p++) h[n] = h[p];
                g--;
                t = 2 * g
            }
        }
        if (f) return m;
        return k
    };
    b.Triangulate.area = c;
    return b
})(THREE.FontUtils);
window._typeface_js = {
    faces: THREE.FontUtils.faces,
    loadFace: THREE.FontUtils.loadFace
};
THREE.TorusGeometry = function (b, c, e, f) {
    THREE.Geometry.call(this);
    this.radius = b || 100;
    this.tube = c || 40;
    this.segmentsR = e || 8;
    this.segmentsT = f || 6;
    b = [];
    for (c = 0; c <= this.segmentsR; ++c) for (e = 0; e <= this.segmentsT; ++e) {
        var f = e / this.segmentsT * 2 * Math.PI,
            g = c / this.segmentsR * 2 * Math.PI;
        this.vertices.push(new THREE.Vertex(new THREE.Vector3((this.radius + this.tube * Math.cos(g)) * Math.cos(f), (this.radius + this.tube * Math.cos(g)) * Math.sin(f), this.tube * Math.sin(g))));
        b.push([e / this.segmentsT, 1 - c / this.segmentsR])
    }
    for (c = 1; c <= this.segmentsR; ++c) for (e = 1; e <= this.segmentsT; ++e) {
        var f = (this.segmentsT + 1) * c + e,
            g = (this.segmentsT + 1) * c + e - 1,
            k = (this.segmentsT + 1) * (c - 1) + e - 1,
            h = (this.segmentsT + 1) * (c - 1) + e;
        this.faces.push(new THREE.Face4(f, g, k, h));
        this.faceVertexUvs[0].push([new THREE.UV(b[f][0], b[f][1]), new THREE.UV(b[g][0], b[g][1]), new THREE.UV(b[k][0], b[k][1]), new THREE.UV(b[h][0], b[h][1])])
    }
    delete b;
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.TorusGeometry.prototype = new THREE.Geometry;
THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry;
THREE.TorusKnotGeometry = function (b, c, e, f, g, k, h) {
    function m(b, e, c, f, h, g) {
        e = c / f * b;
        c = Math.cos(e);
        return new THREE.Vector3(h * (2 + c) * 0.5 * Math.cos(b), h * (2 + c) * Math.sin(b) * 0.5, g * h * Math.sin(e) * 0.5)
    }
    THREE.Geometry.call(this);
    this.radius = b || 200;
    this.tube = c || 40;
    this.segmentsR = e || 64;
    this.segmentsT = f || 8;
    this.p = g || 2;
    this.q = k || 3;
    this.heightScale = h || 1;
    this.grid = Array(this.segmentsR);
    e = new THREE.Vector3;
    f = new THREE.Vector3;
    k = new THREE.Vector3;
    for (b = 0; b < this.segmentsR; ++b) {
        this.grid[b] = Array(this.segmentsT);
        for (c = 0; c < this.segmentsT; ++c) {
            var n = b / this.segmentsR * 2 * this.p * Math.PI,
                h = c / this.segmentsT * 2 * Math.PI,
                g = m(n, h, this.q, this.p, this.radius, this.heightScale),
                n = m(n + 0.01, h, this.q, this.p, this.radius, this.heightScale);
            e.x = n.x - g.x;
            e.y = n.y - g.y;
            e.z = n.z - g.z;
            f.x = n.x + g.x;
            f.y = n.y + g.y;
            f.z = n.z + g.z;
            k.cross(e, f);
            f.cross(k, e);
            k.normalize();
            f.normalize();
            n = -this.tube * Math.cos(h);
            h = this.tube * Math.sin(h);
            g.x += n * f.x + h * k.x;
            g.y += n * f.y + h * k.y;
            g.z += n * f.z + h * k.z;
            this.grid[b][c] = this.vertices.push(new THREE.Vertex(new THREE.Vector3(g.x, g.y,
            g.z))) - 1
        }
    }
    for (b = 0; b < this.segmentsR; ++b) for (c = 0; c < this.segmentsT; ++c) {
        var f = (b + 1) % this.segmentsR,
            k = (c + 1) % this.segmentsT,
            g = this.grid[b][c],
            e = this.grid[f][c],
            f = this.grid[f][k],
            k = this.grid[b][k],
            h = new THREE.UV(b / this.segmentsR, c / this.segmentsT),
            n = new THREE.UV((b + 1) / this.segmentsR, c / this.segmentsT),
            o = new THREE.UV((b + 1) / this.segmentsR, (c + 1) / this.segmentsT),
            p = new THREE.UV(b / this.segmentsR, (c + 1) / this.segmentsT);
        this.faces.push(new THREE.Face4(g, e, f, k));
        this.faceVertexUvs[0].push([h, n, o, p])
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.TorusKnotGeometry.prototype = new THREE.Geometry;
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry;
THREE.Loader = function (b) {
    this.statusDomElement = (this.showStatus = b) ? THREE.Loader.prototype.addStatusElement() : null;
    this.onLoadStart = function () {};
    this.onLoadProgress = function () {};
    this.onLoadComplete = function () {}
};
THREE.Loader.prototype = {
    addStatusElement: function () {
        var b = document.createElement("div");
        b.style.position = "absolute";
        b.style.right = "0px";
        b.style.top = "0px";
        b.style.fontSize = "0.8em";
        b.style.textAlign = "left";
        b.style.background = "rgba(0,0,0,0.25)";
        b.style.color = "#fff";
        b.style.width = "120px";
        b.style.padding = "0.5em 0.5em 0.5em 0.5em";
        b.style.zIndex = 1E3;
        b.innerHTML = "Loading ...";
        return b
    },
    updateProgress: function (b) {
        var c = "Loaded ";
        c += b.total ? (100 * b.loaded / b.total).toFixed(0) + "%" : (b.loaded / 1E3).toFixed(2) + " KB";
        this.statusDomElement.innerHTML = c
    },
    extractUrlbase: function (b) {
        b = b.split("/");
        b.pop();
        return b.join("/")
    },
    init_materials: function (b, c, e) {
        b.materials = [];
        for (var f = 0; f < c.length; ++f) b.materials[f] = [THREE.Loader.prototype.createMaterial(c[f], e)]
    },
    hasNormals: function (b) {
        var c, e, f = b.materials.length;
        for (e = 0; e < f; e++) if (c = b.materials[e][0], c instanceof THREE.MeshShaderMaterial) return !0;
        return !1
    },
    createMaterial: function (b, c) {
        function e(b) {
            b = Math.log(b) / Math.LN2;
            return Math.floor(b) == b
        }
        function f(b, c) {
            var f = new Image;
            f.onload = function () {
                if (!e(this.width) || !e(this.height)) {
                    var c = Math.pow(2, Math.round(Math.log(this.width) / Math.LN2)),
                        f = Math.pow(2, Math.round(Math.log(this.height) / Math.LN2));
                    b.image.width = c;
                    b.image.height = f;
                    b.image.getContext("2d").drawImage(this, 0, 0, c, f)
                } else b.image = this;
                b.needsUpdate = !0
            };
            f.src = c
        }
        function g(b, e, h, g, k, m) {
            var n = document.createElement("canvas");
            b[e] = new THREE.Texture(n);
            b[e].sourceFile = h;
            if (g) {
                b[e].repeat.set(g[0], g[1]);
                if (g[0] != 1) b[e].wrapS = THREE.RepeatWrapping;
                if (g[1] != 1) b[e].wrapT = THREE.RepeatWrapping
            }
            k && b[e].offset.set(k[0], k[1]);
            if (m) {
                g = {
                    repeat: THREE.RepeatWrapping,
                    mirror: THREE.MirroredRepeatWrapping
                };
                if (g[m[0]] !== void 0) b[e].wrapS = g[m[0]];
                if (g[m[1]] !== void 0) b[e].wrapT = g[m[1]]
            }
            f(b[e], c + "/" + h)
        }
        function k(b) {
            return (b[0] * 255 << 16) + (b[1] * 255 << 8) + b[2] * 255
        }
        var h, m, n;
        m = "MeshLambertMaterial";
        h = {
            color: 15658734,
            opacity: 1,
            map: null,
            lightMap: null,
            normalMap: null,
            wireframe: b.wireframe
        };
        b.shading && (b.shading == "Phong" ? m = "MeshPhongMaterial" : b.shading == "Basic" && (m = "MeshBasicMaterial"));
        if (b.blending) if (b.blending == "Additive") h.blending = THREE.AdditiveBlending;
        else if (b.blending == "Subtractive") h.blending = THREE.SubtractiveBlending;
        else if (b.blending == "Multiply") h.blending = THREE.MultiplyBlending;
        if (b.transparent !== void 0 || b.opacity < 1) h.transparent = b.transparent;
        if (b.depthTest !== void 0) h.depthTest = b.depthTest;
        if (b.vertexColors !== void 0) if (b.vertexColors == "face") h.vertexColors = THREE.FaceColors;
        else if (b.vertexColors) h.vertexColors = THREE.VertexColors;
        if (b.colorDiffuse) h.color = k(b.colorDiffuse);
        else if (b.DbgColor) h.color = b.DbgColor;
        if (b.colorSpecular) h.specular = k(b.colorSpecular);
        if (b.colorAmbient) h.ambient = k(b.colorAmbient);
        if (b.transparency) h.opacity = b.transparency;
        if (b.specularCoef) h.shininess = b.specularCoef;
        b.mapDiffuse && c && g(h, "map", b.mapDiffuse, b.mapDiffuseRepeat, b.mapDiffuseOffset, b.mapDiffuseWrap);
        b.mapLight && c && g(h, "lightMap", b.mapLight, b.mapLightRepeat, b.mapLightOffset, b.mapLightWrap);
        b.mapNormal && c && g(h, "normalMap", b.mapNormal, b.mapNormalRepeat, b.mapNormalOffset, b.mapNormalWrap);
        b.mapSpecular && c && g(h, "specularMap", b.mapSpecular, b.mapSpecularRepeat, b.mapSpecularOffset, b.mapSpecularWrap);
        if (b.mapNormal) {
            var o = THREE.ShaderUtils.lib.normal,
                p = THREE.UniformsUtils.clone(o.uniforms),
                t = h.color;
            m = h.specular;
            n = h.ambient;
            var v = h.shininess;
            p.tNormal.texture = h.normalMap;
            if (b.mapNormalFactor) p.uNormalScale.value = b.mapNormalFactor;
            if (h.map) p.tDiffuse.texture = h.map, p.enableDiffuse.value = !0;
            if (h.specularMap) p.tSpecular.texture = h.specularMap, p.enableSpecular.value = !0;
            if (h.lightMap) p.tAO.texture = h.lightMap, p.enableAO.value = !0;
            p.uDiffuseColor.value.setHex(t);
            p.uSpecularColor.value.setHex(m);
            p.uAmbientColor.value.setHex(n);
            p.uShininess.value = v;
            if (h.opacity) p.uOpacity.value = h.opacity;
            h = new THREE.MeshShaderMaterial({
                fragmentShader: o.fragmentShader,
                vertexShader: o.vertexShader,
                uniforms: p,
                lights: !0,
                fog: !0
            })
        } else h = new THREE[m](h);
        return h
    }
};
THREE.JSONLoader = function (b) {
    THREE.Loader.call(this, b)
};
THREE.JSONLoader.prototype = new THREE.Loader;
THREE.JSONLoader.prototype.constructor = THREE.JSONLoader;
THREE.JSONLoader.prototype.supr = THREE.Loader.prototype;
THREE.JSONLoader.prototype.load = function (b) {
    var c = this,
        e = b.model,
        f = b.callback,
        g = b.texture_path ? b.texture_path : this.extractUrlbase(e),
        b = new Worker(e);
    b.onmessage = function (b) {
        c.createModel(b.data, f, g);
        c.onLoadComplete()
    };
    this.onLoadStart();
    b.postMessage((new Date).getTime())
};
THREE.JSONLoader.prototype.createModel = function (b, c, e) {
    var f = new THREE.Geometry,
        g = b.scale !== void 0 ? 1 / b.scale : 1;
    this.init_materials(f, b.materials, e);
    (function (e) {
        if (b.version === void 0 || b.version != 2) console.error("Deprecated file format.");
        else {
            var c, g, n, o, p, t, v, u, w, B, A, y, G, z, C = b.faces;
            t = b.vertices;
            var H = b.normals,
                D = b.colors,
                Q = 0;
            for (c = 0; c < b.uvs.length; c++) b.uvs[c].length && Q++;
            for (c = 0; c < Q; c++) f.faceUvs[c] = [], f.faceVertexUvs[c] = [];
            o = 0;
            for (p = t.length; o < p;) v = new THREE.Vertex, v.position.x = t[o++] * e, v.position.y = t[o++] * e, v.position.z = t[o++] * e, f.vertices.push(v);
            o = 0;
            for (p = C.length; o < p;) {
                e = C[o++];
                t = e & 1;
                n = e & 2;
                c = e & 4;
                g = e & 8;
                u = e & 16;
                v = e & 32;
                B = e & 64;
                e &= 128;
                t ? (A = new THREE.Face4, A.a = C[o++], A.b = C[o++], A.c = C[o++], A.d = C[o++], t = 4) : (A = new THREE.Face3, A.a = C[o++], A.b = C[o++], A.c = C[o++], t = 3);
                if (n) n = C[o++], A.materials = f.materials[n];
                n = f.faces.length;
                if (c) for (c = 0; c < Q; c++) y = b.uvs[c], w = C[o++], z = y[w * 2], w = y[w * 2 + 1], f.faceUvs[c][n] = new THREE.UV(z, w);
                if (g) for (c = 0; c < Q; c++) {
                    y = b.uvs[c];
                    G = [];
                    for (g = 0; g < t; g++) w = C[o++], z = y[w * 2], w = y[w * 2 + 1], G[g] = new THREE.UV(z, w);
                    f.faceVertexUvs[c][n] = G
                }
                if (u) u = C[o++] * 3, g = new THREE.Vector3, g.x = H[u++], g.y = H[u++], g.z = H[u], A.normal = g;
                if (v) for (c = 0; c < t; c++) u = C[o++] * 3, g = new THREE.Vector3, g.x = H[u++], g.y = H[u++], g.z = H[u], A.vertexNormals.push(g);
                if (B) v = C[o++], v = new THREE.Color(D[v]), A.color = v;
                if (e) for (c = 0; c < t; c++) v = C[o++], v = new THREE.Color(D[v]), A.vertexColors.push(v);
                f.faces.push(A)
            }
        }
    })(g);
    (function () {
        var e, c, g, n;
        if (b.skinWeights) {
            e = 0;
            for (c = b.skinWeights.length; e < c; e += 2) g = b.skinWeights[e], n = b.skinWeights[e + 1], f.skinWeights.push(new THREE.Vector4(g,
            n, 0, 0))
        }
        if (b.skinIndices) {
            e = 0;
            for (c = b.skinIndices.length; e < c; e += 2) g = b.skinIndices[e], n = b.skinIndices[e + 1], f.skinIndices.push(new THREE.Vector4(g, n, 0, 0))
        }
        f.bones = b.bones;
        f.animation = b.animation
    })();
    (function (e) {
        if (b.morphTargets !== void 0) {
            var c, g, n, o, p, t, v, u, w;
            c = 0;
            for (g = b.morphTargets.length; c < g; c++) {
                f.morphTargets[c] = {};
                f.morphTargets[c].name = b.morphTargets[c].name;
                f.morphTargets[c].vertices = [];
                u = f.morphTargets[c].vertices;
                w = b.morphTargets[c].vertices;
                n = 0;
                for (o = w.length; n < o; n += 3) p = w[n] * e, t = w[n + 1] * e, v = w[n + 2] * e, u.push(new THREE.Vertex(new THREE.Vector3(p, t, v)))
            }
        }
        if (b.morphColors !== void 0) {
            c = 0;
            for (g = b.morphColors.length; c < g; c++) {
                f.morphColors[c] = {};
                f.morphColors[c].name = b.morphColors[c].name;
                f.morphColors[c].colors = [];
                o = f.morphColors[c].colors;
                p = b.morphColors[c].colors;
                e = 0;
                for (n = p.length; e < n; e += 3) t = new THREE.Color(16755200), t.setRGB(p[e], p[e + 1], p[e + 2]), o.push(t)
            }
        }
    })(g);
    (function () {
        if (b.edges !== void 0) {
            var c, e, g;
            for (c = 0; c < b.edges.length; c += 2) e = b.edges[c], g = b.edges[c + 1], f.edges.push(new THREE.Edge(f.vertices[e],
            f.vertices[g], e, g))
        }
    })();
    f.computeCentroids();
    f.computeFaceNormals();
    this.hasNormals(f) && f.computeTangents();
    c(f)
};
THREE.BinaryLoader = function (b) {
    THREE.Loader.call(this, b)
};
THREE.BinaryLoader.prototype = new THREE.Loader;
THREE.BinaryLoader.prototype.constructor = THREE.BinaryLoader;
THREE.BinaryLoader.prototype.supr = THREE.Loader.prototype;
THREE.BinaryLoader.prototype = {
    load: function (b) {
        var c = b.model,
            e = b.callback,
            f = b.texture_path ? b.texture_path : THREE.Loader.prototype.extractUrlbase(c),
            g = b.bin_path ? b.bin_path : THREE.Loader.prototype.extractUrlbase(c),
            b = (new Date).getTime(),
            c = new Worker(c),
            k = this.showProgress ? THREE.Loader.prototype.updateProgress : null;
        c.onmessage = function (b) {
            THREE.BinaryLoader.prototype.loadAjaxBuffers(b.data.buffers, b.data.materials, e, g, f, k)
        };
        c.onerror = function (b) {
            alert("worker.onerror: " + b.message + "\n" + b.data);
            b.preventDefault()
        };
        c.postMessage(b)
    },
    loadAjaxBuffers: function (b, c, e, f, g, k) {
        var h = new XMLHttpRequest,
            m = f + "/" + b,
            n = 0;
        h.onreadystatechange = function () {
            h.readyState == 4 ? h.status == 200 || h.status == 0 ? THREE.BinaryLoader.prototype.createBinModel(h.responseText, e, g, c) : alert("Couldn't load [" + m + "] [" + h.status + "]") : h.readyState == 3 ? k && (n == 0 && (n = h.getResponseHeader("Content-Length")), k({
                total: n,
                loaded: h.responseText.length
            })) : h.readyState == 2 && (n = h.getResponseHeader("Content-Length"))
        };
        h.open("GET", m, !0);
        h.overrideMimeType("text/plain; charset=x-user-defined");
        h.setRequestHeader("Content-Type", "text/plain");
        h.send(null)
    },
    createBinModel: function (b, c, e, f) {
        var g = function (c) {
            function e(b, c) {
                var f = p(b, c),
                    g = p(b, c + 1),
                    h = p(b, c + 2),
                    j = p(b, c + 3),
                    k = (j << 1 & 255 | h >> 7) - 127;
                f |= (h & 127) << 16 | g << 8;
                if (f == 0 && k == -127) return 0;
                return (1 - 2 * (j >> 7)) * (1 + f * Math.pow(2, -23)) * Math.pow(2, k)
            }
            function g(b, c) {
                var e = p(b, c),
                    f = p(b, c + 1),
                    h = p(b, c + 2);
                return (p(b, c + 3) << 24) + (h << 16) + (f << 8) + e
            }
            function n(b, c) {
                var e = p(b, c);
                return (p(b, c + 1) << 8) + e
            }
            function o(b, c) {
                var e = p(b, c);
                return e > 127 ? e - 256 : e
            }
            function p(b,
            c) {
                return b.charCodeAt(c) & 255
            }
            function t(c) {
                var e, f, h;
                e = g(b, c);
                f = g(b, c + D);
                h = g(b, c + Q);
                c = n(b, c + J);
                THREE.BinaryLoader.prototype.f3(y, e, f, h, c)
            }
            function v(c) {
                var e, f, h, j, k, o;
                e = g(b, c);
                f = g(b, c + D);
                h = g(b, c + Q);
                j = n(b, c + J);
                k = g(b, c + F);
                o = g(b, c + I);
                c = g(b, c + S);
                THREE.BinaryLoader.prototype.f3n(y, C, e, f, h, j, k, o, c)
            }
            function u(c) {
                var e, f, h, k;
                e = g(b, c);
                f = g(b, c + K);
                h = g(b, c + ea);
                k = g(b, c + j);
                c = n(b, c + ca);
                THREE.BinaryLoader.prototype.f4(y, e, f, h, k, c)
            }
            function w(c) {
                var e, f, h, k, o, p, t, u;
                e = g(b, c);
                f = g(b, c + K);
                h = g(b, c + ea);
                k = g(b, c + j);
                o = n(b, c + ca);
                p = g(b, c + T);
                t = g(b, c + Z);
                u = g(b, c + N);
                c = g(b, c + da);
                THREE.BinaryLoader.prototype.f4n(y, C, e, f, h, k, o, p, t, u, c)
            }
            function B(c) {
                var e, f;
                e = g(b, c);
                f = g(b, c + X);
                c = g(b, c + aa);
                THREE.BinaryLoader.prototype.uv3(y.faceVertexUvs[0], H[e * 2], H[e * 2 + 1], H[f * 2], H[f * 2 + 1], H[c * 2], H[c * 2 + 1])
            }
            function A(c) {
                var e, f, h;
                e = g(b, c);
                f = g(b, c + ia);
                h = g(b, c + ha);
                c = g(b, c + na);
                THREE.BinaryLoader.prototype.uv4(y.faceVertexUvs[0], H[e * 2], H[e * 2 + 1], H[f * 2], H[f * 2 + 1], H[h * 2], H[h * 2 + 1], H[c * 2], H[c * 2 + 1])
            }
            var y = this,
                G = 0,
                z, C = [],
                H = [],
                D, Q, J, F, I, S, K, ea, j, ca,
                T, Z, N, da, X, aa, ia, ha, na, ja, L, fa, W, U, $;
            THREE.Geometry.call(this);
            THREE.Loader.prototype.init_materials(y, f, c);
            z = {
                signature: b.substr(G, 8),
                header_bytes: p(b, G + 8),
                vertex_coordinate_bytes: p(b, G + 9),
                normal_coordinate_bytes: p(b, G + 10),
                uv_coordinate_bytes: p(b, G + 11),
                vertex_index_bytes: p(b, G + 12),
                normal_index_bytes: p(b, G + 13),
                uv_index_bytes: p(b, G + 14),
                material_index_bytes: p(b, G + 15),
                nvertices: g(b, G + 16),
                nnormals: g(b, G + 16 + 4),
                nuvs: g(b, G + 16 + 8),
                ntri_flat: g(b, G + 16 + 12),
                ntri_smooth: g(b, G + 16 + 16),
                ntri_flat_uv: g(b, G + 16 + 20),
                ntri_smooth_uv: g(b,
                G + 16 + 24),
                nquad_flat: g(b, G + 16 + 28),
                nquad_smooth: g(b, G + 16 + 32),
                nquad_flat_uv: g(b, G + 16 + 36),
                nquad_smooth_uv: g(b, G + 16 + 40)
            };
            G += z.header_bytes;
            D = z.vertex_index_bytes;
            Q = z.vertex_index_bytes * 2;
            J = z.vertex_index_bytes * 3;
            F = z.vertex_index_bytes * 3 + z.material_index_bytes;
            I = z.vertex_index_bytes * 3 + z.material_index_bytes + z.normal_index_bytes;
            S = z.vertex_index_bytes * 3 + z.material_index_bytes + z.normal_index_bytes * 2;
            K = z.vertex_index_bytes;
            ea = z.vertex_index_bytes * 2;
            j = z.vertex_index_bytes * 3;
            ca = z.vertex_index_bytes * 4;
            T = z.vertex_index_bytes * 4 + z.material_index_bytes;
            Z = z.vertex_index_bytes * 4 + z.material_index_bytes + z.normal_index_bytes;
            N = z.vertex_index_bytes * 4 + z.material_index_bytes + z.normal_index_bytes * 2;
            da = z.vertex_index_bytes * 4 + z.material_index_bytes + z.normal_index_bytes * 3;
            X = z.uv_index_bytes;
            aa = z.uv_index_bytes * 2;
            ia = z.uv_index_bytes;
            ha = z.uv_index_bytes * 2;
            na = z.uv_index_bytes * 3;
            c = z.vertex_index_bytes * 3 + z.material_index_bytes;
            $ = z.vertex_index_bytes * 4 + z.material_index_bytes;
            ja = z.ntri_flat * c;
            L = z.ntri_smooth * (c + z.normal_index_bytes * 3);
            fa = z.ntri_flat_uv * (c + z.uv_index_bytes * 3);
            W = z.ntri_smooth_uv * (c + z.normal_index_bytes * 3 + z.uv_index_bytes * 3);
            U = z.nquad_flat * $;
            c = z.nquad_smooth * ($ + z.normal_index_bytes * 4);
            $ = z.nquad_flat_uv * ($ + z.uv_index_bytes * 4);
            G += function (c) {
                for (var f, g, j, k = z.vertex_coordinate_bytes * 3, m = c + z.nvertices * k; c < m; c += k) f = e(b, c), g = e(b, c + z.vertex_coordinate_bytes), j = e(b, c + z.vertex_coordinate_bytes * 2), THREE.BinaryLoader.prototype.v(y, f, g, j);
                return z.nvertices * k
            }(G);
            G += function (c) {
                for (var e, f, g, h = z.normal_coordinate_bytes * 3, j = c + z.nnormals * h; c < j; c += h) e = o(b, c), f = o(b, c + z.normal_coordinate_bytes), g = o(b, c + z.normal_coordinate_bytes * 2), C.push(e / 127, f / 127, g / 127);
                return z.nnormals * h
            }(G);
            G += function (c) {
                for (var f, g, j = z.uv_coordinate_bytes * 2, k = c + z.nuvs * j; c < k; c += j) f = e(b, c), g = e(b, c + z.uv_coordinate_bytes), H.push(f, g);
                return z.nuvs * j
            }(G);
            ja = G + ja;
            L = ja + L;
            fa = L + fa;
            W = fa + W;
            U = W + U;
            c = U + c;
            $ = c + $;
            (function (b) {
                var c, e = z.vertex_index_bytes * 3 + z.material_index_bytes,
                    f = e + z.uv_index_bytes * 3,
                    g = b + z.ntri_flat_uv * f;
                for (c = b; c < g; c += f) t(c), B(c + e);
                return g - b
            })(L);
            (function (b) {
                var c,
                e = z.vertex_index_bytes * 3 + z.material_index_bytes + z.normal_index_bytes * 3,
                    f = e + z.uv_index_bytes * 3,
                    g = b + z.ntri_smooth_uv * f;
                for (c = b; c < g; c += f) v(c), B(c + e);
                return g - b
            })(fa);
            (function (b) {
                var c, e = z.vertex_index_bytes * 4 + z.material_index_bytes,
                    f = e + z.uv_index_bytes * 4,
                    g = b + z.nquad_flat_uv * f;
                for (c = b; c < g; c += f) u(c), A(c + e);
                return g - b
            })(c);
            (function (b) {
                var c, e = z.vertex_index_bytes * 4 + z.material_index_bytes + z.normal_index_bytes * 4,
                    f = e + z.uv_index_bytes * 4,
                    g = b + z.nquad_smooth_uv * f;
                for (c = b; c < g; c += f) w(c), A(c + e);
                return g - b
            })($);
            (function (b) {
                var c, e = z.vertex_index_bytes * 3 + z.material_index_bytes,
                    f = b + z.ntri_flat * e;
                for (c = b; c < f; c += e) t(c);
                return f - b
            })(G);
            (function (b) {
                var c, e = z.vertex_index_bytes * 3 + z.material_index_bytes + z.normal_index_bytes * 3,
                    f = b + z.ntri_smooth * e;
                for (c = b; c < f; c += e) v(c);
                return f - b
            })(ja);
            (function (b) {
                var c, e = z.vertex_index_bytes * 4 + z.material_index_bytes,
                    f = b + z.nquad_flat * e;
                for (c = b; c < f; c += e) u(c);
                return f - b
            })(W);
            (function (b) {
                var c, e = z.vertex_index_bytes * 4 + z.material_index_bytes + z.normal_index_bytes * 4,
                    f = b + z.nquad_smooth * e;
                for (c = b; c < f; c += e) w(c);
                return f - b
            })(U);
            this.computeCentroids();
            this.computeFaceNormals();
            THREE.Loader.prototype.hasNormals(this) && this.computeTangents()
        };
        g.prototype = new THREE.Geometry;
        g.prototype.constructor = g;
        c(new g(e))
    },
    v: function (b, c, e, f) {
        b.vertices.push(new THREE.Vertex(new THREE.Vector3(c, e, f)))
    },
    f3: function (b, c, e, f, g) {
        b.faces.push(new THREE.Face3(c, e, f, null, null, b.materials[g]))
    },
    f4: function (b, c, e, f, g, k) {
        b.faces.push(new THREE.Face4(c, e, f, g, null, null, b.materials[k]))
    },
    f3n: function (b, c, e,
    f, g, k, h, m, n) {
        var k = b.materials[k],
            o = c[m * 3],
            p = c[m * 3 + 1],
            m = c[m * 3 + 2],
            t = c[n * 3],
            v = c[n * 3 + 1],
            n = c[n * 3 + 2];
        b.faces.push(new THREE.Face3(e, f, g, [new THREE.Vector3(c[h * 3], c[h * 3 + 1], c[h * 3 + 2]), new THREE.Vector3(o, p, m), new THREE.Vector3(t, v, n)], null, k))
    },
    f4n: function (b, c, e, f, g, k, h, m, n, o, p) {
        var h = b.materials[h],
            t = c[n * 3],
            v = c[n * 3 + 1],
            n = c[n * 3 + 2],
            u = c[o * 3],
            w = c[o * 3 + 1],
            o = c[o * 3 + 2],
            B = c[p * 3],
            A = c[p * 3 + 1],
            p = c[p * 3 + 2];
        b.faces.push(new THREE.Face4(e, f, g, k, [new THREE.Vector3(c[m * 3], c[m * 3 + 1], c[m * 3 + 2]), new THREE.Vector3(t, v, n), new THREE.Vector3(u,
        w, o), new THREE.Vector3(B, A, p)], null, h))
    },
    uv3: function (b, c, e, f, g, k, h) {
        var m = [];
        m.push(new THREE.UV(c, e));
        m.push(new THREE.UV(f, g));
        m.push(new THREE.UV(k, h));
        b.push(m)
    },
    uv4: function (b, c, e, f, g, k, h, m, n) {
        var o = [];
        o.push(new THREE.UV(c, e));
        o.push(new THREE.UV(f, g));
        o.push(new THREE.UV(k, h));
        o.push(new THREE.UV(m, n));
        b.push(o)
    }
};
THREE.SceneLoader = function () {
    this.onLoadStart = function () {};
    this.onLoadProgress = function () {};
    this.onLoadComplete = function () {};
    this.callbackSync = function () {};
    this.callbackProgress = function () {}
};
THREE.SceneLoader.prototype = {
    load: function (b, c) {
        var e = this,
            f = new Worker(b);
        f.postMessage(0);
        var g = THREE.Loader.prototype.extractUrlbase(b);
        f.onmessage = function (b) {
            function f(b, c) {
                return c == "relativeToHTML" ? b : g + "/" + b
            }
            function m() {
                for (u in K.objects) if (!N.objects[u]) if (G = K.objects[u], G.geometry !== void 0) {
                    if (D = N.geometries[G.geometry]) {
                        var b = !1;
                        I = [];
                        for (X = 0; X < G.materials.length; X++) I[X] = N.materials[G.materials[X]], b = I[X] instanceof THREE.MeshShaderMaterial;
                        b && D.computeTangents();
                        z = G.position;
                        r = G.rotation;
                        q = G.quaternion;
                        s = G.scale;
                        q = 0;
                        I.length == 0 && (I[0] = new THREE.MeshFaceMaterial);
                        I.length > 1 && (I = [new THREE.MeshFaceMaterial]);
                        object = new THREE.Mesh(D, I);
                        object.name = u;
                        object.position.set(z[0], z[1], z[2]);
                        q ? (object.quaternion.set(q[0], q[1], q[2], q[3]), object.useQuaternion = !0) : object.rotation.set(r[0], r[1], r[2]);
                        object.scale.set(s[0], s[1], s[2]);
                        object.visible = G.visible;
                        N.scene.addObject(object);
                        N.objects[u] = object;
                        G.meshCollider && (b = THREE.CollisionUtils.MeshColliderWBox(object), N.scene.collisions.colliders.push(b));
                        if (G.castsShadow) b = new THREE.ShadowVolume(D), N.scene.addChild(b), b.position = object.position, b.rotation = object.rotation, b.scale = object.scale;
                        G.trigger && G.trigger.toLowerCase() != "none" && (b = {
                            type: G.trigger,
                            object: G
                        }, N.triggers[object.name] = b)
                    }
                } else z = G.position, r = G.rotation, q = G.quaternion, s = G.scale, q = 0, object = new THREE.Object3D, object.name = u, object.position.set(z[0], z[1], z[2]), q ? (object.quaternion.set(q[0], q[1], q[2], q[3]), object.useQuaternion = !0) : object.rotation.set(r[0], r[1], r[2]), object.scale.set(s[0],
                s[1], s[2]), object.visible = G.visible !== void 0 ? G.visible : !1, N.scene.addObject(object), N.objects[u] = object, N.empties[u] = object, G.trigger && G.trigger.toLowerCase() != "none" && (b = {
                    type: G.trigger,
                    object: G
                }, N.triggers[object.name] = b)
            }
            function n(b) {
                return function (c) {
                    N.geometries[b] = c;
                    m();
                    j -= 1;
                    e.onLoadComplete();
                    p()
                }
            }
            function o(b) {
                return function (c) {
                    N.geometries[b] = c
                }
            }
            function p() {
                e.callbackProgress({
                    totalModels: T,
                    totalTextures: Z,
                    loadedModels: T - j,
                    loadedTextures: Z - ca
                }, N);
                e.onLoadProgress();
                j == 0 && ca == 0 && c(N)
            }
            var t, v, u, w, B, A, y, G, z, C, H, D, Q, J, F, I, S, K, ea, j, ca, T, Z, N;
            K = b.data;
            F = new THREE.BinaryLoader;
            ea = new THREE.JSONLoader;
            ca = j = 0;
            N = {
                scene: new THREE.Scene,
                geometries: {},
                materials: {},
                textures: {},
                objects: {},
                cameras: {},
                lights: {},
                fogs: {},
                triggers: {},
                empties: {}
            };
            b = !1;
            for (u in K.objects) if (G = K.objects[u], G.meshCollider) {
                b = !0;
                break
            }
            if (b) N.scene.collisions = new THREE.CollisionSystem;
            if (K.transform) {
                b = K.transform.position;
                C = K.transform.rotation;
                var da = K.transform.scale;
                b && N.scene.position.set(b[0], b[1], b[2]);
                C && N.scene.rotation.set(C[0],
                C[1], C[2]);
                da && N.scene.scale.set(da[0], da[1], da[2]);
                (b || C || da) && N.scene.updateMatrix()
            }
            b = function () {
                ca -= 1;
                p();
                e.onLoadComplete()
            };
            for (B in K.cameras) {
                C = K.cameras[B];
                if (C.type == "perspective") Q = new THREE.Camera(C.fov, C.aspect, C.near, C.far);
                else if (C.type == "ortho") Q = new THREE.Camera, Q.projectionMatrix = THREE.Matrix4.makeOrtho(C.left, C.right, C.top, C.bottom, C.near, C.far);
                z = C.position;
                C = C.target;
                Q.position.set(z[0], z[1], z[2]);
                Q.target.position.set(C[0], C[1], C[2]);
                N.cameras[B] = Q
            }
            for (w in K.lights) B = K.lights[w],
            Q = B.color !== void 0 ? B.color : 16777215, C = B.intensity !== void 0 ? B.intensity : 1, B.type == "directional" ? (z = B.direction, S = new THREE.DirectionalLight(Q, C), S.position.set(z[0], z[1], z[2]), S.position.normalize()) : B.type == "point" ? (z = B.position, d = B.distance, S = new THREE.PointLight(Q, C, d), S.position.set(z[0], z[1], z[2])) : B.type == "ambient" && (S = new THREE.AmbientLight(Q)), N.scene.addLight(S), N.lights[w] = S;
            for (A in K.fogs) w = K.fogs[A], w.type == "linear" ? J = new THREE.Fog(0, w.near, w.far) : w.type == "exp2" && (J = new THREE.FogExp2(0,
            w.density)), C = w.color, J.color.setRGB(C[0], C[1], C[2]), N.fogs[A] = J;
            if (N.cameras && K.defaults.camera) N.currentCamera = N.cameras[K.defaults.camera];
            if (N.fogs && K.defaults.fog) N.scene.fog = N.fogs[K.defaults.fog];
            C = K.defaults.bgcolor;
            N.bgColor = new THREE.Color;
            N.bgColor.setRGB(C[0], C[1], C[2]);
            N.bgColorAlpha = K.defaults.bgalpha;
            for (t in K.geometries) if (A = K.geometries[t], A.type == "bin_mesh" || A.type == "ascii_mesh") j += 1, e.onLoadStart();
            T = j;
            for (t in K.geometries) A = K.geometries[t], A.type == "cube" ? (D = new THREE.CubeGeometry(A.width,
            A.height, A.depth, A.segmentsWidth, A.segmentsHeight, A.segmentsDepth, null, A.flipped, A.sides), N.geometries[t] = D) : A.type == "plane" ? (D = new THREE.PlaneGeometry(A.width, A.height, A.segmentsWidth, A.segmentsHeight), N.geometries[t] = D) : A.type == "sphere" ? (D = new THREE.SphereGeometry(A.radius, A.segmentsWidth, A.segmentsHeight), N.geometries[t] = D) : A.type == "cylinder" ? (D = new THREE.CylinderGeometry(A.numSegs, A.topRad, A.botRad, A.height, A.topOffset, A.botOffset), N.geometries[t] = D) : A.type == "torus" ? (D = new THREE.TorusGeometry(A.radius,
            A.tube, A.segmentsR, A.segmentsT), N.geometries[t] = D) : A.type == "icosahedron" ? (D = new THREE.IcosahedronGeometry(A.subdivisions), N.geometries[t] = D) : A.type == "bin_mesh" ? F.load({
                model: f(A.url, K.urlBaseType),
                callback: n(t)
            }) : A.type == "ascii_mesh" ? ea.load({
                model: f(A.url, K.urlBaseType),
                callback: n(t)
            }) : A.type == "embedded_mesh" && (A = K.embeds[A.id]) && ea.createModel(A, o(t), "");
            for (y in K.textures) if (t = K.textures[y], t.url instanceof Array) {
                ca += t.url.length;
                for (F = 0; F < t.url.length; F++) e.onLoadStart()
            } else ca += 1, e.onLoadStart();
            Z = ca;
            for (y in K.textures) {
                t = K.textures[y];
                if (t.mapping != void 0 && THREE[t.mapping] != void 0) t.mapping = new THREE[t.mapping];
                if (t.url instanceof Array) {
                    F = [];
                    for (var X = 0; X < t.url.length; X++) F[X] = f(t.url[X], K.urlBaseType);
                    F = THREE.ImageUtils.loadTextureCube(F, t.mapping, b)
                } else {
                    F = THREE.ImageUtils.loadTexture(f(t.url, K.urlBaseType), t.mapping, b);
                    if (THREE[t.minFilter] != void 0) F.minFilter = THREE[t.minFilter];
                    if (THREE[t.magFilter] != void 0) F.magFilter = THREE[t.magFilter];
                    if (t.repeat) {
                        F.repeat.set(t.repeat[0], t.repeat[1]);
                        if (t.repeat[0] != 1) F.wrapS = THREE.RepeatWrapping;
                        if (t.repeat[1] != 1) F.wrapT = THREE.RepeatWrapping
                    }
                    t.offset && F.offset.set(t.offset[0], t.offset[1]);
                    if (t.wrap) {
                        ea = {
                            repeat: THREE.RepeatWrapping,
                            mirror: THREE.MirroredRepeatWrapping
                        };
                        if (ea[t.wrap[0]] !== void 0) F.wrapS = ea[t.wrap[0]];
                        if (ea[t.wrap[1]] !== void 0) F.wrapT = ea[t.wrap[1]]
                    }
                }
                N.textures[y] = F
            }
            for (v in K.materials) {
                y = K.materials[v];
                for (H in y.parameters) if (H == "envMap" || H == "map" || H == "lightMap") y.parameters[H] = N.textures[y.parameters[H]];
                else if (H == "shading") y.parameters[H] = y.parameters[H] == "flat" ? THREE.FlatShading : THREE.SmoothShading;
                else if (H == "blending") y.parameters[H] = THREE[y.parameters[H]] ? THREE[y.parameters[H]] : THREE.NormalBlending;
                else if (H == "combine") y.parameters[H] = y.parameters[H] == "MixOperation" ? THREE.MixOperation : THREE.MultiplyOperation;
                else if (H == "vertexColors") if (y.parameters[H] == "face") y.parameters[H] = THREE.FaceColors;
                else if (y.parameters[H]) y.parameters[H] = THREE.VertexColors;
                if (y.parameters.opacity !== void 0 && y.parameters.opacity < 1) y.parameters.transparent = !0;
                if (y.parameters.normalMap) {
                    t = THREE.ShaderUtils.lib.normal;
                    b = THREE.UniformsUtils.clone(t.uniforms);
                    F = y.parameters.color;
                    ea = y.parameters.specular;
                    A = y.parameters.ambient;
                    J = y.parameters.shininess;
                    b.tNormal.texture = N.textures[y.parameters.normalMap];
                    if (y.parameters.normalMapFactor) b.uNormalScale.value = y.parameters.normalMapFactor;
                    if (y.parameters.map) b.tDiffuse.texture = y.parameters.map, b.enableDiffuse.value = !0;
                    if (y.parameters.lightMap) b.tAO.texture = y.parameters.lightMap, b.enableAO.value = !0;
                    if (y.parameters.specularMap) b.tSpecular.texture = N.textures[y.parameters.specularMap], b.enableSpecular.value = !0;
                    b.uDiffuseColor.value.setHex(F);
                    b.uSpecularColor.value.setHex(ea);
                    b.uAmbientColor.value.setHex(A);
                    b.uShininess.value = J;
                    if (y.parameters.opacity) b.uOpacity.value = y.parameters.opacity;
                    y = new THREE.MeshShaderMaterial({
                        fragmentShader: t.fragmentShader,
                        vertexShader: t.vertexShader,
                        uniforms: b,
                        lights: !0,
                        fog: !0
                    })
                } else y = new THREE[y.type](y.parameters);
                N.materials[v] = y
            }
            m();
            e.callbackSync(N)
        }
    }
};
THREE.MarchingCubes = function (b, c) {
    THREE.Object3D.call(this);
    this.materials = c instanceof Array ? c : [c];
    this.init = function (b) {
        this.isolation = 80;
        this.size = b;
        this.size2 = this.size * this.size;
        this.size3 = this.size2 * this.size;
        this.halfsize = this.size / 2;
        this.delta = 2 / this.size;
        this.yd = this.size;
        this.zd = this.size2;
        this.field = new Float32Array(this.size3);
        this.normal_cache = new Float32Array(this.size3 * 3);
        this.vlist = new Float32Array(36);
        this.nlist = new Float32Array(36);
        this.firstDraw = !0;
        this.maxCount = 4096;
        this.count = 0;
        this.hasNormal = this.hasPos = !1;
        this.positionArray = new Float32Array(this.maxCount * 3);
        this.normalArray = new Float32Array(this.maxCount * 3)
    };
    this.lerp = function (b, c, g) {
        return b + (c - b) * g
    };
    this.VIntX = function (b, c, g, k, h, m, n, o, p, t) {
        h = (h - p) / (t - p);
        p = this.normal_cache;
        c[k] = m + h * this.delta;
        c[k + 1] = n;
        c[k + 2] = o;
        g[k] = this.lerp(p[b], p[b + 3], h);
        g[k + 1] = this.lerp(p[b + 1], p[b + 4], h);
        g[k + 2] = this.lerp(p[b + 2], p[b + 5], h)
    };
    this.VIntY = function (b, c, g, k, h, m, n, o, p, t) {
        h = (h - p) / (t - p);
        p = this.normal_cache;
        c[k] = m;
        c[k + 1] = n + h * this.delta;
        c[k + 2] = o;
        c = b + this.yd * 3;
        g[k] = this.lerp(p[b], p[c], h);
        g[k + 1] = this.lerp(p[b + 1], p[c + 1], h);
        g[k + 2] = this.lerp(p[b + 2], p[c + 2], h)
    };
    this.VIntZ = function (b, c, g, k, h, m, n, o, p, t) {
        h = (h - p) / (t - p);
        p = this.normal_cache;
        c[k] = m;
        c[k + 1] = n;
        c[k + 2] = o + h * this.delta;
        c = b + this.zd * 3;
        g[k] = this.lerp(p[b], p[c], h);
        g[k + 1] = this.lerp(p[b + 1], p[c + 1], h);
        g[k + 2] = this.lerp(p[b + 2], p[c + 2], h)
    };
    this.compNorm = function (b) {
        var c = b * 3;
        this.normal_cache[c] == 0 && (this.normal_cache[c] = this.field[b - 1] - this.field[b + 1], this.normal_cache[c + 1] = this.field[b - this.yd] - this.field[b + this.yd], this.normal_cache[c + 2] = this.field[b - this.zd] - this.field[b + this.zd])
    };
    this.polygonize = function (b, c, g, k, h, m) {
        var n = k + 1,
            o = k + this.yd,
            p = k + this.zd,
            t = n + this.yd,
            v = n + this.zd,
            u = k + this.yd + this.zd,
            w = n + this.yd + this.zd,
            B = 0,
            A = this.field[k],
            y = this.field[n],
            G = this.field[o],
            z = this.field[t],
            C = this.field[p],
            H = this.field[v],
            D = this.field[u],
            Q = this.field[w];
        A < h && (B |= 1);
        y < h && (B |= 2);
        G < h && (B |= 8);
        z < h && (B |= 4);
        C < h && (B |= 16);
        H < h && (B |= 32);
        D < h && (B |= 128);
        Q < h && (B |= 64);
        var J = THREE.edgeTable[B];
        if (J == 0) return 0;
        var F = this.delta,
            I = b + F,
            S = c + F,
            F = g + F;
        J & 1 && (this.compNorm(k), this.compNorm(n), this.VIntX(k * 3, this.vlist, this.nlist, 0, h, b, c, g, A, y));
        J & 2 && (this.compNorm(n), this.compNorm(t), this.VIntY(n * 3, this.vlist, this.nlist, 3, h, I, c, g, y, z));
        J & 4 && (this.compNorm(o), this.compNorm(t), this.VIntX(o * 3, this.vlist, this.nlist, 6, h, b, S, g, G, z));
        J & 8 && (this.compNorm(k), this.compNorm(o), this.VIntY(k * 3, this.vlist, this.nlist, 9, h, b, c, g, A, G));
        J & 16 && (this.compNorm(p), this.compNorm(v), this.VIntX(p * 3, this.vlist, this.nlist, 12, h, b, c, F, C, H));
        J & 32 && (this.compNorm(v),
        this.compNorm(w), this.VIntY(v * 3, this.vlist, this.nlist, 15, h, I, c, F, H, Q));
        J & 64 && (this.compNorm(u), this.compNorm(w), this.VIntX(u * 3, this.vlist, this.nlist, 18, h, b, S, F, D, Q));
        J & 128 && (this.compNorm(p), this.compNorm(u), this.VIntY(p * 3, this.vlist, this.nlist, 21, h, b, c, F, C, D));
        J & 256 && (this.compNorm(k), this.compNorm(p), this.VIntZ(k * 3, this.vlist, this.nlist, 24, h, b, c, g, A, C));
        J & 512 && (this.compNorm(n), this.compNorm(v), this.VIntZ(n * 3, this.vlist, this.nlist, 27, h, I, c, g, y, H));
        J & 1024 && (this.compNorm(t), this.compNorm(w), this.VIntZ(t * 3, this.vlist, this.nlist, 30, h, I, S, g, z, Q));
        J & 2048 && (this.compNorm(o), this.compNorm(u), this.VIntZ(o * 3, this.vlist, this.nlist, 33, h, b, S, g, G, D));
        B <<= 4;
        for (h = k = 0; THREE.triTable[B + h] != -1;) b = B + h, c = b + 1, g = b + 2, this.posnormtriv(this.vlist, this.nlist, 3 * THREE.triTable[b], 3 * THREE.triTable[c], 3 * THREE.triTable[g], m), h += 3, k++;
        return k
    };
    this.posnormtriv = function (b, c, g, k, h, m) {
        var n = this.count * 3;
        this.positionArray[n] = b[g];
        this.positionArray[n + 1] = b[g + 1];
        this.positionArray[n + 2] = b[g + 2];
        this.positionArray[n + 3] = b[k];
        this.positionArray[n + 4] = b[k + 1];
        this.positionArray[n + 5] = b[k + 2];
        this.positionArray[n + 6] = b[h];
        this.positionArray[n + 7] = b[h + 1];
        this.positionArray[n + 8] = b[h + 2];
        this.normalArray[n] = c[g];
        this.normalArray[n + 1] = c[g + 1];
        this.normalArray[n + 2] = c[g + 2];
        this.normalArray[n + 3] = c[k];
        this.normalArray[n + 4] = c[k + 1];
        this.normalArray[n + 5] = c[k + 2];
        this.normalArray[n + 6] = c[h];
        this.normalArray[n + 7] = c[h + 1];
        this.normalArray[n + 8] = c[h + 2];
        this.hasNormal = this.hasPos = !0;
        this.count += 3;
        this.count >= this.maxCount - 3 && m(this)
    };
    this.begin = function () {
        this.count = 0;
        this.hasNormal = this.hasPos = !1
    };
    this.end = function (b) {
        if (this.count != 0) {
            for (var c = this.count * 3; c < this.positionArray.length; c++) this.positionArray[c] = 0;
            b(this)
        }
    };
    this.addBall = function (b, c, g, k, h) {
        var m = this.size * Math.sqrt(k / h),
            n = g * this.size,
            o = c * this.size,
            p = b * this.size,
            t = Math.floor(n - m);
        t < 1 && (t = 1);
        n = Math.floor(n + m);
        n > this.size - 1 && (n = this.size - 1);
        var v = Math.floor(o - m);
        v < 1 && (v = 1);
        o = Math.floor(o + m);
        o > this.size - 1 && (o = this.size - 1);
        var u = Math.floor(p - m);
        u < 1 && (u = 1);
        m = Math.floor(p + m);
        m > this.size - 1 && (m = this.size - 1);
        for (var w, B, A, y, G, z; t < n; t++) {
            p = this.size2 * t;
            B = t / this.size - g;
            G = B * B;
            for (B = v; B < o; B++) {
                A = p + this.size * B;
                w = B / this.size - c;
                z = w * w;
                for (w = u; w < m; w++) y = w / this.size - b, y = k / (1.0E-6 + y * y + z + G) - h, y > 0 && (this.field[A + w] += y)
            }
        }
    };
    this.addPlaneX = function (b, c) {
        var g, k, h, m, n, o = this.size,
            p = this.yd,
            t = this.zd,
            v = this.field,
            u = o * Math.sqrt(b / c);
        u > o && (u = o);
        for (g = 0; g < u; g++) if (k = g / o, k *= k, m = b / (1.0E-4 + k) - c, m > 0) for (k = 0; k < o; k++) {
            n = g + k * p;
            for (h = 0; h < o; h++) v[t * h + n] += m
        }
    };
    this.addPlaneY = function (b, c) {
        var g, k, h, m, n, o, p = this.size,
            t = this.yd,
            v = this.zd,
            u = this.field,
            w = p * Math.sqrt(b / c);
        w > p && (w = p);
        for (k = 0; k < w; k++) if (g = k / p, g *= g, m = b / (1.0E-4 + g) - c, m > 0) {
            n = k * t;
            for (g = 0; g < p; g++) {
                o = n + g;
                for (h = 0; h < p; h++) u[v * h + o] += m
            }
        }
    };
    this.addPlaneZ = function (b, c) {
        var g, k, h, m, n, o;
        size = this.size;
        yd = this.yd;
        zd = this.zd;
        field = this.field;
        dist = size * Math.sqrt(b / c);
        dist > size && (dist = size);
        for (h = 0; h < dist; h++) if (g = h / size, g *= g, m = b / (1.0E-4 + g) - c, m > 0) {
            n = zd * h;
            for (k = 0; k < size; k++) {
                o = n + k * yd;
                for (g = 0; g < size; g++) field[o + g] += m
            }
        }
    };
    this.reset = function () {
        var b;
        for (b = 0; b < this.size3; b++) this.normal_cache[b * 3] = 0, this.field[b] = 0
    };
    this.render = function (b) {
        this.begin();
        var c, g, k, h, m, n, o, p, t, v = this.size - 2;
        for (h = 1; h < v; h++) {
            t = this.size2 * h;
            o = (h - this.halfsize) / this.halfsize;
            for (k = 1; k < v; k++) {
                p = t + this.size * k;
                n = (k - this.halfsize) / this.halfsize;
                for (g = 1; g < v; g++) m = (g - this.halfsize) / this.halfsize, c = p + g, this.polygonize(m, n, o, c, this.isolation, b)
            }
        }
        this.end(b)
    };
    this.generateGeometry = function () {
        var b = 0,
            c = new THREE.Geometry,
            g = [];
        this.render(function (k) {
            var h, m, n, o, p, t, v, u;
            for (h = 0; h < k.count; h++) v = h * 3, p = v + 1, u = v + 2, m = k.positionArray[v],
            n = k.positionArray[p], o = k.positionArray[u], t = new THREE.Vector3(m, n, o), m = k.normalArray[v], n = k.normalArray[p], o = k.normalArray[u], v = new THREE.Vector3(m, n, o), v.normalize(), p = new THREE.Vertex(t), c.vertices.push(p), g.push(v);
            nfaces = k.count / 3;
            for (h = 0; h < nfaces; h++) v = (b + h) * 3, p = v + 1, u = v + 2, t = g[v], m = g[p], n = g[u], v = new THREE.Face3(v, p, u, [t, m, n]), c.faces.push(v);
            b += nfaces;
            k.count = 0
        });
        return c
    };
    this.init(b)
};
THREE.MarchingCubes.prototype = new THREE.Object3D;
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;
THREE.edgeTable = new Int32Array([0, 265, 515, 778, 1030, 1295, 1541, 1804, 2060, 2309, 2575, 2822, 3082, 3331, 3593, 3840, 400, 153, 915, 666, 1430, 1183, 1941, 1692, 2460, 2197, 2975, 2710, 3482, 3219, 3993, 3728, 560, 825, 51, 314, 1590, 1855, 1077, 1340, 2620, 2869, 2111, 2358, 3642, 3891, 3129, 3376, 928, 681, 419, 170, 1958, 1711, 1445, 1196, 2988, 2725, 2479, 2214, 4010, 3747, 3497, 3232, 1120, 1385, 1635, 1898, 102, 367, 613, 876, 3180, 3429, 3695, 3942, 2154, 2403, 2665, 2912, 1520, 1273, 2035, 1786, 502, 255, 1013, 764, 3580, 3317, 4095, 3830, 2554, 2291, 3065, 2800, 1616, 1881, 1107,
1370, 598, 863, 85, 348, 3676, 3925, 3167, 3414, 2650, 2899, 2137, 2384, 1984, 1737, 1475, 1226, 966, 719, 453, 204, 4044, 3781, 3535, 3270, 3018, 2755, 2505, 2240, 2240, 2505, 2755, 3018, 3270, 3535, 3781, 4044, 204, 453, 719, 966, 1226, 1475, 1737, 1984, 2384, 2137, 2899, 2650, 3414, 3167, 3925, 3676, 348, 85, 863, 598, 1370, 1107, 1881, 1616, 2800, 3065, 2291, 2554, 3830, 4095, 3317, 3580, 764, 1013, 255, 502, 1786, 2035, 1273, 1520, 2912, 2665, 2403, 2154, 3942, 3695, 3429, 3180, 876, 613, 367, 102, 1898, 1635, 1385, 1120, 3232, 3497, 3747, 4010, 2214, 2479, 2725, 2988, 1196, 1445, 1711, 1958, 170,
419, 681, 928, 3376, 3129, 3891, 3642, 2358, 2111, 2869, 2620, 1340, 1077, 1855, 1590, 314, 51, 825, 560, 3728, 3993, 3219, 3482, 2710, 2975, 2197, 2460, 1692, 1941, 1183, 1430, 666, 915, 153, 400, 3840, 3593, 3331, 3082, 2822, 2575, 2309, 2060, 1804, 1541, 1295, 1030, 778, 515, 265, 0]);
THREE.triTable = new Int32Array([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1, 3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1, 3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1, 9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1, 8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1, 9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, 4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1, 3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1, 1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1, 4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1, 4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1, 2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1, 9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, 2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1, 10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1, 5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1, 5, 4, 8, 5,
8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1, 0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1, 1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1, 8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1, 2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, 7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, 9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1, 2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1, 11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1, 9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1, 5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1, 11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1, 11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1, 9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1, 5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1, 2, 3, 11, 10, 6,
5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1, 6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1, 3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1, 6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1, 6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, 1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1, 8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1, 7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1, 3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1, 0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, 9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1, 8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1, 5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1, 0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1, 6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1, 10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1, 8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1, 1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1, 0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, 10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1, 3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1, 6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1, 9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1, 8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1, 3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1, 0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1, 10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1, 10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1, 1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1, 2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1, 7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1, 7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1, 2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1, 1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1, 11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1, 0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1, 7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1, 7,
2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1, 2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, 1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1, 10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1, 10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1, 0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1, 7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1, 6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1, 9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1, 6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1, 4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1, 10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1, 8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, 0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1, 1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1, 10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1, 4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1, 10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, 5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1, 9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1, 7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1, 3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1, 7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1, 3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1, 6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1, 9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1, 1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1, 4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1, 7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1, 6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1, 0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1, 6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1, 0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1, 11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1, 6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1, 5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1, 9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1, 1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1, 1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1, 10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1, 0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1, 5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1, 10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1, 11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1, 9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1, 7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1, 2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, 8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1, 9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1, 9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1, 1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1, 9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1, 9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, 5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1, 0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1, 10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1, 2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1, 0, 4, 11, 0, 11, 3, 4, 5, 11,
2, 11, 1, 5, 1, 11, -1, 0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1, 9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1, 5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1, 3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1, 5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1, 9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1, 1, 10, 11, 1, 11,
4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1, 3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1, 4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1, 9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1, 11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1, 11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1, 2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1, 9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1, 3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1, 1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1, 4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1, 0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1, 3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1, 0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1, 9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1, 1, 10,
2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
THREE.Trident = function (b) {
    function c(c) {
        return new THREE.Mesh(new THREE.CylinderGeometry(30, 0.1, b.length / 20, b.length / 5), new THREE.MeshBasicMaterial({
            color: c
        }))
    }
    function e(b, c) {
        var e = new THREE.Geometry;
        e.vertices = [new THREE.Vertex, new THREE.Vertex(b)];
        return new THREE.Line(e, new THREE.LineBasicMaterial({
            color: c
        }))
    }
    THREE.Object3D.call(this);
    var f = Math.PI / 2,
        g, b = b || THREE.Trident.defaultParams;
    if (b !== THREE.Trident.defaultParams) for (g in THREE.Trident.defaultParams) b.hasOwnProperty(g) || (b[g] = THREE.Trident.defaultParams[g]);
    this.scale = new THREE.Vector3(b.scale, b.scale, b.scale);
    this.addChild(e(new THREE.Vector3(b.length, 0, 0), b.xAxisColor));
    this.addChild(e(new THREE.Vector3(0, b.length, 0), b.yAxisColor));
    this.addChild(e(new THREE.Vector3(0, 0, b.length), b.zAxisColor));
    if (b.showArrows) g = c(b.xAxisColor), g.rotation.y = -f, g.position.x = b.length, this.addChild(g), g = c(b.yAxisColor), g.rotation.x = f, g.position.y = b.length, this.addChild(g), g = c(b.zAxisColor), g.rotation.y = Math.PI, g.position.z = b.length, this.addChild(g)
};
THREE.Trident.prototype = new THREE.Object3D;
THREE.Trident.prototype.constructor = THREE.Trident;
THREE.Trident.defaultParams = {
    xAxisColor: 16711680,
    yAxisColor: 65280,
    zAxisColor: 255,
    showArrows: !0,
    length: 100,
    scale: 1
};
THREE.PlaneCollider = function (b, c) {
    this.point = b;
    this.normal = c
};
THREE.SphereCollider = function (b, c) {
    this.center = b;
    this.radius = c;
    this.radiusSq = c * c
};
THREE.BoxCollider = function (b, c) {
    this.min = b;
    this.max = c;
    this.dynamic = !0;
    this.normal = new THREE.Vector3
};
THREE.MeshCollider = function (b, c) {
    this.mesh = b;
    this.box = c;
    this.numFaces = this.mesh.geometry.faces.length;
    this.normal = new THREE.Vector3
};
THREE.CollisionSystem = function () {
    this.collisionNormal = new THREE.Vector3;
    this.colliders = [];
    this.hits = []
};
THREE.Collisions = new THREE.CollisionSystem;
THREE.CollisionSystem.prototype.merge = function (b) {
    this.colliders = this.colliders.concat(b.colliders);
    this.hits = this.hits.concat(b.hits)
};
THREE.CollisionSystem.prototype.rayCastAll = function (b) {
    b.direction.normalize();
    this.hits.length = 0;
    var c, e, f, g, k = 0;
    c = 0;
    for (e = this.colliders.length; c < e; c++) if (g = this.colliders[c], f = this.rayCast(b, g), f < Number.MAX_VALUE) g.distance = f, f > k ? this.hits.push(g) : this.hits.unshift(g), k = f;
    return this.hits
};
THREE.CollisionSystem.prototype.rayCastNearest = function (b) {
    var c = this.rayCastAll(b);
    if (c.length == 0) return null;
    for (var e = 0; c[e] instanceof THREE.MeshCollider;) {
        var f = this.rayMesh(b, c[e]);
        if (f.dist < Number.MAX_VALUE) {
            c[e].distance = f.dist;
            c[e].faceIndex = f.faceIndex;
            break
        }
        e++
    }
    if (e > c.length) return null;
    return c[e]
};
THREE.CollisionSystem.prototype.rayCast = function (b, c) {
    if (c instanceof THREE.PlaneCollider) return this.rayPlane(b, c);
    else if (c instanceof THREE.SphereCollider) return this.raySphere(b, c);
    else if (c instanceof THREE.BoxCollider) return this.rayBox(b, c);
    else if (c instanceof THREE.MeshCollider && c.box) return this.rayBox(b, c.box)
};
THREE.CollisionSystem.prototype.rayMesh = function (b, c) {
    for (var e = this.makeRayLocal(b, c.mesh), f = Number.MAX_VALUE, g, k = 0; k < c.numFaces; k++) {
        var h = c.mesh.geometry.faces[k],
            m = c.mesh.geometry.vertices[h.a].position,
            n = c.mesh.geometry.vertices[h.b].position,
            o = c.mesh.geometry.vertices[h.c].position,
            p = h instanceof THREE.Face4 ? c.mesh.geometry.vertices[h.d].position : null;
        h instanceof THREE.Face3 ? (h = this.rayTriangle(e, m, n, o, f, this.collisionNormal, c.mesh), h < f && (f = h, g = k, c.normal.copy(this.collisionNormal), c.normal.normalize())) : h instanceof THREE.Face4 && (h = this.rayTriangle(e, m, n, p, f, this.collisionNormal, c.mesh), h < f && (f = h, g = k, c.normal.copy(this.collisionNormal), c.normal.normalize()), h = this.rayTriangle(e, n, o, p, f, this.collisionNormal, c.mesh), h < f && (f = h, g = k, c.normal.copy(this.collisionNormal), c.normal.normalize()))
    }
    return {
        dist: f,
        faceIndex: g
    }
};
THREE.CollisionSystem.prototype.rayTriangle = function (b, c, e, f, g, k, h) {
    var m = THREE.CollisionSystem.__v1,
        n = THREE.CollisionSystem.__v2;
    k.set(0, 0, 0);
    m.sub(e, c);
    n.sub(f, e);
    k.cross(m, n);
    m = k.dot(b.direction);
    if (!(m < 0)) if (h.doubleSided || h.flipSided) k.multiplyScalar(-1), m *= -1;
    else return Number.MAX_VALUE;
    h = k.dot(c) - k.dot(b.origin);
    if (!(h <= 0)) return Number.MAX_VALUE;
    if (!(h >= m * g)) return Number.MAX_VALUE;
    h /= m;
    m = THREE.CollisionSystem.__v3;
    m.copy(b.direction);
    m.multiplyScalar(h);
    m.addSelf(b.origin);
    Math.abs(k.x) > Math.abs(k.y) ? Math.abs(k.x) > Math.abs(k.z) ? (b = m.y - c.y, k = e.y - c.y, g = f.y - c.y, m = m.z - c.z, e = e.z - c.z, f = f.z - c.z) : (b = m.x - c.x, k = e.x - c.x, g = f.x - c.x, m = m.y - c.y, e = e.y - c.y, f = f.y - c.y) : Math.abs(k.y) > Math.abs(k.z) ? (b = m.x - c.x, k = e.x - c.x, g = f.x - c.x, m = m.z - c.z, e = e.z - c.z, f = f.z - c.z) : (b = m.x - c.x, k = e.x - c.x, g = f.x - c.x, m = m.y - c.y, e = e.y - c.y, f = f.y - c.y);
    c = k * f - e * g;
    if (c == 0) return Number.MAX_VALUE;
    c = 1 / c;
    f = (b * f - m * g) * c;
    if (!(f >= 0)) return Number.MAX_VALUE;
    c *= k * m - e * b;
    if (!(c >= 0)) return Number.MAX_VALUE;
    if (!(1 - f - c >= 0)) return Number.MAX_VALUE;
    return h
};
THREE.CollisionSystem.prototype.makeRayLocal = function (b, c) {
    var e = THREE.CollisionSystem.__m;
    THREE.Matrix4.makeInvert(c.matrixWorld, e);
    var f = THREE.CollisionSystem.__r;
    f.origin.copy(b.origin);
    f.direction.copy(b.direction);
    e.multiplyVector3(f.origin);
    e.rotateAxis(f.direction);
    f.direction.normalize();
    return f
};
THREE.CollisionSystem.prototype.rayBox = function (b, c) {
    var e;
    c.dynamic && c.mesh && c.mesh.matrixWorld ? e = this.makeRayLocal(b, c.mesh) : (e = THREE.CollisionSystem.__r, e.origin.copy(b.origin), e.direction.copy(b.direction));
    var f = 0,
        g = 0,
        k = 0,
        h = 0,
        m = 0,
        n = 0,
        o = !0;
    e.origin.x < c.min.x ? (f = c.min.x - e.origin.x, f /= e.direction.x, o = !1, h = -1) : e.origin.x > c.max.x && (f = c.max.x - e.origin.x, f /= e.direction.x, o = !1, h = 1);
    e.origin.y < c.min.y ? (g = c.min.y - e.origin.y, g /= e.direction.y, o = !1, m = -1) : e.origin.y > c.max.y && (g = c.max.y - e.origin.y, g /= e.direction.y,
    o = !1, m = 1);
    e.origin.z < c.min.z ? (k = c.min.z - e.origin.z, k /= e.direction.z, o = !1, n = -1) : e.origin.z > c.max.z && (k = c.max.z - e.origin.z, k /= e.direction.z, o = !1, n = 1);
    if (o) return -1;
    o = 0;
    g > f && (o = 1, f = g);
    k > f && (o = 2, f = k);
    switch (o) {
        case 0:
            m = e.origin.y + e.direction.y * f;
            if (m < c.min.y || m > c.max.y) return Number.MAX_VALUE;
            e = e.origin.z + e.direction.z * f;
            if (e < c.min.z || e > c.max.z) return Number.MAX_VALUE;
            c.normal.set(h, 0, 0);
            break;
        case 1:
            h = e.origin.x + e.direction.x * f;
            if (h < c.min.x || h > c.max.x) return Number.MAX_VALUE;
            e = e.origin.z + e.direction.z * f;
            if (e < c.min.z || e > c.max.z) return Number.MAX_VALUE;
            c.normal.set(0, m, 0);
            break;
        case 2:
            h = e.origin.x + e.direction.x * f;
            if (h < c.min.x || h > c.max.x) return Number.MAX_VALUE;
            m = e.origin.y + e.direction.y * f;
            if (m < c.min.y || m > c.max.y) return Number.MAX_VALUE;
            c.normal.set(0, 0, n)
    }
    return f
};
THREE.CollisionSystem.prototype.rayPlane = function (b, c) {
    var e = b.direction.dot(c.normal),
        f = c.point.dot(c.normal);
    if (e < 0) e = (f - b.origin.dot(c.normal)) / e;
    else return Number.MAX_VALUE;
    return e > 0 ? e : Number.MAX_VALUE
};
THREE.CollisionSystem.prototype.raySphere = function (b, c) {
    var e = c.center.clone().subSelf(b.origin);
    if (e.lengthSq < c.radiusSq) return -1;
    var f = e.dot(b.direction.clone());
    if (f <= 0) return Number.MAX_VALUE;
    e = c.radiusSq - (e.lengthSq() - f * f);
    if (e >= 0) return Math.abs(f) - Math.sqrt(e);
    return Number.MAX_VALUE
};
THREE.CollisionSystem.__v1 = new THREE.Vector3;
THREE.CollisionSystem.__v2 = new THREE.Vector3;
THREE.CollisionSystem.__v3 = new THREE.Vector3;
THREE.CollisionSystem.__nr = new THREE.Vector3;
THREE.CollisionSystem.__m = new THREE.Matrix4;
THREE.CollisionSystem.__r = new THREE.Ray;
THREE.CollisionUtils = {};
THREE.CollisionUtils.MeshOBB = function (b) {
    b.geometry.computeBoundingBox();
    var c = b.geometry.boundingBox,
        e = new THREE.Vector3(c.x[0], c.y[0], c.z[0]),
        c = new THREE.Vector3(c.x[1], c.y[1], c.z[1]),
        e = new THREE.BoxCollider(e, c);
    e.mesh = b;
    return e
};
THREE.CollisionUtils.MeshAABB = function (b) {
    var c = THREE.CollisionUtils.MeshOBB(b);
    c.min.addSelf(b.position);
    c.max.addSelf(b.position);
    c.dynamic = !1;
    return c
};
THREE.CollisionUtils.MeshColliderWBox = function (b) {
    return new THREE.MeshCollider(b, THREE.CollisionUtils.MeshOBB(b))
};
if (THREE.WebGLRenderer) THREE.AnaglyphWebGLRenderer = function (b) {
    THREE.WebGLRenderer.call(this, b);
    var c = this,
        e = this.setSize,
        f = this.render,
        g = new THREE.Camera,
        k = new THREE.Camera,
        h = new THREE.Matrix4,
        m = new THREE.Matrix4,
        n, o, p;
    g.useTarget = k.useTarget = !1;
    g.matrixAutoUpdate = k.matrixAutoUpdate = !1;
    var b = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    }, t = new THREE.WebGLRenderTarget(512, 512, b),
        v = new THREE.WebGLRenderTarget(512, 512, b),
        u = new THREE.Camera(53, 1, 1, 1E4);
    u.position.z = 2;
    _material = new THREE.MeshShaderMaterial({
        uniforms: {
            mapLeft: {
                type: "t",
                value: 0,
                texture: t
            },
            mapRight: {
                type: "t",
                value: 1,
                texture: v
            }
        },
        vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
        fragmentShader: "uniform sampler2D mapLeft;\nuniform sampler2D mapRight;\nvarying vec2 vUv;\nvoid main() {\nvec4 colorL, colorR;\nvec2 uv = vUv;\ncolorL = texture2D( mapLeft, uv );\ncolorR = texture2D( mapRight, uv );\ngl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;\n}"
    });
    var w = new THREE.Scene;
    w.addObject(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), _material));
    this.setSize = function (b, f) {
        e.call(c, b, f);
        t.width = b;
        t.height = f;
        v.width = b;
        v.height = f
    };
    this.render = function (b, e) {
        e.update(null, !0);
        if (n !== e.aspect || o !== e.near || p !== e.fov) {
            n = e.aspect;
            o = e.near;
            p = e.fov;
            var y = e.projectionMatrix.clone(),
                G = 125 / 30 * 0.5,
                z = G * o / 125,
                C = o * Math.tan(p * Math.PI / 360),
                H;
            h.n14 = G;
            m.n14 = -G;
            G = -C * n + z;
            H = C * n + z;
            y.n11 = 2 * o / (H - G);
            y.n13 = (H + G) / (H - G);
            g.projectionMatrix = y.clone();
            G = -C * n - z;
            H = C * n - z;
            y.n11 = 2 * o / (H - G);
            y.n13 = (H + G) / (H - G);
            k.projectionMatrix = y.clone()
        }
        g.matrix = e.matrixWorld.clone().multiplySelf(m);
        g.update(null, !0);
        g.position.copy(e.position);
        g.near = o;
        g.far = e.far;
        f.call(c, b, g, t, !0);
        k.matrix = e.matrixWorld.clone().multiplySelf(h);
        k.update(null, !0);
        k.position.copy(e.position);
        k.near = o;
        k.far = e.far;
        f.call(c, b, k, v, !0);
        f.call(c, w, u)
    }
};
if (THREE.WebGLRenderer) THREE.CrosseyedWebGLRenderer = function (b) {
    THREE.WebGLRenderer.call(this, b);
    this.autoClear = !1;
    var c = this,
        e = this.setSize,
        f = this.render,
        g, k, h = new THREE.Camera,
        m = new THREE.Camera;
    c.separation = 10;
    if (b && b.separation !== void 0) c.separation = b.separation;
    (new THREE.Camera(53, window.innerWidth / 2 / window.innerHeight, 1, 1E4)).position.z = -10;
    this.setSize = function (b, f) {
        e.call(c, b, f);
        g = b / 2;
        k = f
    };
    this.render = function (b, e) {
        this.clear();
        h.fov = e.fov;
        h.aspect = 0.5 * e.aspect;
        h.near = e.near;
        h.far = e.far;
        h.updateProjectionMatrix();
        h.position.copy(e.position);
        h.target.position.copy(e.target.position);
        h.translateX(c.separation);
        m.projectionMatrix = h.projectionMatrix;
        m.position.copy(e.position);
        m.target.position.copy(e.target.position);
        m.translateX(-c.separation);
        this.setViewport(0, 0, g, k);
        f.call(c, b, h);
        this.setViewport(g, 0, g, k);
        f.call(c, b, m, !1)
    }
};