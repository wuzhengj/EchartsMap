define(["qlik", "./echarts/echarts", "./echarts/world"],
    function(qlik, echarts, world) {

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

        var DotOff = {
            type: "boolean",
            component: "switch",
            label: "是否开启数据点",
            ref: "map.props.DotOff",
            options: [{
                value: true,
                label: "On"
            }, {
                value: false,
                label: "Off"
            }],
            defaultValue: true
        }

        return {
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 10,
                        qHeight: 270
                    }]
                }
            },
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimensions: {
                        uses: "dimensions",
                        min: 1
                    },
                    measures: {
                        uses: "measures",
                        max: 1
                    },
                    sorting: {
                        uses: "sorting"
                    },
                    settings: {
                        uses: "settings"
                    },
                    mapDotSetting: {
                        type: 'items',
                        label: '地图数据点设置',
                        items: {
                            DotOff: DotOff
                        }
                    },
                    mapLineSetting: {
                        type: 'items',
                        label: '地图点连线设置',
                        items: {
                            lineType: lineType,
                            centerDot: centerDot,
                        }
                    },
                }
            },
            support: {
                snapshot: true,
                export: true,
                exportData: false
            },
            paint: function($element, layout) {
                //add your rendering code here
                var elementWidth = $element.css('width'),
                    elementHeight = $element.css('height');
                $element.append('<div id="MapAirPlane"></div>');
                $('#MapAirPlane').css({ 'width': elementWidth, 'height': elementHeight });

                // 数据表
                var qHyperCube = layout.qHyperCube,
                    DataList = qHyperCube.qDataPages[0].qMatrix;

                var geoCoordMap = {}; //地点经纬度配置项
                var geoName = []; //地区名称数组
                var dotData = []; //地区对应数据

                for (var x in DataList) {
                    // 地区名称
                    var geoObj = {}; //地区名称
                    geoObj.name = DataList[x][0].qText
                    geoName.push(geoObj);

                    // 地点经纬度
                    var geoArr = [];
                    geoArr.push(DataList[x][1].qText, DataList[x][2].qText); //编辑经纬度数组
                    geoCoordMap[geoObj.name] = geoArr; //生成相对应对象

                    // 地区值
                    var geoValue = DataList[x][3].qNum;
                    geoObj.value = geoValue;
                    dotData.push(geoObj);
                }

                // 航线汇聚点数组
                var lineDotArr = [];
                // 是否开启航线
                var lineOff = layout.map.props.lineType;
                if (lineOff) { //如果当前选择开启航线
                    // 航线汇聚点
                    var lineDot = {};
                    lineDot.name = layout.map.props.centerDot;

                    switch (lineOff) {
                        case 1:
                            for (var i in geoName) {
                                var lineDots = [];
                                lineDots.push(geoName[i], lineDot);
                                lineDotArr.push(lineDots);
                            }
                            break;
                        case 2:
                            for (var i in geoName) {
                                var lineDots = [];
                                lineDots.push(lineDot, geoName[i]);
                                lineDotArr.push(lineDots);
                            }
                            break;
                        default:
                            break;
                    }

                }

                // 获取度量名称
                var MeasureName = qHyperCube.qMeasureInfo[0].qFallbackTitle;

                // 获取数据最大最小值
                var min = dotData[0].value,
                    max = 0;
                for (var j in dotData) {
                    if (dotData[j].value > max) {
                        max = dotData[j].value
                    } else if (dotData[j].value < min) {
                        min = dotData[j].value
                    } else {
                        continue;
                    }
                }

                // 地图数据点开关
                var DotOff = layout.map.props.DotOff;

                // 图例内容
                var lengendArr = qHyperCube.qMeasureInfo,
                    lengendContent = [];
                for (var z in lengendArr) {
                    lengendContent.push(lengendArr[z].qFallbackTitle);
                }

                var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

                // 对航线点进行连接及经纬度坐标点匹配
                var convertData = function(data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        var fromCoord = geoCoordMap[dataItem[0].name];
                        var toCoord = geoCoordMap[dataItem[1].name];
                        if (fromCoord && toCoord) {
                            res.push({
                                fromName: dataItem[0].name,
                                toName: dataItem[1].name,
                                coords: [fromCoord, toCoord]
                            });
                        }
                    }
                    return res;
                };

                // 对数据点进行经纬度坐标点匹配
                var convertDataDot = function(data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                var series = [];
                series.push({
                    name: '飞机航线图',
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: 'rgba(30,144,255,0.5)',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: '#fff',
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: convertData(lineDotArr)
                }, {
                    type: 'lines',
                    zlevel: 2,
                    symbol: ['circle', 'arrow'],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: '#fff',
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: convertData(lineDotArr)
                }, {
                    type: 'effectScatter',
                    name: MeasureName,
                    effectType: 'ripple',
                    showEffectOn: 'render',
                    coordinateSystem: 'geo',
                    rippleEffect: {
                        period: 10,
                        scale: 2.5,
                        brushType: 'stroke'
                    },
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                        normal: {
                            show: false,
                            position: 'top',

                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: DotOff ? convertDataDot(dotData) : [],
                    tooltip: {
                        formatter: function(params) {
                            var name = params.name,
                                value = params.value[2]
                            seriesName = params.seriesName;
                            var str = seriesName + '<br/>' + name + ':' + value;
                            return str;
                        }
                    }
                });

                // 定义筛选组件
                var visualMap = [{
                    min: min,
                    max: max,
                    show: true,
                    calculable: true,
                    left: 'left',
                    top: 'bottom',
                    origin: 'vertical',
                    inRange: {
                        color: ['#99ccff', '#66ccff', '#66cc99', '#66cc66', '#669966']
                    }
                }];

                // 定义geo组件
                var geo = {
                    map: 'world',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: 'rgba(0,0,0,0)',
                            borderColor: '#86c9ff'
                        },
                        emphasis: {
                            areaColor: 'rgba(0,0,0,0)'
                        }
                    }
                };

                var lengend = {
                    type: 'plain',
                    show: true,
                    left: 'left',
                    top: 'top',
                    orient: 'horizontal',
                    data: lengendContent
                }

                var option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: lengend,
                    geo: geo,
                    visualMap: visualMap,
                    series: series
                };

                //插入地图
                var myCharts = echarts.init(document.getElementById('MapAirPlane'));
                myCharts.setOption(option);
                myCharts.resize();
                //needed for export
                return qlik.Promise.resolve();
            }
        };

    });