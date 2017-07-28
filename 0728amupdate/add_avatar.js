//在8888号端口加入一个头像
//要求参数：requireuser,new_avatar
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
					 }
		   );
	req.on('end',function()
	               {
					var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_users'
                                                           });
                    connection.connect();
                    connection.query('UPDATE users SET avatar="'+params.new_avatar+'"WHERE username="'+params.requireuser+'"',  
                    function(err,result){				
                      if(err){//res.write("avatar cannot into user!");  
                              console.log('添加头像失败'); 
                              console.log(err.message);
               		          }
					  else{//res.write("avatar has gone into user!"); 
					       
						   console.log('添加头像成功');
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