//在6号端口加载题目
//要求参数：requireuser
//返回参数：全网比赛信息(racename,level,duration,type,starttime)
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var racename=[],level=[],duration=[],type=[],starttime=[];
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
                              {if(req.url==="favicon.ico")return;
							   var body='',flag=0;
						       req.on('data',function(data)
							                         {console.log(data+"arrival");
						                              body+=data;
													  params=querystring.parse(decodeURIComponent(body));
						                              }
								      );
							   req.on('end',function(){res.setHeader('Access-Control-Allow-Origin','*');  
											           res.writeHead(200,{'Content-Type' : 'application/JSON'});
													   var managelevel=connect_and_check(params);
													   if(managelevel===1)//用户权限不足，临时权限用户
													    {res.write("Data Restricted");
							                             return;}
													   else//根据权限在数据库中查找
													    {connect_and_feed(params,managelevel);
														 var obj=JSON.stringify(racename,level,duration,type,starttime);
							                             res.write(obj);
														 }
													  });
							  res.end();
							  });	
server.listen(6,"localhost",function(){
    console.log("开始监听6...");
});					  
function connect_and_check(params)
  {var connection=mysql.createConnection({host:'localhost',
	  user:'root',
	  password:'990311',
	  port:'3306',
	  database:'bsoj_users'
      });
   var ans;
   connection.connect();
   connection.query('select managelevel from users where username=='+params.requireuser,
                    function(err,result)
					  {ans=result[0].managelevel;}
					);
   connection.end();
   return ans;   
   }
function connect_and_feed(params,level)
  {var connection=mysql.createConnection({host:'localhost',
                                          user:'root',
	                                      password:'990311',
	                                      port:'3306',
	                                      database:'bsoj_contests'
                                         });
   connection.connect();
   connection.query('select * from allraces',
     function(err,result)
	   {var tot=0,len=result.row;
		for(var i=0;i<len;i++)
		  {if(managelevel<result[i].level)continue;//目前是设置为不能看到严格大于自己managelevel的比赛
		   tot++;
           racename[tot]=result[i].racename;
           level[tot]=result[i].level;
           duration[tot]=result[i].duration;
           type[tot]=result[i].type;
           starttime[tot]=result[i].starttime;		   
		   }  			
	    }
                    );   
   connection.end();
   }