var centerDot = {
    ref: "map.props.centerDot",
    label: "中心点名称",
    type: "string",
    show: function(data) {
        return data.map.props.lineType != 0;
    }
};

var lineType = {
    type: "string",
    component: "dropdown",
    label: "设置航线方式",
    ref: "map.props.lineType",
    options: [{
        value: 0,
        label: "None"
    }, {
        value: 1,
        label: "飞入"
    }, {
        value: 2,
        label: "飞出"
    }],
    defaultValue: 0
};

// 连线颜色
var lineColor = {
    type: "string",
    label: "飞行线颜色",
    ref: "map.props.lineColor",
    show: function(data){
        return data.map.props.lineType != 0;
    },
    defaultValue: "#fff"
}