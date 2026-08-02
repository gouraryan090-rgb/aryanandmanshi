/* ==========================================
            AUTH CHECK
========================================== */

if(sessionStorage.getItem("websiteUnlocked") !== "true"){

    if(!window.location.pathname.endsWith("password.html")){

        if(window.location.pathname.includes("/pages/")){

            window.location.href = "../password.html";

        }else{

            window.location.href = "password.html";

        }

    }

}