const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Do you have a story to tell or knowledge to share? We welcome guest contributors who can enrich our platform with fresh perspectives and insightful content. If you're passionate about writing and have something valuable. Our Blog Website is your go-to destination for articles that are both informative and inspiring. Whether you're a curious learner, a tech enthusiast, a travel lover, or someone who enjoys a good story, we have something for everyone.";
const aboutContent = "Welcome to our vibrant and dynamic blog website! Here, we curate an eclectic mix of thought-provoking articles, captivating stories, and informative pieces that cater to a wide range of interests and passions. Our platform boasts an impressive team of talented writers, each experts in their respective fields, ensuring that you'll always find something that resonates with you. Whether you're a curious learner, a tech enthusiast, a travel lover, or someone seeking personal growth and inspiration, we've got you covered. Our mission is to provide a space where knowledge and creativity thrive, fostering a supportive community that engages in meaningful discussions and shares in the joy of discovering new perspectives. So come on in, join our community, and embark on an enriching journey of learning and inspiration. Welcome to a world of limitless possibilities!";
const contactContent = "Email: sindhugarlapati13@gmail.com ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sindhugarlapati13:Sindhu13@cluster0.cdlp5tg.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

// Function to fetch all posts
async function getAllPosts() {
  try {
    return await Post.find({});
  } catch (err) {
    throw err;
  }
}

// Function to fetch a single post by its ID
async function getPostById(postId) {
  try {
    return await Post.findOne({ _id: postId });
  } catch (err) {
    throw err;
  }
}

app.get("/", async function (req, res) {
  try {
    const posts = await getAllPosts();
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/compose", async function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/posts/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await getPostById(requestedPostId);
    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
app.listen(8080, function () {
  console.log("Server started on port 8080");
});
