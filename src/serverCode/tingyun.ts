// if (process.env.RUN_ENV === "stage") {
//   require("tingyun");
// } else if (process.env.RUN_ENV === "production") {
//   require("tingyun");
// }

if (process.env.RUN_ENV && process.env.RUN_ENV != 'development') {
    require('tingyun');
} else {
    console.log('本地环境不加载tingyun=============================');
}