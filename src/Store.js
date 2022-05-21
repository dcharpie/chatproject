import { reactive } from "vue"

export const store = reactive({

  email: '',
  userId: "",
  userName: "New User",
  userAvatarUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
  channels: [],
  currentChannel: '',
  group_chats: [],
  support_chats: [],
  currentChannelId: "",

  setEmail(email) {
    this.email = email
  },
  setUserId(id) {
    this.userId = id
  },
  setUserName(username) {
    this.userName = username
  },
  setUserAvatarUrl(avatar_url) {
    this.userAvatarUrl = avatar_url
  },
  setChannels(channels) {
    this.channels = channels
  },
  setCurrentChannel(currentChannel) {
    this.currentChannel = currentChannel
  },
  setGroupChats(group_chats){
    this.group_chats = group_chats
  },
setSupportChats(support_chats){
  this.support_chats = support_chats
  },
addChannel(channel) {
  this.channels = [...this.channels, channel] 
},
setChannelId(channelId) {
  this.currentChannelId = channelId
}
})