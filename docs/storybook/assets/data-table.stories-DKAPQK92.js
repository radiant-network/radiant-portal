import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as te}from"./api-D_2xklaw.js";import{F as ne}from"./case-exploration-table-filters-BI50utzJ.js";import{h as oe,i as le,D as s}from"./data-table-COmGnNHe.js";import{C as ie,A as t}from"./applications-config-3OOAo44D.js";import{d as n}from"./table-mock-DUtY5NyB.js";import{B as ce}from"./chunk-EPOLDU6W-BBQlfikL.js";import"./index-CBYaBgW8.js";import"./api-DxU0s23E.js";import"./index-lnksFm0-.js";import"./filter-button-BCKc6rCJ.js";import"./badge-Bvz88wlt.js";import"./index-C66Dxnp2.js";import"./utils-CDN07tui.js";import"./separator-ChZWIdMg.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";import"./button-CbhBcUjT.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./index-DnEzm5An.js";import"./check-DSe_yRo5.js";import"./button.variants-Du9eY_ux.js";import"./spinner-DMuui_2m.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-DrzVMC28.js";import"./iframe-D6YBQgaz.js";import"./i18next-CYn7LYXT.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./command-CqDCn1-N.js";import"./index-Cq0TEE3l.js";import"./dialog-TAP2eCwF.js";import"./popover-CV3rAFUt.js";import"./search-DKmUqS9g.js";import"./skeleton-_T1otFf0.js";import"./test-tube-diagonal-Dy9u_yEx.js";import"./user-3oWHM7_v.js";import"./priority-indicator-Cm4X6_n8.js";import"./indicator-CdtPwwNK.js";import"./shape-triangle-up-icon-CLEWE8Su.js";import"./refresh-ccw-CVzmjQM2.js";import"./pen-BSZDi--G.js";import"./isEqual-BlEvgNkC.js";import"./settings-Dw4TSVKU.js";import"./number-format-D6gxQ_H-.js";import"./card-Cyh3E19J.js";import"./pagination-CrSq-9iD.js";import"./select-DnbErV3f.js";import"./chevron-down-DOuPo75j.js";import"./chevron-up-C0Hb7JXF.js";import"./ellipsis-RxOQoOKc.js";import"./empty-LncwPSrD.js";import"./chart-scatter-DVTaxjlK.js";import"./circle-alert-DTyzftz0.js";import"./chevron-right-BONyyZTy.js";const a=le(),pe={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Cr={title:"Tables/Data Table",component:s,args:{id:"storybook",columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),a.accessor("status",{header:"Status"}),a.accessor("progress",{header:"Profile Progress"})],data:n,serverOptions:{defaultSorting:[{field:"pf_wgs",order:te.Asc}],onSortingChange:e=>{}},defaultColumnSettings:oe([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>r.jsx(ce,{children:r.jsx(ie,{config:pe,children:r.jsx(e,{})})})]},o={args:{loadingStates:{list:!0,total:!0}},render:e=>r.jsx(s,{...e})},l={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>r.jsx(s,{...e})},i={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>r.jsx(s,{...e})},c={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{...e})},p={args:{loadingStates:{list:!1,total:!1},data:n,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:()=>r.jsx(ne,{loading:!1,setSearchCriteria:()=>{}})},render:e=>r.jsx(s,{...e})},d={args:{enableFullscreen:!0},render:e=>r.jsxs("div",{children:[r.jsx("span",{children:r.jsx("i",{children:'Use "Open in new canvas" button at the top right of the screen a better preview'})}),r.jsx(s,{...e})]})},u={args:{data:n.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{...e})},m={args:{data:n.slice(0,1),total:1,TableFilters:()=>r.jsx(ne,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:"bottom"},render:e=>r.jsx(s,{...e})},g={args:{pagination:{type:"hidden"}},render:e=>r.jsx(s,{...e})},h={args:{pagination:{type:"locale",state:{pageIndex:0,pageSize:5}}},render:e=>r.jsx(s,{...e})},f={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.accessor("firstName",{id:"firstName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{id:"age",header:()=>"Age",cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>r.jsx(r.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:"extent",enableGrouping:!0}),a.accessor("visits",{id:"visits",header:()=>r.jsx("span",{children:"Visits"}),aggregationFn:"sum"}),a.accessor("status",{id:"status",header:"Status",getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),a.accessor("progress",{id:"progress",header:"Profile Progress",cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:"mean",aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>r.jsxs(r.Fragment,{children:[r.jsxs("span",{children:["You can group by ",r.jsx("b",{children:"status"})]}),r.jsx(s,{...e})]})},b={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[a.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),a.group({header:"group_2",columns:[a.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),a.group({header:"More Info",columns:[a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),a.accessor("status",{header:"Status"}),a.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(s,{...e})},x={args:{columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"}),footer:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue(),footer:()=>r.jsx("span",{children:"Age"})}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor("status",{header:"Status",footer:()=>r.jsx("span",{children:"Status"})}),a.accessor("progress",{header:"Profile Progress",footer:()=>r.jsx("span",{children:"Profile Progress"})})]},render:e=>r.jsx(s,{...e})};var F,j,N;o.parameters={...o.parameters,docs:{...(F=o.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    }
  },
  render: args => <DataTable {...args} />
}`,...(N=(j=o.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};var S,V,v;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: []
  },
  render: args => <DataTable {...args} />
}`,...(v=(V=l.parameters)==null?void 0:V.docs)==null?void 0:v.source}}};var T,P,C;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    hasError: true
  },
  render: args => <DataTable {...args} />
}`,...(C=(P=i.parameters)==null?void 0:P.docs)==null?void 0:C.source}}};var H,D,y;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...(y=(D=c.parameters)==null?void 0:D.docs)==null?void 0:y.source}}};var L,_,O;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(O=(_=p.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var A,G,w;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <div>
      <span>
        <i>Use &quot;Open in new canvas&quot; button at the top right of the screen a better preview</i>
      </span>
      <DataTable {...args} />
    </div>
}`,...(w=(G=d.parameters)==null?void 0:G.docs)==null?void 0:w.source}}};var I,R,$;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...($=(R=u.parameters)==null?void 0:R.docs)==null?void 0:$.source}}};var E,M,B;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTable {...args} />
}`,...(B=(M=m.parameters)==null?void 0:M.docs)==null?void 0:B.source}}};var k,z,q;g.parameters={...g.parameters,docs:{...(k=g.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'hidden'
    }
  },
  render: args => <DataTable {...args} />
}`,...(q=(z=g.parameters)==null?void 0:z.docs)==null?void 0:q.source}}};var U,Y,J;h.parameters={...h.parameters,docs:{...(U=h.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(J=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:J.source}}};var K,Q,W;f.parameters={...f.parameters,docs:{...(K=f.parameters)==null?void 0:K.docs,source:{originalSource:`{
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
}`,...(W=(Q=f.parameters)==null?void 0:Q.docs)==null?void 0:W.source}}};var X,Z,ee;b.parameters={...b.parameters,docs:{...(X=b.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [columnHelper.group({
      id: 'group_1',
      header: () => <span>Group 1</span>,
      columns: [columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id
      }), columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id
      })]
    }), columnHelper.group({
      header: 'group_2',
      columns: [columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id
      }), columnHelper.group({
        header: 'More Info',
        columns: [columnHelper.accessor('visits', {
          header: () => <span>Visits</span>
        }), columnHelper.accessor('status', {
          header: 'Status'
        }), columnHelper.accessor('progress', {
          header: 'Profile Progress'
        })]
      })]
    })] as TableColumnDef<MockData, any>[]
  },
  render: args => <DataTable {...args} />
}`,...(ee=(Z=b.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var re,ae,se;x.parameters={...x.parameters,docs:{...(re=x.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(se=(ae=x.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};const Hr=["Loading","Empty","Error","Default","DefaultTableFilters","Fullscreen","LessThan10Results","DataTableFiltersAndLessThan10Results","PaginationHidden","PaginationLocale","GroupBy","HeaderGroups","Footer"];export{m as DataTableFiltersAndLessThan10Results,c as Default,p as DefaultTableFilters,l as Empty,i as Error,x as Footer,d as Fullscreen,f as GroupBy,b as HeaderGroups,u as LessThan10Results,o as Loading,g as PaginationHidden,h as PaginationLocale,Hr as __namedExportsOrder,Cr as default};
