//8888号端口给一个简单的小函数
//给username返回权限和比赛等级
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params,managelevel,racelevel;
var fs=require('fs');
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
                              {if(req.url==="/favicon.ico")return;
							   res.setHeader('Access-Control-Allow-Origin','*');  
							   res.writeHead(200,{'Content-Type' : 'application/JSON'});
							   var body='',flag=0;
						       req.on('data',function(data)
							                         {body+=data;
													  params=querystring.parse(decodeURIComponent(body));
						                              }
								      );
							   req.on('end',function(){
													   connect_and_feed(params,res);
													   
													   //res.write(obj); 
													   });
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
   connection.query('SELECT managelevel,racelevel FROM users WHERE username='+"'"+params.requireuser+"'",
     function(err,result)
	   {//console.log("Res="+result[0].racelevel+' '+result[0].managelevel);
		racelevel=result[0].racelevel;
        managelevel=result[0].managelevel;	   
	    console.log(managelevel+" "+racelevel);
		var obj=JSON.stringify({managelevel,racelevel});
		console.log(obj);
		//res.write(obj);
		}
                    );   
   connection.end();
   }