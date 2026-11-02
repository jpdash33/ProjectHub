
document.getElementById("p_name").focus();

let toastTimer;

function showSuccessToast() {
    const toast = document.getElementById("success-toast");

    clearTimeout(toastTimer);
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

async function load() {
    const pname = document.getElementById("p_name").value.trim();
    const desc = document.getElementById("p_desc").value.trim();
    const status = document.getElementById("Status").value;

    if (!pname || !desc || !status) {
        alert("Please fill the form first.");
        return;
    }

    try {
        const result = await eel.load(pname, desc, status)();

        if (result["status"] === 200) {
            showSuccessToast();

            document.getElementById("p_name").value = "";
            document.getElementById("p_desc").value = "";
            document.getElementById("Status").value = "processing";

            document.getElementById("p_name").focus();
            return;
        }

        alert("Could not add the project. Please try again.");

    } catch (error) {
        console.error("ERROR:", error);
        alert("Something went wrong.");
    }
}

function cancel() {
    document.getElementById("p_name").value = "";
    document.getElementById("p_desc").value = "";
    document.getElementById("Status").value = "processing";
    document.getElementById("p_name").focus();
}






const pname = document.getElementById("p_name");
const desc = document.getElementById("p_desc");
const status = document.getElementById("Status");

pname.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        desc.focus();
    }
});

desc.addEventListener("keydown", function (event) {
    // Press Enter to move to the dropdown.
    // Use Shift + Enter for a new line.
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        status.focus();
    }
});

status.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector(".btn-add").focus();
    }
});
