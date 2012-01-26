import datetime
from django.db import models
from django.contrib.auth.models import User
from django.db.models import signals


class ScribbleManager(models.Manager):
    def currently_scribbling(self):
        """Return all scribbles that have been updated in the last minute"""
        now = datetime.datetime.now()
        recent = now - datetime.timedelta(seconds=60)
        return self.filter(image__isnull=False, updated__gt=recent).order_by('-created')

    def latest_scribbles(self, num=6):
        """The latest num scribbles that are not currently scribbling."""
        now = datetime.datetime.now()
        recent = now - datetime.timedelta(seconds=60)
        return self.filter(image__isnull=False, updated__lte=recent).order_by('-updated')[:num]

    def highest_rated(self, num=6):
        """The highest rated num scribbles."""
        return self.filter(rating__isnull=False, ratings__gt=0).order_by('-rating')[:num]


class Scribble(models.Model):
    user = models.ForeignKey(User)
    image = models.TextField(null=True, default=None)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(default=datetime.datetime.now)

    ratings = models.IntegerField(default=0)
    rating_total = models.IntegerField(default=0)
    rating = models.FloatField(null=True)

    objects = ScribbleManager()

    def rate(self, score):
        self.ratings += 1
        self.rating_total += score
        update_rating(Scribble, self)

    @models.permalink
    def get_absolute_url(self):
        return 'scribble', (self.id,), {}

    def others_by_this_artist(self, num=6):
        return self.user.scribble_set.filter(image__isnull=False).exclude(id=self.id).order_by('?')[:num]


def update_rating(sender, instance, **kwargs):
    """Update a Scribble's rating.

    Doing this as a pre_save handle prevents the database falling into an
    inconsistent state if code updates the rating fields.
    """
    if instance.ratings:
        instance.rating = instance.rating_total / float(instance.ratings)
    else:
        instance.rating = None
    
signals.pre_save.connect(update_rating, sender=Scribble)


class Blip(models.Model):
    scribble = models.ForeignKey(Scribble)
    user = models.ForeignKey(User)
    date = models.DateTimeField(auto_now_add=True, db_index=True)
    text = models.TextField()

    class Meta:
        ordering = '-id',
