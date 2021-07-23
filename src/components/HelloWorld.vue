<template lang="en">
    <div>
        <div id="main" ref="reference" style="width:1000px;height:800px"></div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import axios from 'axios'
// import '../utils/json/js/provinceMapName'
import cityMap from '../utils/js/china-main-city-map'

export default {
    name: "charts",
    data() {
        return {
            mapHistory: []
        }
    },
    created(){
      this.getWorldJson()
    },
    methods: {
      async getWorldJson() {
        let {data: WorldMapJson} = await axios.get('./Json/world.json').then()
        this.initCharts('china', WorldMapJson, 1.23, [104, 35])
      },
      /**
       * mapName: 地图名称
       * mapJson：地图数据
       * zoom： 地图放大倍数
       * mapCenter： 当前视角的中心点，用经纬度表示
       */
      initCharts(mapName, mapJson, zoom, mapCenter) {
        let myChart = echarts.init(this.$refs.reference);
        console.log(this.$refs.reference)
         //注册地图
        echarts.registerMap(mapName, mapJson);  
        myChart.off('click') //解绑事件处理函数。为了解决地图下钻会重复触发点击事件的问题
        var mapRegions = []

        //中国省份label
        var cityLabelColor = {
          normal: {
            show: true,
            color: 'rgba(255, 255, 255, 1)'
          },
          emphasis: {
            show: true,
            color: 'rgba(255, 255, 255, 1)'
          }
        }
        //中国省份区域颜色
        var cityItemStyle = {
          normal: {
            borderColor: 'rgba(147, 235, 248, 1)',
            borderWidth: 1,
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [{
                offset: 0,
                color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
              },{
                offset: 1,
                color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
              }],
              globalCoord: false //缺省为false
            },
            shadowColor: 'rgba(128, 235, 248, 1)',
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10
          },
          emphasis: {
            areaColor: '#389BB7',
            borderWidth: 0
          }
        }
        const  chinaProvince = [
          "北京","天津","河北","山西","内蒙古",
          "辽宁","吉林","黑龙江",
          "上海","江苏","浙江","安徽","福建","江西","山东",
          "河南","湖北","湖南","广东","广西","海南",
          "重庆","四川","贵州","云南","西藏",
          "陕西","甘肃","青海","宁夏","新疆",
          "香港","澳门","台湾",
      ]
        chinaProvince.forEach(item => {
          var obj = {
            name: item,
            label: cityLabelColor,
            itemStyle: cityItemStyle
          }
          mapRegions.push(obj)
        });
        mapRegions.push({name:'南海诸岛', label: cityLabelColor,itemStyle:cityItemStyle})
        console.log(mapRegions)
        var option ={
          tooltip: {
            show: false
          },
          geo: {
            show: true,
            map:mapName,
            nameMap: chinaProvince,
            roam: true,//关闭拖曳
            zoom: zoom,
            center: mapCenter,
            label: {
              normal: {
                // fontSize: "10",
                color: "rgba(255, 255, 255, .3)",
                show: true
              },
              emphasis: {
                color:'rgba(255, 255, 255, .3)'
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#0d0059",
                borderColor: "#389dff",
                borderWidth: 1, //设置外层边框
                shadowBlur: 5,
                shadowOffsetY: 8,
                shadowOffsetX: 0,
                shadowColor: "#01012a"
              },
              emphasis: {
                areaColor: "#184cff",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 5,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            regions: mapRegions
          },
          // series: [
          //   {
          //     type: "map",
          //     map: mapName,
          //     roam: false,
          //     zoom: 1.23,
          //     center: [105, 36],
          //     // geoIndex: 1,
          //     // aspectScale: 0.75, //长宽比
          //     showLegendSymbol: false, // 存在legend时显示
          //     label: {
          //       normal: {
          //         show: false
          //       },
          //       emphasis: {
          //         show: false,
          //         textStyle: {
          //           color: "#fff"
          //         }
          //       }
          //     },
          //     itemStyle: {
          //       normal: {
          //         areaColor: "#0d0059",
          //         borderColor: "#389dff",
          //         borderWidth: 0.5
          //       },
          //       emphasis: {
          //         areaColor: "#17008d",
          //         shadowOffsetX: 0,
          //         shadowOffsetY: 0,
          //         shadowBlur: 5,
          //         borderWidth: 0,
          //         shadowColor: "rgba(0, 0, 0, 0.5)"
          //       }
          //     }
          //   }
          // ]
        }
        myChart.setOption(option,true);
        myChart.on('click', async(mdata) => {
          console.log(mdata)
          console.log(cityMap)
          this.mapHistory.push(mdata.name)
          var cityMapKey = Object.keys(cityMap)
          // 检查点击的地图区域是不是中国的如果不是就return
          var flag = cityMapKey.some(item=>item == mdata.name)
          if(!flag) return;
          var cityName = mdata.name
          let { data:cityMapJson } = await axios.get(`./Json/city-map/${cityMap[cityName]}.json`)
          this.initCharts('city',cityMapJson,null,null)

        })
      }
    },
}
</script>
<style lang="scss" scoped>
    
</style>