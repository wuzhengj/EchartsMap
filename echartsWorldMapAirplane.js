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
                    mapLineSetting: {
                        type: "items",
                        label: '地图点连线设置',
                        items: {
                            lineType: lineType,
                            centerDot: centerDot
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

                for (var x in DataList) {
                    // 地区名称
                    var geoNameObj = {}; //地区名称
                    geoNameObj.name = DataList[x][0].qText
                    geoName.push(geoNameObj);

                    // 地点经纬度
                    var geoArr = [];
                    geoArr.push(DataList[x][1].qText, DataList[x][2].qText); //编辑经纬度数组
                    geoCoordMap[geoNameObj.name] = geoArr; //生成相对应对象
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



                // var geoCoordMap = {
                //     '广州': [113.30, 23.39],
                //     '布里斯班': [153.02, -27.46],
                //     '墨尔本': [144.96, -37.81],
                //     '阿德莱德': [138.60, -34.92],
                //     '珀斯': [115.86, -31.95],
                //     '悉尼': [151.20, -33.86],
                //     '基督城': [172.63, -43.53],
                //     '奥克兰': [174.78, -37.00],
                //     '开罗': [31.23, 30.04],
                //     '亚的斯亚贝巴': [38.75, 8.98],
                //     '内罗毕': [36.82, -1.29],
                //     '河内': [105.83, 21.02],
                //     '曼谷': [100.50, 13.75],
                //     '圣丹尼斯': [2.35, 48.93],
                //     '安塔那那利佛': [47.50, -18.87],
                //     '温哥华': [-123.12, 49.28],
                //     '多伦多': [-79.38, 43.65],
                //     '纽约': [-74.00, 40.71],
                //     '旧金山': [-122.41, 37.77],
                //     '武汉': [114.30, 30.59],
                //     '洛杉矶': [-118.24, 34.05],
                //     '乌鲁木齐': [87.61, 43.82],
                //     '莫斯科': [37.61, 55.75],
                //     '巴黎': [2.35, 48.85],
                //     '赫尔辛基': [24.93, 60.16],
                //     '阿姆斯特丹': [4.89, 52.37],
                //     '伊斯坦布尔': [28.97, 41.00],
                //     '长沙': [112.93, 28.22],
                //     '法兰克福': [8.68, 50.11],
                //     '罗马': [12.49, 41.90],
                //     '巴库': [49.86, 40.40],
                //     '伦敦': [-0.12, 51.50],
                //     '迪拜': [55.27, 25.20],
                //     '马尼拉': [120.98, 14.59],
                //     '卡利博': [122.36, 11.68],
                //     '拉瓦格': [120.59, 18.19],
                //     '釜山': [129.07, 35.17],
                //     '海口': [110.19, 20.04],
                //     '首尔': [126.97, 37.56],
                //     '济州岛': [126.49, 33.48],
                //     '暹粒': [103.84, 13.36],
                //     '金边': [104.89, 11.54],
                //     '马累': [73.50, 4.17],
                //     '科伦科': [119.23, 34.27],
                //     '兰卡威': [99.79, 6.35],
                //     '槟城': [100.33, 5.41],
                //     '吉隆坡': [101.68, 3.13],
                //     '新山': [103.74, 1.49],
                //     '哥达': [10.70, 50.94],
                //     '沙巴': [116.07, 5.97],
                //     '仰光': [96.19, 16.86],
                //     '曼德勒': [96.08, 21.95],
                //     '万象': [102.63, 17.97],
                //     '加德满都': [85.32, 27.71],
                //     '东京': [139.73, 35.70],
                //     '浦东': [121.54, 31.22],
                //     '名古屋': [136.90, 35.18],
                //     '大阪': [135.50, 34.69],
                //     '三亚': [109.51, 18.25],
                //     '多哈': [51.53, 25.28],
                //     '成都': [104.06, 30.57],
                //     '塞班': [145.72, 15.15],
                //     '吉达': [39.23, 21.28],
                //     '利雅得': [46.67, 24.71],
                //     '科伦坡': [79.86, 6.92],
                //     '伊玛目霍梅尼': [51.15, 35.40],
                //     '巴格达': [44.36, 33.31],
                //     '高雄': [120.30, 22.62],
                //     '台中': [120.67, 24.14],
                //     '台北': [121.56, 25.03],
                //     '普吉岛': [98.33, 7.95],
                //     '清迈': [98.98, 18.70],
                //     '甲米': [98.90, 8.08],
                //     '苏梅岛': [100.01, 9.51],
                //     '贵阳': [106.63, 26.64],
                //     '郑州': [113.62, 34.74],
                //     '香港': [114.11, 22.39],
                //     '新加坡': [103.81, 1.35],
                //     '达卡': [90.41, 23.81],
                //     '德里': [77.10, 28.70],
                //     '雅加达': [120.2234, 33.5577],
                //     '巴厘': [121.9482, 41.0449],
                //     '美娜多': [114.4995, 38.1006],
                //     '芽庄': [119.4543, 25.9222],
                //     '胡志明市': [119.2126, 40.0232],
                //     '富国岛': [120.564, 29.7565],
                //     '岘港': [115.9167, 36.4032],
                //     '毛里求斯': [112.1265, 23.5822],
                //     '马斯科特': [122.2559, 30.2234],
                //     '拉合尔': [120.6519, 31.3989],
                // };

                // var GZData = [
                //     [{ name: '广州' }, { name: '布里斯班' }],
                //     [{ name: '广州' }, { name: '墨尔本' }],
                //     [{ name: '广州' }, { name: '阿德莱德' }],
                //     [{ name: '广州' }, { name: '珀斯' }],
                //     [{ name: '广州' }, { name: '悉尼' }],
                //     [{ name: '广州' }, { name: '基督城' }],
                //     [{ name: '广州' }, { name: '奥克兰' }],
                //     [{ name: '广州' }, { name: '开罗' }],
                //     [{ name: '广州' }, { name: '亚的斯亚贝巴' }],
                //     [{ name: '广州' }, { name: '内罗毕' }],
                //     [{ name: '广州' }, { name: '河内' }],
                //     [{ name: '广州' }, { name: '内罗毕' }],
                //     [{ name: '广州' }, { name: '曼谷' }],
                //     [{ name: '广州' }, { name: '内罗毕' }],
                //     [{ name: '广州' }, { name: '圣丹尼斯' }],
                //     [{ name: '圣丹尼斯' }, { name: '安塔那那利佛' }],
                //     [{ name: '广州' }, { name: '温哥华' }],
                //     [{ name: '广州' }, { name: '多伦多' }],
                //     [{ name: '广州' }, { name: '纽约' }],
                //     [{ name: '广州' }, { name: '旧金山' }],
                //     [{ name: '广州' }, { name: '武汉' }],
                //     [{ name: '武汉' }, { name: '旧金山' }],
                //     [{ name: '广州' }, { name: '乌鲁木齐' }],
                //     [{ name: '乌鲁木齐' }, { name: '莫斯科' }],
                //     [{ name: '武汉' }, { name: '莫斯科' }],
                //     [{ name: '广州' }, { name: '巴黎' }],
                //     [{ name: '广州' }, { name: '赫尔辛基' }],
                //     [{ name: '广州' }, { name: '阿姆斯特丹' }],
                //     [{ name: '广州' }, { name: '伊斯坦布尔' }],
                //     [{ name: '广州' }, { name: '长沙' }],
                //     [{ name: '长沙' }, { name: '法兰克福' }],
                //     [{ name: '广州' }, { name: '武汉' }],
                //     [{ name: '武汉' }, { name: '罗马' }],
                //     [{ name: '广州' }, { name: '乌鲁木齐' }],
                //     [{ name: '乌鲁木齐' }, { name: '巴库' }],
                //     [{ name: '广州' }, { name: '伦敦' }],
                //     [{ name: '广州' }, { name: '迪拜' }],
                //     [{ name: '广州' }, { name: '马尼拉' }],
                //     [{ name: '广州' }, { name: '卡利博' }],
                //     [{ name: '广州' }, { name: '拉瓦格' }],
                //     [{ name: '广州' }, { name: '釜山' }],
                //     [{ name: '海口' }, { name: '广州' }],
                //     [{ name: '广州' }, { name: '首尔' }],
                //     [{ name: '广州' }, { name: '济州岛' }],
                //     [{ name: '广州' }, { name: '首尔' }],
                //     [{ name: '广州' }, { name: '暹粒' }],
                //     [{ name: '广州' }, { name: '金边' }],
                //     [{ name: '北京' }, { name: '广州' }],
                //     [{ name: '广州' }, { name: '金边' }],
                //     [{ name: '广州' }, { name: '马累' }],
                //     [{ name: '广州' }, { name: '科伦科' }],
                //     [{ name: '科伦科' }, { name: '马累' }],
                //     [{ name: '广州' }, { name: '兰卡威' }],
                //     [{ name: '广州' }, { name: '槟城' }],
                //     [{ name: '广州' }, { name: '吉隆坡' }],
                //     [{ name: '广州' }, { name: '新山' }],
                //     [{ name: '广州' }, { name: '哥达' }],
                //     [{ name: '广州' }, { name: '沙巴' }],
                //     [{ name: '广州' }, { name: '仰光' }],
                //     [{ name: '广州' }, { name: '曼德勒' }],
                //     [{ name: '广州' }, { name: '万象' }],
                //     [{ name: '广州' }, { name: '加德满都' }],
                //     [{ name: '广州' }, { name: '东京' }],
                //     [{ name: '广州' }, { name: '浦东' }],
                //     [{ name: '浦东' }, { name: '名古屋' }],
                //     [{ name: '广州' }, { name: '大阪' }],
                //     [{ name: '三亚' }, { name: '广州' }],
                //     [{ name: '广州' }, { name: '多哈' }],
                //     [{ name: '成都' }, { name: '广州' }],
                //     [{ name: '广州' }, { name: '塞班' }],
                //     [{ name: '广州' }, { name: '吉达' }],
                //     [{ name: '广州' }, { name: '利雅得' }],
                //     [{ name: '曼谷' }, { name: '科伦坡' }],
                //     [{ name: '广州' }, { name: '科伦坡' }],
                //     [{ name: '广州' }, { name: '伊玛目霍梅尼' }],
                //     [{ name: '广州' }, { name: '巴格达' }],
                //     [{ name: '广州' }, { name: '高雄' }],
                //     [{ name: '广州' }, { name: '台中' }],
                //     [{ name: '广州' }, { name: '台北' }],
                //     [{ name: '广州' }, { name: '普吉岛' }],
                //     [{ name: '广州' }, { name: '清迈' }],
                //     [{ name: '广州' }, { name: '甲米' }],
                //     [{ name: '广州' }, { name: '苏梅岛' }],
                //     [{ name: '贵阳' }, { name: '广州' }],
                //     [{ name: '郑州' }, { name: '广州' }],
                //     [{ name: '广州' }, { name: '香港' }],
                //     [{ name: '广州' }, { name: '新加坡' }],
                //     [{ name: '广州' }, { name: '达卡' }],
                //     [{ name: '广州' }, { name: '德里' }],
                //     [{ name: '广州' }, { name: '雅加达' }],
                //     [{ name: '广州' }, { name: '巴厘' }],
                //     [{ name: '广州' }, { name: '美娜多' }],
                //     [{ name: '广州' }, { name: '芽庄' }],
                //     [{ name: '广州' }, { name: '胡志明市' }],
                //     [{ name: '广州' }, { name: '富国岛' }],
                //     [{ name: '广州' }, { name: '岘港' }],
                //     [{ name: '广州' }, { name: '毛里求斯' }],
                //     [{ name: '广州' }, { name: '马斯科特' }],
                //     [{ name: '广州' }, { name: '拉合尔' }]
                // ];

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
                });

                var option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    geo: {
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
                    },
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