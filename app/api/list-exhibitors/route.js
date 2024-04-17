export async function GET(req, res) {
  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/slotBooking/list-exhibitors`,
      {
        next: { revalidate: 1 },
      }
    );
    const parsedResponse = await response.json();
    if (!parsedResponse?.success)
      return Response.status(500).json({
        success: false,
        error: err?.message || "Something wen wrong",
      });
    return Response.json({ success: true, data: parsedResponse?.data });
  } catch (err) {
    console.error({ error: err });
    return Response.status(500).json({
      success: false,
      error: err?.message || "Something wen wrong",
    });
  }
}
