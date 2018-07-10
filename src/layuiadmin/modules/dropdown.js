/**

 @Name：layui.dropdown 下拉按钮
 @Author：First
 @License：MIT

 */
layui.define('jquery', function (exports) {
  var $ = layui.$,
      device = layui.device(),
      MOD_NAME = 'dropdown',
      CLASS_NAME = '.layui-dropdown-menu',
      PX = 'px',
      //事件类型，默认为'mouseover'（移动端则为'click'）
      event = (device.android || device.ios) ? 'click' : 'mouseover',
      //当前Dropdown对象
      that;

  Dropdown = function () {
    //当前实例
    this.inst = null;
    this.currReElem = null;
  };

  //隐藏
  var __hideDropdown = function (e) {
    if (e.target.tagName == 'BODY'
            || (isClosable(e.target)
        && isClosable(e.target.parentElement)
        && isClosable(e.target.parentElement.parentElement))) {
      that.hide();
    }
  };

  //是否满足隐藏条件
  var isClosable = function (elem) {
    return elem
        && elem.className.indexOf('layui-dropdown') == -1
        && elem.className.indexOf('layui-dropdown-menu') == -1;
  };

  //修正显示位置
  Dropdown.prototype.hide = function () {
    if (that && that.inst && that.inst.is(':visible')) {
      // that.inst.css('display', 'none');
      that.inst.removeClass('show').addClass('hide');
      that.currReElem.find('i:first').removeClass('layui-icon-triangle-d').addClass('layui-icon-triangle-r');
      $('body').off(event, __hideDropdown);
    }
  };

  //渲染
  Dropdown.prototype.render = function () {
    that = this;
    $('.layui-dropdown').each(function (index, elem) {
      var reElem = $(elem);
      reElem.data('id', 'dropdown-' + index);
      event = (device.android || device.ios) ? 'click' : 'mouseover';

      reElem[event](function () {
        if (!that.inst//第一次显示
            || that.currReElem.data('id') != reElem.data('id')//切换到其他dropdown
            || (that.currReElem.data('id') == reElem.data('id') && !that.inst.is(':visible'))) {//重新移动到当前dropdown
          //隐藏
          that.hide();
          //这里暂时采用fixed定位
          var dropElem = reElem.find(CLASS_NAME),
          left = reElem.offset().left - $(window).scrollLeft(),
          top = reElem.offset().top,
          width = reElem.width(),
          height = reElem.height(),

          scrollTop = $(window).scrollTop(),
          offsetTop = top + height - scrollTop - 2,

          dropWidth = dropElem.width(),
          dropHeight = dropElem.outerHeight(),
          containerWidth = reElem.width(),
          //居中显示
          // left = left - (dropWidth - width) / 2,

          offsetRight = left + containerWidth,
          overWidth = (left + dropWidth) > $(window).width(),
          overHeight = (top + height + dropHeight - scrollTop) > $(window).height(),
          css = {/*'display': 'block', */'position': 'fixed', 'top': (offsetTop + 1) + PX, 'left': left + PX};

          //超出窗口可见宽度
          overWidth && $.extend(true, css, {'left': (offsetRight - dropWidth) + PX});
          //居中显示
          // overWidth && $.extend(true, css, {'left': (offsetRight - dropWidth + width / 2) + PX});
          //超出窗口可见高度
          overHeight && $.extend(true, css, {'top': (top - dropHeight - scrollTop) + PX});
          //显示
          dropElem.removeClass('hide').addClass('show')
          dropElem.css(css).on('click', 'li', function () {
            that.hide()
          });

          reElem.find('i:first').removeClass('layui-icon-triangle-r').addClass('layui-icon-triangle-d');
          that.inst = dropElem;
          that.currReElem = reElem;
          $('body').on(event, __hideDropdown);
        }
      });
    });
  };

  //自动完成渲染
  var dropdown = new Dropdown();
  dropdown.render();

  $(window).scroll(function () {
    dropdown.hide();
  });

  exports(MOD_NAME, dropdown);
})