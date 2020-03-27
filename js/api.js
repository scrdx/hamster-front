var host = "127.0.0.1:8080";

/**
 * 登录
 * 
 * @param {number} userCode 用户编码
 * @param {string} nickname 昵称
 * @param {string} password 密码
 */
function login(userCode, nickname, password) {
    let url = `http://${host}/hamster/user/login`;
    $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            "userCode": userCode,
            "nickname": nickname,
            "password": password
        })
    }).done((data) => {
        console.log(data);
    }).fail((xhr, status) => {
    });
}

/**
 * 添加分类
 * 
 * @param {number} parentId 父分类ID
 * @param {string} title 分类名称
 * @param {Function} callback 回调
 */
function addCategory(parentId, title, callback) {
    let url = `http://${host}/hamster/category/add`;
    $.ajax({
        type: 'POST',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: {
            parentId: parentId,
            title: title
        }
    }).done((data) => {
        callback(data);
    })
}

/**
 * 删除分类
 * 
 * @param {number} id 分类ID
 * @param {Function} callback 回调
 */
function deleteCategory(id, callback) {
    let url = `http://${host}/hamster/category/delete`;
    $.ajax({
        type: 'Delete',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: {
            id: id
        }
    }).done((data) => {
        callback(data);
    })
}

/**
 * 查询分类
 * 
 * @param {Function}} callback 回调
 */
function getCategory(callback) {
    let url = `http://${host}/hamster/category/query`;
    $.ajax({
        type: 'GET',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
    }).done((data) => {
        callback(data);
    })
}

/**
 * 添加分类
 * 
 * @param {Object} bookmark 
 * @param {Function} callback 
 */
function addBookmark(bookmark, callback) {
    let url = `http://${host}/hamster/bookmark/add`;
    $.ajax({
        type: 'POST',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(bookmark)
    }).done((data) => {
        callback(data);
    })
}

/**
 * 根据分类ID查询书签,不分页
 * 
 * @param {string} key 关键字（标题或者tag）
 * @param {number} categoryId 分类ID
 * @param {Function} callback 
 */
function getBookmark(key, categoryId, callback) {
    let url = `http://${host}/hamster/bookmark/query`;
    $.ajax({
        type: 'GET',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: {
            key: key,
            categoryId: categoryId
        }
    }).done((data) => {
        callback(data);
    })

}