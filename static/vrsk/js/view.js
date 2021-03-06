(function(){
    var socket = io();
    var gestureFunc;                            // 手势触发的方法
    var startDetect = true;                     // 是否开始手势轨迹检测（轨迹数据放至队列）
    var rotate = {
        x: 0,
        y: 0,
        z: 0
    };

    socket.on('gesture', function (gtr) {
        if (getQuery('id') !== gtr.id) {
            return;
        }
        gestureFunc && gestureFunc(gtr.direction);
    });

    $(window).on('orientationchange', function (e) {
        if (Math.abs(window.orientation) === 90) {
            $('#2d').hide();
            $('#3d').show();
            $('input[name="model"]').eq(0).attr('checked', 'checked');
            $('input[name="model"]').eq(1).removeAttr('checked');
        }
        else if (window.orientation === 0) {
            $('#3d').hide();
            $('#2d').show();
            $('input[name="model"]').eq(0).removeAttr('checked');
            $('input[name="model"]').eq(1).attr('checked', 'checked');
        }
    });

    // 手势方法
    gestureFunc = function (direction) {
        var style = '';
        if (direction === 'none' || direction === '上' || direction === '下') {
            return;
        }
        switch (direction) {
            case '左':
                rotate.y -= 60;
                break;
            case '右':
                rotate.y += 60;
                break;
            default:
                break;
        }
        style = 'rotateY(' + rotate.y + 'deg)';
        $('.piece-box').css({
            'transform': style
        });
    }

    function getQuery(key) {
        var search = window.location.search;
        var tmp;
        var val;
        if (search.length === 0) {
            return null;
        }
        searchArr = search.slice(1, search.length).split('&');
        for (var i = searchArr.length - 1; i >= 0; i--) {
            tmp = searchArr[i].split('=');
            if (tmp[0] === key) {
                val = tmp[1];
                break;
            }
        }
        return val;
    }

    $('#setting-btn').on('click', function () {
        var fullpage = $(this).parent('div');
        if (fullpage.hasClass('full_page_show')) {
            $('#mask').removeClass('mask_show');
            fullpage.removeClass('full_page_show');
        }
        else {
            $('#mask').addClass('mask_show');
            fullpage.addClass('full_page_show');
        }
    });

    $('#mask').on('click', function () {
        $(this).removeClass('mask_show');
        $('#setting-btn').parent('div').removeClass('full_page_show');
    });

    // VR开关
    $('input[name="model"]').on('change', function () {
        $('input[name="model"]').each(function () {
            $(this).removeAttr('checked');
        });
        $(this).attr('checked', 'checked');
        if (+$('input[name="model"][checked]').val() === 1) {
            $('#2d').hide();
            $('#3d').show();
        }
        else {
            $('#3d').hide();
            $('#2d').show();
        }
    });
    if (+$('input[name="model"][checked]').val() === 1) {
        $('#2d').hide();
        $('#3d').show();
    }
    else {
        $('#3d').hide();
        $('#2d').show();
    }
})();