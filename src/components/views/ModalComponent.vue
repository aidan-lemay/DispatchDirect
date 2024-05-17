<script setup>
import { ref, computed, inject } from "vue";
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  isOpen: Boolean,
  currentCall: Array
});

const emit = defineEmits(["modal-close"]);
const { displayPhoneFormat, closeCall } = inject('providedFunctions');

const target = ref(null);
onClickOutside(target, () => emit('modal-close'));

const call = computed(() => props.currentCall[0]);

</script>

<template>
  <div v-if="props.isOpen" class="modal-mask" ref="target">
    <div class="modal-container" ref="target">

      <div class="modal-header">
        <div class="btnRight">
          <button @click="emit('modal-close')" class="close-btn">X</button>
        </div>

        <div class="header">
          <h2 class="content">Call Details for Run Number: {{ call.callID }}</h2>
        </div>
      </div>

      <div class="modal-body">
        <div class="content"><span class="heading">Caller Name: </span>{{ call.name }}</div>
        <div class="content"><span class="heading">Callback Number: </span>{{ displayPhoneFormat(call.phone) }}</div>
        <div class="content"><span class="heading">Rider Bib Number: </span>{{ call.bib }}</div>
        <div class="content"><span class="heading">Call Location: </span>{{ call.location }}</div>
        <div class="content"><span class="heading">Caller Complaint: </span>{{ call.complaint }}</div>
        <div class="content"><span class="heading">Call Opened At: </span>{{ call.open_time }}</div>
        <div class="content"><span class="heading">Call Closed At: </span>{{ call.close_time }}</div>
        <div class="content"><span class="heading">Unit Assigned: </span>{{ call.unit }}</div>
        <div class="content"><span class="heading">Call Status: </span>{{ call.status }}</div>
        <div class="content"><span class="heading">Call Notes: </span>{{ call.notes }}</div>
      </div>

      <div class="modal-footer">
        <button @click="closeCall(call.callID, call.status), emit('modal-close')" class="closeCallBtn" :disabled="call.status === 'Closed'">Close Call</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  width: 75%;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  max-width: calc(100% - 80px);
  max-height: calc(100% - 80px);
  overflow: auto;
  max-height: calc(100vh - 125px);
}

.modal-header {
  display: flex;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  margin: 20px;
}

.header {
  flex: 0 1 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.btnRight {
  flex: 0 1 auto;
  margin-left: auto;
  margin-right: 20px;
}

.close-btn {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 14px 28px;
  font-size: 20px;
  cursor: pointer;
  border-color: #f44336;
  color: #f44336;
}
.close-btn:hover {
  background-color: #f44336;
  color: white;
}

.modal-body {
  display: grid;
  justify-content: center;
  justify-items: center;
  font-size: 16px;
}

.heading {
  font-weight: bold;
}

.modal-footer {
  margin: 20px;
  display: grid;
  justify-content: center;
  justify-items: center;
}

.closeCallBtn {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 14px 28px;
  font-size: 20px;
  cursor: pointer;
  border-color: #f44336;
  color: #f44336;
}
.closeCallBtn:hover {
  background-color: #f44336;
  color: white;
}

</style>
