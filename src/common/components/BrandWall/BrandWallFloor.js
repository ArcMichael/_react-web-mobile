/*
 * @Author: zone Tian
 * @Date: 2020-02-03 14:52:34
 * @Last Modified by: zone Tian
 * @Last Modified time: 2020-02-03 14:53:17
 */
import React from "react";
import Sensor from "../../Utils/sensor";
import Image from "../ImagesLazyLoad/index";
function sensorEvent(cont, belongarea, index) {
  const brand = cont.brandNameEN.toLowerCase().replace(/[^\w]/g, "");
  const Href =
    "/brand/" +
    brand +
    "-" +
    cont.brandId +
    "/" +
    "?intcmp=NewHome|Brands|BrandWall|All|" +
    brand;
  Sensor.go("clickBanner_App_Mob", {
    $lib_detail: "NEWM_Brandll##sensorEvent##brandFloor.js##7",
    banner_type: "brand",
    banner_content: brand,
    banner_belong_area: belongarea || "AllBrand",
    banner_to_url: Href,
    banner_to_page_type: Href,
    banner_ranking: index+1,
    belong_team: "Brand",
    campaign_code: Href,
    action_id: belongarea == "HotBrand" ? "1000201_005" : "1000201_006",
    page_id:"MB_1000201"
  });
}
const BrandFloor = ({
  classtitle,
  index,
  label,
  branddata,
  belongarea,
  curId
}) => (
  <div className={classtitle}>
    {label ? (
      curId === index ? (
        <div>
          <p className={"cur"}>{label}</p>
          <p>{label}</p>
        </div>
      ) : (
        <p>{label}</p>
      )
    ) : null}
    {branddata
      ? branddata &&
        branddata.map((d, index) => {
          const brand = d.brandNameEN.toLowerCase().replace(/[^\w]/g, "");
          const Href =
            "/brand/" +
            brand +
            "-" +
            d.brandId +
            "/" +
            "?intcmp=NewHome|Brands|BrandWall|All|" +
            brand;
          return (
            <a
              key={d.brandId}
              alt={d.brandNameCN}
              onClick={() => sensorEvent(d, belongarea, index)}
              href={Href}
            >
              <Image
                lazyClass={"lazy"}
                title={d.brandNameCN}
                size={216}
                src={d.imagePath}
              />
              {label ? <span>{d.brandNameCN}</span> : null}
            </a>
          );
        })
      : null}
  </div>
);

export default BrandFloor;
