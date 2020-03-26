/**
 * 初始化分类树
 */
function initCategoryTree() {
    let ul = document.getElementById('menu').getElementsByTagName('ul');
    let root = ul[0];

    getCategory((data) => {
        if (data.code !== 0) {
            console.log(`获取分类信息异常:code:${data.code},message:${data.message}`);
            return;
        }
        console.log(data);
        data = data.data;
        if (data.id) {
            root.setAttribute('id', data.id);
            for (let children of data.children) {
                let li = document.createElement('li');
                li.setAttribute('id', children.id);
                li.innerHTML = `<a href="#"> ${children.title}</a>`;
                root.appendChild(li);
                if (children.children) {
                    renderTree(li, children.children);
                }
            }
        }
        $('#menu').accordion();
    });

    function renderTree(parent, leafArray) {
        for (let leaf of leafArray) {
            let li = document.createElement('li');
            li.innerHTML = `<a href="#"> ${leaf.title}</a>`;
            li.setAttribute('id', leaf.id);

            let submenu = parent.getElementsByClassName('submenu');
            if (submenu.length > 0) {
                submenu = submenu[0];
                submenu.appendChild(li);
            } else {
                submenu = document.createElement('ul');
                submenu.className = 'submenu';
                submenu.appendChild(li);
                parent.appendChild(submenu);
                let title = parent.getElementsByTagName('a')[0];
                title.innerHTML = title.innerHTML + '<span class="submenu-indicator">+</span>';
            }
            if (leaf.children) {
                renderTree(li, leaf.children);
            }
        }
    }

}