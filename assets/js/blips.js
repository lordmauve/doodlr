$(document).ready(function () {
    var url = $('#blips form').attr('action');

    function get_last() {
        var newest = 0;

        var blips = $('.blip');

        for (var i = 0; i < blips.length; i++) {
            var blip = $(blips[i]);
            var id = blip.attr('id');
            id = parseInt(/\d+$/.exec(id)[0], 10);
            if (id > newest) {
                newest = id;
            }
        }

        return newest;
    }

    function get_url() {
        return url + '?since=' + get_last();
    }

    $('#blips textarea').keypress(function (event) {
        if (event.keyCode == 13 && !event.shiftKey) {
            var content = $(this).val();
            $.ajax(get_url(), {
                type: 'POST',
                data: {blip: content},
                success: function (data) {
                    $('#blips form').after(data);
                    $('#blips textarea').val('');
                }
            });
        }
    });

    setInterval(function () {
        $.ajax(get_url(), {
            success: function (data) {
                $('#blips form').after(data);
            }
        });
    }, 1000);
});
