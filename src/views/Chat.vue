<template>
  <div class="body">
    <div v-if="channel">
      <div class="stfs">
        <div class="chats"></div>
        <h1 class="lbl">{{ channel }}</h1>
        <h2 class="lbl">
          Your Status is {{ natsConnected ? "Online" : "Offline" }}
        </h2>
      </div>
      <div class="container1"></div>
      <div class="box">
        <div class="chts" v-for="(msg, index) in messages" :key="index">
          <div class="msg-bbl">
            <div class="usr">
              <span class="usr-m"> {{ msg.user }}: </span>
            </div>
            <div>
              <span class="txt-m"> {{ msg.text }} </span>
            </div>
            <div class="tme">
              <span class="tme-m"> {{ msg.time }}</span>
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

        <button @click="sendMessage" type="button" class="send-btn">
          Send
        </button>
      </div>
    </div>
    <div v-else>
      <profile />
    </div>
  </div>
</template>

<script>
import { connect, JSONCodec } from "nats.ws";
import moment from "moment";
import { store } from "../Store";
import profile from "./Profile.vue";
import { ref } from 'vue';

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
      this.nc.unsubscribe;
      this.messages = [];
      this.nc.subscribe(store.currentChannel, { callback: this.addMessage });
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
      msgDecoded.time = moment().format("MM-DD HH:mm:ss");
      this.messages = [...this.messages, msgDecoded];
    },

    //send chat message through nats
    //reset the input
    sendMessage(err, channel) {
      console.log("sending messager", store.currentChannel);
      this.nc.publish(
        store.currentChannel,
        jc.encode({ text: this.messageText, user: store.userName })
      );
      this.messageText = "";
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
  display: flexbox;
  border-radius: 2rem;
  margin: auto;
  width: 50rem;
}

.text-input {
  text-align: center;
}

body {
  background-color: #161b22;
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

.head {
  color: white;
  text-align: center;
  padding-top: 1rem;
  padding-right: 10rem;
}

.lbl {
  text-align: center;
  padding-right: 20rem;
}

.send-button {
  background-color: #f92120;
  border-radius: 2rem;
  padding: 10px;
  width: 6rem;
  color: #30363d;
  font-weight: bold;
  font-size: 1.5rem;
  float: right 50px;
  height: 3.5rem;
}

.box {
  text-align: center;
  max-width: 45rem;
  max-height: 15rem;
  margin: auto;
  overflow: auto;
  overscroll-behavior-y: none;
  padding-left: 10rem;
  padding-top: 0.5rem;
}

.cbox {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.chats {
  max-width: 100%;
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
  display: inline-flexbox;
}

.txt {
  font-size: 1.5rem;
  padding-right: 20rem;
  color: #30363d;
}

.tme {
  color: white;
  font-size: 0.5rem;
  display: inline-block;
}

.chts {
  border: 1px solid white;
  background-color: var(--custom-color-brand);
  margin: 3px;
  border-radius: 5px;
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
</style>
