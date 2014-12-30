page-navigator
==============

#### 查看例子
```
git clone git@github.com:meowtec/page-navigator.git
cd page-navigator
open example.html
```

#### 使用
##### 初始化
```
var nav = new PageNavigator()

```
##### 生成导航
```
var html = nav.create(currentPage, maxPage) // html 字符串
```
 - currentPage: 当前页, number
 - maxPage: 总页数, number

@return: 导航 html 字符串

#### 设置
`PageNavigator(setting)` 在初始化时可以传入一个设置参数`setting`，类型为 Object:
```
var nav2 = new PageNavigator({
  linkHelper: 'list.html?page={{page}}&from={{current}}&max={{max}}',
  prevText: '←',
  nextText: '→',
  moreText: '……',
  size: 9,
})
```

#### 自定义 helper
默认的导航以`<span>`和`<a>`标签组成，假设我们要将显示数字的节点换成`<button>`标签，在 setting 中添加`numberHelper`和`currentHelper`:
```
var nav3 = new PageNavigator({
  numberHelper: '<button href="{{link}}" class="item number" data-page="{{page}}">{{page}}</button>',
  currentHelper: '<button class="item number current" data-page="{{page}}" disabled="disabled">{{page}}</button>'
})
```
可定义的 helper 列表请查看源代码。
