//在8888号端口添加问题（默认这个界面经过了身份验证）
//需求参数：mother_id,memory,time,type,name,content_description,content_input,content_output,content_in_explain,
//content_out_explain,content_data_range,pichtml,managelevel
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
					{console.log(data+"arrival");
					 body+=data;
					 params=querystring.parse(decodeURIComponent(body));
					 }
		   );
	req.on('end',function()
	               {console.log("end!");
					//return;
					var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_problems'
                                                           });
                    connection.connect();
                    connection.query('insert into problems (mother_id,memory,time,type,name,content_description,content_input,'+
					                 'content_output,content_in_explain,content_out_explain,content_data_range,acnum,trynum,managelevel)'+
									 'values(?,?,?,?,?,?,?,?,?,?,?,0,0,?)',  
                    [params.mother_id,params.ml,params.tl,params.type,params.name,
					                 params.desc,params.input,params.output,
									 params.input_form,params.output_form,params.tips,
									 0,0,params.managelevel],
                    function(err,result){  
                      if(err){success=0;
					          var obj=JSON.stringify(success);
						      //res.write(obj);  
                              console.log('添加题目失败'); 
                              console.log(err.message);
               		          }
					  else{success=1;
					       var obj=JSON.stringify(success);  
						   //res.write(obj); 
						   console.log('添加题目成功');
						   }  
						   });
                    connection.end();
					res.end();  
					}
		);
	
	});
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});			  