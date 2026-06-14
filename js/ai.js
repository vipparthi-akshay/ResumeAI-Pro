// AI Content Generator
const aiSummary = document.getElementById("generateSummary");

if (aiSummary) {
    aiSummary.addEventListener("click", () => {
        const summaries = [
            "Motivated Computer Science student with strong analytical, communication and problem-solving skills. Passionate about building modern web applications using HTML, CSS and JavaScript while continuously learning emerging technologies and best development practices.",
            "Dynamic software engineer with 3+ years of experience in developing scalable web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of delivering high-quality code and meeting project deadlines.",
            "Results-driven professional with a background in data analysis and machine learning. Skilled in Python, SQL, and data visualization tools. Committed to leveraging technology to drive business growth and innovation."
        ];

        const summary = summaries[Math.floor(Math.random() * summaries.length)];
        const summaryInput = document.getElementById("summary");
        const previewSummary = document.getElementById("previewSummary");

        if (summaryInput) summaryInput.value = summary;
        if (previewSummary) previewSummary.textContent = summary;
        localStorage.setItem("summary", summary);

        if (typeof updateProgress === "function") {
            updateProgress();
        }
    });
}
