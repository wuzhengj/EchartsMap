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