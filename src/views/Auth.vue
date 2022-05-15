<template>
  <form class="" @submit.prevent="handleLogin">
    <div class="main">
      <h1 class="header-invt">Daniel's Chat App</h1>
      <p class="description-invt">Sign in via magic link with your email below</p>
      <div>
        <input
          class="inputField"
          type="email"
          placeholder="Your email"
          v-model="email"
        />
      </div>
      <div>
        <input
          type="submit"
          class="buttonBlock"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue"
import { supabase } from "../supabase"

export default {
  setup() {
    const loading = ref(false)
    const email = ref("")

    const handleLogin = async () => {
      try {
        loading.value = true
        const { error } = await supabase.auth.signIn({ email: email.value })
        if (error) throw error
        alert("Check your email for the login link!")
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      email,
      handleLogin,
    }
  },
}
</script>

<style>

.main {
  width: 30rem;
  margin: auto;
}

.header-invt {
  margin-left: 7rem;
}

.description-invt {
  margin-left: 5rem;
}

.inputField {
  text-align: center;
}

.buttonBlock {
  margin-top: 2px;
}

</style>