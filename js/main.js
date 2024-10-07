window.onload = function () {
    var canvas = document.getElementById("canvas")
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFF';
    ctx.font = "24px tahoma";
    ctx.fillText("Hello World", 20, 24)
}