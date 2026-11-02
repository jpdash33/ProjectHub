async function search() {
    const input = document.getElementById("search");
    const item = input.value.trim();

    if (!item) {
        alert("Please enter a project name.");
        input.focus();
        return;
    }

    try {
        const result = await eel.search(item)();

        if (result.code === 200) {
            // Find the matching row in the dashboard
            const rows = document.querySelectorAll("#search_results tr");
            const row = rows[result.index];

            if (row) {
                // Remove previous highlights
                rows.forEach(r => r.classList.remove("search-highlight"));

                // Highlight and focus the matching row
                row.classList.add("search-highlight");

                row.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                row.setAttribute("tabindex", "-1");
                row.focus({ preventScroll: true });
            } else {
                alert("Project found, but its row is not currently displayed.");
            }
        } else if (result.code === 404) {
            alert(`No project named "${item}" was found.`);
            input.focus();
        } else {
            alert("Unable to read project data.");
        }
    } catch (error) {
        console.error("Search error:", error);
        alert("Something went wrong while searching.");
    }
}