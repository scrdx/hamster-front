'use strict';

/**
 * 初始化用户菜单
 */
function initUserProfileMenu() {
    $('.avatar').click(function() {
        $('.profile-menu').fadeToggle('fast');
    });
    $(document).click(function(event) {
        console.log(event);
        var userPanel = document.getElementById('profile-menu');
        var userBox = document.getElementsByClassName('avatar');
        if (event.target == userBox[0] || isParent(event.target, userPanel)) {
            return;
        }
        $('.profile-menu').hide();

    });
}

/**
 * 初始化书签添加面板
 */
function initBookmarkEditPanel() {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let width = viewportWidth >= 1024 ? 600 : 500;
    let height = viewportHeight >= 768 ? 500 : viewportHeight - 100;
    new jBox('Modal', {
        id: 'addBookmark',
        width: width,
        height: height,
        responsiveHeight: true,
        minHeight: 400,
        maxHeight: 800,
        overlay: false,
        isolateScroll: false,
        draggable: 'title',
        attach: '#add-bookmark',
        title: '编辑书签',
        repositionOnOpen: false,
        repositionOnContent: false,
        content: $('.bookmark-edit-panel')
    });
}

/**
 * 初始化标签编辑框
 */
function initTagEditor() {
    $('#bookmark-form-tag').tagEditor({ initialTags: [], placeholder: '在这里添加标签' });
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
        minContainerWidth: 200,
        minContainerHeight: 200,
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
    var comboTree = $('#category-tree').comboTree({
        source: SampleJSONData,
        isMultiple: false
    });
}


function initKeyEvent(){
    let f = function(event){
        console.log('aaa');
        if (event.keyCode === 37) {
            $('.main').terseBanner('prev');
        } else if (event.keyCode === 39) {
            $('.main').terseBanner('next');
        };
    }
    $(document).on('keydown', f);
}