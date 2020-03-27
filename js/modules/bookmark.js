function initBookmarkData() {
    let key = $('#search-text').val();

    let ul = document.getElementById('menu').getElementsByTagName('ul');
    let root = ul[0];
    let categoryId = root.getAttribute('id');

    getBookmark(key, categoryId, (data) => {
        if (data.code !== 0) {
            console.log(`获取书签数据失败:code:${data.code}:message:${data.message}`);
            new jBox('Notice',{
                content: data.message,
                color: 'red',
                stack: true,
                closeOnClick: true,
                delayClose: 100
            }).open();   
            return;
        }
        console.log(data);
        let bookmarkArray = data.data;
        let count = 0;
        let ul = document.createElement('ul');
        let li;
        let bookmarkWrapper;

        for (let bookmark of bookmarkArray) {
            if (count %5 === 0) {
                li = document.createElement('li');
                bookmarkWrapper = document.createElement('div');
                bookmarkWrapper.setAttribute('class', 'bookmark-wrapper');
                li.appendChild(bookmarkWrapper);
                ul.appendChild(li);
            }
            
            let bookmarkItem = document.createElement('div');
            bookmarkItem.setAttribute('class', 'bookmark');
            bookmarkItem.setAttribute('id', bookmark.id);

            let bookmarkHref = document.createElement('a');
            bookmarkHref.href = bookmark.url;
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

            count++; 
        }
        document.getElementById('bookmark-main').appendChild(ul);
        $('.main').terseBanner({
            auto: 0,
            animation: 'slide',
            speed: 600
       });
       initBookmarkPreview();
    });
}

/** 书签信息预览 */
function initBookmarkPreview() {
    let bookmarkPreview = new jBox('Tooltip', {
        attach: '.bookmark',
        trigger: 'mouseenter',
        delayOpen: 500,
        position: {
            x: 'right',
            y: 'top'
        },
        outside: 'x',
        adjustPosition: true,
        adjustTracker: true,
        closeOnMouseleave: true,
        content: $('.bookmark-preview')
    });
}
