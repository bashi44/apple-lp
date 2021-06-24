'use strict';
// 標準的なpolyfillをインストール
import 'core-js/stable';
// 必要なpolyfillをインストール
import 'element-closest-polyfill';
// // fontawesomeインストール
// import {config, dom, library} from '@fortawesome/fontawesome-svg-core';
// import {

// } from '@fortawesome/free-solid-svg-icons';
// import {

// } from '@fortawesome/free-regular-svg-icons-svg-icons';
// import {

// } from '@fortawesome/free-brands-svg-icons';
// // アイコンが見つからない場合の挙動 ?マークがアニメーション
// config.showMissingIcons = true;
// // 上記3行で記載したアイコンをライブラリに追加
// library.add(

// );
// // <i>タグを<svg>タグに変換
// dom.watch();;

// 変数定義
var breakPoint = 767;
var first_width = $(document).width();
var old_width = first_width;
var new_width = first_width;
var body_height;

// bodyの高さ取得
function layer() {
  // リサイズ時初期化
  body_height = 0;
  // hide()で隠した要素の高さを認識するため遅延処理
  var body_height_delay = function(){
    var a = $('main').innerHeight();
    var b = $('footer').innerHeight();
    var c = parseInt($('.img-wrap:last-child()').css('margin-bottom'), 10);
    body_height = a + b + c;
    if(new_width <= breakPoint) {
      if($('.bag-container').hasClass('bag-close') === false) {
        $('.dark-layer').height(body_height);
      }
    }
  } 
  setTimeout(body_height_delay, 1);
}

// 初回読込
$(window).on('load', function() {
  layer();
  // ハンバーガーメニュー
  $('.hamburger-btn').on('click', function() {
    $('header').toggleClass('header-nav-opened');
    $('html').toggleClass('no-scroll');
  });
  // 検索ボタン small
  $('.search-input').on('click', function() {
    $('header').addClass('search-open');
  });
  $('.cancel-small').on('click', function() {
    $('header').removeClass('search-open');
  });
  // 検索ボタン large
  $('.search-logo').on('click', function(e) {
    $('header').addClass('search-open-large');
    $('html,body').scrollTop(0);
    $('html').toggleClass('no-scroll');
    $('.dark-layer').height(body_height);
    // バッグが開いている場合
    $('.bag-container').addClass('bag-close');
    $('.bag-logo').removeClass('triangle');
    // 必要な領域以外をクリックで閉じる
    $(window).off('click');
    $(window).on('click', function(e) {
      if(!e.target.closest('.search-input') 
        && !e.target.closest('.cancel-large') 
        && !e.target.closest('.search-logo') 
        && !e.target.closest('search-nav')) {
        $('header').removeClass('search-open-large');
        $('html').toggleClass('no-scroll');
        $('.dark-layer').height(0);
      }
    });
  });
  $('.cancel-large').on('click', function() {
    $('header').removeClass('search-open-large');
    $('html').toggleClass('no-scroll');
    $('.dark-layer').height(0);
  });
  // バッグ
  $('.bag-logo').on('click', function() {
    $('.bag-container').toggleClass('bag-close');
    $('.bag-logo').toggleClass('triangle');
    if(new_width <= breakPoint) {
      // レイヤー
      if($('.bag-container').hasClass('bag-close') === false) {
        $('.dark-layer').height(body_height);
      } else {
        $('.dark-layer').height(0);
      }
    }
    // 必要な領域以外をクリックで閉じる
    $(window).off('click');
    $(window).on('click', function(e) {
      if(new_width <= breakPoint) {
        if(!e.target.closest('.bag-container') && !e.target.closest('.bag-logo')) {
          $('.bag-container').addClass('bag-close');
          $('.dark-layer').height(0);
          $('.bag-logo').removeClass('triangle');
        }
      } else {
        if(!e.target.closest('.bag-inner-wrap') && !e.target.closest('.bag-logo')) {
          $('.bag-container').addClass('bag-close');
          $('.bag-logo').removeClass('triangle');
        }
      }
    });
  });
  // フッターメニュー
  if(first_width <= breakPoint) {
    $('.footer-nav1-item-wrap').hide();
    $('.footer-nav1-item-title').each(function() {
      $(this).on('click', footer_toggle_menu);
    })
  }
})

// リサイズ時付与したスタイリング用のclassを外す
function init() {
  $('html').attr('class', '');
  $('header').attr('class', '');
}

// JavaScript media query
// リサイズ時
function resize_delay(callback) {
  var resizeTimer = false;
  $(window).on('resize', function() {
    if(resizeTimer !== false) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function() {
      new_width = $(document).width();
      mediaQuery();
      callback();
      old_width = new_width;
    }, 2);
  });
}

// breakpoint通過時に一度だけ発火
function mediaQuery() {
  // 大きい画面から小さい画面に変わった場合
  if(old_width > breakPoint && new_width <= breakPoint) {
    if($('header').hasClass('search-open-large')) {
      $('.dark-layer').height(0);
    }
    init();
    // 小さい画面から大きい画面に変わった場合
  } else if(old_width <= breakPoint && new_width > breakPoint) {
    if($('.bag-container').hasClass('bag-close') === false) {
      $('.dark-layer').height(0);
    }
    init();
  }
  layer();
}

// footer resize callback
var footer_resize = function() {
  if(new_width <= breakPoint) {
    $('.footer-nav1-item-wrap').hide();
    $('.footer-nav1-item-title').each(function() {
      $(this).off('click')
      .on('click', footer_toggle_menu);
    })
  } else {
    $('.footer-nav1-item-wrap').show();
    $('.footer-nav1-item-title').each(function() {
      $(this).off('click')
      .next().children().find('.footer-nav1-item:first-child').css('padding-top', '0');
    })
  }
}

// toggle menu
function footer_toggle_menu() {
  // アイコン回転
  $(this).children().toggleClass('footer-nav1-toggle-icon');
  // 開閉処理
  $(this).next().children().slideToggle()
  .find('.footer-nav1-item:first-child').css('padding-top', '18px');
}
resize_delay(footer_resize);