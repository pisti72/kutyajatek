window.onload = function () {
    var canvas = document.getElementById("canvas")
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    eper.init()
    update()
}

function update(){
    eper.update()
    requestAnimationFrame(update)
}