import{j as s}from"./iframe-Bo5RHwEg.js";import{g as j}from"./api-D4LlywOg.js";import{P as u,R as d}from"./row-selection-cell-Ca8u0PqM.js";import{D as r,i as x,c as T}from"./data-table-BHFS5p2l.js";import{C as D}from"./checkbox-1s58fICg.js";import{C as m,d as g}from"./card-BqwL6W5R.js";import{C as _,A as l}from"./applications-config-1KjFvSzf.js";import{a as P,f as k,e as R,m as O}from"./table-mock-GhrYp0Hz.js";import{B as I}from"./chunk-UVKPFVEO-BkyeNUaq.js";import"./preload-helper-Dp1pzeXC.js";import"./button-LL67ycaC.js";import"./index-RbvwN6yS.js";import"./action-button-AqBXW0n2.js";import"./dropdown-menu-CNHMOBVX.js";import"./index-BPXwU9V8.js";import"./circle-DGpyzQaM.js";import"./check-BTUcXPXF.js";import"./separator-BQApiWN0.js";import"./i18n-DKJ_1r2e.js";import"./isEqual--8XOxEnU.js";import"./settings-CitW0AZv.js";import"./skeleton-CMK30Ylq.js";import"./number-format-C7arjtbT.js";import"./pagination-BPPhTjpq.js";import"./select-Dz-cScQY.js";import"./index-CVme9-v_.js";import"./chevron-down-CdYojbEI.js";import"./chevron-up-CB7bZ0Yp.js";import"./ellipsis-IiHkbkmY.js";import"./empty-DNX6Mwiv.js";import"./index-CNE4WKYh.js";import"./index-BEwrDLtU.js";import"./badge-DdBcc0vZ.js";import"./x-8yNW3_6e.js";import"./search-uEi_CIGR.js";import"./chevron-right-C96-fGAu.js";import"./toString-CGsRiB-7.js";import"./empty-cell-CGZv2gMz.js";function o({table:a}){return s.jsx("div",{className:"flex items-center justify-center w-full",children:s.jsx(D,{checked:a.getIsAllPageRowsSelected()||a.getIsSomePageRowsSelected()&&"indeterminate",onCheckedChange:V=>a.toggleAllPageRowsSelected(!!V),"aria-label":"Select all"})})}o.__docgenInfo={description:"",methods:[],displayName:"RowSelectionHeader",props:{table:{required:!0,tsType:{name:"Table",elements:[{name:"any"}],raw:"Table<any>"},description:""}}};const e=T(),L=x([{id:"pinRow",visible:!0,label:"Pin Row",pinningPosition:"left",fixed:!0,variant:"ghost"},{id:"rowSelection",visible:!0,label:"Row Selection",pinningPosition:"left",fixed:!0},{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),y=x([{id:"pinRow",visible:!0,label:"Pin Row",fixed:!0,pinningPosition:"left",variant:"ghost"},{id:"rowSelection",visible:!0,label:"Row Selection",fixed:!0,pinningPosition:"left"},{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"email",visible:!0,label:"Email"},{id:"phoneNumber",visible:!0,label:"Phone Number"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"},{id:"hobbies",visible:!1,label:"Hobbies"},{id:"country",visible:!0,label:"Country"},{id:"city",visible:!0,label:"City"},{id:"accountCreatedAt",visible:!0,label:"Account Created At"},{id:"lastLoginAt",visible:!0,label:"Last Login At"},{id:"isActive",visible:!0,label:"Is Active"},{id:"role",visible:!0,label:"Role"},{id:"lastVisitAt",visible:!0,label:"Last Visit At"},{id:"preferredLanguage",visible:!0,label:"Preferred Language"},{id:"newsletterSubscribed",visible:!0,label:"Newsletter Subscribed"},{id:"themePreference",visible:!0,label:"Theme Preference"},{id:"tags",visible:!1,label:"Tags"},{id:"notes",visible:!1,label:"Notes"}]),G={variant_entity:{app_id:l.variant_entity},snv_occurrence:{app_id:l.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:l.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:l.admin},portal:{name:"",navigation:{}}},ze={title:"Tables/Data Table/HeadersGroup",component:r,args:{id:"storybook",columns:O,data:R,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:j.Asc}],onSortingChange:a=>{}},defaultColumnSettings:k,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[a=>s.jsx(I,{children:s.jsx(_,{config:G,children:s.jsx(a,{})})})]},i={args:{enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",columns:[{id:"pinRow",cell:u,size:10,maxSize:10,enableResizing:!1,enablePinning:!1},{id:"rowSelection",size:48,maxSize:48,header:a=>s.jsx(o,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),enableResizing:!1,enablePinning:!1}]},{header:"Group Left",size:400,minSize:200,columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]},{header:"Group Right",size:400,minSize:200,columns:[e.accessor("age",{header:()=>"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]}],defaultColumnSettings:L},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx("div",{className:"bg-background pt-4",children:s.jsx(r,{...a})})})})})},t={args:{data:R.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",columns:[e.group({id:"sub-group-actions",columns:[{id:"pinRow",cell:u,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(o,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"Group Left",columns:[e.group({id:"sub-group-left",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]})]},{header:"Group Right",columns:[e.group({header:"Sub Group",columns:[e.accessor("age",{header:()=>"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]}],defaultColumnSettings:L},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx(r,{...a})})})})},n={args:{data:P.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",size:96,columns:[e.group({id:"sub-group-user",columns:[{id:"pinRow",cell:u,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(o,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"User",columns:[e.group({header:"Name",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]}),e.accessor("email",{header:"Email"}),e.accessor("phoneNumber",{header:"Phone Number"})]},{header:"Statistics",columns:[e.group({id:"subgroup-statistics",columns:[e.accessor("age",{header:"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"}),e.accessor("hobbies",{header:"Hobbies"})]})]},{header:"Location",columns:[e.group({id:"subgroup-location",columns:[e.accessor("country",{header:"Country"}),e.accessor("city",{header:"City"})]})]},{header:"Account",columns:[e.group({id:"sub-group-account",columns:[e.accessor("isActive",{header:"Is Active"}),e.accessor("role",{header:"Role"}),e.accessor("preferredLanguage",{header:"Preferred Language"}),e.accessor("newsletterSubscribed",{header:"Newsletter Subscribed"}),e.accessor("themePreference",{header:"Theme Preference"}),e.accessor("accountCreatedAt",{header:"Account Created At"}),e.accessor("lastLoginAt",{header:"Last Login At"}),e.accessor("lastVisitAt",{header:"Last Visited At"})]})]},{header:"Additionals",columns:[e.group({id:"sub-group-additionals",columns:[e.accessor("tags",{header:"Tags"}),e.accessor("notes",{header:"Notes"})]})]}],defaultColumnSettings:y,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10}}},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx(r,{...a})})})})},c={args:{data:P,enableFullscreen:!0,enableColumnOrdering:!0,columns:[{id:"actions",size:96,columns:[e.group({id:"sub-group-user",columns:[{id:"pinRow",cell:u,size:48,maxSize:48,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:a=>s.jsx(o,{table:a.table}),cell:a=>s.jsx(d,{row:a.row}),size:48,maxSize:48,enableResizing:!1,enablePinning:!1}]})]},{header:"User",columns:[e.group({header:"Name",columns:[e.accessor("firstName",{cell:a=>a.getValue()}),e.accessor("lastName",{id:"lastName",cell:a=>a.getValue(),header:"Last Name"})]}),e.accessor("email",{header:"Email"}),e.accessor("phoneNumber",{header:"Phone Number"})]},{header:"Statistics",columns:[e.group({id:"subgroup-statistics",columns:[e.accessor("age",{header:"Age"}),e.accessor("visits",{header:"Visits"}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"}),e.accessor("hobbies",{header:"Hobbies"})]})]},{header:"Location",columns:[e.group({id:"subgroup-location",columns:[e.accessor("country",{header:"Country"}),e.accessor("city",{header:"City"})]})]},{header:"Account",columns:[e.group({id:"sub-group-account",columns:[e.accessor("isActive",{header:"Is Active"}),e.accessor("role",{header:"Role"}),e.accessor("preferredLanguage",{header:"Preferred Language"}),e.accessor("newsletterSubscribed",{header:"Newsletter Subscribed"}),e.accessor("themePreference",{header:"Theme Preference"}),e.accessor("accountCreatedAt",{header:"Account Created At"}),e.accessor("lastLoginAt",{header:"Last Login At"}),e.accessor("lastVisitAt",{header:"Last Visited At"})]})]},{header:"Additionals",columns:[e.group({id:"sub-group-additionals",columns:[e.accessor("tags",{header:"Tags"}),e.accessor("notes",{header:"Notes"})]})]}],defaultColumnSettings:y,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:50}}},render:a=>s.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:s.jsx(m,{className:"h-auto size-max w-full",children:s.jsx(g,{children:s.jsx(r,{...a})})})})};var p,b,h;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(h=(b=i.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var f,S,v;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(v=(S=t.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var C,w,H;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(H=(w=n.parameters)==null?void 0:w.docs)==null?void 0:H.source}}};var N,z,A;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(A=(z=c.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};const Ae=["Default","WithSubgroups","Advanced","AdvancedWith50users"];export{n as Advanced,c as AdvancedWith50users,i as Default,t as WithSubgroups,Ae as __namedExportsOrder,ze as default};
