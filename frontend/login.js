// login.js

// 已登入就直接進首頁
const token = localStorage.removeItem("token");

if (token) {
  window.location.href = "index.html";
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
// 登入
async function login() {

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value.trim();


  // 基本驗證
  if (!username || !password) {

    showToast("請輸入帳號密碼", "danger");

    return;
}
  try {

    const response = await fetch(
      "http://localhost:3000/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );


    const result = await response.json();
    // 登入失敗
    if (!response.ok) {

      showToast(result.message || "登入失敗", "danger");

      return;

    }


    // 儲存 token
    localStorage.setItem(
      "token",
      result.token
    );


    showToast("登入成功", "success");
    setTimeout(() => {
    window.location.replace("login.html");
  }, 500);


    // 導向首頁
    window.location.href = "index.html";
     }catch (error) {

    console.log(error);
    
    showToast("無法連接伺服器", "danger");
    }
}



