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
    $('#bookmark-form-url-text').val('');
    $('#bookmark-form-title').val('');
    $('#bookmark-form-description').val('');
    comboTree.clearSelection();
    $('#category-tree').val('');
    let tags = $('#bookmark-form-tag').tagEditor('getTags')[0].tags;
    for (i = 0; i < tags.length; i++) { $('#bookmark-form-tag').tagEditor('removeTag', tags[i]); }

    //分类添加对话框
    $('#category-add-text').val('');
}