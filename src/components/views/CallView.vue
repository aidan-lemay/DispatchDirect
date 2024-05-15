<template>
    <div>
        <h1>Calls</h1>

        <div class="callForm">
            <label for="name">Name</label>
            <input v-model="name" placeholder="Name" />

            <label for="number">Callback Number</label>
            <input v-model="number" placeholder="(   ) ___-____" @input="formatPhoneNumber" />

            <label for="bib">Riders Bib Number</label>
            <input v-model="bib" placeholder="Bib Number" />

            <label for="location">Approximate Location</label>
            <input v-model="location" placeholder="Location" />

            <label for="complaint">Complaint</label>
            <textarea v-model="complaint" placeholder="Complaint"></textarea>

            <label for="notes">Notes</label>
            <textarea v-model="notes" placeholder="Notes"></textarea>

            <button @click="submit">Submit</button>
        </div>

    </div>
</template>

<style scoped>
label {
    padding: 5px;
}

button {
    padding: 5px;
}

input {
    width: 500px;
}

.callForm {
    display: grid;
}
</style>

<script>
export default {
    data() {
        return {
            name: '',
            number: '',
            bib: '',
            location: '',
            complaint: '',
            notes: '',
        }
    },
    methods: {
        submit() {
            // Validation
            const validationError = this.validateForm();
            if (validationError) {
                alert(validationError);
                return;
            }

            const formData = {
                name: this.name.trim(),
                phone: this.number.replace(/\D/g, ''),
                bib: this.bib.trim(),
                location: this.location.trim(),
                complaint: this.complaint.trim(),
                notes: this.notes.trim()
            };

            fetch('http://localhost:3000/api/calls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (response.ok) {
                        alert('Call submitted successfully!');
                        this.clearForm();
                    } else {
                        alert('Failed to submit call.');
                    }
                })
                .catch(error => {
                    console.error('Error submitting call:', error);
                    alert('An error occurred while submitting the call.');
                });
        },

        validateForm() {
            if (this.name.length === 0 || this.name.length > 100) {
                return 'Name must be between 1 and 100 characters.';
            }

            if (this.number.replace(/\D/g, '').length !== 10) {
                return 'Phone number must be 10 digits.';
            }

            if (this.bib.length === 0 || this.bib.length > 10) {
                return 'Bib must be between 1 and 10 characters.';
            }

            if (this.location.length === 0 || this.location.length > 200) {
                return 'Location must be between 1 and 200 characters.';
            }

            if (this.complaint.length === 0 || this.complaint.length > 500) {
                return 'Complaint must be between 1 and 500 characters.';
            }

            return null; // No validation errors
        },

        clearForm() {
            this.name = '';
            this.number = '';
            this.bib = '';
            this.location = '';
            this.complaint = '';
            this.notes = '';
            this.error = '';
        },

        formatPhoneNumber() {
            // Remove non-digit characters from the input
            let phoneNumber = this.number.replace(/\D/g, '');

            // Format the phone number as (000) 000-0000
            if (phoneNumber.length <= 10) {
                phoneNumber = phoneNumber.replace(/^(\d{3})(\d{0,3})(\d{0,4}).*/, '($1) $2-$3');
            } else {
                phoneNumber = phoneNumber.slice(0, 10);
                phoneNumber = phoneNumber.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '($1) $2-$3');
            }

            // Update the model with the formatted phone number
            this.number = phoneNumber;
        }
    }
}
</script>