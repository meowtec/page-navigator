page-navigator
==============

#### 查看例子
```
git clone git@github.com:meowtec/page-navigator.git
cd page-navigator
open example.html
```

#### 使用
```
var nav = new PageNavigator()
var html = nav.create(1, 5)
```

##### create(currentPage, maxPage)
 - currentPage: 当前页
 - maxPage: 总页数

@return:String 导航 html 字符串

#### 设置
PageNavigator 在初始化时可以传入一个设置参数，类型为 Object:
```
var nav2 = new PageNavigator({
  linkHelper: function(page){
    return 'list.html?page=' + page
  },
  prevText: '<- 前',
  nextText: '后 ->',
  moreText: '......'
})
```
