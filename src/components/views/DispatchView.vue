<template>
  <div class="container-fluid px-4 py-3">
    <div class="row gx-4">
      <div class="col-8">
        <h4 class="py-3 border-bottom">Call log</h4>
        <table class="table table-hover mt-4">
          <thead>
            <th scope="col">Location</th>
            <th scope="col">Complaint</th>
            <th scope="col">Time Received</th>
            <!-- <th scope="col">Rider/Bib</th> -->
            <th scope="col">Status</th>
            <th scope="col">Assigned Unit</th>
            <th scope="col">Details</th>
          </thead>
          <tbody>

            <tr
              v-for="call in unassignedCalls"
              :key="call.callID"
              :class="getRowClass(call.status)"
            >
              <td>{{ truncateText(call.location) }}</td>
              <td>{{ truncateText(call.complaint) }}</td>
              <td>{{ call.open_time }}</td>
              <td>
                <select class="form-select form-select-sm"
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
                <button @click="openModal(call.callID)" class="btn btn-sm btn-light">
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
                <select class="form-select form-select-sm"
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
                <button @click="openModal(call.callID)" class="btn btn-sm btn-light">
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
                <select class="form-select form-select-sm"
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
                <button @click="openModal(call.callID)" class="btn btn-sm btn-light">
                  Show Details
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      <div class="col-4">
        <h4 class="py-3 border-bottom">Units</h4>
        <table class="table table-hover mt-4">
          <thead>
            <th scope="col">Identifier</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Status</th>
            <th scope="col">Out of Service</th>
          </thead>
          <tbody>
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
                  class="btn btn-sm btn-light"
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
                  class="btn btn-sm btn-light"
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
                  class="btn btn-sm btn-light"
                >
                  {{ unit.status === "Free" ? "Set Unit OOS" : "Set Unit BIS" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="text-center mt-4">
          <button @click="openUnitModal()" class="btn btn-success">Add Unit</button>
        </div>

      </div>
    </div>

  </div>


  <div class="modal fade" id="modal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="modalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

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




  <!-- <div class="modal">
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
  </div> -->
</template>


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
    return "table-danger";
  } else if ((status === "In-Progress") | (status === "Busy")) {
    return "table-warning";
  } else if ((status === "Closed") | (status === "Free")) {
    return "table-success";
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
