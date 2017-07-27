//在8888号端口加入一个公告
//要求参数：raceid,content,author,answer
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var server=http.createServer
(function(req,res)
   {if(req.url==="/favicon.ico")return;
	var body='',flag=0;
	res.setHeader('Access-Control-Allow-Origin','*');  
	res.writeHead(200,{'Content-Type' : 'plain/text'});
	req.on('data',function(data)
					{console.log(data+"arrival");
					 body+=data;
					 params=querystring.parse(decodeURIComponent(body));
					 console.log("step1");
					 }
		   );
	req.on('end',function()
	               {
					var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_contests'
                                                           });
                    connection.connect();
					console.log(params.raceid);
					console.log(params.content);
					console.log(params.author);
					console.log(params.answer);
					console.log("step2");
                    connection.query('INSERT INTO allannouncements (raceid,content,author,answer) values(?,?,?,?)',  
                    [params.raceid,params.content,params.author,params.answer],
                    function(err,result){
                      console.log("step3");						
                      if(err){//res.write("announcement cannot into race!");  
                              console.log('添加公告失败'); 
                              console.log(err.message);
               		          }
					  else{//res.write("announcement has gone into race!"); 
					       
						   console.log('添加公告成功');
						   }  
						   });
                    connection.end();  
					}
		);
	res.end();
	});
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});			  