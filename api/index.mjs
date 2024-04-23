import express from "express";

const app = express();

app.use(express.static("../fe/public"))

app.listen(8000);