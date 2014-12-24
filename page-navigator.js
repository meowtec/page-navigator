;(function(){
  var pageAnalyse = function(current, max, navSize) {
    var prev,
      next,
      prevMore,
      nextMore,
      from,
      to
    prev = current > 1 ? current - 1 : null
    next = max > current ? current + 1 : null

    if (max <= navSize) {
      from = 1
      to = max
      prevMore = false
      nextMore = false
    } else {
      if (current <= Math.ceil(navSize / 2)) {
        from = 1
        to = navSize - 1
        prevMore = false
        nextMore = true
      } else if (max - current < Math.ceil(navSize / 2)) {
        to = max
        from = max - Math.ceil(navSize / 2) - 1
        prevMore = true
        nextMore = false
      } else {
        from = current - Math.ceil(navSize / 2) + 2
        to = current + Math.ceil(navSize / 2) - 2
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

  var numberHelper = function(page, prop) {
    /*
      prop.current bool 当前页
      prop.first bool 第一页，等同于 page === 1
      prop.last bool 最后一页
    */
    if (prop.current) {
      return '<span class="item current" data-index="' + page + '">' + page + '</span>'
    } else {
      return '<a href="' + this.link(page) + '" class="item" data-index="' + page + '">' + page + '</a>'
    }
  }
  var nextHelper = function(page, prop) {
    if (prop.disabled) {
      return '<span class="next disabled" data-index="' + page + '">' + this.nextText + '</span>'
    } else {
      return '<a href="' + this.link(page) + '" class="next" data-index="' + page + '">' + this.nextText + '</a>'
    }
  }
  var prevHelper = function(page, prop) {
    if (prop.disabled) {
      return '<span class="prev disabled" data-index="' + page + '">' + this.prevText + '</span>'
    } else {
      return '<a href="' + this.link(page) + '" class="prev" data-index="' + page + '">' + this.prevText + '</a>'
    }
  }
  var moreHelper = function() {
    return '<span class="more">' + this.moreText + '</span>'
  }

  var linkHelper = function() {
    return 'javascript:;'
  }

  var entity = function(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')
  }

  function PageNavigator(setting) {
    setting = setting || {}
    this._numberHelper = setting.numberHelper || numberHelper
    this._nextHelper = setting.nextHelper || nextHelper
    this._prevHelper = setting.prevHelper || prevHelper
    this._prevMoreHelper = setting.prevMoreHelper || moreHelper
    this._nextMoreHelper = setting.nextMoreHelper || moreHelper
    this.link = setting.linkHelper || linkHelper
    this.prevText = setting.prevText || '上一页'
    this.nextText = setting.nextText || '下一页'
    this.moreText = setting.moreText || '...'
    this._navSize = setting.size || 7
  }

  PageNavigator.prototype.create = function(current, max) {
    var analyseRst = pageAnalyse(current, max, this._navSize)

    var str = ''

    str = str + this._prevHelper(analyseRst.prev, {
      disabled: !analyseRst.prev
    }, this._linkHelper)

    if (analyseRst.prevMore) {
      str = str + this._numberHelper(1, {
        current: false,
        first: true
      }, this._linkHelper) + this._prevMoreHelper()
    }

    for (var i = analyseRst.from; i <= analyseRst.to; i++) {
      str = str + this._numberHelper(i, {
        current: i === current,
        first: i === 1,
        last: i === max
      }, this._linkHelper)
    }


    if (analyseRst.nextMore) {
      str = str + this._nextMoreHelper() + this._numberHelper(max, {
        current: false,
        last: true
      }, this._linkHelper)
    }

    str = str + this._nextHelper(analyseRst.next, {
      disabled: !analyseRst.next
    }, this._linkHelper)

    return str;
  }
  window.PageNavigator = PageNavigator
})()
