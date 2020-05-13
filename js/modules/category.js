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
        data = data.data;
        if (!data) {
            return;
        }
        if (data.id) {
            root.setAttribute('id', data.id);
            if (!data.children) {
                return;
            }
            for (let children of data.children) {
                let li = document.createElement('li');
                li.setAttribute('id', children.id);
                li.innerHTML = `<a href="#" id="${children.id}"> ${children.title}</a>`;
                root.appendChild(li);
                if (children.children) {
                    renderTree(li, children.children);
                }
            }
        }
        $('#menu').accordion();

        //由于查询书签数据需要获取当前用户分类的根节点的ID,所以书签初始化动作需要在分类数据加载完成之后执行
        initBookmarkData();
    });

    function renderTree(parent, leafArray) {
        for (let leaf of leafArray) {
            let li = document.createElement('li');
            li.innerHTML = `<a href="#" id="${leaf.id}"> ${leaf.title}</a>`;
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
            }
            if (leaf.children) {
                renderTree(li, leaf.children);
            }
        }
    }

}