//在8888号端口修改问题（默认这个界面经过了身份验证）
//需求参数：problem_id,mother_id,memory,time,type,name,content_description,content_input,content_output,content_in_explain,
//content_out_explain,content_data_range,pichtml,managelevel
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
	                                                       database:'bsoj_problems'
                                                           });
                    connection.connect();
                    connection.query('UPDATE problems SET'+
					                 'mother_id='+params.mother_id+
									 ' ,memory='+params.memory+
									 ' ,time='+params.time+
									 ' ,type='+params.type+
									 ' ,name="'+params.name+'"'+
									 ' ,content_description="'+params.content_description+'"'+
									 ' ,content_input="'+params.content_input+'"'+
									 ' ,content_output="'+params.content_output+'"'+
									 ' ,content_in_explain="'+params.content_in_explain+'"'+
									 ' ,content_out_explain="'+params.content_out_explain+'"'+
									 ' ,content_data_range="'+params.content_data_range+'"'+
									 ' ,pichtml="'+params.pichtml+'"'+
									 ' ,managelevel='+params.managelevel+
									 ' WHERE id='+params.problem_id,
					/*connection.query('UPDATE problems SET (mother_id,memory,time,type,name,content_description,content_input,'+
					                 'content_output,content_in_explain,content_out_explain,content_data_range,acnum,trynum,pichtml,managelevel)'+
									 'values(?,?,?,?,?,?,?,?,?,?,?,0,0,?,?)',  
                    [params.mother_id,params.memory,params.time,params.type,params.name,
					                 params.content_description,params.content_input,params.content_output,
									 params.content_in_explain,params.content_out_explain,params.content_data_range,
									 0,0,params.pichtml,params.managelevel],
                    */
					function(err,result){  
                      if(err){success=0;
						      var obj=stringify({success});
						      res.write(obj);  
                              console.log('修改题目失败'); 
                              console.log(err.message);
               		          }
					  else{success=1;
					       var obj=stringify({success});
						   res.write(obj); 
						   console.log('修改题目成功');
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