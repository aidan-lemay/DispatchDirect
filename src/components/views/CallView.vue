<template>
    <div>
        <h1>Calls</h1>

        <div class="callForm">
            <label for="name">Name</label>
            <input v-model="name" placeholder="Name" />

            <label for="number">Callback Number</label>
            <input v-model="number" placeholder="Phone Number" />

            <label for="bib">Riders Bib Number</label>
            <input v-model="bib" placeholder="Bib Number" />

            <label for="location">Approximate Location</label>
            <input v-model="location" placeholder="Location" />

            <label for="complaint">Complaint</label>
            <input v-model="complaint" placeholder="Complaint" />

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
            complaint: ''
        }
    },
    methods: {
        submit() {
            this.$emit('submit', this.name, this.number, this.bib, this.location, this.complaint)
        }
    }
}
</script>