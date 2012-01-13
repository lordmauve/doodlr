$(document).ready(function () {
    var url = $('#blips form').attr('action');

    function get_last() {
        var latest_blip = $('.blip').first();
        if (!latest_blip.length) return 0;
        var last_id = latest_blip.attr('id');
        return parseInt(/\d+$/.exec(last_id)[0], 10);
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
    }, 6000);
});
