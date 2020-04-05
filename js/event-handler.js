//退出登录
function logout() {
    alert("logout");
}
$('#logout').click(function () {
    var categoryAddPanel = new jBox('Confirm', {
        title: '退出登录',
        draggable: 'title',
        confirmButton: '确定',
        cancelButton: '取消',
        content: '确认退出吗?',
        closeOnConfirm: false,
        confirm: function () {
            logout();
            categoryAddPanel.close();
        }
    }).open();
});

$('#bookmark-form-ok').click(() => {
    let id = $('#bookmarkId').attr('bookmarkId');
    let url = $('#bookmark-form-url-text').val();
    let title = $('#bookmark-form-title').val();
    let description = $('#bookmark-form-description').val();
    let categoryId = comboTree.getSelectedItemsId();
    let tags = $('#bookmark-form-tag').tagEditor('getTags')[0].tags;
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
    let picData = document.getElementById('icon-image').getAttribute('src');
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

$('#bookmark-form-upload').click(() => {
    let fileInput = document.getElementById('icon-file');
    $('#icon-file').click();
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

$('#bookmark-form-cancel').click(() => {
    bookmarkAddWindow.close();
    clear();
})

$('#bookmark-form-empty').click(() => {
    clear();
})