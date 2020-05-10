//退出登录
$('#logout').click(function () {
    var categoryAddPanel = new jBox('Confirm', {
        title: '退出登录',
        draggable: 'title',
        confirmButton: '确定',
        cancelButton: '取消',
        content: '确认退出吗?',
        closeOnConfirm: false,
        confirm: function () {
            logout((data)=>{
                window.location.href="login.html";
            });
            categoryAddPanel.close();
        }
    }).open();
});

$('#bookmarkFormOk').click(() => {
    let id = $('#bookmarkId').attr('bookmarkId');
    let url = $('#bookmarkFormUrlText').val();
    let title = $('#bookmarkFormTitle').val();
    let description = $('#bookmarkFormDescription').val();
    let categoryId = comboTree.getSelectedItemsId();
    let tags = $('#bookmarkFormTag').tagEditor('getTags')[0].tags;
    let cropData = cropper.getData();
    let param = {};
    param.id = id;
    param.url = url;
    param.title = title;
    param.description = description;
    param.categoryId = categoryId;
    if (tags) {
        param.tags = tags.join(',');
    }
    param.cropParam = cropData;
    let picData = document.getElementById('iconImage').getAttribute('src');
    if (picData.indexOf('data:image') !== -1) {
        param.pic = picData;
    }

    if (CACHE.currentOperate === CONST.ADD) {
        addBookmark(param, (data) => {
            if (data.code !== 0) {
                console.log(`添加书签失败!code:${data.code}:message:${data.message}`);
                new jBox('Notice', {
                    content: data.message,
                    color: 'red',
                    stack: true,
                    closeOnClick: true,
                    delayClose: 100
                }).open();
                return;
            }
            new jBox('Notice', {
                content: '添加成功',
                color: 'green',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();

            //刷新书签面板
            initBookmarkData(undefined, true);
            bookmarkAddWindow.close();
            //清除对话框数据
            clear();
        });
    } else if (CACHE.currentOperate === CONST.UPDATE) {
        updateBookmark(param, (data) => {
            if (data.code !== 0) {
                console.log(`修改书签失败!code:${data.code}:message:${data.message}`);
                new jBox('Notice', {
                    content: data.message,
                    color: 'red',
                    stack: true,
                    closeOnClick: true,
                    delayClose: 100
                }).open();
                return;
            }
            new jBox('Notice', {
                content: '修改成功',
                color: 'green',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();

            //刷新书签面板
            initBookmarkData(undefined, true);
            bookmarkAddWindow.close();
            //清除对话框数据
            clear();
        });
    }

});

$('#bookmarkFormUpload').click(() => {
    let fileInput = document.getElementById('iconFile');
    $('#iconFile').click();
    fileInput.addEventListener('change', () => {
        if (!fileInput.value) {
            return;
        }
        let file = fileInput.files[0];
        console.log(file.name);
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            new jBox('Notice', {
                content: '请选择图片文件!',
                color: 'blue',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();
            return;
        }
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = e.target.result;
            cropper.replace(data);
        };
        reader.readAsDataURL(file);
    })
});

$('#bookmarkFormCancel').click(() => {
    bookmarkAddWindow.close();
    clear();
})

$('#bookmarkFormEmpty').click(() => {
    clear();
})

//用户配置
$('#avatarFormUpload').click(() => {
    let fileInput = document.getElementById('avatarFile');
    $('#avatarFile').click();
    fileInput.addEventListener('change', () => {
        if (!fileInput.value) {
            return;
        }
        let file = fileInput.files[0];
        console.log(file.name);
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            new jBox('Notice', {
                content: '请选择图片文件!',
                color: 'blue',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();
            return;
        }
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = e.target.result;
            configCropper.replace(data);
        };
        reader.readAsDataURL(file);
    })
});

$('#avatarFormOk').click(() => {
    let nickname = $('#userConfigFormNickname').val();
    let cropData = configCropper.getData();
    let param = {};
    param.nickname = nickname;
    param.cropParam = cropData;
    let picData = document.getElementById('avatarImage').getAttribute('src');
    if (picData.indexOf('data:image') !== -1) {
        param.avatarPic = picData;
    }
    editUserConfig(param, (data) => {
        if (data.code !== 0) {
            console.log(`编辑用户信息失败!code:${data.code}:message:${data.message}`);
            new jBox('Notice', {
                content: data.message,
                color: 'red',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();
            return;
        }
        let userInfo = data.data;
        document.getElementById('headAvatar').style.backgroundImage = `url(${userInfo.avatarUrl})`;
        CACHE.userInfo.userCode = userInfo.userCode;
        CACHE.userInfo.nickname = userInfo.nickname;
        console.log(CACHE.userInfo.nickname);
        new jBox('Notice', {
            content: '编辑成功',
            color: 'green',
            stack: true,
            closeOnClick: true,
            delayClose: 100
        }).open();

        //刷新书签面板
        userConfigEditWindow.close();
        //清除对话框数据
        clear();
    });

});

$('#avatarFormCancel').click(() => {
    userConfigEditWindow.close();
    clear();
});

$('#avatarFormEmpty').click(() => {
    clear();
});

//搜索
$('#search').click(() => {
    let key = $('#searchText').val();
    let selectedCategoryId;
    if (!key) {
        //如果没有输入任何搜索条件，则回到原来选择的分类下
        selectedCategoryId = CACHE.currentCategoryId;
    }
    initBookmarkData(selectedCategoryId, true, key);
});