$("#talk").on('click', 'a[id^=open-comment-]', function(){
    var p = $(this).attr('id').split('-')[2];  // terrible variable name! i have no idea what p is. or pp.
    $('#comment-box-'+p).show();
    $('#open-comment-'+p).hide();
    $('#comment-for-'+p).focus();
});

$("#talk").on('click', 'input[id^=comment-submit-]', function(){
    var p = $(this).attr('id').split('-')[2];
    create_comment(p);
});

$('#post-form').on('submit', function(){
    console.log("form submitted!")  // sanity check
    create_post();
});

/* For commenting */
function create_comment(pp){
  $.ajax({
    url : "create_comment/",
    type : "POST",
    data : { the_comment : $('#comment-for-'+pp).val(), postpk : pp},
    success : function(json) {

      // Hide the comment box, show the comment button and append the comment.
      $('#comment-box-'+pp).hide();
      $('#comment-for-'+pp).val('');
      $('#open-comment-'+pp).show();
      $('#open-comment-'+pp).before(make_comment(json));
    },
    error : function(xhr,errmsg,err) {
      // Show an error
      $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
      console.log(xhr.status + ": " + xhr.responseText);
    }
  });
};

/* For posting */
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
      $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+" <a href='#' class='close'>&times;</a></div>");
      console.log(xhr.status + ": " + xhr.responseText);
    }
  });
};

// ugly. use angular.
function make_post(json){
    var html = "<div class='panel radius' id='post-"+json.postpk+"'><p>"+json.text+"<br> \
    <em style='font-size:.7em;'>— "+json.author+" on "+json.created+"</em></p><a id='open-comment-"+json.postpk+"'>Comment</a> \
    <form onsubmit='return false;' style='display:none;' id='comment-box-"+json.postpk+"'> \
    <input type='text' id='comment-for-"+json.postpk+"' /> \
    <input type='submit' id='comment-submit-"+json.postpk+"' class='tiny button' /></form></div>";

    return html;
};

function make_comment(json){
    var html = "<p class='white'>"+json.text+"<br><em style='font-size:.7em;'>— "+json.author+" on "+json.created+"</em></p>";

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