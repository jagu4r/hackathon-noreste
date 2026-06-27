const port = 8080;
const server = Bun.serve({
  port: port,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = "." + url.pathname;
    if (url.pathname === "/") {
      filePath = "./index.html";
    }
    
    try {
      const file = Bun.file(filePath);
      const exists = await file.exists();
      if (exists) {
        return new Response(file);
      }
    } catch (e) {}

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${port}/`);
