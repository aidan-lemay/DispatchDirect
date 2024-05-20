<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
  isOpen: Boolean,
  callID: Number,
});

const emit = defineEmits(["notes-modal-close"]);

const name = ref("");
const notes = ref("");

const url = ref(import.meta.env.VITE_URL);

const validateForm = (name, notes) => {
  if (name.length === 0 || name.length > 100) {
    return "Name must be between 1 and 100 characters.";
  }

  if (notes.length === 0 || notes.length > 100) {
    return "Notes must be between 1 and 100 characters.";
  }

  return null;
};

const clearForm = () => {
  name.value = "";
  notes.value = "";
};

const addNote = () => {
  const validationError = validateForm(name.value, notes.value);
  if (validationError) {
    toast(validationError, {
      theme: "colored",
      type: "warning",
      autoClose: 5000,
      dangerouslyHTMLString: true,
    });
    return;
  }

  const formData = {
    callID: props.callID,
    name: name.value.trim(),
    notes: notes.value.trim(),
  };

  fetch(url.value + "api/calls/notes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.ok) {
        toast("Notes Added Successfully!", {
          theme: "colored",
          type: "success",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
        clearForm();
        emit("notes-modal-close");
      } else {
        toast("Failed to add notes.", {
          theme: "colored",
          type: "warning",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
      }
    })
    .catch((error) => {
      console.error("Error adding notes:", error);
      toast("Failed to add notes: " + error, {
        theme: "colored",
        type: "warning",
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    });
};
</script>

<template>
  <div v-if="props.isOpen" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-content">
          <div class="note-form">
            <label for="name">Your Name</label>
            <input v-model="name" placeholder="Name" maxlength="100" />

            <label for="notes">Your Note</label>
            <textarea v-model="notes" placeholder="Notes" maxlength="100"></textarea>

            <button @click="addNote" class="submit">Submit</button>
          </div>
        </div>
        <button @click="emit('notes-modal-close')" class="close-btn">X</button>
      </div>
    </div>
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
  min-height: 300px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.header-content {
  flex: 1;
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

.note-form {
  display: grid;
  width: auto;
  justify-content: center;
}

label {
  padding: 5px;
  font-size: 20px;
}

input, textarea {
  width: 200px;
  margin: 10px;
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 10px;
  font-size: 16px;
}

.submit {
  border: 2px solid #04aa6d;
  background-color: white;
  color: green;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.submit:hover {
  background-color: #04aa6d;
  color: white;
}
</style>