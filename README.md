# talk

A small AJAX-powered Django app for implementing a super simple communication wall for posting and commenting.

## URLs

1. Main - http://localhost:8000/

## Setup

1. Clone. Activate virtualenv. Install requirements. Syncdb. Run server.

## To do

<<<<<<< HEAD
1. Add Unit Tests [michael]
1. Allow users to edit/delete there own comments & posts [trent]
1. Move user management to separate app (UserProfile model OneToOne with User) [trent]
    - Add `is_moderator` flag for Users to give them power to delete anybodies comment [trent]
1. Add HTML5 form validation (no empty comments or posts) [michael]
1. Add better documentation - docstrings, comments [michael]
1. Limit number of posts shown per page; instead add on a load more button. [nathan]
1. Hide comments when |comments| > 4. Add 'Show n comments' button. [michael]


## Wish list
1. Add Angular to simplify all that messy jQuery [me watch you program]
2. unicorns
=======
1. Move user management to separate app
    - Add `is_moderator` flag for Users to give them power to delete anybodies comment
1. Add Unit Tests
1. Allow users to edit/delete there own comments & posts
1. Add Angular to simplify all that messy jQuery
1. Add HTML5 form validation (no empty comments or posts)
1. Add better documentation - docstrings, comments
1. Limit number of posts shown per page; instead add on a load more button.
1. Hide comments when |comments| > 4. Add 'Show n comments' button.

edit from trent
>>>>>>> pr/7
