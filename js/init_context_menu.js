'use strict';
/**
 * 初始化右键菜单
 */
function initContextMenu() {
    //图标右键菜单
    var bookmarkRightMenu = util.panel({
        elem: $('.bookmark-wrapper'),
        targets: '.bookmark',
        list: {
            'modify': {
                'txt': '修改'
            },
            'fix': {
                'txt': '固定'
            },
            'delete': {
                'txt': '删除'
            },
            'detail': {
                'txt': '查看详情'
            },
            'share': {
                'txt': '共享'
            }
        },
        callback: function (name) {
            let icon = this;
            let bookmarkId = icon.getAttribute('id');
            bookmarkId = bookmarkId.substring(bookmarkId.indexOf('-') + 1);
            switch (name) {
                case 'modify':
                    //设置编辑框的值
                    setBookmarkEditPanelValue(bookmarkId);
                    CACHE.currentOperate = CONST.UPDATE;
                    $('#addBookmark').click();
                    break;
                case 'fix':
                    fix(bookmarkId,(data)=>{
                        if (data.code !== 0) {
                            new jBox('Notice', {
                                content: '固定失败!',
                                color: 'red',
                                stack: true,
                                closeOnClick: true,
                                delayClose: 200
                            }).open();
                        } else {
                            new jBox('Notice', {
                                content: '固定成功!',
                                color: 'blue',
                                stack: true,
                                closeOnClick: true,
                                delayClose: 200
                            }).open();
                            initOftenBookmarkPanel(true);
                        }

                    });
                    break;
                case 'delete':
                    var confirm = new jBox('Confirm', {
                        draggable: true,
                        confirmButton: '确定',
                        cancelButton: '取消',
                        content: '确认删除该书签?',
                        closeOnConfirm: false,
                        confirm: function () {
                            deleteBookmark(bookmarkId, (data) => {
                                if (data.code !== 0) {
                                    new jBox('Notice', {
                                        content: data.message,
                                        color: 'red',
                                        stack: true,
                                        closeOnClick: true,
                                        delayClose: 100
                                    }).open();
                                    confirm.close();
                                    return;
                                }
                                $(icon).remove();
                                //刷新书签面板
                                initBookmarkData(null, true);
                                confirm.close();
                            });
                        }
                    }).open();
                    break;
                case 'detail':
                    break;
                case 'share':
                    break;
                default:
                    break;
            }
        },
        callbefore: function () {
        }
    });

    //首页常用图标右键菜单
    var fixedBookmarkContextMenu = util.panel({
        elem: $('.panel-container'),
        targets: '.fixed-bookmark',
        list: {
            'unfix': {
                'txt': '取消固定'
            }
        },
        callback: function(name) {
            let icon = this;
            let bookmarkId = icon.getAttribute('id');
            bookmarkId = bookmarkId.substring(bookmarkId.indexOf('-') + 1);
            switch (name) {
                case 'unfix':
                    unfix(bookmarkId,(data)=>{
                        if (data.code !== 0) {
                            new jBox('Notice', {
                                content: '取消固定失败!',
                                color: 'red',
                                stack: true,
                                closeOnClick: true,
                                delayClose: 200
                            }).open();
                        } else {
                            new jBox('Notice', {
                                content: '取消固定成功!',
                                color: 'blue',
                                stack: true,
                                closeOnClick: true,
                                delayClose: 200
                            }).open();
                            initOftenBookmarkPanel(true);
                        }
                    });
                    break;
            }
        }
    });

    //图标面板右键菜单
    var bookmarkWrapper = util.panel({
        elem: $('.main'),
        targets: '.bookmark-wrapper',
        list: {
            'add': {
                'txt': '添加'
            },
            'select': {
                'txt': '批量选择'
            }
        },
        callback: function (name) {
            if (name === 'add') {
                CACHE.currentOperate = CONST.ADD;
                $('#addBookmark').click();
            } else if (name === 'select') {
                alert('批量选择');
            }
        },
        callbefore: function () {
        }
    }
    );
    //分类列表右键菜单
    var categoryRightMenu = util.panel({
        elem: $('#menu'),
        targets: 'li',
        list: {
            'add': {
                'txt': '添加'
            },
            'delete': {
                'txt': '删除'
            }
        },
        callback: function (name) {
            var category = this;
            switch (name) {
                case 'add':
                    var categoryAddPanel = new jBox('Confirm', {
                        title: '添加分类',
                        draggable: 'title',
                        confirmButton: '确定',
                        cancelButton: '取消',
                        content: $('.category-add-panel'),
                        closeOnConfirm: false,
                        confirm: function () {
                            let categoryName = $('#categoryAddText').val();
                            if (isEmpty(categoryName)) {
                                alert('分类名称不能为空');
                                return;
                            }
                            let id = category.getAttribute("id");
                            addCategory(id, categoryName, (data) => {
                                if (data.code !== 0) {
                                    console.log(`添加失败,code:${data.code},message:${data.message}`);
                                    new jBox('Notice', {
                                        content: data.message,
                                        color: 'blue',
                                        stack: true,
                                        closeOnClick: true,
                                        delayClose: 100
                                    }).open();
                                }
                                let submenu = category.getElementsByClassName('submenu');
                                let li = document.createElement('li');
                                li.setAttribute('id', data.data);
                                li.innerHTML = `<a href="#" id=${data.data}> ${categoryName}</a>`;
                                li.setAttribute('id', data.data);
                                if (submenu.length > 0) {
                                    submenu = submenu[0];
                                    submenu.appendChild(li);
                                } else {
                                    submenu = document.createElement('ul');
                                    submenu.className = 'submenu';
                                    submenu.appendChild(li);
                                    category.appendChild(submenu);
                                    let title = category.getElementsByTagName('a')[0];
                                    title.innerHTML = title.innerHTML + '<span class="submenu-indicator">+</span>';
                                }
                                $("#menu").accordion();
                                categoryAddPanel.close();
                                clear();
                                initCategorySelector();
                            });
                        }
                    }).open();
                    break;
                case 'delete':
                    let submenu = category.getElementsByClassName('submenu');
                    let id = category.getAttribute('id');
                    if (submenu.length > 0) {
                        new jBox('Notice', {
                            content: '该分类下有子分类，无法删除!',
                            color: 'blue',
                            stack: true,
                            closeOnClick: true,
                            delayClose: 100
                        }).open();
                    } else {
                        var confirm = new jBox('Confirm', {
                            draggable: true,
                            confirmButton: '确定',
                            cancelButton: '取消',
                            content: '确认删除该分类?',
                            closeOnConfirm: false,
                            confirm: function () {
                                deleteCategory(id, (data) => {
                                    if (data.code !== 0) {
                                        console.log(`删除分类异常:code:${data.code}:message:${data.message}`);
                                        new jBox('Notice', {
                                            content: data.message,
                                            color: 'blue',
                                            stack: true,
                                            closeOnClick: true,
                                            delayClose: 100
                                        }).open();
                                        return;
                                    }
                                    let siblings = $(category).siblings();
                                    let parent = $(category).parent();
                                    $(category).remove();
                                    if (siblings.length === 0) {
                                        let title = parent.prev();
                                        title.removeClass();
                                        title.find('.submenu-indicator').remove();
                                        parent.remove();
                                    }
                                    confirm.close();
                                    initCategorySelector();
                                });
                            }
                        }).open();
                    }

                    break;
                default:
                    break;
            }
        },
        callbefore: function () {
        }
    });

    let categoryRootContextMenu = util.panel({
        elem: $('#category'),
        targets: 'div',
        list: {
            'add': {
                'txt': '添加'
            }
        },
        callback: function (name) {
            let category = this;
            var categoryAddPanel = new jBox('Confirm', {
                title: '添加分类',
                draggable: 'title',
                confirmButton: '确定',
                cancelButton: '取消',
                content: $('.category-add-panel'),
                closeOnConfirm: false,
                confirm: function () {
                    let categoryName = $('#categoryAddText').val();
                    if (isEmpty(categoryName)) {
                        alert('分类名称不能为空');
                        return;
                    }
                    addCategory(1, categoryName, (data) => {
                        if (data.code !== 0) {
                            new jBox('Notice', {
                                content: data.message,
                                color: 'blue',
                                stack: true,
                                closeOnClick: true,
                                delayClose: 100
                            }).open();
                            return;
                        }
                        let ul = category.getElementsByTagName('ul');
                        let li;
                        if (ul.length > 0) {
                            ul = ul[0];
                            li = document.createElement('li');
                            li.setAttribute('id', data.data);
                            li.innerHTML = `<a href="#" id=${data.data}> ${categoryName}</a>`;
                            ul.appendChild(li);
                        }
                        $("#menu").accordion();
                        categoryAddPanel.close();
                        clear();
                        initCategorySelector();
                    });
                }
            }).open();
        },
        callbefore: function () {
        }
    });
}

function setBookmarkEditPanelValue(bookmarkId) {
    let bookmark = CACHE.bookmarkMap.get('bookmark-' + bookmarkId);
    $('#bookmarkId').attr('bookmarkId', bookmark.id);
    $('#bookmarkFormUrlText').val(bookmark.url);
    $('#bookmarkFormTitle').val(bookmark.title);
    $('#bookmarkFormDescription').val(bookmark.description);
    let categoryId = [];
    categoryId.push(bookmark.categoryId);
    comboTree.setSelection(categoryId);
    if (!bookmark.tagInfoList) {
        return;
    }
    for (let tag of bookmark.tagInfoList) {
        $('#bookmarkFormTag').tagEditor('addTag', tag.name, true);
    }
}