const API_URL = "https://remotive.com/api/remote-jobs";

const jobListings = document.querySelector(".job-listings");
const pagination = document.querySelector(".pagination");
const previousBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

// Create Display Loader
const div = document.createElement("div");
div.className = "loader";

const loaderText = document.createElement("h3");
loaderText.className = "loader-text";

loaderText.textContent = "Loading...";

div.appendChild(loaderText);

jobListings.appendChild(div);

const jobTemplate = ({
  url,
  company_logo,
  job_type,
  company_name,
  title,
  candidate_required_location,
}) => {
  return `
        <a href="${url}" class="job-card-item">
            <div class="company-img">
                <img src="${company_logo}" alt="${title}" />
            </div>

            <p class="duration">
            <span>5h</span>
            <span>.</span>
            <span class="job-type">${job_type}</span>
            </p>

            <p class="job-title">${title}</p>

            <p class="company">${company_name}</p>

            <p class="location">${candidate_required_location}</p>
        </a>
    `;
};

let JOB_DATA = [];

// Pagination Logic
let currentPage = 1;
const jobsPerPage = 12;

// function changePage(page) {
//   var btn_next = document.getElementById("btn_next");
//   var btn_prev = document.getElementById("btn_prev");
//   var listing_table = document.getElementById("listingTable");
//   var page_span = document.getElementById("page");

//   // Validate page
//   if (page < 1) page = 1;
//   if (page > numPages()) page = numPages();

//   listing_table.innerHTML = "";

//   for (
//     var i = (page - 1) * records_per_page;
//     i < page * records_per_page;
//     i++
//   ) {
//     listing_table.innerHTML += objJson[i].adName + "<br>";
//   }
//   page_span.innerHTML = page;

//   if (page == 1) {
//     btn_prev.style.visibility = "hidden";
//   } else {
//     btn_prev.style.visibility = "visible";
//   }

//   if (page == numPages()) {
//     btn_next.style.visibility = "hidden";
//   } else {
//     btn_next.style.visibility = "visible";
//   }
// }

// function numPages() {
//   return Math.ceil(objJson.length / jobsPerPage);
// }

const request = new XMLHttpRequest();

request.open("GET", API_URL);

request.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    const data = JSON.parse(this.response);

    const { jobs } = data;
    // const jobs = data.jobs

    handleJobDistribution(jobs);
  }
};

function handleJobDistribution(jobs) {
  const htmlStringList = jobs.map((job) => {
    return jobTemplate(job);
  });

  // Update JOB_DATA
  JOB_DATA = htmlStringList;

  changePage(); // Default Page is Page 1 all the time
}

request.send();

function getNumberOfPages() {
  return Math.ceil(JOB_DATA.length / jobsPerPage);
}

function changePage(page = 1) {
  if (page < 1) {
    page = 1;
  }

  if (page > getNumberOfPages()) {
    page = getNumberOfPages();
  }

  const start = (page - 1) * jobsPerPage;

  currentPage = page;

  jobListings.innerHTML = JOB_DATA.slice(start, jobsPerPage)
    .join(" ")
    .toString();

  updatePagination();

  console.log("Page Changed", {
    page,
    currentPage,
    data: JOB_DATA.slice(start, jobsPerPage),
  });
}

function updatePagination() {
  let pageNumberStrings = [];

  for (let i = 0; i < getNumberOfPages(); i++) {
    pageNumberStrings.push(`
    <li class="pagination-item">
      <button class="pagination-btn">${i + 1}</button>
    </li>
  `);
  }

  const paginationStrings = [
    `
    <li class="pagination-item">
      <button id="prev" class="pagination-btn">
        <i class="fa fa-solid fa-angle-left"></i>
      </button>
    </li>
  `,
    ...pageNumberStrings,
    `
  <li class="pagination-item">
    <button id="next" class="pagination-btn">
      <i class="fa fa-solid fa-angle-right"></i>
    </button>
  </li>
  `,
  ];

  pagination.innerHTML = paginationStrings.join(" ");
}
