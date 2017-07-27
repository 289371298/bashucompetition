//在8888号端口找出并饿死所有到期的注册和临时用户
//没有要求参数，只需要接到任意数据即可
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
	res.writeHead(200,{'Content-Type' : 'plain/text'});
	req.on('data',function(data)
					{console.log(data+"arrival");
					 body+=data;
					 params=querystring.parse(decodeURIComponent(body));
					 }
		   );
	req.on('end',function()
	               {var connection=mysql.createConnection({host:'localhost',
	                                                       user:'root',
	                                                       password:'990311',
	                                                       port:'3306',
	                                                       database:'bsoj_users'
                                                           });
                    connection.connect();
                    connection.query('SELECT * FROM users WHERE managelevel<=2',  
                    function(err,result){						
                      if(err){//res.write("users cannot out of list!");  
                              console.log('这场饥荒由于天意而终止………'); 
                              console.log(err.message);
               		          }
					  else{//res.write("users has been expelled from list!"); 
						   var len=result.length;
						   var tmr=new Date(),last=0;
						   var now=tmr.toLocaleString();
						   for(var i=0;i<len;i++)
						     {if(result[i].managelevel===1 && (tmr-result[i].regdate)>7*86400*1000)last=i;
							  else if(result[i].managelevel===2 && (tmr-result[i].regdate)>30*86400*1000)last=i;
							  }
						   for(var i=0;i<len;i++)
						     {console.log(result[i].username+" "+result[i].managelevel+" "+now+" "+result[i].regdate+" "+(tmr-result[i].regdate));
						      //请注意：在15万年之内，这个数据库可能就会因为数据溢出而出问题。
							  if(result[i].managelevel===1 && (tmr-result[i].regdate)>7*86400*1000)
							    {console.log("shallow starvation"+result[i].username);
								 connection.query("DELETE FROM users WHERE username='"+result[i].username+"'",function(err,result){console.log("executed 1");});
								 if(i===last)connection.end();
								 }
							  else if(result[i].managelevel===2 && (tmr-result[i].regdate)>30*86400*1000)
							    {console.log("deep starvation"+result[i].username);
							     connection.query("DELETE FROM users WHERE username='"+result[i].username+"'",function(err,result){console.log("executed 2");});						
							     if(i===last)connection.end();
								 }
						      }  
					    }});
					}
		);
	res.end();
	});
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});			  