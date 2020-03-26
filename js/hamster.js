'use strict';
var cropper;
var configCropper;
var bookmarkAddWindow;

/**
 * 初始化用户菜单
 */
function initUserProfileMenu() {
    $('.avatar').click(function () {
        $('.profile-menu').fadeToggle('fast');
    });
    $(document).click(function (event) {
        // console.log(event);
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
    let height = viewportHeight >= 768 ? 600 : viewportHeight - 100;
    bookmarkAddWindow = new jBox('Modal', {
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
        content: $('.bookmark-edit-panel'),
        onOpen: initCategorySelector
    });
}

/**
 * 初始化用户配置弹窗
 */
function initUserConfigPanel() {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let width = viewportWidth >= 1024 ? 500 : 500;
    let height = viewportHeight >= 768 ? 400 : viewportHeight - 100;
    new jBox('Modal', {
        id: 'userConfig',
        width: width,
        height: height,
        responsiveHeight: true,
        minHeight: 400,
        maxHeight: 800,
        overlay: false,
        isolateScroll: false,
        draggable: 'title',
        attach: '#config',
        title: '用户配置',
        repositionOnOpen: false,
        repositionOnContent: false,
        content: $('.user-config-panel')
    });
}


/**
 * 初始化标签编辑框
 */
function initTagEditor() {
    $('#bookmark-form-tag').tagEditor({
        initialTags: [],
        placeholder: '在这里添加标签',
        maxLength: 20,
        maxTags: 50
    });
}

/**
 * 当preview元素所在父元素的display为null时,会导致Cropper的preview无法正确渲染,现在暂时的解决办法是在点击按钮弹窗的时候渲染
 */
var isFirstInitCropper = true;
var isFirstOpenConfigPanel = true;

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
    cropper = new Cropper(image, options);
    isFirstInitCropper = false;
}
function initConfigCropper() {

    if (!isFirstOpenConfigPanel) {
        return;
    }
    var image = document.getElementById('avator-image');
    var options = {
        aspectRatio: 1 / 1,
        preview: '.avator-preview',
        minContainerWidth: 200,
        minContainerHeight: 200,
        dragMode: "move",
    };
    configCropper = new Cropper(image, options);
    isFirstOpenConfigPanel = false;
}


/**
 * 初始化书签分类下拉选择框
 */
var comboTree;
function initCategorySelector() {
    if (comboTree) {
        comboTree.destroy();
    }
    getCategory((data) => {
        let code = data.code;
        if (code !== 0) {
            console.log(`获取分类失败:code:${code}:message:${data.message}`);
            return;
        }
        let categorys = data.data.children;
        let targetData = [];
        let convertCategory = (arr, subs) => {
            for (let category of arr) {
                let c = {};
                c.id = category.id;
                c.title = category.title;
                subs.push(c);
                if (category.children) {
                    let subCategory = [];
                    c.subs = subCategory;
                    convertCategory(category.children, subCategory);
                }
            }
        };
        convertCategory(categorys, targetData);
        console.log(targetData);
        comboTree = $('#category-tree').comboTree({
            source: targetData,
            isMultiple: false
        });
    });
}

/** 书签信息预览 */
function initBookmarkPreview() {
    let bookmarkPreview = new jBox('Tooltip', {
        attach: '.bookmark',
        trigger: 'mouseenter',
        delayOpen: 500,
        position: {
            x: 'right',
            y: 'top'
        },
        outside: 'x',
        adjustPosition: true,
        adjustTracker: true,
        closeOnMouseleave: true,
        content: $('.bookmark-preview')
    });
}

function initKeyEvent() {
    let f = function (event) {
        if (event.keyCode === 37) {
            $('.main').terseBanner('prev');
        } else if (event.keyCode === 39) {
            $('.main').terseBanner('next');
        };
    }
    $(document).on('keydown', f);
}