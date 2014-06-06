from django.shortcuts import render
from django.http import HttpResponse
from django.utils import simplejson
from .models import Post, Comment


# Create your views here.
def home(req):
    
    tmpl_vars = {
        'all_posts':Post.objects.order_by('created').reverse(),
    }

    return render(req, 'talk/index.html', tmpl_vars)

# TODO: create/delete post

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

    return HttpResponse(simplejson.dumps(response_data), content_type="application/json")

# TODO: create/delete comment