<template>

  <div class="container">
    <h1>
      Vue Is  Way Better Than React !!
    </h1>
    <h2>
      Nats is {{ natsConnected ? 'Connected' : 'Not Connected'}}
    </h2>
    <div class="submit-container">

      <input
        type="text"
        v-model="messageText"
        placeholder="Type a message"
        @keydown="handleInputKeyDown"
      />

      <button
        @click="sendMessage"
        type="button"
      >
        Send
      </button>

    </div>
    <div class="message-container">
      <div
        class="message"
        v-for="(msg, index) in messages"
        :key="index"
      >
        <h3>{{ msg.user }}</h3>
        <p> {{ msg.text }} </p>
        <p> {{ msg.time }}</p>
      </div>
    </div>
  </div>

</template>

<script>

import {connect, JSONCodec} from 'nats.ws';
import moment from 'moment';
const jc = JSONCodec();

  export default {
    name: 'NatsDemo',
    data() {
      return {
        natsConnected: false,
        nc: null,
        messages: [],
        messageText: ''
      }
    },
    created() {

      //set up nats connection
      connect({servers: ['wss://natsdemo.voxo.co:443'], waitOnFirstConnect: true})
        .then( (nc) => {
          this.natsConnected = true;
          this.nc = nc;
          this.nc.subscribe('chatChannel', {callback: this.addMessage});
        })
        .catch(err => {
          console.log(err);
          console.log('could not connect to nats');
          this.natsConnected = false;
          this.nc = null;
        })
    },
    methods: {

      //add a received chat message to the dom
      addMessage(err, message) {
        const msgDecoded = jc.decode(message.data);
        msgDecoded.time = moment().format('YYYY-MM-DD HH:mm:ss');
        this.messages = [...this.messages, msgDecoded];
      },

      //send chat message through nats
      //reset the input
      sendMessage() {
        console.log('sending messager');
        if(this.messageText){
          this.nc.publish( 'chatChannel', jc.encode({text: this.messageText, user: 'Joe'}));
          this.messageText = '';
        }
      },

      //handling a keydown event to submit a message when pressing enter
      handleInputKeyDown(e) {
        if(e.key === 'Enter'){
          this.sendMessage()
        }
      }
    }
  }

</script>

<style lang="css">

.container {
  max-width: 1200px;
  margin: auto;
}

</style>
