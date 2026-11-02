const check = localStorage.getItem("manager");

if (check) {
    window.location.href = "home.html";

}
else {
    document.getElementById("name").focus();

}



async function login() {

    const user = document.getElementById("name").value.trim();
    const mail = document.getElementById("mail").value.trim();
    const pass = document.getElementById("pass").value.trim();
    const con_pass = document.getElementById("c_pass").value.trim();


    if (!user || !mail || !pass || !con_pass) {
        alert("Please fill in all fields.");
        return;
    }


    const userPattern = /^[a-zA-Z0-9_]{3,20}$/;

    if (!userPattern.test(user)) {
        alert("Username must be 3-20 characters and contain only letters, numbers, or underscores.");
        document.getElementById("name").focus();
        return;
    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(mail)) {
        alert("Please enter a valid email address.");
        document.getElementById("mail").focus();
        return;
    }


    if (pass.length < 8) {
        alert("Password must contain at least 8 characters.");
        document.getElementById("pass").focus();
        return;
    }


    if (pass !== con_pass) {
        alert("Passwords do not match. Please try again.");

        document.getElementById("pass").value = "";
        document.getElementById("c_pass").value = "";
        document.getElementById("pass").focus();

        return;
    }


    const result = await eel.login(user, mail, pass)();

    if (result["status"] === 200) {
        localStorage.setItem("manager", user);
        window.location.href = "home.html";
    }



}

function cancel() {
    document.getElementById("name").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("pass").value = "";
    document.getElementById("c_pass").value = "";

    document.getElementById("name").focus();
}



const fields = ["name", "mail", "pass", "c_pass"];

fields.forEach((id, index) => {
    document.getElementById(id).addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            if (index < fields.length - 1) {
                document.getElementById(fields[index + 1]).focus();
            } else {
                login();
            }
        }
    });
});
