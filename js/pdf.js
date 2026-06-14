// PDF generation functionality
class PDFGenerator {
    constructor() {
        this.setupPDFButton();
    }

    downloadPDF() {
        const resume = document.getElementById("resume") || document.querySelector(".resume");
        if (!resume) {
            alert("No resume found to export.");
            return;
        }

        if (typeof html2pdf === "undefined") {
            alert("PDF library is loading. Please try again in a moment.");
            return;
        }

        const options = {
            margin: 0.5,
            filename: "ResumeAI-Pro.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(options).from(resume).save();
    }

    setupPDFButton() {
        const pdfBtn = document.getElementById("pdfBtn");
        if (pdfBtn) {
            pdfBtn.addEventListener("click", () => this.downloadPDF());
        }
    }
}
