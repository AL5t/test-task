import type { Column } from "~/components/UI/table/DataTable.vue";

interface TableExportsOptions<T> {
  items: T[],
  columns: Column[],
  filename: string,
}

function escapeCsv(value: string): string {
  if(/[;"\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function getValue<T>(item: T, col: Column): string {
  if(col.format) {
    return col.format(item);
  }
  const value = (item as any)?.[col.key];
  return value == null ? '' : String(value);
}

export function useTableExport<T>(options: TableExportsOptions<T>) {
  function getItems() {
    return unref(options.items);
  }
  function getColumns() {
    return unref(options.columns);
  }

  function exportCsv() {
    const items = getItems();
    const columns = getColumns();
    const header = columns.map(col => escapeCsv(col.title)).join(';');

    const rows = items.map(item => columns.map(col => escapeCsv(getValue(item, col))).join(';'));

    const csv = '\uFEFF' + [header, ...rows].join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${options.filename}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function exportXlsx() {
    const [{utils, writeFile}] = await Promise.all([
      import('xlsx')
    ]);

    const items = getItems();
    const columns = getColumns();

    const data = [
      columns.map(col => col.title),
      ...items.map(item => 
        columns.map(col => getValue(item, col))
      ),
    ];

    const ws = utils.aoa_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    writeFile(wb, `${options.filename}_${ts}.xlsx`);
  }

  return {
    exportCsv,
    exportXlsx
  }
}