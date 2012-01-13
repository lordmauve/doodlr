from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'doodlr.scribbles.views.home', name='home'),
    url(r'^draw$', 'doodlr.scribbles.views.draw', name='draw'),
    url(r'^(\d+)/$', 'doodlr.scribbles.views.scribble', name='scribble'),
    url(r'^(\d+)/json$', 'doodlr.scribbles.views.scribble_json', name='scribble_json'),
    url(r'^(\d+)/blips$', 'doodlr.scribbles.views.blips', name='blips'),
    # url(r'^doodlr/', include('doodlr.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += staticfiles_urlpatterns()
