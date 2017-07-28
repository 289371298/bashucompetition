//在8888号端口处理打开头像
//返回的所有参数都是数组
//传入参数：requireuser
//在8888号端口打开比赛相关公告
//返回：avatar
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params,avatar;
var fs=require('fs');
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
                              {if(req.url==="/favicon.ico")return;
							   res.setHeader('Access-Control-Allow-Origin','*');  
							   res.writeHead(200,{'Content-Type' : 'application/JSON'});
							   var body='',flag=0;
						       req.on('data',function(data)
							                         {//console.log(data+"arrival");
						                              body+=data;
													  params=querystring.parse(decodeURIComponent(body));
						                              }
								      );
							   req.on('end',function(){connect_and_feed(params,res);});
							   res.end();
							  });	
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});			  
function connect_and_feed(params,res)
  {var connection=mysql.createConnection({host:'localhost',
                                          user:'root',
	                                      password:'990311',
	                                      port:'3306',
	                                      database:'bsoj_users'
                                         });
   connection.connect();
   connection.query('SELECT * FROM users WHERE username="'+params.requireuser+'"',
     function(err,result)
	   {var tot=0,len=result.length;
	    avatar=result[0].avatar;
	    var obj=JSON.stringify({avatar});
		console.log(obj);//res.write(obj);
		}
                    );   
   connection.end();
   }