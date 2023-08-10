const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//  GET
//  home
// Routes
// router.get("", (req,res) =>{
//         const locals = {
//             title:"Anasua's Blog",
//             description :"Simple blog crated with NodeJs, Express, MongoDB"
//         }
//         res.render('index', {locals});
// })

// GET
// Home route with async(with pagination)
router.get("", async (req,res) =>{
   try{
    const locals = {
        title:"Anasua's Blog",
        description :"Simple blog crated with NodeJs, Express, MongoDB"
    }
   let perPage = 5;
   let page = req.query.page || 1;

   const data = await Post.aggregate([{ $sort: {createdAt:-1}}])
   .skip(perPage * page - perPage )
   .limit(perPage)
   .exec();

   const count  = await Post.count();
   const nextPage= parseInt(page) + 1;
   const hasNextPage = nextPage <=Math.ceil(count /perPage);

    res.render('index', {
        locals,
        data,
        current: page,
        nextPage:hasNextPage  ? nextPage : null,
        currentRoute: '/'
    });

}catch(error){
 console.log(error);
}   
});
// GET
// Home route with async(without pagination)
// router.get("", async (req,res) =>{
//     const locals = {
//         title:"Anasua's Blog",
//         description :"Simple blog crated with NodeJs, Express, MongoDB"
//     }

// try{
//     const data = await Post.find();
//     res.render('index', {locals,data});

// }catch(error){
//  console.log(error);
// }   
// });

// GET
// Post:id
router.get('/post/:id', async (req,res) =>{
   
try{
    
let slug = req.params.id;
    const data = await Post.findById({_id: slug});

    const locals = {
        title:data.title,
        description :"Simple blog crated with NodeJs, Express, MongoDB",
        currentRoute:`/post/${slug}`
    }
    res.render('post', {locals,data});
    

}catch(error){
 console.log(error);
}   
});


router.get("/about",(req,res)=>{
    res.render('about', {
        currentRoute:'/about'
    });
});
router.get("/contact",(req,res)=>{
    res.render('contact', {
        currentRoute:'/contact'
    });
});
// POST
// Post -searchItem
router.post("/search", async (req,res) =>{
    

try{
    const locals = {
        title:"Search",
        description :"Simple blog crated with NodeJs, Express, MongoDB"
    }

    let searchItem =req.body.searchItem;
    const searchNoSpecialChar =searchItem.replace(/[^a-zA-Z0-9]/g,"")

    const data = await Post.find({
        $or: [
            {title: {$regex:new RegExp(searchNoSpecialChar,'i')}},
            {body: {$regex:new RegExp(searchNoSpecialChar,'i')}}
        ]
    })

    res.render('search',{
        data,
        locals
    });

}catch(error){
 console.log(error);
}   
});


module.exports = router;



    // function insertPostData () {
    //     Post.insertMany([{
    //         title:"Building a Blog",
    //         body:"Tis is the body text"
    //     },
    //     {
    //         title:"HTML",
    //         body:"The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser. It is often assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript."
    //         },
    //         {
    //         title:"CSS",
    //         body:"Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript."
    //         },
    //         {
    //         title:"JavaScript",
    //         body:"JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2023, 98.7% of websites use JavaScript on the client side for webpage behavior, often incorporating third-party libraries."
    //         },
    //         {
    //         title:"Node.js",
    //         body:"Node.js is a cross-platform, open-source server environment that can run on Windows, Linux, Unix, macOS, and more. Node.js is a back-end JavaScript runtime environment, runs on the V8 JavaScript Engine, and executes JavaScript code outside a web browser."
    //         },
    //         {
    //         title:"Express.Js",
    //         body:"Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js."
    //         },
    //         {
    //         title:"MongoDB",
    //         body:"MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas."
    //         }
            
           
    //     ])
    // }
    // insertPostData();