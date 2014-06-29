from django.shortcuts import render
from django.http import HttpResponse

from talk.models import Post, Comment

import json


def home(req):

    tmpl_vars = {
        'all_posts': Post.objects.reverse(),
    }

    return render(req, 'talk/index.html', tmpl_vars)

# TODO: limit number of comments shown per page.
# Instead add on a load more button
# def load_more(request):

    # Need JSON, not python objects
    # response_data['posts'] = Post.objects.reverse()

    # return HttpResponse(json.dumps(response_data),
        # content_type="application/json")

# still only appears after adding a comment or post, not for the correct users
def delete_item(request):
    if (request.POST.get('item_type') == 'post'):
        item = Post.objects.get(pk=int(request.POST.get('pk')))
    if (request.POST.get('item_type') == 'comment'):
        item = Comment.objects.get(pk=int(request.POST.get('pk')))

    item.delete();

    response_data = {}
    response_data['result'] = 'Success!'
    response_data['pk'] = request.POST.get('pk')

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json"
        )

def create_post(request):

    post_text = request.POST.get('the_post')
    response_data = {}

    post = Post(text=post_text, author=request.user)
    post.save()

    response_data['result'] = 'Success!'
    response_data['postpk'] = post.pk
    response_data['text'] = post.text
    response_data['created'] = post.created.strftime('%m/%d %H:%M')
    response_data['author'] = post.author.username

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json"
    )


def create_comment(request):

    the_comment = request.POST.get('the_comment')
    its_post = Post.objects.get(pk=int(request.POST.get('postpk')))

    response_data = {}

    comment = Comment(post=its_post, text=the_comment, author=request.user)
    comment.save()

    # Tell the frontend what the backend just did
    response_data['result'] = 'Success!'
    response_data['pk'] = comment.pk
    response_data['text'] = comment.text
    response_data['created'] = comment.created.strftime('%m/%d %H:%M')
    response_data['author'] = comment.author.username

    response_data['hugs_and_kisses'] = True

    return HttpResponse(json.dumps(
        response_data),
        content_type="application/json"
    )
