<template>
  <div>
    <div class="card m-3">
      <div class="card-body">
        <table>
          <tr>
            <th>CallID</th>
            <th>Caller Name</th>
            <th>Callback Number</th>
            <th>Rider Bib</th>
            <th>Location of Call</th>
            <th>Complaint</th>
            <th>Call Open</th>
            <th>Call Close</th>
            <th>Assigned Unit</th>
            <th>Call Status</th>
            <th>Notes</th>
            <th>Close Call</th>
          </tr>
          <tr v-for="call in calls" :key="call.callID">
            <td>{{ call.callID }}</td>
            <td>{{ call.name }}</td>
            <td>{{ call.phone }}</td>
            <td>{{ call.bib }}</td>
            <td>{{ call.location }}</td>
            <td>{{ call.complaint }}</td>
            <td>{{ call.open_time }}</td>
            <td>{{ call.close_time }}</td>
            <td>
              <select v-model="call.unit" @change="updateAssignedUnit(call.callID, call.unit)"
                :disabled="call.status === 'Closed'">
                <option v-for="unit in units" :key="unit.unitID" :value="unit.unitID"
                  :selected="unit.unitID === call.unit">{{ unit.name }}</option>
              </select>
            </td>
            <td>{{ call.status }}</td>
            <td>{{ call.notes }}</td>
            <td>
              <button @click="closeCall(call.callID, call.status)" :disabled="call.status === 'Closed'">Close Call</button>
            </td>
          </tr>
        </table>

        <div class="card m-3">
          <div class="card-body">
            <table>
              <tr>
                <th>UnitID</th>
                <th>Identifier</th>
                <th>Phone Number</th>
                <th>Current Status</th>
              </tr>
              <tr v-for="unit in units" :key="unit.unitID">
                <td>{{ unit.unitID }}</td>
                <td>{{ unit.name }}</td>
                <td>{{ unit.contact }}</td>
                <td>{{ unit.status }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table,
th,
td,
tr {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px;
  margin: 20px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';

const units = ref([]);
const calls = ref([]);

// Function to fetch units from the API
const getUnits = () => {
  fetch('http://localhost:3000/api/units', {
    headers: { 'Content-type': 'application/json' },
  })
    .then(res => res.json())
    .then((response) => {
      units.value = response;
    })
    .catch((error) => {
      console.log('Looks like there was a problem: \n', error);
    });
}

// Function to fetch calls from the API
const getCalls = () => {
  fetch('http://localhost:3000/api/calls', {
    headers: { 'Content-type': 'application/json' },
  })
    .then(res => res.json())
    .then((response) => {
      calls.value = response;
    })
    .catch((error) => {
      console.log('Looks like there was a problem: \n', error);
    });
}

// Function to update the assigned unit for a call
const updateAssignedUnit = (callID, unitID) => {
  // Make API call to update the assigned unit for the call
  fetch(`http://localhost:3000/api/calls/unit`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ callID: callID, unitID: unitID })
  })
    .then(res => {
      if (res.ok) {
        console.log('Assigned unit updated successfully');
        // Reload both tables data from the API
        getCalls();
        getUnits();
      } else {
        alert("Failed To Update Unit")
        throw new Error('Failed to update assigned unit');
      }
    })
    .catch((error) => {
      console.error('Error updating assigned unit:', error);
    });
}

// Function to close the call
const closeCall = (callID, status) => {
  // Check if the call is already closed or has a "Closed" status
  if (status === 'Closed') {
    console.log('Call is already closed');
    return; // Exit the function early if the call is already closed
  }

  // Make API call to close the call
  fetch(`http://localhost:3000/api/calls/close`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ callID: callID })
  })
    .then(res => {
      if (res.ok) {
        console.log('Call closed successfully');
        // Reload both tables data from the API
        getCalls();
        getUnits();
      } else {
        alert("Failed To Close Call")
        throw new Error('Failed to close the call');
      }
    })
    .catch((error) => {
      console.error('Error closing the call:', error);
    });
}

// Fetch units and calls when the component is mounted
onMounted(() => {
  getUnits();
  getCalls();
});
</script>