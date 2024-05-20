<template>
    <div class="content">
        <h1>Calls</h1>

        <div class="callForm">
            <label for="name">Name</label>
            <input v-model="name" placeholder="Name" maxlength="100" />

            <label for="number">Callback Number</label>
            <input v-model="number" placeholder="(   ) ___-____" @input="formatPhoneNumber" />

            <label for="bib">Riders Bib Number</label>
            <input v-model="bib" placeholder="Bib Number" maxlength="10" />

            <label for="location">Approximate Location</label>
            <input v-model="location" placeholder="Location" maxlength="100" />

            <label for="complaint">Complaint</label>
            <textarea v-model="complaint" placeholder="Complaint" maxlength="100"></textarea>

            <label for="notes">Notes</label>
            <textarea v-model="notes" placeholder="Notes" maxlength="100"></textarea>

            <button @click="submit" class="submit">Submit</button>
        </div>
    </div>
</template>

<style scoped>
label {
    padding: 5px;
    font-size: 20px;
}

button {
    padding: 5px;
    margin: 10px;
}

.content {
    display: grid;
    justify-content: center;
    border: 1px solid black;
    padding: 10px;
    margin: 20px;
    text-align: center;
}

input {
    width: 200px;
    margin: 10px;

    border: 2px solid black;
    background-color: white;
    color: black;
    padding: 10px 10px;
    font-size: 16px;
    cursor: text;
}

textarea {
    width: 200px;
    margin: 10px;

    border: 2px solid black;
    background-color: white;
    color: black;
    padding: 10px 10px;
    font-size: 16px;
    cursor: text;
}

.submit {
    border: 2px solid black;
    background-color: white;
    color: black;
    padding: 14px 28px;
    font-size: 16px;
    cursor: pointer;
    border-color: #04AA6D;
    color: green;
}

.submit:hover {
    background-color: #04AA6D;
    color: white;
}

.callForm {
    display: grid;
    width: auto;
    justify-content: center;
}
</style>

<script setup>
import { ref } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const name = ref('');
const number = ref('');
const bib = ref('');
const location = ref('');
const complaint = ref('');
const notes = ref('');

const url = ref(import.meta.env.VITE_URL);

const submit = () => {

    const validationError = validateForm();
    if (validationError) {
        toast(validationError, {
            "theme": "colored",
            "type": "warning",
            "autoClose": 5000,
            "dangerouslyHTMLString": true
        })
        console.error(validationError);
        return;
    }

    const formData = {
        name: name.value.trim(),
        phone: number.value.replace(/\D/g, ''),
        bib: bib.value.trim(),
        location: location.value.trim(),
        complaint: complaint.value.trim(),
        notes: "<System>: " + notes.value.trim() + "|"
    };

    fetch(url.value + 'api/calls', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                toast("Call Submitted Successfully!", {
                    "theme": "colored",
                    "type": "success",
                    "autoClose": 5000,
                    "dangerouslyHTMLString": true
                })
                clearForm();
            } else {
                toast("Failed to submit call.", {
                    "theme": "colored",
                    "type": "warning",
                    "autoClose": 5000,
                    "dangerouslyHTMLString": true
                })
                console.error("Failed to submit call");
            }
        })
        .catch(error => {
            toast(error, {
                "theme": "colored",
                "type": "warning",
                "autoClose": 5000,
                "dangerouslyHTMLString": true
            })
            console.error(error);
        });
};

const validateForm = () => {
    if (name.value.length === 0 || name.value.length > 100) {
        return 'Name must be between 1 and 100 characters.';
    }

    if (number.value.replace(/\D/g, '').length !== 10) {
        return 'Phone number must be 10 digits.';
    }

    if (bib.value.length === 0 || bib.value.length > 10) {
        return 'Bib must be between 1 and 10 characters.';
    }

    if (location.value.length === 0 || location.value.length > 100) {
        return 'Location must be between 1 and 100 characters.';
    }

    if (complaint.value.length === 0 || complaint.value.length > 100) {
        return 'Complaint must be between 1 and 100 characters.';
    }

    if (notes.value.length > 100) {
        return 'Note must not be more than 100 characters.';
    }

    if (notes.value.length == 0) {
        notes.value = "No Initial Notes";
    }

    return null; // No validation errors
};

const clearForm = () => {
    name.value = '';
    number.value = '';
    bib.value = '';
    location.value = '';
    complaint.value = '';
    notes.value = '';
};

const formatPhoneNumber = (event) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    const isDeleting = (event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward');

    if (!isDeleting) {
        if (value.length > 3 && value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else if (value.length > 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    } else {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length > 3 && value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else if (value.length > 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }

    number.value = value;
};
</script>