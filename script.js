function showToast(message, iconClass = "fa-circle-check") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid ${iconClass}" style="color: #14b8a6;"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function animateGaugeRing(targetPercent) {
  const gaugeRing = document.getElementById("gauge-ring");
  const completionText = document.getElementById("completion-text");
  let currentPercent = 0;

  if (isNaN(targetPercent) || targetPercent <= 0) {
    completionText.textContent = "0%";
    gaugeRing.style.background = `conic-gradient(#1e293b 0% 100%)`;
    return;
  }

  const timer = setInterval(() => {
    if (currentPercent >= targetPercent) {
      currentPercent = targetPercent;
      clearInterval(timer);
    } else {
      currentPercent++;
    }
    completionText.textContent = `${currentPercent}%`;
    gaugeRing.style.background = `conic-gradient(#0d9488 0% ${currentPercent}%, #1e293b ${currentPercent}% 100%)`;
  }, 12);
}

function updateReportData(data) {
  if (!data) return;

  document.getElementById("doc-type").textContent = data.documentType || "--";
  document.getElementById("doc-no").textContent = data.documentNumber || "--";
  document.getElementById("full-name").textContent = data.fullName || "--";
  document.getElementById("match-score").textContent = data.matchScore ? `${data.matchScore}%` : "--";
  document.getElementById("overall-status").textContent = data.overallStatus || "--";

  if (data.microChecks) {
    document.getElementById("tag-cross").textContent = `• ${data.microChecks.crossReferencing || "--"}`;
    document.getElementById("tag-security").textContent = `• ${data.microChecks.securityFeatures || "--"}`;
    document.getElementById("tag-liveness").textContent = `• ${data.microChecks.livenessDetection || "--"}`;
  }

  const auditContainer = document.getElementById("audit-trail-container");
  if (data.auditTrail && data.auditTrail.length > 0) {
    auditContainer.innerHTML = "";
    data.auditTrail.forEach((item) => {
      const div = document.createElement("div");
      div.className = "audit-item";
      div.innerHTML = `
        <div class="audit-dot"></div>
        <div>
          <strong>${item.step}</strong>
          Completed: ${item.time}
        </div>
      `;
      auditContainer.appendChild(div);
    });
  } else {
    auditContainer.innerHTML = `<div class="empty-trail-text">No recent audit logs.</div>`;
  }

  if (data.completionPercentage) {
    animateGaugeRing(data.completionPercentage);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContentArea = document.getElementById("modal-content-area");
  const modalCloseBtn = document.getElementById("modal-close");
  const zoomableCards = document.querySelectorAll(".zoomable-card");

  function openSquareModal(cardElement) {
    const clonedCard = cardElement.cloneNode(true);
    
    const miniHeader = clonedCard.querySelector(".card-header-mini");
    if (miniHeader) {
      miniHeader.style.display = "none";
    }

    modalContentArea.innerHTML = "";
    modalContentArea.appendChild(clonedCard);
    modalOverlay.classList.add("active");
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
  }

  zoomableCards.forEach((card) => {
    card.addEventListener("click", () => {
      openSquareModal(card);
    });
  });

  modalCloseBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  const pdfBtn = document.getElementById("btn-pdf-download");
  const pdfIcon = document.getElementById("pdf-icon");
  const pdfText = document.getElementById("pdf-text");

  pdfBtn.addEventListener("click", () => {
    pdfIcon.className = "fa-solid fa-spinner fa-spin pdf-icon";
    pdfText.textContent = "Processing...";
    showToast("PDF download action clicked.", "fa-file-pdf");

    setTimeout(() => {
      pdfIcon.className = "fa-solid fa-file-pdf pdf-icon";
      pdfText.textContent = "[Download PDF Report]";
    }, 1000);
  });

  const btnCopyLink = document.getElementById("btn-copy-link");
  const copyInputText = document.getElementById("copy-input-text");

  btnCopyLink.addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      copyInputText.value = window.location.href;
      showToast("Report link copied to clipboard!");

      setTimeout(() => {
        copyInputText.value = "";
      }, 3000);
    });
  });

  const inviteForm = document.getElementById("invite-form");
  const inviteEmail = document.getElementById("invite-email");

  inviteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = inviteEmail.value.trim();
    if (email) {
      showToast(`Invitation sent to ${email}`);
      inviteEmail.value = "";
    }
  });

  const socialIcons = document.querySelectorAll(".social-icon");
  socialIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const platform = icon.getAttribute("data-platform");
      if (platform === "Link") {
        navigator.clipboard.writeText(window.location.href);
        showToast("Report link copied to clipboard!");
      } else {
        showToast(`Opening share options for ${platform}...`, "fa-share-nodes");
      }
    });
  });
});