/**
 * @author 剧中人
 * @github https://github.com/bh-lay/panel
 * @modified 2014-4-16 21:35
 * panel
 * the right key of mouse
 *
 *
 *  DEMO
 * //创建一个右键绑定
 * 	var o = panel({
 * 		targets :'.testButton',
 * 		list : {
 * 			'open' : {'txt' : '打开'},
 * 			'rename' : {'txt' : '重命名','display' : 'disable'},
 * 			'delete' : {'txt' : '删除'}
 * 		},
 * 		callbefore:function(){
 * 			//右键之后菜单弹出之前，可以在这里做些事情
 * 		},
 * 		callback:function(name) {
 * 			console.log('you have chioce "' , name , '" from the [ ' , this , ']');
 * 		}
 * 	});
 * //选项置灰
 * 	o.display('rename','disable');
 * //选项恢复
 * 	o.display('delete','hide');
 * //增删菜单条目
 * 	o.add('test',{'txt':'测试'},function(){
 * 		alert(12)
 * 	});
 * 	o.remove('copy');
 */

(function(global, doc, factory) {
    if (global.define) {
        //提供CommonJS规范的接口
        define(function() {
            //对外接口
            return factory(global, doc);
        });
    } else {
        global.util = global.util || {};
        global.util.panel = global.util.panel || factory(global, doc);
    }
})(window, document, function(window, document) {

    var private_win = $(window),
        private_winW,
        private_winH,
        private_scrollTop,
        private_scrollLeft,
        private_active_panel = null,
        private_body = $('body'),
        menu_tpl = '<div class="panel_menu panel_mark"><ul class="pa_me_list">{-content-}</ul></div>',
        style_tpl = '<style type="text/css">' + ".panel_menu{\n\tposition: absolute;\n\tz-index :10000;\n\twidth:180px;\n\tbackground:#fff;\n\tbox-shadow: 0px 0px 3px 0px rgba(90, 90, 90, 0.5);\n\tborder-radius:2px;\n}\n.pa_me_list{\n\tpadding:0px 0px;\n\tmargin:0px;\n}\n.pa_me_list span,\n.pa_me_list a{\n\tborder-bottom:solid 1px #eee;\n\tline-height:30px;\n\tdisplay:block;\n\tfont-size:13px;\n\ttext-indent:2em;\n\tpadding: 2px 5px;\n\ttext-decoration:none;\n}\n.pa_me_list span{\n\tcursor: default;\n\tcolor:#aaa;\n}\n.pa_me_list a{\n\tcolor:#444;\n}\n.pa_me_list a:hover{\n\tcolor:#000;\n\tbackground:#eee;\n}" + '</style>';

    function reCountSize() {
        private_winW = private_win.width();
        private_winH = private_win.height();
        private_scrollTop = private_win.scrollTop();
        private_scrollLeft = private_win.scrollLeft();
    }

    function change_dispaly(name, check) {
        if (typeof(this['list'][name]) == "object") {
            this['list'][name]['display'] = check;
        }
    }
    // Unified to remove panel dom
    function remove_panel() {
        if (private_active_panel) {
            private_active_panel.fadeOut(100, function() {
                $(this).remove();
            });
            private_active_panel = null;
        }
    }
    //重算浏览器尺寸
    reCountSize();
    setTimeout(reCountSize, 1000);
    $(function() {
        $('head').append(style_tpl);
        //try to close panel
        var bingo_panel = false;
        private_body.on('mousedown', '.panel_mark', function() {
            bingo_panel = true;
        }).on('mousedown', function() {
            setTimeout(function() {
                if (!bingo_panel) {
                    remove_panel()
                }
                bingo_panel = false;
            }, 20);
        });

        //window resize 
        var delay;
        private_win.on('resize scroll', function() {
            clearTimeout(delay);
            delay = setTimeout(function() {
                reCountSize();
                remove_panel();
            }, 100);
        });
    });
    //////////////////////////////////
    function show_panel(left, top, param, this_dom, callback) {
        //menu、dock
        var list_html = '';
        for (var i = 0 in param) {
            param[i]['display'] = param[i]['display'] || 'show';
            if (param[i]['display'] == 'show') {
                if (param[i]['callback']) {
                    list_html += '<a data-callback="true" data-name="' + (i || '') + '" href="javascript:;">' + (param[i]['txt'] || '') + '</a>';
                } else {
                    list_html += '<a data-name="' + (i || '') + '" href="javascript:;">' + (param[i]['txt'] || '') + '</a>';
                }
            } else if (param[i]['display'] == 'disable') {
                list_html += '<span data-name="' + (i || '') + '" href="javascript:;">' + (param[i]['txt'] || '') + '</span>';
            }
        }

        var panel_dom = $(menu_tpl.replace(/{-content-}/, list_html));
        panel_dom.on('click', 'a', function() {
            remove_panel()
            var this_name = $(this).attr('data-name') || '';

            if ($(this).attr('data-callback')) {
                var this_name = $(this).attr('data-name');
                if (param[this_name]['callback']) {
                    param[this_name]['callback'].call(this_dom, this_name);
                }
            } else {
                callback.call(this_dom, this_name);
            }
        }).on('contextmenu', function() {
            return false;
        });

        //append panel dom and mark the dom mark
        remove_panel();
        private_body.append(panel_dom);
        private_active_panel = panel_dom;

        // setting panel dom position
        var panel_h = panel_dom.outerHeight(),
            panel_w = panel_dom.outerWidth();

        if (panel_h + top > private_winH + private_scrollTop) {
            top = private_scrollTop + private_winH - panel_h - 5;
        }
        if (panel_w + left > private_winW + private_scrollLeft) {
            left = private_scrollLeft + private_winW - panel_w
        }
        panel_dom.css({
            top: top,
            left: left
        });
    }


    function filter_clone(args) {
        var obj = {};
        for (var i = 0 in args) {
            obj[i] = {};
            obj[i].txt = args[i].txt;
            if (!args[i].display || !args[i].display.match(/^(hide|disable)$/)) {
                obj[i].display = 'show';
            } else {
                obj[i].display = args[i]['display']
            }
            obj[i].callback = args[i].callback || null;
        }
        return obj;
    }

    //
    function Panel(param) {
        if (!(this instanceof Panel)) {
            return new Panel(param);
        }
        var param = param || {};
        var me = this;
        var elem = param.elem,
            doms_path = param.targets || null,
            callback = param.callback || null,
            callbefore = param.callbefore || null;

        this.list = filter_clone(param['list'] || {});
        if (!doms_path) {
            return
        }
        elem.on('contextmenu', doms_path, function(e) {
            var this_dom = this;
            remove_panel()
            if (e.target.tagName.match(/INPUT|TEXTAREA/i)) {
                return
            }
            //if(e.button > 0){
            var x = e.pageX,
                y = e.pageY;
            callbefore && callbefore.call(this_dom);
            setTimeout(function() {
                show_panel(x, y, me.list, this_dom, callback);
            }, 40);
            return false;
        });
    };
    Panel.prototype = {
        display: function(name, check) {
            if (!(check && check.match(/^(show|hide|disable)$/))) {
                //check error
                return
            }

            if (Object.prototype.toString.call(name) == "[object Array]") {
                for (var i = 0, total = name.length; i < total; i++) {
                    change_dispaly.call(this, name[i], check);
                }
            } else if (typeof(name) == "string") {
                change_dispaly.call(this, name, check);
            } else {
                return
            }
        },
        add: function(name, arg, callback) {
            if (!arg.display || !arg.display.match(/^(hide|disable)$/)) {
                arg.display = 'show';
            }
            this.list[name] = this.list[name] || {};
            var li = this.list[name];
            li.txt = arg.txt || li.txt;
            li.display = arg.display || li.display;
            li.callback = callback || li.callback;
        },
        remove: function(name) {
            if (typeof(this['list'][name]) == "object") {
                delete this['list'][name];
            }
        }
    };
    return function(param) {
        return new Panel(param);
    };
});