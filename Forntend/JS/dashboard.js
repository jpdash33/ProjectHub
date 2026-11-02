let allProjects = [];

async function get_data() {
    try {
        const result = await eel.projects()();

        if (result.status === 200) {
            // Update dashboard counts
            document.getElementById("total-count").textContent = result.tot;
            document.getElementById("complete-count").textContent = result.complete;
            document.getElementById("processing-count").textContent = result.processing;
            document.getElementById("pending-count").textContent = result.pending;

            // Store projects globally so update() can access them
            allProjects = result.all;

            let rows = "";

            allProjects.forEach((project, index) => {
                const statusClass =
                    project.Status === "complete" ? "status-complete" :
                        project.Status === "processing" ? "status-processing" :
                            project.Status === "pending" ? "status-pending" : "";

                const statusText =
                    project.Status === "complete" ? "Completed" :
                        project.Status === "processing" ? "Processing" :
                            project.Status === "pending" ? "Pending" :
                                project.Status;

                rows += `
                    <tr>
                        <td>${project.Project}</td>
                        <td>${project.Desc}</td>

                        <td>
                            <span class="project-status ${statusClass}">
                                ${statusText}
                            </span>
                        </td>

                        <td>
                            <div class="project-actions">
                                <button
                                    type="button"
                                    onclick="update(${index})"
                                    class="action-btn edit-btn"
                                    title="Update project"
                                    aria-label="Update project">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>

                                <button
                                    type="button"
                                    onclick="remove(${index})"
                                    class="action-btn delete-btn"
                                    title="Delete project"
                                    aria-label="Delete project">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            document.getElementById("search_results").innerHTML = rows;
        }
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

get_data();


let selectedIndex = null;

function update(index) {
    selectedIndex = index;

    const project = allProjects[index];

    if (!project) {
        alert("Project not found!");
        return;
    }

    document.getElementById("edit-name").value = project.Project;
    document.getElementById("edit-desc").value = project.Desc;
    document.getElementById("edit-status").value = project.Status;

    document.getElementById("update-modal").style.display = "flex";
}

function closeUpdate() {
    document.getElementById("update-modal").style.display = "none";
    selectedIndex = null;
}

async function saveUpdate() {
    if (selectedIndex === null) return;

    const updatedProject = {
        Project: document.getElementById("edit-name").value.trim(),
        Desc: document.getElementById("edit-desc").value.trim(),
        Status: document.getElementById("edit-status").value
    };

    if (!updatedProject.Project || !updatedProject.Desc) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const result = await eel.savechange(
            selectedIndex,
            updatedProject.Project,
            updatedProject.Desc,
            updatedProject.Status
        )();

        if (result.status === 200) {
            alert("Update complete!");

            closeUpdate();

            // Reload JSON data and refresh the dashboard
            await get_data();
        } else {
            alert(result.message || "Something went wrong.");
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Unable to update the project.");
    }
}

async function remove(index) {
    const project = allProjects[index];

    if (!project) {
        alert("Project not found!");
        return;
    }

    const r_pass = prompt(
        `Delete "${project.Project}"?\nEnter your password:`
    );

    if (r_pass === null) return;

    if (r_pass.trim() === "") {
        alert("Password cannot be empty!");
        return;
    }

    try {
        const result = await eel.remove(r_pass, index)();

        if(result.code === 200) {
            showDeleteToast(result.project);
            await get_data();
        }
        else if (result.code === 401) {
            alert("Wrong password!");
        }
        else {
            alert(result.message || "Unable to delete project.");
        }
    } 
    catch (error) {
        console.error("Delete error:", error);
        alert("Something went wrong!");
    }
}





let deleteToastTimer;

function showDeleteToast(projectName) {
    const toast = document.getElementById("delete-toast");
    const message = document.getElementById("delete-toast-message");

    message.textContent = `"${projectName}" removed successfully.`;

    // Show the popup
    toast.classList.add("show");

    // Reset timer if another deletion happens
    clearTimeout(deleteToastTimer);

    // Hide after 3 seconds
    deleteToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}