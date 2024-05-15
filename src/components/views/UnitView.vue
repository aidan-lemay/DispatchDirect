<script setup>
import { ref } from 'vue';

const units = ref([]);
const calls = ref([]);

const getUnits = () => {
  fetch('http://localhost:3000/api/units', {
    headers: { 'Content-type': 'application/json' },
  }).then(res => res.json()).then((response) => {
    units.value = response;
  }).catch((error) => {
    console.log('Looks like there was a problem: \n', error);
  });
}

const getCalls = () => {
  fetch('http://localhost:3000/api/calls', {
    headers: { 'Content-type': 'application/json' },
  }).then(res => res.json()).then((response) => {
    calls.value = response;
  }).catch((error) => {
    console.log('Looks like there was a problem: \n', error);
  });
}

getUnits();
getCalls();
</script>

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

<template>
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
          <td>{{ call.unit }}</td>
          <td>{{ call.status }}</td>
          <td>{{ call.notes }}</td>
        </tr>
      </table>
    </div>
  </div>

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
</template>