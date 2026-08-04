import{j as s}from"./iframe-BXBRzL1c.js";import{a as H}from"./api-IE258HGD.js";import{P as n}from"./pin-row-cell-DsMWo5Qo.js";import{R as c}from"./row-selection-cell-B9gAAVc3.js";import{j as m,k as g,c as v}from"./data-table-Bi8pCVP_.js";import{R as u}from"./table-row-selection-header-BKOAsgFg.js";import{C as A,d as C}from"./card-Bc_90yu4.js";import{C as w,A as r}from"./applications-config-CmUEdNAO.js";import{a as P}from"./story-section-G0DD0yKl.js";import{a as p,f as N,h as b,m as z}from"./table-mock-B_xweJHl.js";import{B as R}from"./chunk-QUQL4437-DGUZn1R2.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CnDkH2FJ.js";import"./action-button-CiX5XSNN.js";import"./dropdown-menu-Dj2Zjq4n.js";import"./index-Buei5AJu.js";import"./index-C0UyXbDn.js";import"./check-BOVnNvmn.js";import"./circle-ZGZFIAr_.js";import"./separator-D6E9NYhF.js";import"./i18n-DUK-WuJ6.js";import"./index-DYAaY2Yf.js";import"./checkbox-HEb-Wb1J.js";import"./index-ChzukvM0.js";import"./isEqual-BBRRvwdU.js";import"./grip-vertical-BV5xekP0.js";import"./settings-DUBx0e6I.js";import"./arrow-down-o8nxA9L0.js";import"./skeleton-L9n2tz6Q.js";import"./number-format-DV0GfiRa.js";import"./pagination-BJIak5OX.js";import"./select-BHB1WtC1.js";import"./chevron-down-CD3dAkbA.js";import"./chevron-up-krr3_aDU.js";import"./ellipsis-B9ghaZcz.js";import"./empty-B56OsfWm.js";import"./index-DkrYVHRy.js";import"./api-CRj7GcIN.js";import"./badge-DNbRLMhx.js";import"./x-Ccdq7o_U.js";import"./search-gCbpG9f6.js";import"./chevron-right-Dsr2JqKi.js";import"./_baseUniq-D-Db-n5w.js";import"./empty-cell-D7ri16-A.js";const e=v(),h=g([{id:"pinRow",visible:!0,label:"Pin Row",pinningPosition:"left",fixed:!0,variant:"ghost"},{id:"rowSelection",visible:!0,label:"Row Selection",pinningPosition:"left",fixed:!0},{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),f=g([{id:"pinRow",visible:!0,label:"Pin Row",fixed:!0,pinningPosition:"left",variant:"ghost"},{id:"rowSelection",visible:!0,label:"Row Selection",fixed:!0,pinningPosition:"left"},{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"email",visible:!0,label:"Email"},{id:"phoneNumber",visible:!0,label:"Phone Number"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"},{id:"hobbies",visible:!1,label:"Hobbies"},{id:"country",visible:!0,label:"Country"},{id:"city",visible:!0,label:"City"},{id:"accountCreatedAt",visible:!0,label:"Account Created At"},{id:"lastLoginAt",visible:!0,label:"Last Login At"},{id:"isActive",visible:!0,label:"Is Active"},{id:"role",visible:!0,label:"Role"},{id:"lastVisitAt",visible:!0,label:"Last Visit At"},{id:"preferredLanguage",visible:!0,label:"Preferred Language"},{id:"newsletterSubscribed",visible:!0,label:"Newsletter Subscribed"},{id:"themePreference",visible:!0,label:"Theme Preference"},{id:"tags",visible:!1,label:"Tags"},{id:"notes",visible:!1,label:"Notes"}]),x={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},He={title:"Features/Data Table/Headers Group",component:m,args:{id:"storybook",columns:z,data:b,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:H.Asc}],onSortingChange:a=>{}},defaultColumnSettings:N,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[a=>s.jsx(R,{children:s.jsx(w,{config:x,children:s.jsx(a,{})})})]};function d({args:a,title:S}){return s.jsx(P,{title:S,children:s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(A,{className:"h-auto size-max w-full",children:s.jsx(C,{children:s.jsx(m,{...a})})})})})}const o={args:{enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",columns:[{id:"pinRow",cell:n,size:10,maxSize:10,enableResizing:!1,enablePinning:!1},{id:"rowSelection",size:48,maxSize:48,header:a=>s.jsx(u,{table:a.table}),cell:a=>s.jsx(c,{row:a.row}),enableResizing:!1,enablePinning:!1}]},{header:"Group Left",size:400,minSize:200,columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]},{header:"Group Right",size:400,minSize:200,columns:[e.accessor("age",{header:()=>"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]}],defaultColumnSettings:h},render:a=>s.jsx(d,{args:a,title:"Default"})},l={args:{data:b.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",columns:[e.group({id:"sub-group-actions",columns:[{id:"pinRow",cell:n,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(u,{table:a.table}),cell:a=>s.jsx(c,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"Group Left",columns:[e.group({id:"sub-group-left",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]})]},{header:"Group Right",columns:[e.group({header:"Sub Group",columns:[e.accessor("age",{header:()=>"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]}],defaultColumnSettings:h},render:a=>s.jsx(d,{args:a,title:"With subgroups"})},i={args:{data:p.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",size:96,columns:[e.group({id:"sub-group-user",columns:[{id:"pinRow",cell:n,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(u,{table:a.table}),cell:a=>s.jsx(c,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"User",columns:[e.group({header:"Name",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]}),e.accessor("email",{header:"Email"}),e.accessor("phoneNumber",{header:"Phone Number"})]},{header:"Statistics",columns:[e.group({id:"subgroup-statistics",columns:[e.accessor("age",{header:"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"}),e.accessor("hobbies",{header:"Hobbies"})]})]},{header:"Location",columns:[e.group({id:"subgroup-location",columns:[e.accessor("country",{header:"Country"}),e.accessor("city",{header:"City"})]})]},{header:"Account",columns:[e.group({id:"sub-group-account",columns:[e.accessor("isActive",{header:"Is Active"}),e.accessor("role",{header:"Role"}),e.accessor("preferredLanguage",{header:"Preferred Language"}),e.accessor("newsletterSubscribed",{header:"Newsletter Subscribed"}),e.accessor("themePreference",{header:"Theme Preference"}),e.accessor("accountCreatedAt",{header:"Account Created At"}),e.accessor("lastLoginAt",{header:"Last Login At"}),e.accessor("lastVisitAt",{header:"Last Visited At"})]})]},{header:"Additionals",columns:[e.group({id:"sub-group-additionals",columns:[e.accessor("tags",{header:"Tags"}),e.accessor("notes",{header:"Notes"})]})]}],defaultColumnSettings:f,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10}}},render:a=>s.jsx(d,{args:a,title:"Advanced"})},t={args:{data:p,enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",size:96,columns:[e.group({id:"sub-group-user",columns:[{id:"pinRow",cell:n,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(u,{table:a.table}),cell:a=>s.jsx(c,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"User",columns:[e.group({header:"Name",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]}),e.accessor("email",{header:"Email"}),e.accessor("phoneNumber",{header:"Phone Number"})]},{header:"Statistics",columns:[e.group({id:"subgroup-statistics",columns:[e.accessor("age",{header:"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"}),e.accessor("hobbies",{header:"Hobbies"})]})]},{header:"Location",columns:[e.group({id:"subgroup-location",columns:[e.accessor("country",{header:"Country"}),e.accessor("city",{header:"City"})]})]},{header:"Account",columns:[e.group({id:"sub-group-account",columns:[e.accessor("isActive",{header:"Is Active"}),e.accessor("role",{header:"Role"}),e.accessor("preferredLanguage",{header:"Preferred Language"}),e.accessor("newsletterSubscribed",{header:"Newsletter Subscribed"}),e.accessor("themePreference",{header:"Theme Preference"}),e.accessor("accountCreatedAt",{header:"Account Created At"}),e.accessor("lastLoginAt",{header:"Last Login At"}),e.accessor("lastVisitAt",{header:"Last Visited At"})]})]},{header:"Additionals",columns:[e.group({id:"sub-group-additionals",columns:[e.accessor("tags",{header:"Tags"}),e.accessor("notes",{header:"Notes"})]})]}],defaultColumnSettings:f,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:50}}},render:a=>s.jsx(d,{args:a,title:"Advanced with 50 users"})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
        header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
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
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
          header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
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
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
          header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
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
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
          header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
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
}`,...t.parameters?.docs?.source}}};const ve=["Default","WithSubgroups","Advanced","AdvancedWith50users"];export{i as Advanced,t as AdvancedWith50users,o as Default,l as WithSubgroups,ve as __namedExportsOrder,He as default};
