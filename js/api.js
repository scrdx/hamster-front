var host = "127.0.0.1:8080";

/**
 * 登录
 * 
 * @param {number} userCode 用户编码
 * @param {string} nickname 昵称
 * @param {string} password 密码
 */
function login(userCode, nickname, password,rememberMe, callback) {
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
            "password": password,
            "rememberMe": rememberMe
        })
    }).done((data) => {
        callback(data);
    }).fail((xhr, status) => {
    });
}

function logout(callback) {
    let url = `http://${host}/hamster/user/logout`;
    $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done((data)=>{
        callback(data);
    });
}

/**
 * 获取用户信息
 * 
 * @param {Function} callback 
 */
function getUserInfo(callback) {
    let url = `http://${host}/hamster/user/getUserInfo`;
    $.ajax({
        type: 'GET',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
    }).done((data)=>{
        callback(data);
    });
}

/**
 * 配置用户信息
 * 
 * @param {Object} user 
 * @param {Function} callback 
 */
function editUserConfig(user, callback) {
    let url = `http://${host}/hamster/user/config`;
    $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify(user)
    }).done((data) => {
        callback(data);
    })
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
 * 添加书签
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
 * 删除书签
 * 
 * @param {number} bookmarkId 书签ID
 * @param {Function} callback 回调
 */
function deleteBookmark(bookmarkId, callback) {
    let url = `http://${host}/hamster/bookmark/delete`;
    $.ajax({
        type: 'DELETE',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: { id: bookmarkId }
    }).done((data) => {
        callback(data);
    })
}

/**
 * 更新书签
 * 
 * @param {Object} bookmark 
 * @param {Function} callback 
 */
function updateBookmark(bookmark, callback) {
    let url = `http://${host}/hamster/bookmark/update`;
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

/**
 * 获取常用书签
 * 
 * @param {number} size 数量
 * @param {Funciton} callback 
 */
function getOftenBookmarks(size, callback) {
    let url = `http://${host}/hamster/bookmark/getOften`;
    $.ajax({
        type: 'GET',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: {
            size: size
        }
    }).done((data) => {
        callback(data);
    })
}

/**
 * 获取随机书签
 * 
 * @param {number} size 数量
 * @param {Funciton} callback 
 */
function getRandomBookmarks(size, callback) {
    let url = `http://${host}/hamster/bookmark/getRandom`;
    $.ajax({
        type: 'GET',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: {
            size: size
        }
    }).done((data) => {
        callback(data);
    })
}

/**
 * 固定书签
 * 
 * @param {number} id 书签ID
 * @param {Funciton} callback 
 */
function fix(id, callback) {
    let url = `http://${host}/hamster/bookmark/fix`;
    $.ajax({
        type: 'PUT',
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
 * 取消固定
 * 
 * @param {number} id 书签ID
 * @param {Funciton} callback 
 */
function unfix(id, callback) {
    let url = `http://${host}/hamster/bookmark/unfix`;
    $.ajax({
        type: 'PUT',
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
 * 访问数+1
 * 
 * @param {number} id 书签ID
 * @param {Funciton} callback 
 */
function increase(id, callback) {
    let url = `http://${host}/hamster/bookmark/increase`;
    $.ajax({
        type: 'POST',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: {
            id: id
        }
    }).always((data) => {
        callback(data);
    });
}

function getInfoByAddress(address, callback) {
    let url = `http://${host}/hamster/bookmark/getMetaInfoByUrl`;
    $.ajax({
        type: 'GET',
        url: url,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        data: {
            url: address
        }
    }).done((data) => {
        callback(data);
    });
}

