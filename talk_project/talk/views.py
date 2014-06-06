from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from django.template import Context, loader, RequestContext

from talk.models import Post, Comment

import json

# load load all posts
def home(request):
    
    # grab posts, order by date
    latest_posts = Post.objects.order_by('created').reverse()

    t = loader.get_template('talk/index.html')
    c = Context({'latest_posts': latest_posts,})
    return HttpResponse(t.render(c))

def create_post(request):
    post_text = request.POST.get('the_post')
    response_data = {}

    try:
        post = Post(text = post_text, author = request.user)
        post.save()
        response_data['result'] = 'Success!'
        response_data['message'] = post_text
    except:
        response_data['result'] = 'Uh oh!'
        response_data['message'] = 'We could process your request at this time.'

    return HttpResponse(json.dumps(response_data), content_type="application/json")

# sanity check
def test_ajax(request):
    if request.POST:
        return HttpResponse(json.dumps({'message' : 'awesome'}, mimetype='application/javascript', context_instance=RequestContext(request)))
    else:
        return HttpResponse(json.dumps(
            {'message' : 'awesome'},
            ensure_ascii=False), 
            mimetype='application/javascript'
        )
