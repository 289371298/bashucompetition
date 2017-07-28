//8888端口的简单小函数之二
//给raceid返回其他信息
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params,raceid;
var fs=require('fs');
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
                              {if(req.url==="/favicon.ico")return;
							   res.setHeader('Access-Control-Allow-Origin','*');  
							   res.writeHead(200,{'Content-Type' : 'application/JSON'});
							   var body='',flag=0;
						       req.on('data',function(data)
							                         {body+=data;
													  params=querystring.parse(decodeURIComponent(body));
						                              }
								      );
							   req.on('end',function(){
													   connect_and_feed(params,res);
													   //res.write(obj); 
													   });
							  res.end();
							  });	
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});					  
function connect_and_feed(params,res)
  {var connection=mysql.createConnection({host:'localhost',
                                          user:'root',
	                                      password:'990311',
	                                      port:'3306',
	                                      database:'bsoj_contests'
                                         });
   connection.connect();
   connection.query('SELECT * FROM allraces WHERE id='+"'"+params.raceid+"'",
     function(err,result)
	   {//console.log("Res="+result[0].racelevel+' '+result[0].managelevel);
        var id=result[0].id;
        var level=result[0].level;
        var duration=result[0].duration;
        var type=result[0].type;
        var starttime=result[0].starttime;  		
	    console.log(level+" "+id+' '+level+' '+duration+' '+type+' '+starttime);
		var obj=JSON.stringify({id,level,duration,type,starttime});
		console.log(obj);
		//res.write(obj);
		}
                    );   
   connection.end();
   }