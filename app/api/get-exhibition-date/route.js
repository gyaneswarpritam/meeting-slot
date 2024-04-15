export async function GET(request, res) {
  try {
    const timeZone = request.nextUrl.searchParams.get("timeZone");
    if (!timeZone)
      return Response.json({
        success: false,
        message: "Timezone id cannot be empty",
      });
    const response = await fetch(
      `${process.env.SERVER_URL}/slotBooking/get-exhibitionDate?timeZone=${timeZone}`,
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
      data: parsedResponse?.data || [],
    });
  } catch (err) {
    console.error({ error: err });
    return Response.json({
      success: false,
      error: err?.message || "Something went wrong",
    });
  }
}
