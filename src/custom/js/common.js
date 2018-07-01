function xyModalFull(url, title) {
    var index = admin.popup.open({
        type: 2,
        content: url,
        maxmin: false,
        title: title
    });
    layer.full(index);
}
