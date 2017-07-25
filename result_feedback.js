//在2号端口返回提交记录
//面对的是全局所有用户的提交记录
//返回的所有参数都是数组
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var submitTime=[],prob=[],lang=[],length=[],runtime=[],memory=[],state=[];
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
													   var level=connect_and_check(params);
													   if(level===1)//用户权限不足，临时权限用户
													    {res.write("Data Restricted");
							                             return;}
													   else//根据权限在数据库中查找
													    {connect_and_feed(params,level);
														 var obj=JSON.stringify(submitTime,prob,lang,length,runtime,memory,state);
							                             res.write(obj);
														 }
													  });
							  res.end();
							  });	
server.listen(2,"localhost",function(){
    console.log("开始监听2...");
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
	                                      database:'bsoj_problems'
                                         });
   connection.connect();
   connection.query('select * from submit',
     function(err,result)
	   {var tot=0,len=result.row;
		for(var i=0;i<len;i++)
		  {if(managelevel<result[i].level)continue;//目前是设置为不能看到严格大于自己managelevel的提交记录
		   tot++;
           submitTime[tot]=result[i].submittime;
           prob[tot]=result[i].prob;
           lang[tot]=result[i].language;
           length[tot]=result[i].len;
           runtime[tot]=result[i].runtime;		   
		   memory[tot]=result[i].memory;
		   state[tot]=result[i].status;
		   }  			
	    }
                    );   
   connection.end();
   }