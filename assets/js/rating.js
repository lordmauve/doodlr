$(document).ready(function () {
    $('input[type=range]').hide();

    var s = '<div class="rating">';
    for (var i = 1; i <= 5; i++) {
        s += '<img src="/static/images/star-off.png" data-value="' + i + '">';
    }
    s += '</div>';
    $('input[type=range]').after(s);

    $('.rating img').hover(function () {
        var v = $(this).attr('data-value');
        $(this).prevAll('img').add(this).attr('src', '/static/images/star-on.png');
        $(this).nextAll('img').attr('src', '/static/images/star-off.png');
    });

    $('.rating img').click(function () {
        var v = $(this).attr('data-value');
        var section = $(this).parents('section#rate');
        var url = $('input[type=range]', section).attr('data-rating-url');
        $.ajax(url, {
            type: 'POST',
            data: {rating: v},
            success: function (response) {
                section.delay(5000).fadeOut();
                section.html(response);
            },
            error: function (response) {
                alert("Error: " + response.rating);
            }
        });
    });
});
