<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div>
      <img class="avtr" :src="avatar_url" />
      <label for="email">Email</label>
      <input id="email" type="text" :value="store.email" disabled />
    </div>
    <div>
      <label for="userName">Name</label>
      <input id="userName" type="text" v-model="userName" />
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
    const userName = ref("");
    const website = ref("");
    const avatar_url = ref("");
    const id = ref("");

    async function getProfile() {
      try {
        loading.value = true;

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url, id`)
          .eq("id", store.userId)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          store.userName = data.username;
          website.value = data.website;
          avatar_url.value = data.avatar_url;
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
          username: userName.value,
          website: website.value,
          avatar_url: avatar_url.value,
          updated_at: new Date(),
        };
        console.log(updates);

        let { data, error } = await supabase.from("profiles").upsert(updates, {
          returning: "representation", // Don't return the value after inserting
        });
        console.log(data);
        if (error) throw error;
        //store.setUser(data[0]);
        if (data) {
          store.setUserName(data[0].userName);
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
      userName,
      website,
      avatar_url,
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
