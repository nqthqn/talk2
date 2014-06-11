# talk

A small AJAX-powered Django app for implementing a super simple communication wall for posting and commenting.

## URLs

1. Main - http://localhost:8000/

## Setup

1. Clone. Activate virtualenv. Install requirements. Syncdb. Run server.

## To do

1. Move user management to separate app
1. Add Unit Tests
1. Add Angular to simplify all that messy jQuery
1. Add the ability to delete comments and posts (Can anybody delete or remove anyone else's comments/posts? Or just admin? If so, what can individual users delete? Their own posts? Or just comments?)
1. Add HTML5 form validation (no empty comments or posts)
1. Add better documentation - docstrings, comments
1. Limit number of comments shown per page; instead add on a load more button. (is this just for comments? what about posts? why not hide all comments and have a button for showing comments?)