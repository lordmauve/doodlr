import re
import datetime
import json
from .models import Scribble, Blip

from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, get_object_or_404


class JsonResponse(HttpResponse):
    def __init__(self, j):
        super(JsonResponse, self).__init__(json.dumps(j), mimetype='application/json')


def home(request):
    scribbles = Scribble.objects.currently_scribbling()
    return render(request, 'home.html', locals())


def draw(request):
    scribble = Scribble.objects.create(user=request.user) 
    return render(request, 'draw.html', locals())


def scribble(request, id):
    scribble = get_object_or_404(Scribble, id=id)
    if request.method == 'POST':
        if scribble.user != request.user:
            return HttpResponseForbidden('Forbidden')
        image = request.POST.get('image', None)
        if image:
            scribble.image = image
            scribble.save()
            return HttpResponse('OK')

    blips = scribble.blip_set.all()
    return render(request, 'scribble.html', locals())


def scribble_json(request, id):
    scribble = get_object_or_404(Scribble, id=id)

    updated = str(scribble.updated)
    if request.GET.get('if_updated_since') == updated:
        return JsonResponse(False)

    d = {
        'image': scribble.image,
        'last_updated': str(scribble.updated)
    }
    return JsonResponse(d)


def blips(request, id):
    scribble = get_object_or_404(Scribble, id=id)

    if request.method == 'POST':
        text = request.POST.get('blip', None)
        if text:
            Blip.objects.create(
                user=request.user,
                scribble=scribble,
                text=text
            )

    try:
        since = request.GET.get('since', None)
        if since:
            since = int(since)
    except:
        since = None
    blips = scribble.blip_set.all()
    if since:
        blips = blips.filter(id__gt=since)
    return render(request, 'blipslist.html', locals())
