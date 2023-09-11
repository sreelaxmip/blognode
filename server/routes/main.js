const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

router.get('', async (req, res) => {
  const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
  }

  try {
    const data = await Post.find();
    res.render('index', { locals, data });
  } catch (error) {
    console.log(error);
  }

});


// /**
//  * GET /
//  * Post :id
// */
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


function insertPostData () {
  Post.insertMany([
    {
      title: "AI Revolution: Transforming Industries and Shaping Tomorrow",
      body: "Artificial Intelligence (AI) has long been a subject of fascination, curiosity, and sometimes apprehension among humans. The rapid advancements in AI technologies have taken us on a remarkable journey, unlocking new possibilities, changing industries, and reshaping the way we perceive the future. As we delve into the intricacies of AI, we embark on a journey into the unknown, unraveling the mysteries that lie at its core, and exploring the profound impact it holds for the future of humanity."
    },
    {
      title: "The Rise of AI: Exploring the Boundaries of Human Ingenuity",
      body: "The advent of Artificial Intelligence (AI) has marked one of the most transformative eras in human history. AI, a field that seeks to develop machines capable of performing tasks that typically require human intelligence, has rapidly evolved, pushing the boundaries of human ingenuity in ways previously thought unimaginable. This essay delves into the profound impact of AI on society, its potential, and the ethical and philosophical questions it raises."
    },
    {
      title: "AI Ethics: Navigating the Moral Landscape of Artificial Intelligence",
      body: "Artificial Intelligence (AI) is revolutionizing our world, shaping industries, and reshaping the way we live and work. As AI technologies continue to advance, we find ourselves at a critical juncture, where we must not only marvel at their potential but also confront the ethical challenges they pose. Navigating the moral landscape of AI is essential to ensure that these powerful tools are used for the betterment of humanity without causing harm or perpetuating existing inequalities."
    },
    {
      title: "From Science Fiction to Reality: The Evolution of Artificial Intelligence",
      body: "Artificial Intelligence (AI) has come a long way from being a mere concept in science fiction to a transformative force in our everyday lives. The journey of AI from the pages of science fiction novels and the silver screen to reality is a testament to human ingenuity and technological advancement. This essay explores the evolution of AI, from its early depictions in science fiction to its real-world applications and implications."
    },
    {
      title: "AI in Everyday Life: How Artificial Intelligence is Changing the Way We Live",
      body: "Artificial Intelligence (AI) has rapidly permeated every facet of modern life, reshaping the way we work, communicate, and even think. This transformative technology has evolved from science fiction dreams to everyday reality, affecting everything from healthcare and transportation to entertainment and finance. This essay explores the profound impact of AI on our daily lives, highlighting both its advantages and challenges."
    },
    {
      title: "The Promise and Perils of Artificial Intelligence: A Comprehensive Overview",
      body: "Artificial Intelligence (AI) has emerged as one of the most transformative and controversial technologies of our time. Its capabilities, once confined to science fiction, are now a reality, shaping various aspects of our lives. This essay delves into the promise and perils of AI, providing a comprehensive overview of the impact this technology has on society, economy, ethics, and beyond."
    },
    
    {
      title: "Demystifying Machine Learning: A Beginner's Guide to AI",
      body: "Machine learning and artificial intelligence (AI) have become buzzwords in recent years, dominating headlines and reshaping industries. However, for beginners, the world of AI and machine learning can seem daunting and complex. This essay aims to demystify machine learning, providing a beginner's guide to AI, breaking down its core concepts, applications, and potential impact on society."
    },
  ])
}

insertPostData();


module.exports = router;