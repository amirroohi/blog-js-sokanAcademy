import axios from "axios";

// -----------APIs-----------

const BLOGS_URL = "https://api.sokanacademy.com/api/blogs";
const BANNERS_URL =
  "https://api.sokanacademy.com/api/announcements/blog-index-banner";

// -------------------------------------
// global variables
let allBannerData = [];
let allBlogData = [];

// --------------banners--------------

// get all elements from DOM
const slidesContainer = document.querySelector(".slideshow-container");
const dotsContainer = document.querySelector(".dots");
const prevSlide = document.querySelector(".prev");
const nextSlide = document.querySelector(".next");

// render banners when page loaded
document.addEventListener("DOMContentLoaded", async () => {
  // fetch data
  await axios
    .get(BANNERS_URL)
    .then((res) => {
      const data = res.data.data;
      renderBanners(res.data.data);
      allBannerData = data;
      return res.data;
    })
    .catch((err) => console.log(err));
});

// render banners from api
function renderBanners(_Banners) {
  const bannersArray = Object.entries(_Banners);
  bannersArray.forEach((item, index) => {
    // create slides
    const slideDiv = document.createElement("div");
    slideDiv.classList.add("slide", "w-100", "col-12", "d-inline-block");
    slideDiv.innerHTML = `
           <a class="w-100" href=${item[1].desktop.metas.link}>
                <picture>
                  <source media="(min-width:600px)" srcset=${item[1].desktop.cover}>
                  <img src=${item[1].phone.cover} alt=${item[1].desktop.title} class="image w-100 rounded-4">
                </picture>
           </a>
    `;
    slidesContainer.appendChild(slideDiv);
    // create dots
    const dotSpan = document.createElement("span");
    dotSpan.classList.add("dot");
    dotSpan.dataset.dotNumber = index + 1;
    dotsContainer.appendChild(dotSpan);
  });

  let slideIndex = 1;
  showSlides(slideIndex);
  // move slides banner with translateX by arrows and dots
  function showSlides(n) {
    let i;
    let slides = document.querySelectorAll(".slide");
    let dots = document.querySelectorAll(".dot");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.transform = `translateX(${(slideIndex - 1) * 100}%)`;
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndex - 1].className += " active";
  }

  function changeSlide(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  // event handlers for banner
  prevSlide.addEventListener("click", () => {
    changeSlide(-1);
  });
  nextSlide.addEventListener("click", () => {
    changeSlide(1);
  });

  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) =>
    dot.addEventListener("click", (e) => {
      currentSlide(Number(e.target.dataset.dotNumber));
    })
  );
}

// ----------blogs----------
// variables
const filter = {
  searchItems: "",
  categoryName: "",
  authorName: "",
  sort: "",
};
const params = {
  q: null,
  author: null,
  category: null,
  popular: null,
  latest: null,
  oldest: null,
  most_visited: null,
};
// get all elements that are needed
const searchInputText = document.querySelector(".form-control");
const searchInputBtn = document.querySelector(".search-btn");
const cardsListElement = document.querySelector(".cards-list");
const categoryListElement = document.querySelector(".category-list");
const authorListElement = document.querySelector(".author-list");
const sortListElement = document.querySelector(".sort-list");
const dropdownTogglers = document.querySelectorAll(".dropdown-toggle");
const removeBtns = document.querySelectorAll(".dropdown-toggle__remove");

// fetch blogs data
document.addEventListener("DOMContentLoaded", async () => {
  axios
    .get(BLOGS_URL)
    .then((res) => {
      allBlogData = res.data.data;
      const emptyContentDiv = document.createElement("div");
      emptyContentDiv.classList.add("emptyContent");
      emptyContentDiv.innerText = "در حال بارگذاری...";
      cardsListElement.appendChild(emptyContentDiv);
      setTimeout(() => {
        renderBlogs(res.data.data, filter);
      }, 1000);
    })
    .catch((err) => console.log(err));
});

// render blogs from api
function renderBlogs(_Blogs, _filter) {
  // reset when refresh page and stay the changes
  searchInputText.value = filter.searchItems;

  const blogsShown = [..._Blogs];

  // render cards
  cardsListElement.innerHTML = ""; //reset before rerender
  blogsShown.forEach((blog) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "col", "rounded-4", "p-0", "overflow-hidden");
    cardDiv.innerHTML = `<img src=${blog.cover_path} onerror="this.src='./src/assets/images/fallback-img-small.webp';" class="card-img-top" alt="blog-img" />
          <div class="card-body rounded-4 w-100 h-100">
            <div class="card-text w-100">
              <p>
                ${blog.title}
              </p>
            </div>
            <div class="course-creater">
              <span class="profile-creater">
                <img
                  src=${blog.author.avatar}
                  onerror="this.src='./src/assets/images/avatar.png';"
                  alt="author-avatar"
                  class="rounded"
                /> </span
              ><span class="name-creater">${blog.author.full_name}</span>
            </div>
            <div class="course-details w-100">
              <div class="course-spec row">
                <div class="category col">
                  <span>
                    <svg class="icon">
                      <use
                        xlink:href="./src/assets/icons/sprite.svg#category"
                      ></use>
                    </svg>
                  </span>
                  <p>${blog.category_name}</p>
                </div>
                <div class="clock col">
                  <span>
                    <svg class="icon">
                      <use
                        xlink:href="./src/assets/icons/sprite.svg#clock"
                      ></use>
                    </svg>
                  </span>
                  <p>${blog.duration} دقیقه</p>
                </div>
                <div class="bookmark justify-content-end col">
                  <svg class="icon">
                    <use
                      xlink:href="./src/assets/icons/sprite.svg#bookmark"
                    ></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>`;
    cardsListElement.appendChild(cardDiv);
  });
  // if it's not any blogs to show return this
  if (cardsListElement.children.length === 0) {
    const emptyContentDiv = document.createElement("div");
    emptyContentDiv.classList.add("emptyContent");
    emptyContentDiv.innerHTML = "وبلاگی یافت نشد...";
    cardsListElement.appendChild(emptyContentDiv);
  }
  // if dropdown reset, remove btn will be hidden
  dropdownTogglers.forEach((dropdownToggler) => {
    if (
      dropdownToggler.children[1].innerText === "دسته‌بندی" ||
      dropdownToggler.children[1].innerText === "نویسنده" ||
      dropdownToggler.children[1].innerText === "مرتب‌سازی"
    ) {
      dropdownToggler.children[0].style.display = "none";
    } else {
      dropdownToggler.children[0].style.display = "inline-block";
    }
  });
}

// call api to change query when we want
async function callApiForChangeQuery() {
  const { data } = await axios.get(BLOGS_URL, {
    params: params,
  });
  return data.data;
}

// to change sorting query as we want
async function callApiForSort(event) {
  params.oldest = null;
  params.latest = null;
  params.most_visited = null;
  switch (event.target.dataset.sort) {
    case "oldest":
      params.oldest = 1 || null;
      break;
    case "latest":
      params.latest = 1 || null;
      break;
    case "most_visited":
      params.most_visited = 1 || null;
      break;
    default:
      params.oldest = null;
      params.latest = null;
      params.most_visited = null;
      break;
  }
  return await callApiForChangeQuery();
}

// event handlers for search section
removeBtns[0].addEventListener("click", async (e) => {
  if (e.target.nextElementSibling.innerText !== "دسته‌بندی") {
    e.target.nextElementSibling.innerText =
      e.target.nextElementSibling.dataset.reset;
    e.target.style.display = "none";
    filter.categoryName = "";
    params.category = null;
    console.log(filter);
  } else {
    e.target.style.display = "inline-block";
  }
  allBlogData = await callApiForChangeQuery();
  renderBlogs(allBlogData, filter);
});
removeBtns[1].addEventListener("click", async (e) => {
  if (e.target.nextElementSibling.innerText !== "نویسنده") {
    e.target.nextElementSibling.innerText =
      e.target.nextElementSibling.dataset.reset;
    e.target.style.display = "none";
    filter.categoryName = "";
    params.author = null;
    console.log(filter);
  } else {
    e.target.style.display = "inline-block";
  }
  allBlogData = await callApiForChangeQuery();
  renderBlogs(allBlogData, filter);
});
removeBtns[2].addEventListener("click", async (e) => {
  if (e.target.nextElementSibling.innerText !== "مرتب‌سازی") {
    e.target.nextElementSibling.innerText =
      e.target.nextElementSibling.dataset.reset;
    e.target.style.display = "none";
    filter.categoryName = "";
    params.oldest = null;
    params.latest = null;
    params.most_visited = null;
    console.log(filter);
  } else {
    e.target.style.display = "inline-block";
  }
  allBlogData = await callApiForChangeQuery();
  renderBlogs(allBlogData, filter);
});

searchInputText.addEventListener("input", (e) => {
  filter.searchItems = e.target.value;
});
searchInputBtn.addEventListener("click", async () => {
  params.q = filter.searchItems || null;
  allBlogData = await callApiForChangeQuery();
  renderBlogs(allBlogData, filter);
});
searchInputText.addEventListener("keypress", async (e) => {
  params.q = filter.searchItems || null;
  if (e.keyCode === 13) {
    allBlogData = await callApiForChangeQuery();
    renderBlogs(allBlogData, filter);
  }
});

categoryListElement.addEventListener("click", async (e) => {
  filter.categoryName = e.target.text; //if this will be change
  dropdownTogglers[0].children[1].innerText = filter.categoryName;
  params.category = e.target.dataset.category || null;
  allBlogData = await callApiForChangeQuery();
  renderBlogs(allBlogData, filter);
});

authorListElement.addEventListener("click", async (e) => {
  filter.authorName = e.target.text;
  dropdownTogglers[1].children[1].innerText = filter.authorName;
  params.author = e.target.dataset.author || null;
  allBlogData = await callApiForChangeQuery();
  renderBlogs(allBlogData, filter);
});

sortListElement.addEventListener("click", async (e) => {
  filter.sort = e.target.text;
  dropdownTogglers[2].children[1].innerText = filter.sort;
  allBlogData = await callApiForSort(e);
  renderBlogs(allBlogData, filter);
});
