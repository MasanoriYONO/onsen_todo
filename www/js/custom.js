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

function todo_createDB() {
    console.log("todo_createDB.");
    
    p_db.transaction(todo_populateSQL, todo_errorCB);
}

function todo_resetDB() {
    console.log("todo_resetDB.");
    
    p_db.transaction(todo_resetSQL, todo_errorCB);
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