let menu = document.querySelector("#menu-btn");
let navbar = document.querySelector(".navbar");

if (menu && navbar) {
  menu.onclick = () => {
    menu.classList.toggle("fa-times");
    navbar.classList.toggle("active");
  };
}

const loginBtn = document.querySelector("#login-btn");
if (loginBtn) {
  loginBtn.onclick = () => {
    document.querySelector(".login-form-container").classList.toggle("active");
  };
}

// Check if the login icon button exists and add click handler for mobile
const loginIconBtn = document.querySelector("#auth-btn .login-icon-btn");
if (loginIconBtn) {
  loginIconBtn.addEventListener('click', () => {
    // Redirect to login page
    window.location.href = '/login';
  });
}

// For authenticated users, we may need to handle the user dropdown differently on mobile
// The dropdown functionality is handled by Bootstrap, so we don't need additional JS for that

const closeLoginFormBtn = document.querySelector("#close-login-form");
if (closeLoginFormBtn) {
  closeLoginFormBtn.onclick = () => {
    document.querySelector(".login-form-container").classList.remove("active");
  };
}

window.onscroll = () => {
  if (menu && navbar) {
    menu.classList.remove("fa-times");
    navbar.classList.remove("active");
  }

  const header = document.querySelector(".header");
  if (header) {
    if (window.scrollY > 0) {
      header.classList.add("active");
    } else {
      header.classList.remove("active");
    }

    // Additional functionality for navbar shrinking
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
};

const homeElement = document.querySelector(".home");
if (homeElement) {
  homeElement.onmousemove = (e) => {
    document.querySelectorAll(".home-parallax").forEach((elm) => {
      let speed = elm.getAttribute("data-speed");

      let x = (window.innerWidth - e.pageX * speed) / 90;
      let y = (window.innerHeight - e.pageY * speed) / 90;

      elm.style.transform = `translateX(${y}px) translateY(${x}px)`;
    });
  };

  homeElement.onmouseleave = (e) => {
    document.querySelectorAll(".home-parallax").forEach((elm) => {
      elm.style.transform = `translateX(0px) translateY(0px)`;
    });
  };
}



// MODAL BOX
document.addEventListener("DOMContentLoaded", function () {
  var motorDetailModal = document.getElementById("motorDetailModal");
  if (motorDetailModal) {
    motorDetailModal.addEventListener("show.bs.modal", function (event) {
      // Tombol yang klik modal
      var button = event.relatedTarget;

      // Ekstrak informasi dari atribut data-*
      var motorName = button.getAttribute("data-motor-name");
      var motorPriceValue = button.getAttribute("data-motor-price-value");
      var motorImage = button.getAttribute("data-motor-image");
      // motorDetailsHtml adalah untuk ringkasan di kartu, kita akan gunakan motorSpecificationsHtml untuk modal
      var motorSpecificationsHtml = button.getAttribute(
        "data-motor-specifications-html"
      );

      // Update konten modal
      var modalTitle = motorDetailModal.querySelector(".modal-title");
      var modalMotorImageEl =
        motorDetailModal.querySelector("#modalMotorImage");
      var modalMotorNameEl = motorDetailModal.querySelector("#modalMotorName");
      var modalMotorPriceSpan = motorDetailModal.querySelector(
        "#modalMotorPrice span"
      );
      var modalMotorDetailsP =
        motorDetailModal.querySelector("#modalMotorDetails");
      var modalMotorDetailsFullDiv = motorDetailModal.querySelector(
        "#modalMotorDetailsFull"
      );

      if (modalTitle) modalTitle.textContent = motorName || "Detail Motor";
      if (modalMotorImageEl)
        modalMotorImageEl.src = motorImage || "assets/icon/logo-trans.webp";
      if (modalMotorNameEl)
        modalMotorNameEl.textContent = motorName || "Nama Tidak Tersedia";
      if (modalMotorPriceSpan)
        modalMotorPriceSpan.textContent = motorPriceValue || "N/A";

      if (modalMotorDetailsP && modalMotorDetailsFullDiv) {
        if (motorSpecificationsHtml && motorSpecificationsHtml.trim() !== "") {
          modalMotorDetailsP.innerHTML = motorSpecificationsHtml;
          modalMotorDetailsFullDiv.style.display = "block";
        } else {
          modalMotorDetailsP.innerHTML = "Spesifikasi lengkap tidak tersedia.";
          modalMotorDetailsFullDiv.style.display = "block";
        }
      }
    });
  }
});

// FORMSPREE
var form = document.getElementById("contactForm");

if (form) {
  async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("contactFormStatus");
    var data = new FormData(event.target);
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          if (status) {
            status.innerHTML = "Terima kasih! Pesan Anda telah terkirim.";
          }
          form.reset();
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              if (status) {
                status.innerHTML = data["errors"]
                  .map((error) => error["message"])
                  .join(", ");
              }
            } else {
              if (status) {
                status.innerHTML =
                  "Oops! Terjadi masalah saat mengirim formulir Anda.";
              }
            }
          });
        }
      })
      .catch((error) => {
        if (status) {
          status.innerHTML = "Oops! Terjadi masalah saat mengirim formulir Anda.";
        }
      });
  }
  form.addEventListener("submit", handleSubmit);
}
