/**
 * Created with JetBrains PhpStorm.
 * User: yansunrong
 * Date: 13-7-17
 * Time: 上午11:59
 * To change this template use File | Settings | File Templates.
 */
function Relation(json,options) {
    var supportsTouch = ('ontouchstart' in window) || window.DocumentTouch && g.doc instanceof DocumentTouch;
    var container = d3.select("#box").html('');
    options = options || {};
    var width = options.width || 640,//画布的大小
        height = options.height || 300,//画布的大小
        distance = 150,//距离
        mousedown_node = null,// 当时按下的结点,用于控制缩放和大小
        trans = [0, 0], scale = 1, // 初始的位置和缩放的大小比例
        vis,//底层的画布,用于拖拽
        g,//全部的容器.
        link,//连接的那条线
        relation,//两个结点的关系说明
        textG,//存放关系说明的容器
        node,//人物头像的整个结点容器
        force,//force的引用
        svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "svg")
            .attr("pointer-events", "all")

    if(supportsTouch && screen.width <= 640){
        trans[0]= -(width/2 - screen.width /2);
    }

    // console.log(json)
    countPosition();
    // return;
    vis = svg.append('svg:g')
        .call(d3.behavior.zoom().on("zoom", rescale))
        .on("dblclick.zoom", null)//取水双击放大的功能
        .attr("width", width)

    g = vis.append('svg:g')
        .attr("width", width)
        .on("mousedown", function () {
            if (!mousedown_node) {
                vis.call(d3.behavior.zoom().on("zoom", rescale).translate(trans).scale(scale));
            }
        })

    g.append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#fff');

    //调整位置,让画布居中显示

    g.attr("transform",
        "translate(" + trans + ")");






    //初始化force的相关
    force = d3.layout.force()
        .gravity(0)
        .distance(120)
        .friction(.9)//摩擦力,默认是.9  越小,就走的慢
        .charge(-400)// 分散的力度
        .linkStrength(0.9)// 绳的索引力,越小,就拉不动, 只剩下自己动了.
        .size([width, height]);

    force
        .nodes(json.nodes)
        .links(json.links)
        .start();


    //绘制线条
    link = g.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link");

    //绘制关系说明
    relation = g.selectAll(".relation").data(json.links)

    textG = relation.enter().append("svg:g").attr("class", "relation").attr("fill", "green").attr("stroke-width", "1");
    textG.append("rect").attr("width", 20).attr("height", 12).attr("x", -10).attr("y", -5)
        .attr("fill", "#fff");

    textG.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("y", 5)
        .attr("fill", "#666666")
        .text(function (d, i) {
            return d.relation
        });

    var isMove = false,o=null;
    //绘制结点
    node = g.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("touchstart", function (event) {
            isMove = false;
            o = d3.event.touches[0].target;
            vis.call(d3.behavior.zoom().on("zoom", null))
        })
        .on("touchmove",function(){
            isMove = true;
        })
        .on("touchend", function () {
            if( !isMove ) {
                //console.log(d3.select(this).data()[0]["url"])
                location = d3.select(this).data()[0]["url"]
            }
            vis.call(d3.behavior.zoom().on("zoom", rescale).translate(trans).scale(scale));
        })
        .on("mousedown", function () {
            mousedown_node = true;
            vis.call(d3.behavior.zoom().on("zoom", null))
        })
        .on("mouseup", function () {
            //alert(2)
            mousedown_node = false;
            vis.call(d3.behavior.zoom().on("zoom", rescale).translate(trans).scale(scale));
        })
        .call(force.drag);

    //绘制图片,图片需要有一个圆圈,在一位朋友帮助下,找到clipath的方法.@李海波(百度一个同事)
    node.append("clipPath")
        .attr("id", function (d, i) {
            return "clip" + i
        })
        .append("circle")
        .attr("x", -25)
        .attr("y", -25)
        .attr("r", 25)


    //绘制图片
    node.append("image")
        .attr("xlink:href", function(d){
            return d.image;
        })
        .attr("clip-path", function (d, i) {
            return "url(#clip" + i + ")";
        })
        .attr("x", -25)
        .attr("y", -25)
        .attr("width", 50)
        .attr("height", 50);

    //图片上的圆
    node.append("circle")
        .attr("x", -25)
        .attr("y", -25)
        .attr("r", 25)
        .attr("stroke-width", function (d) {
            return d.level == 1 ? 4 : 3;
        })
        .attr("stroke", "#64a5ff")
        .attr("fill", "transparent")

    //结点的中文说明,一般为明星的名字
    node.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        // .attr("x", -13)
        .attr("y", 38)
        .attr("fill", "#64a5ff")
        .text(function (d, i) {
            return d.title
        })
    ;

    //绑定force的处理函数
    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        relation.attr("transform", function (d) {
            return "translate(" + (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + ")";
        });

    });


    //点击结点,要跳转,这里添加事件处理
    node.on("click", function () {
        document.title = d3.select(this).data()[0].title;

     //  location =  d3.select(this).data()[0].url;
    })


    //缩放时调用的函数
    function rescale() {
        trans = d3.event.translate;
        scale = d3.event.scale;
        g.attr("transform",
            "translate(" + trans + ")" +
                " scale(" + scale + ")");
    }

    // 计算位置
    function countPosition() {
        var nodes = json.nodes;
        var links = json.links;
        //算第一级
        for (var i = 0 , rootNode; rootNode = nodes[i]; i++) {
            if (rootNode.level == 1) {
                break;
            }
        }

        rootNode.fixed = true;
        rootNode.x = width / 2;
        rootNode.y = height / 2;

        //算第二级结点

        var level2s = [];

        for (var i = 0 , item; item = nodes[i]; i++) {
            if (item.level == 2) {
                item.index = i;  //存个索引,后面有用
                level2s.push(item);
            }
        }

        distance =160;
        for (var i = 0 , item; item = level2s[i]; i++) {
            var deg = 2 * Math.PI / level2s.length * i;
            item.x = rootNode.x + Math.cos(deg) * distance;
            item.y = rootNode.y + Math.sin(deg) * distance;
          //  item.fixed = true;

            //算第三级结点 !!! 没有好的办法,还是得继续算.

            var level3s = [];
            for (var j = 0 , link; link = links[j]; j++) {
                  if(link.source == item.index && nodes[link.target].level == 3 ){
                      level3s.push(nodes[link.target]);
                  }
            }

            for (var j = 0 , child; child = level3s[j]; j++) {
                var deg2 = 2 * Math.PI / level3s.length * j;
                child.x = item.x + Math.cos(deg2) * 80;
                child.y = item.y + Math.sin(deg2) * 80;
             //   child.fixed = true;

            }
        }
     //   console.log(nodes);




    }

}


// 在手机,滚动,很郁闷.我试试解决一下下
function canMove() {
    var ele = d3.select("svg")
    var touchInitPos = 0;//手指初始位置
    var startPos = 0;//移动开始的位置
    var totalDist = 0;//移动的总距离
    ele.on('touchstart', function () {
        e = d3.event;
        if (e.touches.length !== 1) {
            return;
        }//如果大于1个手指，则不处理
        touchInitPos = e.touches[0].pageX; // 每次move的触点位置
    })
    ele.on('touchmove', function () {
        e = d3.event;
        if (e.touches.length !== 1) {
            return;
        }//如果大于1个手指，则不处理
        var currentX = e.touches[0].pageX;
        totalDist = startPos + currentX - touchInitPos;
        // this.style.WebkitTransform='translate3d(' +  totalDist+ 'px,0, 0)';
        startPos = totalDist;
        touchInitPos = currentX;
        // e.stopPropagation()
        e.preventDefault();
    })
}

//alert(screen.width);
//canMove()