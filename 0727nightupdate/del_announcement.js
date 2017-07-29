//在8888号端口删除所有和该比赛相关的公告
//要求参数：raceid
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
	res.writeHead(200,{'Content-Type' : application/JSON'});
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
	                                                       database:'bsoj_contests'
                                                           });
                    connection.connect();
                    connection.query('DELETE FROM allannouncements WHERE raceid="'+params.raceid+'"',  
                    function(err,result){						
                      if(err){//res.write("announcement cannot out of race!"); 
                              success=0;
                              var obj=JSON.stringify({success});
							  res.write(obj); 
                              console.log('删除公告失败'); 
                              console.log(err.message);
               		          }
					  else{//res.write("announcement has gone out of race!"); 
					       success=1;
						   var obj=JSON.stringify({success});
                           res.write(obj);						   
						   console.log('删除公告成功');
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