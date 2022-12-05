/* eslint-disable no-unused-vars */
'use strict';

const templates = {
  // eslint-disable-next-line no-undef
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  // eslint-disable-next-line no-undef
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  // eslint-disable-next-line no-undef
  tagsWrapperLink: Handlebars.compile(document.querySelector('#template-tags-wrapper-link').innerHTML),
  // eslint-disable-next-line no-undef
  authorWrapperLink: Handlebars.compile(document.querySelector('#template-author-wrapper-link').innerHTML),
  // eslint-disable-next-line no-undef
  authorsCloudLink: Handlebars.compile(document.querySelector('#template-authors-cloud-link').innerHTML)
};


const titleClickHandler = function(event) {
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links */

  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeLink = document.querySelectorAll('.post.active');
  for (let activeArticles of activeLink) {
    activeArticles.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
};

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  tagsListSelector: '.tags.list',
  articleAuthorSelector: '.post-author',
  authorsListSelector: '.authors',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-'
};

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */

  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  let html = '';

  for (let article of articles) {
    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */

    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* create a link element */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */

    html = html + linkHTML;
  }

  titleList.innerHTML = html;
}

generateTitleLinks();

const links = document.querySelectorAll('.titles a');

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}

function calculateParams(value) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let idx in value) {
    params.max = Math.max(value[idx], params.max);
    params.min = Math.min(value[idx], params.min);
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) + 1 );
  return opts.cloudClassPrefix + classNumber;
}

function generateTags() {
  /* create a new variable allTags with an empty array */

  const allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {
    /* find tags wrapper */

    const tagsWrapper = article.querySelector(opts.articleTagsSelector);

    /* make html variable with empty string */

    let html = '';
    const tagsWrapperData = {tags: []};

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray) {
      /* generate HTML of the tag */

      tagsWrapperData.tags.push({
        tag: tag
      });

      /* check if this link is not already in allTags */

      if (!allTags[tag]) {
        /* add generated code to allTags array */

        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* END LOOP: for each tag */

    /* insert HTML of all tags into tags wrapper */

    tagsWrapper.innerHTML = templates.tagsWrapperLink(tagsWrapperData);
  }
  /* END LOOP: for every article: */

  /* find list of tags in right column */

  const tagList = document.querySelector(opts.tagsListSelector);
  const tagsParams = calculateParams(allTags);

  /* create variable for all links in HTML code */

  const allTagsData = {tags: []};

  /* START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* generate code of a link and add it to allTagsHTML */

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* END LOOP: for each tag in allTags: */

  /* add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for (let tagArticle of activeTagLinks) {
    /* remove class active */

    tagArticle.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */

  for (let tagLink of tagLinks) {
    /* add class active */

    tagLink.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */

  const tagLinks = document.querySelectorAll('.post-tags .list a');

  /* START LOOP: for each link */

  for (let tag of tagLinks) {
    /* add tagClickHandler as event listener for that link */

    tag.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function calculateAuthorClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) + 1 );
  return opts.cloudClassPrefix + classNumber;
}

function generateAuthors() {
  /* create a new variable allAuthors with an empty array */

  const allAuthors = {};

  /* find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {
    /* find author wrapper */

    const authorWrapper = article.querySelector(opts.articleAuthorSelector);

    /* make html variable with empty string */

    let html = '';

    /* get author from data-author attribute */

    const articleAuthor = article.getAttribute('data-author');

    /* generate HTML of the author */
    const authorHTMLData = {author: articleAuthor};
    /* add generated code to html variable */
    html = html + templates.authorWrapperLink(authorHTMLData);

    /* check if this link is not already in allAuthors */
    if(!allAuthors[articleAuthor]) {
      /* add generated code to allAuthors array */

      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    /* insert HTML of all authors into author wrapper */
    authorWrapper.innerHTML = html;
  }
  /* END LOOP: for every article: */

  /* find list of authors in right column */

  const authorList = document.querySelector(opts.authorsListSelector);
  const authorsParams = calculateParams(allAuthors);

  /* create variable for all links in HTML code */

  const allAuthorsData = {authors: []};

  /* START LOOP: for each author in allAuthors: */
  for (let author in allAuthors) {
    /* generate code of a link and add it to allAuthorsHTML */

    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateAuthorClass(allAuthors[author], authorsParams)
    });
  }
  /* END LOOP: for each author in allAuthors: */
  authorList.innerHTML = templates.authorsCloudLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */

  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */

  const author = href.replace('#', '');
  /* find all tag links with class active */

  const activeAuthorLink = document.querySelectorAll('.active[href^="#"]');

  /* START LOOP: for each active tag link */

  for (let author of activeAuthorLink) {
    /* remove class active */

    author.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */

  const authorLinks = document.querySelectorAll('[href="' + href + '"]');

  /* START LOOP: for each found tag link */

  for (let authorLink of authorLinks) {
    /* add class active */

    authorLink.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {
  /* find all links to tags */
  const authorList = document.querySelectorAll(opts.authorsListSelector + ' a');

  const articleAuthors = document.querySelectorAll(opts.articleAuthorSelector + ' a');


  for (let author of authorList) {
    /* add tagClickHandler as event listener for that link */

    author.addEventListener('click', authorClickHandler);
  }

  for (let articleAuthor of articleAuthors) {
    /* add tagClickHandler as event listener for that link */

    articleAuthor.addEventListener('click', () => {generateTitleLinks('[data-author="' + articleAuthor.getAttribute('href').replace('#', '') + '"]');});
  }
  /* END LOOP: for each link */
}

addClickListenersToAuthors();
