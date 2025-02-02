document.addEventListener('DOMContentLoaded', function () {
    const citySelect = document.getElementById('city');
    citySelect.addEventListener('change', function () {
      const selectedCity = citySelect.value;
      fetchPrayerTimes(selectedCity);
    });
  
    // Load prayer times for the default city (Cairo) on page load
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
        console.error('Error fetching prayer times:', error);
        document.getElementById('prayerTimes').innerHTML = `<p>Failed to load prayer times. Please try again later.</p>`;
      });
  }
  
  function convertTo12Hour(time24) {
    const [hour, minute] = time24.split(':');
    let period = 'AM';
    let hour12 = parseInt(hour, 10);
  
    if (hour12 >= 12) {
      period = 'PM';
      if (hour12 > 12) {
        hour12 -= 12;
      }
    } else if (hour12 === 0) {
      hour12 = 12; // Handle midnight (00:00)
    }
  
    return `${hour12}:${minute} ${period}`;
  }
  
  function displayPrayerTimes(timings) {
    const prayerTimesDiv = document.getElementById('prayerTimes');
    prayerTimesDiv.innerHTML = `
      <p><strong>Fajr:</strong> ${convertTo12Hour(timings.Fajr)}</p>
      <p><strong>Dhuhr:</strong> ${convertTo12Hour(timings.Dhuhr)}</p>
      <p><strong>Asr:</strong> ${convertTo12Hour(timings.Asr)}</p>
      <p><strong>Maghrib:</strong> ${convertTo12Hour(timings.Maghrib)}</p>
      <p><strong>Isha:</strong> ${convertTo12Hour(timings.Isha)}</p>
    `;
  }