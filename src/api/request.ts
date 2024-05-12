const BASE_URL = "https://photomake.cn/";

interface Opt {
  url: string;
  method: 'post' | 'get';
  data?: any;
  hideLoading?: boolean;
}

export function sendQuest(opt: Opt) {
  const url = BASE_URL + opt.url;
  const method = opt.method.toUpperCase() as 'POST' | 'GET';
  const data = opt.data || {};
  const hideLoading = opt.hideLoading || false;

  //加载圈
  if (!hideLoading) {
    uni.showLoading({
      title: '加载中...'
    });
  }

  
  // 返回promise
  return new Promise((resolve, reject) => {
    // 请求
    uni.request({
        url,
        data: data,
        method,
        success: (res) => {
          // 判断 请求api 格式是否正确
          if (res.data.code === 200) {
          // 将结果抛出
          resolve(res.data)
          } else if (res.data.code === 500) {
            uni.showToast({
              title: "api错误" + res.data.message,
              icon: 'none',
            });
          }
        },
        //请求失败
        fail: (e: any) => {
          uni.showToast({
            title: "" + e.data.msg,
            icon: 'none'
          });
          reject(e.data);
        },
        //请求完成
        complete() {
          //隐藏加载
          if (!hideLoading) {
            uni.hideLoading();
          }
          resolve();
          return;
        }
    })
  })
}
