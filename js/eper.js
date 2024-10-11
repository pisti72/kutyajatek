var eper = {
    is_debug:true,
    INGAME: 0,
    font_img: {},
    FONT_WIDTH: 9,
    FONT_HEIGHT: 10,
    tiles_img: {},
    canvas,
    pixel: 6,
    letter_table: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!?",
    init: function () {
        this.font_img = new Image()
        this.font_img.src = "images/retro_font.png"
        this.tiles_img = new Image()
        this.tiles_img.src = "images/tilemap_packed.png"
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false;
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
    draw_debug: function(value){
        if(this.is_debug){
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = "20px tahoma";
            this.ctx.fillText("Value:"+value, 20, 24)
        }
    },
    update: function () {
        this.draw_text("EPER.JS", 50, 50)
        this.draw_debug("42")

    },
    say_hello: function () {

    }

}
