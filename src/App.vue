<template>
  <div>
    <button @click="navigateCalls" class="navButtons">Calls</button>
    <button @click="navigateUnit" class="navButtons">Units</button>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'UnitComponent',
  methods:{
    navigateUnit(){
      this.$router.push("/units");
    },
    navigateCalls(){
        this.$router.push("/calls");
    }
  }
}
</script>

<style>
  /* @import '../src/assets/base.css';
  @import '../src/assets/main.css'; */
</style>


<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.navButtons {
  height: 40px;
  width: 100px;
  color: black;
  padding: 10px;
}
</style>