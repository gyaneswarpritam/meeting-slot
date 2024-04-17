export async function POST(req, res) {
  try {
    const body = await req.json();
    const payload = JSON.stringify(body);

    const response = await fetch(
      `${process.env.SERVER_URL}/slotBooking/book-slot`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );
    const parsedResponse = await response.json();
    if (!parsedResponse?.success)
      return Response.status(500).json({
        success: false,
        error: parsedResponse?.message || "Something went wrong",
      });
    return Response.json({ success: true, message: parsedResponse?.message });
  } catch (err) {
    console.log(err);
    return Response.status(500).json({
      success: false,
      error: err?.message || "Something went wrong",
    });
  }
}
