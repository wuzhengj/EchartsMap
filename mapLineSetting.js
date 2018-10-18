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
    show: function(data) {
        return data.map.props.lineType != 0;
    },
    defaultValue: "#fff"
}

var lineIcon = {
    type: "string",
    component: "dropdown",
    label: "飞行线图标",
    ref: "map.props.lineIcon",
    show: function(data) {
        return data.map.props.lineType != 0;
    },
    options: [{
        label: "飞机",
        value: "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z"
    }, {
        label: "箭头",
        value: "path://M1024 0 0 349.090909 512 510.091636 674.909091 1024Z"
    }],
    defaultValue: "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z"
}