# Talk urls
from django.conf.urls import patterns, include, url
from talk import views

urlpatterns = patterns('talk.views', 
    url(r'^$', 'home'), 
    url(r'^create_post/$', 'create_post'),
    url(r'^create_comment/$', 'create_comment'),
)
