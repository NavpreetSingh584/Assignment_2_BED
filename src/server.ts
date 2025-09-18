import app, { API_PREFIX } from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}${API_PREFIX}`);
});
