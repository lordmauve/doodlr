import random
from django.contrib.auth.models import User
from django.contrib.auth import login


class UsersMiddleware(object):
    """Ensures every session is associated with a user account."""
    def process_request(self, request):
        if not request.user.is_authenticated():
            user = User()
            user.username = 'anonymous-%d' % random.randint(0, 2e9)
            user.save()
            user.backend = 'django.contrib.auth.backends.ModelBackend' # lies!
            login(request, user)

