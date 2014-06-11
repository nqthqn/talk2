from django.shortcuts import render
from django.http import HttpResponse

from talk.models import Post, Comment

import json


def home(req):
    
    # Clean up... TODO: Do not allow empty comments or posts
    for p in Post.objects.all():
        if p.text == '':
            p.delete()
    for c in Comment.objects.all():
        if c.text == '':
            c.delete()

    tmpl_vars = {
        'all_posts':Post.objects.reverse(),
    }

    return render(req, 'talk/index.html', tmpl_vars)

# TODO: delete post

# TODO: limit number of comments shown per page. Instead add on a load more button
def load_more(request):

    response_data['posts'] = Post.objects.reverse() # Need JSON, not python objects

    return HttpResponse(json.dumps(response_data), content_type="application/json")



def create_post(request):

    post_text = request.POST.get('the_post')
    response_data = {}
    
    post = Post(text = post_text, author = request.user)
    post.save()
    
    response_data['result'] = 'Success!'
    response_data['postpk'] = post.pk
    response_data['text'] = post.text
    response_data['created'] = post.created.strftime('%m/%d %H:%M')
    response_data['author'] = post.author.username

    return HttpResponse(json.dumps(response_data), content_type="application/json")

# TODO: delete comment

def create_comment(request):

    the_comment = request.POST.get('the_comment')
    its_post = Post.objects.get(pk=int(request.POST.get('postpk')))

    response_data = {}

    comment = Comment(post = its_post, text = the_comment, author = request.user)
    comment.save()

    # Tell the frontend what the backend just did
    response_data['result'] = 'Success!'
    response_data['text'] = comment.text
    response_data['created'] = comment.created.strftime('%m/%d %H:%M')
    response_data['author'] = comment.author.username

    response_data['hugs_and_kisses'] = True


    return HttpResponse(json.dumps(response_data), content_type="application/json")
