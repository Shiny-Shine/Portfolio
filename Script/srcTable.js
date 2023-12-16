$(document).ready(function(){
    $('ul.tabs li').click(function(){
        let li_num = $("li").index(this);
        li_num -= 11;

        $('ul.tabs li').removeClass('current');
        $('.tab').removeClass('current');

        $(this).addClass('current');
        $('#tab' + li_num).addClass('current');
    })
})