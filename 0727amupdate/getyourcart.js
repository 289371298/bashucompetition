//在8888号端口处理打开收藏夹
//返回的所有参数都是数组
//传入参数：requireuser
//返回参数tot,problem_id和problem_name
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var stars=[];
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
                              {if(req.url==="/favicon.ico")return;
							   res.setHeader('Access-Control-Allow-Origin','*');  
							   res.writeHead(200,{'Content-Type' : 'application/JSON'});
							   var body='',flag=0;
						       req.on('data',function(data)
							                         {console.log("data!");
													  console.log(data+"arrival");
						                              body+=data;
													  params=querystring.parse(decodeURIComponent(body));
						                              }
								      );
							   req.on('end',function(){console.log("end!"),connect_and_feed(params,res);});
							   
							  });	
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});			  
function connect_and_feed(params,res)
  {var connection=mysql.createConnection({host:'localhost',
                                          user:'root',
	                                      password:'990311',
	                                      port:'3306',
	                                      database:'bsoj_problems'
                                         });
   connection.connect();
   connection.query('select * from cart where username="'+params.requireuser+'"',
     function(err,result)
	   {var tot=0,len=result.length;
	    console.log(len);
		for(var i=0;i<len;i++)
		  {stars[tot]={};
		   stars[tot].problem_name=result[i].problem_name;
           stars[tot].problem_id=result[i].id;
		   tot++;
		   }  			
	   var obj=JSON.stringify({stars});
		console.log(obj);
		res.write(obj);res.end();
		}
                    );   
   connection.end();
   }