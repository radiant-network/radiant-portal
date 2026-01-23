import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{B as t}from"./button-KffE8qg4.js";import{P as o,j as s}from"./data-table-BzyhTKny.js";import{C as l}from"./checkbox-BUFo-vqr.js";function r({row:e}){return n.jsx("div",{className:"flex justify-center items-center",children:n.jsx(t,{iconOnly:!0,variant:"ghost",className:"overflow-clip text-muted-foreground size-6",onClick:()=>e.getIsPinned()?e.pin(!1):e.pin("top"),children:e.getIsPinned()?n.jsx(o,{}):n.jsx(s,{})})})}r.__docgenInfo={description:`@FIXME unused at the time
Config for TableColumnDef
{
  id: 'pinRow',
  cell: PinRowCell,
  size: 40,
  enableResizing: false,
  enablePinning: false,
},

Config for ColumnSettings
{
  id: 'pinRow',
  visible: true,
  fixed: true,
  pinningPosition: 'left',
},`,methods:[],displayName:"PinRowCell"};function a({row:e}){return n.jsx("div",{className:"flex items-center justify-center",children:n.jsx(l,{checked:e.getIsSelected(),onCheckedChange:i=>e.toggleSelected(!!i),"aria-label":"Select row"})})}a.__docgenInfo={description:"",methods:[],displayName:"RowSelectionCell",props:{row:{required:!0,tsType:{name:"Row",elements:[{name:"any"}],raw:"Row<any>"},description:""}}};export{r as P,a as R};
