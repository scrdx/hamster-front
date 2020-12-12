function initBookmarkData(categoryId, isRefresh, key) {

    if (!categoryId) {
        let ul = document.getElementById('menu').getElementsByTagName('ul');
        let root = ul[0];
        categoryId = root.getAttribute('id');
    }

    getBookmark(key, categoryId, (data) => {
        if (data.code !== 0) {
            console.log(`获取书签数据失败:code:${data.code}:message:${data.message}`);
            new jBox('Notice', {
                content: data.message,
                color: 'red',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();
            return;
        }
        //清空已有的书签缓存数据
        CACHE.bookmarkMap.clear();

        let bookmarkArray = data.data;
        let count = 0;
        let ul = document.createElement('ul');
        let li;
        let bookmarkWrapper;

        if (!bookmarkArray || bookmarkArray.length === 0) {
            li = document.createElement('li');
            bookmarkWrapper = document.createElement('div');
            bookmarkWrapper.setAttribute('class', 'bookmark-wrapper');
            li.appendChild(bookmarkWrapper);
            ul.appendChild(li);
        }
        for (let bookmark of bookmarkArray) {
            //放入缓存
            CACHE.bookmarkMap.set('bookmark-' + bookmark.id, bookmark);
            if (count++ % CONST.PAGESIZE === 0) {
                li = document.createElement('li');
                bookmarkWrapper = document.createElement('div');
                bookmarkWrapper.setAttribute('class', 'bookmark-wrapper');
                li.appendChild(bookmarkWrapper);
                ul.appendChild(li);
            }

            let bookmarkItem = document.createElement('div');
            bookmarkItem.setAttribute('class', 'bookmark');
            bookmarkItem.setAttribute('id', 'bookmark-' + bookmark.id);

            let bookmarkHref = document.createElement('a');
            // bookmarkHref.href = bookmark.url;
            bookmarkHref.href = 'javascript:void(0)';
            // bookmarkHref.setAttribute('target', '_blank');
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

            bookmarkWrapper.appendChild(bookmarkItem);
        }
        //新添加一个书签，暂时重新建立整个书签面板
        if (isRefresh) {
            let main = document.getElementById('bookmarkMain');
            $('#bookmarkMain').remove();
            main = document.createElement('div');
            main.setAttribute('id', 'bookmarkMain');
            main.setAttribute('class', 'main');
            main.appendChild(ul);
            document.getElementById('body').appendChild(main);

            //绑定右键菜单
            initContextMenu();
        } else {
            document.getElementById('bookmarkMain').appendChild(ul);
            //绑定右键菜单
            initContextMenu();
        }
        
        $('.main').terseBanner({
            auto: 0,
            animation: 'slide',
            speed: 300
        });
        initBookmarkPreview();
    });
}

/** 书签信息预览 */
function initBookmarkPreview() {
    new jBox('Tooltip', {
        attach: '.bookmark',
        trigger: 'mouseenter',
        isolateScroll: false,
        delayOpen: 300,
        position: {
            x: 'right',
            y: 'top'
        },
        outside: 'x',
        adjustPosition: true,
        adjustTracker: true,
        closeOnMouseleave: true,
        content: $('.bookmark-preview'),
        onOpen: function () {
            let bookmarkId = this.source[0].getAttribute('id');
            setBookmarkPreviewData(bookmarkId);
        }
    });
}

function setBookmarkPreviewData(bookmarkId) {
    let bookmark = CACHE.bookmarkMap.get(bookmarkId);

    //图标
    let previewImg = document.getElementById('previewImg');
    previewImg.style.backgroundImage = `url(${bookmark.iconUrl})`;

    //标题
    let previewTitle = document.getElementById('previewTitle');
    previewTitle.innerHTML = bookmark.title;

    //描述
    let previewDescription = document.getElementById('previewDescription');
    previewDescription.innerHTML = bookmark.description;

    //分类
    let previewCategory = document.getElementById('previewCategory');
    previewCategory.innerHTML = `<span class="preview-des">分类：</span>${bookmark.categoryName}`;
    
    //标签
    let previewTagWrapper = document.getElementById('previewTagWrapper');
    //移除原来的标签
    previewTagWrapper.innerHTML = '<span class="preview-des">标签：</span>';
    if (!bookmark.tagInfoList) {
        return;
    }
    for (let tagInfo of bookmark.tagInfoList) {
        let tag = document.createElement('a');
        tag.setAttribute('class', 'preview-tag');
        tag.setAttribute('href', '#');
        tag.setAttribute('tagId', tagInfo.id);
        tag.innerHTML = tagInfo.name;
        tag.addEventListener("click", ()=>{
            key = tag.innerText;
            initBookmarkData(undefined, true, key);
        });
        previewTagWrapper.appendChild(tag);
    }
}

function visitUrl(id, url) {
    increase(id, (data)=>{
        window.location.href=url;
    });
}