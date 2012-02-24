$(document).ready(function () {
    $('section.scribbles').each(function () {
        var w = $(this).width();

        $('<canvas width="' + w + '" height="40"></canvas>').appendTo(this);
    });

    $('section.scribbles canvas').each(function () {
        var ctx = this.getContext('2d');
        ctx.save();
        ctx.translate(0, 45);
        ctx.scale(1, -1);
        $('img', $(this).parent()).each(function () {
            var w = $(this).width();
            var h = $(this).height();
            var pos = $(this).offset();
            var parent = $(this).parents('section').last();
            var ppos = parent.offset();
            var top = (ppos.top + parent.height()) - (pos.top + h) - h;
            var left = parseInt(pos.left - ppos.left);
            ctx.drawImage(this, left, top, w, h);
        });
        ctx.restore();

        var g = ctx.createLinearGradient(0, 0, 0, 40);
        g.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
        g.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.width, this.height);
    });
});
