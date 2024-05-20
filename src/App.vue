<template>
  <div class="navMenuContainer">
    <button @click="navigateCalls" class="callButton">Call Form</button>
    <button @click="navigateDispatch" class="dispatchButton">Dispatch</button>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  name: "UnitComponent",
  methods: {
    navigateDispatch() {
      this.$router.push("/dispatch");
    },
    navigateCalls() {
      this.$router.push("/calls");
    },
  },
};
</script>

<style scoped>
template {
  width: 100%;
  height: 100%;
  padding: 0%;
}

.navMenuContainer {
  width: 90%;
  margin: auto;
  display: flex;
  gap: 10px;
}

  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 14px 28px;
  font-size: 20px;
  cursor: pointer;
  border-color: #04aa6d;
  color: green;
  width: 100%; /* Ensure the button fills the entire div */
  text-align: center; /* Align text to the left */
}
.callButton:hover {
  background-color: #04aa6d;
  color: white;
}

.dispatchButton {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 14px 28px;
  font-size: 20px;
  cursor: pointer;
  border-color: #f44336;
  color: #f44336;
  width: 100%; /* Ensure the button fills the entire div */
  text-align: center; /* Align text to the right */
}
.dispatchButton:hover {
  background-color: #f44336;
  color: white;
}
</style>