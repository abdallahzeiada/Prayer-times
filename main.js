document.addEventListener("DOMContentLoaded", function () {
  const today = document.querySelector(".date");
  const citySelect = document.getElementById("city");

  citySelect.addEventListener("change", function () {
    const selectedCity = citySelect.value;
    fetchPrayerTimes(selectedCity);
  });

  // تحديد التاريخ بالتنسيق العربي
  const date = new Date();
  today.innerHTML = `اليوم: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  // تحميل مواقيت الصلاة للمدينة الافتراضية (القاهرة) عند تحميل الصفحة
  fetchPrayerTimes(citySelect.value);
});

function fetchPrayerTimes(city) {
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Egypt&method=5`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const timings = data.data.timings;
      displayPrayerTimes(timings);
    })
    .catch((error) => {
      console.error("حدث خطأ أثناء جلب مواقيت الصلاة:", error);
      document.getElementById("prayerTimes").innerHTML = `<p>فشل تحميل مواقيت الصلاة. يرجى المحاولة لاحقًا.</p>`;
    });
}

function convertTo12Hour(time24) {
  const [hour, minute] = time24.split(":");
  let period = "صباحًا";
  let hour12 = parseInt(hour, 10);

  if (hour12 >= 12) {
    period = "مساءً";
    if (hour12 > 12) {
      hour12 -= 12;
    }
  } else if (hour12 === 0) {
    hour12 = 12; // تحويل منتصف الليل (00:00)
  }

  return `${hour12}:${minute} ${period}`;
}

function displayPrayerTimes(timings) {
  const prayerNames = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  };

  const prayerTimesDiv = document.getElementById("prayerTimes");
  prayerTimesDiv.innerHTML = `
      <p><strong>${prayerNames.Fajr}:</strong> ${convertTo12Hour(timings.Fajr)}</p>
      <p><strong>${prayerNames.Dhuhr}:</strong> ${convertTo12Hour(timings.Dhuhr)}</p>
      <p><strong>${prayerNames.Asr}:</strong> ${convertTo12Hour(timings.Asr)}</p>
      <p><strong>${prayerNames.Maghrib}:</strong> ${convertTo12Hour(timings.Maghrib)}</p>
      <p><strong>${prayerNames.Isha}:</strong> ${convertTo12Hour(timings.Isha)}</p>
    `;
}
