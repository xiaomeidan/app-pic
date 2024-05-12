import useEmojiStore from "@/stores/emoji";

function utilAlert(msg, iconType) {
  uni.showToast({
    title: msg == null ? "" : msg,
    icon: iconType == null ? "none" : iconType,
    duration: 1500,
  });
  return;
}

function utilLoading(tip, mask) {
  uni.showLoading({
    title: tip ? tip : "加载中",
    mask: mask ? mask : false,
  });

  setTimeout(function () {
    uni.hideLoading();
  }, 10000);
}

function clearVuex(that) {
  console.log("清除缓存");
  that.$u.vuex("vuex_userInfo", {});
  that.$u.vuex("vuex_token", "");
  that.$u.vuex("vuex_loginParam.password", "");
  that.$u.vuex("vuex_loginParam.userDeviceId", "");
  that.$u.vuex("circleData", []);
  that.$u.vuex("vuex_groupList", []);
  //uni.clearStorageSync();
}

function clearStorageVuex(that) {
  that.$u.vuex("circleData", []);
  that.$u.vuex("circleBgImg", "");
  that.$u.vuex("vuex_groupList", []);
  that.messageApi.clearLocalFile();
  utilAlert("清除成功");
}

function palyMsgTips() {
  let innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = false;
  innerAudioContext.src = "/static/mp3/msgTip2.mp3";
  innerAudioContext.startTime = 0;
  innerAudioContext.onPlay(() => {
    // console.log('开始播放');
    uni.vibrateLong({});
  });
  innerAudioContext.onError((res) => {
    //console.log(res.errMsg);
    //console.log(res.errCode);
    // innerAudioContext.destroy()
  });
  innerAudioContext.onEnded(function () {
    // console.log('结束播放,摧毁');
    innerAudioContext.destroy();
  });
  innerAudioContext.onStop(function () {
    //  console.log('停止播放,摧毁');
    innerAudioContext.destroy();
  });
  innerAudioContext.play();
}

function palyMsgTipSelected(that, chatGroupId) {
  let currentUserId = that.vuex_userInfo.id;
  let param = {
    chatGroupId: chatGroupId,
    userId: currentUserId,
  };
  that.$u.api.chatGroup
    .getChatPingBiFlag(param)
    .then((res) => {
      //console.log("获取是否屏蔽消息标志的结果",res);
      if (res.code == 200 && res.data == true) {
        //没有屏蔽,提示音提示
        palyMsgTips();
      } else {
        return;
      }
    })
    .catch((res) => {
      console.log("清除未读数量接口请求失败");
    });
}

//字节转换
function byteConvert(bytes) {
  //console.log("字节量"+bytes);
  if (isNaN(bytes)) {
    return "";
  }
  var symbols = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  var exp = Math.floor(Math.log(bytes) / Math.log(2));
  if (exp < 1) {
    exp = 0;
  }
  var i = Math.floor(exp / 10);
  bytes = bytes / Math.pow(2, 10 * i);
  if (bytes.toString().length > bytes.toFixed(2).toString().length) {
    bytes = bytes.toFixed(2);
  }
  return bytes + " " + symbols[i];
}

//全局上传文件
function globalUpload(that, callback) {
  if (typeof callback.success != "function") {
    callback.success = () => {};
  }
  if (typeof callback.fail != "function") {
    callback.fail = () => {};
  }
  if (typeof callback.complete != "function") {
    callback.complete = () => {};
  }
  let obj = callback.param;
  if (obj == null || obj == undefined) {
    console.log("上传文件的参数丢失!!!");
    return;
  }
  //console.log("上传文件的参数", obj);
  //自己的服务器
  let uploadFileUrl = that.$u.api.multipartAddress.uploadFile;
  //阿里云oss
  //let uploadFileUrl = this.$u.api.multipartAddress.uploadAliYun;
  let saveDir = "app";
  if (obj.savePath) {
    saveDir = obj.savePath;
  }
  let uploadUrl = uploadFileUrl + saveDir;
  let filePath = obj.filePath;
  let isSuccess = false;
  let msg = {};
  if (uploadUrl && filePath) {
    const uploadTask = uni.uploadFile({
      url: uploadUrl,
      filePath: filePath,
      name: "fileName",
      header: {
        "Access-Control-Allow-Origin": "*",
        TOKEN_OA: that.vuex_token,
      },
      success: (uploadFileRes) => {
        if (uploadFileRes.statusCode == 200 && uploadFileRes.data.length > 0) {
          let resObj = JSON.parse(uploadFileRes.data);
          if (resObj.code == 200) {
            let fileInfo = resObj.data;
            //console.log("返回类型",typeof fileInfo);
            if (typeof fileInfo == String) {
              let _url = that.$u.api.multipartAddress.getFileByPath + fileInfo;
              msg.url = _url;
              let suffix = fileInfo.substring(
                fileInfo.lastIndexOf(".") + 1,
                fileInfo.length,
              );
              msg.fileSuffix = suffix;
            } else {
              msg = Object.assign(fileInfo, obj);
              if (fileInfo.relativePath) {
                let _url =
                  that.$u.api.multipartAddress.getFileByPath +
                  fileInfo.relativePath;
                msg.url = _url;
              }
              if (fileInfo.size) {
                msg.fileSize = byteConvert(fileInfo.size);
              }
            }
            isSuccess = true;
            callback.success({
              result: msg,
              code: 1,
            });
          } else {
            isSuccess = false;
            callback.fail({
              result: null,
              code: 0,
            });
          }
        } else {
          isSuccess = false;
          callback.fail({
            result: null,
            code: 0,
          });
        }
      },
      fail: function () {
        callback.fail({
          result: null,
          code: -1,
        });
      },
    });
  }
}

/**
 * IOS端获取视频第一帧
 * videoPath 视频路径
 */
function iosCreateVideoThumbnail(that, callback) {
  if (!that) {
    console.log("传that!!!!!");
    return;
  }
  if (typeof callback.success != "function") {
    callback.success = () => {};
  }
  if (typeof callback.fail != "function") {
    callback.fail = () => {};
  }
  if (typeof callback.complete != "function") {
    callback.complete = () => {};
  }
  if (!callback.tempFilePath) {
    callback.fail("error");
    return;
  }
  let videoPath = callback.tempFilePath;
  console.log("是否有file://打头", videoPath);
  //需要去除file:// 不然获取不到视频
  if (videoPath.indexOf("file://") === 0) {
    videoPath = videoPath.slice(7);
  }
  // 图片存放路径，目前原生代码写死使用png格式生成
  let thumbnailPath = videoPath.slice(0, videoPath.lastIndexOf(".")) + ".png";
  //console.log("thumbnailPath",thumbnailPath);
  let videoThumbnail = uni.requireNativePlugin("YS-VideoThumbnail");
  let result = videoThumbnail.saveVideoThumbnail({
    videoUrl: videoPath, // 视频路径
    thumbPath: thumbnailPath, // 图片保存路径
  });
  if (result === "success") {
    let tempFilePath = `file://${thumbnailPath}`;
    uni.getImageInfo({
      src: tempFilePath,
      success: (image) => {
        image.filePath = image.path;
        let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
        let maxH = uni.upx2px(350); //350是定义消息图片最大高度
        if (image.width > maxW || image.height > maxH) {
          let scale = image.width / image.height;
          image.width = scale > 1 ? maxW : maxH * scale;
          image.height = scale > 1 ? maxW / scale : maxH;
        }
        let obj = {
          width: image.width,
          height: image.height,
          filePath: tempFilePath,
          savePath: "/chattingFiles", //文件存放目录
        };
        globalUpload(that, {
          param: obj,
          success: function (res) {
            console.log("ios获取视频第一帧成功");
            callback.success(res);
          },
        });
      },
    });
  } else {
    callback.fail(result);
    return;
  }
  // return `file://${thumbnailPath}`;
}

function androidCreateVideoThumbnail(that, callback) {
  if (!that) {
    console.log("传that!!!!!");
    return;
  }
  if (typeof callback.success != "function") {
    callback.success = () => {};
  }
  if (typeof callback.fail != "function") {
    callback.fail = () => {};
  }
  if (typeof callback.complete != "function") {
    callback.complete = () => {};
  }
  if (!callback.tempFilePath) {
    callback.fail("error");
    return;
  }
  let videoPath = callback.tempFilePath;
  const plugin = uni.requireNativePlugin("K-VideoInfoModule");
  plugin.getVideoFrame(
    {
      oriPath: videoPath,
    },
    (result) => {
      //console.log("安卓获取视频第一帧结果",result);
      if (result.code == 0) {
        let thumbnailPath = result.framePicPath;
        let tempFilePath = `file://${thumbnailPath}`;
        uni.getImageInfo({
          src: tempFilePath,
          success: (image) => {
            console.log("======image=========", image);
            image.filePath = image.path;
            let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
            let maxH = uni.upx2px(350); //350是定义消息图片最大高度
            if (image.width > maxW || image.height > maxH) {
              let scale = image.width / image.height;
              image.width = scale > 1 ? maxW : maxH * scale;
              image.height = scale > 1 ? maxW / scale : maxH;
            }
            let obj = {
              width: image.width,
              height: image.height,
              filePath: tempFilePath,
              savePath: "/chattingFiles", //文件存放目录
            };
            globalUpload(that, {
              param: obj,
              success: function (res) {
                //console.log("安卓获取视频第一帧成功");
                callback.success(res);
              },
            });
          },
        });
      } else {
        callback.fail(result);
      }
    },
  );
}

//二维码业务类型
const scan_business_code = {
  invited_join_group: {
    code: 1,
    expireTime: 2,
  }, //邀请入群
  personal_info: {
    code: 2,
    expireTime: -1,
  }, //个人信息
  groupInfo: {
    code: 3,
    expireTime: -1,
  }, //群信息
};

//扫码二维码
function scanQRcode(that, callback) {
  if (typeof callback.success != "function") {
    callback.success = () => {};
  }
  if (typeof callback.fail != "function") {
    callback.fail = () => {};
  }
  if (typeof callback.complete != "function") {
    callback.complete = () => {};
  }
  var mpaasScanModule = uni.requireNativePlugin("Mpaas-Scan-Module");
  mpaasScanModule.mpaasScan(
    {
      // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
      scanType: ["qrCode", "barCode"],
      // 是否隐藏相册，默认false不隐藏
      hideAlbum: false,
    },
    (ret) => {
      console.log("扫码结果", ret);
      if (ret.resp_code == 1000) {
        let result = ret.resp_result;
        console.log("二维码扫描结果", result);
        let qrModelInfo = JSON.parse(result);
        let createTimeStamp = qrModelInfo.createTimeStamp;
        let qrExpireTime = qrModelInfo.expireTime;
        let nowTimestamp = new Date().getTime();
        let during = Number(nowTimestamp) - Number(createTimeStamp);
        console.log("during", during);
        let duringHours = during / 1000 / 3600;
        console.log("duringHours", duringHours);
        if (qrExpireTime != -1 && duringHours > qrExpireTime) {
          console.log("二维码已过期");
          that.globalUtil.utilAlert("二维码已过期");
          return;
        }
        if (result.indexOf("businessCode") != -1) {
          //callback.complete(ret); //这里如果要跳不同页面,那就让他返回到调用页面自行处理
          //console.log("直接过去");//直接跳转到二维码解析界面
          that.$u.route({
            url: "/pages/chat/qr-info/qr-info",
            params: {
              qrInfo: result,
            },
            animationType: "slide-in-bottom",
          });
        } else {
          console.log("非本平台二维码");
          utilAlert("非法二维码!");
          callback.fail(ret);
        }
      } else {
        utilAlert("二维码无效!");
        callback.fail(ret);
      }
    },
  );
}

var faceUtils = {
  alt: [
    "[微笑]",
    "[撇嘴]",
    "[色]",
    "[发呆]",
    "[得意]",
    "[流泪]",
    "[害羞]",

    "[闭嘴]",
    "[睡]",
    "[大哭]",
    "[尴尬]",
    "[发怒]",
    "[调皮]",
    "[呲牙]",

    "[惊讶]",
    "[难过]",
    "[囧]",
    "[抓狂]",
    "[吐]",
    "[偷笑]",
    "[愉快]",

    "[白眼]",
    "[傲慢]",
    "[困]",
    "[惊恐]",
    "[憨笑]",
    "[悠闲]",
    "[咒骂]",

    "[疑问]",
    "[嘘]",
    "[晕]",
    "[衰]",
    "[骷髅]",
    "[敲打]",
    "[再见]",

    "[擦汗]",
    "[抠鼻]",
    "[鼓掌]",
    "[坏笑]",
    "[右哼哼]",
    "[鄙视]",
    "[委屈]",

    "[快哭了]",
    "[阴险]",
    "[亲亲]",
    "[可怜]",
    "[笑脸]",
    "[生病]",
    "[脸红]",

    "[破涕为笑]",
    "[恐惧]",
    "[失望]",
    "[无语]",
    "[嘿哈]",
    "[捂脸]",
    "[奸笑]",

    "[机智]",
    "[皱眉]",
    "[耶]",
    "[吃瓜]",
    "[加油]",
    "[汗]",
    "[天啊]",

    "[Emm]",
    "[社会社会]",
    "[旺柴]",
    "[好的]",
    "[打脸]",
    "[哇]",
    "[翻白眼]",

    "[666]",
    "[让我看看]",
    "[叹气]",
    "[苦涩]",
    "[裂开]",
    "[嘴唇]",
    "[爱心]",

    "[心碎]",
    "[拥抱]",
    "[强]",
    "[弱]",
    "[握手]",
    "[胜利]",
    "[抱拳]",

    "[勾引]",
    "[拳头]",
    "[OK]",
    "[合十]",
    "[啤酒]",
    "[咖啡]",
    "[蛋糕]",

    "[玫瑰]",
    "[凋谢]",
    "[菜刀]",
    "[炸弹]",
    "[便便]",
    "[月亮]",
    "[太阳]",

    "[庆祝]",
    "[礼物]",
    "[红包]",
    "[發]",
    "[福]",
    "[烟花]",
    "[猪头]",
  ],
  faces: function () {
    let self = this;
    let arr = {};
    for (let i = 1; i <= self.alt.length; i++) {
      //arr[self.alt[i]] = "./static/emoji/" + i + ".gif";   //表情加载不出来,请试试这行代码
      arr[self.alt[i]] = "/static/emoji/" + i + ".png";
    }
    return arr;
  },
  emojiList: function () {
    // let self = this;
    // let length = Math.ceil(self.alt.length / 24);
    // let arr = new Array(length);
    // for (let j = 0; j < length; j++) {
    //   let subArr = [];
    //   for (var i = j * 24; i < 24 * (j + 1); i++) {
    //     if (i > self.alt.length - 1) {
    //       break;
    //     }
    //     let obj = {
    //       url: i + ".gif",
    //       alt: self.alt[i],
    //     };
    //     subArr.push(obj);
    //   }
    //   arr[j] = subArr;
    // }
    // 表情不滚动
    let self = this;
    let length = self.alt.length;
    const arr = [];
    for (let j = 1; j <= length; j++) {
      arr.push({ url: j + ".png", alt: self.alt[j] });
    }
    return arr;
  },
};

function transform(content, fileSize, fileSuffix) {
  if (fileSize === undefined) {
    fileSize = "";
  }
  if (fileSuffix === undefined) {
    fileSuffix = "";
  }
  let html = function (end) {
    return new RegExp(
      "\\n*\\[" +
        (end || "") +
        "(code|pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)]\\n*",
      "g",
    );
  };
  // const faceList = useEmojiStore().baseEmoji;
  let fa = this.faceUtils.faces();
  if (content) {
    content = content
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;") // XSS
      //.replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2')
      // 转义表情
      .replace(/face\[([^\s\[\]]+?)]/g, function (face) {
        let alt = face.replace(/^face/g, "");
        /*style="width:28rpx;height:28rpx;"*/
        let imgContent = '<img class="emoji" src="' + fa[alt] + '"/>';
        return imgContent;
      })
      // 转义图片
      .replace(/img\[([^\s]+?)]/g, function (img) {
        let href = img.replace(/(^img\[)|(]$)/g, "");
        return (
          '<img class="message-img" src="' + href + '" alt="消息图片不能加载">'
        );
      })
      // 转义文件
      .replace(/file\([\s\S]+?\)\[[\s\S]*?]/g, function (str) {
        let href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
        let text = (str.match(/\)\[([\s\S]*?)]/) || [])[1];
        if (!href) return str;
        return (
          '<div class="flex"><i class="iconfont icon-xiazai-yun"></i><a class="message-file"  href="' +
          href +
          '">' +
          (text || href) +
          "</a><span>" +
          fileSize +
          "</span></div>"
        );
      })
      // 转义音频
      .replace(/audio\[([^\s]+?)]/g, function (audio) {
        return (
          '<div class="message-audio" data-src="' +
          audio.replace(/(^audio\[)|(]$)/g, "") +
          '"><i class="layui-icon">&#xe652;</i><p>音频消息</p></div>'
        );
      })
      // 转义视频
      .replace(/video\[([^\s]+?)]/g, function (video) {
        return (
          '<div class="message-video"  data-src="' +
          video.replace(/(^video\[)|(]$)/g, "") +
          '"><i class="layui-icon">&#xe652;</i></div>'
        );
      })
      // 转义链接
      .replace(/a\([\s\S]+?\)\[[\s\S]*?]/g, function (str) {
        let href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
        let text = (str.match(/\)\[([\s\S]*?)]/) || [])[1];
        if (!href) return str;
        return (
          '<a href="' + href + '" target="_blank">' + (text || href) + "</a>"
        );
      })
      .replace(html(), "<$1 $2>")
      .replace(html("/"), "</$1>") // 转移HTML代码
      .replace(/\n/g, "<br>"); // 转义换行
  }
  content = getUrl(content);
  //console.log("content",content);
  return content;
}

function getUrl(str) {
  let oldStr = str;
  const reg =
    /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  str = str.match(reg);
  if (str && str.length > 0) {
    let a = "<a href='" + str + "'>" + str + "</a>";
    let newContent = oldStr.replace(new RegExp(reg, "g"), a);
    //console.log("newContent",newContent);
    return newContent;
  } else {
    return oldStr;
  }
}
//跳转聊天窗口
function linkToChatting(groupInfo, that) {
  let chatGroupId = groupInfo.id;
  let groupType = groupInfo.chatGroupType;
  let currentUserId = groupInfo.createUser;
  //重置未读信息数量
  let paramData = {
    chatGroupId: chatGroupId,
    userId: currentUserId,
    groupType: groupType,
  };
  that.$u.api.chatGroup
    .activeHiddenFlag(paramData)
    .then((res) => {
      if (res.code === 200) {
        let param = "?chatGroupId=" + chatGroupId;
        let _url = "/pages/chat/chatGroup/chatting";
        let chatUrl = _url + param;
        uni.navigateTo({
          url: chatUrl,
          success() {
            that.$u.api.chatGroup
              .clearUnReadNum(param)
              .then((res) => {
                console.log("重置未读信息数量响应结果", res);
              })
              .catch((res) => {
                console.log("清除未读数量接口请求失败");
              });
          },
        });
      } else {
        console.log("清除未读数量失败", res);
        that.globalUtil.utilAlert(res.data.msg, "none");
        uni.hideLoading();
        return;
      }
      // 获得数据
    })
    .catch((res) => {
      // 失败进行的操作
      console.log("清除未读数量接口请求失败");
    });
}

function uniCopy({ content, success, error }) {
  if (!content) return error("复制的内容不能为空 !");
  content = typeof content === "string" ? content : content.toString(); // 复制内容，必须字符串，数字需要转换为字符串
  /**
   * 小程序端 和 app端的复制逻辑
   */
  //#ifndef H5
  uni.setClipboardData({
    data: content,
    success: function () {
      success("复制成功~");
      console.log("success");
    },
    fail: function () {
      success("复制失败~");
    },
  });
  //#endif

  /**
   * H5端的复制逻辑
   */
  // #ifdef H5
  if (!document.queryCommandSupported("copy")) {
    //为了兼容有些浏览器 queryCommandSupported 的判断
    // 不支持
    error("浏览器不支持");
  }
  let textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.readOnly = "readOnly";
  document.body.appendChild(textarea);
  textarea.select(); // 选择对象
  textarea.setSelectionRange(0, content.length); //核心
  let result = document.execCommand("copy"); // 执行浏览器复制命令
  if (result) {
    success("复制成功~");
  } else {
    error(
      "复制失败，请检查h5中调用该方法的方式，是不是用户点击的方式调用的，如果不是请改为用户点击的方式触发该方法，因为h5中安全性，不能js直接调用！",
    );
  }
  textarea.remove();
  // #endif
}

function parseTime(timeStr) {
  let t = timeStr.replace(/-/g, "/");
  let date = new Date(t);
  //console.log("日期格式的字符串转换为时间", date);
  return date;
  //return date.getTime();
}

function debounce(fn, delay) {
  let timer;
  return function () {
    let _this = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, delay);
  };
}

// 防止处理多次点击
function noMultipleClicks(methods, info) {
  // methods是需要点击后需要执行的函数， info是点击需要传的参数
  let that = this;
  if (that.noClick) {
    // 第一次点击
    that.noClick = false;
    if (info && info !== "") {
      // info是执行函数需要传的参数
      methods(info);
    } else {
      methods();
    }
    setTimeout(() => {
      that.noClick = true;
    }, 2000);
  } else {
    utilAlert("慢点戳!");
  }
}

//用户权限的code常量
const im_power_code = {
  create_group: "addNewGroup",
};
//检查用户是否有某个权限
function checkUserPower(that, powerCode, callback) {
  if (!that) {
    console.log("that不要忘了............");
    return false;
  }
  if (typeof callback.success != "function") {
    callback.success = () => {};
  }
  if (typeof callback.fail != "function") {
    callback.fail = () => {};
  }
  if (typeof callback.complete != "function") {
    callback.complete = () => {};
  }
  that.$u.api.sys
    .checkUserPower({
      powerCode,
    })
    .then((res) => {
      if (res.code == 200 && res.data) {
        callback.success(true);
      } else {
        callback.fail(false);
      }
      callback.complete(res.data);
    });
}

function appDownloadUrl() {
  let platfrom = uni.getSystemInfoSync().osName;
  if ("android" === platfrom) {
    return "安卓下载链接";
  } else {
    return "苹果下载链接";
  }
}

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 1;
      break;
  }
}

//  秒数转化为时分秒
function formatSeconds(value) {
  //  秒
  let second = parseInt(value);
  //  分
  let minute = 0;
  //  小时
  let hour = 0;
  //  天
  //  let day = 0
  //  如果秒数大于60，将秒数转换成整数
  if (second > 60) {
    //  获取分钟，除以60取整数，得到整数分钟
    minute = parseInt(second / 60);
    //  获取秒数，秒数取佘，得到整数秒数
    second = parseInt(second % 60);
    //  如果分钟大于60，将分钟转换成小时
    if (minute > 60) {
      //  获取小时，获取分钟除以60，得到整数小时
      hour = parseInt(minute / 60);
      //  获取小时后取佘的分，获取分钟除以60取佘的分
      minute = parseInt(minute % 60);
      //  如果小时大于24，将小时转换成天
      //  if (hour > 23) {
      //    //  获取天数，获取小时除以24，得到整天数
      //    day = parseInt(hour / 24)
      //    //  获取天数后取余的小时，获取小时除以24取余的小时
      //    hour = parseInt(hour % 24)
      //  }
    }
  }

  let result =
    "" +
    (parseInt(second) < 10 ? "0" + parseInt(second) : parseInt(second)) +
    "";
  if (minute > 0) {
    result =
      "" +
      (parseInt(minute) < 10 ? "0" + parseInt(minute) : parseInt(minute)) +
      ":" +
      result;
  } else {
    result = "00:" + result;
  }
  if (hour > 0) {
    result =
      "" +
      (parseInt(hour) < 10 ? "0" + parseInt(hour) : parseInt(hour)) +
      ":" +
      result;
  } else {
    result = "00:" + result;
  }
  //  if (day > 0) {
  //    result = '' + parseInt(day) + '天' + result
  //  }
  //console.log('秒转化时分秒结果', result);
  return result;
}

function formatChatMsgTime(time) {
  let date = new Date(time);
  let now = new Date();
  let diff = now - date; // 得到时间差，单位为毫秒

  // 计算不同时间区间
  let pastSeconds = Math.floor(diff / 1000);
  let pastMinutes = Math.floor(pastSeconds / 60);
  let pastHours = Math.floor(pastMinutes / 60);
  let pastDays = Math.floor(pastHours / 24);
  let pastMonths = Math.floor(pastDays / 30);
  let pastYears = Math.floor(pastDays / 365);
  if (pastYears > 0) {
    if (now.getFullYear() == date.getFullYear()) {
      return `${date.getMonth() + 1}月${date.getDate()}日 ${getTimePeriod(date)}${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    }
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${getTimePeriod(date)}${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  } else if (pastMonths > 0 || pastDays > 7) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${getTimePeriod(date)}${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  } else if (pastDays > 0) {
    let days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    if (pastDays == 1) {
      return `昨天 ${getTimePeriod(date)}${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    } else {
      return `${days[date.getDay()]} ${getTimePeriod(date)}${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    }
  } else {
    return `${getTimePeriod(date)}${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  }
}

function getTimePeriod(d) {
  var time = d.getHours();
  if (time < 12) {
    return "上午";
  } else if (time > 12 && time < 18) {
    return "下午";
  } else {
    return "晚上";
  }
}

export default {
  appDownloadUrl,
  utilAlert,
  utilLoading,
  palyMsgTips,
  palyMsgTipSelected,
  clearVuex,
  clearStorageVuex,

  byteConvert,
  globalUpload,
  scan_business_code,
  faceUtils,
  transform,
  linkToChatting,
  uniCopy,
  parseTime,
  noMultipleClicks,
  debounce,
  iosCreateVideoThumbnail,
  androidCreateVideoThumbnail,
  checkUserPower,
  randomNum,
  im_power_code,
  formatSeconds,
  formatChatMsgTime,
};
