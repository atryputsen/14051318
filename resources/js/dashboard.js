$(function() {
    "use strict";

    $(".textarea").wysihtml5();
});

function closePreview(){
    $('.image-preview').popover('hide');
}

$(document).ready(function(){
    var closebtn = $('<button/>', {
        type:"button",
        text: 'x',
        id: 'close-preview',
        style: 'font-size: initial;'
    });
    closebtn.attr("class","close pull-right");
    closebtn.attr("onclick","closePreview();");
    $('.image-preview').popover({
        trigger:'manual',
        html:true,
        title: "<strong>Preview</strong>"+$(closebtn)[0].outerHTML,
        content: 'Loading...',
        placement:'bottom'
    });
    $('.image-preview-clear').click(function(){
        $('.image-preview').popover('hide');
        $('.image-preview-filename').val("");
        $('.image-preview-clear').hide();
        $('.image-preview-input input:file').val("");
    });
});

$(function() {
    $(".image-preview-input input:file").change(function (){
        var img = $('<img/>', {
            id: 'dynamic',
            width:250,
            height:230
        });
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            $(".image-preview-clear").show();
            $(".image-preview-filename").val(file.name);
            img.attr('src', e.target.result);
            $(".image-preview").attr("data-content",$(img)[0].outerHTML).popover("show");
        };
        reader.readAsDataURL(file);
    });
});
