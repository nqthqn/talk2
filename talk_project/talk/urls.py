# Talk urls
from django.conf.urls import patterns, url


urlpatterns = patterns(
    'talk.views',
    url(r'^$', 'home'),
    url(r'^create_post/$', 'create_post'),
    url(r'^create_comment/$', 'create_comment'),
)
