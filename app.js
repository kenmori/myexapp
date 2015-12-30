/**
*   localhost:8080/books
**/

var express = require('express');
var app = express();
/* express 4.xでは,以下のコードを追加
var bodyParser = require('body-parser');
*/
var bookId = 100;

function findBook(id){
    for(var i=0;i< books.length;i++){
        if(books[i].id === id){
            return books[i];
        }
    }
    return null;
}
function removeBook(id){
    var bookIndex = 0;
    for (var i = 0;i< books.length; i++){
        if(books[i].id === id){
            bookIndex = i;
        }
    }
    books.splice(bookIndex,1);
}

//CORS リクエストをサポートするためのセットアップ
var allowCrossDomain = function(req,response,next){
    response.header('Access-Contorl-Allow-Origin',"http://localhost");
    response.header('Access-Contorl-Allow-Methods',
        'OPTIONS,GET,PUT,DELETE');
    response.header('Access-Contorl-Allow-Headers','Content-Type');
    if('OPTIONS' == req.method){
        response.send(200);
    }else{
        next();
    }
};
/* express4.0.0 よりも前のバージョンでは、以下を記述*/
app.configure(function(){
    //リクエストのボディで提供されるJSONコード
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
});
/* express 4.0.0以降の場合は、代わりに以下のコードを使用
    app.use(allowCrossDomain);
    app.use(bodyParser());
*/

var books = [
    {id:98,author:'Stephen King',title:'The Shining',year : 1977},
    {id:99,author:'George Orwell',title:1949}
    ];
/**
* HTTP GET /books
* Bookのリストを返す
**/

app.get('/books',function(request,response){
    response.header('Access-Contorl-Allow-Origin','*');
    console.log('In GET function');
    response.json('books');
});

/**
*  HTTP GET /book/:id
* id : 取得したいBookの一意な識別子
* 指定されたID のBookを返す
*該当するBookがない場合は404を返す
**/

app.get('/books/:id',function(request,response){
    response.header('Access-Contorl-Allow-Origin','*');
    console.log('Getting a book with id' + request.params.id);
    var book = findBook(parseInt(request.params.id, 10));
    if(book === null){
        response.send(404);
    }
    else{
        response.json(book);
    }
});


/**
*HTTP POST /books/
*このリクエストボディに含まれているBookを保存
*正常終了の場合は200を返す
**/
app.post('/books/',function(request,response){
    response.header('Access-Contorl-Allow-Origin','*');
    var book = request.body;
    console.log('Saveing book with the folowing structure' + JSON.stringify(book));
    book.id = bookId++;
    books.push(book);
    response.json(book);
});

/**
*HTTP PUT /book/:id
*id:更新したいBookの一意な識別子
＊該当するBookが内場合は404を返す
**/

app.put('/books/:id',function(request,response){
    response.header('Access-Contorl-Allow-Origin','*');
    var book = request.body;
    console.log('Updating Book' + JSON.stringify(book));
    var currentBook = findBook(parseInt(request.params.id,10));
    if(currentBook === null){
        response.send(404);
    }
    else{
        //Bookをローカルに保存
        currentBook.title = book.title;
        currentBook.year = book.year;
        currentBook.author = book.author;
        response.json(book);
    }
});

/**
* HTTP DELETE /book:id
* id:　削除したBookの一意な識別子
* 該当するBookがない場合は404を返す
**/

app.delete('/books/:id',function(request,response){
    console.log('calling delete');
    response.header('Access-Contorl-Allow-Origin','*');
    var book = findBook(parseInt(request.params.id,10));
    if(book === null){
        console.log('Could not find book');
        response.send(404);
    }
    else{
        console.log('Deleting ' + request.params.id);
        removeBook(parseInt(request.params.id,10));
        response.send(200);
    }
});
/*ボート8080でAPIを起動*/
app.listen(8080);
