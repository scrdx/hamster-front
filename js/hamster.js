'use strict';

/**
 * 初始化用户选项
 */
function initUserBoxMenu() {
    $('.user_box').click(function() {
        $('#user_panel').fadeToggle('fast');
    });
    $(document).click(function(event) {
        console.log(event);
        var userPanel = document.getElementById('user_panel');
        var userBox = document.getElementsByClassName('user_box');
        if (event.target == userBox[0] || isParent(event.target, userPanel)) {
            return;
        }
        $('#user_panel').hide();

    });
}

/**
 * 初始化书签添加面板
 */
function initBookmarkAddPanel() {
    new jBox('Modal', {
        id: 'addBookmark',
        width: 700,
        height: 750,
        overlay: false,
        draggable: 'title',
        attach: '#add_bookmark',
        title: '添加书签',
        repositionOnOpen: false,
        repositionOnContent: false,
        content: $('#bookmark_info')
    });
}

/**
 * 初始化标签编辑框
 */
function initTagEditor() {
    $('#bookmark-tag').tagEditor({ initialTags: [], placeholder: '在这里添加标签' });
}

/**
 * 当preview元素所在父元素的display为null时,会导致Cropper的preview无法正确渲染,现在暂时的解决办法是在点击按钮弹窗的时候渲染
 */
var isFirstInitCropper = true;

/**
 * 初始化图标上传组件
 */
function initCropper() {

    if (!isFirstInitCropper) {
        return;
    }
    var image = document.getElementById('icon-image');
    var options = {
        aspectRatio: 1 / 1,
        preview: '.icon-preview',
        minContainerWidth: 300,
        minContainerHeight: 300,
        dragMode: "move",
    };
    var cropper = new Cropper(image, options);
    isFirstInitCropper = false;
}

/**
 * 初始化书签分类下拉选择框
 */
function initCategorySelector() {
    var SampleJSONData = [{
        id: 0,
        title: 'choice 1  '
    }, {
        id: 1,
        title: 'choice 2',
        subs: [{
            id: 10,
            title: 'choice 2 1'
        }, {
            id: 11,
            title: 'choice 2 2'
        }, {
            id: 12,
            title: 'choice 2 3'
        }]
    }, {
        id: 2,
        title: 'choice 3'
    }, {
        id: 3,
        title: 'choice 4'
    }, {
        id: 4,
        title: 'choice 5'
    }, {
        id: 5,
        title: 'choice 6',
        subs: [{
            id: 50,
            title: 'choice 6 1'
        }, {
            id: 51,
            title: 'choice 6 2',
            subs: [{
                id: 510,
                title: 'choice 6 2 1'
            }, {
                id: 511,
                title: 'choice 6 2 2'
            }, {
                id: 512,
                title: 'choice 6 2 3'
            }]
        }]
    }, {
        id: 6,
        title: 'choice 7'
    }];
    var comboTree = $('#categoryTree').comboTree({
        source: SampleJSONData,
        isMultiple: false
    });
}


function initKeyEvent(){
    let f = function(event){
        console.log('aaa');
        if (event.keyCode === 37) {
            $('.banner').terseBanner('prev');
        } else if (event.keyCode === 39) {
            $('.banner').terseBanner('next');
        };
    }
    $(document).on('keydown', f);
}