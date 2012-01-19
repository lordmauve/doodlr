import re
import datetime
import json

from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, get_object_or_404

from .models import Scribble, Blip
from .forms import RatingForm


class JsonResponse(HttpResponse):
    def __init__(self, j, **kwargs):
        super(JsonResponse, self).__init__(json.dumps(j), mimetype='application/json', **kwargs)


def home(request):
    currently_scribbling = Scribble.objects.currently_scribbling()
    latest_scribbles = Scribble.objects.latest_scribbles()
    highest_rated = Scribble.objects.highest_rated()
    return render(request, 'home.html', locals())


def current(request):
    scribbles = Scribble.objects.currently_scribbling()
    return render(request, 'scribbles-list.html', locals())


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
            scribble.updated = datetime.datetime.now()
            scribble.save()
            return HttpResponse('OK')

    blips = scribble.blip_set.all()
    return render(request, 'scribble.html', locals())


def rate(request, id):
    scribble = get_object_or_404(Scribble, id=id)

    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    if scribble.user == request.user:
        return HttpResponseForbidden('You may not rate your own doodles.')

    form = RatingForm(request.POST)
    if form.is_valid():
        rating = form.cleaned_data['rating']
        scribble.rate(rating)
        scribble.save()
        return HttpResponse("Thank you for rating!")
    else:
        return JsonResponse(dict(form._errors), status=400)


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
