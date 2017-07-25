//在4号端口向自己的收藏夹加入题目
//要求参数：problem_id,problem_name和username
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var server=http.createServer
(function(req,res)
   {if(req.url==="favicon.ico")return;
	var body='',flag=0;
	req.on('data',function(data)
					{//console.log(data+"arrival");
					 body+=data;
					 params=querystring.parse(decodeURIComponent(body));
					 }
		   );
	req.on('end',function()
	               {res.setHeader('Access-Control-Allow-Origin','*');  
	                res.writeHead(200,{'Content-Type' : 'plain/text'});
					var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_problems'
                                                           });
                    connection.connect();
                    connection.query('insert into cart (problem_id,username,problem_name) values(?,?,?)',  
                    [params.problem_id,params.username,params.problem_name],
                    function(err,result){  
                      if(err){res.write("problem cannot into cart!");  
                              console.log('添加题目失败'); 
                              console.log(err.message);
               		          }
					  else{res.write("problem has gone into cart!"); 
						   console.log('添加用户成功');
						   }  
						   });
                    connection.end();  
					}
		);
	res.end();
	});
server.listen(4,"localhost",function(){
    console.log("开始监听4...");
});			  