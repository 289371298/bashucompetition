//在8888号端口修改格言（默认身份验证已经做了）
//要求参数：new_motto，requireuser
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
                    connection.query('UPDATE users SET motto='+'"'+params.new_motto+'" WHERE username='+'"'+params.requireuser+'"',  
                    function(err,result){  
                      if(err){success=0;
					          var obj=JSON.stringify({success});
						      res.write(obj);  
                              console.log('修改格言失败'); 
                              console.log(err.message);
               		          }
					  else{success=1;
					       var obj=JSON.stringify({success});
						   res.write(obj);  
						   console.log('修改格言成功');
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