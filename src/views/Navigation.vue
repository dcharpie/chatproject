<template>
  <div>
    <div class="top-nav">
      <router-link to="/chat">
        <header class="brand">Daniel's Chat App</header>
      </router-link>
      <router-link class="nav-link" to="/profile">
        <img class="img" :src="avatar_url" />
      </router-link>
    </div>
    <div class="vertical-nav">
      <div class="chan-table">
        <div class="new-chan">
          <input
            class="inpt"
            v-model="newTopic"
            type="text"
            placeholder="Name new Channel"
          />
          <button class="add-btn" @click="createChannel">Add Channel</button>
        </div>
        <h1 class="lab-channels">Channels</h1>
        <ul>
          <li v-for="currentChannel in channels" :key="currentChannel.id">
            <button @click="getChannel(currentChannel)" class="avail-channels">
              {{ currentChannel.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "../Store";
import { ref, computed } from "vue";
import { supabase } from "../supabase";

export default {
  setup() {
    const loading = ref(true);
    const newTopic = ref("");
    const avatar_url = computed(() => {
      return store.userAvatarUrl;
    });
    const channels = computed(() => {
      return store.channels;
    });

    const getChannel = (currentChannel) => {
      store.setCurrentChannel(currentChannel.name);
      store.setChannelId(currentChannel.id);
    };

    const createChannel = async () => {
      const { data, error } = await supabase
        .from("channels")
        .insert([{ name: newTopic.value }]);

      console.log(data);
      if (data) {
        store.addChannel(data[0]);
        newTopic.value = "";
      }
    };
    return {
      createChannel,
      getChannel,
      newTopic,
      channels,
      avatar_url,
    };
  },
};
</script>


<style>
.top-nav {
  width: 100%;
  background-color: #30363d;
  height: 5.5rem;
  border-bottom: 1px solid var(--custom-color-brand);
}

.nav-link {
  float: right;
  font-weight: bold;
  border-radius: 10px;
}

.vertical-nav {
  height: 100%;
  width: 18rem;
  float: left;
  padding: 0.5rem;
  border-right: 1px solid var(--custom-color-brand);
  background-color: #30363d;
  position: absolute;
}

.avail-channels {
  color: white;
  font-size: 1.2rem;
  margin-left: 2rem;
}

.lab-channels {
  color: white;
  text-align: center;
  font-size: 2rem;
}

.brand {
  font-weight: bold;
  text-align: center;
  font-size: 3.5rem;
  padding-top: 0.5rem;
  padding-left: 1rem;
  float: left;
  color: var(--custom-color-brand);
}

.img {
  float: right;
  background-color: var(--custom-color-brand);
  border: 2px solid #161b22;
  height: 5rem;
  width: 5rem;
  font-weight: bold;
  border-radius: 10px;
}

.chan-table {
  padding-right: 1rem;
}

.new-chan {
  width: 14rem;
}

.inpt {
  text-align: center;
  margin-left: 1.5rem;
}

.add-btn {
  margin-left: 4.5rem;
  margin-top: 0.5rem;
}
</style>