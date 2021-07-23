<template>
    <div class="map-chart-wrapper"  ref="myEchart"
        :style="{height:height,width:width, left: mapPosition.left, top: mapPosition.top}">
    </div>
    <!-- '新城区': '&#9312;',
    '碑林区': '&#9313;',
    '莲湖区': '&#9314;', -->
</template>
<script>
import echarts from 'echarts';
import axios from 'axios';
import 'echarts/theme/macarons.js';
import xianshi from '../common/json/xiaan.json'
import zhouzhixian from '../common/json/zhouzhi-cn.json'

const cityMap = {
    '西安市': xianshi,
    '周至县': zhouzhixian,
}
const cityStyleMap = {
    '西安市': {
        position: {
            left: '-112px',
            top: '0px',
        },
        series: {
            left: 0,
            right: 0,
            top: '56px',
            bottom: '55px',
        }
    },
    '周至县':  {
        position: {
            left: '-113px',
            top: '17px',
        },
        series: {
            left: 0,
            right: 0,
            top: '30px',
            bottom: '0px',
        }
    },
}
export default {
    props: {
        width: {
            type: String,
            default: '890px'
        },
        height: {
            type: String,
            default: '517px'
        },
        chartConfig:{
            type: Object,
            default: ()=>({
                title: null,
                backgroundColor: '#6a7985',
                seriesData: [],
                legendData: null,
                xAxisData: null,
                yAxisData: null,
                grid: {}
            }),
        },
        mapData:{
            type: Object,
            default: ()=>({}),
        },

    },
    data() {
        return {
            propsNew: '周至县',
            chart: null,
            mapName: '',
            mapPosition: {
                left: '-117px',
                top: '36px'
            },
            areaGeoMap: {},
            districtList: [
                { label: '周至县', value: '周至县', class: 'zhouzhixian', code: "610124000000"},
                { label: '鄠邑区', value: '鄠邑区', class: 'huxian', code: "610118000000"},
                { label: '长安区', value: '长安区', class: 'changan', code: "610116000000"},
                { label: '雁塔区', value: '雁塔区', class: 'yanta', code: "610113000000"},
                { label: '未央区', value: '未央区', class: 'weiyang', code: "610112000000"},
                { label: '\u2460', value: '新城区', class: 'xincheng', code: "610102000000"},
                { label: '\u2461', value: '碑林区', class: 'beilin', code: "610103000000"},
                { label: '\u2462', value: '莲湖区', class: 'lianhu', code: "610104000000"},
                { label: '灞桥区', value: '灞桥区', class: 'baqiao', code: "610111000000"},
                { label: '高陵区', value: '高陵区', class: 'gaoling', code: "610117000000"},
                { label: '临潼区', value: '临潼区', class: 'lintong', code: "610115000000"},
                { label: '阎良区', value: '阎良区', class: 'yanliang', code: "610114000000"},
                { label: '蓝田县', value: '蓝田县', class: 'lantian', code: "610122000000"},
            ],
        };
    },
    mounted() {
        this.createChart();
        this.registerMap('西安市')
    },
    beforeDestroy() {
        this.destroyChart();
    },
    watch: {
        chartConfig() {
            this.destroyChart();
            this.initChart();
        },
    },
    methods: {
        registerMap(name) { // 注册地图
            axios.get(cityMap[name]).then((response) => {
                const geoJson = response.data
                console.log(geoJson)
                this.areaGeoMap = geoJson.features.reduce((acc, item) => {
                    acc[item.properties.name] = item.properties.cp
                    return acc
                }, {})
                echarts.registerMap(name, geoJson);
                this.mapName = name;
                this.initChart()
            }).catch((error) => {
                alert('地图数据未找到'+ error)
            })
        },
        createChart() {
            this.chart = echarts.init(this.$refs.myEchart, 'macarons');
            window.addEventListener("resize", this.chart.resize);
        },
        initChart() {
            // 清空当前实例，从而清空事件
            this.chart.clear()
            // this.chart.off('click', this.areaClick)
            let titleSubtext = '';
            let mapDown = true;
            if (this.mapName === '西安市') {
                mapDown = false
                titleSubtext = '\u2460' + ' 新城区\n' +
                                '\u2461' +' 碑林区\n' + 
                                '\u2462'+ ' 莲湖区\n';
            }
            let styleData = cityStyleMap[this.mapName]
            this.mapPosition = styleData.position
            let seriesPos = styleData.series
            this.$emit('mapChange', {
                    mapDown,
                    name: this.mapName
                })
            var levelColorMap = {
                '1': 'rgba(241, 109, 115, .8)',
                '2': 'rgba(255, 235, 59, .7)',
                '3': 'rgba(147, 235, 248, 1)'
            };
            var COLORS = ["#070093", "#1c3fbf", "#1482e5", "#70b4eb", "#b4e0f3", "#ffffff"];
            
            // 闪动点的数据
            // const blinkDot = this.areaGeoMap[this.propsNew].concat(100)
            // console.log(blinkDot)
            // 把配置和数据放这里
            const transparentMap = 0
            this.chart.setOption({
                title: {
                    text: '',
                    subtext: titleSubtext,
                    subtextStyle: {
                        color: '#d7d7d7',
                        fontSize: 14,
                        lineHeight: 80,
                        fontFamily: "Microsoft YaHei Light"
                    },
                    left: '320px',
                    top: '65px',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (data) => {
                        let key = data.name
                        if (key === '\u2460') {
                            key = '新城区'
                        }else if (key === '\u2461') {
                            key = '碑林区'
                        }else if (key === '\u2462') {
                            key = '莲湖区'
                        }
                        return this.mapData[key] || key
                    } 
                },
                series: [
                    {
                        name: '',
                        type: 'map',
                        map: this.mapName,
                        left: seriesPos.left,
                        right: seriesPos.right,
                        top: seriesPos.top,
                        bottom: seriesPos.bottom,
                        selectedMode : 'single',
                        label: {
                            normal: {
                                fontSize: 14,
                                color: '#d7d7d7',
                                show: true,
                                fontFamily: "Microsoft YaHei Light"
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params){
                                    return levelColorMap[params.value[3]];
                                },
                                // shadowOffsetX:5,
                                // shadowOffsetY:5,
                                // shadowBlur: 5,
                                // shadowColor: 'rgba(255,255,255,0.5)',
                                areaColor: 'rgba(255,255,255,0)',
                                borderColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                                                offset: 0,
                                                color: 'rgba(13,1,255,0)'
                                            }, {
                                                offset: 1,
                                                color: 'rgba(0,246,255,0)'
                                            }])
                            },
                            emphasis: {
                                areaColor: 'rgba(0,246,255,0.2)',
                                borderWidth: 0,
                                label: {
                                    color: "#fff",
                                }
                            }
                        },
                        data:[
                        
                        ],
                        nameMap: { // unicode 来源： http://xahlee.info/comp/unicode_circled_numbers.html
                            '新城区': '\u2460',
                            '碑林区': '\u2461',
                            '莲湖区': '\u2462',
                        }
                    },
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        // symbol: 'diamond',
                        // showEffectOn: 'render',
                        rippleEffect: {
                            period: 15,
                            scale: 6,
                            brushType: 'fill'
                        },
                        geoIndex: 0,
                        hoverAnimation: true,
                        itemStyle: {
                            normal: {
                                color: 'rgba(56,196,217,1)',
                                shadowBlur: 10,
                                shadowColor: '#fff'
                            }
                        },
                        data: []
                    }
                ]  
            });
            this.chart.on('click', this.areaClick)
        },
        destroyChart() {
            if (this.chart) {
                window.removeEventListener("resize", this.chart.resize);
                this.chart.dispose();
                this.chart = null;
            }
        },
        refreshData(areacode = false) {
            const params = {
                handleBack: (data) => {
                }
            }
            if (areacode) {
                params.area_code = areacode;
            }
            this.$store.dispatch('summaryData', params);
            this.$store.dispatch('rateCredit', params);
        },
        // 地图的某块区域点击， @name参数为地区名称
        areaClick(params) {
            console.log(params)
            const name = params.name
            const selected = params.data.selected
            if (selected) {
                if (name === '周至县') {
                    this.registerMap(name)
                }
                const areaObject = this.districtList.find((area) => {
                    return area.value === name
                })
                if (areaObject) {
                    this.refreshData(areaObject.code)
                }
            }
            else {
                this.refreshData()
            }
        }
    }
}
</script>
<style scoped>
.map-chart-wrapper{
    z-index: 9;
    position: absolute;
}
</style>