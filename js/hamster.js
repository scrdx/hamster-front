'use strict';
var cropper;
var configCropper;
var bookmarkAddWindow;
var userConfigEditWindow;

/**
 * 初始化用户菜单
 */
function initUserProfileMenu() {
    $('.avatar').click(function () {
        $('.profile-menu').fadeToggle('fast');
    });
    $(document).click(function (event) {
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
    //图片编辑框设为初始化操作放到onOpen中是为了避免关闭model框时图片编辑框闪烁一下的问题
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
        attach: '#addBookmark',
        title: '编辑书签',
        repositionOnOpen: false,
        repositionOnContent: false,
        content: $('.bookmark-edit-panel'),
        onOpen: () => {
            if (cropper) {
                cropper.replace('./img/default_icon.png');
            }
        },
        onClose: clear
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
    userConfigEditWindow = new jBox('Modal', {
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
        content: $('.user-config-panel'),
        onOpen: ()=>{
            $('#userConfigFormNickname').val(CACHE.userInfo.nickname);
        }
    });
}


/**
 * 初始化标签编辑框
 */
function initTagEditor() {
    $('#bookmarkFormTag').tagEditor({
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
    var image = document.getElementById('iconImage');
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
    var image = document.getElementById('avatarImage');
    var options = {
        aspectRatio: 1 / 1,
        preview: '.avatar-preview',
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
        if (!categorys) {
            categorys = [];
        }
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
        comboTree = $('#categoryTree').comboTree({
            source: targetData,
            isMultiple: false
        });
    });
}

function setUserInfo() {
    getUserInfo((data)=>{
        if (!data || data.code !== 0) {
            //获取用户信息失败,返回登录页面
            window.location.href = 'login.html';
        }
        let userInfo = data.data;
        document.getElementById('headAvatar').style.backgroundImage = `url(${userInfo.avatarUrl})`;
        CACHE.userInfo.userCode = userInfo.userCode;
        CACHE.userInfo.nickname = userInfo.nickname;
    });
}

function initKeyEvent() {
    let f = function (event) {
        if (event.keyCode === 37) {
            $('.main').terseBanner('prev');
        } else if (event.keyCode === 39) {
            $('.main').terseBanner('next');
        } else if (event.keyCode === 13 && document.activeElement.id === 'searchText') {
            $('#search').click();
        }
    }
    $(document).on('keydown', f);
}

/**
 * 初始化常用书签面板
 */
function initOftenBookmarkPanel() {
    getOftenBookmarks(20, (data)=>{
        if (data.code !== 0) {
            console.log(`获取常用书签数据失败:code:${data.code}:message:${data.message}`);
            new jBox('Notice', {
                content: data.message,
                color: 'red',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();
            return;
        }
        let bookmarkArray = data.data;
        let fixedBookmarkPanel = document.getElementById('fixedBookmarkPanel');

        if (!bookmarkArray || bookmarkArray.length === 0) {
            return;
        }
        for (let bookmark of bookmarkArray) {
            CACHE.bookmarkMap.set('bookmark-' + bookmark.id, bookmark);
            let bookmarkItem = document.createElement('div');
            if (bookmark.isFixed && bookmark.isFixed === 1) {
                bookmarkItem.setAttribute('class', 'bookmark fixed-bookmark');
            } else {
                bookmarkItem.setAttribute('class', 'bookmark');
            }
            
            bookmarkItem.setAttribute('id', 'bookmark-' + bookmark.id);

            let bookmarkHref = document.createElement('a');
            bookmarkHref.href = 'javascript:void(0)';
            bookmarkHref.setAttribute('onclick',`visitUrl(${bookmark.id},'${bookmark.url}')`);
            let bookmarkIcon = document.createElement('div');
            bookmarkIcon.setAttribute('class', 'bookmark-icon');
            bookmarkIcon.style.backgroundImage = `url(${bookmark.iconUrl})`;
            bookmarkHref.appendChild(bookmarkIcon);

            let bookmarkTitle = document.createElement('div');
            bookmarkTitle.setAttribute('class', 'bookmark-title');
            bookmarkTitle.innerHTML = bookmark.title;

            bookmarkItem.appendChild(bookmarkHref);
            bookmarkItem.appendChild(bookmarkTitle);
            fixedBookmarkPanel.appendChild(bookmarkItem);
        }
    });
}

/**
 * 初始化随机书签面板
 */
function initRandomBookmarkPanel(isRefresh) {
    getRandomBookmarks(10, (data)=>{
        if (data.code !== 0) {
            console.log(`获取随机书签数据失败:code:${data.code}:message:${data.message}`);
            new jBox('Notice', {
                content: data.message,
                color: 'red',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();
            return;
        }
        let bookmarkArray = data.data;
        let fixedBookmarkPanel = document.getElementById('randomBookmarkPanel');

        if (!bookmarkArray || bookmarkArray.length === 0) {
            return;
        }
        if (isRefresh) {
            $(fixedBookmarkPanel).empty();
        }
        for (let bookmark of bookmarkArray) {
            CACHE.bookmarkMap.set('bookmark-' + bookmark.id, bookmark);
            let bookmarkItem = document.createElement('div');
            bookmarkItem.setAttribute('class', 'bookmark random-bookmark');
            bookmarkItem.setAttribute('id', 'bookmark-' + bookmark.id);

            let bookmarkHref = document.createElement('a');
            bookmarkHref.href = 'javascript:void(0)';
            bookmarkHref.setAttribute('onclick',`visitUrl(${bookmark.id},'${bookmark.url}')`);
            let bookmarkIcon = document.createElement('div');
            bookmarkIcon.setAttribute('class', 'bookmark-icon');
            bookmarkIcon.style.backgroundImage = `url(${bookmark.iconUrl})`;
            bookmarkHref.appendChild(bookmarkIcon);

            let bookmarkTitle = document.createElement('div');
            bookmarkTitle.setAttribute('class', 'bookmark-title');
            bookmarkTitle.innerHTML = bookmark.title;

            bookmarkItem.appendChild(bookmarkHref);
            bookmarkItem.appendChild(bookmarkTitle);
            fixedBookmarkPanel.appendChild(bookmarkItem);
        }
        if (isRefresh) {
            //为新加载的书签添加预览面板
            bookmarkPreviewBox.attach('.bookmark');
        }
    });
}