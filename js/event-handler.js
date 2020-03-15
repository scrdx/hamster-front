//退出登录
function logout(){
    alert("logout");
}
$('#logout').click(function(){
    var categoryAddPanel = new jBox('Confirm', {
        title: '退出登录',
        draggable: 'title',
        confirmButton: '确定',
        cancelButton: '取消',
        content: '确认退出吗?',
        closeOnConfirm: false,
        confirm: function() {
            logout();
            categoryAddPanel.close();
        }
    }).open();
});