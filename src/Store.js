import { reactive } from "vue"

export const store = reactive({

  email: '',
  userId: "",
  userName: "New User",
  userAvatarUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
  chatChannels: [],
  currentChannel: '',

  setEmail(email) {
    this.email = email
  },
  setUserId(id) {
    this.userId = id
  },
  setUserName(name) {
    this.userName = name
  },
  setUserAvatarUrl(avatar_url) {
    this.userAvatarUrl = avatar_url
  },
  setChatChannels(channels) {
    this.chatChannels = channels
  },
  setCurrentChannel(currentChannel) {
    this.currentChannel = currentChannel
  }
})