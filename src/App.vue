<template>
  <div class="navbar">
    <div class="hamburger" @click="toggleMenu">
      <span :class="{'open': menuOpen}"></span>
      <span :class="{'open': menuOpen}"></span>
      <span :class="{'open': menuOpen}"></span>
    </div>

    <div class="heading">
      <h1>DispatchDirect</h1>
    </div>
  </div>
  <div class="overlay" :class="{'active': menuOpen}" @click="toggleMenu"></div>
  <div class="menu" :class="{'open': menuOpen}">
    <div class="menu-items">
      <button @click="navigateCalls" class="menuButton">Call Form</button>
      <button @click="navigateDispatch" class="menuButton">Dispatch</button>
      <button @click="navigateUnit" class="menuButton">Unit Info</button>
      <button @click="navigateDashboard" class="menuButton">Dashboard Display</button>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  name: "UnitComponent",
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    navigateDispatch() {
      this.$router.push("/dispatch");
      this.menuOpen = false;
    },
    navigateCalls() {
      this.$router.push("/calls");
      this.menuOpen = false;
    },
    navigateDashboard() {
      this.$router.push("/dashboard");
      this.menuOpen = false;
    },
    navigateUnit() {
      this.$router.push("/unit");
      this.menuOpen = false;
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 10;
}

.heading {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 4px;
  background-color: black;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.hamburger span.open:nth-child(1) {
  transform: translateY(11px) rotate(45deg);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: translateY(-11px) rotate(-45deg);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 5;
}

.overlay.active {
  opacity: 1;
  pointer-events: all;
}

.menu {
  position: fixed;
  top: 0px;
  left: -100%;
  width: 250px;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, left 0.3s ease;
  z-index: 6;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.menu.open {
  left: 0;
}

.menu-items {
  position: absolute;
  top: 80px;
  left: 20px;
  right: 20px;
}

.menuButton {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 14px 28px;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.menuButton:hover {
  background-color: black;
  color: white;
}
</style>