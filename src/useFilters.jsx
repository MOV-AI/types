import React, { useState, useMemo } from "react";

export default function useFilters({ data, types, columns }) {
  const filterColumns = useMemo(() => Object.entries(columns).reduce(
    (a, [key, value]) => value && value.filter ? a.concat(key) : a,
    []
  ), [columns]);

  const [ filters, setFilters ] =  useState(filterColumns.reduce((a, key) => ({
    ...a,
    [key]: types[key].initialFilter,
  }), {}));

  const filtersEl = useMemo(() => filterColumns.map(key => {
    const type = types[key];

    return (<type.Filter
      key={"filter-" + key}
      dataKey={key}
      data={data}
      type={type}
      value={filters[key]}
      onChange={newValue => setFilters({ ...filters, [key]: newValue })}
    />);
  }), [filterColumns, data, filters]);

  const filteredData = useMemo(() => data.filter(item => Object.entries(filters).reduce(
    (a, [key, filterValue]) => a && (!columns[key] || !columns[key].filter || types[key].filter(item[key], filterValue)),
    true
  )), [data, filters, columns]);

  return { filtersEl, filteredData };
}