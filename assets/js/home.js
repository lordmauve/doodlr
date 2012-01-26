$(document).ready(function () {
    $('#new-doodle').click(function () {
        location.href = '/draw'
    });

    function update_current() {
        $('#current').load('/current', function(data) {
            if ($('#current img').length) {
                $('#current_section').slideDown();
            } else {
                $('#current_section').slideUp();
            }
        });
    }

    if (!$('#current img').length) {
        $('#current_section').hide();
    }

    setInterval(update_current, 3000);
});
