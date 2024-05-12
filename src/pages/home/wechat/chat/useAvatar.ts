// 头像相关操作
import { ref } from "vue";
import unknownAvatar from "@/static/image/weixin/defaultAvatar.png";

export default () => {
  let currentEditAvatar = "";
  const avatarOpt = [
    { id: "official", name: "官方头像" },
    { id: "local", name: "本地图片" },
  ];
  const showSelectAvatar = ref(false);
  const showAvatarList = ref(false);
  const leftAvatar = ref("");
  const rightAvatar = ref("");

  function getAvatar(meFlag: boolean) {
    const avatar = meFlag ? rightAvatar.value : leftAvatar.value;
    return avatar || unknownAvatar;
  }

  function openAvatar(direction: string) {
    console.log("change avatar ", direction);
    currentEditAvatar = direction;
    showSelectAvatar.value = true;
  }

  function onCloseSelectAvatar() {
    showSelectAvatar.value = false;
  }

  function onCLoseAvatarList() {
    showAvatarList.value = false;
  }

  function selectAvatarOpt(opt: { id: string }) {
    onCloseSelectAvatar();
    console.log("select avatar ", opt);
    if (opt.id === "official") {
      showAvatarList.value = true;
      return;
    }
    uni.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        // self.src = res.tempFilePath;
      },
    });
  }

  function onSelectLocalAvatar(url: string) {
    console.log("already select ", currentEditAvatar);
    if (currentEditAvatar === "left") {
      leftAvatar.value = url;
    } else {
      rightAvatar.value = url;
    }
    showAvatarList.value = false;
  }

  return {
    avatarOpt,
    leftAvatar,
    rightAvatar,
    showSelectAvatar,
    showAvatarList,
    openAvatar,
    getAvatar,
    selectAvatarOpt,
    onSelectLocalAvatar,
    onCloseSelectAvatar,
    onCLoseAvatarList,
  };
};
