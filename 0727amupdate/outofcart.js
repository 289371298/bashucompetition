//在8888号端口向自己的收藏夹删除题目
//要求参数：problem_id和username
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params,success;
var fs=require('fs');
var server=http.createServer
(function(req,res)
   {if(req.url==="/favicon.ico")return;
	var body='',flag=0;
	res.setHeader('Access-Control-Allow-Origin','*');  
	res.writeHead(200,{'Content-Type' : 'plain/text'});
	req.on('data',function(data)
					{//console.log(data+"arrival");
					 body+=data;
					 params=querystring.parse(decodeURIComponent(body));
					 }
		   );
	req.on('end',function()
	               {
					var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_problems'
                                                           });
                    connection.connect();
                    connection.query('DELETE FROM cart WHERE username="'+params.username+'" AND problem_id='+params.problem_id,  
                    [params.problem_id,params.username,params.problem_name],
                    function(err,result){  
                      if(err){success=0;
					          var obj=JSON.stringify({success});
						      res.write(obj);
                              					  
                              console.log('删除题目失败'); 
                              console.log(err.message);
               		          }
					  else{success=1;
						   //res.write("problem has gone out of cart!"); 
						   var obj=JSON.stringify({success});
						   res.write(obj);
						   console.log('删除题目成功');
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