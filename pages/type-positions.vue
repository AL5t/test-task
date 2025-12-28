<template>
  <UICard>
    <TypePositionsTable />
    <AddPositionGroupDialog />
  </UICard>
</template>

<script setup lang="ts">
import TypePositionsTable from '@/components/UI/typePositions/TypePositionsTable.vue';
import { usePositionGroupsStore } from '@/stores/positionGroupsStore';
import AddPositionGroupDialog from '@/components/UI/typePositions/AddPositionGroupDialog.vue';

const PositionGroupStore = usePositionGroupsStore();

onBeforeMount(async () => {
  await PositionGroupStore.loadSpheres();
  await PositionGroupStore.loadGroups();
});
</script>

<style scoped>
  .toolbar {
    display: flex;
  }
  .filters { 
    display: flex;
  }
</style>