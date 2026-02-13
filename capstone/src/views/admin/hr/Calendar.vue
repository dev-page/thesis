<template>
  <div style="height: 90vh;">
    <FullCalendar
      :plugins="[resourceTimelinePlugin, interactionPlugin]"
      initial-view="resourceTimelineWeek"
      :resources="calendarResources"
      :events="calendarEvents"
      height="auto"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import { ref } from 'vue'

export default {
  components: { FullCalendar },
  setup() {
    // Static employees (resources)
    const calendarResources = ref([
      { id: 'emp1', title: 'Alice (Main Branch)' },
      { id: 'emp2', title: 'Bob (North Branch)' },
      { id: 'emp3', title: 'Charlie (South Branch)' }
    ])

    // Static shifts (events)
    const calendarEvents = ref([
      {
        id: 'shift1',
        resourceId: 'emp1',
        title: 'Morning Shift',
        start: '2026-02-16T09:00:00',
        end: '2026-02-16T13:00:00'
      },
      {
        id: 'shift2',
        resourceId: 'emp2',
        title: 'Afternoon Shift',
        start: '2026-02-16T13:00:00',
        end: '2026-02-16T17:00:00'
      },
      {
        id: 'shift3',
        resourceId: 'emp3',
        title: 'Evening Shift',
        start: '2026-02-16T17:00:00',
        end: '2026-02-16T21:00:00'
      }
    ])

    return { calendarResources, calendarEvents }
  }
}
</script>