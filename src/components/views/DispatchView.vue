<script setup>
import { ref, onMounted, computed, provide } from "vue";
import { toast } from "vue3-toastify";
import DetailModal from "../modals/DetailModal.vue";
import UnitModal from "../modals/UnitModal.vue";
import "vue3-toastify/dist/index.css";

const units = ref([]);
const calls = ref([]);
const currentCall = ref([]);
const isModalOpened = ref(false);
const isUnitModalOpened = ref(false);

const openModal = (callID) => {
  isModalOpened.value = true;
  currentCall.value = calls.value.filter((call) => call.callID === callID);
};
const closeModal = () => {
  isModalOpened.value = false;
};

const openUnitModal = () => {
  isUnitModalOpened.value = true;
};
const closeUnitModal = () => {
  isUnitModalOpened.value = false;
};

const url = ref(import.meta.env.VITE_URL);

const POLLING_INTERVAL = 5000; // 5 seconds

// Function to fetch units from the API
const getUnits = () => {
  fetch(url.value + "api/units", {
    headers: { "Content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((response) => {
      units.value = response;
    })
    .catch((error) => {
      console.error(error);
    });
};

// Function to fetch calls from the API
const getCalls = () => {
  fetch(url.value + "api/calls", {
    headers: { "Content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((response) => {
      calls.value = response;
    })
    .catch((error) => {
      console.error(error);
    });
};

// Function to update the assigned unit for a call
const updateAssignedUnit = (callID, unitID) => {
  fetch(url.value + `api/calls/unit`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ callID: callID, unitID: unitID }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("Assigned unit updated successfully");
        toast("Updated Unit!", {
          theme: "colored",
          type: "success",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
        // Reload both tables data from the API
        getCalls();
        getUnits();
      } else {
        toast("Failed to update unit.", {
          theme: "colored",
          type: "warning",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
        throw new Error("Failed to update assigned unit");
      }
    })
    .catch((error) => {
      console.error("Error updating assigned unit:", error);
    });
};

// Function to close the call
const closeCall = (callID, status) => {
  console.log(callID);
  // Check if the call is already closed or has a "Closed" status
  if (status === "Closed") {
    console.log("Call is already closed");
    return; // Exit the function early if the call is already closed
  }

  // Make API call to close the call
  fetch(url.value + `api/calls/close`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ callID: callID }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("Call closed successfully");
        toast("Call closed successfully!", {
          theme: "colored",
          type: "success",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });

        // Reload both tables data from the API
        getCalls();
        getUnits();
      } else {
        toast("Failed to close call.", {
          theme: "colored",
          type: "warning",
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
        throw new Error("Failed to close the call");
      }
    })
    .catch((error) => {
      console.error("Error closing the call:", error);
    });
};

// Function to change unit status
const setStatus = (unitID, status) => {
  if (status === "OOS") {
    fetch(url.value + `api/units/BIS`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ unitID: unitID }),
    })
      .then((res) => {
        if (res.ok) {
          console.log("Unit statused successfully");
          toast("Unit statused successfully!", {
            theme: "colored",
            type: "success",
            autoClose: 5000,
            dangerouslyHTMLString: true,
          });

          // Reload both tables data from the API
          getCalls();
          getUnits();
        } else {
          toast("Failed to status unit.", {
            theme: "colored",
            type: "warning",
            autoClose: 5000,
            dangerouslyHTMLString: true,
          });
          throw new Error("Failed to status unit");
        }
      })
      .catch((error) => {
        console.error("Error statusing unit:", error);
      });
  }
  // If unit status is NOT OOS
  else {
    fetch(url.value + `api/units/OOS`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ unitID: unitID }),
    })
      .then((res) => {
        if (res.ok) {
          console.log("Unit statused successfully");
          toast("Unit statused successfully!", {
            theme: "colored",
            type: "success",
            autoClose: 5000,
            dangerouslyHTMLString: true,
          });
          getCalls();
          getUnits();
        } else {
          toast("Failed to status unit.", {
            theme: "colored",
            type: "warning",
            autoClose: 5000,
            dangerouslyHTMLString: true,
          });
          throw new Error("Failed to status unit");
        }
      })
      .catch((error) => {
        console.error("Error statusing unit:", error);
      });
  }
};

const displayPhoneFormat = (number) => {
  let phoneNumber = number.replace(/\D/g, "");
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
  return phoneNumber;
};

// Truncate Text Function
const truncateText = (text) => {
  if (text.length > 100) {
    return text.substring(0, 100) + "...";
  }
  return text;
};

// Call Sorting
const unassignedCalls = computed(() => {
  return calls.value
    .filter((call) => call.status === "Unassigned")
    .sort((a, b) => a.callID - b.callID);
});
const inProgressCalls = computed(() => {
  return calls.value
    .filter((call) => call.status === "In-Progress")
    .sort((a, b) => a.callID - b.callID);
});
const closedCalls = computed(() => {
  return calls.value
    .filter((call) => call.status === "Closed")
    .sort((a, b) => a.callID - b.callID);
});

// Unit Sorting
const unassignedUnits = computed(() => {
  return units.value
    .filter((unit) => (unit.status === "Unassigned") | (unit.status === "Free"))
    .sort((a, b) => a.unitID - b.unitID);
});
const inProgressUnits = computed(() => {
  return units.value
    .filter((unit) => unit.status === "Busy")
    .sort((a, b) => a.unitID - b.unitID);
});
const oosUnits = computed(() => {
  return units.value
    .filter((unit) => unit.status === "OOS")
    .sort((a, b) => a.unitID - b.unitID);
});

const getRowClass = (status) => {
  if ((status === "Unassigned") | (status === "OOS")) {
    return "unassigned-row";
  } else if ((status === "In-Progress") | (status === "Busy")) {
    return "in-progress-row";
  } else if ((status === "Closed") | (status === "Free")) {
    return "closed-row";
  } else {
    return "";
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

const providedFunctions = {
  displayPhoneFormat,
  closeCall,
  getUnits,
  getCalls,
};

provide("providedFunctions", providedFunctions);
</script>

<template>
  <div class="content">
    <div class="dispatch">
      <!-- Calls -->
      <div class="card">
        <h2>Call Dispatch</h2>
        <div class="card-body">
          <table>
            <tr>
              <th>Location of Call</th>
              <th>Complaint</th>
              <th>Call Open</th>
              <th>Assigned Unit</th>
              <th>Call Status</th>
              <th>Details</th>
            </tr>

            <tr
              v-for="call in unassignedCalls"
              :key="call.callID"
              :class="getRowClass(call.status)"
            >
              <td>{{ truncateText(call.location) }}</td>
              <td>{{ truncateText(call.complaint) }}</td>
              <td>{{ call.open_time }}</td>
              <td>
                <select
                  v-model="call.unit"
                  @change="updateAssignedUnit(call.callID, call.unit)"
                  :disabled="call.status === 'Closed'"
                >
                  <option
                    v-for="unit in units"
                    :key="unit.unitID"
                    :value="unit.unitID"
                    :selected="unit.unitID === call.unit"
                  >
                    {{ unit.name }}
                  </option>
                </select>
              </td>
              <td>{{ call.status }}</td>
              <td>
                <button @click="openModal(call.callID)" class="detailsButton">
                  Show Details
                </button>
              </td>
            </tr>

            <tr
              v-for="call in inProgressCalls"
              :key="call.callID"
              :class="getRowClass(call.status)"
            >
              <td>{{ truncateText(call.location) }}</td>
              <td>{{ truncateText(call.complaint) }}</td>
              <td>{{ call.open_time }}</td>
              <td>
                <select
                  v-model="call.unit"
                  @change="updateAssignedUnit(call.callID, call.unit)"
                  :disabled="call.status === 'Closed'"
                >
                  <option
                    v-for="unit in units"
                    :key="unit.unitID"
                    :value="unit.unitID"
                    :selected="unit.unitID === call.unit"
                  >
                    {{ unit.name }}
                  </option>
                </select>
              </td>
              <td>{{ call.status }}</td>
              <td>
                <button @click="openModal(call.callID)" class="detailsButton">
                  Show Details
                </button>
              </td>
            </tr>

            <tr
              v-for="call in closedCalls"
              :key="call.callID"
              :class="getRowClass(call.status)"
            >
              <td>{{ truncateText(call.location) }}</td>
              <td>{{ truncateText(call.complaint) }}</td>
              <td>{{ call.open_time }}</td>
              <td>
                <select
                  v-model="call.unit"
                  @change="updateAssignedUnit(call.callID, call.unit)"
                  :disabled="call.status === 'Closed'"
                >
                  <option
                    v-for="unit in units"
                    :key="unit.unitID"
                    :value="unit.unitID"
                    :selected="unit.unitID === call.unit"
                  >
                    {{ unit.name }}
                  </option>
                </select>
              </td>
              <td>{{ call.status }}</td>
              <td>
                <button @click="openModal(call.callID)" class="detailsButton">
                  Show Details
                </button>
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
              <th>Identifier</th>
              <th>Phone Number</th>
              <th>Current Status</th>
              <th>Out Of Service</th>
            </tr>
            <tr
              v-for="unit in unassignedUnits"
              :key="unit.unitID"
              :class="getRowClass(unit.status)"
            >
              <td>{{ unit.name }}</td>
              <td>{{ displayPhoneFormat(unit.contact) }}</td>
              <td>{{ unit.status }}</td>
              <td>
                <button
                  @click="setStatus(unit.unitID, unit.status)"
                  :disabled="unit.status === 'Busy'"
                  class="detailsButton"
                >
                  {{ unit.status === "Free" ? "Set Unit OOS" : "Set Unit BIS" }}
                </button>
              </td>
            </tr>

            <tr
              v-for="unit in inProgressUnits"
              :key="unit.unitID"
              :class="getRowClass(unit.status)"
            >
              <td>{{ unit.name }}</td>
              <td>{{ displayPhoneFormat(unit.contact) }}</td>
              <td>{{ unit.status }}</td>
              <td>
                <button
                  @click="setStatus(unit.unitID, unit.status)"
                  :disabled="unit.status === 'Busy'"
                  class="detailsButton"
                >
                  {{ unit.status === "Free" ? "Set Unit OOS" : "Set Unit BIS" }}
                </button>
              </td>
            </tr>

            <tr
              v-for="unit in oosUnits"
              :key="unit.unitID"
              :class="getRowClass(unit.status)"
            >
              <td>{{ unit.name }}</td>
              <td>{{ displayPhoneFormat(unit.contact) }}</td>
              <td>{{ unit.status }}</td>
              <td>
                <button
                  @click="setStatus(unit.unitID, unit.status)"
                  :disabled="unit.status === 'Busy'"
                  class="detailsButton"
                >
                  {{ unit.status === "Free" ? "Set Unit OOS" : "Set Unit BIS" }}
                </button>
              </td>
            </tr>
          </table>
        </div>
        <div class="card-footer">
          <button @click="openUnitModal()" class="submit">Add Unit</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal">
    <detail-modal
      :isOpen="isModalOpened"
      :currentCall="currentCall"
      @modal-close="closeModal"
      name="Detail Modal"
    >
  </detail-modal>

    <unit-modal
      :isOpen="isUnitModalOpened"
      @modal-close="closeUnitModal"
      name="Unit Modal"
    >
    </unit-modal>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
}

.modal {
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

.detailsButton {
  border: 2px solid black;
  background-color: white;
  color: black;
  padding: 14px 28px;
  font-size: 12px;
  cursor: pointer;
  border-color: black;
  color: black;
}
.detailsButton:hover {
  background-color: #f1c232;
  color: black;
}

select {
  border: 2px solid black;
  background-color: white;
  color: black;
  font-size: 12px;
  cursor: pointer;
  border-color: black;
  color: black;

  max-width: 15ch;
  word-wrap: break-word;
}
select:disabled {
  border-color: #666;
  color: #666;
  background-color: white;
  cursor: default;
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

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px; /* Adjust as needed */

  max-width: 20ch;
  word-wrap: break-word;
}
</style>