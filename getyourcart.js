//在3号端口处理打开收藏夹
//返回的所有参数都是数组
//返回两个参数problem_id和problem_name
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var problem_id=[],problem_name=[];
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
                              {if(req.url==="favicon.ico")return;
							   var body='',flag=0;
						       req.on('data',function(data)
							                         {console.log(data+"arrival");
						                              body+=data;
													  params=querystring.parse(decodeURIComponent(body));
						                              }
								      );
							   req.on('end',function(){res.setHeader('Access-Control-Allow-Origin','*');  
											           res.writeHead(200,{'Content-Type' : 'application/JSON'});
													   //var id=connect_and_check(params);
													   connect_and_feed(params);
													   var obj=JSON.stringify(problem_id,problem_name);
							                           res.write(obj);
													  });
							  res.end();
							  });	
server.listen(3,"localhost",function(){
    console.log("开始监听3...");
});			  
function connect_and_feed(params,id)
  {var connection=mysql.createConnection({host:'localhost',
                                          user:'root',
	                                      password:'990311',
	                                      port:'3306',
	                                      database:'bsoj_problems'
                                         });
   connection.connect();
   connection.query('select * from cart where userid=='+params.requireuser,
     function(err,result)
	   {var tot=0,len=result.length;
		for(var i=0;i<len;i++)
		  {tot++;
           problem_name[tot]=result[i].problem_name;
           problem_id[tot]=result[i].problem_id;
		   }  			
	    }
                    );   
   connection.end();
   }