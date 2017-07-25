//处理submitpage放在1号端口的服务器上
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var crypto=require('crypto');
var md5=crypto.createHash('md5');
var server=http.createServer(function(req,res)
                    {if(req.url!=="favicon.ico")//解析读入的数据，得到三个参数：username，password，password_2
						{var body='',flag=0;
						 req.on('data',function(data){body+=data;params=querystring.parse(decodeURIComponent(body));});					                              
						 req.on('end',function(){res.setHeader('Access-Control-Allow-Origin','*');  
											     res.writeHead(200,{'Content-Type' : 'plain/text'});
												 if(params.password!==params.password_2){res.write("两次密码不一致！");}
											     else
												   {//connect(params);
													var connection=mysql.createConnection({host:'localhost',
	                                                                                       user:'root',
	                                                                                        password:'990311',
	                                                                                        port:'3306',
	                                                                                        database:'bsoj_users'
                                                                                           });
                                                   connection.connect();
                                                   var todate=new Date();
												   var today=todate.toLocaleDateString(); 
												   var result=md5.update(params.password).digest('hex');
                                                   connection.query('insert into users (username,rating,motto,racelevel,managelevel,racenumber,password,regdate) values(?,1500,"no comment",1,1,0,?,?)',  
                                                   [params.username,result,today],
                                                   //这里还缺一个md5加密  
                                                   function(err,result){  
                                                     if(err){res.write("user registration failed!");  
                                                             console.log('添加用户失败'); 
                                                             console.log(err.message);
                                                             }
												   else{console.log('添加用户成功');}  
                                                       });
                                                   connection.end();  
												  }
						                         }
								);
						 res.end();
						 }
					 }
				             );
server.listen(1,"localhost",function(){
    console.log("开始监听1...");
});

  
   
