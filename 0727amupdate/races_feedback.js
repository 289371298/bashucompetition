//在8888号端口加载题目
//要求参数：requireuser
//返回参数：全网比赛信息(tot,racename,level,duration,type,starttime)
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var racename=[],level=[],duration=[],type=[],starttime=[];
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
							   req.on('end',function(){connect_and_check(params,res);});			  
							   res.end();
							   });	
server.listen(8888,"localhost",function(){
    console.log("开始监听8888...");
});					  
function connect_and_check(params,res)
  {var connection=mysql.createConnection({host:'localhost',
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
					   if(ans===1){console.log("Access Denied");}//res.write("Access Denied");//用户权限不足，临时权限用户
					   else connect_and_feed(params,ans,res); 
					   }
					);
   connection.end();
   return ans;   
   }
function connect_and_feed(params,managelevel,res)
  {var connection=mysql.createConnection({host:'localhost',
                                          user:'root',
	                                      password:'990311',
	                                      port:'3306',
	                                      database:'bsoj_contests'
                                         });
   connection.connect();
   connection.query('SELECT * FROM allraces',
     function(err,result)
	   {var tot=0,len=result.length;
		for(var i=0;i<len;i++)
		  {if(managelevel<result[i].level)continue;//目前是设置为不能看到严格大于自己managelevel的比赛
           racename[tot]=result[i].racename;
           level[tot]=result[i].level;
           duration[tot]=result[i].duration;
           type[tot]=result[i].type;
           starttime[tot]=result[i].starttime;	
		   tot++;		   
		   }  			
		//console.log(tot); 
	    var obj=JSON.stringify({  "tot":tot,
			                 "racename":racename,
		                        "level":level,
								"duration":duration,
								"type":type,
								"starttime":starttime});
		console.log(obj);//res.write(obj);	
		});
   connection.end();
   }