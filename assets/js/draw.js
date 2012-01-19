$(document).ready(function () {

    var canvas = $('canvas#scribble');
    var glass = $('canvas#glass');
    var cctx = canvas[0].getContext("2d");
    var gctx = glass[0].getContext("2d");

    gctx.lineCap = "round";
    gctx.lineJoin = "round";
    gctx.lineWidth = 1;

    tool = 'pen';
    color = 'black';
    width = 1;
    alpha = 1;

    gctx.globalAlpha = 0.5;

    function clear(color) {
        cctx.fillStyle = color;
        cctx.fillRect(0, 0, canvas.width(), canvas.height());
    }

    function clearglass() {
        gctx.save();
        gctx.globalCompositeOperation = 'copy';
        gctx.fillStyle = 'rgba(0, 0, 0, 0)';
        gctx.fillRect(0, 0, glass.width(), glass.height());
        gctx.restore();
    }

    clear('white');

    var drawing = false;
    var currentstroke = [];

    function drawcursor(event) {
        var off = canvas.offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        if (x < 0 || x > glass.width()) return;
        if (y < 0 || y > glass.height()) return;

        gctx.save();
        gctx.strokeStyle = 'red';
        gctx.lineWidth = 1;
        gctx.globalAlpha = 1;
        gctx.beginPath();
        gctx.arc(x, y, width * 0.5, 0, 2 * Math.PI, false);
        gctx.stroke();
        gctx.restore();
    }

    function setPen(ctx) {
        switch (tool) {
            case 'pen':
                ctx.lineWidth = width;
                ctx.strokeStyle = color;
                ctx.globalAlpha = alpha;
                break;

            case 'eraser':
                ctx.lineWidth = width;
                ctx.strokeStyle = 'white';
                ctx.globalAlpha = 1.0;
                break;
        }
    }

    function draw(event) {
        var off = canvas.offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;

        setPen(gctx);

        if (!currentstroke.length) 
            currentstroke.push([x, y]);

        currentstroke.push([x, y]);
        gctx.beginPath();
        currentstroke.forEach(function (x, i) {
            if (i)
                gctx.lineTo(x[0], x[1]);
            else
                gctx.moveTo(x[0], x[1]);
        });
        gctx.stroke();
    }

    function commitStroke() {
        var params = 'lineWidth strokeStyle fillStyle lineJoin lineCap globalAlpha';
        params.split(' ').forEach(function (v) { cctx[v] = gctx[v]; });
        cctx.beginPath();
        currentstroke.forEach(function (x, i) {
            if (i)
                cctx.lineTo(x[0], x[1]);
            else
                cctx.moveTo(x[0], x[1]);
        });
        cctx.stroke();
        currentstroke = [];
    }

    glass.mousedown(function (event) {
        drawing = true;
        currentstroke = [];
        draw(event);
    });

    $('body').mouseup(function (event) {
        if (!drawing) return;
        drawing = false;
        draw(event);
        commitStroke();
        clearglass();
        drawcursor(event);

        var data = canvas[0].toDataURL();

        $.ajax(canvas.attr('data-post-url'), {
            data: {image: data},
            type: 'POST',
        });
    });

    $('body').bind('mousemove', function(event) {
        if (drawing) {
            clearglass();
            draw(event);
        }
        
        if (event.target == glass[0]) {
            if (!drawing)
                clearglass();
            drawcursor(event);
        }
    });

    $('#pen-tool').click(function () {
        tool = 'pen';
        $('svg .bg').css('fill', '#f2f2f2');
        $('.bg', this).css('fill', '#ccc');
    });

    $('#eraser-tool').click(function () {
        tool = 'eraser';
        $('svg .bg').css('fill', '#f2f2f2');
        $('.bg', this).css('fill', '#ccc');
    });

    $('.pensize').click(function () {
        var size = parseInt(/size-(\d+)/.exec(this.id)[1], 10);

        width = (size - 1) * 5 + 1;

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
        color = fill;
        $('#current-color').css('fill', fill);
    });

    $('#pen-opacity rect').click(function () {
        alpha = $(this).css('opacity');
        $('#pen-opacity rect').css('fill', 'black');
        $(this).css('fill', 'red');
    });

    $('#pen-opacity rect').last().css('fill', 'red');
});
