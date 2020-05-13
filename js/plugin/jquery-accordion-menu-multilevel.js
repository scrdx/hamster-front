/* accordion menu plugin*/
; (function ($, window, document, undefined) {
  var pluginName = "accordion";
  var defaults = {
    speed: 200,
    showDelay: 0,
    hideDelay: 0,
    singleOpen: true,
    clickEffect: true,
    indicator: 'submenu-indicator-minus',
    subMenu: 'submenu',
    event: 'click touchstart' // click, touchstart
  };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }
  $.extend(Plugin.prototype, {
    init: function () {
      this.submenuIndicators();
      this.openSubmenu();
      if (defaults.clickEffect) {
        this.addClickEffect();
      }
    },

    //注册右侧下拉按钮的点击事件
    openSubmenu: function () {
      // $(this.element).children("ul").find("li").bind(defaults.event, function(e) {
      $(this.element).children("ul").find(".submenu-slidedown").bind(defaults.event, function (e) {
        e.stopPropagation();
        e.preventDefault();
        //获取祖父元素，也就是原来的li元素
        let item = $(this).parent().parent();
        var $subMenus = item.children("." + defaults.subMenu);
        var $allSubMenus = item.find("." + defaults.subMenu);
        if ($subMenus.length > 0) {
          if ($subMenus.css("display") == "none") {
            $subMenus.slideDown(defaults.speed).siblings("a").addClass(defaults.indicator);
            if (defaults.singleOpen) {
              item.siblings().find("." + defaults.subMenu).slideUp(defaults.speed)
                .end().find("a").removeClass(defaults.indicator);
            }
            return false;
          } else {
            item.find("." + defaults.subMenu).delay(defaults.hideDelay).slideUp(defaults.speed);
          }
          if ($allSubMenus.siblings("a").hasClass(defaults.indicator)) {
            $allSubMenus.siblings("a").removeClass(defaults.indicator);
          }
        }
        // window.location.href = $(this).children("a").attr("href");
      });
      $(this.element).children("ul").find("li").bind(defaults.event, function (e) {
        e.stopPropagation();
        let categoryId = this.getAttribute('id');
        CACHE.currentCategoryId = categoryId;
        //取消别的列表项的选中
        $('#category').find('.active').removeClass('active');
        //设置选中
        this.setAttribute('class', 'active');
        initBookmarkData(categoryId, true);
      });
    },

    //给拥有子节点的列表项添加右侧的指示符
    submenuIndicators: function () {
      if ($(this.element).find("." + defaults.subMenu).length > 0) {
        $(this.element).find("." + defaults.subMenu).siblings("a").append("<span class='submenu-indicator'>+</span>");

        $(this.element).find("." + defaults.subMenu).siblings("a").append("<div class='submenu-slidedown'></div>");
      }
    },

    //添加点击之后的波纹特效
    addClickEffect: function () {
      var ink, d, x, y;
      $(this.element).find("a").bind("click touchstart", function (e) {
        $(".ink").remove();
        if ($(this).children(".ink").length === 0) {
          $(this).prepend("<span class='ink'></span>");
        }
        ink = $(this).find(".ink");
        ink.removeClass("animate-ink");
        if (!ink.height() && !ink.width()) {
          d = Math.max($(this).outerWidth(), $(this).outerHeight());
          ink.css({
            height: d,
            width: d
          });
        }
        x = e.pageX - $(this).offset().left - ink.width() / 2;
        y = e.pageY - $(this).offset().top - ink.height() / 2;
        ink.css({
          top: y + 'px',
          left: x + 'px'
        }).addClass("animate-ink");
      });
    },
    //取消列表项上绑定的事件
    reset() {
      $(this.element).children("ul").find("li").off();
    }
  });
  $.fn[pluginName] = function (options) {
    this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      } else {
        let tmp = $.data(this, "plugin_" + pluginName);
        tmp.reset();
        tmp.init();
      }
    });
    return this;
  };
})(jQuery, window, document);