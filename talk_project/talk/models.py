from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    author = models.ForeignKey(User)
    text = models.TextField()

    # Time is a rhinocerous
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.text+' - '+self.author.username

class Comment(models.Model):
    author = models.ForeignKey(User)
    post = models.ForeignKey(Post)
    text = models.TextField()

    # Time is relative
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.text+' - '+self.author.username