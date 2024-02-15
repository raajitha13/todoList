const mongoose = require("mongoose");

mongoose
.connect("mongodb://127.0.0.1:27017/playground")
.then(() => console.log("connected..."))
.catch((err) => console.log("could not connect to mongo db", err));

const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  ispublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

function createCourse() {
  const course = new Course({
    name: "node js course",
    author: "rudhresh",
    tags: ["node", "backend"],
    ispublished: true,
  });
  
  const result = course.save();
  console.log(result);
}

createCourse();