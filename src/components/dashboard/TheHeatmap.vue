<template>
  <svg width="772" height="112" class="border">
    <g transform="translate(10,20)">
      <g
        v-for="(appointmentsWeek, weekNumber, position) in appointmentsCounter"
        :key="weekNumber"
        :transform="`translate(${position * 14}, 0)`"
      >
        <rect
          v-for="(value, indexDay, dayPosition) in appointmentsWeek"
          :key="indexDay"
          width="10"
          height="10"
          :value="value"
          :x="position"
          :y="dayPosition * 13"
        >
          <p>{{ value }}/{{ indexDay }}/{{ dayPosition }}</p>
        </rect>
      </g>
    </g>
  </svg>
  <!-- <p v-for="(item, index, value) of appointmentsCounter" :key="index">
    {{ item }} {{ index }} {{ value }}
  </p> -->
  <!-- <p>{{ appointmentsCounter }}</p> -->
</template>

<script>
export default {
  props: { appointments: { type: Array, default: () => [] } },
  data() {
    return { appointmentsCounter: {}, mapLength: 0 };
  },
  async created() {
    for (let appointment of this.appointments) {
      const weekNumber = DateTime.fromISO(appointment.dateTime).weekNumber;
      const dayNumber = DateTime.fromISO(appointment.dateTime).ordinal;
      if (!(weekNumber in this.appointmentsCounter)) {
        this.appointmentsCounter[weekNumber] = {};
      }
      if (!(dayNumber in this.appointmentsCounter[weekNumber])) {
        this.appointmentsCounter[weekNumber][dayNumber] = 1;
      } else {
        this.appointmentsCounter[weekNumber][dayNumber]++;
      }
    }
    for (let week of Object.entries(this.appointmentsCounter)) {
      let weekNumber = week[0];
      if (Object.keys(week[1]).length < 7) {
        let weekDatetime = DateTime.fromObject({
          weekYear: 2021, // TODO Shouldn't be manually inputted
          weekNumber: weekNumber,
        });
        let startOfWeek = weekDatetime.startOf("week");
        for (let x of Array(7).keys()) {
          let ordinal = startOfWeek.plus({ days: x }).ordinal;
          if (!(ordinal in week[1])) {
            this.appointmentsCounter[weekNumber][ordinal] = 0;
          }
          x++;
        }
      }
    }
    this.mapWeeks = Object.keys(this.appointmentsCounter);
  },
};
import { DateTime } from "luxon";
</script>
