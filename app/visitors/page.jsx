"use client";
import React, { useState } from "react";
// import SideNav from "@/components/side-nav";
import SideNav from "@/components/visitor/sideNav";

import LocationBand from "@/components/visitor/locationBand";
import { eventsAll, userDetails, stallCompletion } from "@/models/data";
import Image from "next/image";
import Link from "next/link";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import {
  breifcaseModel,
  profileModel,
  videoModel,
} from "@/models/exibitor-data";
import { tableData } from "@/models/visitor-data";
import "./visitor.css";
import Model from "@/components/visitor/model";

function Page() {
  const tableDatas = tableData.datas;
  const [tableOpen, setTableOpen] = useState(false);
  const [tableName, setTableName] = useState("");

  const handleTable = (e) => {
    setTableName(e);
    setTableOpen(true);
  };
  const handleTableClose = () => {
    setTableOpen(false);
  };
  const tableColumnDef = [
    {
      headerName: "Exibitor's Name",
      field: "name",
      filter: true,
      minWidth: 300,
      flex: 1,
      minWidth: 300,
      autoHeight: true,
    },
    {
      headerName: "Matching Scores",
      field: "score",
      filter: true,
      minWidth: 200,
      cellRenderer: (params) => {
        const value = tableDatas[params.rowIndex].score;
        return (
          <div className=" w-12 h-12 rounded-full flex justify-center items-center border-4 border-brand-color">
            <p>{value}</p>
          </div>
        );
      },
      flex: 1,
      minWidth: 150,
      autoHeight: true,
    },
    {
      headerName: "View Stall",
      field: "stallLink",
      filter: true,
      minWidth: 200,
      cellRenderer: (params) => {
        const value = tableDatas[params.rowIndex].stallLink;
        return (
          <Link
            href={value}
            className=" flex flex-col justify-center items-center gap-1"
          >
            <Image
              alt="stall"
              width={200}
              height={200}
              src="/visitor/TableStallIcon.svg"
              className="h-auto w-5 mx-auto my-auto cursor-pointer"
              // onClick={() => yotubeIconClick(value)}
            />
            <p className=" font-lato font-bold text-xs">Visit Stall</p>
          </Link>
        );
      },
      flex: 1,
      minWidth: 150,
      autoHeight: true,
    },
  ];
  const user = userDetails;
  const datas = {
    datasets: [
      {
        label: "# of Votes",
        data: [3, 1],
        backgroundColor: ["#2A9FE8", "#fff0"],
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };
  const data1 = {
    datasets: [
      {
        label: "# of Votes",
        data: [1, 3],
        backgroundColor: ["#fff0", "#AA2AE8"],
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    cutout: "90%",
    responsive: true,
    maintainaspectratio: true,
  };

  return (
    <main className="custom-color-bg">
      <div className="mx-auto max-w-[1439px] container md:flex md:flex-row md:items-stretch md:justify-between overflow-hidden">
        <section
          className="bg-bg-grey lg:w-[20%] md:min-h-screen px-2 lg:px-2 w-[0] side-bar-navi"
          id="side-bar"
        >
          <SideNav userDetails={user} />
        </section>
        <section
          className="lg:pl-3 lg:pr-5 lg:py-5 bg-white lg:w-[80%] w-full relative pt-20 md:pt-20 pb-5 md:pb-24 px-3 lg:min-h-screen overflow-y-auto flex flex-col gap-[1.25rem]"
          id="main-content-body"
        >
          <LocationBand></LocationBand>
          {tableOpen ? (
            <Model value={tableName} change={handleTableClose}></Model>
          ) : (
            <div>
              <div className="flex md:flex-row flex-col flex-wrap mt-5 justify-evenly items-center md:gap-0 gap-4 w-full boxes-main px-6 py-12">
                <div
                  className="max-w-[204px] w-[80%] cursor-pointer	relative"
                  onClick={(e) => handleTable("stallVisitors")}
                >
                  <Doughnut data={datas} options={options}></Doughnut>
                  <div className=" w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-8 h-8"
                      src="/view.svg"
                    ></Image>
                    <p className="text-sm font-quickSand font-bold text-[#707070]">
                      Stall Visitors
                    </p>
                    <p className=" font-quickSand font-bold text-3xl text-black">
                      56
                    </p>
                  </div>
                </div>
                <div className=" flex flex-col justify-center items-center">
                  <p className=" font-lato font-bold text-xl">
                    Recent Analytics
                  </p>
                  <p className=" font-lato font-bold text-xsl">
                    Until 12-12-2023
                  </p>
                </div>
                <div
                  className="max-w-[204px] w-[80%] cursor-pointer relative"
                  onClick={(e) => handleTable("requestedCatalogues")}
                >
                  <Doughnut data={data1} options={options}></Doughnut>
                  <div className=" w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-8 h-8"
                      src="/menu.svg"
                    ></Image>
                    <p className="text-sm font-quickSand font-bold text-[#707070]">
                      Requested Catalogues
                    </p>
                    <p className=" font-quickSand font-bold text-3xl text-black">
                      543
                    </p>
                  </div>
                </div>
              </div>
              <div className=" mt-5">
                <p className=" font-lato text-center font-bold text-xl">
                  AI Based Matching
                </p>
                {/* <div>
              <AgGridReact
                rowData={tableDatas}
                columnDefs={tableColumnDef}
                rowHeight={50}
                autoSizeColumns={true}
              ></AgGridReact>
            </div> */}
                <div className="w-full h-[100vh] min-h-[100vh] relative bottom-0 bg-white mx-auto my-auto flex flex-col mt-5 rounded-lg overflow-hidden">
                  <div className="ag-theme-alpine gridContainer pb-1 w-full h-full min-h-[20rem] ">
                    <AgGridReact
                      rowData={tableDatas}
                      columnDefs={tableColumnDef}
                      autoSizeColumns={true}
                    ></AgGridReact>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Page;
