<template>
    <UICard>
      <TypePositionsTable />
    </UICard>    
</template>

<script setup lang="ts">
import TypePositionsTable from '@/components/UI/typePositions/TypePositionsTable.vue';
import { usePositionGroupsStore } from '@/stores/positionGroupsStore';

const PositionGroupStore = usePositionGroupsStore();

onBeforeMount(async () => {
  console.log(123);
  await PositionGroupStore.loadSpheres();
  await PositionGroupStore.loadGroups();
  console.log(456);  
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