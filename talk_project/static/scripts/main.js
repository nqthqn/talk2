$(function() {

    /* Event Handlers */

    // Display comment form on click
    $("#talk").on('click', 'a[id^=open-comment-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[2];
        $('#comment-box-'+post_primary_key).show();
        $('#open-comment-'+post_primary_key).hide();
        $('#comment-for-'+post_primary_key).focus();
    });

    // Submit comment on click
    $("#talk").on('click', 'input[id^=comment-submit-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[2];
        // NOTE: does not handle a scenario where a user simply adds spaces into the input box
        if ($('#comment-for-'+post_primary_key).val() !== "") {
            create_comment(post_primary_key);
        }
    });

    // Submit post form on submit
    $('#post-form').on('submit', function(){
        console.log("form submitted!"); // sanity check
        create_post();
    });

    // Delete item on click
    $("#talk").on('click', 'a[id^=delete-]', function(){
        var type = $(this).attr('id').split('-')[1];
        var primary_key = $(this).attr('id').split('-')[2];
        delete_item(type, primary_key);
        console.log("Deleting " + primary_key + " of type " + type);
    });

    function delete_item(type, primary_key) {
        $.ajax({
            url : "delete_item/",
            type : "POST",
            data : { item_type: type, pk : primary_key },
            success : function(json) {
                $('#' + type + '-' + primary_key).hide();
                console.log("#" + type + "-" + primary_key + " success!");
            },

            error : function(xhr,errmsg,err) {
                  $('#results').html("<div class='alert-box alert radius' data-alert>"+
                    "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
                   console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }

    /* AJAX for commenting */

    function create_comment(post_primary_key){
      $.ajax({
        url : "create_comment/",
        type : "POST",
        data : { the_comment : $('#comment-for-'+post_primary_key).val(), postpk : post_primary_key},
        success : function(json) {
          // Hide the comment box, show the comment button and append the comment.
          $('#comment-box-'+post_primary_key).hide();
          $('#comment-for-'+post_primary_key).val('');
          $('#open-comment-'+post_primary_key).show();
          $('#open-comment-'+post_primary_key).before(make_comment(json));
        },

        error : function(xhr,errmsg,err) {
          // Show an error
          $('#results').html("<div class='alert-box alert radius' data-alert>"+
            "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
          console.log(xhr.status + ": " + xhr.responseText);
        }
      });
    }

    /* AJAX for posting */

    function create_post() {
      $.ajax({
        url : "create_post/",
        type : "POST",
        data : { the_post : $('#the_post').val() },
        success : function(json) {
          $('#the_post').val('');
          $("#talk").prepend(make_post(json));
          console.log("success");
        },
        error : function(xhr,errmsg,err) {
          // Show an error
          $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
            " <a href='#' class='close'>&times;</a></div>");
          console.log(xhr.status + ": " + xhr.responseText);
        }
      });
    };

    // ugly. use angular.
    function make_post(json){
        var html = "<div class='panel radius' id='post-"+json.postpk+"'><p>"+json.text+"<br> \
        <em style='font-size:.7em;'>— "+json.author+" on "+json.created+"</em></p><a id='open-comment-"+json.postpk+"'>Comment</a>&nbsp;&middot;&nbsp;<a id='delete-post-"+json.postpk+"'>Delete</a> \
        <form onsubmit='return false;' style='display:none;' id='comment-box-"+json.postpk+"'> \
        <input type='text' id='comment-for-"+json.postpk+"' /> \
        <input type='submit' id='comment-submit-"+json.postpk+"' class='tiny button' /></form> \
        </div>";

        return html;
    };

    // ugly. use angular.
    function make_comment(json){
        var html = "<p class='white' id='comment-" + json.pk + "'>"+json.text+"<br><em style='font-size:.7em;'>— "+json.author+" on "+json.created+"</em></p>";

        return html;
    };

    //This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});