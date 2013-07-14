// 数据 


//尝试将画布分为10*10的格子,直接填写格式的位置,这样比较方便配置
var json = {
    "nodes":[
    {name:"yansunrong1",x:5,y:5},
    {name:"yansunrong2",x:2,y:2},
    {name:"yansunrong3",x:8,y:5},
    {name:"yansunrong4",x:2,y:6},
    {name:"yansunrong5",x:2,y:8},
    {name:"yansunrong6",x:3,y:2},
    {name:"yansunrong7",x:3,y:5},
    {name:"yansunrong8",x:6,y:2},
    {name:"yansunrong9",x:6,y:6},
    {name:"yansunrong10",x:8,y:2},
    {name:"yansunrong11",x:9,y:8}
    ],
    "links":[
    {"source":0,"target":1,"value":3,relation:"父子"},
    {"source":0,"target":3,"value":3,relation:"基友"},
    {"source":0,"target":4,"value":3,relation:"情人"},
    {"source":0,"target":5,"value":3,relation:"母子"},
    {"source":0,"target":6,"value":3,relation:"朋友的"},
    {"source":2,"target":7,"value":3,relation:"基友"},
    {"source":2,"target":8,"value":3,relation:"基友"},
    {"source":2,"target":9,"value":3,relation:"基友"},
    {"source":2,"target":10,"value":3,relation:"基友"},
    {"source":0,"target":10,"value":3,relation:"基友"}
    ]
}

var el;
window.onload = function () {

    var width = 640, height = 480;
    var isMoved =   false;//记录一下是否有移动, 用于判断用户是否点击还是拖拽
    var dragger = function () {
        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
    },
    move = function (dx, dy) {
        var att ={cx: this.ox + dx, cy: this.oy + dy};
        this.attr(att);
        for (var i = connections.length; i--;) {
            r.connection(connections[i]);
        }
        document.getElementById("debugger").innerHTML = ""+dx + " : "+dx+"<br>";
        r.safari();
    },
    up = function () {
        this.toFront();
    },
    r = Raphael("holder", width, height),
    connections = [];

    var shapes = [];
    for(var i = 0 , node ; node = json.nodes[i];i++){
        var shape = r.circle(node.x/10*width,node.y/10*height,25);
        shape.attr({fill: 'url(1.jpg)', stroke: "#5ba8f8", "fill-opacity": 1, "stroke-width": 2, cursor: "move"}).data("name",node.name);
        //
        shapes.push(shape);
       var supportsTouch = ('ontouchstart' in window) || window.DocumentTouch && g.doc instanceof DocumentTouch;
       if(supportsTouch){


        shape.node.addEventListener('touchstart',(function(shape){
            return function (e) {
                e.stopPropagation();
                e.preventDefault();
                shape.startX = e.touches[0].pageX;
                    shape.startY = e.touches[0].pageY;//shape.attr("cy");
                    shape.offsetX = shape.attr("cx");
                    shape.offsetY = shape.attr("cy");
                    }
            }
            )(shape));
        shape.node.addEventListener('touchmove',(function(shape) {
            return function (e) {
                e.stopPropagation();
                e.preventDefault();
                shape.attr("cx",  e.touches[0].pageX - shape.startX+shape.offsetX);
                shape.attr("cy",  e.touches[0].pageY - shape.startY+shape.offsetY);
                for (var i = connections.length; i--;) {
                    r.connection(connections[i]);
                }
             }
           })(shape)
        );
         }else{
            shape.drag(move, dragger, up);
         }
     //   shape.click(function(){alert('hello')});
 }

 for(var i = 0 , line ;line=json.links[i];i++){
        //console.log(line)
        connections.push(r.connection(shapes[line.source], shapes[line.target],  "#fff", "#8EE5EE|5",line.relation));
    }
    //r.circle(100,100,100).attr({"text":"fuck"});    


moveable();
};

function moveable(){


var touchInitPos = 0;//手指初始位置
var startPos = 0;//移动开始的位置
var totalDist = 0;//移动的总距离
document.getElementById('holder').addEventListener('touchstart',function (e) {
    if(e.target.tagName != "svg")return;
    if(e.touches.length !== 1){return;}//如果大于1个手指，则不处理
    touchInitPos = e.touches[0].pageX; // 每次move的触点位置
})

document.getElementById('holder').addEventListener('touchmove',function (e) {
           if(e.target.tagName != "svg")return;
            if(e.touches.length !== 1){return;}//如果大于1个手指，则不处理
            var currentX = e.touches[0].pageX;
            totalDist = startPos + currentX - touchInitPos;
            if (totalDist<5 ) {
                this.style.WebkitTransform='translate3d(' +  totalDist+ 'px,0, 0)';
                startPos = totalDist;
            }
            touchInitPos = currentX;
        });
}
Raphael.fn.connection = function (obj1, obj2, line, bg , text) {
  // return;
  if (obj1.line && obj1.from && obj1.to) {
    line = obj1;
    obj1 = line.from;
    obj2 = line.to;
}

var x1 = obj1.attr("cx"), y1 = obj1.attr("cy"), x2 = obj2.attr("cx"), y2 = obj2.attr("cy");
var x = (x1+x2)/2, y=(y1+y2)/2;
var path = ["M",x1,y1,"L",x2,y2]
if (line && line.line) {
    line.line.attr({path: path});
    line.text.attr({
        x:x,
        y:y
    });
     line.textBox.attr({
        cx:x,
        cy:y
    });
} else {
    var color = typeof line == "string" ? line : "#000";
    return {
        line: this.path(path).attr({stroke: "#5ba8f8","stroke-width":3, fill: "#5ba8f8"}).toBack(),
        from: obj1,
        to: obj2,
        textBox:this.circle(x,y,13).attr({
            "stroke":"#5ba8f8",
            "stroke-width":1,
            fill:"#f1f1f1"
        }),
        text: this.text(x,y,text).attr({
            fill: "#5ba8f8",
            "font-size":"9px"
        })
    };
}
};

