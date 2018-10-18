var lengendOff = {
    ref: "map.props.lengendOff",
    label: "是否开启图例",
    type: "boolean",
    component: 'switch',
    options: [{
        value: true,
        label: "On"
    }, {
        value: false,
        label: "Off"
    }],
    defaultValue: false,
}

var lengendType = {
    ref: "map.props.lengendType",
    label: "图例展示类型",
    type: "string",
    component: "dropdown",
    options: [{
        value: "plain",
        label: "普通图例(适合图例说明较少)"
    }, {
        value: "scroll",
        label: "滚动翻页图列(适合图例说明较多)"
    }],
    defaultValue: "plain",
    show: function(data) {
        return data.map.props.lengendOff == true
    }
}

var lengendColor = {
    ref: "map.props.lengendColor",
    label: "图例文本颜色",
    type: "string",
    defaultValue: "#ffffff",
    show: function(data) {
        return data.map.props.lengendOff == true
    }
}

// 筛选组件
var visualMapOff = {
    ref: "map.props.visualMapOff",
    label: "是否开启筛选器",
    type: "boolean",
    component: 'switch',
    options: [{
        value: true,
        label: "On"
    }, {
        value: false,
        label: "Off"
    }],
    defaultValue: false,
}

// 筛选文本颜色
var visualMapColor = {
    ref: "map.props.visualMapColor",
    label: "筛选器文本颜色",
    type: "string",
    defaultValue: "#ffffff",
    show: function(data) {
        return data.map.props.visualMapOff == true
    }
}

// 地图背景色
var geoBackgroundColor = {
    ref: "map.props.geoBackgroundColor",
    label: "地图背景色",
    type: "string",
    defaultValue: "rgba(0,0,0,0)",
}

// 地图边线颜色
var geoBorderColor = {
    ref: "map.props.geoBorderColor",
    label: "地图边框色",
    type: "string",
    defaultValue: "#86c9ff",
}

// 鼠标移上去地图背景色
var geoHoverBackgroundColor = {
    ref: "map.props.geoHoverBackgroundColor",
    label: "鼠标移动到地图上时地图背景色",
    type: "string",
    defaultValue: "rgba(0,0,0,0)",
}

// 地图属性
var mapType = {
    ref: "map.props.mapType",
    label: "地图类型",
    type: "string",
    component: "dropdown",
    options: [{
        value: "world",
        label: "世界地图"
    }, {
        value: "china",
        label: "中国地图"
    }],
    defaultValue: "world"
}

// 设置标题
var mapTitle = {
    ref: "map.props.mapTitle",
    label: "标题",
    type: "string",
    show: function(data) {
        return data.map.props.showMapTitle;
    }
}

// 是否开启标题
var showMapTitle = {
    ref: "map.props.showMapTitle",
    label: "是否开启标题",
    component: "switch",
    type: "boolean",
    options: [{
        value: true,
        label: "开启"
    }, {
        value: false,
        label: "关闭"
    }]
}

// 标题字体颜色
var mapTitleColor = {
    ref: "map.props.mapTitleColor",
    label: "标题字体颜色",
    type: "string",
    show: function(data) {
        return data.map.props.showMapTitle;
    }
}

// 标题字体大小
var mapTitleSize = {
    ref: "map.props.mapTitleSize",
    label: "标题字体颜色",
    type: "string",
    show: function(data) {
        return data.map.props.showMapTitle;
    }
}