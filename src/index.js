const express = require("express");
require("./db/mongoose");

const userRouters = require("./routers/user");
const taskRouters = require("./routers/task");
const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//     console.log(req.method, req.path)
// })

app.use(express.json());
app.use(userRouters);
app.use(taskRouters);

app.listen(port, () => {
  console.log("Server is up on the port " + port);
});
