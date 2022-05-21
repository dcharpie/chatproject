<template>
  <div class="container">
    <div v-if="store.email">
      <Navigation />
      <RouterView />
    </div>
    <Auth v-else />
  </div>
</template>

<script>
import { store } from "./Store";
import { supabase } from "./supabase";
import Auth from "./views/Auth.vue";
import Chat from "./views/Chat.vue";
import Navigation from "./views/Navigation.vue";
import { RouterView } from "vue-router";

export default {
  components: {
    Auth,
    Navigation,
    Chat,
  },

  setup() {
    supabase.auth.onAuthStateChange(async (_, session) => {
      console.log(session.user);
      const { email, id } = session.user;
      store.setEmail(email);
      store.setUserId(id);

      let { data, error } = await supabase
        .from('profiles')
        .select(`
                username,
                website,
                avatar_url,
                id,
                channels,
                )
              `)

      if (data) {
        store.setUserName(data.username);
        store.setUserAvatarUrl(data.avatar_url);
        store.setChannelNames(data.channels);
      }

      console.log("this is the store", store);
    });
    return {
      store,
    };
  },
};
</script>
