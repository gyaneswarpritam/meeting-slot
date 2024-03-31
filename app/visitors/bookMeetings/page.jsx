"use client";
import React, { useState, useRef } from "react";
import { userDetails } from "@/models/visitor-data";
import "./bookmeeting.css";
import TimezoneSelect from "react-timezone-select";
import { tableData } from "@/models/visitor-data";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const user = userDetails;
  const [modelOpen, setModelOpen] = useState(false);
  const searchParams = useSearchParams();
  const titleParam = searchParams.get("title");
  const [title, setTitle] = useState(titleParam);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const timeslots = useRef(null);
  const tableDatas = tableData.bookings;
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
      field: "Date",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Time",
      field: "Time",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Timezone",
      field: "Timezone",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Exhibitor Company Name",
      field: "ExhibitorCompanyName",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Status",
      field: "Status",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
  ];
  const handleSelect = (e) => {
    timeslots.current.style.display = "block";
  };
  const handleBooking = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    setModelOpen(true);
  };

  const handleModelClose = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "unset";
    setModelOpen(false);
  };
  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    return shortDate;
  };
  const handleDateChange = (e) => {
    //event
  };
  return (
    <>
      <div className="mx-auto max-w-[1439px] container md:flex md:flex-row md:items-stretch md:justify-between relative">
        {modelOpen ? (
          <div className="w-full h-[100%] bg-[#000000af] fixed left-0 right-0 top-0 bottom-0 z-[1000] py-5 px-2 md:p-5">
            <div className=" rounded-[32px] relative overflow-hidden h-full bg-white pb-5">
              <div className=" headerDiv w-full h-20 flex flex-row gap-3 justify-between px-5 items-center bg-[#222222] text-white text-lg font-lato">
                <p className=" header text-xl font-lato font-bold">
                  My Bookings
                </p>
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
                {/* <p className=" header text-xl font-lato font-bold">
                  My Bookings
                </p>
                <div className=" w-full md:w-fit flex flex-row gap-7 justify-center items-center">
                  <button className=" text-black font-lato font-bold text-base w-full bg-brand-color rounded-lg px-5 py-4">
                    Book a Meeting
                  </button>
                  
                </div> */}
              </div>
              <div className=" w-full h-full px-2 md:px-8 bg-white rounded-b-[32px] pb-5">
                <div className="w-full min-h-fit h-full max-h-[90%] bg-white mt-5">
                  <div className="ag-theme-alpine pb-1 w-full h-full ">
                    <AgGridReact
                      style={{ width: "100%", height: "100%" }}
                      rowData={tableDatas}
                      columnDefs={tableColumnDef}
                      autoSizeColumns={true}
                    ></AgGridReact>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <section
          className="bg-bg-grey lg:w-[20%] md:min-h-screen lg:px-2 w-[0] side-bar-navi"
          id="side-bar"
        ></section>
        <section
          className="lg:pl-3 lg:pr-5 lg:py-5 bg-white lg:w-[80%] w-full no-scrollbar relative pt-20 md:pt-20 pb-5 md:pb-24 px-3 lg:min-h-screen overflow-y-auto flex flex-col gap-[1.25rem]"
          id="main-content-body"
        >
          <div className=" w-full h-full">
            <div className="w-full flex flex-row gap-5 flex-wrap justify-between bg-black rounded-t-2xl px-7 py-4">
              <div className=" w-full md:w-fit flex flex-row justify-start items-center gap-4">
                <p className=" font-bold font-quickSand text-base text-white">
                  Select <br /> Company
                </p>
                <select
                  value={title}
                  onChange={(e) => handleSelect(e)}
                  className=" h-[35px] rounded-lg w-full pl-3 pr-5 outline-none font-medium font-lato text-sm"
                  name="company"
                  id="company"
                >
                  <option selected hidden value="">
                    Please Select the Company
                  </option>
                  <option value="Texsyard international">
                    Texsyard international
                  </option>
                  <option value="Vansh Creation">Vansh Creation</option>
                  <option value="Woven World">Woven World</option>
                  <option value="Luxe Living">Luxe Living</option>
                  <option value="A.S.K.Hometex">A.S.K.Hometex</option>
                  <option value="Kerala State Coir Corporation">
                    Kerala State Coir Corporation
                  </option>
                </select>
              </div>
              <div className="  w-full md:w-fit flex flex-row justify-start items-center gap-4">
                <p className=" font-bold font-quickSand text-base text-white">
                  Select <br /> Date
                </p>
                <input
                  value={getCurrentDateInput()}
                  onChange={(e) => handleDateChange(e)}
                  className=" h-[35px] min-h-[35px] rounded-lg w-full min-w-[185px] px-3 outline-none font-medium font-lato text-sm"
                  type="date"
                  placeholder="dd/mm/yyyy"
                ></input>
              </div>
              <div className=" w-full md:w-fit flex flex-row justify-start items-center gap-4 md:max-w-[320px]">
                <p className=" font-bold font-quickSand text-base text-white">
                  Select
                  <br />
                  Timezone
                </p>
                <div className="h-[35px] w-full rounded-lg  min-w-[200px]">
                  <TimezoneSelect
                    className=" h-full w-full rounded-lg timezoneParent outline-none font-medium font-lato text-sm"
                    value={selectedTimezone}
                    onChange={setSelectedTimezone}
                  />
                </div>
              </div>
            </div>
            <div className=" bg-[#F5F5F5] rounded-b-2xl h-full w-full p-6">
              <div
                ref={timeslots}
                className={`${title == undefined ? "hidden" : ""}`}
              >
                <div className=" flex flex-row justify-end items-center gap-5">
                  <div className=" flex flex-row gap-1 justify-start items-center">
                    <div className="w-2 h-2 bg-[#4ABD5D] rounded-full"></div>
                    <p className=" font-quickSand text-xs font-semibold">
                      Slot Available
                    </p>
                  </div>
                  <div className=" flex flex-row gap-1 justify-start items-center">
                    <div className="w-2 h-2 bg-[#FB5151] rounded-full"></div>
                    <p className=" font-quickSand text-xs font-semibold">
                      Slot Booked
                    </p>
                  </div>
                  <div className=" flex flex-row gap-1 justify-start items-center">
                    <div className="w-2 h-2 bg-[#A7A7A7] rounded-full"></div>
                    <p className=" font-quickSand text-xs font-semibold">
                      Slot Expired
                    </p>
                  </div>
                </div>
                <div className=" flex flex-row flex-wrap gap-4 justify-start items-center mt-4">
                  <div className=" timeSelect available rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect expired rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect booked rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect available rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect expired rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect booked rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect available rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect expired rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect booked rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect available rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect expired rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect booked rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect available rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect expired rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect booked rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect available rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect expired rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className=" timeSelect booked rounded-lg border px-3 py-2">
                    <p className=" font-quickSand text-xs font-semibold">
                      15:00 - 16:00
                    </p>
                  </div>
                </div>
              </div>
              <div className=" mt-14 flex gap-6 w-full md:w-fit flex-col md:flex-row justify-start items-start md:items-center">
                <button
                  onClick={(e) => handleBooking(e)}
                  className=" p-4 font-lato font-bold text-base bg-[#1C1B20] text-white rounded-lg"
                >
                  Show My Bookings
                </button>
                <button className=" p-4 font-lato font-bold text-base bg-[#1C1B20] text-white rounded-lg">
                  Schhedule Another Meeting
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
