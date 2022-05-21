<template>
  <div class="body">
    <div v-if="channel">
      <div class="stfs">
        <h1 class="lbl">{{ channel }}</h1>
        <h2 class="lbl">
          Your Status is {{ natsConnected ? "Online" : "Offline" }}
        </h2>
      </div>
      <div class="box">
        <div class="chts" v-for="(msg) in messages" :key="msg.id">
        <div class="img-bbl">
          <img class="img" :src="msg.profiles.avatar_url" />
        </div>
          <div class="msg-bbl">
            <div class="usr">
              <span class="usr-m"> {{ msg.profiles.username }}: </span>
            </div>
            <div class="txt">
              <span class="txt-m"> {{ msg.text }} </span>
            </div>
            <div class="tme">
              <span class="tme-m"> {{ msg.created_at }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <input
          type="text"
          v-model="messageText"
          placeholder="Type a message"
          @keydown="handleInputKeyDown"
          class="text-input"
        />
      <div class="snd-dv">
        <button @click="sendMessage" type="button" class="send-btn">
          Send
        </button>
      </div>
      </div>
    </div>
    <div v-else>
      <profile />
    </div>
  </div>
</template>

<script>
import { connect, JSONCodec } from "nats.ws";
import { supabase } from "../supabase";
import moment from "moment";
import { store } from "../Store";
import profile from "./Profile.vue";

const jc = JSONCodec();

export default {
  name: "NatsDemo",

  components: {
    profile,
  },
  computed: {
    channel() {
      return store.currentChannel;
    },
  },
  watch: {
    channel() {

      if(this.sub) this.sub.unsubscribe();
      this.getMessages();
      this.sub = this.nc.subscribe(store.currentChannel, { callback: this.addMessage });
    },
  },
  data() {

    return {
      natsConnected: false,
      nc: null,
      messages: [],
      messageText: "",
      messageUser: "",
      currentChannel: "",
      sub: null,
    };
  },
  created() {
    //set up nats connection
    connect({
      servers: ["wss://natsdemo.voxo.co:443"],
      waitOnFirstConnect: true,
    })
      .then((nc) => {
        this.natsConnected = true;
        this.nc = nc;
      })
      .catch((err) => {
        console.log(err);
        console.log("could not connect to nats");
        this.natsConnected = false;
        this.nc = null;
      });
  },
  methods: {
    //add a received chat message to the dom
    addMessage(err, message) {
      const msgDecoded = jc.decode(message.data);
      supabase.from('messages')
          .select('text, created_at, profiles(username, avatar_url)')
          .eq('id', msgDecoded.id)
          .single()
          .then(({data, error}) => {
              this.messages = [...this.messages, data];
          })
          .catch(err => {
            console.log(err);
          })
    },

    //send chat message through nats
    //reset the input
    sendMessage(err, channel) {
      console.log("sending messager", store.currentChannel);
      supabase.from('messages')
          .insert([
            { channel_id: store.currentChannelId, profile_id: store.userId, text: this.messageText }
          ])
          .then(({data}) => {
            if (data) {
              this.nc.publish(
                store.currentChannel,
                jc.encode(data[0])
              )
              this.messageText = "";
            }
          })
          .catch(err => {
            console.log(err);
          })

    },

    //handling a keydown event to submit a message when pressing enter
    handleInputKeyDown(e) {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    },

    addCurrentChannel() {
      const Channel = store.currentChannel;
    },

    getMessages() {
      this.messages = [];
      supabase.from('messages')
          .select('text, created_at, profiles(username, avatar_url)')
          .eq('channel_id', store.currentChannelId)
          .then(({data, error}) => {
            console.log(data);
            if (data) {
              this.messages = data
            }
          })
          .catch(err => {
            console.log(err);
          })

    }
  },
};
</script>

<style lang="css">

.name {
  font-size: 1rem;
  text-align: center;
}

.msg {
  font-size: 2rem;
  text-align: center;
}

.dt {
  font-size: 1rem;
  text-align: center;
}

.msg-bubble {
  background-color: #30363d;
  box-shadow: 2rem;
  border-radius: 2rem;
  width: 50rem;
}

.text-input {
  text-align: center;
}

body {
  background-color: #161b22;
  height: 100%;
}

.container1 {
  max-width: 100%;
  padding-right: 10rem;
}

input,
select,
textarea {
  color: white;
}

.snd-dv {
  float: center;
}

.head {
  color: white;
  text-align: center;
  padding-top: 1rem;
  padding-right: 10rem;
}

.lbl {
  text-align: center;
  padding-right: 11rem;
}

.send-button {
  background-color: #f92120;
  border-radius: 2rem;
  padding: 10px;
  width: 6rem;
  color: #30363d;
  font-weight: bold;
  font-size: 1.5rem;
  height: 3.5rem;
}

.box {
  text-align: center;
  max-width: 75%;
  margin-left: 22.5rem;
  overflow: auto;
  overscroll-behavior-y: none;
  padding-top: 0.5rem;
  height: 100%;
}

.cbox {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.chats {
  max-width: 100%;
  min-width: 5rem;
}
.new-button {
  background-color: #f92120;
  border-radius: 2rem;
  padding: 10px;
  width: 6rem;
  color: #30363d;
  font-weight: bold;
  font-size: 1.5rem;
  float: right 50px;
  height: 4.7rem;
  text-align: center;
}

.all {
  max-width: 100%;
}

.usr {
  font-size: 1rem;
  color: #30363d;
  padding-bottom: 0.5rem;
}

.txt {
  font-size: 1rem;
  padding-right: 5rem;
  color: #30363d;
  padding-bottom: 1rem;
}

.tme {
  color: white;
  font-size: 0.5rem;
  display: inline-block;
}

.chts {
  border: 1px solid white;
  background-color: var(--custom-color-brand);
  margin: 1rem;
  border-radius: 5px;
  min-height: 5.5rem;
}

.msg-bbl {
  max-height: 7rem;
}

.send-btn {
  margin-top: 0.5rem;
}

.stfs {
  padding-left: 29rem;
}

.usr-m {
  color: #30363d;
  font-weight: bold;
}

.txt-m {
  color: #30363d;
  font-weight: bold;
}

.tme-m {
  color: #30363d;
}

.img {
  height: 5rem;
  width: 5rem;
  border-radius: 20px;
  top: 0rem;
  margin: 0.2rem;
}

.img-bbl {
  float: right;
}
</style>
