<script setup>
import { ref, inject } from "vue";
import { onClickOutside } from '@vueuse/core';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
  isOpen: Boolean,
});

const name = ref("");
const number = ref("");

const url = "http://localhost:3007/";
// const url = 'https://dispatchapi.k5doc.tech/';

const emit = defineEmits(["modal-close"]);
const { getUnits, getCalls } = inject('providedFunctions');

const target = ref(null);
onClickOutside(target, () => emit('modal-close'));

// Function to submit unit form
const addUnit = (name, number) => {
  // Validation
  const validationError = validateForm(name, number);
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
    name: name.trim(),
    contact: number.replace(/\D/g, ""),
  };

  fetch(url + "api/units", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.ok) {
        toast("Unit Added Successfully!", {
          theme: "colored",
          type: "success",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
        clearForm();
        emit("modal-close");
        getUnits(); // Re-query units data
        getCalls(); // Re-query calls data
      } else {
        toast("Failed to add unit.", {
          theme: "colored",
          type: "warning",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
      }
    })
    .catch((error) => {
      console.error("Error adding unit:", error);
      toast("Failed to add unit: " + error, {
        theme: "colored",
        type: "warning",
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    });
}

// Function to validate unit form
const validateForm = (name, number) => {
  if (name.length === 0 || name.length > 100) {
    return "Unit Identifier must be between 1 and 100 characters.";
  }

  if (number.replace(/\D/g, "").length !== 10) {
    return "Phone number must be 10 digits.";
  }

  return null; // No validation errors
};

// Function to clear unit form
const clearForm = () => {
  name.value = "";
  number.value = "";
};

// Function to format phone number input
const formatPhoneNumber = () => {
  let phoneNumber = number.value.replace(/\D/g, "");
  if (phoneNumber.length <= 10) {
    phoneNumber = phoneNumber.replace(
      /^(\d{3})(\d{0,3})(\d{0,4}).*/,
      "($1) $2-$3"
    );
  } else {
    phoneNumber = phoneNumber.slice(0, 10);
    phoneNumber = phoneNumber.replace(
      /^(\d{3})(\d{3})(\d{0,4}).*/,
      "($1) $2-$3"
    );
  }
  number.value = phoneNumber;
};

</script>

<template>
  <div v-if="props.isOpen" class="modal-mask" ref="target">
    <div class="modal-container" ref="target">

      <div class="modal-header">
        <div class="btnRight">
          <button @click="emit('modal-close')" class="close-btn">X</button>
        </div>
      </div>

      <div class="modal-body">
        <div class="card-body">
        <div class="unitForm">
        <label for="name">Unit Identifier</label>
        <input v-model="name" placeholder="Unit" />

        <label for="number">Contact Number</label>
        <input
          v-model="number"
          placeholder="(   ) ___-____"
          @input="formatPhoneNumber"
        />

        <button @click="addUnit(name, number)" class="submit">Submit</button>
      </div>
      </div>
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

.btnRight {
  flex: 0 1 auto;
  margin-left: auto;
  margin-right: 20px;
}

.modal-body {
  display: grid;
  justify-content: center;
  justify-items: center;
  font-size: 16px;
}

.modal-footer {
  margin: 20px;
  display: grid;
  justify-content: center;
  justify-items: center;
}

.submit {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 14px 28px;
  font-size: 16px;
  cursor: pointer;
  border-color: #04aa6d;
  color: green;
}

.submit:hover {
  background-color: #04aa6d;
  color: white;
}

.unitForm {
  display: grid;
  width: auto;
  justify-content: center;
}

input {
  width: 200px;
  margin: 10px;

  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 10px 10px;
  font-size: 16px;
  cursor: pointer;
}

label {
  padding: 5px;
  font-size: 20px;
}

</style>
