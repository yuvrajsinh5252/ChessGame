const stockfihsAPI = "https://stockfish.online/api/stockfish.php";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams.toString();

  const response = await fetch(`${stockfihsAPI}?${params}`, {
    method: "GET",
  });

  const data = await response.text();
  return new Response(data);
}
