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
          <li v-for="currentChannel in channels" :key="currentChannel">
            <button @click="getChannel(currentChannel)" class="avail-channels">
              {{ currentChannel }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "../Store";
import { ref } from "vue";
import { supabase } from "../supabase";

export default {
  setup() {
    const loading = ref(true);
    const avatar_url = ref("");
    const chatChannels = ref([]);
    const newTopic = ref("");
    const channels = ref("");

    async function getAvtr() {
      try {
        loading.value = true;
        //const user = await supabase.auth.user()
        //store.setUser(user)

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`avatar_url, channels`)
          .eq("id", store.userId)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          avatar_url.value = data.avatar_url;
          channels.value = data.channels;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    const getChannel = (currentChannel) => {
      store.setCurrentChannel(currentChannel);
    };

    const createChannel = async () => {
      channels.value = [...channels.value, newTopic.value];
    };
    getAvtr();
    return {
      createChannel,
      getChannel,
      newTopic,
      avatar_url,
      channels,
    };
  },
};
</script>


<style>
.top-nav {
  width: 100%;
  background-color: #30363d;
  height: 5.1rem;
  border-bottom: 1px solid var(--custom-color-brand);
}

.nav-link {
  float: right;
  background-color: var(--custom-color-brand);
  border: 2px solid #161b22;
  height: 5rem;
  width: 5rem;
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
  font-size: 3rem;
  padding-top: 0.5rem;
  padding-left: 1rem;
  float: left;
  color: var(--custom-color-brand);
}

.img {
  height: 5rem;
  width: 5rem;
  border-radius: 10px;
  float: right;
  position: absolute;
  left: 96rem;
  top: 0rem;
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
}
</style>