//处理submitpage放在8888号端口的服务器上
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params,success;
var fs=require('fs');
var crypto=require('crypto');
var md5=crypto.createHash('md5');
var server=http.createServer(function(req,res)
                    {if(req.url!=="/favicon.ico")//解析读入的数据，得到三个参数：username，password，password_2
						{var body='',flag=0;
						 res.setHeader('Access-Control-Allow-Origin','*');  
						 res.writeHead(200,{'Content-Type' : 'application/JSON'});
						 console.log("!!!");
						 req.on('data',function(data){console.log("dataarrive");body+=data;params=querystring.parse(decodeURIComponent(body));});					                              
						 req.on('end',function(){console.log("???");
						                         if(params.password!==params.password_2){console.log("两次密码不一致！");res.write("两次密码不一致！");}
											     else
												   {//connect(params);
											        //console.log("not connected now");
													var connection=mysql.createConnection({host:'localhost',
	                                                                                       user:'root',
	                                                                                        password:'990311',
	                                                                                        port:'3306',
	                                                                                        database:'bsoj_users'
                                                                                           });
												   //console.log("ready connected");
                                                   connection.connect();
												   //console.log("connected!!!");
                                                   var todate=new Date();
												   var today=todate.toLocaleDateString(); 
												   
												   var result=md5.update(params.password).digest('hex');
                                                   connection.query('INSERT INTO users (username,rating,motto,racelevel,managelevel,racenumber,password,regdate) values(?,1500,"no comment",1,1,0,?,?)',  
                                                   [params.username,result,today],
                                                   function(err,result){  
                                                     if(err){success=0;
													         var obj=JSON.stringify({success});
															 res.write(obj);											 
                                                             console.log('添加用户失败'); 
                                                             console.log(err.message);
                                                             }
												   else{success=1;
													    var obj=JSON.stringify({success});
														res.write(obj);		
														console.log('添加用户成功');
														}  
                                                       });
                                                   connection.end();  
												  }
						                         }
								);
						 console.log("...");
						 res.end();
						 }
					 }
				             );
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});

  
   
