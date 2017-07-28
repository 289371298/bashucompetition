//在8888号端口加载problemset
//需求参数：requireuser
//返回参数：tot,type，name，acnum，trynum
var http=require("http");
var querystring=require('querystring');
var mysql=require("mysql");
var params;
var fs=require('fs');
var type=[],name=[],acnum=[],trynum=[];
var server=http.createServer(function(req,res)//传来的参数：requireuser，提出要求的用户
                              {if(req.url==="/favicon.ico")return;
							   var body='',flag=0;
							   res.setHeader('Access-Control-Allow-Origin','*');  
							   res.writeHead(200,{'Content-Type' : 'application/JSON'});
						       req.on('data',function(data)
							                         {//console.log(data+"arrival");
						                              body+=data;
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
					   if(ans===1)console.log("Access Denied");//用户权限不足，临时权限用户
					   else connect_and_feed(ans,res);
					   }	 
					);
   connection.end();
     
   }
function connect_and_feed(managelevel,res)
  {var connection=mysql.createConnection({host:'localhost',
                                          user:'root',
	                                      password:'990311',
	                                      port:'3306',
	                                      database:'bsoj_problems'
                                         });
   connection.connect();
   connection.query('SELECT * FROM problems',
     function(err,result)
	   {var tot=0,len=result.length;
		for(var i=0;i<len;i++)
		  {if(managelevel<result[i].managelevel)continue;//目前是设置为不能看到严格大于自己managelevel的题目
           type[tot]=result[i].type;
		   name[tot]=result[i].name;
           acnum[tot]=result[i].acnum;
           trynum[tot]=result[i].trynum;
		   tot++;
		   }  			
	     var obj=JSON.stringify({"tot":tot,"type":type,"name":name,"acnum":acnum,"trynum":trynum});
         console.log(obj);//res.write(obj);
		 });   
   connection.end();
   }