import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(
  session({
    secret: "change_this_later",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // change to true when deployed on Railway
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// TEMPORARY — we will replace this with a real hash later
const PASSWORD_HASH = "$2b$10$ZNDXuTpkwB/YoBA2fOuLsOzW8lKZv3kS6wyQNkdwgv35VKQhyb.X2";

app.post("/login", async (req, res) => {
  const { password } = req.body;

  const ok = await bcrypt.compare(password, PASSWORD_HASH);
  if (!ok) return res.status(401).json({ error: "Wrong password" });

  req.session.authenticated = true;
  res.json({ success: true });
});

app.get("/check", (req, res) => {
  res.json({ authenticated: !!req.session.authenticated });
});

app.listen(4000, () => console.log("Backend running on port 4000"));

