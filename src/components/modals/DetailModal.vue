<script setup>
import { ref, computed, inject } from "vue";
import NotesModal from "./NotesModal.vue";

const props = defineProps({
  isOpen: Boolean,
  currentCall: Array,
});

const emit = defineEmits(["modal-close"]);
const { displayPhoneFormat, closeCall } = inject("providedFunctions");

const call = computed(() => props.currentCall[0]);

const isNotesModalOpened = ref(false);
const currentCallID = ref(0);

const openNotesModal = (callID) => {
  isNotesModalOpened.value = true;
  currentCallID.value = callID;
};

const closeNotesModal = () => {
  isNotesModalOpened.value = false;
};
</script>

<template>
  <div v-if="props.isOpen" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="header-content">Call Details for Run Number: {{ call.callID }}</h2>
        <button @click="emit('modal-close')" class="close-btn">X</button>
      </div>

      <div class="modal-body">
        <div class="content"><span class="heading">Caller Name: </span>{{ call.name }}</div>
        <div class="content"><span class="heading">Callback Number: </span>{{ displayPhoneFormat(call.phone) }}</div>
        <div class="content"><span class="heading">Rider Bib Number: </span>{{ call.bib }}</div>
        <div class="content"><span class="heading">Call Location: </span>{{ call.location }}</div>
        <div class="content"><span class="heading">Caller Complaint: </span>{{ call.complaint }}</div>
        <div class="content"><span class="heading">Call Opened At: </span>{{ call.open_time }}</div>
        <div class="content"><span class="heading">Call Closed At: </span>{{ call.close_time }}</div>
        <div class="content"><span class="heading">Unit Assigned: </span>{{ call.unitName }}</div>
        <div class="content"><span class="heading">Call Status: </span>{{ call.status }}</div>
        <div class="content"><span class="heading">Call Notes: </span>
          <div v-if="call.notes">
            <div v-for="(note, index) in call.notes.split('|')" :key="index">
              {{ note }}
            </div>
          </div>
          <div v-else>
            No notes available.
          </div>
        </div>
      </div>

      <div class="functions">
        <button @click="openNotesModal(call.callID)" class="details-button">Add Notes</button>
      </div>

      <div class="modal-footer">
        <button
          @click="closeCall(call.callID, call.status); emit('modal-close')"
          class="close-call-btn"
          :disabled="call.status === 'Closed'"
        >
          Close Call
        </button>
      </div>
    </div>

    <notes-modal
      :isOpen="isNotesModalOpened"
      :callID="currentCallID"
      @notes-modal-close="closeNotesModal"
    />
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 999;
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
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-content {
  flex: 1;
  text-align: center;
}

.close-btn {
  border: 2px solid #f44336;
  background-color: white;
  color: #f44336;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
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
}

.content {
  word-wrap: break-word;
  margin: 5px 0;
  max-width: 100%;
}

.heading {
  font-weight: bold;
}

.functions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.details-button {
  border: 2px solid #04aa6d;
  background-color: white;
  color: green;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.details-button:hover {
  background-color: #04aa6d;
  color: white;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.close-call-btn {
  border: 2px solid #f44336;
  background-color: white;
  color: #f44336;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.close-call-btn:hover {
  background-color: #f44336;
  color: white;
}
.close-call-btn:disabled {
  border-color: #666;
  color: #666;
}
.close-call-btn:disabled:hover {
  background-color: white;
  cursor: default;
}

@media (max-width: 768px) {
  .modal-container {
    width: 90%;
  }
}
</style>