export async function GET(request, res) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const timeZone = request.nextUrl.searchParams.get("timeZone");
    const date = request.nextUrl.searchParams.get("date");
    if (!id || !timeZone || !date)
      return Response.status(500).json({
        success: false,
        message: "missing required fields",
      });
    const response = await fetch(
      `${process.env.SERVER_URL}/slotBooking/list-slots?timeZone=${timeZone}&id=${id}&date=${date}`,
      {
        next: { revalidate: 1 },
      }
    );
    const parsedResponse = await response.json();
    if (!parsedResponse?.success)
      return Response.json({
        success: false,
        error: err?.message || "Something went wrong",
      });
    return Response.json({ success: true, data: parsedResponse?.data });
  } catch (err) {
    console.error({ error: err });
    return Response.status(500).json({
      success: false,
      error: err?.message || "Something went wrong",
    });
  }
}
