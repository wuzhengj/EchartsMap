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
        label: "聚集"
    }, {
        value: 2,
        label: "发散"
    }],
    defaultValue: 0
};