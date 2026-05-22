let genderChart;
let departmentChart;
let currentPage = 1;
let allStudents = [];
let filteredStudents = [];

const studentsPerPage = 10;




// 檢查是否已登入
const token = localStorage.getItem("token");

// 沒 token 就回登入頁
if (!token) {
  localStorage.removeItem("token");

  window.location.href = "login.html";
}

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
    if (response.status === 401) {

  alert("登入已過期，請重新登入");

  localStorage.removeItem("token");

  window.location.href = "login.html";

  return;
}

    const students =
      await response.json();

    // 全部資料
    allStudents = students;

    // 預設顯示資料
    filteredStudents = students;

    // 顯示表格
    displayStudents();

    // 更新 Dashboard
    updateDashboard(
      filteredStudents
    );

  } catch (error) {

    console.log(error);

  }

}


// 顯示學生資料
function displayStudents() {

  const tableBody =
    document.getElementById(
      "studentTableBody"
    );

  tableBody.innerHTML = "";

  // Pagination
  const start =
    (currentPage - 1)
    * studentsPerPage;

  const end =
    start + studentsPerPage;

  const studentsToShow =
    filteredStudents.slice(
      start,
      end
    );

  studentsToShow.forEach(
    (student) => {

      tableBody.innerHTML += `

        <tr>

          <td>${student.student_id}</td>

          <td>${student.name}</td>

          <td>${student.gender}</td>

          <td>${student.email}</td>

          <td>${student.phone}</td>

          
          <td>${student.department}</td>

          <td>

            <button
              class="btn btn-warning btn-sm"
              onclick="openEditModal(${student.id})"
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

  renderPagination();

}


// 初始化
window.onload = () => {

  const darkMode =
    localStorage.getItem(
      "darkMode"
    );

  if (
    darkMode === "enabled"
  ) {

    document.body.classList.add(
      "dark-mode"
    );

  }

  showSection("studentSection");
  getStudents();

};

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
async function openEditModal(id) {
  try {
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

    document.getElementById("edit_id").value = student.id;
    document.getElementById("edit_student_id").value = student.student_id;
    document.getElementById("edit_name").value = student.name;
    document.getElementById("edit_gender").value = student.gender;
    document.getElementById("edit_email").value = student.email;
    document.getElementById("edit_phone").value = student.phone;
    document.getElementById("edit_department").value = student.department;

    const editModal = new bootstrap.Modal(
      document.getElementById("editStudentModal")
    );

    editModal.show();

  } catch (error) {
    console.log(error);
    showToast("讀取學生資料失敗", "danger");
  }
}

async function updateStudent() {
  const id = document.getElementById("edit_id").value;

  const updatedData = {
    student_id: document.getElementById("edit_student_id").value,
    name: document.getElementById("edit_name").value,
    gender: document.getElementById("edit_gender").value,
    email: document.getElementById("edit_email").value,
    phone: document.getElementById("edit_phone").value,
    department: document.getElementById("edit_department").value,
  };

  try {
    const response = await fetch(
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

    const result = await response.json();

    showToast(result.message, "success");

    const modalElement =
      document.getElementById("editStudentModal");

    const modal =
      bootstrap.Modal.getInstance(modalElement);

    modal.hide();

    getStudents();

  } catch (error) {
    console.log(error);
    showToast("更新失敗", "danger");
  }
}
// 查詢學生
function searchStudents() {

  const keyword =
    document
      .getElementById(
        "searchInput"
      )
      .value
      .toLowerCase();

  filteredStudents =
    allStudents.filter(
      (student) => {

        return (

          (student.name || "")
            .toLowerCase()
            .includes(keyword)

          ||

          (student.department || "")
            .toLowerCase()
            .includes(keyword)

          ||

          (student.gender || "")
            .toLowerCase()
            .includes(keyword)

          ||

          (student.email || "")
            .toLowerCase()
            .includes(keyword)

          ||

          (student.phone || "")
            .toLowerCase()
            .includes(keyword)

        );

      }
    );

  currentPage = 1;

  displayStudents();

  updateDashboard(
    filteredStudents
  );

}

// 更新 Dashboard
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

  // 取得表格資料
  const rows =
    document.querySelectorAll(
      "table tbody tr"
    );

  let data = [];

  // 標題列
  data.push([
    "ID",
    "姓名",
    "年齡",
    "性別",
    "科系"
  ]);

  // 資料列
  rows.forEach((row) => {

    const cols =
      row.querySelectorAll("td");

    if (cols.length > 0) {

      data.push([

        cols[0].innerText,
        cols[1].innerText,
        cols[2].innerText,
        cols[3].innerText,
        cols[4].innerText

      ]);

    }

  });

  // 建立 worksheet
  const worksheet =
    XLSX.utils.aoa_to_sheet(data);

    worksheet["!cols"] = [

  { wch: 10 },
  { wch: 20 },
  { wch: 10 },
  { wch: 10 },
  { wch: 25 }

];

  // 建立 workbook
  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Students"
  );

  // 匯出
  XLSX.writeFile(
    workbook,
    "students.xlsx"
  );

}

// 匯出 PDF
async function exportPDF() {

  const element =
    document.querySelector("table");

  const canvas =
    await html2canvas(element);

  const imgData =
    canvas.toDataURL("image/png");

  const { jsPDF } =
    window.jspdf;

  const pdf =
    new jsPDF();

  const imgWidth = 190;

  const pageHeight = 295;

  const imgHeight =
    canvas.height *
    imgWidth /
    canvas.width;

  let heightLeft =
    imgHeight;

  let position = 10;

  pdf.addImage(
    imgData,
    "PNG",
    10,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pageHeight;

  while (heightLeft >= 0) {

    position =
      heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      10,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

  }

  pdf.save(
    "students.pdf"
  );

}

// 分頁按鈕
function renderPagination() {

  const pagination =
    document.getElementById(
      "pagination"
    );

  pagination.innerHTML = "";

  const totalPages =
    Math.ceil(
      filteredStudents.length
      / studentsPerPage
    );

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    pagination.innerHTML += `

      <button
        class="
          btn
          btn-sm
          ${
            i === currentPage
            ? "btn-primary"
            : "btn-outline-primary"
          }
        "
        onclick="changePage(${i})"
      >
        ${i}
      </button>

    `;

  }

}

// 切換頁面
function changePage(page) {

  const totalPages =
    Math.ceil(
      filteredStudents.length
      / studentsPerPage
    );

  if (
    page < 1 ||
    page > totalPages
  ) {
    return;
  }

  currentPage = page;

  displayStudents();

}

// Dark Mode

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


//彈跳式訊息欄

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

// 登出
function logout() {

  localStorage.removeItem("token");

  showToast("已成功登出", "success");

  setTimeout(() => {
    window.location.replace("login.html");
  }, 1000);

}

// 顯示指定區塊
function showSection(sectionId) {

  // 先隱藏全部
  const sections =
    document.querySelectorAll(
      ".content-section"
    );

  sections.forEach((section) => {

    section.style.display = "none";

  });

  // 顯示指定區塊
  document.getElementById(
    sectionId
  ).style.display = "block";

}