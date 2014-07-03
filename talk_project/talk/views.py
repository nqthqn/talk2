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

def create_post(request):

    post_text = request.POST.get('the_post')
    response_data = {}

    post = Post(text=post_text, author=request.user)
    post.save()

    print request.POST.get('csrfmiddlewaretoken')

    response_data['result'] = 'Create post successful!'
    response_data['postpk'] = post.pk
    response_data['text'] = post.text
    response_data['created'] = post.created.strftime('%B %d, %Y %I:%M %p') 
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

    response_data['result'] = 'Create comment successful!'
    response_data['commentpk'] = comment.pk
    response_data['text'] = comment.text
    response_data['created'] = comment.created.strftime('%B %d, %Y %I:%M %p') 
    response_data['author'] = comment.author.username


    return HttpResponse(json.dumps(
        response_data),
        content_type="application/json"
    )

def delete_post(request):
    
    post = Post.objects.get(pk=int(request.POST.get('postpk')))

    post.delete()

    response_data = {}
    response_data['msg'] = 'Post was deleted.'

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json"
    )

def delete_comment(request):

    comment = Comment.objects.get(pk=int(request.POST.get('commentpk')))

    comment.delete()

    response_data = {}
    response_data['msg'] = 'Comment was deleted.'

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json"
    )


def edit_post(request):
    edited_post = request.POST.get('edited_post')
    the_post = Post.objects.get(pk=int(request.POST.get('postpk'))) 

    if request.user != the_post.author:
        return HttpResponse(status=403)
    the_post.text = edited_post
    the_post.save()

    response_data = {}
    response_data['msg'] = 'Post was edited.'

    return HttpResponse(json.dumps(
        response_data),
        content_type="application/json"
    )

def edit_comment(request):

    edited_comment = request.POST.get('edited_comment')
    the_comment = Comment.objects.get(pk=int(request.POST.get('commentpk'))) 

    the_comment.text = edited_comment
    the_comment.save()

    print edited_comment, the_comment, the_comment.text

    response_data = {}
    response_data['msg'] = 'Comment was edited.'

    return HttpResponse(json.dumps(
        response_data),
        content_type="application/json"
    )
