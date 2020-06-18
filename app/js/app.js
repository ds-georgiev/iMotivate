$(document).ready(function(){

    $("#7").click(function(ev){
        ev.preventDefault();
        $.post('/logout', function(data){
            window.location.href = '/login';
        });

    })
    if(window.location.href.indexOf('dashboard')>0){
        $.get('/public/data/motivation.json', function(data){
            let motivation = data[Math.floor(Math.random() * data.length)];
            $('.motivation-wrapper').html("<h4>MOTIVATE YOURSELF</h4><i>" + motivation.message + "</i>");
        })

        $.get('/public/data/tips.json', function(data){
            let tip = data[Math.floor(Math.random() * data.length)];
            $('.tips-wrapper').html("<h4>DAYLY TIPS</h4><i>" + tip.message + "</i>");
        })
    }

    $('.form').find('input, textarea').on('keyup blur focus', function (e) {
                
        var $this = $(this),
            label = $this.prev('label');
        
        if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }
        } else if (e.type === 'blur') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {
        
            if ($this.val() === '') {
                label.removeClass('highlight');
            } else if ($this.val() !== '') {
                label.addClass('highlight');
            }
        }
    
    });

    checkTableLabels();
    
    $('.tab a').on('click', function (e) {
    
        e.preventDefault();
    
        $(this).parent().addClass('active');3
        $(this).parent().siblings().removeClass('active');
    
        target = $(this).attr('href');
    
        $('.tab-content > div').not(target).hide();
    
        $(target).fadeIn(600);
    
    });

    $('#contact-button').on('click', function(e){

        if($('#alert-success').hasClass('hidden')){
            $('#alert-success').removeClass('hidden');

            resetContactForm();

            setTimeout(function() {
                $('#alert-success').addClass('hidden');
            }, 3000);
        }
    });
    
    function resetContactForm(){
        
        $('#in-first-name').val('').focus();
        $('#in-last-name').val('').focus();
        $('#in-email').val('').focus();
        $('#in-date-birth').val('').focus();
        $('#in-phone').val('').focus();
        $('#in-question').val('').focus();
    }

    $('.content-trigger').click(function(ev){
        if($(this).data('target')==='report'){
            return;
        }
        ev.preventDefault();
        $('.content-wrapper').hide();
        $('[data-content="'+$(this).data('target')+'"]').show();
        if($(this).data('target') === 'exercise'){
            if($(this).hasClass('selected') === true){
                $(this).removeClass('selected');
                $('.content-trigger').removeClass('disabled');
                $(this).find('p').html('START EXERCISE');
                var video = $('#main-video'); 
                var iframe = video.contents().find('.ytp-play-button');
                iframe.trigger('click');
            }else{
                $('.content-trigger').removeClass('selected');
                $(this).addClass('selected');
                $('.content-trigger').addClass('disabled');
                $(this).removeClass('disabled');
                $(this).find('p').html('STOP EXERCISE');
                $('.points-holder').html("Points: "+Math.floor(Math.random()*50));
            }
        }else{
            $('.content-trigger').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    // $('#editForm').submit(function(){
    //     let data = new FormData();

    //     data.append('user_first_name', $('[name="user_first_name"]').val());
    //     data.append('user_last_name', $('[name="user_last_name"]').val());
    //     data.append('user_email', $('[name="user_email"]').val());
        
    // });

    // });


    function checkTableLabels(){

        if ($('#in-first-name').val() === '') {
            $('.first-name').removeClass('active highlight');
        } else {
            $('.first-name').addClass('active highlight');
        }

        if ($('#in-last-name').val() === '') {
            $('.last-name').removeClass('active highlight');
        } else {
            $('.last-name').addClass('active highlight');
        }

        if ($('#in-email').val() === '') {
            $('.u-email').removeClass('active highlight');
        } else {
            $('.u-email').addClass('active highlight');
        }
    }

});