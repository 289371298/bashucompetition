//在5号端口加载题目
//要求参数：problem_id,username
//返回参数：题目应该有的各项信息
//(id,memory,time,type,name,content_description,content_input,content_output,content_in_explain,content_out_explain
//content_data_range,acnum,trynum,pichtml)
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
	                res.writeHead(200,{'Content-Type' : 'application/JSON'});
					var level=connect_and_check(params);
					var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_problems'
                                                           });
                    connection.connect();
                    connection.query('select * from problems where id='+params.problem_id),  
                    function(err,result){  
                      if(level<result[0].managelevel){console.log("Access Denied");}//权限不足
					  else {var obj=JSON.stringify(result[0].id,result[0].memory,result[0].time,result[0].type,result[0].name,
					                 result[0].content_description,result[0].content_input,
									 result[0].content_output,result[0].content_in_explain,
									 result[0].content_out_explain,result[0].content_data_range,
									 result[0].acnum,result[0].trynum,result[0].pichtml
					                 );
					        res.write(obj);
							}
						 };
                    connection.end();  
					}
		);
	res.end();
	});


server.listen(5,"localhost",function(){
    console.log("开始监听5...");
});			
function connect_and_check(params)
  {var connection=mysql.createConnection(
     {host:'localhost',
	  user:'root',
	  password:'990311',
	  port:'3306',
	  database:'bsoj_users'
      });
   var ans;
   connection.connect();
   connection.query('select managelevel from users where username=='+params.username,
                    function(err,result){ans=result[0].managelevel;}
					);
   connection.end();
   return ans;   
   }