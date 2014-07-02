# Talk urls
from django.conf.urls import patterns, url


urlpatterns = patterns(
    'talk.views',
    url(r'^$', 'home'),
    url(r'^create_post/$', 'create_post'),
    url(r'^create_comment/$', 'create_comment'),
    url(r'^delete_post/$', 'delete_post'),
    url(r'^delete_comment/$', 'delete_comment'),
    url(r'^edit_post/$', 'edit_post'),
    url(r'^edit_comment/$', 'edit_comment'),
)
