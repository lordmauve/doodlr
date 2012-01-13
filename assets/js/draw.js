$(document).ready(function () {

    var canvas = $('canvas');
    var ctx = canvas[0].getContext("2d");

    ctx.fillStyle = "white";
    ctx.lineCap = "round";
    ctx.fillRect(0, 0, canvas.width(), canvas.height());

    var drawing = false;
    var lastpos = null;

    function draw(event) {
        var off = canvas.offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;

        if (!lastpos) 
            lastpos = [x, y];

        ctx.beginPath();
        ctx.moveTo(lastpos[0], lastpos[1]);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastpos = [x, y];
    }
    canvas.mousedown(function (event) {
        drawing = true;
        draw(event);
    });

    $('body').mouseup(function (event) {
        if (!drawing) return;
        drawing = false;
        draw(event);
        lastpos = null;

        var data = canvas[0].toDataURL();

        $.ajax(canvas.attr('data-post-url'), {
            data: {image: data},
            type: 'POST',
        });
    });

    canvas.bind('mousemove', function(event) {
        if (drawing)
            draw(event);
    });

    $('#pen-tool').click(function () {
        ctx.strokeStyle = 'black';
        $('svg .bg').css('fill', '#f2f2f2');
        $('.bg', this).css('fill', '#ccc');
    });

    $('#eraser-tool').click(function () {
        ctx.strokeStyle = 'white';
        $('svg .bg').css('fill', '#f2f2f2');
        $('.bg', this).css('fill', '#ccc');
    });

    $('.pensize').click(function () {
        var size = parseInt(/size-(\d+)/.exec(this.id)[1], 10);

        ctx.lineWidth = (size - 1) * 5 + 1;

        $('.pensize').css({
            'stroke-width': '1px',
            'fill': '#cccccc'
        });
        $(this).css({
            'stroke-width': '0',
            'fill': 'black'
        });
    });

    $('svg use').click(function () {
        var fill = $(this).css('fill');
        ctx.strokeStyle = fill;
        $('#current-color').css('fill', fill);
    });
});
