import datetime
from django.db import models
from django.contrib.auth.models import User


class ScribbleManager(models.Manager):
    def currently_scribbling(self):
        """Return all scribbles that have been updated in the last minute"""
        now = datetime.datetime.now()
        recent = now - datetime.timedelta(seconds=60)
        return self.filter(image__isnull=False, updated__gt=recent)


class Scribble(models.Model):
    user = models.ForeignKey(User)
    image = models.TextField(null=True, default=None)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    ratings = models.IntegerField(default=0)
    rating_total = models.IntegerField(default=0)
    rating = models.FloatField(null=True)

    objects = ScribbleManager()

    def rate(self, score):
        self.ratings += 1
        self.rating_total += score
        self.rating = self.rating_total / float(self.ratings)

    @models.permalink
    def get_absolute_url(self):
        return 'scribble', (self.id,), {}


class Blip(models.Model):
    scribble = models.ForeignKey(Scribble)
    user = models.ForeignKey(User)
    date = models.DateTimeField(auto_now_add=True, db_index=True)
    text = models.TextField()

    class Meta:
        ordering = '-id',
