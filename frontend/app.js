let genderChart;
let departmentChart;
let currentPage = 1;
let allStudents = [];
let filteredStudents = [];
let allTeachers = [];
let filteredTeachers = [];

const studentsPerPage = 10;
const teachersPerPage = 10;
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateTaiwanPhone(phone) {
  return /^09\d{8}$/.test(phone);
}

function validateStudentId(studentId) {
  return /^S\d{3}$/.test(studentId);
}

function validateTeacherId(teacherId) {
  return /^T\d{3}$/.test(teacherId);
}




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
      "https://student-management-system-9whg.onrender.com/students",
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
              onclick="deleteStudent(${student.id}, '${student.name}')"
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
  getTeachers();

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
  const studentId = document.getElementById("student_id").value.trim();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const department = document.getElementById("department").value;

  if (!validateStudentId(studentId)) {
    showToast("學號格式錯誤，請輸入 S001 格式");
    return;
  }

  if (name === "") {
    showToast("姓名不可空白");
    return;
  }

  if (/\d/.test(name)) {
    showToast("姓名不可包含數字");
    return;
  }

  if (!validateEmail(email)) {
    showToast("Email 格式錯誤，例如 test@gmail.com");
    return;
  }

  if (!validateTaiwanPhone(phone)) {
    showToast("電話格式錯誤，請輸入 09 開頭共 10 碼");
    return;
  }

  if (department === "") {
    showToast("請選擇科系");
    return;
  }



  

  try {

    const response = await fetch(
      
  "https://student-management-system-9whg.onrender.com/students",
   { method: "POST",
     headers: 
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }, body: JSON.stringify(studentData),
   }

    );

    const result = await response.json();

    if (!response.ok) {
      showToast(result.message, "danger");
      return;
    }

    showToast(result.message, "success");

    // 重新載入資料
    getStudents();

    // 清空表單
    document.getElementById("studentForm").reset();

  }catch (error) {

    console.log(error);

  }

}

// 刪除學生
async function deleteStudent(id,name) {

  const confirmDelete = confirm(`確定要刪除 ${name} 嗎？`);

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `https://student-management-system-9whg.onrender.com/students/${id}`,
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
      `https://student-management-system-9whg.onrender.com/students/${id}`,
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

// 更新學生
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
      `https://student-management-system-9whg.onrender.com/students/${id}`,
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


// 取得教師資料
async function getTeachers() {
  const response = await fetch(
    "https://student-management-system-9whg.onrender.com/teachers",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );



  const teachers = await response.json();

  allTeachers = teachers;
  filteredTeachers = teachers;

  displayTeachers();
}

// 顯示教師資料
function displayTeachers() {
  const tableBody = document.getElementById("teacherTableBody");

  tableBody.innerHTML = "";

  filteredTeachers.forEach((teacher) => {
    tableBody.innerHTML += `
      <tr>
        <td>${teacher.teacher_id}</td>
        <td>${teacher.name}</td>
        <td>${teacher.gender}</td>
        <td>${teacher.email}</td>
        <td>${teacher.phone}</td>
        <td>${teacher.department}</td>
        <td>${teacher.title}</td>
        <td>
          <button
            class="btn btn-warning btn-sm"
            onclick="openEditTeacherModal(${teacher.id})"
          >
            編輯
          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteTeacher(${teacher.id}, '${teacher.name}')"
          >
            刪除
          </button>
        </td>
      </tr>
    `;
  });
}

// 刪除教師
async function deleteTeacher(id,name) {
  if (!confirm(`確定要刪除 ${name} 嗎？`)) return;

  const response = await fetch(
    `https://student-management-system-9whg.onrender.com/teachers/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  showToast(result.message, "success");

  getTeachers();
}

// 新增教師
async function addTeacher() {
  const teacherId = document.getElementById("teacher_id").value.trim();
  const name = document.getElementById("teacher_name").value.trim();
  const email = document.getElementById("teacher_email").value.trim();
  const phone = document.getElementById("teacher_phone").value.trim();

  if (!validateTeacherId(teacherId)) {
    showToast("教師編號格式錯誤，請輸入 T001 格式");
    return;
  }

  if (name === "") {
    showToast("教師姓名不可空白");
    return;
  }

  if (/\d/.test(name)) {
    showToast("教師姓名不可包含數字");
    return;
  }

  if (!validateEmail(email)) {
    showToast("Email 格式錯誤，例如 teacher@gmail.com");
    return;
  }

  if (!validateTaiwanPhone(phone)) {
    showToast("電話格式錯誤，請輸入 09 開頭共 10 碼");
    return;
  }

  const response = await fetch(
    "http://localhost:3000/teachers",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        teacher_id:
          document.getElementById("teacher_id").value,

        name:
          document.getElementById("teacher_name").value,

        gender:
          document.getElementById("teacher_gender").value,

        email:
          document.getElementById("teacher_email").value,

        phone:
          document.getElementById("teacher_phone").value,

        department:
          document.getElementById("teacher_department").value,

        title:
          document.getElementById("teacher_title").value
      })
    }
  );

  const result = await response.json();
  if (!response.ok) {
      showToast(result.message, "danger");
      return;
    }

  showToast(result.message);

  getTeachers();
}

// 查詢教師
function searchTeachers() {

  const keyword =
    document
      .getElementById(
        "teacherSearchInput"
      )
      .value
      .toLowerCase();

  filteredTeachers =
    allTeachers.filter(
      teacher =>

        teacher.name
          .toLowerCase()
          .includes(keyword)

        ||

        teacher.department
          .toLowerCase()
          .includes(keyword)

        ||

        teacher.title
          .toLowerCase()
          .includes(keyword)
    );

  displayTeachers();
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
  const toast = 
    document.getElementById(
      "liveToast"
    );
    
  const toastMessage =
    document.getElementById(
      "toastMessage"
    );

    toast.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning", "text-bg-info");

    if (type === "success") {
      toast.classList.add("text-bg-success");
    } else if (type === "danger") {
      toast.classList.add("text-bg-danger");
    } else if (type === "warning") {
      toast.classList.add("text-bg-warning");
    } else if (type === "info") {
      toast.classList.add("text-bg-info");
    }

  toastMessage.innerText = message;

   const bootstrapToast = new bootstrap.Toast(toast);
   bootstrapToast.show();

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