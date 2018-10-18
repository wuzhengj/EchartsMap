define(["qlik", "./echarts/echarts", "./echarts/world", "./echarts/china", "./mapDotSetting", "./mapLineSetting", "./mapSetting"],
    function(qlik, echarts, world, china) {

        var longitude = {
            type: 'string',
            component: 'expression',
            label: '经度',
            ref: 'qAttributeExpressions.0.qExpression'
        }

        var latitude = {
            type: 'string',
            component: 'expression',
            label: '纬度',
            ref: 'qAttributeExpressions.1.qExpression'
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
                        min: 1,
                        items: {
                            longitude: longitude,
                            latitude: latitude
                        }
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
                    mapSetting: {
                        type: 'items',
                        label: '地图设置',
                        items: {
                            geoBackgroundColor: geoBackgroundColor,
                            geoBorderColor: geoBorderColor,
                            geoHoverBackgroundColor: geoHoverBackgroundColor,
                            lengendOff: lengendOff,
                            lengendType: lengendType,
                            lengendColor: lengendColor,
                            visualMapOff: visualMapOff,
                            visualMapColor: visualMapColor,
                            mapType: mapType,
                            showMapTitle: showMapTitle,
                            mapTitle: mapTitle,
                            mapTitleColor: mapTitleColor,
                            mapTitleSize: mapTitleSize
                        }
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
                            lineColor: lineColor,
                            lineIcon: lineIcon
                        }
                    }
                }
            },
            support: {
                snapshot: true,
                export: true,
                exportData: false
            },
            paint: function($element, layout) {
                $element.addClass('EBI-Basic');

                var _self = this;

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
                    geoObj.qElemNumber = DataList[x][0].qElemNumber;
                    geoName.push(geoObj);

                    // 地点经纬度
                    var geoArr = [];
                    geoArr.push(DataList[x][0].qAttrExps.qValues[0].qNum, DataList[x][0].qAttrExps.qValues[1].qNum); //编辑经纬度数组
                    geoCoordMap[geoObj.name] = geoArr; //生成相对应对象

                    // 地区值
                    var geoValue = DataList[x][1].qNum;
                    geoObj.value = geoValue;
                    dotData.push(geoObj);
                }

                // 航线汇聚点数组
                var lineDotArr = [];
                // 是否开启航线
                var lineOff = layout.map.props.lineType;
                // 航线颜色
                var lineColor = layout.map.props.lineColor;
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
                var min = qHyperCube.qMeasureInfo[0].qMin,
                    max = qHyperCube.qMeasureInfo[0].qMax;

                // 地图数据点开关
                var DotOff = layout.map.props.DotOff;

                // 标题开关
                var showMapTitle = layout.map.props.showMapTitle;

                // 标题内容
                var mapTitle = layout.map.props.mapTitle;

                // 标题大小
                var mapTitleSize = layout.map.props.mapTitleSize;

                // 标题颜色
                var mapTitleColor = layout.map.props.mapTitleColor;

                // 图例开关
                var lengendOff = layout.map.props.lengendOff;

                // 图例类型
                var lengendType = layout.map.props.lengendType;

                // 图例文本颜色
                var lengendColor = layout.map.props.lengendColor;

                // 图例内容
                var lengendArr = qHyperCube.qMeasureInfo,
                    lengendContent = [];
                for (var z in lengendArr) {
                    lengendContent.push(lengendArr[z].qFallbackTitle);
                }

                // 筛选器
                var visualMapOff = layout.map.props.visualMapOff;
                var visualMapColor = layout.map.props.visualMapColor;

                // 地图配置
                var geoBackgroundColor = layout.map.props.geoBackgroundColor;
                var geoBorderColor = layout.map.props.geoBorderColor;
                var geoHoverBackgroundColor = layout.map.props.geoHoverBackgroundColor;
                var mapType = layout.map.props.mapType;
                var lineIcon = layout.map.props.lineIcon;

                // var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

                var planePath = lineIcon;
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
                                qElemNumber: data[i].qElemNumber,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                // 点图移动文字配置
                var effectScatter = {
                    type: 'effectScatter',
                    name: MeasureName,
                    effectType: 'ripple',
                    showEffectOn: 'render',
                    coordinateSystem: 'geo',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: 15,
                            },
                            formatter: function(params) {
                                var name = params.name,
                                    value = params.value[params.value.length - 1],
                                    seriesName = params.seriesName;
                                var str = name + ':' + value;
                                return str;
                            }
                        },
                        emphasis: {
                            show: false
                        }
                    }
                };

                // 点图配置
                var effectScatterStatic = {
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
                            textStyle: {
                                fontSize: 20
                            }
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: DotOff ? convertDataDot(dotData) : [],
                    tooltip: {
                        formatter: function(params) {
                            var name = params.name,
                                value = params.value[params.value.length - 1],
                                seriesName = params.seriesName;
                            var str = seriesName + '<br/>' + name + ':' + value;
                            return str;
                        }
                    }
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
                            color: lineColor,
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: convertData(lineDotArr)
                }, effectScatterStatic);

                // 定义筛选组件
                var visualMap = [{
                    min: min,
                    max: max,
                    show: visualMapOff,
                    calculable: true,
                    left: 'left',
                    top: 'bottom',
                    origin: 'vertical',
                    inRange: {
                        color: ['#99ccff', '#66ccff', '#66cc99', '#66cc66', '#669966']
                    },
                    textStyle: {
                        color: visualMapColor
                    }
                }];

                // 定义geo组件
                var geo = {
                    map: mapType,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: geoBackgroundColor,
                            borderColor: geoBorderColor
                        },
                        emphasis: {
                            areaColor: geoHoverBackgroundColor
                        }
                    }
                };

                // 定义图例组件
                var lengend = {
                    type: lengendType,
                    show: lengendOff,
                    left: 'left',
                    top: 'top',
                    orient: 'horizontal',
                    data: lengendContent,
                    textStyle: {
                        color: lengendColor
                    }
                }

                var option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    title: {
                        show: showMapTitle,
                        text: mapTitle,
                        textStyle: {
                            color: mapTitleColor,
                            fontSize: mapTitleSize
                        }
                    },
                    legend: lengend,
                    geo: geo,
                    visualMap: visualMap,
                    series: series
                };

                var timer = null;
                // 文字跳动功能
                function dataBound() {
                    // 获取定时器时间
                    var elementTimer = $element.attr('timer');
                    if (elementTimer) {
                        // 清空定时器
                        clearInterval(elementTimer);
                        // 获取当前echarts实例
                        var ChartsInit = echarts.getInstanceByDom(document.getElementById('MapAirPlane'));
                        // 清空echarts实例
                        echarts.dispose(ChartsInit);
                    }
                    timer = setInterval(function() {
                        var arr = [];
                        arr.push({
                            name: convertDataDot(dotData)[index].name,
                            value: convertDataDot(dotData)[index].value
                        });
                        effectScatter.data = arr;
                        index != convertDataDot(dotData).length - 1 ? index++ : index = 0;

                        //添加跳动属性 
                        option.series.push(effectScatter);
                        myCharts.setOption(option);

                        // 挂载当前定时器时间
                        $element.attr('timer', timer);
                    }, 2000);
                }
                var index = 0;
                if (DotOff) {
                    dataBound();
                } else {
                    // 获取当前echarts实例
                    var ChartsInit = echarts.getInstanceByDom(document.getElementById('MapAirPlane'));
                    // 清空echarts实例
                    echarts.dispose(ChartsInit);
                }

                //插入地图
                var myCharts = echarts.init(document.getElementById('MapAirPlane'));
                myCharts.setOption(option);
                myCharts.on('click', function(data) {
                    _self.selectValues(0, [data.data.qElemNumber], true)
                })
                myCharts.resize();

                //needed for export
                return qlik.Promise.resolve();
            }
        };

    });