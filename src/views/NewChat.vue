<template>
    <div>
        <input type="checkbox" id="daniel" value="Daniel" v-model="checkedNames">
        <label for="daniel">Daniel</label>

        <input type="checkbox" id="james" value="James" v-model="checkedNames">
        <label for="james">James</label>

        <input type="checkbox" id="noah" value="Noah" v-model="checkedNames">
        <label for="noah">Noah</label>

        <button @click="newChat"> New Chat </button>
        <div> <h1>{{ checkedNames }}</h1> </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        checkedNames:[],
        newChannel:""
        }
    },
    methods: {
        newChat() {
            const newChannel = JSON.stringify(checkedNames);
            console.log(newChannel);
        }
    }
}
</script>