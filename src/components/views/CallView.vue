<template>
    <div class="container-fluid px-5 py-3">
        
        <div class="callForm">
            <h4 class="py-3 border-bottom">New call</h4>
            <div class="row mt-4">
                <div class="col-4">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input v-model="name" class="form-control" id="name" placeholder="Name">
                    </div>
                </div>
                <div class="col-4">
                    <div class="mb-3">
                        <label for="number" class="form-label">Callback Number</label>
                        <input v-model="number" class="form-control" placeholder="(   ) ___-____" @input="formatPhoneNumber" />
                        <div class="form-text">
                            Must be a 10-digit phone number.
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="mb-3">
                        <label for="bib" class="form-label">Riders Bib Number</label>
                        <input v-model="bib" class="form-control" placeholder="Bib Number" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="mb-3">
                        <label for="location" class="form-label">Approximate Location</label>
                        <input v-model="location" class="form-control" placeholder="Location" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="mb-3">
                        <label for="complaint" class="form-label">Complaint</label>
                        <textarea v-model="complaint" class="form-control" placeholder="Complaint"></textarea>
                    </div>
                </div>
                <div class="col-12">
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notes</label>
                        <textarea v-model="notes" class="form-control" placeholder="Notes"></textarea>
                    </div>
                </div>
                <div class="col-12 d-grid mt-5">
                    <button @click="submit" class="btn btn-success">Submit</button>
                </div>
                
            </div>
        </div>

    </div>
</template>

<style scoped>

/* button {
    padding: 5px;
    margin: 10px;
} */

label {
    font-weight: 700;
}

.content {
    display: grid;
    justify-content: center;
    border: 1px solid black;
    padding: 10px;
    margin: 20px;
    text-align: center;
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
        notes: notes.value.trim()
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
        name.is-invalid === true;
    }

    if (number.value.replace(/\D/g, '').length !== 10) {
        return 'Phone number must be 10 digits.';
    }

    if (bib.value.length === 0 || bib.value.length > 10) {
        return 'Bib must be between 1 and 10 characters.';
    }

    if (location.value.length === 0 || location.value.length > 200) {
        return 'Location must be between 1 and 200 characters.';
    }

    if (complaint.value.length === 0 || complaint.value.length > 500) {
        return 'Complaint must be between 1 and 500 characters.';
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