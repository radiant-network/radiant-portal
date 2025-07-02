type RequestIdCellProps = {
  children: any;
}

/** 
 * @TODO: Clicking on the Request ID will open the Case entity page OR will open a modal with the Request ID and general information about the request
*/
function RequestIdCell({ children }: RequestIdCellProps) {
  return <span>{children}</span>

}

export default RequestIdCell;
