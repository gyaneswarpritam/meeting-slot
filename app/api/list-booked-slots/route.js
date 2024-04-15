export async function GET(request, res) {
  try {
    const visitorId = request.nextUrl.searchParams.get("visitorId");
    if (!visitorId)
      return Response.json({
        success: false,
        message: "Visitor id cannot be empty",
      });
    const response = await fetch(
      `${process.env.SERVER_URL}/slotBooking/list-booked-slots?visitorId=${visitorId}`,
      {
        next: { revalidate: 0 },
      }
    );
    const parsedResponse = await response.json();
    if (!parsedResponse?.success)
      return Response.json({
        success: false,
        error: err?.message || "Something went wrong",
      });
    return Response.json({
      success: true,
      bookings: parsedResponse?.bookings || [],
    });
  } catch (err) {
    console.error({ error: err });
    return Response.json({
      success: false,
      error: err?.message || "Something went wrong",
    });
  }
}
