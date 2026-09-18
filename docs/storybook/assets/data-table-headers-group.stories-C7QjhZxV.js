import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,r as i,t as a}from"./data-table-D8o-Weoq.js";import{_ as o,w as s}from"./api-BJIZDprh.js";import{i as c,n as l}from"./story-section-DVTm6cGm.js";import{r as u,t as d}from"./lib-CZRp1gG1.js";import{i as f,n as p,t as m}from"./applications-config-D877dlRU.js";import{n as h,s as g,t as _}from"./card-lDj02HnZ.js";import{c as v,l as y,n as b,o as x,t as S}from"./table-mock-D6F-6-jV.js";import{n as C,t as w}from"./pin-row-cell-DVYxb8M9.js";import{n as T,t as E}from"./row-selection-cell-zsCIGFDL.js";import{n as D,t as O}from"./table-row-selection-header-DZxMin4Y.js";function k({args:e,title:t}){return(0,A.jsx)(l,{title:t,children:(0,A.jsx)(`div`,{className:`bg-muted w-full size-auto h-screen overflow-auto p-3`,children:(0,A.jsx)(_,{className:`h-auto size-max w-full`,children:(0,A.jsx)(h,{children:(0,A.jsx)(a,{...e})})})})})}var A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{u(),s(),C(),T(),n(),D(),g(),f(),c(),x(),A=t(),j=r(),M=i([{id:`pinRow`,visible:!0,label:`Pin Row`,pinningPosition:`start`,fixed:!0,variant:`ghost`},{id:`rowSelection`,visible:!0,label:`Row Selection`,pinningPosition:`start`,fixed:!0},{id:`firstName`,visible:!0,label:`First Name`},{id:`lastName`,visible:!0,label:`Last Name`},{id:`age`,visible:!0,label:`Age`},{id:`visits`,visible:!0,label:`firstName`},{id:`status`,visible:!0,label:`Status`},{id:`progress`,visible:!0,label:`Profile Progress`}]),N=i([{id:`pinRow`,visible:!0,label:`Pin Row`,fixed:!0,pinningPosition:`start`,variant:`ghost`},{id:`rowSelection`,visible:!0,label:`Row Selection`,fixed:!0,pinningPosition:`start`},{id:`firstName`,visible:!0,label:`First Name`},{id:`lastName`,visible:!0,label:`Last Name`},{id:`email`,visible:!0,label:`Email`},{id:`phoneNumber`,visible:!0,label:`Phone Number`},{id:`age`,visible:!0,label:`Age`},{id:`visits`,visible:!0,label:`firstName`},{id:`status`,visible:!0,label:`Status`},{id:`progress`,visible:!0,label:`Profile Progress`},{id:`hobbies`,visible:!1,label:`Hobbies`},{id:`country`,visible:!0,label:`Country`},{id:`city`,visible:!0,label:`City`},{id:`accountCreatedAt`,visible:!0,label:`Account Created At`},{id:`lastLoginAt`,visible:!0,label:`Last Login At`},{id:`isActive`,visible:!0,label:`Is Active`},{id:`role`,visible:!0,label:`Role`},{id:`lastVisitAt`,visible:!0,label:`Last Visit At`},{id:`preferredLanguage`,visible:!0,label:`Preferred Language`},{id:`newsletterSubscribed`,visible:!0,label:`Newsletter Subscribed`},{id:`themePreference`,visible:!0,label:`Theme Preference`},{id:`tags`,visible:!1,label:`Tags`},{id:`notes`,visible:!1,label:`Notes`}]),P={variant_entity:{app_id:m.variant_entity},germline_snv_occurrence:{app_id:m.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:m.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:`admin`,app_id:m.admin},portal:{name:``,navigation:{}}},F={title:`Features/Data Table/Headers Group`,component:a,args:{id:`storybook`,columns:v,data:b,serverOptions:{defaultSorting:[{field:`germline_pf_wgs`,order:o.Asc}],onSortingChange:e=>{}},defaultColumnSettings:y,loadingStates:{total:!1,list:!1},pagination:{type:`server`,state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>(0,A.jsx)(d,{children:(0,A.jsx)(p,{config:P,children:(0,A.jsx)(e,{})})})]},I={args:{enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:`actions`,columns:[{id:`pinRow`,cell:w,size:10,maxSize:10,enableResizing:!1,enablePinning:!1},{id:`rowSelection`,size:48,maxSize:48,header:e=>(0,A.jsx)(O,{table:e.table}),cell:e=>(0,A.jsx)(E,{row:e.row}),enableResizing:!1,enablePinning:!1}]},{header:`Group Left`,size:400,minSize:200,columns:[j.accessor(`firstName`,{cell:e=>e.getValue()}),j.accessor(`lastName`,{id:`lastName`,cell:e=>e.getValue(),header:`Last Name`})]},{header:`Group Right`,size:400,minSize:200,columns:[j.accessor(`age`,{header:()=>`Age`}),j.accessor(`visits`,{header:`Visits`}),j.accessor(`status`,{header:`Status`}),j.accessor(`progress`,{header:`Profile Progress`})]}],defaultColumnSettings:M},render:e=>(0,A.jsx)(k,{args:e,title:`Default`})},L={args:{data:b.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:`actions`,columns:[j.group({id:`sub-group-actions`,columns:[{id:`pinRow`,cell:w,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:`rowSelection`,header:e=>(0,A.jsx)(O,{table:e.table}),cell:e=>(0,A.jsx)(E,{row:e.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:`Group Left`,columns:[j.group({id:`sub-group-left`,columns:[j.accessor(`firstName`,{cell:e=>e.getValue()}),j.accessor(`lastName`,{id:`lastName`,cell:e=>e.getValue(),header:`Last Name`})]})]},{header:`Group Right`,columns:[j.group({header:`Sub Group`,columns:[j.accessor(`age`,{header:()=>`Age`}),j.accessor(`visits`,{header:`Visits`}),j.accessor(`status`,{header:`Status`}),j.accessor(`progress`,{header:`Profile Progress`})]})]}],defaultColumnSettings:M},render:e=>(0,A.jsx)(k,{args:e,title:`With subgroups`})},R={args:{data:S.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:`actions`,size:96,columns:[j.group({id:`sub-group-user`,columns:[{id:`pinRow`,cell:w,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:`rowSelection`,header:e=>(0,A.jsx)(O,{table:e.table}),cell:e=>(0,A.jsx)(E,{row:e.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:`User`,columns:[j.group({header:`Name`,columns:[j.accessor(`firstName`,{cell:e=>e.getValue()}),j.accessor(`lastName`,{id:`lastName`,cell:e=>e.getValue(),header:`Last Name`})]}),j.accessor(`email`,{header:`Email`}),j.accessor(`phoneNumber`,{header:`Phone Number`})]},{header:`Statistics`,columns:[j.group({id:`subgroup-statistics`,columns:[j.accessor(`age`,{header:`Age`}),j.accessor(`visits`,{header:`Visits`}),j.accessor(`status`,{header:`Status`}),j.accessor(`progress`,{header:`Profile Progress`}),j.accessor(`hobbies`,{header:`Hobbies`})]})]},{header:`Location`,columns:[j.group({id:`subgroup-location`,columns:[j.accessor(`country`,{header:`Country`}),j.accessor(`city`,{header:`City`})]})]},{header:`Account`,columns:[j.group({id:`sub-group-account`,columns:[j.accessor(`isActive`,{header:`Is Active`}),j.accessor(`role`,{header:`Role`}),j.accessor(`preferredLanguage`,{header:`Preferred Language`}),j.accessor(`newsletterSubscribed`,{header:`Newsletter Subscribed`}),j.accessor(`themePreference`,{header:`Theme Preference`}),j.accessor(`accountCreatedAt`,{header:`Account Created At`}),j.accessor(`lastLoginAt`,{header:`Last Login At`}),j.accessor(`lastVisitAt`,{header:`Last Visited At`})]})]},{header:`Additionals`,columns:[j.group({id:`sub-group-additionals`,columns:[j.accessor(`tags`,{header:`Tags`}),j.accessor(`notes`,{header:`Notes`})]})]}],defaultColumnSettings:N,loadingStates:{total:!1,list:!1},pagination:{type:`server`,state:{pageIndex:0,pageSize:10}}},render:e=>(0,A.jsx)(k,{args:e,title:`Advanced`})},z={args:{data:S,enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:`actions`,size:96,columns:[j.group({id:`sub-group-user`,columns:[{id:`pinRow`,cell:w,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:`rowSelection`,header:e=>(0,A.jsx)(O,{table:e.table}),cell:e=>(0,A.jsx)(E,{row:e.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:`User`,columns:[j.group({header:`Name`,columns:[j.accessor(`firstName`,{cell:e=>e.getValue()}),j.accessor(`lastName`,{id:`lastName`,cell:e=>e.getValue(),header:`Last Name`})]}),j.accessor(`email`,{header:`Email`}),j.accessor(`phoneNumber`,{header:`Phone Number`})]},{header:`Statistics`,columns:[j.group({id:`subgroup-statistics`,columns:[j.accessor(`age`,{header:`Age`}),j.accessor(`visits`,{header:`Visits`}),j.accessor(`status`,{header:`Status`}),j.accessor(`progress`,{header:`Profile Progress`}),j.accessor(`hobbies`,{header:`Hobbies`})]})]},{header:`Location`,columns:[j.group({id:`subgroup-location`,columns:[j.accessor(`country`,{header:`Country`}),j.accessor(`city`,{header:`City`})]})]},{header:`Account`,columns:[j.group({id:`sub-group-account`,columns:[j.accessor(`isActive`,{header:`Is Active`}),j.accessor(`role`,{header:`Role`}),j.accessor(`preferredLanguage`,{header:`Preferred Language`}),j.accessor(`newsletterSubscribed`,{header:`Newsletter Subscribed`}),j.accessor(`themePreference`,{header:`Theme Preference`}),j.accessor(`accountCreatedAt`,{header:`Account Created At`}),j.accessor(`lastLoginAt`,{header:`Last Login At`}),j.accessor(`lastVisitAt`,{header:`Last Visited At`})]})]},{header:`Additionals`,columns:[j.group({id:`sub-group-additionals`,columns:[j.accessor(`tags`,{header:`Tags`}),j.accessor(`notes`,{header:`Notes`})]})]}],defaultColumnSettings:N,loadingStates:{total:!1,list:!1},pagination:{type:`server`,state:{pageIndex:0,pageSize:50}}},render:e=>(0,A.jsx)(k,{args:e,title:`Advanced with 50 users`})},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [{
      id: 'actions',
      columns: [{
        id: 'pinRow',
        cell: PinRowCell,
        size: 10,
        maxSize: 10,
        enableResizing: false,
        enablePinning: false
      }, {
        id: 'rowSelection',
        size: 48,
        maxSize: 48,
        header: (header: HeaderContext<AppFeatures, TableMockData, unknown>) => <RowSelectionHeader table={header.table} />,
        cell: info => <RowSelectionCell row={info.row} />,
        enableResizing: false,
        enablePinning: false
      }]
    }, {
      header: 'Group Left',
      size: 400,
      minSize: 200,
      columns: [columnHelper.accessor('firstName', {
        cell: info => info.getValue()
      }), columnHelper.accessor('lastName', {
        id: 'lastName',
        cell: info => info.getValue(),
        header: 'Last Name'
      })]
    }, {
      header: 'Group Right',
      size: 400,
      minSize: 200,
      columns: [columnHelper.accessor('age', {
        header: () => 'Age'
      }), columnHelper.accessor('visits', {
        header: 'Visits'
      }), columnHelper.accessor('status', {
        header: 'Status'
      }), columnHelper.accessor('progress', {
        header: 'Profile Progress'
      })]
    }] as TableColumnDef<TableMockData, any>[],
    defaultColumnSettings: defaultMockColumnSettings
  },
  render: args => <HeadersGroupStory args={args} title="Default" />
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [{
      id: 'actions',
      columns: [columnHelper.group({
        id: 'sub-group-actions',
        columns: [{
          id: 'pinRow',
          cell: PinRowCell,
          size: 48,
          maxSize: 48,
          enableResizing: false,
          enablePinning: false
        }, {
          id: 'rowSelection',
          header: (header: HeaderContext<AppFeatures, TableMockData, unknown>) => <RowSelectionHeader table={header.table} />,
          cell: info => <RowSelectionCell row={info.row} />,
          size: 48,
          maxSize: 48,
          enableResizing: false,
          enablePinning: false
        }]
      })]
    }, {
      header: 'Group Left',
      columns: [columnHelper.group({
        id: 'sub-group-left',
        columns: [columnHelper.accessor('firstName', {
          cell: info => info.getValue()
        }), columnHelper.accessor('lastName', {
          id: 'lastName',
          cell: info => info.getValue(),
          header: 'Last Name'
        })]
      })]
    }, {
      header: 'Group Right',
      columns: [columnHelper.group({
        header: 'Sub Group',
        columns: [columnHelper.accessor('age', {
          header: () => 'Age'
        }), columnHelper.accessor('visits', {
          header: 'Visits'
        }), columnHelper.accessor('status', {
          header: 'Status'
        }), columnHelper.accessor('progress', {
          header: 'Profile Progress'
        })]
      })]
    }] as TableColumnDef<TableMockData, any>[],
    defaultColumnSettings: defaultMockColumnSettings
  },
  render: args => <HeadersGroupStory args={args} title="With subgroups" />
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    data: advancedData.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
    // group actions
    {
      id: 'actions',
      size: 96,
      columns: [columnHelper.group({
        id: 'sub-group-user',
        columns: [{
          id: 'pinRow',
          cell: PinRowCell,
          size: 48,
          maxSize: 48,
          enableResizing: false,
          enablePinning: false
        }, {
          id: 'rowSelection',
          header: (header: HeaderContext<AppFeatures, AdvancedTableMockData, unknown>) => <RowSelectionHeader table={header.table} />,
          cell: info => <RowSelectionCell row={info.row} />,
          size: 48,
          maxSize: 48,
          enableResizing: false,
          enablePinning: false
        }]
      })]
    },
    // group user
    {
      header: 'User',
      columns: [columnHelper.group({
        header: 'Name',
        columns: [columnHelper.accessor('firstName', {
          cell: info => info.getValue()
        }), columnHelper.accessor('lastName', {
          id: 'lastName',
          cell: info => info.getValue(),
          header: 'Last Name'
        })]
      }), columnHelper.accessor('email', {
        header: 'Email'
      }), columnHelper.accessor('phoneNumber', {
        header: 'Phone Number'
      })]
    },
    // group statistics
    {
      header: 'Statistics',
      columns: [columnHelper.group({
        id: 'subgroup-statistics',
        columns: [columnHelper.accessor('age', {
          header: 'Age'
        }), columnHelper.accessor('visits', {
          header: 'Visits'
        }), columnHelper.accessor('status', {
          header: 'Status'
        }), columnHelper.accessor('progress', {
          header: 'Profile Progress'
        }), columnHelper.accessor('hobbies', {
          header: 'Hobbies'
        })]
      })]
    },
    // group location
    {
      header: 'Location',
      columns: [columnHelper.group({
        id: 'subgroup-location',
        columns: [columnHelper.accessor('country', {
          header: 'Country'
        }), columnHelper.accessor('city', {
          header: 'City'
        })]
      })]
    },
    // group account
    {
      header: 'Account',
      columns: [columnHelper.group({
        id: 'sub-group-account',
        columns: [columnHelper.accessor('isActive', {
          header: 'Is Active'
        }), columnHelper.accessor('role', {
          header: 'Role'
        }), columnHelper.accessor('preferredLanguage', {
          header: 'Preferred Language'
        }), columnHelper.accessor('newsletterSubscribed', {
          header: 'Newsletter Subscribed'
        }), columnHelper.accessor('themePreference', {
          header: 'Theme Preference'
        }), columnHelper.accessor('accountCreatedAt', {
          header: 'Account Created At'
        }), columnHelper.accessor('lastLoginAt', {
          header: 'Last Login At'
        }), columnHelper.accessor('lastVisitAt', {
          header: 'Last Visited At'
        })]
      })]
    },
    // group additionals
    {
      header: 'Additionals',
      columns: [columnHelper.group({
        id: 'sub-group-additionals',
        columns: [columnHelper.accessor('tags', {
          header: 'Tags'
        }), columnHelper.accessor('notes', {
          header: 'Notes'
        })]
      })]
    }] as TableColumnDef<AdvancedTableMockData, any>[],
    defaultColumnSettings: defaultAdvancedColumnSettings,
    loadingStates: {
      total: false,
      list: false
    },
    pagination: {
      type: 'server',
      state: {
        pageIndex: 0,
        pageSize: 10
      }
    }
  },
  render: args => <HeadersGroupStory args={args} title="Advanced" />
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    data: advancedData,
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [
    // group actions
    {
      id: 'actions',
      size: 96,
      columns: [columnHelper.group({
        id: 'sub-group-user',
        columns: [{
          id: 'pinRow',
          cell: PinRowCell,
          size: 48,
          maxSize: 48,
          enableResizing: false,
          enablePinning: false
        }, {
          id: 'rowSelection',
          header: (header: HeaderContext<AppFeatures, AdvancedTableMockData, unknown>) => <RowSelectionHeader table={header.table} />,
          cell: info => <RowSelectionCell row={info.row} />,
          size: 48,
          maxSize: 48,
          enableResizing: false,
          enablePinning: false
        }]
      })]
    },
    // group user
    {
      header: 'User',
      columns: [columnHelper.group({
        header: 'Name',
        columns: [columnHelper.accessor('firstName', {
          cell: info => info.getValue()
        }), columnHelper.accessor('lastName', {
          id: 'lastName',
          cell: info => info.getValue(),
          header: 'Last Name'
        })]
      }), columnHelper.accessor('email', {
        header: 'Email'
      }), columnHelper.accessor('phoneNumber', {
        header: 'Phone Number'
      })]
    },
    // group statistics
    {
      header: 'Statistics',
      columns: [columnHelper.group({
        id: 'subgroup-statistics',
        columns: [columnHelper.accessor('age', {
          header: 'Age'
        }), columnHelper.accessor('visits', {
          header: 'Visits'
        }), columnHelper.accessor('status', {
          header: 'Status'
        }), columnHelper.accessor('progress', {
          header: 'Profile Progress'
        }), columnHelper.accessor('hobbies', {
          header: 'Hobbies'
        })]
      })]
    },
    // group location
    {
      header: 'Location',
      columns: [columnHelper.group({
        id: 'subgroup-location',
        columns: [columnHelper.accessor('country', {
          header: 'Country'
        }), columnHelper.accessor('city', {
          header: 'City'
        })]
      })]
    },
    // group account
    {
      header: 'Account',
      columns: [columnHelper.group({
        id: 'sub-group-account',
        columns: [columnHelper.accessor('isActive', {
          header: 'Is Active'
        }), columnHelper.accessor('role', {
          header: 'Role'
        }), columnHelper.accessor('preferredLanguage', {
          header: 'Preferred Language'
        }), columnHelper.accessor('newsletterSubscribed', {
          header: 'Newsletter Subscribed'
        }), columnHelper.accessor('themePreference', {
          header: 'Theme Preference'
        }), columnHelper.accessor('accountCreatedAt', {
          header: 'Account Created At'
        }), columnHelper.accessor('lastLoginAt', {
          header: 'Last Login At'
        }), columnHelper.accessor('lastVisitAt', {
          header: 'Last Visited At'
        })]
      })]
    },
    // group additionals
    {
      header: 'Additionals',
      columns: [columnHelper.group({
        id: 'sub-group-additionals',
        columns: [columnHelper.accessor('tags', {
          header: 'Tags'
        }), columnHelper.accessor('notes', {
          header: 'Notes'
        })]
      })]
    }] as TableColumnDef<AdvancedTableMockData, any>[],
    defaultColumnSettings: defaultAdvancedColumnSettings,
    loadingStates: {
      total: false,
      list: false
    },
    pagination: {
      type: 'server',
      state: {
        pageIndex: 0,
        pageSize: 50
      }
    }
  },
  render: args => <HeadersGroupStory args={args} title="Advanced with 50 users" />
}`,...z.parameters?.docs?.source}}},B=[`Default`,`WithSubgroups`,`Advanced`,`AdvancedWith50users`]})))()}V();export{R as Advanced,z as AdvancedWith50users,I as Default,L as WithSubgroups,B as __namedExportsOrder,F as default};