<?php
class PageNavigator {
  private $setting;
  private $defaul_setting = array(
    'numberHelper'=>       '<a href="{{link}}" class="item number" data-page="{{page}}">{{page}}</a>',
    'currentHelper'=>      '<span class="item number current" data-page="{{page}}">{{page}}</span>',
    'prevHelper'=>         '<a href="{{link}}" class="item prev" data-page="{{page}}">{{text}}</a>',
    'prevDisabledHelper'=> '<span class="item prev disabled">{{text}}</span>',
    'nextHelper'=>         '<a href="{{link}}" class="item next" data-page="{{page}}">{{text}}</a>',
    'nextDisabledHelper'=> '<span class="item next disabled">{{text}}</span>',
    'moreHelper'=>         '<span class="item more">{{text}}</span>',
    'linkHelper'=> 'javascript:void(0);',
    'moreText'=>   '…',
    'nextText'=>   '下一页',
    'prevText'=>   '上一页',
    'size'=> 7
  );

  function __construct(){
    $args = func_get_args();
    if(empty($args)){
      $setting = array();
    }else{
      $setting = $args[0];
    }
    $_ = $this->cloneObject(array($this->defaul_setting, $setting));
    if(empty($_['prevMoreHelper'])) $_['prevMoreHelper'] = $_['moreHelper'];
    if(empty($_['nextMoreHelper'])) $_['nextMoreHelper'] = $_['moreHelper'];
    if(empty($_['prevMoreText'])) $_['prevMoreText'] = $_['moreText'];
    if(empty($_['nextMoreText'])) $_['nextMoreText'] = $_['moreText'];
    // entitize
    $_['nextText'] = htmlentities($_['nextText']);
    $_['prevText'] = htmlentities($_['prevText']);
    $_['prevMoreText'] = htmlentities($_['prevMoreText']);
    $_['nextMoreText'] = htmlentities($_['nextMoreText']);
    $this->setting = $_;
  }

  function create($current, $max) {
    $_ = $this->setting;
    $rst = $this->pageAnalyse($current, $max, $_['size']);
    $str = '';
    $_prevHelper = $rst['prev']?$_['prevHelper']:$_['prevDisabledHelper'];
    $str = $str . $this->stringReplace($_prevHelper, array(
      'page'=>$rst['prev'],
      'link'=>$this->link($rst['prev'], $current, $max),
      'text'=>$_['prevText'],
      'current'=>$current,
      'max'=>$max
    ));

    if ($rst['prevMore']) {
      $str = $str . $this->stringReplace($_['numberHelper'], array(
        'page'=>1,
        'link'=>$this->link(1, $current, $max),
        'current'=>$current,
        'max'=>$max
      )) . $this->stringReplace($_['prevMoreHelper'], array(
        'text'=>$_['prevMoreText'],
        'current'=>$current,
        'max'=>$max
      ));
    }
    for ($i = $rst['from']; $i <= $rst['to']; $i++) {
      $_helper = $i === $current?$_['currentHelper']:$_['numberHelper'];
      $str = $str . $this->stringReplace($_helper, array(
        'page'=>$i,
        'link'=>$this->link($i, $current, $max),
        'current'=>$current,
        'max'=>$max
      ));
    }

    if ($rst['nextMore']) {
      $str = $str . $this->stringReplace($_['nextMoreHelper'], array(
        'text'=>$_['nextMoreText'],
        'current'=>$current,
        'max'=>$max
      )) . $this->stringReplace($_['numberHelper'], array(
        'page'=>$max,
        'link'=>$this->link($max, $current, $max),
        'current'=>$current,
        'max'=>$max
      ));
    }

    $_nextHelper = $rst['next']?$_['nextHelper']:$_['nextDisabledHelper'];
    $str = $str . $this->stringReplace($_nextHelper, array(
      'page'=>$rst['next'],
      'link'=>$this->link($rst['next'], $current, $max),
      'text'=>$_['nextText'],
      'current'=>$current,
      'max'=>$max
    ));
    return $str;
  }

  private function cloneObject($arr){
    $dict = array();
    foreach($arr as $item) {
      if(!empty($item)){
        foreach ($item as $key=>$value) {
          $dict[$key] = $value;
        }
      }
    }
    return $dict;
  }

  function pageAnalyse($current, $max, $size) {
    $middle_number = floor($size/2)+1;
    $prev = $current > 1 ? $current - 1 : null;
    $next = $max > $current ? $current + 1 : null;

    if ($max <= $size) {
      $from = 1;
      $to = $max;
      $prevMore = false;
      $nextMore = false;
    } else {
      if ($current <= $middle_number) {
        $from = 1;
        $to = $size - 1;
        $prevMore = false;
        $nextMore = true;
      } else if ($max - $current < $middle_number) {
        $to = $max;
        $from = $max - ceil($size / 2) - 1;
        $prevMore = true;
        $nextMore = false;
      } else {
        $from = $current - $middle_number + 2;
        $to = $current + $middle_number - 2;
        $prevMore = true;
        $nextMore = true;
      }
    }
    return array('prev'=>$prev,'next'=>$next,'prevMore'=>$prevMore, 'nextMore'=>$nextMore, 'from'=>$from,'to'=>$to);
  }

  private function stringReplace($str, $dict) {
    foreach($dict as $key=>$value) {
      $str = str_replace("{{{$key}}}", $value, $str);
    }
    return $str;
  }

  private function link($page, $current, $max) {
    return $this->stringReplace($this->setting['linkHelper'], array(
      'page'=>$page,
      'current'=>$current,
      'max'=>$max
    ));
  }
}
?>
