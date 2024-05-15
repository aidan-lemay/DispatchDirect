<template>
  <div class="content">


    <div class="dispatch">

      <!-- Calls -->
      <div class="card">
        <h2>Call Dispatch</h2>
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

            <tr v-for="call in unassignedCalls" :key="call.callID" :class="getRowClass(call.status)">
              <td>{{ call.callID }}</td>
              <td>{{ call.name }}</td>
              <td>{{ displayPhoneFormat(call.phone) }}</td>
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
                <button @click="closeCall(call.callID, call.status)" :disabled="call.status === 'Closed'">Close
                  Call</button>
              </td>
            </tr>

            <tr v-for="call in inProgressCalls" :key="call.callID" :class="getRowClass(call.status)">
              <td>{{ call.callID }}</td>
              <td>{{ call.name }}</td>
              <td>{{ displayPhoneFormat(call.phone) }}</td>
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
                <button @click="closeCall(call.callID, call.status)" :disabled="call.status === 'Closed'">Close
                  Call</button>
              </td>
            </tr>

            <tr v-for="call in closedCalls" :key="call.callID" :class="getRowClass(call.status)">
              <td>{{ call.callID }}</td>
              <td>{{ call.name }}</td>
              <td>{{ displayPhoneFormat(call.phone) }}</td>
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
                <button @click="closeCall(call.callID, call.status)" :disabled="call.status === 'Closed'">Close
                  Call</button>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Units -->
      <div class="card">
        <h2>Units</h2>
        <div class="card-body">
          <table>
            <tr>
              <th>UnitID</th>
              <th>Identifier</th>
              <th>Phone Number</th>
              <th>Current Status</th>
              <th>Out Of Service</th>
            </tr>
            <tr v-for="unit in unassignedUnits" :key="unit.unitID" :class="getRowClass(unit.status)">
              <td>{{ unit.unitID }}</td>
              <td>{{ unit.name }}</td>
              <td>{{ displayPhoneFormat(unit.contact) }}</td>
              <td>{{ unit.status }}</td>
              <td>
                <button @click="setStatus(unit.unitID, unit.status)" :disabled="unit.status === 'Busy'">
                  {{ unit.status === 'Free' ? 'Set Unit OOS' : 'Set Unit BIS' }}
                </button>

              </td>
            </tr>

            <tr v-for="unit in inProgressUnits" :key="unit.unitID" :class="getRowClass(unit.status)">
              <td>{{ unit.unitID }}</td>
              <td>{{ unit.name }}</td>
              <td>{{ displayPhoneFormat(unit.contact) }}</td>
              <td>{{ unit.status }}</td>
              <td>
                <button @click="setStatus(unit.unitID, unit.status)" :disabled="unit.status === 'Busy'">
                  {{ unit.status === 'Free' ? 'Set Unit OOS' : 'Set Unit BIS' }}
                </button>

              </td>
            </tr>

            <tr v-for="unit in oosUnits" :key="unit.unitID" :class="getRowClass(unit.status)">
              <td>{{ unit.unitID }}</td>
              <td>{{ unit.name }}</td>
              <td>{{ displayPhoneFormat(unit.contact) }}</td>
              <td>{{ unit.status }}</td>
              <td>
                <button @click="setStatus(unit.unitID, unit.status)" :disabled="unit.status === 'Busy'">
                  {{ unit.status === 'Free' ? 'Set Unit OOS' : 'Set Unit BIS' }}
                </button>

              </td>
            </tr>
          </table>
        </div>
      </div>

    </div>
  </div>

  <!-- Add Units -->
  <div class="card">
    <h2>Add Unit</h2>
    <div class="card-body">
      <div class="unitForm">
        <label for="name">Unit Identifier</label>
        <input v-model="name" placeholder="Unit" />

        <label for="number">Contact Number</label>
        <input v-model="number" placeholder="(   ) ___-____" @input="formatPhoneNumber" />

        <button @click="submit(name, number)" class="submit">Submit</button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.content {
  width: 100%;
}

.dispatch {
  display: flex;
  justify-content: center;
}

.card {
  border: 1px solid black;
  padding: 10px;
  margin: 20px;
  text-align: center;
}

label {
  padding: 5px;
  font-size: 20px;
}

button {
  padding: 5px;
  margin: 10px;
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

.unitForm {
  display: grid;
  width: auto;
  justify-content: center;
}

.unassigned-row {
  background-color: #e06666;
}

.in-progress-row {
  background-color: #f1c232;
}

.closed-row {
  background-color: #6aa84f;
}

table,
th,
td,
tr {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px;
  margin: 20px;
  text-align: left;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';

const units = ref([]);
const calls = ref([]);
const name = ref('');
const number = ref('');

const POLLING_INTERVAL = 5000; // 5 seconds

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

// Function to change unit status
const setStatus = (unitID, status) => {
  if (status === 'OOS') {
    fetch(`http://localhost:3000/api/units/BIS`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ unitID: unitID })
    })
      .then(res => {
        if (res.ok) {
          console.log('Unit statused successfully');
          // Reload both tables data from the API
          getCalls();
          getUnits();
        } else {
          alert("Failed To Status Unit")
          throw new Error('Failed to status unit');
        }
      })
      .catch((error) => {
        console.error('Error statusing unit:', error);
      });
  }
  // If unit status is NOT OOS
  else {
    fetch(`http://localhost:3000/api/units/OOS`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ unitID: unitID })
    })
      .then(res => {
        if (res.ok) {
          console.log('Unit statused successfully');
          getCalls();
          getUnits();
        } else {
          alert("Failed To Status Unit")
          throw new Error('Failed to status unit');
        }
      })
      .catch((error) => {
        console.error('Error statusing unit:', error);
      });
  }
}

// Function to submit unit form
const submit = (name, number) => {
  // Validation
  const validationError = validateForm(name, number);
  if (validationError) {
    alert(validationError);
    return;
  }

  const formData = {
    name: name.trim(),
    contact: number.replace(/\D/g, ''),
  };

  fetch('http://localhost:3000/api/units', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (response.ok) {
        alert('Unit added successfully!');
        clearForm();
        getUnits(); // Re-query units data
        getCalls(); // Re-query calls data
      } else {
        alert('Failed to add unit.');
      }
    })
    .catch(error => {
      console.error('Error adding unit:', error);
      alert('An error occurred while creating the unit.');
    });
};

// Function to validate unit form
const validateForm = (name, number) => {
  if (name.length === 0 || name.length > 100) {
    return 'Unit Identifier must be between 1 and 100 characters.';
  }

  if (number.replace(/\D/g, '').length !== 10) {
    return 'Phone number must be 10 digits.';
  }

  return null; // No validation errors
};

// Function to clear unit form
const clearForm = () => {
  name.value = '';
  number.value = '';
};

// Function to format phone number input
const formatPhoneNumber = () => {
  let phoneNumber = number.value.replace(/\D/g, '');
  if (phoneNumber.length <= 10) {
    phoneNumber = phoneNumber.replace(/^(\d{3})(\d{0,3})(\d{0,4}).*/, '($1) $2-$3');
  } else {
    phoneNumber = phoneNumber.slice(0, 10);
    phoneNumber = phoneNumber.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '($1) $2-$3');
  }
  number.value = phoneNumber;
};

const displayPhoneFormat = (number) => {
  let phoneNumber = number.replace(/\D/g, '');
  if (phoneNumber.length <= 10) {
    phoneNumber = phoneNumber.replace(/^(\d{3})(\d{0,3})(\d{0,4}).*/, '($1) $2-$3');
  } else {
    phoneNumber = phoneNumber.slice(0, 10);
    phoneNumber = phoneNumber.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '($1) $2-$3');
  }
  return (phoneNumber);
};

// Call Sorting
const unassignedCalls = computed(() => {
  return calls.value.filter(call => call.status === 'Unassigned').sort((a, b) => a.callID - b.callID);
});
const inProgressCalls = computed(() => {
  return calls.value.filter(call => call.status === 'In-Progress').sort((a, b) => a.callID - b.callID);
});
const closedCalls = computed(() => {
  return calls.value.filter(call => call.status === 'Closed').sort((a, b) => a.callID - b.callID);
});

// Unit Sorting
const unassignedUnits = computed(() => {
  return units.value.filter(unit => unit.status === 'Unassigned' | unit.status === 'Free').sort((a, b) => a.unitID - b.unitID);
});
const inProgressUnits = computed(() => {
  return units.value.filter(unit => unit.status === 'Busy').sort((a, b) => a.unitID - b.unitID);
});
const oosUnits = computed(() => {
  return units.value.filter(unit => unit.status === 'OOS').sort((a, b) => a.unitID - b.unitID);
});

const getRowClass = (status) => {
  if (status === 'Unassigned' | status === 'OOS') {
    return 'unassigned-row';
  } else if (status === 'In-Progress' | status === 'Busy') {
    return 'in-progress-row';
  } else if (status === 'Closed' | status === 'Free') {
    return 'closed-row';
  } else {
    return '';
  }
};

const pollUpdates = () => {
  setInterval(() => {
    getUnits();
    getCalls();
  }, POLLING_INTERVAL);
};
pollUpdates();

// Fetch units and calls when the component is mounted
onMounted(() => {
  getUnits();
  getCalls();
});
</script>