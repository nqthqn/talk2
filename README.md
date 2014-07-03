# talk

A small AJAX-powered Django app for implementing a super simple communication wall for posting and commenting.

## URLs

1. Main - http://localhost:8000/

## Setup

1. Clone. Activate virtualenv. Install requirements. Syncdb. Run server.

# todo

- [ ] Add Unit Tests [michael]
- [ ] Move user management to separate app [michael]
    - Add `is_moderator` flag for Users to give them power to delete anybodies comment
- [ ] Limit number of posts shown per page; instead add on a load more button. [alec]
- [ ] Hide comments when |comments| > 4. Add 'Show n comments' button. [alec]
- [x] Allow users to edit/delete there own comments & posts [trent]
- [x] Add HTML5 form validation (no empty comments or posts) [michael]


# wishes
- [ ] Rewrite in Angular to simplify all that messy jQuery [michael]
- [ ] Rainbow barfing unicorns

