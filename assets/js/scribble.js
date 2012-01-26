$(document).ready(function () {
    var last_updated = 0;
    function update() {
        $.ajax(location.href + 'json', {
            data: {if_updated_since: last_updated},
            success: function (data) {
                $('#scribble img').attr('src', data.image);
                last_updated = data.last_updated;
            }
        });
    }

    setInterval(update, 500);
});
