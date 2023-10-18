export default function pageData() {
    function get_device(devices) {
        if (devices) return devices;
        if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) return "MP_";
        if (navigator.userAgent.match(/sephora\/app/)) return "APP_";
        return "MB_";
    }
    const URL = window.location
    const pageTMP = {
        campaign: () => {
            const dataPath = URL.pathname.split("/")[2] || null;
            if (dataPath && dataPath === "share") {
                const dataPathV2 = URL.pathname.split("/")[3] || null;
                if (dataPathV2 === 'giftFinder')
                    return {
                        page_id: get_device() + "1000801"
                    };
                if (dataPathV2 === 'giftResult')
                    return {
                        page_id: get_device() + "1000802"
                    };
            }

        },
    }
    let pathname = URL.pathname === "/" ? "home" : URL.pathname.split("/")[1];
    pathname = pathname.indexOf("order-") === 0 ? "order" : pathname;
    pathname = pathname === "brands" ? "brand" : pathname;
    const obj = (pathname && pageTMP[pathname] && pageTMP[pathname]())
    return obj;
}