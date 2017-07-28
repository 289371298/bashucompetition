//在8888号端口打开比赛相关公告
//要求参数：raceid
//返回：tot,content,author,answer
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var content=[],author=[],answer=[];
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
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
							   req.on('end',function(){connect_and_feed(params,res);});
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
   connection.query('SELECT * FROM allannouncements WHERE raceid='+params.raceid,
     function(err,result)
	   {var tot=0,len=result.length;
	    console.log(len);
		for(var i=0;i<len;i++)
		  {content[tot]=result[i].content;
           author[tot]=result[i].author;
		   answer[tot]=result[i].answer;
		   tot++;
		   }  			
	    var obj=JSON.stringify({"tot":tot,content":content,"author":author,"answer":answer});
		console.log(obj);//res.write(obj);
		}
                    );   
   connection.end();
   }