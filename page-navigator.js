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
    * prop.current bool 当前页
    * prop.first bool 第一页，等同于 page === 1
    * prop.last bool 最后一页
    * */
    if (prop.current) {
      return '<span class="item number current" data-index="' + page + '">' + page + '</span>'
    } else {
      return '<a href="' + this.link(page) + '" class="item number" data-index="' + page + '">' + page + '</a>'
    }
  }
  var nextHelper = function(page, prop) {
    /*
    * prop.disabled 下一页是否可用
    * */
    if (prop.disabled) {
      return '<span class="item next disabled" data-index="' + page + '">' + this.nextText + '</span>'
    } else {
      return '<a href="' + this.link(page) + '" class="item next" data-index="' + page + '">' + this.nextText + '</a>'
    }
  }
  var prevHelper = function(page, prop) {
    /*
     * prop.disabled 上一页是否可用
     * */
    if (prop.disabled) {
      return '<span class="item prev disabled" data-index="' + page + '">' + this.prevText + '</span>'
    } else {
      return '<a href="' + this.link(page) + '" class="item prev" data-index="' + page + '">' + this.prevText + '</a>'
    }
  }
  var moreHelper = function() {
    return '<span class="item more">' + this.moreText + '</span>'
  }

  var linkHelper = function() {
    /*
     * args[0] 链接所指页数
     * */
    return 'javascript:void(0);'
  }

  var entitize = function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function PageNavigator(setting) {
    setting = setting || {}
    this._numberHelper = setting.numberHelper || numberHelper
    this._nextHelper = setting.nextHelper || nextHelper
    this._prevHelper = setting.prevHelper || prevHelper
    this._prevMoreHelper = setting.prevMoreHelper || moreHelper
    this._nextMoreHelper = setting.nextMoreHelper || moreHelper
    this.prevText = entitize(setting.prevText || '上一页')
    this.nextText = entitize(setting.nextText || '下一页')
    this.moreText = entitize(setting.moreText || '...')
    this._navSize = setting.size || 7
    this.link = setting.linkHelper || linkHelper
    if(typeof this.link === 'string'){
      var _link = this.link
      this.link = function(page) {
        return _link.replace(/\{\{page\}\}/g, page)
      }
    }
  }

  PageNavigator.prototype.create = function(current, max) {
    var analyseRst = pageAnalyse(current, max, this._navSize)

    var str = ''

    str = str + this._prevHelper(analyseRst.prev, {
      disabled: !analyseRst.prev
    })

    if (analyseRst.prevMore) {
      str = str + this._numberHelper(1, {
        current: false,
        first: true
      }) + this._prevMoreHelper()
    }

    for (var i = analyseRst.from; i <= analyseRst.to; i++) {
      str = str + this._numberHelper(i, {
        current: i === current,
        first: i === 1,
        last: i === max
      })
    }


    if (analyseRst.nextMore) {
      str = str + this._nextMoreHelper() + this._numberHelper(max, {
        current: false,
        last: true
      })
    }

    str = str + this._nextHelper(analyseRst.next, {
      disabled: !analyseRst.next
    })

    return str;
  }
  window.PageNavigator = PageNavigator
})()
