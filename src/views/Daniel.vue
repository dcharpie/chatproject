<template>
  <div class="body">
    <div class="container">
      <div class="chats"></div>
    </div>
    <h1 class="head">Welcome To The Chat!</h1>
    <h2 class="lbl">
      Your Status is {{ natsConnected ? "Online" : "Offline" }}
    </h2>
    <div class="box">
      <p class="instruct">Select a channel to get started chatting!</p>
    </div>
  </div>
</template>

<script>
import { connect, JSONCodec } from "nats.ws";
import moment from "moment";
import { store } from "../Store";

const jc = JSONCodec();

export default {
  name: "NatsDemo",
  data() {
    return {
      natsConnected: false,
      nc: null,
      messages: [],
      messageText: "",
      messageUser: "",
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
        this.nc.subscribe("chatChannel", { callback: this.addMessage });
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
      msgDecoded.time = moment().format("YYYY-MM-DD HH:mm:ss");
      this.messages = [...this.messages, msgDecoded];
    },

    //send chat message through nats
    //reset the input
    sendMessage() {
      console.log("sending messager");
      this.nc.publish(
        "chatChannel",
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

.textInput {
  border-radius: 2rem;
  height: 2.5rem;
  width: 45rem;
  background-color: #161b22;
  border: 1px solid white;
  text-align: center;
  font-size: 2rem;
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
  padding-left: 30rem;
  font-size: 4rem;
}

.lbl {
  text-align: center;
  padding-left: 40rem;
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
  width: 50rem;
  max-height: 50rem;
  margin: auto;
  overflow: auto;
  overscroll-behavior-y: contain;
  padding-left: 10rem;
}

.cbox {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.chats {
  max-width: 100%;
  margin: auto;
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
  position: relative;
  flex: inline;
  font-size: 1.5rem;
  padding-right: 33rem;
  color: #30363d;
}

.txt {
  font-size: 2.5rem;
  color: #30363d;
}

.tme {
  position: relative;
  flex: inline;
  padding-left: 30rem;
  color: #30363d;
}

.chts {
  border: 2px solid white;
  background-color: var(--custom-color-brand);
}

.instruct {
  font-weight: bold;
  text-align: center;
  font-size: 2rem;
  padding-left: 10rem;
}
</style>
