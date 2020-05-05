function isParent(obj, parentObj) {
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}

function isEmpty(obj) {
    return typeof obj === 'undefined' || null === obj || '' === obj;
}

function clear() {
    //书签对话框
    $('#bookmarkFormUrlText').val('');
    $('#bookmarkFormTitle').val('');
    $('#bookmarkFormDescription').val('');
    comboTree.clearSelection();
    $('#categoryTree').val('');
    let tags = $('#bookmarkFormTag').tagEditor('getTags')[0].tags;
    for (i = 0; i < tags.length; i++) { $('#bookmarkFormTag').tagEditor('removeTag', tags[i]); }

    //分类添加对话框
    $('#categoryAddText').val('');

    //书签编辑框状态默认为添加状态
    CACHE.currentOperate = CONST.ADD;

    //用户配置弹窗信息
    $('#userConfigFormNickname').val('');
    if (configCropper) {
        configCropper.replace('./img/default_icon.png');
    }
}