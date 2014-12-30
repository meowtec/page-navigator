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
<?php
require_once('pagenavigator.php');
$nav1 = new PageNavigator();
$nav2 = new PageNavigator(array(
  'linkHelper'=>'list.html?page={{page}}&from={{current}}&max={{max}}',
  'prevText'=>'←',
  'nextText'=>'→',
  'moreText'=>'……',
  'size'=>9
));
$nav3 = new PageNavigator(array(
  'numberHelper'=>'<button href="{{link}}" class="item number" data-page="{{page}}">{{page}}</button>',
  'currentHelper'=>'<button class="item number current" data-page="{{page}}" disabled="disabled">{{page}}</button>'
));
?>
<div class="nav"><?php echo $nav1->create(1, 5);?></div>
<div class="nav"><?php echo $nav1->create(2, 5);?></div>
<div class="nav"><?php echo $nav1->create(5, 5);?></div>
<div class="nav"><?php echo $nav1->create(1, 6);?></div>
<div class="nav"><?php echo $nav1->create(5, 6);?></div>
<div class="nav"><?php echo $nav1->create(5, 10);?></div>
<h2>设置</h2>
<div class="nav"><?php echo $nav2->create(10, 20);?></div>
<h2>自定义 helper</h2>
<div class="nav"><?php echo $nav3->create(10, 20);?></div>
</body>
</html>
