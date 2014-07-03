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

    // Submit post on submit
    $('#post-form').on('submit', function(){
        console.log("form submitted!")  // sanity check
        create_post();
    });

    // Delete post on click
    $("#talk").on('click', 'a[id^=delete-post-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[2];
        delete_post(post_primary_key);
    });

    // Delete comment on click
    $("#talk").on('click', 'a[id^=delete-comment-]', function(){
        var comment_primary_key = $(this).attr('id').split('-')[2];
        delete_comment(comment_primary_key);
    });

    // Edit post on click
    $("#talk").on('click', 'a[id^=open-edit-post-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[3];
        var old_post = $('#post-'+post_primary_key+' .ptxt').text();
        $('#post-'+post_primary_key+' .ptxt').hide();
        $('#post-'+post_primary_key+' .pfooter').hide();
        $('#open-comment-'+post_primary_key).hide();
        $('#edit-post-box-'+post_primary_key).show();
        $('#edited_post-'+post_primary_key).val(old_post);
        $('#edited_post-'+post_primary_key).focus();
    });

    // Submit edited post on click
    $("#talk").on('click', 'input[id^=edit-post-submit-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[3];
        var updated_text = $('#edited_post-'+post_primary_key).val();
        if ($('#edit-post-for-'+post_primary_key).val() !== "") {
            edit_post(post_primary_key);
            $('#post-'+post_primary_key+' .ptxt').text(updated_text);
            $('#post-'+post_primary_key+' .ptxt').show();
            $('#post-'+post_primary_key+' .pfooter').show();
            $('#open-comment-'+post_primary_key).show();
        }
    });

    /* Edit comment on click */

    $("#talk").on('click', 'a[id^=open-edit-comment-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[3];
        var old_comment = $('#comment-'+post_primary_key+' .ctxt').text();
        $('#comment-'+post_primary_key+' .ctxt').hide();
        $('#comment-'+post_primary_key+' .cfooter').hide();
        $('#open-comment-'+post_primary_key).hide();
        $('#edit-comment-box-'+post_primary_key).show();
        $('#edited_comment-'+post_primary_key).val(old_comment);
        $('#edited_comment-'+post_primary_key).focus();
    });

    // Submit edited comment on click
    $("#talk").on('click', 'input[id^=edit-comment-submit-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[3];
        var updated_text = $('#edited_comment-'+post_primary_key).val();
        if ($('#edit-comment-for-'+post_primary_key).val() !== "") {
            edit_comment(post_primary_key);
            $('#comment-'+post_primary_key+' .ctxt').text(updated_text);
            $('#comment-'+post_primary_key+' .ctxt').show();
            $('#comment-'+post_primary_key+' .cfooter').show();
            $('#open-comment-'+post_primary_key).show();
        }
    });    

    /* AJAX for commenting */

    function create_comment(post_primary_key){
      $.ajax({
        url : "create_comment/",
        type : "POST",
        data : { the_comment : $('#comment-for-'+post_primary_key).val(), postpk : post_primary_key },
        success : function(json) {
          // Hide the comment box, show the comment button and append the comment.
          $('#comment-box-'+post_primary_key).hide();
          $('#comment-for-'+post_primary_key).val('');
          $('#open-comment-'+post_primary_key).show();
          $('#delete-post-'+post_primary_key).show();
          $('#open-edit-post-'+post_primary_key).show();
          $('#open-comment-'+post_primary_key).before(make_comment(json));
        },

        error : function(xhr,errmsg,err) {
          // Show an error
          $('#results').html("<div class='alert-box alert radius' data-alert>"+
            "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
          console.log(xhr.status + ": " + xhr.responseText);
        }
      });
    };

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

    /* AJAX for removing comments & posts */

    function delete_comment(comment_primary_key) {
        if (confirm('are you sure you want to remove this comment?')==true){
          $.ajax({
            url : "delete_comment/",
            type : "POST",
            data : { commentpk : comment_primary_key },
            success : function(json) {
              $('#comment-'+comment_primary_key).hide();
              console.log("comment deletion successful");
            },

            error : function(xhr,errmsg,err) {
              // Show an error
              $('#results').html("<div class='alert-box alert radius' data-alert>"+
                "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
              console.log(xhr.status + ": " + xhr.responseText);
            }
          });
        }
        else {
            return false;
        }
      };

    function delete_post(post_primary_key){
        if (confirm('are you sure you want to remove this post?')==true){
          $.ajax({
            url : "delete_post/",
            type : "POST",
            data : { postpk : post_primary_key },
            success : function(json) {
                // hide the post
              $('#post-'+post_primary_key).hide();
              console.log("post deletion successful");
            },

            error : function(xhr,errmsg,err) {
              // Show an error
              $('#results').html("<div class='alert-box alert radius' data-alert>"+
                "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
              console.log(xhr.status + ": " + xhr.responseText);
            }
          });
        }
        else {
            return false;
        }
    };

    // AJAX for editing comments & posts    

    function edit_post(post_primary_key){
        $.ajax({
            url : "edit_post/",
            type : "POST",
            data : $('#edit-post-box-'+post_primary_key).serializeArray(), 
            success : function(json) {
              $('#edit-post-box-'+post_primary_key).hide();
              console.log(json);
            },

            error : function(xhr,errmsg,err) {
              // Show an error
              $('#results').html("<div class='alert-box alert radius' data-alert>"+
                "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
              console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }

    function edit_comment(post_primary_key){
        $.ajax({
            url : "edit_comment/",
            type : "POST",
            data : $('#edit-comment-box-'+post_primary_key).serializeArray(), 
            success : function(json) {
              $('#edit-comment-box-'+post_primary_key).hide();
              console.log(json);
            },

            error : function(xhr,errmsg,err) {
              // Show an error
              $('#results').html("<div class='alert-box alert radius' data-alert>"+
                "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
              console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
 
    function make_post(json){
        var html = "<div class='panel radius' id='post-"+json.postpk+"'><p> \
        <p class='ptxt'>"+json.text+"</p></br> \
        <p class='pfooter' style='text-align:right;'> \
        <em style='font-size:.7em;'>— "+json.author+" on "+json.created+" \
        &nbsp;&middot;&nbsp;<a id='open-edit-post-"+json.postpk+"'>Edit</a> \
        &nbsp;&middot;&nbsp;<a id='delete-post-"+json.postpk+"'>Delete</a></em></p> \
        \
        <form onsubmit='return false;' style='display:none;' id='comment-box-"+json.postpk+"'> \
        <input type='text' id='comment-for-"+json.postpk+"' /> \
        <input type='submit' value='Add a Comment' id='comment-submit-"+json.postpk+"' class='commentcenter tiny button' /></form> \
        \
        <form onsubmit='return false;' style='display:none;' id='edit-post-box-"+json.postpk+"'> \
        <div class='row'><div class='large-12 columns'> \
        <input type='hidden' name='postpk' value='"+json.postpk+"' /> \
        <textarea name='edited_post' id='edited_post-"+json.postpk+"'></textarea> \
        <input type='submit' value='Update Post' id='edit-post-submit-"+json.postpk+"' class='commentcenter tiny button' /></div></div></form> \
        \
        <a class='commentcenter' id='open-comment-"+json.postpk+"'>Add a Comment</a></p></div>";

        return html;
    };

    function make_comment(json){
        var html = "<div class='comment' id='comment-"+json.commentpk+"'> \
        <p class='ctxt'>"+json.text+"</p></br> \
        <p class='cfooter'><em style='font-size:.7em;'>— "+json.author+" on "+json.created+" \
        &nbsp;&middot;&nbsp;<a id='open-edit-comment-"+json.commentpk+"'>Edit</a> \
        &nbsp;&middot;&nbsp;<a id='delete-comment-"+json.commentpk+"'>Delete</a></em></p> \
        \
        <form onsubmit='return false;' style='display:none;' id='edit-comment-box-"+json.commentpk+"'> \
        <div class='row'><div class='large-12 columns'> \
        <input type='hidden' name='commentpk' value='"+json.commentpk+"' /> \
        <textarea name='edited_comment' id='edited_comment-"+json.commentpk+"'></textarea> \
        <input type='submit' value='Update Comment' id='edit-comment-submit-"+json.commentpk+"' class='commentcenter tiny button' /></div></div></form> \
        \
        </div>";

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