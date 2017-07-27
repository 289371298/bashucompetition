//在8888号端口返回提交记录（比赛中）
//面对的是比赛时所有用户的提交记录
//要求参数：racename
//返回的所有参数都是数组（同全局）
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var submitTime=[],prob=[],lang=[],length=[],runtime=[],memory=[],state=[],point=[];
var server=http.createServer(function(req,res)//传来的参数：racename，比赛名
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
							   req.on('end',function(){//根据权限在数据库中查找
													   connect_and_feed(params,res);   
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
   connection.query("SELECT * from "+params.racename+"_submit",//选择一个比赛对应的提交表
     function(err,result)
	   {var tot=0,len=result.length;
	    console.log(len);
		for(var i=0;i<len;i++)
		  {//目前是设置为不能看到严格大于自己managelevel的提交记录
           submitTime[tot]=result[i].submittime;
           prob[tot]=result[i].prob;
           lang[tot]=result[i].language;
           length[tot]=result[i].len;
           runtime[tot]=result[i].runtime;		   
		   memory[tot]=result[i].memory;
		   state[tot]=result[i].status;
		   point[tot]=result[i].point;
		   tot++;
		   }  			
	    var obj=JSON.stringify({      "tot":tot,
			                   "submitTime":submitTime,
		                             "prob":prob,
									 "lang":lang,
								   "length":length,
								  "runtime":runtime,
								   "memory":memory,
								    "state":state,
		                            "point":point});
		console.log(obj);//res.write(obj);
		}
                    );   
   connection.end();
   }