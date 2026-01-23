import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{b as pe}from"./api-DEOfkrPC.js";import{F as ce}from"./case-exploration-table-filters-DzNQ-pXc.js";import{P as de,R as ue}from"./row-selection-cell-DEAfHrkl.js";import{j as ge,h as he,D as s}from"./data-table-C-mw8sPI.js";import{C as fe}from"./checkbox-BUFo-vqr.js";import{C as be,d as xe}from"./card-Cyh3E19J.js";import{C as Se,A as t}from"./applications-config-3OOAo44D.js";import{d as n}from"./table-mock-DUtY5NyB.js";import{B as Ne}from"./chunk-EPOLDU6W-BBQlfikL.js";import"./index-CBYaBgW8.js";import"./api-DEVU8Hba.js";import"./index-lnksFm0-.js";import"./filter-button-BfGjZHXe.js";import"./badge-B8JYzoyf.js";import"./index-C66Dxnp2.js";import"./utils-CDN07tui.js";import"./separator-ChZWIdMg.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";import"./button-DuGQaf_2.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./index-DnEzm5An.js";import"./check-DSe_yRo5.js";import"./button.variants-Du9eY_ux.js";import"./spinner-DMuui_2m.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-Del9GD9I.js";import"./iframe-CbKYlaVz.js";import"./i18next-CYn7LYXT.js";import"./command-CqDCn1-N.js";import"./index-Cq0TEE3l.js";import"./dialog-TAP2eCwF.js";import"./popover-CV3rAFUt.js";import"./search-DKmUqS9g.js";import"./skeleton-_T1otFf0.js";import"./test-tube-diagonal-Dy9u_yEx.js";import"./user-3oWHM7_v.js";import"./priority-indicator-seqrLImM.js";import"./indicator-CdtPwwNK.js";import"./shape-triangle-up-icon-CLEWE8Su.js";import"./refresh-ccw-CVzmjQM2.js";import"./pen-BSZDi--G.js";import"./isEqual-BlEvgNkC.js";import"./settings-Dw4TSVKU.js";import"./number-format-D6gxQ_H-.js";import"./pagination-g6rbvaVY.js";import"./select-DnbErV3f.js";import"./index-SF2qmtPV.js";import"./chevron-down-DOuPo75j.js";import"./chevron-up-C0Hb7JXF.js";import"./ellipsis-RxOQoOKc.js";import"./empty-LncwPSrD.js";import"./chart-scatter-DVTaxjlK.js";import"./circle-alert-DTyzftz0.js";import"./chevron-right-BONyyZTy.js";function N({table:e}){return a.jsx("div",{className:"flex items-center justify-center w-full",children:a.jsx(fe,{checked:e.getIsAllPageRowsSelected()||e.getIsSomePageRowsSelected()&&"indeterminate",onCheckedChange:me=>e.toggleAllPageRowsSelected(!!me),"aria-label":"Select all"})})}N.__docgenInfo={description:"",methods:[],displayName:"RowSelectionHeader",props:{table:{required:!0,tsType:{name:"Table",elements:[{name:"any"}],raw:"Table<any>"},description:""}}};const r=he(),je={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Ia={title:"Tables/Data Table",component:s,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>a.jsx("i",{children:e.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:n,serverOptions:{defaultSorting:[{field:"pf_wgs",order:pe.Asc}],onSortingChange:e=>{}},defaultColumnSettings:ge([{id:"pinRow",visible:!0,variant:"ghost"},{id:"rowSelection",visible:!0,variant:"ghost"},{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>a.jsx(Ne,{children:a.jsx(Se,{config:je,children:a.jsx(e,{})})})]},o={args:{loadingStates:{list:!0,total:!0}},render:e=>a.jsx(s,{...e})},l={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>a.jsx(s,{...e})},i={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>a.jsx(s,{...e})},c={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>a.jsx(s,{...e})},d={args:{loadingStates:{list:!1,total:!1},data:n,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:()=>a.jsx(ce,{loading:!1,setSearchCriteria:()=>{}})},render:e=>a.jsx(s,{...e})},u={args:{enableFullscreen:!0},render:e=>a.jsxs("div",{children:[a.jsx("span",{children:a.jsx("i",{children:'Use "Open in new canvas" button at the top right of the screen a better preview'})}),a.jsx(s,{...e})]})},m={args:{data:n.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>a.jsx(s,{...e})},p={args:{data:n.slice(0,1),total:1,TableFilters:()=>a.jsx(ce,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:"bottom"},render:e=>a.jsx(s,{...e})},g={args:{pagination:{type:"hidden"}},render:e=>a.jsx(s,{...e})},h={args:{pagination:{type:"locale",state:{pageIndex:0,pageSize:5}}},render:e=>a.jsx(s,{...e})},f={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[r.accessor("firstName",{id:"firstName",cell:e=>e.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>a.jsx("i",{children:e.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),r.accessor("age",{id:"age",header:()=>"Age",cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>a.jsx(a.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:"extent",enableGrouping:!0}),r.accessor("visits",{id:"visits",header:()=>a.jsx("span",{children:"Visits"}),aggregationFn:"sum"}),r.accessor("status",{id:"status",header:"Status",getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),r.accessor("progress",{id:"progress",header:"Profile Progress",cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:"mean",aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>a.jsxs(a.Fragment,{children:[a.jsxs("span",{children:["You can group by ",a.jsx("b",{children:"status"})]}),a.jsx(s,{...e})]})},b={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{header:"Group Left",size:400,minSize:200,columns:[{id:"pinRow",cell:de,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:e=>a.jsx(N,{table:e.table}),cell:e=>a.jsx(ue,{row:e.row}),enableResizing:!1,enablePinning:!1},r.accessor("firstName",{cell:e=>e.getValue()}),r.accessor("lastName",{id:"lastName",cell:e=>e.getValue(),header:"Last Name"})]},{header:"Group Right",size:400,minSize:200,columns:[r.accessor("age",{header:()=>"Age"}),r.accessor("visits",{header:"Visits"}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})]}]},render:e=>a.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:a.jsx(be,{className:"h-auto size-max w-full",children:a.jsx(xe,{children:a.jsx("div",{className:"bg-background pt-4",children:a.jsx(s,{...e})})})})})},x={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[{header:"Group Left",columns:[r.group({id:"sub-group-left",columns:[{id:"pinRow",cell:de,enableResizing:!1,enablePinning:!1},{id:"rowSelection",header:e=>a.jsx(N,{table:e.table}),cell:e=>a.jsx(ue,{row:e.row}),enableResizing:!1,enablePinning:!1},r.accessor("firstName",{cell:e=>e.getValue()}),r.accessor("lastName",{id:"lastName",cell:e=>e.getValue(),header:"Last Name"})]})]},{header:"Group Right",columns:[r.group({header:"Sub Group",columns:[r.accessor("age",{header:()=>"Age"}),r.accessor("visits",{header:"Visits"}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})]})]}]},render:e=>a.jsx(s,{...e})},S={args:{columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>a.jsx("span",{children:"First Name"}),footer:()=>a.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>a.jsx("i",{children:e.getValue()}),header:()=>a.jsx("span",{children:"Last Name"}),footer:()=>a.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue(),footer:()=>a.jsx("span",{children:"Age"})}),r.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"}),footer:()=>a.jsx("span",{children:"First Name"})}),r.accessor("status",{header:"Status",footer:()=>a.jsx("span",{children:"Status"})}),r.accessor("progress",{header:"Profile Progress",footer:()=>a.jsx("span",{children:"Profile Progress"})})]},render:e=>a.jsx(s,{...e})};var j,C,w;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    }
  },
  render: args => <DataTable {...args} />
}`,...(w=(C=o.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var F,P,v;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: []
  },
  render: args => <DataTable {...args} />
}`,...(v=(P=l.parameters)==null?void 0:P.docs)==null?void 0:v.source}}};var R,H,V;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    hasError: true
  },
  render: args => <DataTable {...args} />
}`,...(V=(H=i.parameters)==null?void 0:H.docs)==null?void 0:V.source}}};var T,D,y;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...(y=(D=c.parameters)==null?void 0:D.docs)==null?void 0:y.source}}};var G,L,z;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data,
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />
  },
  render: args => <DataTable {...args} />
}`,...(z=(L=d.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var O,A,_;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <div>
      <span>
        <i>Use &quot;Open in new canvas&quot; button at the top right of the screen a better preview</i>
      </span>
      <DataTable {...args} />
    </div>
}`,...(_=(A=u.parameters)==null?void 0:A.docs)==null?void 0:_.source}}};var I,$,k;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...(k=($=m.parameters)==null?void 0:$.docs)==null?void 0:k.source}}};var E,B,M;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTable {...args} />
}`,...(M=(B=p.parameters)==null?void 0:B.docs)==null?void 0:M.source}}};var q,U,W;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'hidden'
    }
  },
  render: args => <DataTable {...args} />
}`,...(W=(U=g.parameters)==null?void 0:U.docs)==null?void 0:W.source}}};var Y,J,K;h.parameters={...h.parameters,docs:{...(Y=h.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'locale',
      state: {
        pageIndex: 0,
        pageSize: 5
      }
    }
  },
  render: args => <DataTable {...args} />
}`,...(K=(J=h.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,Z;f.parameters={...f.parameters,docs:{...(Q=f.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [columnHelper.accessor('firstName', {
      id: 'firstName',
      cell: info => info.getValue(),
      header: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      id: 'age',
      header: () => 'Age',
      cell: info => info.renderValue(),
      aggregatedCell: ({
        getValue
      }) => <>{\`[\${getValue()[0]}-\${getValue()[1]}]\`}</>,
      aggregationFn: 'extent',
      enableGrouping: true
    }), columnHelper.accessor('visits', {
      id: 'visits',
      header: () => <span>Visits</span>,
      aggregationFn: 'sum'
    }), columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      getGroupingValue: row => \`Group By \${row.status}\`,
      enableGrouping: true
    }), columnHelper.accessor('progress', {
      id: 'progress',
      header: 'Profile Progress',
      cell: ({
        getValue
      }) => \`\${Math.round(getValue<number>() * 100) / 100}%\`,
      aggregationFn: 'mean',
      aggregatedCell: ({
        getValue
      }) => \`~\${Math.round(getValue<number>() * 100) / 100}%\`
    })] as TableColumnDef<MockData, any>[]
  },
  render: args => <>
      <span>
        You can group by <b>status</b>
      </span>
      <DataTable {...args} />
    </>
}`,...(Z=(X=f.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,ae,re;b.parameters={...b.parameters,docs:{...(ee=b.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [{
      header: 'Group Left',
      size: 400,
      minSize: 200,
      columns: [{
        id: 'pinRow',
        cell: PinRowCell,
        enableResizing: false,
        enablePinning: false
      }, {
        id: 'rowSelection',
        header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
        cell: info => <RowSelectionCell row={info.row} />,
        enableResizing: false,
        enablePinning: false
      }, columnHelper.accessor('firstName', {
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
    }] as TableColumnDef<MockData, any>[]
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
}`,...(re=(ae=b.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var se,ne,te;x.parameters={...x.parameters,docs:{...(se=x.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [{
      header: 'Group Left',
      columns: [columnHelper.group({
        id: 'sub-group-left',
        columns: [{
          id: 'pinRow',
          cell: PinRowCell,
          enableResizing: false,
          enablePinning: false
        }, {
          id: 'rowSelection',
          header: (header: HeaderContext<any, Occurrence>) => <RowSelectionHeader table={header.table} />,
          cell: info => <RowSelectionCell row={info.row} />,
          enableResizing: false,
          enablePinning: false
        }, columnHelper.accessor('firstName', {
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
    }] as TableColumnDef<MockData, any>[]
  },
  render: args => <DataTable {...args} />
}`,...(te=(ne=x.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var oe,le,ie;S.parameters={...S.parameters,docs:{...(oe=S.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    columns: [columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      header: () => <span>First Name</span>,
      footer: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>,
      footer: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      header: () => 'Age',
      cell: info => info.renderValue(),
      footer: () => <span>Age</span>
    }), columnHelper.accessor('visits', {
      header: () => <span>Visits</span>,
      footer: () => <span>First Name</span>
    }), columnHelper.accessor('status', {
      header: 'Status',
      footer: () => <span>Status</span>
    }), columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: () => <span>Profile Progress</span>
    })]
  },
  render: args => <DataTable {...args} />
}`,...(ie=(le=S.parameters)==null?void 0:le.docs)==null?void 0:ie.source}}};const $a=["Loading","Empty","Error","Default","DefaultTableFilters","Fullscreen","LessThan10Results","DataTableFiltersAndLessThan10Results","PaginationHidden","PaginationLocale","GroupBy","HeaderGroups","HeaderGroupsWithSubgroup","Footer"];export{p as DataTableFiltersAndLessThan10Results,c as Default,d as DefaultTableFilters,l as Empty,i as Error,S as Footer,u as Fullscreen,f as GroupBy,b as HeaderGroups,x as HeaderGroupsWithSubgroup,m as LessThan10Results,o as Loading,g as PaginationHidden,h as PaginationLocale,$a as __namedExportsOrder,Ia as default};
