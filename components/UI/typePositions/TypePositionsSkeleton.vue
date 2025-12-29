<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <div class="text-field">
          <v-skeleton-loader
            type="heading"
            width="360"
          ></v-skeleton-loader>
        </div>
        <div class="select-field">
          <v-skeleton-loader
            type="heading"
            width="240"
          />
        </div>
      </div>
      <div class="buttons">
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="button"
          width="36"
        />
      </div>
    </div>
    <div class="table-content">
      <div class="tabs">
        <v-skeleton-loader
          v-for="i in 2"
          :key="i"
          type="heading"
          height="36"
          width="120"
        />
      </div>
      <v-skeleton-loader
        type="table-tbody"
        :rows="6"
        :columns="3"
        class="table-skeleton"
      />
    </div>
  </div>
</template>

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

      :deep(.v-skeleton-loader) {
        border-radius: 8px;
      }
      :deep(.v-skeleton-loader__button) {
        margin: 0;
      }
    }
  }
  .filters {
    display: flex;
    gap: 12px;
    align-items: center;

    :deep(.v-skeleton-loader__heading) {
      margin: 0;
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

      :deep(.v-skeleton-loader__heading) {
        margin: 0;
        height: 32px;
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

  .table-skeleton {
    border-radius: 8px;
    overflow: hidden;
  }
</style>