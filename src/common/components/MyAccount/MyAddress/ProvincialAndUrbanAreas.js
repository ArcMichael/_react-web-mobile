/*
 * @Author: Leo.Si 
 * @Date: 2019-08-26 10:10:58 
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:59:15
 * @function 省市区三级联动
 */
import React from 'react'
import { connect } from 'react-redux'
import { getProvincialAndUrbanAreas, mapAddressFuncToRun } from '../../../actions/myAccount'
class ProvincialAndUrbanAreas extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            renderData: '',
            defaultSelect: '请选择',
            isCity: false,
            isArea: false,
            exposeData: {
                province: '',
                city: '',
                areas: ''
            }
        }
    }
    componentDidMount() {
        this.props.getProvincialAndUrbanAreas(callback => {
            if (callback && callback.length > 0) {
                this.setState({
                    renderData: callback
                })
            }
        })
    }
    //渲染省数据
    renderProvinceData(data) {
        return data && data.map((item, index) => <li onClick={this.clickProvince.bind(this, item)} key={`my_address_province_province_${index}`}>{item.provinceName}</li>)
    }
    //点击省部分
    clickProvince(province) {
        let { exposeData } = this.state
        const { mapAddressFuncToRun } = this.props
        let nowExposeData = Object.assign({}, exposeData)
        nowExposeData['province'] = province.provinceName
        if (province && province.cityList && province.cityList.length == 0){           
            mapAddressFuncToRun && mapAddressFuncToRun('saveProvince', nowExposeData)
            mapAddressFuncToRun && mapAddressFuncToRun('controlProvince', false)
            return 
        }
        this.setState({
            renderData: province.cityList,
            defaultSelect: province.provinceName,
            exposeData: nowExposeData
        }, () => {
            this.setState({
                isCity: true,
            })
        })
    }
    //渲染市数据
    renderCityData(data) {
        let { isCity } = this.state
        if (!isCity) return
        return data && data.map((item, index) => <li onClick={this.clickCity.bind(this, item)} key={`my_address_province_city_${index}`}>{item.cityName}</li>)
    }
    //点击市部分
    clickCity(city) {
        const { defaultSelect, exposeData } = this.state
        const { mapAddressFuncToRun } = this.props
        let nowExposeData = Object.assign({}, exposeData)
        nowExposeData['city'] = city.cityName
        if (city && city.districtList && city.districtList.length == 0){           
            mapAddressFuncToRun && mapAddressFuncToRun('saveProvince', nowExposeData)
            mapAddressFuncToRun && mapAddressFuncToRun('controlProvince', false)
            return 
        }
        this.setState({
            renderData: city.districtList,
            defaultSelect: defaultSelect && defaultSelect + city.cityName,
            isCity: false,
            exposeData: nowExposeData
        }, () => {
            this.setState({
                isArea: true,
            })
        })
    }
    //渲染区数据
    renderAreaData(data) {
        let { isArea } = this.state
        if (!isArea) return
        return data && data.map((item, index) => <li onClick={this.clickArea.bind(this, item)} key={`my_address_province_area_${index}`}>{item.districtName}</li>)
    }
    //点击市部分
    clickArea(area) {
        const { exposeData } = this.state
        const { mapAddressFuncToRun } = this.props
        let nowExposeData = Object.assign({}, exposeData)
        nowExposeData['areas'] = area.districtName
        mapAddressFuncToRun && mapAddressFuncToRun('saveProvince', nowExposeData)
        mapAddressFuncToRun && mapAddressFuncToRun('controlProvince', false)
    }
    render() {
        const {  mapAddressFuncToRun } = this.props
        const { defaultSelect, renderData, isCity, isArea } = this.state
        return <div className='my_address_province'>
            <div className='my_address_add-page-title page_title_position'>
                {
                    <span className='my_address_add-page-title-back' onClick={mapAddressFuncToRun.bind(this, 'controlProvince', false)}>
                        <img src='https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shape.png' />
                    </span>
                }
                <span className='my_address_add-page-title-con'>所在地区</span>
            </div>
            <div className='my_address_province_select'>{defaultSelect}</div>
            <ul className='my_address_province_province'>{
                renderData && this.renderProvinceData(renderData)
            }</ul>
            {
                <ul className={`my_address_province_city ${isCity ? 'cityActive' : ''}`}>{
                    renderData && this.renderCityData(renderData)
                }</ul>
            }
            {
                <ul className={`my_address_province_area ${isArea ? 'areaActive' : ''}`}>{
                    renderData && this.renderAreaData(renderData)
                }</ul>
            }
        </div>
    }
}

const mapStateToProps = () => {
    return {

    }
}
export default connect(mapStateToProps, {
    getProvincialAndUrbanAreas,
    mapAddressFuncToRun
})(ProvincialAndUrbanAreas)


