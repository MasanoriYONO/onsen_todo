// This is a JavaScript file
var p_db = window.openDatabase("monaca.todo", "1.0", "monaca.todo", 24 * 1024 * 1024);
var todo_desc;
var todo_title;
var todo_limit_date;
var array_todo = [];
var confirm_id;
var delete_id;
var update_id = -1;
var view_index;

function todo(id, title, description, limit_date){
    this.id = id;
    this.title = title;
    this.description = description;
    this.limit_date = limit_date;
}

function modify_div(id){
    confirm_id = id
    
    navigator.notification.confirm(
            "削除しますか？", 
            deleteCallback, 
            "このTODOを削除", 
            ["OK","キャンセル"]);
    
}

function deleteCallback(buttonIndex){
    if(buttonIndex == 1){
        delete_id = array_todo[confirm_id].id;
        console.log("deleteCallback:" + delete_id);
        
        todo_delete_DB();
    }
}

//// DB作成。
function todo_populateSQL(tx) {
    console.log("todo_populateSQL.");
    // tx.executeSql('DROP TABLE IF EXISTS TODO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TODO (id INTEGER PRIMARY KEY AUTOINCREMENT, title, description, limit_date)');
}
// DB初期化。
function todo_resetSQL(tx) {
    console.log("todo_resetSQL.");
    
    tx.executeSql('DROP TABLE IF EXISTS TODO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TODO (id INTEGER PRIMARY KEY AUTOINCREMENT, title, description, limit_date)');
}

function todo_view_record_SQL(tx) {
    console.log("todo_view_record_SQL.");
    
    tx.executeSql(
        'SELECT * FROM TODO ORDER BY id ASC'
        , []
        , todo_querySuccess
        , todo_errorCB);
}

function todo_insertSQL(tx) {
    console.log("todo_insertSQL.");
    
    tx.executeSql('INSERT INTO TODO (title, description,limit_date) VALUES ("' + todo_title + '","' + todo_desc + '","' + todo_limit_date + '")');
}

function todo_delete_SQL(tx) {
    console.log("todo_delete_SQL.");
    
    tx.executeSql('DELETE FROM TODO where id = ' + delete_id);
    delete_id = 0;
}

function todo_querySuccess(sql, results){
    console.log("todo_querySuccess.");

    var str="";
    array_todo = [];
    for(var i = 0 ; i < results.rows.length; i++){
        str += "id: " + results.rows.item(i).id + "\n"
            + "title: " + results.rows.item(i).title + "\n"
            + "description: " + results.rows.item(i).description + "\n"
            + "limit_date: " + results.rows.item(i).limit_date + "\n\n";
        
        var temp_todo = new todo(results.rows.item(i).id,
                        results.rows.item(i).title,
                        results.rows.item(i).description,
                        results.rows.item(i).limit_date);
        
        array_todo.push(temp_todo);
    }
    if(str){
        // console.log(str);
        
        for(var i=0; i < array_todo.length; i++){
            console.log(array_todo[i].id);
            console.log(array_todo[i].title);
            console.log(array_todo[i].description);
            console.log(array_todo[i].limit_date);
        }
    }
    
    var todo_list = new TodoList();
    todo_list.load();
}

function todo_insert_success_CB() {
    console.log("todo_insert_success_CB.");
    
    p_db.transaction(todo_view_record_SQL, todo_errorCB);
}

function todo_createDB() {
    console.log("todo_createDB.");
    
    p_db.transaction(todo_populateSQL, todo_errorCB);
}

function todo_resetDB() {
    console.log("todo_resetDB.");
    
    p_db.transaction(todo_resetSQL, todo_errorCB);
}

function todo_insertDB() {
    console.log("todo_insertDB.");
    
    p_db.transaction(todo_insertSQL, todo_errorCB, todo_insert_success_CB);
}

function todo_getFromDB() {
    console.log("todo_getFromDB.");
    
    p_db.transaction(todo_view_record_SQL, todo_errorCB);
}

function todo_delete_DB(){
    console.log("todo_delete_DB.");
    
    p_db.transaction(todo_delete_SQL, todo_errorCB, todo_insert_success_CB);
}

function todo_errorCB(err) {
    console.log("todo_errorCB.");
    alert("SQL 実行中にエラーが発生しました: " + err.message);
}

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

function view_todo(index){
    
    console.log("view_todo.");
    
    view_index = index;
    
    console.log(array_todo[index].title);
    console.log(array_todo[index].description);
    
    var options = {title:array_todo[index].title
        ,description:array_todo[index].description
        ,limit_date:array_todo[index].limit_date};
    
    myNavigator.pushPage("page_view.html", options);
        
    // myNavigator.on('postpush', function(e) {
    //     if(e.enterPage.name == "page_view.html"){
    //         $(e.enterPage.element).find("#todo_view_title").text(array_todo[index].title);
    //         $(e.enterPage.element).find("#todo_view_desc").html(array_todo[index].description.replace(/[\n\r]/g, "<br />"));
    //         $(e.enterPage.element).find("#todo_view_limit_date").text(array_todo[index].limit_date);
    //     }
    // });
}

$(document).on('pageinit', '#page_view', function(event) {
    console.log("pageinit page_view.");
    var page = myNavigator.getCurrentPage();
    $("#todo_view_title").text(page.options.title);
    $("#todo_view_desc").html(page.options.description.replace(/[\n\r]/g, "<br />"));
    $("#todo_view_limit_date").text(page.options.limit_date.replace(/-/g, "/"));
});

function todo_edit(){
    console.log("todo_edit.");

    var options = {title:array_todo[view_index].title
        ,description:array_todo[view_index].description
        ,limit_date:array_todo[view_index].limit_date};
        
    myNavigator.pushPage("page_edit.html", options);

    // myNavigator.on('postpush', function(e) {
    //     if(e.enterPage.name == "page_edit.html"){
    //         $(e.enterPage.element).find("#todo_update_title").val(array_todo[view_index].title);
    //         $(e.enterPage.element).find("#todo_update_desc").val(array_todo[view_index].description);
    //         $(e.enterPage.element).find("#todo_update_limit_date").val(array_todo[view_index].limit_date);
    //     }
    // });
}

$(document).on('pageinit', '#page_edit', function(event) {
    console.log("pageinit page_edit.");
    var page = myNavigator.getCurrentPage();
    $("#todo_update_title").val(page.options.title);
    $("#todo_update_desc").val(page.options.description);
    $("#todo_update_limit_date").val(page.options.limit_date);
});

function todo_regi(){
    console.log("todo_regi.");
    
    todo_title = $("#todo_title").val();
    todo_desc = $("#todo_desc").val();
    todo_limit_date = $("#todo_limit_date").val();
    
    console.log("todo_title:" + todo_title);
    console.log("todo_desc:" + todo_desc);
    
    todo_insertDB();
    
    navigator.notification.confirm(
            "登録しました。", 
            function(){
                console.log("登録しました。");
                myNavigator.popPage();
            }, 
            "TODO", 
            ["OK"]);
    
}