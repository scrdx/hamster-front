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
    let url = $('#bookmark-form-url-text').val();
    let title = $('#bookmark-form-title').val();
    let description = $('#bookmark-form-description').val();
    let categoryId = comboTree.getSelectedItemsId();
    let tags = $('#bookmark-form-tag').tagEditor('getTags')[0].tags;
    let cropData = cropper.getData();
    let param = {};
    param.url = url;
    param.title = title;
    param.description = description;
    param.categoryId =categoryId;
    if (tags) {
        param.tags = tags.join(',');
    }
    param.cropParam = cropData;
    param.pic = document.getElementById('icon-image').getAttribute('src');
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
        bookmarkAddWindow.close();
    });
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