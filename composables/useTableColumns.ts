import type { Column } from "~/components/UI/table/DataTable.vue"

interface TableColumnsOptions {
  storageKey?: string
  autoSave?: boolean
}

export function useTableColumns(
  defaultColumns: Column[],
  options: TableColumnsOptions = {}
) {
  const {storageKey, autoSave = true} = options;

  const columns = ref<Column[]>(structuredClone(defaultColumns));
  const visibleColumns = computed(() => columns.value?.filter(col => col.visible));
  const hiddenColumns = computed(() => columns.value?.filter(col => !col.visible));
  
  function toggleVisibility(id: string) {
    const selectedColumn = columns.value.find(col => col.id === id);
    if(selectedColumn) {
      selectedColumn.visible = !selectedColumn.visible;
    }
  }
  function showAll() {
    columns.value.forEach(col => col.visible = true);
  }
  function hideAll() {
    columns.value.forEach(col => col.visible = false);
  }

  function resetColumns() {
    columns.value = structuredClone(defaultColumns);
    saveColumns();
  }

  function onDragStartVisible() {}
  function onDragStartHidden() {}
  function onDropVisible() {}
  function onDropHidden() {}

  function loadColumns() {
    if(!storageKey) {
      return;
    }

    try {
      const dataFromLocalStorage = localStorage.getItem(storageKey);
      if(!dataFromLocalStorage) {
        return;
      }

      const columnsFromLocalStorage: Column[] = JSON.parse(dataFromLocalStorage);
      const mapOfColumnsFromLocalStorage = new Map(columnsFromLocalStorage.map(col => [col.id, col]));
      columns.value = defaultColumns.map(col => 
        mapOfColumnsFromLocalStorage.get(col.id) ? {...col, ...mapOfColumnsFromLocalStorage.get(col.id)!} : col
      );
    } catch (error) {
      console.error('Load columns failed', error);
    }
  }
  function saveColumns() {
    if(!storageKey) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(columns.value));
  }

  if(autoSave && storageKey) {
    watch(columns, saveColumns, {deep: true});
  }

  return {
    columns,
    visibleColumns,
    hiddenColumns,
    toggleVisibility,
    showAll,
    hideAll,
    resetColumns,
    onDragStartVisible,
    onDragStartHidden,
    onDropVisible,
    onDropHidden,
    loadColumns,
    saveColumns,
  }
}