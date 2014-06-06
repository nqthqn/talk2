from django.conf.urls import patterns, include, url
from talk import views

urlpatterns = patterns('talk.views',
    url(r'^$', views.home, name='home'),
    url(r'^create_post/$', views.create_post, name='create_post'),
    url(r'^test_ajax/$', views.test_ajax, name='test_ajax'),
)