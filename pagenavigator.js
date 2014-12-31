;(function(){
  var pageAnalyse = function(current, max, size) {
    var prev,
      next,
      prevMore,
      nextMore,
      from,
      to
    prev = current > 1 ? current - 1 : null
    next = max > current ? current + 1 : null

    if (max <= size) {
      from = 1
      to = max
      prevMore = false
      nextMore = false
    } else {
      if (current <= Math.ceil(size / 2)) {
        from = 1
        to = size - 1
        prevMore = false
        nextMore = true
      } else if (max - current < Math.ceil(size / 2)) {
        to = max
        from = max - Math.ceil(size / 2) - 1
        prevMore = true
        nextMore = false
      } else {
        from = current - Math.ceil(size / 2) + 2
        to = current + Math.ceil(size / 2) - 2
        prevMore = true
        nextMore = true
      }
    }
    return {
      prev: prev,
      next: next,
      prevMore: prevMore,
      nextMore: nextMore,
      from: from,
      to: to
    }
  }

  var stringReplace = function(str, dict) {
    // 未对正则特殊字符进行处理，注意
    var value
    for(var key in dict){
      value = dict[key]
      if(value == null){
        value = ''
      }
      str = str.replace(new RegExp('{{'+key+'}}', 'g'), value)
    }
    return str
  }

  var cloneObject = function(){
    var obj = {}
    for(var i=0; i<arguments.length; i++){
      var _obj = arguments[i] || {}
      for(var key in _obj){
        obj[key] = _obj[key]
      }
    }
    return obj
  }

  var defaultSetting = {
    numberHelper:       '<a href="{{link}}" class="item number" data-page="{{page}}">{{page}}</a>', // page,link,current,max
    currentHelper:      '<span class="item number current" data-page="{{page}}">{{page}}</span>',   // page,link,current,max
    prevHelper:         '<a href="{{link}}" class="item prev" data-page="{{page}}">{{text}}</a>',   // page,link,current,max,text
    prevDisabledHelper: '<span class="item prev disabled">{{text}}</span>',                         // page=null,link,current,max,text
    nextHelper:         '<a href="{{link}}" class="item next" data-page="{{page}}">{{text}}</a>',   // page,link,current,max,text
    nextDisabledHelper: '<span class="item next disabled">{{text}}</span>',                         // page=null,link,current,max,text
    moreHelper:         '<span class="item more">{{text}}</span>',                                  // current, max, text
    linkHelper: 'javascript:void(0);',                                                              // page, current, max
    moreText:   '…',
    nextText:   '下一页',
    prevText:   '上一页',
    size: 7
  }


  var entitize = function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  var PageNavigator = (function() {
    function PageNavigator(setting) {
      var _setting = cloneObject(defaultSetting, setting)
      this._setting = _setting
      var _ = _setting
      _.prevMoreHelper = _.prevMoreHelper || _.moreHelper
      _.nextMoreHelper = _.nextMoreHelper || _.moreHelper
      _.prevMoreText = entitize(_.prevMoreText || _.moreText)
      _.nextMoreText = entitize(_.nextMoreText || _.moreText)

      // entitize
      _.nextText = entitize(_.nextText)
      _.prevText = entitize(_.prevText)
    }

    PageNavigator.prototype._link = function(page, current, max) {
      return stringReplace(this._setting.linkHelper, {
        page: page,
        current: current,
        max: max
      })
    }

    PageNavigator.prototype.create = function(current, max) {
      var setting = this._setting
      var analyseRst = pageAnalyse(current, max, setting.size)
      var str = ''

      var _prevHelper = analyseRst.prev?setting.prevHelper:setting.prevDisabledHelper
      str = str + stringReplace(_prevHelper, {
        page: analyseRst.prev,
        link: this._link(analyseRst.prev, current, max),
        text: setting.prevText,
        current: current,
        max: max
      })

      if (analyseRst.prevMore) {
        str = str + stringReplace(setting.numberHelper, {
          page: 1,
          link: this._link(1, current, max),
          current: current,
          max: max
        }) + stringReplace(setting.prevMoreHelper, {
          text: setting.prevMoreText,
          current: current,
          max: max
        })
      }

      for (var i = analyseRst.from; i <= analyseRst.to; i++) {
        var _helper = i === current?setting.currentHelper:setting.numberHelper
        str = str + stringReplace(_helper, {
          page: i,
          link: this._link(i, current, max),
          current: current,
          max: max
        })
      }

      if (analyseRst.nextMore) {
        str = str + stringReplace(setting.nextMoreHelper, {
          text: setting.nextMoreText,
          current: current,
          max: max
        }) + stringReplace(setting.numberHelper, {
          page: max,
          link: this._link(max, current, max),
          current: current,
          max: max
        })
      }

      var _nextHelper = analyseRst.next?setting.nextHelper:setting.nextDisabledHelper
      str = str + stringReplace(_nextHelper, {
        page: analyseRst.next,
        link: this._link(analyseRst.next, current, max),
        text: setting.nextText,
        current: current,
        max: max
      })
      return str
    }
    return function(setting) {
      return new PageNavigator(setting)
    }
  })()

  var _module = (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object' && module)
  var defineAmd = (typeof define === 'function' && define['amd'] && define)
  var defineCmd = (typeof define === 'function' && define['cmd'] && define)
  var _window = (typeof window === 'object' && window)

  // CommonJS/Node.js
  if(_module){
    _module.exports = PageNavigator
  // AMD/require.js
  }else if(defineAmd){
    define([], function() {
      return PageNavigator
    })
  // CMD/Sea.js
  }else if(defineCmd){
    define(function(require, exports, module) {
      module.exports = PageNavigator
    })
  // Browser script tag
  }else if(_window){
    _window.PageNavigator = PageNavigator
  }
})()
