import React from 'react'
import LazyloadImage from '@/components/LazyloadImage';
/**
 * 
 * @param {Array} categories 当前分类的数据
 * @param {*} CategoryId   当前分类的id
 * @param {*} clickFun  点击事件的回调函数
 */
export const CategoryList = ({ categories, CategoryId, clickFun, type }) => {
    let bannerUrl = null
    categories && categories.filter((d) => d.id == CategoryId ? bannerUrl = d.banner : null)
    return (
        <div className="h_bg_line" style={{ backgroundImage: `url(${bannerUrl})` }}>
            <div className="categorylist">
                <div className='categoryList_icon'>
                    {
                        categories && categories.map(({ img, txt, id }) => {
                            return <div key={id} className={'category'} onClick={() => clickFun(id, type)}>
                                <LazyloadImage
                                    imgProps={{
                                        src: img,
                                        style: {
                                            height: '0.9rem',
                                            width: '0.9rem',
                                            marginBottom: '0.2rem'
                                        },
                                    }}
                                    loadingType='smalltype'

                                 />
                                <span className={CategoryId == id ? 'active' : null}>{txt}</span>
                                {CategoryId == id ? <p className="line" /> : <p />}
                            </div>
                        })
                    }
                </div>
                {/* {bannerUrl && <LazyloadImage
                    imgProps={{
                        src: bannerUrl,
                        style: {
                            height: '2.1rem',
                            width: '6.4rem',
                        },
                    }}

                ></LazyloadImage>} */}
            </div >
        </div>
    )
}
