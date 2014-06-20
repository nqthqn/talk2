AJAX with Django
------------------------

What the AJAJ?!   [aka intro]
----------------------

AJAJ (Asynchronous JavaScript and JSON) allows clients and servers to talk in the background. It is commonly called AJAX with the X standing for XML. In many cases JavaScript Object Notation (JSON) is used instead of XML for encapsulating data and passing it around. 

Here is a simple diagram illustrating how this happens in a Django application.

        _____________
       / Browser  UI \
      |  ^v^v^v^v^v^  | (UI updates, no browser refresh)
       \____AJAJ_____/
            |  ^
            |  |        (http)
            v  |
         Django View

Who even gives? [absurdity / why else would you want use ajax]
-----

Imagine a big checkerboard... [ or something that makes everything crystal clear ]

[checker board]

[to add: checkboard]

segway to adding with dynamic URLs (crazy!!)

Let's do it in AJAJ
------------------------

Using the jQuery library makes this easy as pie and fun as roller coaster rides. Let's take a look at what we will be building today.

Go [check out](https://github.com/broinjc/talk) the talk repo.

Let's build it!
---------------

boilerplate for ajax adding (dajax)

This tutorial assumes you've got a django application set up with an empty app. You could also write some kind of endpoint or view function for ajax to POST in the background to.

Before we begin, open `urls.py` and `views.py`

  - Add this URL with named parameters for adding numbers the silly way

           url(r'^add/<num1>/<num2>$', 'add'),
  
  -   - A `home` view that points to the template where everything will happen

          def home(req):
               tmpl_vars = {}
            return render(req, 'ajaj/index.html', tmpl_vars)
  
  - Create `ajaj/index.html` in your templates dir

1. Open `index.html`.
1. Make a little HTML form

            <form id="addition_form" onsubmit='add();' >
                {% csrf_token %}
                <input type="number" id="num1" required/>
                <input type="number" id="num2" required/>
                <input type='submit' id='add' class="tiny button" />
            </form>
[results spot with ID]
[not normally you would do  $('#addition_form').on('submit', function(){ ]
1. Write javascript that will communicate with a view.

            function add() {
              $.ajax({
                url : "add/", // This url should point to our view
                type : "POST", // this is our HTTP method
                data : { num1 : $('#num1').val(), num2 : $('#num2').val() }, 
                success : function(json) {
                      // what will we do with the JSON
                },
                error : function(xhr,errmsg,err) {
                  // Log all errors to the console
                  console.log(xhr.status + ": " + xhr.responseText);
                }
              });
            };

2. Write this JSON view that returns the sum of the 2 numbers

    from django.http import HttpResponse, HttpResponseRedirect
    import json # muy importante
    def add(request):
        response_data = {}
        if request.method == 'POST':
            
            try:
                result = float(request.POST.get('num1')) + float(request.POST.get('num2'))
                response_data['result'] = result
            except ValueError as (errno,strerror):
                response_data['result'] = 'Was that even a number?'
                response_data['error'] = '{0} - {1}'.format(errno, strerror)

            return HttpResponse(
                    json.dumps(response_data),
                    content_type="application/json"
                )
        else:
            # Hit the road, Jack!
            return HttpResponseRedirect('/')

Cookies are delicious!
----------------------

Allow me to digress and mention Cross-Site Request Forgeries. CSRF happens when an attaker steals a victims cookies using another website a victim might have open in their browser. Django defends against this by using CSRF tokens in forms. Since we are handling data asynchronously we will need to handle CSRF issues with javascript. You can read more about this on the [Coding Horror](http://blog.codinghorror.com/preventing-csrf-and-xsrf-attacks/) blog. They've got a great article.

All that being said, you need some javascript that will watch your back. Check out this [gist](https://gist.github.com/broinjc/db6e0ac214c355c887e5)

Happy coding!
