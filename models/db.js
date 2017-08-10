//这个模块里面封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
function _connectDB(callback) {
    var url ="mongodb://localhost:27017/test2";
    //var url = settings.dburl;   //从settings文件中，都数据库地址
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}

//4.插入数据
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })
};
//5 查找数据，找到所有数据。args是个对象查找4个参数，在哪个集合查，查什么，分页设置，查完之后做什么(也许没有分页设置)
//exports.find = function (collectionName, json, C, D) {
//    var result = [];    //结果数组
//    //先判断传入的参数有几个  如何解析数据
//    if (arguments.length == 3) {
//        //那么参数C就是callback，参数D没有传。
//        var callback = C;
//        var skipnumber = 0;
//        //数目限制
//        var limit = 0;
//    } else if (arguments.length == 4) {
//        var callback = D;
//        var args = C;
//        //应该省略的条数(第一页5条数据则第2页就是从跳过前5=5*(2-1)条 开始查起)
//                             //每页显示大小      页码
//        var skipnumber = args.pageSize * (args.page-1) || 0;
//        //数目限制
//        var limit = args.pageSize || 0;
//        //排序方式
//        var sort = args.sort || {};
//    } else {
//        throw new Error("find函数的参数个数，必须是3个，或者4个。");
//        return;
//    }
//
//    //连接数据库，连接之后查找所有
//    _connectDB(function (err, db) {
//        var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);
//        cursor.toArray(function(err,docs){
//                if (err) {
//                    callback(err, null);
//                    db.close(); //关闭数据库
//                    return;
//                }
//                result=docs;
//                //遍历结束，没有更多的文档了
//                callback(null, result);
//                db.close(); //关闭数据库
//        });
//    });
//}

//删除
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        //删除
        db.collection(collectionName).deleteMany(
            json,
            function (err, results) {
                if(err){
                    console.log("删除失败");
                }
                callback(err, results);
                db.close(); //关闭数据库
            }
        );
    });
}

//修改
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(
            json1,
            json2,
            function (err, results) {
                callback(err, results);
                db.close();
            });
    })
}

exports.getAllCount = function (collectionName,callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    })
}

//自定义查询方法的封装
/*
 db.liuyanben.find({});
 db.liuyanben.find({"name":"张三"});
 db.liuyanben.find().skip(5).limit(5).sort();
 collectionName:集合名称
 json1:查找条件
 json2:对查找结果进行筛选如:skip limit sort
      调用时格式如:"pageSize":5,"page":3
 callback:回调函数
 若分页需要传入4个参数
 若不分页需要传入3个参数
 */
exports.find=function(collectionName,json1,C,D){//C,D表示占位
    //根据用户传入的参数个数 判断C位到底是json2还是回调函数
    if(arguments.length==3){
        //如若用户传入3个参数(集合名称，查询条件，回调函数)
        var callback = C;
        var skipnum = 0 ;
        var limitnum = 0 ;
        var sort = {} ;
    }else if(arguments.length==4){
        //如若用户传入4个参数(集合名称，查询条件，筛选条件,回调函数)
        var callback = D;
        var args =C;//"pageSize":5,"page":3,"sort":{"shijian":-1}
        //根据args计算出skipnum的 limitnum的值
        var skipnum=args.pageSize*(args.page-1)||0;//||0表示默认查询第0条
        var limitnum=args.pageSize||0;//||0表示默认查询第0条
        var sort =args.sort||{};
    }
    //建立连接
    _connectDB(function(err,db){
       var allData=db.collection(collectionName).find(json1).skip(skipnum).limit(limitnum).sort(sort);
        allData.toArray(function(err,arr){
            //
            if(err){
                //将查找结果转化成数据对象报错
                callback(err,null);
                db.close();
                return
            }
            //查找结果成功转成了数组
            allData=arr;
            callback(null,allData);//将allData返回
            db.close();
        })
    })
}