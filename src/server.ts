// src/server.ts
import app, { API_PREFIX } from "./app";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${API_PREFIX}`);
});
