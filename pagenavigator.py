# coding:utf-8

def page_analyse(current, max, size=7):

    middle_number = size/2+1

    prev = current - 1 if current > 1 else None
    next = current + 1 if max > current else None

    if max <= size:
        start = 1
        end = max
        prev_more = False
        next_more = False
    else:
        if current <= middle_number:
            start = 1
            end = size - 1
            prev_more = False
            next_more = True

        elif max - current < middle_number:
            start = max - middle_number - 1
            end = max
            prev_more = True
            next_more = False
        else:
            start = current - middle_number + 2
            end = current + middle_number - 2
            prev_more = True
            next_more = True
    return {
        'from': start,
        'to': end,
        'prev_more': prev_more,
        'next_more': next_more,
        'prev': prev,
        'next': next
    }


def string_replace(string, **data):
    for key in data:
        string = string.replace('{{' + key + '}}', str(data[key]))
    return string


default_setting = {
    'number_helper':       '<a href="{{link}}" class="item number" data-page="{{page}}">{{page}}</a>',
    'current_helper':      '<span class="item number current" data-page="{{page}}">{{page}}</span>',
    'prev_helper':         '<a href="{{link}}" class="item prev" data-page="{{page}}">{{text}}</a>',
    'prev_disabled_helper': '<span class="item prev disabled">{{text}}</span>',
    'next_helper':         '<a href="{{link}}" class="item next" data-page="{{page}}">{{text}}</a>',
    'next_disabled_helper': '<span class="item next disabled">{{text}}</span>',
    'more_helper':         '<span class="item more">{{text}}</span>',
    'link_helper': 'javascript:void(0);',
    'more_text':   '…',
    'next_text':   '下一页',
    'prev_text':   '上一页',
    'size': 7
  }

def clone_dict(*dict_tuple):
    obj = {}
    for dict_i in dict_tuple:
        for key in dict_i:
            obj[key] = dict_i[key]
    return obj

def entitize(string):
    return string.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


class PageNavigator:
    def __init__(self, **setting):

        _setting = clone_dict(default_setting, setting)
        self._setting = _setting
        _ = _setting
        _['prev_more_helper'] = _.get('prev_more_helper') or _['more_helper']
        _['next_more_helper'] = _.get('next_more_helper') or _['more_helper']
        _['prev_more_text'] = entitize(_.get('prev_more_text') or _['more_text'])
        _['next_more_text'] = entitize(_.get('next_more_text') or _['more_text'])

        _['next_text'] = entitize(_['next_text'])
        _['prev_text'] = entitize(_['prev_text'])
        _['size'] = _.get('size') or 7


    def create(self, current, max):
        setting = self._setting
        analyse_rst = page_analyse(current, max, setting['size'])

        html = ''

        prev_page = analyse_rst.get('prev')
        prev_helper = setting['prev_helper'] if prev_page else setting['prev_disabled_helper']
        html = html + string_replace(prev_helper, page=prev_page, link=self.__link(prev_page, current, max),
                                     text=setting['prev_text'], current=current, max=max)

        if analyse_rst.get('prev_more'):
            html = html + string_replace(setting['number_helper'], page=1, link=self.__link(1, current, max), current=current, max=max) \
                   + string_replace(setting['prev_more_helper'], text=setting['prev_more_text'], current=current, max=max)

        for i in range(analyse_rst['from'], analyse_rst['to']+1):
            _helper = setting['current_helper'] if i == current else setting['number_helper']
            html = html + string_replace(_helper, page=i, link=self.__link(i, current, max), current=current, max=max)

        if analyse_rst.get('next_more'):
            html = html + string_replace(setting['next_more_helper'], text=setting['next_more_text'], current=current, max=max) \
                   + string_replace(setting['number_helper'], page=max, link=self.__link(max, current, max), current=current, max=max)

        next_page=analyse_rst.get('next')
        next_helper = setting['next_helper'] if next_page else setting['next_disabled_helper']
        html = html + string_replace(next_helper, page=next_page, link=self.__link(next_page, current, max),
                                     text=setting['next_text'], current=current, max=max)

        return html

    def __link(self, page, current=None, max=None):
        if page is None:
            link = ''
        else:
            link = string_replace(self._setting['link_helper'], page=page, current=current, max=max)
        return link
