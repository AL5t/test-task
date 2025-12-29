<template>
  <UICard>
    <TypePositionsSkeleton v-if="loading" />
    <TypePositionsTable v-else />
    <AddPositionGroupDialog />
  </UICard>
</template>

<script setup lang="ts">
import TypePositionsTable from '@/components/UI/typePositions/TypePositionsTable.vue';
import { usePositionGroupsStore } from '@/stores/positionGroupsStore';
import AddPositionGroupDialog from '@/components/UI/typePositions/AddPositionGroupDialog.vue';
import TypePositionsSkeleton from '@/components/UI/typePositions/TypePositionsSkeleton.vue';

const PositionGroupStore = usePositionGroupsStore();
const loading = ref(true);

onBeforeMount(async () => {
  await PositionGroupStore.loadSpheres();
  await PositionGroupStore.loadGroups();
  loading.value = false;
});
</script>