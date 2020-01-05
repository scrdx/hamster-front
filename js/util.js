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