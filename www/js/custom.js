// This is a JavaScript file

function list2addpage(){
    console.log("list2addpage.");
    
    var m = moment();
    
    var options = {limit_date:m.format("YYYY-MM-DD")};
    
    myNavigator.pushPage("page_add.html", options);   
}

$(document).on('pageinit', '#page_add', function(event) {
    console.log("pageinit page_add.");
    var page = myNavigator.getCurrentPage();
    $("#todo_limit_date").val(page.options.limit_date);
});