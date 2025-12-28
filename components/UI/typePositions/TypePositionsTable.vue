<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <div class="text-field">
          <UITextField
            v-model="PositionGroupStore.searchTerm"
            label="Найти"
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </div>
        <div class="select-field">
          <UISelectField
            v-model="PositionGroupStore.selectedSphereIds"
            :items="sphereOptions"
            itemTitle="title"
			      itemValue="value"
            :withCheckboxes="true"
            label="Cфера"
            :multiple="true"
            clearable
            :enableSelectAll="true"
            selectAllValue="all"
            selectionLabelAll='Все'
          />
        </div>
      </div>
      <div class="buttons">
        <UIButton variant="secondary" type="button">
          <UIIcon icon="mdi-eye" size="sm" :clickable="false"></UIIcon>
        </UIButton>
        <UIButton variant="secondary" type="button" icon="mdi-information">D</UIButton>
        <UIButton variant="secondary" type="button" @click="PositionGroupStore.toggleDialogForAdding">A</UIButton>
      </div>
    </div>
    <div class="table-content">
      <div class="tabs">
        <UIButton
          :variant="PositionGroupStore.selectedTypePositions === PositionGroupType.eqip ? 'secondary' : 'text'"
          @click="PositionGroupStore.setSelectedTypePositions(PositionGroupType.eqip)"
        >Оборудование</UIButton>
        <UIButton
          :variant="PositionGroupStore.selectedTypePositions === PositionGroupType.serv ? 'secondary' : 'text'"
          @click="PositionGroupStore.setSelectedTypePositions(PositionGroupType.serv)"
        >Услуги</UIButton>
      </div>
      <DataTable
        :items="rows"
        :columns="visibleColumns"
        item-key="id"
        :loading="PositionGroupStore.loadingTable"
        style="border-radius: 8px; overflow: hidden;"
      >
        <template #cell.sphereIds="{ item }">
            <span>{{ item.sphereIds.map((item: string) => sphereOptions.find(sph => sph.value === item)?.title).join(', ') }}</span>
        </template>
        <template #cell.archived="{ item }">
          <UIIcon :icon="item.archived ? 'mdi-eye-off' : 'mdi-eye'" size="sm" :clickable="false"></UIIcon>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePositionGroupsStore } from '@/stores/positionGroupsStore';
import type { Column } from '@/components/UI/table/DataTable.vue';
import { PositionGroupType, type PositionGroup } from '@/types/partner-zones';
import DataTable from '@/components/UI/table/DataTable.vue';

const PositionGroupStore = usePositionGroupsStore();

const DEFAULT_COLUMNS: Column[] = [
  { id: 'name', key: 'name', title: 'Тип', visible: true, },
  { id: 'sphereIds', key: 'sphereIds', title: 'Сферы', visible: true },
  { id: 'archived', key: 'archived', title: 'Статус', visible: true }
];
const { visibleColumns } = useTableColumns(DEFAULT_COLUMNS, { storageKey: 'typePositions.columns.v1' });

const rows = computed(() => PositionGroupStore.filtredGroups);
const sphereOptions = computed(() => PositionGroupStore.sphereOptions);

</script>

<style lang="scss" scoped>
  .toolbar {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px #91919B4D solid;

    .buttons {
      display: flex;
      gap: 12px;

      button {
        width: 36px;
        height: 36px;
        padding: 8px 0;
      }
    }
  }
  .filters {
    display: flex;
    gap: 12px;
    align-items: center;

    .text-field {
      width: 360px;
      height: 48px;

      :deep(.v-field__input) {
        min-height: 20px;
        height: 46px;
        padding: 0;
      }
    }

    .select-field {
      width: 240px;
      height: 48px;
    }
  }

  .table-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;


    .tabs {
      display: flex;
      gap: 13px;

      button {
        padding: 8px 12px;
        font-size: 14px;
      }
    }
  }

  .tags {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;

    .tag {
      background-color: #a4c7f3;
      padding: 2px 4px;
      border-radius: 8px;
      font-size: 10px;
    }
  }
</style>