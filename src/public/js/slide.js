// header.js - File này xuất cấu hình cho header slider
function getHeaderSliderSettings() {
  // Lấy cấu hình từ localStorage
  const savedSettings = localStorage.getItem("headerSliderSettings");

  // Cấu hình mặc định
  let settings = {
    animationType: "slide",
    autoPlay: true,
    speed: 3000,
    transitionDuration: 500,
  };

  // Nếu có cấu hình đã lưu, sử dụng cấu hình đó
  if (savedSettings) {
    settings = JSON.parse(savedSettings);
  }

  return settings;
}

// Hàm tạo slider header
function createHeaderSlider(containerId) {
  // Lấy phần tử chứa
  const container = document.getElementById(containerId);
  if (!container) return;

  // Lấy cấu hình
  const settings = getHeaderSliderSettings();

  // Tạo HTML cho slider
  container.innerHTML = `
        <div class="slider">
            <div class="slide" ;  background-blend-mode: overlay;"><img src="/img/header-1.jpg" alt="" class="img-fluid rounded-top"></div>
            <div class="slide" ; background-blend-mode: overlay;"><img src="/img/header-2.jpg" alt="" class="img-fluid rounded-top"></div>
            <div class="slide" ; background-blend-mode: overlay;"><img src="/img/header-3.jpg" alt="" class="img-fluid rounded-top"></div>
            <div class="slide" ; background-blend-mode: overlay;"><img src="/img/header-4.jpg" alt="" class="img-fluid rounded-top"></div>
            <div class="slide" ; background-blend-mode: overlay;"><img src="/img/header-5.jpg" alt="" class="img-fluid rounded-top"></div>
        </div>

        <div class="controls">
            <button class="control-btn prev">❮</button>
            <button class="control-btn next">❯</button>
        </div>

        <div class="dots-container"></div>
    `;

  const slider = container.querySelector(".slider");
  const slides = container.querySelectorAll(".slide");
  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");
  const dotsContainer = container.querySelector(".dots-container");

  // Trạng thái
  let currentIndex = 0;
  let autoPlayInterval;

  // Khởi tạo các chấm chỉ báo
  function createDots() {
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Chuyển đến slide cụ thể
  function goToSlide(index) {
    const dots = container.querySelectorAll(".dot");

    // Xóa lớp active khỏi tất cả các chấm
    dots.forEach((dot) => dot.classList.remove("active"));

    // Thêm lớp active vào chấm hiện tại
    dots[index].classList.add("active");

    currentIndex = index;

    // Áp dụng hiệu ứng dựa vào loại đã cấu hình
    if (settings.animationType === "slide") {
      // Hiệu ứng trượt
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else if (settings.animationType === "fade") {
      // Hiệu ứng mờ dần
      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.style.opacity = 1;
          slide.style.zIndex = 1;
        } else {
          slide.style.opacity = 0;
          slide.style.zIndex = 0;
        }
      });
    } else if (settings.animationType === "zoom") {
      // Hiệu ứng phóng to
      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.style.opacity = 1;
          slide.style.transform = "scale(1)";
          slide.style.zIndex = 1;
        } else {
          slide.style.opacity = 0;
          slide.style.transform = "scale(0.8)";
          slide.style.zIndex = 0;
        }
      });
    }
  }

  // Chuyển đến slide tiếp theo
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }

  // Chuyển đến slide trước đó
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
  }

  // Thiết lập các hiệu ứng và thuộc tính theo cấu hình
  function applySettings() {
    // Thiết lập loại hiệu ứng
    slides.forEach((slide) => {
      slide.style.transition = `all ${settings.transitionDuration}ms ease-in-out`;

      if (settings.animationType === "slide") {
        slide.style.opacity = 1;
        slide.style.transform = "scale(1)";
        slide.style.position = "relative";
        slider.style.transition = `transform ${settings.transitionDuration}ms ease-in-out`;
      } else if (settings.animationType === "fade") {
        slide.style.opacity = 0;
        slide.style.position = "absolute";
        slide.style.transform = "scale(1)";
        slider.style.transition = "none";
      } else if (settings.animationType === "zoom") {
        slide.style.opacity = 0;
        slide.style.transform = "scale(0.8)";
        slide.style.position = "absolute";
        slider.style.transition = "none";
      }
    });

    // Thiết lập tự động phát
    if (settings.autoPlay) {
      autoPlayInterval = setInterval(nextSlide, settings.speed);
    }
  }

  // Sự kiện xử lý
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Tạm dừng tự động chuyển khi di chuột vào slider
  container.addEventListener("mouseenter", () => {
    if (settings.autoPlay) {
      clearInterval(autoPlayInterval);
    }
  });

  // Tiếp tục tự động chuyển khi di chuột ra khỏi slider
  container.addEventListener("mouseleave", () => {
    if (settings.autoPlay) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, settings.speed);
    }
  });

  // Khởi tạo
  createDots();
  applySettings();
  goToSlide(0);
}
