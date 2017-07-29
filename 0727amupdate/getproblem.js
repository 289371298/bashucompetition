//在8888号端口加载题目
//要求参数：problem_id,requireuser
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
	req.on('end',function(){connect_and_check(params,res);});
	res.end();
	});
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});			
function connect_and_check(params,res)
  {var connection=mysql.createConnection(
     {host:'localhost',
	  user:'root',
	  password:'990311',
	  port:'3306',
	  database:'bsoj_users'
      });
   var ans;
   connection.connect();
   connection.query('SELECT managelevel FROM users WHERE username="'+params.requireuser+'"',
                    function(err,result)
					  {ans=result[0].managelevel;
					   //console.log("success"+ans);
					   var connection2=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_problems'
                                                           });
                    connection2.connect();
                    connection2.query('SELECT * FROM problems WHERE id='+params.problem_id,  
                    function(err,result){					
                      if(ans<result[0].managelevel){console.log("Access Denied");}//权限不足
					  else {//write
					       var obj=JSON.stringify({
						             "mother_id":result[0].mother_id,
						             "memory":result[0].memory,
									 "time":result[0].time,
									 "type":result[0].type,
									 "name":result[0].name,
					                 "content_description":result[0].content_description,
									 "content_input":result[0].content_input,
									 "content_output":result[0].content_output,
									 "content_in_explain":result[0].content_in_explain,
									 "content_out_explain":result[0].content_out_explain,
									 "content_data_range":result[0].content_data_range,
									 "acnum":result[0].acnum,
									 "trynum":result[0].trynum,
						             "pichtml":result[0].pichtml}
					                 );
					        console.log(obj);//res.write(obj);
							}
						 connection.end();
					     connection2.end();
						 });
                        
					   }
					);
   
   return ans;   
   }