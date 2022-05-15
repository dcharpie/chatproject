<template>
  <div class="body">
    <RouterView />
  </div>
</template>

<script>
import { RouterView } from "vue-router";

export default {
  name: "Home",
  components: {
    RouterView,
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
</style>
