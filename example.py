# coding:utf-8

html_tpl = '''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style type="text/css">
    .nav{
      margin: 10px 0;
      font-size: 12px;
      font-family: "Helvetica", "Arial", sans-serif;
    }
    .nav a{
      text-decoration: none;
      color: #000;
    }
    .nav span{
      color: #999;
    }
    .nav .item{
      display: inline-block;
      padding: 3px 8px;
      margin: 0 3px;
    }
    .nav a.number:hover{
      background: #99dddd;
      color: #ffffff;
    }
    .nav span.current{
      background: #9cc;
      color: #fff;
    }
    .nav a.prev:hover, .nav a.next:hover{
      color: #9cc;
    }
    h2{
      margin-top: 2em;
    }
  </style>
</head>
<body>
<h2>基本</h2>
<div class="nav">{{html_1_1}}</div>
<div class="nav">{{html_1_2}}</div>
<div class="nav">{{html_1_3}}</div>
<div class="nav">{{html_1_4}}</div>
<div class="nav">{{html_1_5}}</div>
<div class="nav">{{html_1_6}}</div>
<h2>设置</h2>
<div class="nav">{{html_2_1}}</div>
<h2>自定义Helper</h2>
<div class="nav">{{html_3_1}}</div>
</body>
</html>

'''

from pagenavigator import PageNavigator

def string_replace(string, **data):
    for key in data:
        string = string.replace('{{' + key + '}}', str(data[key]))
    return string

nav_1 = PageNavigator()
html_1_1 = nav_1.create(1, 5)
html_1_2 = nav_1.create(2, 5)
html_1_3 = nav_1.create(5, 5)
html_1_4 = nav_1.create(1, 6)
html_1_5 = nav_1.create(5, 6)
html_1_6 = nav_1.create(5, 10)

nav_2 = PageNavigator(link_helper='list.html?page={{page}}&from={{current}}&max={{max}}',
                    prev_text='←', next_text='→', more_text='……', size=9)
html_2_1 = nav_2.create(10, 20)

nav_3 = PageNavigator(number_helper='<button href="{{link}}" class="item number" data-page="{{page}}">{{page}}</button>',
                      current_helper='<button class="item number current" data-page="{{page}}" disabled="disabled">{{page}}</button>')
html_3_1 = nav_3.create(10, 20)

html = string_replace(html_tpl, html_1_1=html_1_1, html_1_2=html_1_2, html_1_3=html_1_3,
                      html_1_4=html_1_4, html_1_5=html_1_5, html_1_6=html_1_6,
                      html_2_1=html_2_1,
                      html_3_1=html_3_1
                      )

file_object = open('python_example.html', 'w')
file_object.write(html)
file_object.close( )
