var eper = {
    is_debug: true,
    debug_value: "",
    INGAME: 0,
    font_img: {},
    FONT_WIDTH: 9,
    FONT_HEIGHT: 10,
    TILE_SIZE: 18,
    EMPTY: 9999,
    tiles_img: {},
    canvas,
    cursor: { x: 0, y: 0, tile:0 },
    map_array: [],
    tile_map_width: 20,
    tile_map_length: 20,
    pixel: 4,
    key_w: false,
    key_f: false,
    key_g: false,
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
        document.addEventListener("mousemove", function (e) {
            eper.mousemove(e)
        })
        document.addEventListener("keydown", function (e) {
            eper.keypressed(e)
        })
        document.addEventListener("keyup", function (e) {
            eper.keyreleased(e)
        })
        var map_array = [
            '0000000000000',
            '000       000',
            '0   00 00   0',
            '0  0000000  0',
            '0  0010000  0',
            '00  00000  00',
            '000  000  000',
            '0000  0  0000',
            '00000   00000',
            '000000 000000',
            '0000000000000',
            '0000000000000',
            '000       000',
            '0   00 00   0',
            '0  0000000  0',
            '0  0010000  0',
            '00  00000  00',
            '000  000  000',
            '0000  0  0000',
            '00000   00000',
            '000000 000000',
            '0000000000000',
        ]
        this.import_map(map_array)
    },
    keypressed: function (e) {
        if (e.key == "w") {
            this.key_w = true
        }
        if (e.key == "g") {
            this.key_g = true
            this.cursor.tile = this.get_map(this.cursor.x,this.cursor.y)
        }
        if (e.key == "f") {
            this.key_f = true
            //if (this.key_g){
                
            //}
        }
        this.debug_value = "pressed"
    },
    keyreleased: function (e) {
        if (e.key == "w") {
            this.key_w = false
        }
        if (e.key == "g") {
            this.key_g = false
        }
        if (e.key == "f") {
            this.key_f = false
        }
        this.debug_value = "released"
    },
    mousemove: function (e) {
        this.cursor.x = Math.floor(e.offsetX / this.TILE_REALSIZE)
        this.cursor.y = Math.floor(e.offsetY / this.TILE_REALSIZE)
        if (this.key_f){
            this.set_map(this.cursor.x,this.cursor.y,this.cursor.tile)
        }
    },
    import_map: function (string_array) {
        this.map_array = []
        //adding zero row
        var row_array = []
        var n=0 
        for(var i=0;i<this.tile_map_length;i++){
            row_array.push(n)
            n++
        }
        this.map_array.push(row_array)
        //adding the rest
        for (var j = 0; j < string_array.length; j++) {
            var row = string_array[j]
            row_array = []
            for (var i = 0; i < row.length; i++) {
                var value = this.EMPTY
                var char = row.charAt(i)
                if (char == "0") {
                    value = 0
                } else if (char == "1") {
                    value = 27
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
        this.map_array[y][x] = n
    },
    draw_map: function () {
        var x = 0
        var y = 0
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
        this.ctx.fillRect(this.cursor.x * this.TILE_REALSIZE, this.cursor.y * this.TILE_REALSIZE, this.TILE_REALSIZE, this.TILE_REALSIZE)
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
    update: function () {
        this.start_timer()
        this.cls()
        this.draw_map()
        this.draw_text("EPER.JS , istvan.szalontai12@gmail.com", 50, 50)
        this.draw_cursor()
        //this.debug_value = this.get_time_taken()
        this.draw_debug()
        this.end_timer()
    },
    say_hello: function () {

    }

}
