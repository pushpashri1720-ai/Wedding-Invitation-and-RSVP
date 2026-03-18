document.addEventListener("DOMContentLoaded", function () {
  function goToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw4Dnl_iTdtYc8U0zCOixyh5VVkFcT90LKdg3WhrIwx_G_aEG6Le5RhThsAaCY0tdxb-g/exec";

  const rsvpBtn = document.getElementById("rsvpBtn");
  const viewDetailsBtn = document.getElementById("viewDetailsBtn");
  const submitRsvpBtn = document.getElementById("submitRsvpBtn");
  const backButtons = document.querySelectorAll(".back-to-top-btn");

  const attending = document.getElementById("attending");
  const extraQuestions = document.getElementById("extraQuestions");

  const comingWithYou = document.getElementById("comingWithYou");
  const guestCountBlock = document.getElementById("guestCountBlock");
  const guests = document.getElementById("guests");
  const guestNamesBlock = document.getElementById("guestNamesBlock");

  const accommodation = document.getElementById("accommodation");
  const arrivalBlock = document.getElementById("arrivalBlock");

  function resetGuestSection() {
    if (comingWithYou) {
      comingWithYou.value = "";
    }

    if (guests) {
      guests.value = "";
    }

    guestCountBlock.classList.remove("show");
    guestNamesBlock.classList.remove("show");
    guestNamesBlock.innerHTML = "";
  }

  function renderGuestNameFields(count) {
    guestNamesBlock.innerHTML = "";

    if (!count || Number(count) < 1) {
      guestNamesBlock.classList.remove("show");
      return;
    }

    for (let i = 1; i <= Number(count); i++) {
      const label = document.createElement("label");
      label.setAttribute("for", `guestName${i}`);
      label.textContent = `Guest ${i} Name *`;

      const input = document.createElement("input");
      input.type = "text";
      input.id = `guestName${i}`;
      input.placeholder = `Enter guest ${i} name`;

      guestNamesBlock.appendChild(label);
      guestNamesBlock.appendChild(input);
    }

    guestNamesBlock.classList.add("show");
  }

  if (rsvpBtn) {
    rsvpBtn.addEventListener("click", function () {
      goToSection("rsvp");
    });
  }

  if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goToSection("schedule");
    });
  }

  backButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      goToSection("home");
    });
  });

  if (attending) {
    attending.addEventListener("change", function () {
      const value = attending.value;

      if (value === "Yes" || value === "Maybe") {
        extraQuestions.classList.add("show");
      } else {
        extraQuestions.classList.remove("show");
        arrivalBlock.classList.remove("show");
        resetGuestSection();
        if (accommodation) {
          accommodation.value = "";
        }
        document.getElementById("arrival").value = "";
      }
    });
  }

  if (comingWithYou) {
    comingWithYou.addEventListener("change", function () {
      if (comingWithYou.value === "Yes") {
        guestCountBlock.classList.add("show");
      } else {
        if (guests) {
          guests.value = "";
        }
        guestCountBlock.classList.remove("show");
        guestNamesBlock.classList.remove("show");
        guestNamesBlock.innerHTML = "";
      }
    });
  }

  if (guests) {
    guests.addEventListener("change", function () {
      renderGuestNameFields(guests.value);
    });
  }

  if (accommodation) {
    accommodation.addEventListener("change", function () {
      if (accommodation.value === "Yes") {
        arrivalBlock.classList.add("show");
      } else {
        arrivalBlock.classList.remove("show");
        document.getElementById("arrival").value = "";
      }
    });
  }

  if (submitRsvpBtn) {
    submitRsvpBtn.addEventListener("click", async function () {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const attendingValue = attending.value;
      const comingWithYouValue = comingWithYou.value;
      const guestCountValue = guests.value;
      const accommodationValue = accommodation.value;
      const arrival = document.getElementById("arrival").value.trim();
      const message = document.getElementById("rsvpMessage");

      message.textContent = "";

      if (!name) {
        message.textContent = "Please enter your name.";
        return;
      }

      if (!email) {
        message.textContent = "Please enter your email.";
        return;
      }

      if (!attendingValue) {
        message.textContent = "Please select attending option.";
        return;
      }

      let guestNames = [];

      if (attendingValue === "Yes" || attendingValue === "Maybe") {
        if (!comingWithYouValue) {
          message.textContent = "Please select if anyone is coming with you.";
          return;
        }

        if (comingWithYouValue === "Yes") {
          if (!guestCountValue) {
            message.textContent = "Please select number of guests.";
            return;
          }

          for (let i = 1; i <= Number(guestCountValue); i++) {
            const guestInput = document.getElementById(`guestName${i}`);
            const guestName = guestInput ? guestInput.value.trim() : "";

            if (!guestName) {
              message.textContent = `Please enter guest ${i} name.`;
              return;
            }

            guestNames.push(guestName);
          }
        }

        if (!accommodationValue) {
          message.textContent = "Please select accommodation option.";
          return;
        }

        if (accommodationValue === "Yes" && !arrival) {
          message.textContent = "Please select your arrival date and time.";
          return;
        }
      }

  const formData = {
  name: name.trim(),
  email: email.trim().toLowerCase(),
  attending: attendingValue,
  comingWithYou: comingWithYouValue,
  guests: guestCountValue,
  guestNames: guestNames.join(", "),
  accommodation: accommodationValue,
  arrival: arrival
};

     try {
  message.textContent = "Submitting RSVP...";

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(formData)
  });

const result = await response.json();

if (result.status === "UPDATED") {
  message.textContent = "Your RSVP has been updated successfully.";
} else if (result.status === "CREATED") {
  message.innerHTML = "Thank you! Your RSVP has been successfully submitted!! <br> If you need to update your information, please submit the form again using the same name and email address you provided earlier.";} else {
  message.textContent = "Something went wrong. Please try again.";
  return;
}

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  attending.value = "";
  resetGuestSection();
  accommodation.value = "";
  document.getElementById("arrival").value = "";

  extraQuestions.classList.remove("show");
  arrivalBlock.classList.remove("show");
} catch (error) {
  message.textContent = "Something went wrong. Please try again.";
  console.error(error);
}
    });
  }
});