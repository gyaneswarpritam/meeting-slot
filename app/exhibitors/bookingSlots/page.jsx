"use client";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import Image from "next/image";

export default function Page(props) {
  const exbId = "660cc59e5a8047dc28fac00d"; //exhibitor id
  const [visitors, setVisitors] = useState([]);
  const handleClick = async (action, data) => {
    console.log(action, data);
    try {
      const payload = {
        dateId: data?.dateId,
        slotId: data?.slotId,
        eId: exbId,
        status: action == "approve" ? "booked" : "rejected",
      };
      const response = await fetch(`/api/change-status`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      getBookedVisitors();
    } catch (err) {
      console.log(err);
    }
  };
  const tableColumnDef = [
    {
      headerName: "Sr.No",
      field: "SerialNo",
      filter: true,
      flex: 1,
      minWidth: 100,
      maxWidth: 100,
      autoHeight: true,
    },
    {
      headerName: "Date",
      field: "date",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Time",
      field: "time",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Timezone",
      field: "bookedTimeZone",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Visitor Name",
      field: "name",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
    {
      cellRenderer: (params) => {
        return (
          <div
            style={{
              display:
                params?.node?.data?.status === "pending" ? "flex" : "none",
              justifyContent: "space-around",
            }}
          >
            <button
              style={{ color: "green" }}
              onClick={() => handleClick("approve", params.node.data)}
            >
              Approve
            </button>
            <button
              style={{ color: "red" }}
              onClick={() => handleClick("reject", params.node.data)}
            >
              Reject
            </button>
          </div>
        );
      },

      minWidth: 150,
      autoHeight: true,
    },
  ];
  const getBookedVisitors = async () => {
    const response = await fetch(`/api/list-booked-visitors?id=${exbId}`);
    const parsedResponse = await response.json();
    if (parsedResponse?.success) setVisitors(parsedResponse?.data);
  };
  useEffect(() => {
    getBookedVisitors();
  }, []);
  return (
    <div>
      <div className="w-full h-[100%] bg-[#000000af] fixed left-0 right-0 top-0 bottom-0 z-[1000] py-5 px-2 md:p-5">
        <div className=" rounded-[32px] relative overflow-hidden h-full bg-white pb-5">
          <div className=" headerDiv w-full h-20 flex flex-row gap-3 justify-between px-5 items-center bg-[#222222] text-white text-lg font-lato">
            <p className=" header text-xl font-lato font-bold">My Bookings</p>
            <div
              onClick={() => handleModelClose()}
              className=" w-auto h-5 aspect-square rounded-full bg-brand-color cursor-pointer flex justify-center items-center"
            >
              <Image
                alt="close"
                height={100}
                width={100}
                src="/visitor/close.svg"
                className="w-[60%] h-auto"
              ></Image>
            </div>
          </div>
          <div className=" w-full h-full px-2 md:px-8 bg-white rounded-b-[32px] pb-5">
            <div className="w-full min-h-fit h-full max-h-[90%] bg-white mt-5">
              <div className="ag-theme-alpine pb-1 w-full h-full ">
                <AgGridReact
                  style={{ width: "100%", height: "100%" }}
                  rowData={visitors}
                  columnDefs={tableColumnDef}
                  autoSizeColumns={true}
                ></AgGridReact>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
