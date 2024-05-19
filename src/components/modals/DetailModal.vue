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
        <div class="header">
          <h4 class="content">Call details - Run number: {{ call.callID }}</h4>
        </div>

        <div class="btnRight">
          <button @click="emit('modal-close')" type="button" class="btn-close mb-3" aria-label="Close"></button>
        </div>
      </div>

      <div class="modal-body">

        <h5 class="py-3 border-bottom">Caller information</h5>
        <div class="row mb-2">
          <div class="col-auto">
            <span class="heading">Caller name: </span>{{ call.name }}
          </div>
          <div class="col-auto">
            <span class="heading">Callback number: </span>{{ displayPhoneFormat(call.phone) }}
          </div>
          <div class="col-auto">
            <span class="heading">Bib number: </span>{{ call.bib }}
          </div>
        </div>

        <h5 class="py-3 border-bottom">Call details</h5>
        <div class="row">
          <div class="col-auto">
            <span class="heading">Status: </span>{{ call.status }}
          </div>
          <div class="col-auto">
            <span class="heading">Time opened: </span>{{ call.open_time }}
          </div>
          <div class="col-auto">
            <span class="heading">Time closed: </span>{{ call.close_time }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <span class="heading">Location: </span>{{ call.location }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <span class="heading">Complaint: </span><br>{{ call.complaint }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <span class="heading">Notes: </span><br>{{ call.notes }}
          </div>
        </div>
        <div class="row">
          <div class="col-auto">
            <span class="heading">Assigned unit: </span>{{ call.unit }}
          </div>
        </div>



        <!-- <div class="content"><span class="heading">Caller Name: </span>{{ call.name }}</div>
        <div class="content"><span class="heading">Callback Number: </span>{{ displayPhoneFormat(call.phone) }}</div>
        <div class="content"><span class="heading">Rider Bib Number: </span>{{ call.bib }}</div>
        <div class="content"><span class="heading">Call Location: </span>{{ call.location }}</div>
        <div class="content"><span class="heading">Caller Complaint: </span>{{ call.complaint }}</div>
        <div class="content"><span class="heading">Call Opened At: </span>{{ call.open_time }}</div>
        <div class="content"><span class="heading">Call Closed At: </span>{{ call.close_time }}</div>
        <div class="content"><span class="heading">Unit Assigned: </span>{{ call.unit }}</div>
        <div class="content"><span class="heading">Call Status: </span>{{ call.status }}</div>
        <div class="content"><span class="heading">Call Notes: </span>{{ call.notes }}</div> -->
      </div>

      <div class="modal-footer mt-4">
        <button @click="closeCall(call.callID, call.status), emit('modal-close')" class="btn btn-danger" :disabled="call.status == 'Closed'">Close Call</button>
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
  width: 50%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  padding: 2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  max-width: calc(100% - 80px);
  max-height: calc(100% - 80px);
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.header {
  flex: 1;
  text-align: center;
  font-weight: 700;
}

.btnRight {
  flex: 0;
  margin-left: auto;
}

.close-btn {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-color: #f44336;
  color: #f44336;
}
.close-btn:hover {
  background-color: #f44336;
  color: white;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 16px;
  text-align: left; /* Ensuring text within modal body is left-aligned */
}

.content {
  word-wrap: break-word;
  /* margin: 5px 0; */
  max-width: 100%; /* Ensuring content doesn't exceed the modal width */
}

.heading {
  font-weight: bold;
}

.modal-footer {
  display: flex;
  justify-content: center;
  /* margin-top: 20px; */
}

.closeCallBtn {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-color: #f44336;
  color: #f44336;
}
.closeCallBtn:hover {
  background-color: #f44336;
  color: white;
}
.closeCallBtn:disabled {
  border-color: #666;
  color: #666;
}
.closeCallBtn:hover:disabled {
  border-color: #666;
  color: #666;
  background-color: white;
  cursor: default;
}

@media (max-width: 768px) {
  .modal-container {
    width: 90%;
  }

  .modal-header {
    flex-direction: row-reverse; /* Ensuring close button stays on the right */
  }

  .header {
    text-align: center;
    margin-top: 10px;
  }
}

</style>
