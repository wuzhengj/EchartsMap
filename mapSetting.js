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