import { type CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};

export default corsOptions;
