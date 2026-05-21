let genderChart;
let departmentChart;
let currentPage = 1;

const rowsPerPage = 5;

// 檢查是否已登入
const token = localStorage.getItem("token");

if (!token) {

window.location.replace = "login.html";

}
let allStudents = [];

const tableBody = document.getElementById("studentTableBody");



// 取得學生資料
async function getStudents() {

  try {

    const response = await fetch(
  "http://localhost:3000/students",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    const students = await response.json();

    allStudents = students;

    displayStudents(students);

    updateDashboard(students);

  } catch (error) {

    console.log(error);

  }

}


// 顯示學生資料
function displayStudents(students) {

  const tableBody =
    document.getElementById(
      "studentTableBody"
    );

  tableBody.innerHTML = "";


  // =========================
  // Pagination
  // =========================

  const start =
    (currentPage - 1) * rowsPerPage;

  const end =
    start + rowsPerPage;

  const paginatedStudents =
    students.slice(start, end);


  // =========================
  // Render Table
  // =========================

  paginatedStudents.forEach((student) => {

    tableBody.innerHTML += `

      <tr>

        <td>${student.id}</td>

        <td>${student.student_id}</td>

        <td>${student.name}</td>

        <td>${student.gender}</td>

        <td>${student.email}</td>

        <td>${student.phone}</td>

        <td>${student.department}</td>

        <td>

          <button
            class="btn btn-warning btn-sm"
            onclick="editStudent(${student.id})"
          >
            編輯
          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteStudent(${student.id})"
          >
            刪除
          </button>

        </td>

      </tr>

    `;

  });


  renderPagination(students);

}


// 初始化
getStudents();

// 新增學生
async function addStudent() {

  const studentData = {

    student_id: document.getElementById("student_id").value,

    name: document.getElementById("name").value,

    gender: document.getElementById("gender").value,

    email: document.getElementById("email").value,

    phone: document.getElementById("phone").value,

    department: document.getElementById("department").value,

  };

  try {

    const response = await fetch(
      
  "http://localhost:3000/students",
   { method: "POST",
     headers: 
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }, body: JSON.stringify(studentData),
   }

    );

    const result = await response.json();

    showToast(result.message, "success");

    // 重新載入資料
    getStudents();

    // 清空表單
    document.getElementById("studentForm").reset();

  } catch (error) {

    console.log(error);

  }

}

// 刪除學生
async function deleteStudent(id) {

  const confirmDelete = confirm("確定要刪除嗎？");

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `http://localhost:3000/students/${id}`,
      {
        method: "DELETE",
        headers: {
  Authorization: `Bearer ${token}`,
},
      }
    );

    const result = await response.json();

    showToast(result.message, "success");

    // 重新載入資料
    getStudents();

  } catch (error) {

    console.log(error);

  }

}

// 編輯學生
async function editStudent(id) {

  try {

    // 取得單一學生資料
    const response = await fetch(
      `http://localhost:3000/students/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    const student = data[0];

    // prompt 編輯
    const newName = prompt(
      "請輸入新的姓名",
      student.name
    );

    if (newName === null) return;

    const updatedData = {

      student_id: student.student_id,

      name: newName,

      gender: student.gender,

      email: student.email,

      phone: student.phone,

      department: student.department,

    };

    // 更新資料
    await fetch(
      `http://localhost:3000/students/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(updatedData),
      }
    );

    showToast("更新成功", "success" );

    getStudents();

  } catch (error) {

    console.log(error);

  }

}

function updateDashboard(students) {

  // ========================
  // Dashboard Numbers
  // ========================

  document.getElementById("totalStudents")
    .innerText = students.length;

  const maleCount = students.filter(
    s => s.gender === "男"
  ).length;

  const femaleCount = students.filter(
    s => s.gender === "女"
  ).length;

  document.getElementById("maleStudents")
    .innerText = maleCount;

  document.getElementById("femaleStudents")
    .innerText = femaleCount;


  // ========================
  // Gender Chart
  // ========================

  if (genderChart) {
    genderChart.destroy();
  }

  const genderCtx =
    document.getElementById("genderChart");

  genderChart = new Chart(genderCtx, {

    type: "pie",

    data: {

      labels: ["男", "女"],

      datasets: [{

        data: [maleCount, femaleCount],

        backgroundColor: [
          "#36A2EB",
          "#FF6384",
        ],

      }],

    },

  });


  // ========================
  // Department Chart
  // ========================

  const departmentData = {};

  students.forEach((student) => {

    const dept = student.department;

    if (departmentData[dept]) {

      departmentData[dept]++;

    } else {

      departmentData[dept] = 1;

    }

  });

  if (departmentChart) {
    departmentChart.destroy();
  }

  const departmentCtx =
    document.getElementById("departmentChart");

  departmentChart = new Chart(departmentCtx, {

    type: "bar",

    data: {

      labels: Object.keys(departmentData),

      datasets: [{

        label: "學生人數",

        data: Object.values(departmentData),

        backgroundColor: "#4BC0C0",

      }],

    },

    options: {

      responsive: true,

      plugins: {

        legend: {
          display: false,
        },

      },

    },

  });

}

// 匯出 Excel
function exportExcel() {

  // 轉成 worksheet
  const worksheet = XLSX.utils.json_to_sheet(
    allStudents
  );

  // 建立 workbook
  const workbook = XLSX.utils.book_new();

  // 加入 worksheet
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Students"
  );

  // 下載 Excel
  XLSX.writeFile(
    workbook,
    "students.xlsx"
  );

}

// 匯出 PDF
function exportPDF() {

  // jsPDF
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  // 標題
  doc.text(
    "Student Management Report",
    14,
    15
  );

  // 表格資料
  const tableData = allStudents.map(
    (student) => [

      student.id,
      student.student_id,
      student.name,
      student.gender,
      student.email,
      student.phone,
      student.department,

    ]
  );

  // 表格
  doc.autoTable({

    head: [[
      "ID",
      "Student ID",
      "Name",
      "Gender",
      "Email",
      "Phone",
      "Department",
    ]],

    body: tableData,

    startY: 25,

  });

  // 下載 PDF
  doc.save("students-report.pdf");

}

// 分頁按鈕
function renderPagination(students) {

  const pageCount =
    Math.ceil(
      students.length / rowsPerPage
    );

  const pagination =
    document.getElementById(
      "pagination"
    );

  pagination.innerHTML = "";


  // Previous
  pagination.innerHTML += `

    <li class="page-item">

      <button
        class="page-link"
        onclick="changePage(${currentPage - 1})"
      >
        上一頁
      </button>

    </li>

  `;


  // Page Numbers
  for (let i = 1; i <= pageCount; i++) {

    pagination.innerHTML += `

      <li class="page-item
        ${currentPage === i ? "active" : ""}
      ">

        <button
          class="page-link"
          onclick="changePage(${i})"
        >
          ${i}
        </button>

      </li>

    `;

  }


  // Next
  pagination.innerHTML += `

    <li class="page-item">

      <button
        class="page-link"
        onclick="changePage(${currentPage + 1})"
      >
        下一頁
      </button>

    </li>

  `;

}
// 切換頁面
function changePage(page) {

  const totalPages =
    Math.ceil(
      allStudents.length / rowsPerPage
    );

  if (page < 1 || page > totalPages) {
    return;
  }

  currentPage = page;

  displayStudents(allStudents);

}

// =========================
// Dark Mode
// =========================

function toggleDarkMode() {

  document.body.classList.toggle(
    "dark-mode"
  );

  // 保存模式
  if (
    document.body.classList.contains(
      "dark-mode"
    )
  ) {

    localStorage.setItem(
      "darkMode",
      "enabled"
    );

  } else {

    localStorage.setItem(
      "darkMode",
      "disabled"
    );

  }

}


// =========================
// 載入 Dark Mode 設定
// =========================

window.onload = () => {

  const darkMode =
    localStorage.getItem("darkMode");

  if (darkMode === "enabled") {

    document.body.classList.add(
      "dark-mode"
    );

  }

};

// =========================
// Toast Notification
// =========================

function showToast(
  message,
  type = "success"
) {

  const toastElement =
    document.getElementById(
      "liveToast"
    );

  const toastMessage =
    document.getElementById(
      "toastMessage"
    );

  // 訊息
  toastMessage.innerText = message;

  // 顏色
  toastElement.className =
    `toast align-items-center text-bg-${type} border-0`;

  // Bootstrap Toast
  const toast =
    new bootstrap.Toast(
      toastElement
    );

  toast.show();

}

function logout() {

  localStorage.removeItem("token");

  showToast("已成功登出", "success");

  setTimeout(() => {
    window.location.replace("login.html");
  }, 300);

}
