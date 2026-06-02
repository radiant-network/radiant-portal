import{j as s}from"./iframe-X1FdiBKE.js";import{i as C}from"./api-CNFUPySA.js";import{P as u,R as d}from"./row-selection-cell-Osl8Sz4r.js";import{e as p,$ as w,Z as b,m as H,d as r,X as h,c as N}from"./table-mock-CdEpFWmZ.js";import{C as z}from"./checkbox-DHqhLv6e.js";import{C as m,d as g}from"./card-CCNNB3a7.js";import{C as A,A as o}from"./applications-config-1HIrnDDl.js";import{B as x}from"./chunk-QUQL4437-BfEK6Nzn.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C1dmQasv.js";import"./index-BerhZw8G.js";import"./action-button-D2HkTc1A.js";import"./dropdown-menu-B8dOc9pX.js";import"./index-DnCxSPBU.js";import"./index-DfO9iG95.js";import"./check-CpvZoXR-.js";import"./circle-C0x1jrVb.js";import"./separator-BcF0hBxw.js";import"./i18n-DsLlobA0.js";import"./index-BoMd93ow.js";import"./empty-cell-DAHU-YIA.js";import"./number-format-BYqEMlb4.js";import"./settings-CScvYx19.js";import"./skeleton-UMhyrLm4.js";import"./pagination-CkUgD19v.js";import"./select-Hfj1BJ4_.js";import"./index-BjLlGfE7.js";import"./chevron-down-_LLWsBcL.js";import"./chevron-up-DKo4zVKH.js";import"./ellipsis-DMXZu9Bl.js";import"./empty-I6YlgEOm.js";import"./api-DxzlR9wx.js";import"./badge-B50hIUkw.js";import"./x-CT6RiXhO.js";import"./search-CrDJxrOj.js";import"./chevron-right-BzPqLc4n.js";function l({table:a}){return s.jsx("div",{className:"flex items-center justify-center w-full",children:s.jsx(z,{checked:a.getIsAllPageRowsSelected()||a.getIsSomePageRowsSelected()&&"indeterminate",onCheckedChange:v=>a.toggleAllPageRowsSelected(!!v),"aria-label":"Select all"})})}l.__docgenInfo={description:"",methods:[],displayName:"RowSelectionHeader",props:{table:{required:!0,tsType:{name:"Table",elements:[{name:"any"}],raw:"Table<any>"},description:""}}};const e=N(),f=h([{id:"pinRow",visible:!0,label:"Pin Row",pinningPosition:"left",fixed:!0,variant:"ghost"},{id:"rowSelection",visible:!0,label:"Row Selection",pinningPosition:"left",fixed:!0},{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),S=h([{id:"pinRow",visible:!0,label:"Pin Row",fixed:!0,pinningPosition:"left",variant:"ghost"},{id:"rowSelection",visible:!0,label:"Row Selection",fixed:!0,pinningPosition:"left"},{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"email",visible:!0,label:"Email"},{id:"phoneNumber",visible:!0,label:"Phone Number"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"},{id:"hobbies",visible:!1,label:"Hobbies"},{id:"country",visible:!0,label:"Country"},{id:"city",visible:!0,label:"City"},{id:"accountCreatedAt",visible:!0,label:"Account Created At"},{id:"lastLoginAt",visible:!0,label:"Last Login At"},{id:"isActive",visible:!0,label:"Is Active"},{id:"role",visible:!0,label:"Role"},{id:"lastVisitAt",visible:!0,label:"Last Visit At"},{id:"preferredLanguage",visible:!0,label:"Preferred Language"},{id:"newsletterSubscribed",visible:!0,label:"Newsletter Subscribed"},{id:"themePreference",visible:!0,label:"Theme Preference"},{id:"tags",visible:!1,label:"Tags"},{id:"notes",visible:!1,label:"Notes"}]),P={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},ue={title:"Tables/Data Table/HeadersGroup",component:r,args:{id:"storybook",columns:H,data:b,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:C.Asc}],onSortingChange:a=>{}},defaultColumnSettings:w,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[a=>s.jsx(x,{children:s.jsx(A,{config:P,children:s.jsx(a,{})})})]},i={args:{enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",columns:[{id:"pinRow",cell:u,size:10,maxSize:10,enableResizing:!1,enablePinning:!1},{id:"rowSelection",size:48,maxSize:48,header:a=>s.jsx(l,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),enableResizing:!1,enablePinning:!1}]},{header:"Group Left",size:400,minSize:200,columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]},{header:"Group Right",size:400,minSize:200,columns:[e.accessor("age",{header:()=>"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]}],defaultColumnSettings:f},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx("div",{className:"bg-background pt-4",children:s.jsx(r,{...a})})})})})},t={args:{data:b.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",columns:[e.group({id:"sub-group-actions",columns:[{id:"pinRow",cell:u,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(l,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"Group Left",columns:[e.group({id:"sub-group-left",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]})]},{header:"Group Right",columns:[e.group({header:"Sub Group",columns:[e.accessor("age",{header:()=>"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]}],defaultColumnSettings:f},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx(r,{...a})})})})},n={args:{data:p.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",size:96,columns:[e.group({id:"sub-group-user",columns:[{id:"pinRow",cell:u,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(l,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"User",columns:[e.group({header:"Name",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]}),e.accessor("email",{header:"Email"}),e.accessor("phoneNumber",{header:"Phone Number"})]},{header:"Statistics",columns:[e.group({id:"subgroup-statistics",columns:[e.accessor("age",{header:"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"}),e.accessor("hobbies",{header:"Hobbies"})]})]},{header:"Location",columns:[e.group({id:"subgroup-location",columns:[e.accessor("country",{header:"Country"}),e.accessor("city",{header:"City"})]})]},{header:"Account",columns:[e.group({id:"sub-group-account",columns:[e.accessor("isActive",{header:"Is Active"}),e.accessor("role",{header:"Role"}),e.accessor("preferredLanguage",{header:"Preferred Language"}),e.accessor("newsletterSubscribed",{header:"Newsletter Subscribed"}),e.accessor("themePreference",{header:"Theme Preference"}),e.accessor("accountCreatedAt",{header:"Account Created At"}),e.accessor("lastLoginAt",{header:"Last Login At"}),e.accessor("lastVisitAt",{header:"Last Visited At"})]})]},{header:"Additionals",columns:[e.group({id:"sub-group-additionals",columns:[e.accessor("tags",{header:"Tags"}),e.accessor("notes",{header:"Notes"})]})]}],defaultColumnSettings:S,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10}}},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx(r,{...a})})})})},c={args:{data:p,enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",size:96,columns:[e.group({id:"sub-group-user",columns:[{id:"pinRow",cell:u,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(l,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"User",columns:[e.group({header:"Name",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]}),e.accessor("email",{header:"Email"}),e.accessor("phoneNumber",{header:"Phone Number"})]},{header:"Statistics",columns:[e.group({id:"subgroup-statistics",columns:[e.accessor("age",{header:"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"}),e.accessor("hobbies",{header:"Hobbies"})]})]},{header:"Location",columns:[e.group({id:"subgroup-location",columns:[e.accessor("country",{header:"Country"}),e.accessor("city",{header:"City"})]})]},{header:"Account",columns:[e.group({id:"sub-group-account",columns:[e.accessor("isActive",{header:"Is Active"}),e.accessor("role",{header:"Role"}),e.accessor("preferredLanguage",{header:"Preferred Language"}),e.accessor("newsletterSubscribed",{header:"Newsletter Subscribed"}),e.accessor("themePreference",{header:"Theme Preference"}),e.accessor("accountCreatedAt",{header:"Account Created At"}),e.accessor("lastLoginAt",{header:"Last Login At"}),e.accessor("lastVisitAt",{header:"Last Visited At"})]})]},{header:"Additionals",columns:[e.group({id:"sub-group-additionals",columns:[e.accessor("tags",{header:"Tags"}),e.accessor("notes",{header:"Notes"})]})]}],defaultColumnSettings:S,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:50}}},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx(r,{...a})})})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
  render: args => <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <div className="bg-background pt-4">
            <DataTable {...args} />
          </div>
        </CardContent>
      </Card>
    </div>
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
  render: args => <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
  render: args => <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
  render: args => <div className="bg-muted w-full size-auto h-screen overflow-auto p-3">
      <Card className="h-auto size-max w-full">
        <CardContent>
          <DataTable {...args} />
        </CardContent>
      </Card>
    </div>
}`,...c.parameters?.docs?.source}}};const de=["Default","WithSubgroups","Advanced","AdvancedWith50users"];export{n as Advanced,c as AdvancedWith50users,i as Default,t as WithSubgroups,de as __namedExportsOrder,ue as default};
