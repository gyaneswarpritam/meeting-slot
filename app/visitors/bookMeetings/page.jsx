"use client";
import { tableData, userDetails } from "@/models/visitor-data";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import moment from "moment-timezone";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TimezoneSelect from "react-timezone-select";
import "./bookmeeting.css";

const Page = () => {
  const user = userDetails;
  const [modelOpen, setModelOpen] = useState(false);
  const searchParams = useSearchParams();
  const [exhibitors, setExhibitors] = useState([]);
  const titleParam = searchParams.get("title");
  const [title, setTitle] = useState(titleParam);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [loading, setLoading] = useState(false);
  const [isBookedSlotOnCurrentDay, setIsBookedSlotOnCurrentDay] =
    useState(false);
  const [selectedExhibitorId, setSelectedExhibitorId] = useState();
  const [error, setError] = useState({ open: false, message: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const timeslots = useRef(null);
  const tableDatas = tableData.bookings;
  const [bookedSlots, setBookedSlots] = useState([]);
  const pathname = usePathname();
  const [slots, setSlots] = useState([]);
  const visitorId = "660b6f494b846ba88dcd3f1b"; //TODO
  const visitorName = "123";
  const [exhibitionDate, setExhibitionDate] = useState({});
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
  const validateBookingRequest = ({
    selectedTimezone,
    selectedExhibitorId,
    selectedDate,
  }) => {
    const timeZone =
      typeof selectedTimezone == "string"
        ? selectedTimezone
        : selectedTimezone?.value;
    let message = "";
    if (!timeZone) message = "Please Select Time Zone";
    if (!selectedExhibitorId) message = "Please Select a Company";
    if (!selectedDate) message = "Please Select a date";

    if (message) {
      setError({ open: true, message });
      return false;
    } else {
      setError({ open: false, message: "" });
      return true;
    }
  };
  const handleSelect = async (e) => {
    const id = e.target.value;
    setSelectedExhibitorId(id);
    if (!id) return;
    const isValid = validateBookingRequest({
      selectedTimezone,
      selectedExhibitorId: id,
      selectedDate,
    });
    if (isValid)
      fetchSlots({ selectedTimezone, selectedExhibitorId: id, selectedDate });
  };
  const fetchSlots = async ({
    selectedTimezone,
    selectedExhibitorId,
    selectedDate,
  }) => {
    try {
      setIsBookedSlotOnCurrentDay(false);
      setLoading(true);
      const timeZone =
        typeof selectedTimezone == "string"
          ? selectedTimezone
          : selectedTimezone?.value;
      const response = await fetch(
        `/api/list-booking-slots?timeZone=${timeZone}&id=${selectedExhibitorId}&date=${selectedDate}`
      );
      const parsedResponse = await response.json();
      if (!parsedResponse?.data?.slots?.length)
        setError({
          open: true,
          message: `No Slots available for Selected Options`,
        });
      const isBooked = parsedResponse?.data?.slots.find((item) => {
        return item?.visitorId === visitorId;
      });
      setIsBookedSlotOnCurrentDay(isBooked);
      setSlots(parsedResponse?.data?.slots || []);
      timeslots.current.style.display = "block";
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleBooking = async (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";

    const response = await fetch(
      `/api/list-booked-slots?visitorId=${visitorId}`
    );
    const parsedResponse = await response.json();
    setBookedSlots(parsedResponse?.bookings || []);
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
    setSelectedDate(e.target.value);
    const isValid = validateBookingRequest({
      selectedTimezone,
      selectedExhibitorId,
      selectedDate: e.target.value,
    });
    if (isValid)
      fetchSlots({
        selectedTimezone,
        selectedExhibitorId,
        selectedDate: e.target.value,
      });
  };

  useEffect(() => {
    // setSelectedDate(getCurrentDateInput());
  }, []);

  const fetchAllExhibitors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/list-exhibitors`);
      const parsedResponse = await response.json();
      setExhibitors(parsedResponse?.data?.exhibitors || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExhibitors();
  }, []);

  const handleSelectSlot = async (data) => {
    try {
      if (["pending", "booked"].includes(data?.status)) return;
      if (isBookedSlotOnCurrentDay) {
        setError({
          open: true,
          message: "Multiple bookings not allowed in a day",
        });
        return;
      }
      const timeZone =
        typeof selectedTimezone == "string"
          ? selectedTimezone
          : selectedTimezone?.value;
      const payload = {
        slotDate: data?.slotDate,
        eId: selectedExhibitorId,
        visitorId,
        time: data?.time,
        duration: data?.durationInMinutes,
        timeZone,
      };
      const response = await fetch(`/api/book-slot`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const parsedResponse = await response.json();
      setIsBookedSlotOnCurrentDay(true);
      //TODO handle
      fetchSlots({
        selectedTimezone,
        selectedExhibitorId,
        selectedDate,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleTimezoneChange = (timeZone) => {
    getExhibitionDate(timeZone);
    setSelectedTimezone(timeZone);
    fetchSlots({
      selectedTimezone: timeZone,
      selectedExhibitorId,
      selectedDate,
    });
  };

  const getExhibitionDate = async (selectedTimezone) => {
    try {
      const timeZone =
        typeof selectedTimezone == "string"
          ? selectedTimezone
          : selectedTimezone?.value;
      const response = await fetch(
        `/api/get-exhibition-date?timeZone=${timeZone}`
      );
      const parsedResponse = await response.json();
      setExhibitionDate(parsedResponse?.data);
    } catch (err) {
      console.log(err?.message);
    }
  };
  useEffect(() => {
    getExhibitionDate(selectedTimezone);
  }, []);

  const getSlotStyle = (data) => {
    let style = "";
    if (data?.visitorId == visitorId) {
      if (data?.status == "pending") {
        style = "pending";
      } else {
        style = "mySlot";
      }
    } else if (data?.status == "pending") {
      style = "booked";
    } else {
      style = data?.status;
    }
    // calculate today date time and convert it to utc
    //compare it with current datetime
    // if less style=expired
    const cDateTime = moment
      .tz(moment(new Date()), "UTC")
      .format("YYYY-MM-DDTHH:mm:ssZ");
    const isBig = moment(cDateTime).diff(moment(data?.time), "minutes");
    if (isBig > 0) style = "expired";
    return style;
  };
  useEffect(() => {}, []);

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
                      rowData={bookedSlots}
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
                  placeholder="Please Select the Company"
                  value={title}
                  onChange={(e) => handleSelect(e)}
                  className=" h-[35px] rounded-lg w-full pl-3 pr-5 outline-none font-medium font-lato text-sm"
                  name="company"
                  id="company"
                >
                  <option hidden value="">
                    Please Select the Company
                  </option>
                  <option value="">Select</option>
                  {exhibitors.length > 0 &&
                    exhibitors.map((data) => {
                      return (
                        <option value={data?._id}>{data?.companyName}</option>
                      );
                    })}
                </select>
              </div>
              <div className="  w-full md:w-fit flex flex-row justify-start items-center gap-4">
                <p className=" font-bold font-quickSand text-base text-white">
                  Select <br /> Date
                </p>
                <input
                  value={selectedDate}
                  min={exhibitionDate?.startDate}
                  max={exhibitionDate?.endDate}
                  onInput={(e) => handleDateChange(e)}
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
                    onChange={handleTimezoneChange}
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
                    <div className="w-2 h-2 bg-[#ffff] rounded-full"></div>
                    <p className=" font-quickSand text-xs font-semibold">
                      Slot Available
                    </p>
                  </div>
                  <div className=" flex flex-row gap-1 justify-start items-center">
                    <div className="w-2 h-2 bg-[#4ABD5D] rounded-full"></div>
                    <p className=" font-quickSand text-xs font-semibold">
                      You have booked this slot
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
                  <div className=" flex flex-row gap-1 justify-start items-center">
                    <div className="w-2 h-2 bg-[orange] rounded-full"></div>
                    <p className=" font-quickSand text-xs font-semibold">
                      Pending Approval
                    </p>
                  </div>
                </div>
                <div className=" flex flex-row flex-wrap gap-4 justify-start items-center mt-4">
                  {slots?.length > 0 &&
                    slots?.map((data) => {
                      return (
                        <div
                          className={` timeSelect 
                          ${getSlotStyle(data)} 
                          rounded-lg border px-3 py-2`}
                          onClick={() => handleSelectSlot(data)}
                        >
                          <p className=" font-quickSand text-xs font-semibold">
                            {data?.slotTiming}
                          </p>
                        </div>
                      );
                    })}
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
        {error?.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={error?.open}
            autoHideDuration={6000}
            onClose={() => setError({ open: false, message: "" })}
          >
            <Alert
              onClose={() => setError({ open: false, message: "" })}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error?.message}
            </Alert>
          </Snackbar>
        )}
        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            onClick={() => setLoading(false)}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
    </>
  );
};

export default Page;
