var eper = {
    is_debug: true,
    INGAME: 0,
    font_img: {},
    FONT_WIDTH: 9,
    FONT_HEIGHT: 10,
    TILE_SIZE: 18,
    tiles_img: {},
    canvas,
    cursor: { x: 0, y: 0 },
    map_array: [],
    pixel: 4,
    TILE_REALSIZE: 1,
    letter_table: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!?",
    letter_width: "777777777777777777777777777777777777477",
    timer_begin: 0,
    time_duration: 0,
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
            eper.cursor.x = Math.floor(e.offsetX / eper.TILE_REALSIZE)
            eper.cursor.y = Math.floor(e.offsetY / eper.TILE_REALSIZE)
        })
        this.map_array = [
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
    },
    draw_map: function () {
        var x = 0
        var y = 0
        for (var j = 0; j < this.map_array.length; j++) {
            var row = this.map_array[j]
            x2 = x
            for (var i = 0; i < row.length; i++) {
                var char = row.charAt(i)
                var offset_x = 0
                var offset_y = 0
                var visible = false
                if (char == "0") {
                    visible = true
                } else if (char == "1") {
                    offset_x = 7
                    offset_y = 1
                    visible = true
                }
                if (visible) {
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
            let offset_x = idx % 13
            let offset_y = Math.floor(idx / 13)
            //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            this.ctx.drawImage(this.font_img,
                offset_x * this.FONT_WIDTH, offset_y * this.FONT_HEIGHT,
                this.FONT_WIDTH, this.FONT_HEIGHT, x, y,
                this.FONT_WIDTH * this.pixel, this.FONT_HEIGHT * this.pixel)
            x += this.pixel * 7
        }
    },
    draw_cursor: function () {
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        this.ctx.fillRect(this.cursor.x * this.TILE_REALSIZE, this.cursor.y * this.TILE_REALSIZE, this.TILE_REALSIZE, this.TILE_REALSIZE)
    },
    cls: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    draw_debug: function (value) {
        if (this.is_debug) {
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = "20px tahoma";
            this.ctx.fillText("Value:" + value, 20, 24)
        }
    },
    start_timer: function () {
        const d = new Date()
        this.timer_begin = d.getTime()
    },
    end_timer: function () {
        const d = new Date()
        this.time_duration = d.getTime() - this.timer_begin
    },
    update: function () {
        this.start_timer()
        this.cls()
        this.draw_map()
        this.draw_text("EPER.JS", 50, 50)
        this.draw_cursor()
        this.draw_debug(this.time_duration)
        this.end_timer()
    },
    say_hello: function () {

    }

}
