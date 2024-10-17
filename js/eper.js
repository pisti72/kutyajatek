var eper = {
    is_debug: true,
    debug_value: "",
    INGAME: 0,
    font_img: {},
    FONT_WIDTH: 9,
    FONT_HEIGHT: 10,
    TILE_SIZE: 18,
    MARGIN: 40,
    EMPTY: 9999,
    tiles_img: {},
    tiles_char: "0123456789ABCDEFGHIJKLMNOPQRSTU",
    export: { visible: false },
    canvas,
    mouse: { x: 0, y: 0, pressed: false },
    cursor: { x: 0, y: 0, tile: 0 },
    camera: { x: 0, y: 0, speed: 2 },
    map_array: [],
    tile_map_width: 20,
    tile_map_length: 40,
    pixel: 4,
    PIXEL_MAX: 10,
    key_w: false,
    key_f: false,
    key_g: false,
    key_e: false,
    TILE_REALSIZE: 1,
    letter_table: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!?abcdefghijklmnopqrstuvwxyz,:-/=*©@#$%_ ",
    letter_width: "777777774777977777777797777577777777467776765774575867776666686766667677888996",
    timer_begin: 0,
    time_array: [],
    init: function () {
        this.font_img = new Image()
        this.font_img.src = "images/retro_font.png"
        this.tiles_img = new Image()
        this.tiles_img.src = "images/tilemap_packed.png"
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false
        this.TILE_REALSIZE = this.TILE_SIZE * this.pixel
        document.addEventListener("mousemove", function (e) {
            eper.mousemove(e)
        })
        document.addEventListener("mousedown", function (e) {
            eper.mousedown(e)
        })
        document.addEventListener("mouseup", function (e) {
            eper.mouseup(e)
        })
        document.addEventListener("keydown", function (e) {
            eper.keypressed(e)
        })
        document.addEventListener("keyup", function (e) {
            eper.keyreleased(e)
        })
        this.generate_empty_map(161, 51)
        //this.import_map(map_array)
    },
    keypressed: function (e) {
        //this.debug_value = e.code
        if (e.code == "KeyW") {
            this.key_w = true
            //this.debug_value = "W pressed"
        }
        if (e.code == "KeyG") {
            this.key_g = true
            this.cursor.tile = this.get_map(this.cursor.x, this.cursor.y)
        }
        if (e.code == "KeyF") {
            this.key_f = true
        }
        if (e.code == "KeyE") {
            this.key_f = true
            this.export_map()
        }
        if (e.code == "NumpadAdd") {
            this.key_add = true
            this.pixel_increase()
        }
        if (e.code == "NumpadSubtract") {
            this.key_minus = true
            this.pixel_decrease()
        }
        //this.debug_value = "pressed"
    },
    keyreleased: function (e) {
        if (e.code == "KeyW") {
            this.key_w = false
        }
        if (e.code == "KeyG") {
            this.key_g = false
        }
        if (e.code == "KeyF") {
            this.key_f = false
        }
        if (e.code == "KeyE") {
            this.key_f = false
        }
        if (e.code == "NumpadAdd") {
            this.key_add = false
        }
        if (e.code == "NumpadSubtract") {
            this.key_minus = false
        }
        //this.debug_value = "released"
    },
    mousemove: function (e) {
        this.mouse.x = e.offsetX
        this.mouse.y = e.offsetY

        if (this.key_f || this.mouse.pressed) {
            this.set_map(this.cursor.x, this.cursor.y, this.cursor.tile)
        }
    },
    mousedown: function (e) {
        this.mouse.pressed = true
        this.set_map(this.cursor.x, this.cursor.y, this.cursor.tile)
    },
    mouseup: function (e) {
        this.mouse.pressed = false
    },
    camera_down: function () {
        this.camera.y += this.pixel * this.camera.speed
        var lowest_limit = this.map_array.length * this.TILE_REALSIZE - this.canvas.height
        if (this.camera.y > lowest_limit) {
            this.camera.y = lowest_limit
        }
    },
    camera_up: function () {
        this.camera.y -= this.pixel * this.camera.speed
        if (this.camera.y < 0) {
            this.camera.y = 0
        }
    },
    camera_right: function () {
        this.camera.x += this.pixel * this.camera.speed
        var rightest_limit = this.map_array[1].length * this.TILE_REALSIZE - this.canvas.width
        if (this.camera.x > rightest_limit) {
            this.camera.x = rightest_limit
        }
    },
    camera_left: function () {
        this.camera.x -= this.pixel * this.camera.speed
        if (this.camera.x < 0) {
            this.camera.x = 0
        }
    },
    export_map: function () {
        this.normalize_map()
        var export_dom = document.getElementById("export")
        this.export.visible = !this.export.visible
        var text = ""
        for (var j = 1; j < this.map_array.length; j++) {
            text += "\""
            for (var i = 0; i < this.map_array[j].length; i++) {
                var tile = this.get_map(i, j)
                var char = "&nbsp;"
                if (tile < this.EMPTY) {
                    char = this.tiles_char.charAt(tile)
                }
                text += char
            }
            text += "\",<br>"
        }
        if (this.export.visible) {
            export_dom.innerHTML = text
        } else {
            export_dom.innerHTML = ""
        }

    },
    normalize_map: function () {
        var longest_row = 0
        for (var j = 1; j < this.map_array.length; j++) {
            var length = this.map_array[j].length
            if (length > longest_row) {
                longest_row = length
            }
        }
        console.log(longest_row)
        for (var j = 1; j < this.map_array.length; j++) {
            var row = this.map_array[j]
            var length = row.length
            if (length < longest_row) {
                var delta = longest_row - length
                for (var i = 0; i < delta; i++) {
                    row.push(this.EMPTY)
                }
            }
        }
    },
    pixel_increase: function () {
        this.pixel++
        if (this.pixel > this.PIXEL_MAX) {
            this.pixel = this.PIXEL_MAX
        }
        this.TILE_REALSIZE = this.TILE_SIZE * this.pixel
    },
    pixel_decrease: function () {
        this.pixel--
        if (this.pixel < 1) {
            this.pixel = 1
        }
        this.TILE_REALSIZE = this.TILE_SIZE * this.pixel
    },
    generate_zero_row: function(){
        this.map_array = []
        //adding zero row
        var row_array = []
        var n = 0
        for (var i = 0; i < this.tiles_char.length; i++) {
            row_array.push(n)
            n++
        }
        this.map_array.push(row_array)
    },
    generate_empty_map: function (width, height) {
        this.generate_zero_row()
        //adding the rest
        for (var j = 0; j < height; j++) {
            row_array = []
            for (var i = 0; i < width; i++) {
                if (i == 0 || j == 0 || i == width - 1 || j == height - 1 || (j - i) % 6 == 0 || (j + i) % 6 == 0) {
                    row_array.push(0)
                } else {
                    row_array.push(this.EMPTY)
                }

            }
            this.map_array.push(row_array)
        }
    },
    import_map: function (string_array) {
        this.generate_zero_row()
        //adding the rest
        for (var j = 0; j < string_array.length; j++) {
            var row = string_array[j]
            row_array = []
            for (var i = 0; i < row.length; i++) {
                var value = this.EMPTY
                var char = row.charAt(i)
                if (char != " ") {
                    value = this.tiles_char.search("[" + char + "]")
                }
                row_array.push(value)
            }
            this.map_array.push(row_array)
        }
    },
    get_map: function (x, y) {
        return this.map_array[y][x]
    },
    set_map: function (x, y, n) {
        if (y > 0) {
            this.map_array[y][x] = n
        }
    },
    draw_map: function () {
        var x = -this.camera.x
        var y = -this.camera.y
        for (var j = 0; j < this.map_array.length; j++) {
            x2 = x
            for (var i = 0; i < this.map_array[j].length; i++) {
                var value = this.map_array[j][i]
                var offset_x = value % this.tile_map_width
                var offset_y = Math.floor(value / this.tile_map_width)
                if (value != this.EMPTY) {
                    this.ctx.drawImage(this.tiles_img,
                        offset_x * this.TILE_SIZE, offset_y * this.TILE_SIZE,
                        this.TILE_SIZE, this.TILE_SIZE, x2, y,
                        this.TILE_REALSIZE, this.TILE_REALSIZE)
                }
                x2 += this.pixel * this.TILE_SIZE
            }
            y += this.pixel * this.TILE_SIZE
        }
    },
    draw_text: function (text, x_pos, y_pos) {
        let x = x_pos * this.pixel
        let y = y_pos * this.pixel
        for (i = 0; i < text.length; i++) {
            let letter = text.charAt(i)
            let idx = this.letter_table.search("[" + letter + "]")
            let letter_width = this.letter_width.charAt(idx)
            let offset_x = idx % 13
            let offset_y = Math.floor(idx / 13)
            //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            this.ctx.drawImage(this.font_img,
                offset_x * this.FONT_WIDTH, offset_y * this.FONT_HEIGHT,
                this.FONT_WIDTH, this.FONT_HEIGHT, x, y,
                this.FONT_WIDTH * this.pixel, this.FONT_HEIGHT * this.pixel)
            x += this.pixel * letter_width
        }
    },
    draw_cursor: function () {
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        this.ctx.fillRect(
            this.cursor.x * this.TILE_REALSIZE - this.camera.x,
            this.cursor.y * this.TILE_REALSIZE - this.camera.y,
            this.TILE_REALSIZE, this.TILE_REALSIZE)
    },
    cls: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    draw_debug: function () {
        if (this.is_debug) {
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = "20px tahoma";
            this.ctx.fillText("Value:" + this.debug_value, 20, 24)
        }
    },
    start_timer: function () {
        const d = new Date()
        this.timer_begin = d.getTime()
    },
    end_timer: function () {
        const d = new Date()
        var time_taken = d.getTime() - this.timer_begin
        time_taken = 21
        this.time_array.push(time_taken)
    },
    get_time_taken: function () {
        var n = this.time_array.length
        if (this.time_array.length > 20) {
            var sum = 0
            for (var i = n - 10; i < n; i++) {
                sum += this.time_array[i] * 1
                //sum += 1
            }
            return sum / 10
        }
        return 0
    },
    osszead: function (a, b) {
        return a + b
    },
    update_cursor: function () {
        this.cursor.x = Math.floor((this.mouse.x + this.camera.x) / this.TILE_REALSIZE)
        this.cursor.y = Math.floor((this.mouse.y + this.camera.y) / this.TILE_REALSIZE)
    },
    update_camera: function () {
        if (this.mouse.y > this.canvas.height - this.TILE_REALSIZE) {
            this.camera_down()
        } else if (this.mouse.y < this.TILE_REALSIZE) {
            this.camera_up()
        }
        if (this.mouse.x > this.canvas.width - this.TILE_REALSIZE) {
            this.camera_right()
        } else if (this.mouse.x < this.TILE_REALSIZE) {
            this.camera_left()
        }

    },
    update: function () {
        this.update_cursor()
        this.update_camera()
        this.start_timer()
        this.cls()
        this.draw_map()
        this.draw_text("EPER.JS, istvan.szalontai12@gmail.com", 50, 50)
        this.draw_text("We are building a better world!", 60, 50 + 12)
        this.draw_cursor()
        this.debug_value = this.get_time_taken()
        this.draw_debug()
        this.end_timer()
    },
    say_hello: function () {

    }

}
