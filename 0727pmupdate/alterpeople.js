//8888号端口，改变一个用户的比赛等级和权限等级（默认操作之前已经过身份验证）
//需求参数：new_racelevel,new_managelevel,requireuser
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
	res.writeHead(200,{'Content-Type' : 'application/JSON'});
	req.on('data',function(data)
					{//console.log(data+"arrival");
					 body+=data;
					 params=querystring.parse(decodeURIComponent(body));
					 }
		   );
	req.on('end',function()
	               {var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_users'
                                                           });
                    connection.connect();
                    connection.query('UPDATE users SET racelevel='+'"'+params.new_racelevel+'",'+'managelevel='+'"'+params.new_managelevel+'"'+' WHERE username='+'"'+params.requireuser+'"',  
                    function(err,result){  
                      if(err){//res.write("failed to change");
                              success=0;
     						  var obj=JSON.stringify({success});
                              res.write(obj);							  
                              console.log('修改用户权限失败'); 
                              console.log(err.message);
               		          }
					  else{//res.write("successfully changed");
                           success=1;
     					   var obj=JSON.stringify({success});
                           res.write(obj);					  
						   console.log('修改用户权限成功');
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