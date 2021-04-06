

const { urlencoded } = require("express");
const express = require("express");
const app = express();
const fs = require("fs");


app.set("view engine", "pug");

app.use(express.urlencoded({extended: false}))
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/new-blog", (req, res) => {
    res.render("new-blog")   
})



function id () {
    return "_" + Math.random().toString(36).substr(2, 9);
}

app.get("/api/v1/blogs", (req, res) => {
    fs.readFile("./data/blogs.json", (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.json(blogs)
    })
})


app.get("/blogs", (req, res) => {
    fs.readFile("./data/blogs.json", (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.render("blogs", {blogs: blogs})
    })

   
})

app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile("./data/blogs.json", (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id == id)[0]

        res.render("blog-detail",  {blog: blog} )

    })

})


app.post("/new-blog", (req, response) => {
    const title = req.body.title;
    const blogText = req.body.blogText;

    if (title.trim() === "" && blogText.trim() === "") {
        response.render("new-blog", {error: true})
    } else {
        fs.readFile("./data/blogs.json", (err, data) => {
            if (err) throw err;

            const allData = JSON.parse(data);

            allData.push({
                id: id(),
                title: title,
                blogText: blogText
            })

            fs.writeFile("./data/blogs.json", JSON.stringify(allData), (err) => {
                if (err) throw err

                response.render("new-blog", {success: true})
            })
        })
    }
})




app.listen(3000, err => {
    if (err) console.log(err);

    console.log("server is running on port 3000...");
})



