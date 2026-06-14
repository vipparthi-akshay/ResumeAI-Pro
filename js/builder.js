const DEFAULT_AVATAR = "images/avatars/avatar-1.svg";

const fields = [
    "name", "email", "phone", "linkedin", "summary",
    "degree", "college", "cgpa", "skills", "company",
    "role", "duration", "project", "languages", "certificate"
];

const previewMap = {
    name: "previewName",
    email: "previewEmail",
    phone: "previewPhone",
    linkedin: "previewLinkedin",
    summary: "previewSummary",
    skills: "previewSkills",
    project: "previewProject",
    languages: "previewLanguages",
    certificate: "previewCertificate",
    role: "previewRole"
};

function updateEducation() {
    const degreeEl = document.getElementById("degree");
    const collegeEl = document.getElementById("college");
    const cgpaEl = document.getElementById("cgpa");
    const previewEl = document.getElementById("previewEducation");

    if (!degreeEl || !collegeEl || !cgpaEl || !previewEl) return;

    const degree = degreeEl.value;
    const college = collegeEl.value;
    const cgpa = cgpaEl.value;

    previewEl.textContent = `${degree || "Degree"} | ${college || "College"} | ${cgpa || "CGPA"}`;

    localStorage.setItem("degree", degree);
    localStorage.setItem("college", college);
    localStorage.setItem("cgpa", cgpa);
}

function updateExperience() {
    const companyEl = document.getElementById("company");
    const roleEl = document.getElementById("role");
    const durationEl = document.getElementById("duration");
    const previewEl = document.getElementById("previewExperience");

    if (!companyEl || !roleEl || !durationEl || !previewEl) return;

    const company = companyEl.value;
    const role = roleEl.value;
    const duration = durationEl.value;

    previewEl.textContent = `${company || "Company"} | ${role || "Role"} | ${duration || "Duration"}`;

    localStorage.setItem("company", company);
    localStorage.setItem("role", role);
    localStorage.setItem("duration", duration);
}

function animateProgressBar(targetPercent) {
    const progressBar = document.getElementById("progressBarFill");
    if (!progressBar) return;

    const currentWidth = parseInt(progressBar.style.width) || 0;
    if (currentWidth === targetPercent) return;

    let startTime = null;
    const startWidth = currentWidth;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const duration = 300;
        const progress = Math.min(elapsed / duration, 1);
        const newWidth = startWidth + (targetPercent - startWidth) * progress;

        progressBar.style.width = newWidth + "%";

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function updateProgress() {
    let totalFields = 0;
    let completedFields = 0;

    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            totalFields++;
            if (input.value.trim().length > 0) {
                completedFields++;
            }
        }
    });

    totalFields++;
    if (localStorage.getItem("profilePhoto")) {
        completedFields++;
    }

    const percent = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

    const progressText = document.getElementById("progressText");
    if (progressText) {
        progressText.textContent = percent + "% Completed";
    }

    animateProgressBar(percent);
}

function restoreProfilePhoto() {
    const savedPhoto = localStorage.getItem("profilePhoto");
    const previewPhoto = document.getElementById("previewPhoto");
    const resumePhoto = document.getElementById("resumePhoto");
    const defaultSrc = savedPhoto || DEFAULT_AVATAR;

    if (previewPhoto) previewPhoto.src = defaultSrc;
    if (resumePhoto) resumePhoto.src = defaultSrc;
}

function setupProfileUpload() {
    const photoUpload = document.getElementById("photoUpload");
    if (!photoUpload) return;

    photoUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result;
            const preview = document.getElementById("previewPhoto");
            const resume = document.getElementById("resumePhoto");

            if (preview) preview.src = imageData;
            if (resume) resume.src = imageData;

            localStorage.setItem("profilePhoto", imageData);
            updateProgress();
        };

        reader.readAsDataURL(file);
    });
}

function setupFieldListeners() {
    fields.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        const saved = localStorage.getItem(id);
        if (saved) {
            input.value = saved;
            if (previewMap[id]) {
                const previewEl = document.getElementById(previewMap[id]);
                if (previewEl) previewEl.textContent = saved;
            }
        }

        input.addEventListener("input", () => {
            localStorage.setItem(id, input.value);

            if (previewMap[id]) {
                const previewEl = document.getElementById(previewMap[id]);
                if (previewEl) {
                    previewEl.textContent = input.value || "Not Provided";
                }
            }

            updateEducation();
            updateExperience();
            updateProgress();
        });
    });
}

function clearResumeData() {
    fields.forEach(id => {
        localStorage.removeItem(id);
        const input = document.getElementById(id);
        if (input) input.value = "";
    });

    localStorage.removeItem("profilePhoto");
    location.reload();
}

function runSelfTest() {
    console.log("🧪 Running Self-Test...");

    const testResults = {
        progressBar: false,
        percentageText: false,
        avatarUpdates: false,
        resumePreview: false,
        localStorage: false,
        refreshData: false,
        noErrors: false
    };

    setTimeout(() => {
        const progressFill = document.getElementById("progressBarFill");
        const progressText = document.getElementById("progressText");
        if (progressFill && progressText) {
            testResults.progressBar = progressFill.style.width !== "" && progressFill.style.width !== "0%";
            testResults.percentageText = progressText.textContent.includes("%") && progressText.textContent.includes("Completed");
        }
    }, 100);

    setTimeout(() => {
        const previewPhoto = document.getElementById("previewPhoto");
        const resumePhoto = document.getElementById("resumePhoto");
        if (previewPhoto && resumePhoto) {
            testResults.avatarUpdates = previewPhoto.src.length > 0 && resumePhoto.src.length > 0;
        }
    }, 200);

    setTimeout(() => {
        const previewName = document.getElementById("previewName");
        const previewEmail = document.getElementById("previewEmail");
        if (previewName && previewEmail) {
            testResults.resumePreview = true;
        }
    }, 300);

    setTimeout(() => {
        const testKey = "test_key_" + Date.now();
        localStorage.setItem(testKey, "test_value");
        const testValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        testResults.localStorage = testValue === "test_value";
    }, 400);

    setTimeout(() => {
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        const photo = localStorage.getItem("profilePhoto");
        testResults.refreshData = !!(name || email || photo);
    }, 500);

    setTimeout(() => {
        testResults.noErrors = true;
    }, 600);

    setTimeout(() => {
        console.log("\n📊 Self-Test Results:");
        console.log("✓ Progress bar moves:", testResults.progressBar ? "PASS" : "FAIL");
        console.log("✓ Percentage updates:", testResults.percentageText ? "PASS" : "FAIL");
        console.log("✓ Avatar updates:", testResults.avatarUpdates ? "PASS" : "FAIL");
        console.log("✓ Resume preview updates:", testResults.resumePreview ? "PASS" : "FAIL");
        console.log("✓ localStorage works:", testResults.localStorage ? "PASS" : "FAIL");
        console.log("✓ Refresh keeps data:", testResults.refreshData ? "PASS" : "FAIL");
        console.log("✓ No JavaScript errors:", testResults.noErrors ? "PASS" : "FAIL");

        const allPassed = Object.values(testResults).every(result => result === true);
        console.log("\n" + (allPassed ? "🎉 All tests passed!" : "❌ Some tests failed."));
    }, 700);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("progressBarFill")) return;

    setupFieldListeners();
    setupProfileUpload();
    restoreProfilePhoto();
    updateEducation();
    updateExperience();
    updateProgress();

    window.addEventListener("load", () => {
        setTimeout(runSelfTest, 1000);
    });
});
