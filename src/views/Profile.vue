<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div>
      <img class="avtr" :src="avatar_url" />
      <label for="email">Email</label>
      <input id="email" type="text" :value="store.email" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="website" v-model="website" />
    </div>
    <div>
      <label for="avatar">Avatar URL</label>
      <input id="avatar" type="text" v-model="avatar_url" />
    </div>

    <div>
      <input
        type="submit"
        class="button block primary"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
</template>

<script>
import { supabase } from "../supabase";
import { store } from "../Store";
import { onMounted, ref } from "vue";

export default {
  setup() {
    const loading = ref(true);
    const username = ref("");
    const website = ref("");
    const avatar_url = ref("");
    const id = ref("");
    const channels = ref([]);

    async function getProfile() {
      try {
        loading.value = true;

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url, channels, id`)
          .eq("id", store.userId)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          username.value = data.username;
          website.value = data.website;
          avatar_url.value = data.avatar_url;
          channels.value = data.channels;
          id.value = data.id;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function updateProfile() {
      try {
        loading.value = true;
        //const user = await supabase.auth.user();
        //store.setUser(user);

        const updates = {
          id: store.userId,
          username: username.value,
          website: website.value,
          avatar_url: avatar_url.value,
          updated_at: new Date(),
          channels: channels.value,
        };
        console.log(updates);

        let { data, error } = await supabase.from("profiles").upsert(updates, {
          returning: "representation", // Don't return the value after inserting
        });
        console.log(data);
        if (error) throw error;
        //store.setUser(data[0]);
        if (data) {
          store.setUserName(data[0].username);
          store.setUserAvatarUrl(data[0].avatar_url);
        }
        console.log(store.avatar_url);
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    }

    async function signOut() {
      try {
        loading.value = true;
        let { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      getProfile();
    });

    return {
      store,
      loading,
      username,
      website,
      avatar_url,
      channels,
      id,

      updateProfile,
      signOut,
    };
  },
};
</script>

<style scoped>
.avtr {
  padding-left: 20rem;
  height: 20rem;
  width: 40rem;
}
</style>
