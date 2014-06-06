from django.conf.urls import patterns, include, url
from talk import views

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('', 
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('talk.urls')),
)