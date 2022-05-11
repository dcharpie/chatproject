<template>

<div class="all">
  <div class="container">
    <div class="chats">
        <input type="checkbox" id="daniel" value="Daniel" v-model="checkedNames">
        <label class="cbox" for="daniel">Daniel</label>
        
        <input type="checkbox" id="james" value="James" v-model="checkedNames">
        <label class="cbox" for="james">James</label>
        
        <input type="checkbox" id="noah" value="Noah" v-model="checkedNames">
        <label class="cbox" for="noah">Noah</label>
        
        <input type="checkbox" id="amy" value="Amy" v-model="checkedNames">
        <label class="cbox" for="amy">Amy</label>
        
        <input type="checkbox" id="anthony" value="Anthony" v-model="checkedNames">
        <label class="cbox" for="anthony">Anthony</label>
        
        <input type="checkbox" id="avery" value="Avery" v-model="checkedNames">
        <label class="cbox" for="avery">Avery</label>
        
        <input type="checkbox" id="brandon" value="Brandon" v-model="checkedNames">
        <label class="cbox" for="brandon">Brandon</label>
        
        <input type="checkbox" id="chance" value="Chance" v-model="checkedNames">
        <label class="cbox" for="chance">Chance</label>
        
        <input type="checkbox" id="ervin" value="Ervin" v-model="checkedNames">
        <label class="cbox" for="ervin">Ervin</label>
        
        <input type="checkbox" id="joe" value="Joe" v-model="checkedNames">
        <label class="cbox" for="joe">Joe</label>
        
        <input class="cbox" type="checkbox" id="joel" value="Joel" v-model="checkedNames">
        <label class="cbox" for="joel">Joel</label>
        
        <input type="checkbox" id="josh" value="Josh" v-model="checkedNames">
        <label class="cbox" for="josh">Josh</label>
        
        <input type="checkbox" id="levi" value="Levi" v-model="checkedNames">
        <label class="cbox" for="levi">Levi</label>
        
        <input type="checkbox" id="matt" value="Matt" v-model="checkedNames">
        <label class="cbox" for="matt">Matt</label>
        
        <input type="checkbox" id="nick" value="Nick" v-model="checkedNames">
        <label class="cbox" for="nick">Nick</label>
        
        <input type="checkbox" id="paul" value="Paul" v-model="checkedNames">
        <label class="cbox" for="paul">Paul</label>
        
        <input type="checkbox" id="phil" value="Phil" v-model="checkedNames">
        <label class="cbox" for="phil">Phil</label>
        
        <input type="checkbox" id="seth" value="Seth" v-model="checkedNames">
        <label class="cbox" for="seth">Seth</label>
        
        <input type="checkbox" id="tim" value="Tim" v-model="checkedNames">
        <label class="cbox" for="tim">Tim</label>
        </div>
        <button @click="newChat" class="new-button"> New Chat </button>
    </div>
    <h1 class="head">
      Welcome To The Chat!
    </h1>
    <h2 class="head">
      Your Status is {{ natsConnected ? 'Online' : 'Offline'}}
    </h2>
    <div class="submit-container">

    </div>
    <div class="box">
      <div
        class="msg-bubble"
        v-for="(msg, index) in messages"
        :key="index"
      >
        <h3 class="name">{{ msg.user }}</h3>
        <p class="msg"> {{ msg.text }} </p>
        <p class="dt"> {{ msg.time }}</p>
      </div>
      </div>
      <div class="box">
    <input
        type="text"
        v-model="messageText"
        placeholder="Type a message"
        @keydown="handleInputKeyDown"
        class="textInput"
      />

      <button
        @click="sendMessage"
        type="button"
        class="send-button"
      >
        Send
      </button>
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
        messageText: '',
        checkedNames: [],
      }
    },
    created() {

      //set up nats connection
      connect({servers: ['wss://natsdemo.voxo.co:443'], waitOnFirstConnect: true})
        .then( (nc) => {
          this.natsConnected = true;
          this.nc = nc;
          this.nc.subscribe(this.checkedNames.toString(), {callback: this.addMessage});
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
          this.nc.publish(this.checkedNames.toString(), jc.encode({text: this.messageText, user: "Anthony" }));
          this.messageText = '';
        }
      },

      //handling a keydown event to submit a message when pressing enter
      handleInputKeyDown(e) {
        if(e.key === 'Enter'){
          this.sendMessage()
        }
      },
      newChat() {
        connect({servers: ['wss://natsdemo.voxo.co:443'], waitOnFirstConnect: true})
        .then( (nc) => {
          this.natsConnected = true;
          this.nc = nc;
          this.nc.subscribe(this.checkedNames.toString(), {callback: this.addMessage});
        })
        .catch(err => {
          console.log(err);
          console.log('could not connect to nats');
          this.natsConnected = false;
          this.nc = null;
        })
      }
        }
    }

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
  padding: 10px;
  background-color: #161b22;
  border: 1px solid white;
  text-align: center;
  font-size: 2rem;
}

body {
  background-color: #161b22;
}

.container {
  max-width: 100%;

}

input, select, textarea{
  color: white;
}

.head {
  color: white;
  text-align: center;
}

.send-button{
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
  max-width: 50%;
  max-height: 50rem;
  margin: auto;
  overflow: auto;
  overscroll-behavior-y: contain;
}

.cbox {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.chats {
  max-width: 80rem;
}
.new-button{
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
  max-width: 100rem;
}

</style>
